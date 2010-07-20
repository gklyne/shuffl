/**
 * @fileoverview
 *  jQuery/rdfquery plugin to map between JRON structures and rdfquery databanks 
 * 
 *  See:
 *  http://decentralyze.com/2010/06/04/from-json-to-rdf-in-six-easy-steps-with-jron/
 *  http://code.google.com/p/rdfquery/
 *  http://www.jenitennison.com/rdfquery/
 *  http://www.jenitennison.com/rdfquery/symbols/jQuery.rdf.databank.html
 *  http://code.google.com/p/shuffl/wiki/JRON_implementation_notes
 *  
 * @author Graham Klyne
 * @version $Id: $
 * 
 * Coypyright (C) 2010, University of Oxford
 *
 * Licensed under the MIT License.  You may obtain a copy of the License at:
 *
 *     http://www.opensource.org/licenses/mit-license.php
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Extend the main jQuery object.
 */
jQuery.extend({
    node_fromJRON:
        /**
         * Create an rdfquery node from a supplied JRON value and 
         * rdfquery options
         * 
         * @param jronnode  is a JRON value for a node: a URI, CURIE, 
         *                  bnode or literal
         * @param options   is an rdfquery options structure, in particular
         *                  containing a namespaces member with prefix
         *                  definitions for expanding CURIES
         * @return          an rdfquery node value that can be used to
         *                  construct a triple value, among other things.
         */
        function (jronnode, options)
        {
            if (typeof jronnode == "string")
            {
                return jQuery.rdf.literal('"'+jronnode+'"', options);
            }
            if (typeof jronnode == "object")
            {
                if (jronnode.__iri)
                {
                    // CURIE or URI here
                    // { __iri: ... }
                    var uri = jronnode.__iri;
                    try
                    {
                        // Try for CURIE - more restrictive than JRON proposal
                        curi = jQuery.curie(uri, options);
                        return jQuery.rdf.resource(curi, options);
                    }
                    catch (e)
                    {
                        log.debug("- not CURIE: "+e);
                        return jQuery.rdf.resource("<"+uri+">", options);
                    }
                };
                if (jronnode.__text)
                {
                    // Text literal, with or without language
                    //  { "__text": "chat",
                    //    "__lang": "fr" }
                    var opts = options;
                    if (jronnode.__lang)
                    {
                        opts = jQuery.extend({}, options, { lang: jronnode.__lang }); 
                    }
                    return jQuery.rdf.literal(jronnode.__text, opts);
                };
                if (jronnode.__repr)
                {
                    // Typed literal
                    //  { "__repr": "2010-03-06",
                    //    "__type": "http://www.w3.org/2001/XMLSchema#date" }
                    var opts = jQuery.extend({}, options, { datatype: jronnode.__type }); 
                    return jQuery.rdf.literal(jronnode.__text, opts);
                    
                };
                // bnode, with or without __node_id value
                //  { "foaf_name": "Sandro Hawke",
                //       "foaf_knows: { "foaf_name": "Eric Prud'hommeaux",
                //                      "foaf_knows: { "__node_id": "n334" },
                //       "__node_id": "n334" }
                var nodeid = '[]';
                if (jronnode.__node_id)
                {
                    nodeid = "_:"+jronnode.__node_id;
                }
                return jQuery.rdf.blank(nodeid);
            }
            e = "node_fromJRON unrecognized node: "+jQuery.toJSON(jronnode);
            log.debug(e);
            throw e;
        },

    pred_fromJRON:
        /**
         * Create an rdfquery node from a supplied JRON predicate value and 
         * rdfquery options
         * 
         * @param jronpred  is a JRON value for a node: a string containing a
         *                  URI or CURIE
         * @param options   is an rdfquery options structure, in particular
         *                  containing a namespaces member with prefix
         *                  definitions for expanding CURIES.
         * @return          an rdfquery node value that can be used to
         *                  construct a triple value, among other things.
         */
        function (jronpred, options)
        {
            return jQuery.node_fromJRON( { __iri: jronpred }, options);
        },

    statements_fromJRON:
        /**
         * Add statements to the JRON object from the supplied JRON object
         * 
         * @param jron      is a JRON structure to be converted to RDF statements
         * @param options   is an rdfquery options structure, in particular
         *                  containing a namespaces member with prefix
         *                  definitions for expanding CURIES.
         * @param dartabank is an rdfquery databank object to which the RDF
         *                  statements are added.
         */
        function (jron, options, databank)
        {
            var subj = jQuery.node_fromJRON(jron, options);
            log.debug("jQuery.statements_fromJRON "+jQuery.toJSON(jron));
            // Find and save statements
            for (var pred in jron)
            {
                // Assume anything beginning with "__" is special
                if (pred.slice(0,2) != "__")
                try
                {
                    var obj = jron[pred];
                    log.debug("- stmt "+subj+" "+pred+" "+jQuery.toJSON(obj));
                    pred = jQuery.pred_fromJRON(pred, options);
                    var object = jQuery.node_fromJRON(obj, options);
                    var triple = jQuery.rdf.triple(subj, pred, object, options);
                    databank.add(triple);
                    // Now generate statements from object of last statement
                    if (typeof obj == "object")
                    {
                        jQuery.statements_fromJRON(obj, options, databank);
                    };
                }
                catch (e)
                {
                    log.error("- error "+e);
                    throw e;
                };
            }
        },
        
    RDFfromJRON:
        /**
         * Create and return an rdfquery databank object containing data from
         * the supplied JRON object structure.
         * 
         * @param jron      is a javascript object containing RDF data structured
         *                  per JRON.
         * @return          an rdfquery databank object containing the JRON data.
         */
        function (jron)
        {
            log.debug("jQuery.RDFfromJRON");
            var rdfdatabank = jQuery.rdf.databank()
                .base("");
            // Find and set base
            if (jron.__base)
            {
                rdfdatabank.base(jron.__base);
            };
            // Find and set prefixes?
            if (jron.__prefixes)
            {
                for (var pref in jron.__prefixes)
                {
                    log.debug("- prefix "+pref);
                    //TODO: more robust way to strip separator char(s) from prefix
                    rdfdatabank.prefix(pref.slice(0,-1), jron.__prefixes[pref]);
                };
            };
            var opts = { namespaces: rdfdatabank.prefix(), base: rdfdatabank.base() };
            log.debug("- options "+jQuery.toJSON(opts));
            jQuery.statements_fromJRON(jron, opts, rdfdatabank);
            return rdfdatabank;
        },

    node_toJRON:
        /**
         * Create an JRON predicate value from a supplied rdfquery node and 
         * base and prefix options
         * 
         * @param rdfnode   an rdfquery node value used as a node in
         *                  an rdfdatabank triple value.
         * @param options   is an options value, in particular containing
         *                  a base URI and prefix definitions for compacting 
         *                  URIs to CURIE-like values.  The value is supplied
         *                  as a JRON object with corresponding __base and
         *                  __prefixes members.
         * @return          a JRON value for a predicate: a string 
         *                  containing a URI or CURIE
         */
        function (rdfnode, options)
        {
            log.debug("node_toJRON "+rdfnode.type+", "+rdfnode.value);
            if (rdfnode.type == "uri")
            {
                var uri    = rdfnode.value.toString();
                var matchl = 0;
                var matchp = null;
                var matchu = null;
                for (k in options.__prefixes)
                {
                    var u = options.__prefixes[k];
                    var l = u.length;
                    if ((uri.slice(0,l) == u) && (l > matchl))
                    {
                        matchl = l;
                        matchp = k;
                        matchu = u;
                    }
                }
                if (matchp)
                {
                    uri = matchp+uri.slice(matchl);
                }                
                return { __iri: uri };
            };
            if (rdfnode.type == "bnode")
            {
                var nodeid = rdfnode.value;
                if (nodeid.slice(0,2) == "_:")
                {
                    return { __node_id: nodeid.slice(2) };
                }
                return {};
            };
            if (rdfnode.type == "literal")
            {
                // TODO: typed and language-tagged literals
                return rdfnode.value;
            };
            throw "node_toJRON: unexpected RDF node type: "+rdfnode.type;
        },

    subj_toJRON:
        /**
         * Create an JRON subject node value from a supplied rdfquery node and 
         * base and prefix options
         * 
         * @param rdfnode   an rdfquery node value used as a subject in
         *                  a triple value (i.e. URI or blank).
         * @param options   mapping options: see node_toJRON for details.
         * @return          a JRON value for a predicate: a string 
         *                  containing a URI or CURIE
         */
        function (rdfnode, options)
        {
            return jQuery.node_toJRON(rdfnode, options);
        },

    pred_toJRON:
        /**
         * Create a JRON predicate value from a supplied rdfquery node and 
         * base and prefix options
         * 
         * @param rdfnode   an rdfquery node value used as a predicate in
         *                  a triple value.
         * @param options   mapping options: see node_toJRON for details.
         * @return          an rdfquery node value that can be used to
         *                  construct a triple value, among other things.
         * @param jronpred  is a JRON value for a predicate: a string 
         *                  containing a URI or CURIE
         */
        function (rdfnode, options)
        {
            return jQuery.node_toJRON(rdfnode, options).__iri.toString();
        },
        
    statements_toJRON:
        /**
         * Create and return a JRON-structured object containing data from
         * the supplied rdfquery databank for the indicated subjects.
         * 
         * @param databank  is an rdfquery datababnk object.
         * @param subjects  is a dictionary of rdf subjects for which statements 
         *                  remain to be extracted.  The dictionary values are reset
         *                  to null as subjects are processed.
         * @param subjkey   is the subject key (in subjects) for which statements should be generated
         * @param options   mapping options: see node_toJRON for details.
         * @return          a JRON object containing RDF statements
         *                  extracted from the databank.
         */
        function (databank, subjects, subjkey, options)
        {
            var jron = null;
            if (subjects[subjkey])
            {
                // Take next subject node from dictionary, and
                // reset value so it can't be processed again
                var rdfsubj = subjects[subjkey];
                subjects[subjkey] = null;
                jron = {};
                databank.triples().each(function(i, t)
                {
                    if (t.subject == rdfsubj)
                    {
                        var subj = jQuery.subj_toJRON(t.subject,  options);
                        var prop = jQuery.pred_toJRON(t.property, options);
                        var obj  = jQuery.node_toJRON(t.object,   options);
                        log.debug("- subj "+jQuery.toJSON(subj));
                        log.debug("- prop "+prop);
                        log.debug("- obj  "+jQuery.toJSON(obj));
                        subj[prop] = obj;
                        jQuery.extend(jron, subj);
                    };
                });
            };
            return jron;
        },
        
    RDFtoJRON:
        /**
         * Create and return a JRON-structured object containing data from
         * the supplied rdfquery databank.
         * 
         * @param databank  is an rdfquery datababnk object.
         * @return          a JRON object containing the rdfquery databank data.
         */
        function (databank)
        {
            var jron = {};
            // Base URI
            var b = databank.base().toString();
            if (b)
            {
                jron.__base = b;
            };
            // Prefixes
            var p  = databank.prefix();
            var jp = {};
            if (p)
            {
                for (var k in p)
                {
                    var v = p[k];
                    log.debug("- prefix "+k+", uri "+v);
                    jp[k+':'] = v;
                };
            };
            if (jp)
            {
                jron.__prefixes = jp;
            }
            // Enumerate subjects by creating a dictionary keyed by value strings
            var rdfsubjects = {};
            databank.triples().each(function(i, t)
            {
                log.debug("- enumerate subj: "+t.subject.value+", "+t.subject.type);
                if ((t.subject.type == "uri") || (t.subject.type == "bnode"))
                {
                    rdfsubjects[t.subject.value] = t.subject;
                }
                else
                {
                    var e = "Unexpected subject node type: "+rdfsubj.type;
                    log.error(e);
                    throw e;
                };
            });
            // rdfsubjects is now a dictionary of uri and bnode subjects
            // Generate RDF statements
            var statements = [];
            for (subjkey in rdfsubjects)
            {
                var stmt = jQuery.statements_toJRON(databank, rdfsubjects, subjkey, jron);
                if (stmt) statements.push(stmt);
            };
            if (statements.length == 1)
            {
                jQuery.extend(jron, statements[0]);
            }
            else
            {
                var e = "Statements exist for multiple subjects - JRON representation not determined";
                log.error(e);
                throw e;
            };
            return jron;
        }
});

/**
 * The zzz
 * 
 * @param zzzz      ....
 * @return          ....
 */
/*
jQuery.fn.zzz = function (zzzz)
{
    //log.debug("jQuery(...).zzz");
};
*/

// End.
