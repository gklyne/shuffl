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
    JRON_node:
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
            e = "JRON_node unrecognized node: "+jQuery.toJSON(jronnode);
            log.debug(e);
            throw e;
        },

    JRON_pred:
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
            return jQuery.JRON_node( { __iri: jronpred }, options);
        },

    JRONtoRDF:
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
            log.debug("jQuery.JRONtoRDF");
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
                    //TODO: more robust way to strip spearator char(s) from prefix
                    rdfdatabank.prefix(pref.slice(0,-1), jron.__prefixes[pref]);
                };
            };
            var opts = { namespaces: rdfdatabank.prefix(), base: rdfdatabank.base() };
            log.debug("- options "+jQuery.toJSON(opts));
            subj = jQuery.JRON_node(jron, opts);
            // Find and save statements
            for (var pred in jron)
            {
                // Assume anything beginning with "__" is special
                if (pred.slice(0,2) != "__")
                try
                {
                    var obj = jron[pred];
                    log.debug("- stmt "+subj+" "+pred+" "+jQuery.toJSON(obj));
                    pred = jQuery.JRON_pred(pred, opts);
                    obj  = jQuery.JRON_node(obj, opts);
                    var triple = jQuery.rdf.triple(subj, pred, obj, opts);
                    rdfdatabank.add(triple);
                }
                catch (e)
                {
                    log.debug("- error "+e);
                };
            }
            return rdfdatabank;
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
