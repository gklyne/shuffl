/**
 * @fileoverview
 *  Test suite for convertion between JRON Javascript objects and RDFQuery
 *  databank objects.
 * 
 *  See:
 *  http://decentralyze.com/2010/06/04/from-json-to-rdf-in-six-easy-steps-with-jron/
 *  http://code.google.com/p/rdfquery/
 *  http://www.jenitennison.com/rdfquery/
 *  http://www.jenitennison.com/rdfquery/symbols/jQuery.rdf.databank.html
 *  http://code.google.com/p/shuffl/wiki/JRON_implementation_notes
 *  
 * @author Graham Klyne
 * @version $Id: test-rdfquery.jron.js 840 2010-06-18 09:50:42Z gk-google@ninebynine.org $
 * 
 * Coypyright (C) 2010, University of Oxford
 *
 * Licensed under the MIT License.  You may obtain a copy of the license at:
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
 * Test data values
 */

/**
 * Function to register tests
 */
TestRdfqueryJron = function()
{

    module("TestRdfqueryJron");

    containsTriple = function (databank, triple)
    {
        var match = false;
        databank.triples().each( function(i, t)
            {
                if (t == triple)
                {
                    match = true;
                    return false; // break
                }
                return true; //continue
            });
        return match;
    };

    assertSamePrefixes = function (val, exp, txt)
    {
        // Simple same(...) test doesn't always work
        for (var k in exp)
        {
            ok(val[k], txt+": missing prefix "+k);
            equals(val[k], exp[k], txt+": mismatch prefix "+k)
        };
        for (k in val)
        {
            ok(exp[k], txt+": unexpected prefix "+k);
        };
    };

    assertSameDatabankContents = function (val, exp, txt)
    {
        equals(val.size(), exp.size(), txt+": different sizes");
        log.debug("- expect prefixes: "+jQuery.toJSON(exp.prefix()));
        log.debug("- found  prefixes: "+jQuery.toJSON(val.prefix()));
        assertSamePrefixes(val.prefix(), exp.prefix(), txt);
        val.triples().each( function (i, t)
            {
                ok(containsTriple(exp, t), txt+": unexpected triple: "+t);
            });
        exp.triples().each( function (i, t)
            {
                ok(containsTriple(val, t), txt+": missing triple: "+t);
            });
    };

    assertSameJRON = function (val, exp, txt)
    {
        same(val, exp, txt);
    };

    test("testCompareDatabanks", function ()
    {
        logtest("testCompareDatabanks");
        var rdfdatabank1 = jQuery.rdf.databank()
            .base("")
            .prefix("rdf", "http://www.w3.org/1999/02/22-rdf-syntax-ns#")
            .prefix("shuffl", "http://purl.org/NET/Shuffl/vocab#")
            .add("<http://example.com/card#id_1> rdf:type shuffl:Card")
            .add("<http://example.com/card#id_1> shuffl:id \"id_1\"")
            ;
        var rdfdatabank2 = jQuery.rdf.databank()
            .base("")
            .prefix("rdf", "http://www.w3.org/1999/02/22-rdf-syntax-ns#")
            .prefix("shuffl", "http://purl.org/NET/Shuffl/vocab#")
            .add("<http://example.com/card#id_1> rdf:type shuffl:Card")
            .add("<http://example.com/card#id_1> shuffl:id \"id_1\"")
            ;
        assertSameDatabankContents(rdfdatabank1, rdfdatabank2, "Compare Databanks");
    });

    test("testCompareJRONObjects", function ()
    {
        logtest("testCompareJRONObjects");
        var jron1 = 
            { "__iri":     "http://example.com/card#id_1"
            , "__prefixes":
              { "shuffl:": "http://purl.org/NET/Shuffl/vocab#"
              , "rdf:":    "http://www.w3.org/1999/02/22-rdf-syntax-ns#"
              }
            , "rdf:type":  { "__iri": "shuffl:Card" }
            , "shuffl:id": "id_1"
            };
        var jron2 = 
            { "__iri":     "http://example.com/card#id_1"
            , "__prefixes":
              { "shuffl:": "http://purl.org/NET/Shuffl/vocab#"
              , "rdf:":    "http://www.w3.org/1999/02/22-rdf-syntax-ns#"
              }
            , "rdf:type":  { "__iri": "shuffl:Card" }
            , "shuffl:id": "id_1"
            };
        assertSameJRON(jron1, jron2, "Compare JRON objects");
    });

    test("testSimpleStatementLiteralObjectJRONtoRDF", function ()
    {
        logtest("testSimpleStatementLiteralObjectJRONtoRDF");
        // http://code.google.com/p/shuffl/wiki/JRON_implementation_notes
        //   #Simple_statements_with_literal_object
        var jron = 
            { "__iri":     "http://example.com/card#id_1"
            , "__prefixes":
              { "shuffl:": "http://purl.org/NET/Shuffl/vocab#"
              , "rdf:":    "http://www.w3.org/1999/02/22-rdf-syntax-ns#"
              }
            , "rdf:type":  { "__iri": "shuffl:Card" }
            , "shuffl:id": "id_1"
            };
        var rdfdatabank = jQuery.rdf.databank()
            .base("")
            .prefix("rdf", "http://www.w3.org/1999/02/22-rdf-syntax-ns#")
            .prefix("shuffl", "http://purl.org/NET/Shuffl/vocab#")
            .add("<http://example.com/card#id_1> rdf:type shuffl:Card")
            .add("<http://example.com/card#id_1> shuffl:id \"id_1\"")
            ;
        // Convert JRON to RDF databank
        var fromjron = jQuery.JRONtoRDF(jron);
        assertSameDatabankContents(fromjron, rdfdatabank, "Databank created from JRON");
    });

/*
    test("testSimpleStatementLiteralObjectRDFtoJRON", function ()
    {
        logtest("testSimpleStatementLiteralObjectRDFtoJRON");
        // http://code.google.com/p/shuffl/wiki/JRON_implementation_notes
        //   #Simple_statements_with_literal_object
        expect(1);
        var jron = 
            { "__iri":     "http://example.com/card#id_1"
            , "__prefixes":
              { "shuffl:": "http://purl.org/NET/Shuffl/vocab#"
              , "rdf:":    "http://www.w3.org/1999/02/22-rdf-syntax-ns#"
              }
            , "rdf:type":  { "__iri": "shuffl:Card" }
            , "shuffl:id": "id_1"
            };
        var rdfdatabank = jQuery.rdf.databank()
            .base("")
            .prefix("rdf", "http://www.w3.org/1999/02/22-rdf-syntax-ns#")
            .prefix("shuffl", "http://purl.org/NET/Shuffl/vocab#")
            .add("<http://example.com/card#id_1> rdf:type shuffl:Card")
            .add("<http://example.com/card#id_1> shuffl:id \"id_1\"")
            ;
        // Convert databank to JRON
        var tojron = shuffl.RDFtoJRON(rdfdatabank);
        assertSameJRON(tojron, jron, "JRON created from Databank");
    });
     
    test("testBBB", function ()
    {
        logtest("testBBB");
        expect(11);
        log.debug("----- testBBB start -----");
        var m = new shuffl.AsyncComputation();
        m.eval(
            function (val, callback) {
                m.dosomethingBBB(
                    val,
                    paramsBBB, 
                    callback);
            });
        m.exec(initvalBBB,
            function(val) {
                equals(val, expect, "what");
                same(val, expect, "what");
                log.debug("----- testBBB end -----");
                start();
            });
        stop(2000);
    });
*/

    //TODO: Multiple statements with different subjects

};

// End
