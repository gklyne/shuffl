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
            };
            if (jronnode instanceof Array)
            {
                // Return blank node or rdf:nil for head of list
                return jronnode.length == 0 ? jQuery.rdf.nil : jQuery.rdf.blank('[]');
            };            
            if (typeof jronnode == "object")
            {
                if (jronnode.__iri)
                {
                    // CURIE or URI here
                    // { __iri: ... }
                    var uri = jronnode.__iri;
                    if (uri.slice(0,1) == ':')
                    {
                        //TODO: can I get jQuery.curie to handle this?
                        ////log.debug("- namespaces "+jQuery.toJSON(options.namespaces))
                        if (options.namespaces[''])
                        {
                            return jQuery.rdf.resource("<"+options.namespaces['']+uri.slice(1)+">", options);
                        }
                    }
                    try
                    {
                        // Try for CURIE - more restrictive than JRON proposal
                        curi = jQuery.curie(uri, options);
                        return jQuery.rdf.resource(curi, options);
                    }
                    catch (e)
                    {
                        ////log.debug("- not CURIE: "+e);
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
                    var opts = jQuery.extend({}, options, { datatype: "["+jronnode.__type+"]" });
                    return jQuery.rdf.literal(jronnode.__repr, opts);
                    
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
            };
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
         * @param rdfsubj   is the RDF subject node for generated sttatements, or 
         *                  null if a new node should be generated.  (This is used
         *                  to prevent multiple-generation of unlabelled bnodes.)
         * @param options   is an rdfquery options structure, in particular
         *                  containing a namespaces member with prefix
         *                  definitions for expanding CURIES.
         * @param dartabank is an rdfquery databank object to which the RDF
         *                  statements are added.
         */
        function (jron, rdfsubj, options, databank)
        {
            ////log.debug("jQuery.statements_fromJRON "+jQuery.toJSON(jron));
            rdfsubj = rdfsubj || jQuery.node_fromJRON(jron, options);
            // Find and save statements
            for (var pred in jron)
            {
                // Assume anything beginning with "__" is special
                if (pred.slice(0,2) != "__")
                try
                {
                    var obj = jron[pred];
                    ////log.debug("- stmt "+rdfsubj+" "+pred+" "+jQuery.toJSON(obj));
                    pred = jQuery.pred_fromJRON(pred, options);
                    var object = jQuery.node_fromJRON(obj, options);
                    var triple = jQuery.rdf.triple(rdfsubj, pred, object, options);
                    databank.add(triple);
                    // Now generate statements from object of last statement
                    if (obj instanceof Array)
                    {
                        var rdfNs = "http://www.w3.org/1999/02/22-rdf-syntax-ns#";
                        var cons = object;
                        for (var i = 0 ; i < obj.length ; i += 1)
                        {
                            var head = {};
                            head[rdfNs+"type"]  = { __iri: rdfNs+"List" };
                            head[rdfNs+"first"] = obj[i];
                            jQuery.statements_fromJRON(head, cons, options, databank);
                            var tail = i < obj.length-1 ? jQuery.rdf.blank('[]') : jQuery.rdf.nil;
                            databank.add(jQuery.rdf.triple(cons, jQuery.rdf.rest,  tail, options));
                            cons = tail;
                        };
                    }
                    else if (typeof obj == "object")
                    {
                        jQuery.statements_fromJRON(obj, object, options, databank);
                    }
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
            ////log.debug("jQuery.RDFfromJRON");
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
                    ////log.debug("- prefix "+pref);
                    //TODO: more robust way to strip separator char(s) from prefix
                    rdfdatabank.prefix(pref.slice(0,-1), jron.__prefixes[pref]);
                };
            };
            var opts = { namespaces: rdfdatabank.prefix(), base: rdfdatabank.base() };
            ////log.debug("- options "+jQuery.toJSON(opts));
            jQuery.statements_fromJRON(jron, null, opts, rdfdatabank);
            return rdfdatabank;
        },

    uri_toJRON:
        /**
         * Analyzes a supplied URI string and returns a CURIE if the leading
         * part corresponds to a defined prefix.
         * 
         * @param uri       a URI string to be analyzed
         * @param options   is an options value, in particular containing
         *                  prefix definitions, supplied as a JRON options
         *                  object with corresponding __prefixes members.
         * @return          the URI compacted as a CURIE, or the original URI 
         *                  string is no prefix is matched.
         */
        function (uri, options)
        {
            var matchl = 0;
            var matchp = null;
            var uris   = uri.toString();
            for (k in options.__prefixes)
            {
                var u = options.__prefixes[k];
                var l = u.length;
                if ((uris.slice(0,l) == u) && (l > matchl))
                {
                    matchl = l;
                    matchp = k;
                }
            }
            if (matchp)
            {
                uris = matchp+uris.slice(matchl);
            }
            return uris;
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
         * @return          a JRON value for a string: a structure representing
         *                  a URI or blank node, a datatyped literal or a
         *                  string representing an untyped literal.
         */
        function (rdfnode, options)
        {
            ////log.debug("node_toJRON "+rdfnode.type+", "+rdfnode.value);
            if (rdfnode.type == "uri")
            {
                var uri = jQuery.uri_toJRON(rdfnode.value, options);
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
                if (rdfnode.datatype)
                {
                    return { "__type": jQuery.uri_toJRON(rdfnode.datatype, options)
                           , "__repr": ""+rdfnode.value };
                }
                return rdfnode.value;
            };
            throw "node_toJRON: unexpected RDF node type: "+rdfnode.type;
        },

    subjobj_toJRON:
        /**
         * Create an JRON subject or object node value from a supplied rdfquery
         * node and base and prefix options
         * 
         * @param rdfnode   an rdfquery node value used as a subject in
         *                  a triple value (i.e. URI or blank).
         * @param bobjects  is a dictionary keyed by bnode names that appear in 
         *                  the object position of any statement, each accessing
         *                  a count of statements in which they so appear.
         *                  This is used to suppress bnode id generation in 
         *                  JRON when they are not needed.
         * @param options   mapping options: see node_toJRON for details.
         * @return          a JRON value for a string: a structure representing
         *                  a URI or blank node, a datatyped literal or a
         *                  string representing an untyped literal.
         */
        function (rdfnode, bobjects, options)
        {
            var node = jQuery.node_toJRON(rdfnode, options);
            // Check to suppress bnode identifier
            if (rdfnode.type == "bnode")
            {
                //log.debug("- bobjects["+rdfnode.value+"] "+jQuery.toJSON(bobjects[rdfnode.value]));
                if (!bobjects[rdfnode.value] || (bobjects[rdfnode.value] <= 1))
                {
                    delete node.__node_id;
                };
            };
            return node;
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
         * @param bobjects  is a dictionary keyed by bnode names that appear in 
         *                  the object position of any statement, each accessing
         *                  a count of statements in which they so appear.
         *                  This is used to suppress bnode id generation in 
         *                  JRON when they are not needed.
         * @param subjkey   is the subject key (in subjects) for which 
         *                  statements should be generated
         * @param options   mapping options: see node_toJRON for details.
         * @return          a JRON object containing RDF statements
         *                  extracted from the databank.
         */
        function (databank, subjects, bobjects, subjkey, options)
        {
            var jron = null;
            if (subjects[subjkey])
            {
                // Take next subject node from dictionary, and
                // reset value so it can't be processed again
                var rdfsubj = subjects[subjkey];
                subjects[subjkey] = null;
                var subj = jQuery.subjobj_toJRON(rdfsubj, bobjects, options);
                jron = {};
                databank.triples().each(function(i, t)
                {
                    if (t.subject == rdfsubj)
                    {
                        var prop = jQuery.pred_toJRON(t.property, options);
                        var obj  = jQuery.subjobj_toJRON(t.object, bobjects, options);
                        // If there are statements about 'obj', generate them now
                        if (subjects[t.object.value])
                        {
                            var objstmt = jQuery.statements_toJRON(databank, subjects, bobjects, t.object.value, options);
                            if (objstmt)
                            {
                                jQuery.extend(obj, objstmt);
                            };
                        };
                        // If object is a list, replace it now
                        if (obj.__iri == "rdf:nil")
                        {
                            obj = [];
                        }
                        else if (obj["rdf:first"] && obj["rdf:rest"] && 
                                (obj["rdf:rest"] instanceof Array))
                        {
                            // Recursive calls mean the tail is already a list
                            obj = [obj["rdf:first"]].concat(obj["rdf:rest"]);
                        }
                        subj[prop] = obj;
                    };
                });
                jQuery.extend(jron, subj);
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
                    ////log.debug("- prefix "+k+", uri "+v);
                    jp[k+':'] = v;
                };
            };
            if (jp)
            {
                jron.__prefixes = jp;
            }
            // Enumerate subjects by creating a dictionary keyed by value strings
            // Also construct count of references to each bnode-as-object
            var rdfsubjects = {};
            var bnodeobjects = {};
            databank.triples().each(function(i, t)
            {
                ////log.debug("- enumerate subj: "+t.subject.value+", "+t.subject.type);
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
                if (t.object.type == "bnode")
                {
                    bnodeobjects[t.object.value] = (bnodeobjects[t.object.value] || 0) + 1;
                }
            });
            // rdfsubjects is now a dictionary of uri and bnode subjects
            // Generate RDF statements
            var statements = [];
            for (subjkey in rdfsubjects)
            {
                var stmt = jQuery.statements_toJRON(databank, rdfsubjects, bnodeobjects, subjkey, jron);
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
                for (var i = 0 ; i < statements.length ; i += 1)
                {
                    log.debug("- ["+i+"]: "+jQuery.toJSON(statements[i]));
                }
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
