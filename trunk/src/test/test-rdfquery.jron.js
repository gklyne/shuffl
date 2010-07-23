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
 * @version $Id$
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

    /**
     * Compares two nodes and returns true if they differ by only blank node identifiers
     */
    nodesMatch = function(n1, n2)
    {
        return (n1 == n2) ||
               ((n1.type == "bnode") && 
                (n2.type == "bnode"));
    };

    /**
     * Compares two triples and returns true if they differ by only blank node identifiers
     */
    triplesMatch = function(t1, t2)
    {
        return nodesMatch(t1.subject, t2.subject) && 
               nodesMatch(t1.property, t2.property) && 
               nodesMatch(t1.object, t2.object);
    };
    
    containsMatchingTriple = function (databank, triple)
    {
        var match = false;
        databank.triples().each( function(i, t)
            {
                if (triplesMatch(t, triple))
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
        ////log.debug("- expect prefixes: "+jQuery.toJSON(exp));
        ////log.debug("- found  prefixes: "+jQuery.toJSON(val));
        // Simple same(...) test doesn't always work
        for (var k in exp)
        {
            ok(val[k], txt+": expecting prefix "+k);
            equals(val[k], exp[k], txt+": prefix value for "+k)
        };
        for (k in val)
        {
            ok(exp[k], txt+": found prefix "+k);
        };
    };

    assertSameDatabankContents = function (val, exp, txt)
    {
        equals(val.size(), exp.size(), txt+": compare sizes");
        assertSamePrefixes(val.prefix(), exp.prefix(), txt);
        val.triples().each( function (i, t)
            {
                ok(containsMatchingTriple(exp, t), txt+": found triple: "+t);
            });
        exp.triples().each( function (i, t)
            {
                ok(containsMatchingTriple(val, t), txt+": expecting triple: "+t);
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

    test("testSimpleStatementLiteralObjectRDFfromJRON", function ()
    {
        logtest("testSimpleStatementLiteralObjectRDFfromJRON");
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
        var fromjron = jQuery.RDFfromJRON(jron);
        assertSameDatabankContents(fromjron, rdfdatabank, "Databank created from JRON");
    });

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
        var tojron = jQuery.RDFtoJRON(rdfdatabank);
        assertSameJRON(tojron, jron, "JRON created from Databank");
    });

    test("testSimpleStatementNonLiteralObject", function ()
    {
        logtest("testSimpleStatementLiteralObject");
        // http://code.google.com/p/shuffl/wiki/JRON_implementation_notes
        //   #Simple_statements_with_non-literal_object
        var jron = 
            { "__iri":     "http://example.com/card#id_1"
            , "__prefixes":
              { "shuffl:": "http://purl.org/NET/Shuffl/vocab#"
              , "rdf:":    "http://www.w3.org/1999/02/22-rdf-syntax-ns#"
              }
            , "rdf:type":        { "__iri": "shuffl:Card" }
            , "shuffl:base-uri": { "__iri": "http://example.com/card#" }
            };
        var rdfdatabank = jQuery.rdf.databank()
            .base("")
            .prefix("rdf", "http://www.w3.org/1999/02/22-rdf-syntax-ns#")
            .prefix("shuffl", "http://purl.org/NET/Shuffl/vocab#")
            .add("<http://example.com/card#id_1> rdf:type shuffl:Card")
            .add("<http://example.com/card#id_1> shuffl:base-uri <http://example.com/card#>")
            ;
        // Convert JRON to RDF databank
        var fromjron = jQuery.RDFfromJRON(jron);
        assertSameDatabankContents(fromjron, rdfdatabank, "Databank created from JRON");
        // Convert databank to JRON
        var tojron = jQuery.RDFtoJRON(rdfdatabank);
        assertSameJRON(tojron, jron, "JRON created from Databank");
    });

    test("testStatementsWithXmlBase", function ()
    {
        logtest("testStatementsWithXmlBase");
        // http://code.google.com/p/shuffl/wiki/JRON_implementation_notes
        //   #Statements_with_xml:base
        var jron = 
            { "__iri":     "http://example.com/card#id_1"
            , "__base":    "http://example.com/card#"
            , "__prefixes":
              { "shuffl:": "http://purl.org/NET/Shuffl/vocab#"
              , "rdf:":    "http://www.w3.org/1999/02/22-rdf-syntax-ns#"
              }
            , "rdf:type":        { "__iri": "shuffl:Card" }
            , "shuffl:base-uri": { "__iri": "http://example.com/card#" }
            , "shuffl:rel-uri1": { "__iri": "foobar" }
            , "shuffl:rel-uri2": { "__iri": "#foo" }
            };
        var jron2 = jQuery.extend({}, jron,
            { "shuffl:rel-uri1": { "__iri": "http://example.com/foobar" }
            , "shuffl:rel-uri2": { "__iri": "http://example.com/card#foo" }
            });
        var rdfdatabank = jQuery.rdf.databank()
            .base("http://example.com/card#")
            .prefix("rdf", "http://www.w3.org/1999/02/22-rdf-syntax-ns#")
            .prefix("shuffl", "http://purl.org/NET/Shuffl/vocab#")
            .add("<http://example.com/card#id_1> rdf:type shuffl:Card")
            .add("<http://example.com/card#id_1> shuffl:base-uri <http://example.com/card#>")
            .add("<http://example.com/card#id_1> shuffl:rel-uri1 <http://example.com/foobar>")
            .add("<http://example.com/card#id_1> shuffl:rel-uri2 <http://example.com/card#foo>")
            ;
        // Convert JRON to RDF databank
        var fromjron = jQuery.RDFfromJRON(jron);
        assertSameDatabankContents(fromjron, rdfdatabank, "Databank created from JRON");
        // Convert databank to JRON
        var tojron = jQuery.RDFtoJRON(rdfdatabank);
        assertSameJRON(tojron, jron2, "JRON created from Databank");
    });

    test("testStatementsWithDefaultPrefix", function ()
    {
        logtest("testStatementsWithDefaultPrefix");
        var jron = 
            { "__iri":     "<http://example.com/card#id_1>"
            , "__base":    "http://example.com/card#"
            , "__prefixes":
              { "shuffl:": "http://purl.org/NET/Shuffl/vocab#"
              , "rdf:":    "http://www.w3.org/1999/02/22-rdf-syntax-ns#"
              , ":":       "http://example.org/1/"
              , "":        "http://example.org/2/"
              }
            , ":prop1": { "__iri": ":foo" }
            , "prop2":  { "__iri": "bar" }
            , "<http://example.org/3/prop3>":  { "__iri": "<http://example.org/3/baz>" }
            };
        var rdfdatabank = jQuery.rdf.databank()
            .base("http://example.com/card#")
            .prefix("rdf",       "http://www.w3.org/1999/02/22-rdf-syntax-ns#")
            .prefix("shuffl",    "http://purl.org/NET/Shuffl/vocab#")
            .prefix("",          "http://example.org/1/")
            .prefix("__default", "http://example.org/2/")
            .add("<http://example.com/card#id_1> :prop1 :foo")
            .add("<http://example.com/card#id_1> <http://example.org/2/prop2> <http://example.org/2/bar>")
            .add("<http://example.com/card#id_1> <http://example.org/3/prop3> <http://example.org/3/baz>")
            ;
        // Convert JRON to RDF databank
        var fromjron = jQuery.RDFfromJRON(jron);
        assertSameDatabankContents(fromjron, rdfdatabank, "Databank created from JRON");
        // Convert databank to JRON
        var tojron = jQuery.RDFtoJRON(rdfdatabank);
        assertSameJRON(tojron, jron, "JRON created from Databank");
        fromjron = jQuery.RDFfromJRON(tojron);
        assertSameDatabankContents(fromjron, rdfdatabank, "Databank round-tripped via JRON");
    });

    test("testNestedStatements", function ()
    {
        logtest("testNestedStatements");
        // http://code.google.com/p/shuffl/wiki/JRON_implementation_notes
        //   #Nested_statements
        var jron = 
            { "__iri":     "http://example.com/card#id_1"
            , "__prefixes":
              { "shuffl:": "http://purl.org/NET/Shuffl/vocab#"
              , "rdf:":    "http://www.w3.org/1999/02/22-rdf-syntax-ns#"
              }
            , "rdf:type":  { "__iri": "shuffl:Card" }
            , "shuffl:data": 
              { "shuffl:title":   "Card 1 title"
              }
            };
        var rdfdatabank = jQuery.rdf.databank()
            .base("")
            .prefix("rdf", "http://www.w3.org/1999/02/22-rdf-syntax-ns#")
            .prefix("shuffl", "http://purl.org/NET/Shuffl/vocab#")
            .add("<http://example.com/card#id_1> rdf:type shuffl:Card")
            .add("<http://example.com/card#id_1> shuffl:data _:b")
            .add("_:b shuffl:title \"Card 1 title\"")
            ;
        // Convert JRON to RDF databank
        var fromjron = jQuery.RDFfromJRON(jron);
        assertSameDatabankContents(fromjron, rdfdatabank, "Databank created from JRON");
        var b1 = jQuery.rdf({databank: fromjron})
                    .where("<http://example.com/card#id_1> shuffl:data ?b")
                    .select(['b']);
        var b2 = jQuery.rdf({databank: fromjron})
                    .where("?b shuffl:title \"Card 1 title\"")
                    .select(['b']);
        ok(b1[0].b, "Expecting binding for ?b "+b1[0].b);
        equals(b1[0].b, b2[0].b, "Expecting same bnode in different triples ");
        // Convert databank to JRON
        var tojron = jQuery.RDFtoJRON(rdfdatabank);
        assertSameJRON(tojron, jron, "JRON created from Databank");
        fromjron = jQuery.RDFfromJRON(tojron);
        assertSameDatabankContents(fromjron, rdfdatabank, "Databank round-tripped via JRON");
    });

    test("testMultiplyReferencedBnode", function ()
    {
        logtest("testMultiplyReferencedBnode");
        // http://code.google.com/p/shuffl/wiki/JRON_implementation_notes
        //   #Nested_statements (extra test case)
        var jron = 
            { "__iri":     "http://example.com/card#id_1"
            , "__prefixes":
              { "shuffl:": "http://purl.org/NET/Shuffl/vocab#"
              , "rdf:":    "http://www.w3.org/1999/02/22-rdf-syntax-ns#"
              }
            , "rdf:type":  { "__iri": "shuffl:Card" }
            , "shuffl:data": 
              { "__node_id": "b"
              , "shuffl:title":   "Card 1 title"
              }
            , "shuffl:more": { "__node_id": "b" }
            };
        var rdfdatabank = jQuery.rdf.databank()
            .base("")
            .prefix("rdf", "http://www.w3.org/1999/02/22-rdf-syntax-ns#")
            .prefix("shuffl", "http://purl.org/NET/Shuffl/vocab#")
            .add("<http://example.com/card#id_1> rdf:type shuffl:Card")
            .add("<http://example.com/card#id_1> shuffl:data _:b")
            .add("<http://example.com/card#id_1> shuffl:more _:b")
            .add("_:b shuffl:title \"Card 1 title\"")
            ;
        // Convert JRON to RDF databank
        var fromjron = jQuery.RDFfromJRON(jron);
        assertSameDatabankContents(fromjron, rdfdatabank, "Databank created from JRON");
        // Convert databank to JRON
        var tojron = jQuery.RDFtoJRON(rdfdatabank);
        assertSameJRON(tojron, jron, "JRON created from Databank");
        fromjron = jQuery.RDFfromJRON(tojron);
        assertSameDatabankContents(fromjron, rdfdatabank, "Databank round-tripped via JRON");
    });

    test("testListOfLiterals", function ()
    {
        logtest("testListOfLiterals");
        // http://code.google.com/p/shuffl/wiki/JRON_implementation_notes
        //   #List_of_literal_values
        var jron = 
            { "__iri":     "http://example.com/card#id_1"
            , "__prefixes":
              { "shuffl:": "http://purl.org/NET/Shuffl/vocab#"
              , "rdf:":    "http://www.w3.org/1999/02/22-rdf-syntax-ns#"
              }
            , "rdf:type":  { "__iri": "shuffl:Card" }
            , "shuffl:data": 
              { "shuffl:tags":    [ "card_1_tag", "yellowtag" ]
              }
            };
        var rdfdatabank = jQuery.rdf.databank()
            .base("")
            .prefix("rdf", "http://www.w3.org/1999/02/22-rdf-syntax-ns#")
            .prefix("shuffl", "http://purl.org/NET/Shuffl/vocab#")
            .add("<http://example.com/card#id_1> rdf:type shuffl:Card")
            .add("<http://example.com/card#id_1> shuffl:data _:d")
            .add("_:d shuffl:tags _:l1")
            .add("_:l1 rdf:type  rdf:List")
            .add("_:l1 rdf:first \"card_1_tag\"")
            .add("_:l1 rdf:rest  _:l2")           
            .add("_:l2 rdf:type  rdf:List")
            .add("_:l2 rdf:first \"yellowtag\"")
            .add("_:l2 rdf:rest  rdf:nil")           
            ;
        // Convert JRON to RDF databank
        var fromjron = jQuery.RDFfromJRON(jron);
        assertSameDatabankContents(fromjron, rdfdatabank, "Databank created from JRON");
        // Convert databank to JRON
        var tojron = jQuery.RDFtoJRON(rdfdatabank);
        assertSameJRON(tojron, jron, "JRON created from Databank");
        fromjron = jQuery.RDFfromJRON(tojron);
        assertSameDatabankContents(fromjron, rdfdatabank, "Databank round-tripped via JRON");
    });

    test("testEmptyList", function ()
    {
        logtest("testEmptyList");
        // http://code.google.com/p/shuffl/wiki/JRON_implementation_notes
        //   #List_of_literal_values (extra test)
        var jron = 
            { "__iri":     "http://example.com/card#id_1"
            , "__prefixes":
              { "shuffl:": "http://purl.org/NET/Shuffl/vocab#"
              , "rdf:":    "http://www.w3.org/1999/02/22-rdf-syntax-ns#"
              }
            , "rdf:type":  { "__iri": "shuffl:Card" }
            , "shuffl:data": 
              { "shuffl:tags":    []
              }
            };
        var rdfdatabank = jQuery.rdf.databank()
            .base("")
            .prefix("rdf", "http://www.w3.org/1999/02/22-rdf-syntax-ns#")
            .prefix("shuffl", "http://purl.org/NET/Shuffl/vocab#")
            .add("<http://example.com/card#id_1> rdf:type shuffl:Card")
            .add("<http://example.com/card#id_1> shuffl:data _:d")
            .add("_:d shuffl:tags rdf:nil")
            ;
        // Convert JRON to RDF databank
        var fromjron = jQuery.RDFfromJRON(jron);
        assertSameDatabankContents(fromjron, rdfdatabank, "Databank created from JRON");
        // Convert databank to JRON
        var tojron = jQuery.RDFtoJRON(rdfdatabank);
        assertSameJRON(tojron, jron, "JRON created from Databank");
        fromjron = jQuery.RDFfromJRON(tojron);
        assertSameDatabankContents(fromjron, rdfdatabank, "Databank round-tripped via JRON");
    });

    test("testListOfNonliterals", function ()
    {
        logtest("testListOfNonliterals");
        // http://code.google.com/p/shuffl/wiki/JRON_implementation_notes
        //   #List_of_non-literal_values
        var jron = 
            { "__iri":     "http://example.com/workspace#id_1"
            , "__prefixes":
              { "shuffl:": "http://purl.org/NET/Shuffl/vocab#"
              , "rdf:":    "http://www.w3.org/1999/02/22-rdf-syntax-ns#"
              }
            , "rdf:type":  { "__iri": "shuffl:Workspace" }
            , "shuffl:workspace":
              { "shuffl:layout":
                [ { "shuffl:id": "card_1"
                  }
                , { "shuffl:id": "card_2"
                  }
                ]
              }
            };
        var rdfdatabank = jQuery.rdf.databank()
            .base("")
            .prefix("rdf", "http://www.w3.org/1999/02/22-rdf-syntax-ns#")
            .prefix("shuffl", "http://purl.org/NET/Shuffl/vocab#")
            .add("<http://example.com/workspace#id_1> rdf:type shuffl:Workspace")
            .add("<http://example.com/workspace#id_1> shuffl:workspace _:w")
            .add("_:w shuffl:layout _:l1")
            .add("_:l1 rdf:type  rdf:List")
            .add("_:l1 rdf:first _:c1")
            .add("_:l1 rdf:rest  _:l2")           
            .add("_:l2 rdf:type  rdf:List")
            .add("_:l2 rdf:first _:c2")
            .add("_:l2 rdf:rest  rdf:nil")
            .add("_:c1 shuffl:id \"card_1\"")
            .add("_:c2 shuffl:id \"card_2\"")
            ;
        // Convert JRON to RDF databank
        var fromjron = jQuery.RDFfromJRON(jron);
        assertSameDatabankContents(fromjron, rdfdatabank, "Databank created from JRON");
        // Convert databank to JRON
        var tojron = jQuery.RDFtoJRON(rdfdatabank);
        assertSameJRON(tojron, jron, "JRON created from Databank");
        fromjron = jQuery.RDFfromJRON(tojron);
        assertSameDatabankContents(fromjron, rdfdatabank, "Databank round-tripped via JRON");
    });

    test("testListOfLists", function ()
    {
        logtest("testListOfLists");
        // http://code.google.com/p/shuffl/wiki/JRON_implementation_notes
        //   #List_of_non-literal_values (extra test case)
        var jron = 
            { "__iri":     "http://example.com/workspace#id_1"
            , "__prefixes":
              { "shuffl:": "http://purl.org/NET/Shuffl/vocab#"
              , "rdf:":    "http://www.w3.org/1999/02/22-rdf-syntax-ns#"
              }
            , "shuffl:lists":
              [ [ "tag1", "tag2"]
              , [ { "shuffl:id": "card_1" }, { "shuffl:id": "card_2" } ]
              ]
            };
        var rdfdatabank = jQuery.rdf.databank()
            .base("")
            .prefix("rdf", "http://www.w3.org/1999/02/22-rdf-syntax-ns#")
            .prefix("shuffl", "http://purl.org/NET/Shuffl/vocab#")
            .add("<http://example.com/workspace#id_1> shuffl:lists _:l1")
            .add("_:l1 rdf:type  rdf:List")
            .add("_:l1 rdf:first _:l11")
            .add("_:l1 rdf:rest  _:l2")           
            .add("_:l2 rdf:type  rdf:List")
            .add("_:l2 rdf:first _:l21")
            .add("_:l2 rdf:rest  rdf:nil")
            .add("_:l11 rdf:type  rdf:List")
            .add("_:l11 rdf:first \"tag1\"")
            .add("_:l11 rdf:rest  _:l12")
            .add("_:l12 rdf:type  rdf:List")
            .add("_:l12 rdf:first \"tag2\"")
            .add("_:l12 rdf:rest  rdf:nil")
            .add("_:l21 rdf:type  rdf:List")
            .add("_:l21 rdf:first _:c1")
            .add("_:l21 rdf:rest  _:l22")
            .add("_:l22 rdf:type  rdf:List")
            .add("_:l22 rdf:first _:c2")
            .add("_:l22 rdf:rest  rdf:nil")
            .add("_:c1 shuffl:id \"card_1\"")
            .add("_:c2 shuffl:id \"card_2\"")
            ;
        // Convert JRON to RDF databank
        var fromjron = jQuery.RDFfromJRON(jron);
        assertSameDatabankContents(fromjron, rdfdatabank, "Databank created from JRON");
        // Convert databank to JRON
        var tojron = jQuery.RDFtoJRON(rdfdatabank);
        assertSameJRON(tojron, jron, "JRON created from Databank");
        fromjron = jQuery.RDFfromJRON(tojron);
        assertSameDatabankContents(fromjron, rdfdatabank, "Databank round-tripped via JRON");
    });

    test("testNonStringliterals", function ()
    {
        logtest("testNonStringliterals");
        // http://code.google.com/p/shuffl/wiki/JRON_implementation_notes
        //   #Non-string_literal_values
        var jron = 
            { "__iri":     "http://example.com/workspace#id_1"
            , "__prefixes":
              { "shuffl:": "http://purl.org/NET/Shuffl/vocab#"
              , "rdf:":    "http://www.w3.org/1999/02/22-rdf-syntax-ns#"
              , "xsd:":    "http://www.w3.org/2001/XMLSchema#"
              , ":":       "http://purl.org/NET/Shuffl/default#"
              }
            , "rdf:type":  { "__iri": "shuffl:Workspace" }
            , "shuffl:workspace":
              { "shuffl:layout":
                [ { ":pos": 
                    { ":left": 
                      { "__repr": "100"
                      , "__type": "xsd:integer"
                      }
                    , ":top":
                      { "__repr": "30"
                      , "__type": "xsd:integer"
                      }
                    } 
                  }
                , { ":zindex":
                    { "__repr": "11"
                    , "__type": "xsd:integer"
                    }
                  }
                ]
              }
            };
        var rdfdatabank = jQuery.rdf.databank()
            .base("")
            .prefix("xsd", "http://www.w3.org/2001/XMLSchema#")
            .prefix("rdf", "http://www.w3.org/1999/02/22-rdf-syntax-ns#")
            .prefix("shuffl", "http://purl.org/NET/Shuffl/vocab#")
            .prefix("", "http://purl.org/NET/Shuffl/default#")
            .add("<http://example.com/workspace#id_1> rdf:type shuffl:Workspace")
            .add("<http://example.com/workspace#id_1> shuffl:workspace _:w")
            .add("_:w shuffl:layout _:l1")
            .add("_:l1 rdf:type  rdf:List")
            .add("_:l1 rdf:first _:p0")
            .add("_:l1 rdf:rest  _:l2")           
            .add("_:l2 rdf:type  rdf:List")
            .add("_:l2 rdf:first _:z0")
            .add("_:l2 rdf:rest  rdf:nil")
            .add("_:p0 :pos _:p1")
            .add("_:p1 :left \"100\"^^xsd:integer")
            .add("_:p1 :top  \"30\"^^xsd:integer")
            .add("_:z0 :zindex \"11\"^^xsd:integer")
            ;
        // Convert JRON to RDF databank
        var fromjron = jQuery.RDFfromJRON(jron);
        assertSameDatabankContents(fromjron, rdfdatabank, "Databank created from JRON");
        // Convert databank to JRON
        var tojron = jQuery.RDFtoJRON(rdfdatabank);
        assertSameJRON(tojron, jron, "JRON created from Databank");
        fromjron = jQuery.RDFfromJRON(tojron);
        assertSameDatabankContents(fromjron, rdfdatabank, "Databank round-tripped via JRON");
    });

    test("testFullShufflCard", function ()
    {
        logtest("testFullShufflCard");
        // http://code.google.com/p/shuffl/wiki/JRON_implementation_notes
        //   #Full_Shuffl_card
        var jron = 
            { "__iri":     "http://example.com/card#id_1"
            , "__prefixes":
              { "shuffl:": "http://purl.org/NET/Shuffl/vocab#"
              , "rdf:":    "http://www.w3.org/1999/02/22-rdf-syntax-ns#"
              , "rdfs:":   "http://www.w3.org/2000/01/rdf-schema#"
              , "owl:":    "http://www.w3.org/2002/07/owl#"
              , "xsd:":    "http://www.w3.org/2001/XMLSchema#"
              }
            , "rdf:type":  { "__iri": "shuffl:Card" }
            , "shuffl:id":        "id_1"
            , "shuffl:type":      "shuffl-freetext-yellow"
            , "shuffl:version":   "0.1"
            , "shuffl:base-uri":  "#"
            , "shuffl:data":
              { "shuffl:title":   "Card 1 title"
              , "shuffl:tags":    [ "card_1_tag", "yellowtag" ]
              , "shuffl:text":    "Card 1 free-form text here<br/>line 2<br/>line3<br/>yellow"
              }
            };
        var rdfdatabank = jQuery.rdf.databank()
            .base("")
            .prefix("shuffl", "http://purl.org/NET/Shuffl/vocab#")
            .prefix("rdf",    "http://www.w3.org/1999/02/22-rdf-syntax-ns#")
            .prefix("rdfs",   "http://www.w3.org/2000/01/rdf-schema#")
            .prefix("owl",    "http://www.w3.org/2002/07/owl#")
            .prefix("xsd",    "http://www.w3.org/2001/XMLSchema#")
            .add("<http://example.com/card#id_1> rdf:type shuffl:Card")
            .add("<http://example.com/card#id_1> shuffl:id \"id_1\"")
            .add("<http://example.com/card#id_1> shuffl:type \"shuffl-freetext-yellow\"")
            .add("<http://example.com/card#id_1> shuffl:version \"0.1\"")
            .add("<http://example.com/card#id_1> shuffl:base-uri \"#\"")
            .add("<http://example.com/card#id_1> shuffl:data _:d")
            .add("_:d shuffl:title \"Card 1 title\"")
            .add("_:d shuffl:tags  _:l1")
            .add("_:l1 rdf:type    rdf:List")
            .add("_:l1 rdf:first   \"card_1_tag\"")
            .add("_:l1 rdf:rest    _:l2")           
            .add("_:l2 rdf:type    rdf:List")
            .add("_:l2 rdf:first   \"yellowtag\"")
            .add("_:l2 rdf:rest    rdf:nil")           
            .add("_:d shuffl:text  \"Card 1 free-form text here<br/>line 2<br/>line3<br/>yellow\"")
            ;
        // Convert JRON to RDF databank
        var fromjron = jQuery.RDFfromJRON(jron);
        assertSameDatabankContents(fromjron, rdfdatabank, "Databank created from JRON");
        // Convert databank to JRON
        var tojron = jQuery.RDFtoJRON(rdfdatabank);
        assertSameJRON(tojron, jron, "JRON created from Databank");
        fromjron = jQuery.RDFfromJRON(tojron);
        assertSameDatabankContents(fromjron, rdfdatabank, "Databank round-tripped via JRON");
    });


    test("testFullShufflWorkspace", function ()
    {
        logtest("testFullShufflWorkspace");
        // http://code.google.com/p/shuffl/wiki/JRON_implementation_notes
        //   #Full_Shuffl_workspace_description
        var jron = 
            { "__prefixes":
              { "shuffl:": "http://purl.org/NET/Shuffl/vocab#"
              , "rdf:":    "http://www.w3.org/1999/02/22-rdf-syntax-ns#"
              , "rdfs:":   "http://www.w3.org/2000/01/rdf-schema#"
              , "owl:":    "http://www.w3.org/2002/07/owl#"
              , "xsd:":    "http://www.w3.org/2001/XMLSchema#"
              , "":        "http://purl.org/NET/Shuffl/default#"
              }
            , "rdf:type":  { "__iri": "shuffl:Workspace" }
            , "shuffl:id":        "test-shuffl-workspace"
            , "shuffl:class":     "shuffl:Workspace"
            , "shuffl:version":   "0.1"
            , "shuffl:base-uri":  "#"
            , "shuffl:workspace":
              { "shuffl:stockbar":
                [ { "id": "stockpile_1", "class": "stock-yellow",  "label": "Ye", "type": "shuffl-freetext-yellow"  }
                , { "id": "stockpile_2", "class": "stock-blue",    "label": "Bl", "type": "shuffl-freetext-blue"    }
                , { "id": "stockpile_3", "class": "stock-green",   "label": "Gr", "type": "shuffl-freetext-green"   }
                , { "id": "stockpile_4", "class": "stock-orange",  "label": "Or", "type": "shuffl-freetext-orange"  }
                , { "id": "stockpile_5", "class": "stock-pink",    "label": "Pi", "type": "shuffl-freetext-pink"    }
                , { "id": "stockpile_6", "class": "stock-purple",  "label": "Pu", "type": "shuffl-freetext-purple"  }
                ]
              , "shuffl:layout":
                [ { "id": "card_1"
                  , "type": "shuffl-freetext-yellow"
                  , "data": "test-shuffl-card_1.json"
                  , "pos": 
                    { "left": 
                      { "__repr": "100"
                      , "__type": "xsd:integer"
                      }
                    , "top":
                      { "__repr": "30"
                      , "__type": "xsd:integer"
                      }
                    } 
                  }
                , { "id": "card_2"
                  , "type": "shuffl-freetext-blue"
                  , "data": "test-shuffl-card_2.json"
                  , "pos":
                    { "top":
                      { "__repr": "0"
                      , "__type": "xsd:integer"
                      }
                    , "left":
                      { "__repr": "400"
                      , "__type": "xsd:integer"
                      }
                    }
                  , "size":
                    { "width":
                      { "__repr": "600"
                      , "__type": "xsd:integer"
                      }
                    , "height":
                      { "__repr": "400"
                      , "__type": "xsd:integer"
                      }
                    }
                  , "zindex":
                    { "__repr": "11"
                    , "__type": "xsd:integer"
                    }
                  }
                ]
              }
            };
        var rdfdatabank = jQuery.rdf.databank()
            .base("")
            .prefix("shuffl",    "http://purl.org/NET/Shuffl/vocab#")
            .prefix("rdf",       "http://www.w3.org/1999/02/22-rdf-syntax-ns#")
            .prefix("rdfs",      "http://www.w3.org/2000/01/rdf-schema#")
            .prefix("owl",       "http://www.w3.org/2002/07/owl#")
            .prefix("xsd",       "http://www.w3.org/2001/XMLSchema#")
            .prefix("__default", "http://purl.org/NET/Shuffl/default#")

            .add("_:workspace rdf:type           shuffl:Workspace")
            .add("_:workspace shuffl:id          \"test-shuffl-workspace\"")
            .add("_:workspace shuffl:class       \"shuffl:Workspace\"")
            .add("_:workspace shuffl:version     \"0.1\"")
            .add("_:workspace shuffl:base-uri    \"#\"")

            .add("_:workspace shuffl:workspace _:ws")
            .add("_:ws shuffl:stockbar _:sl0")
            .add("_:sl0 rdf:type  rdf:List")
            .add("_:sl0 rdf:first _:sc0")
            .add("_:sl0 rdf:rest  _:sl1")           
            .add("_:sl1 rdf:type  rdf:List")
            .add("_:sl1 rdf:first _:sc1")
            .add("_:sl1 rdf:rest  _:sl2")
            .add("_:sl2 rdf:type  rdf:List")
            .add("_:sl2 rdf:first _:sc2")
            .add("_:sl2 rdf:rest  _:sl3")           
            .add("_:sl3 rdf:type  rdf:List")
            .add("_:sl3 rdf:first _:sc3")
            .add("_:sl3 rdf:rest  _:sl4")           
            .add("_:sl4 rdf:type  rdf:List")
            .add("_:sl4 rdf:first _:sc4")
            .add("_:sl4 rdf:rest  _:sl5")           
            .add("_:sl5 rdf:type  rdf:List")
            .add("_:sl5 rdf:first _:sc5")
            .add("_:sl5 rdf:rest  rdf:nil")           

            .add("_:sc0 __default:id    \"stockpile_1\"")
            .add("_:sc0 __default:class \"stock-yellow\"")
            .add("_:sc0 __default:label \"Ye\"")
            .add("_:sc0 __default:type  \"shuffl-freetext-yellow\"")
            .add("_:sc1 __default:id    \"stockpile_2\"")
            .add("_:sc1 __default:class \"stock-blue\"")
            .add("_:sc1 __default:label \"Bl\"")
            .add("_:sc1 __default:type  \"shuffl-freetext-blue\"")
            .add("_:sc2 __default:id    \"stockpile_3\"")
            .add("_:sc2 __default:class \"stock-green\"")
            .add("_:sc2 __default:label \"Gr\"")
            .add("_:sc2 __default:type  \"shuffl-freetext-green\"")
            .add("_:sc3 __default:id    \"stockpile_4\"")
            .add("_:sc3 __default:class \"stock-orange\"")
            .add("_:sc3 __default:label \"Or\"")
            .add("_:sc3 __default:type  \"shuffl-freetext-orange\"")
            .add("_:sc4 __default:id    \"stockpile_5\"")
            .add("_:sc4 __default:class \"stock-pink\"")
            .add("_:sc4 __default:label \"Pi\"")
            .add("_:sc4 __default:type  \"shuffl-freetext-pink\"")
            .add("_:sc5 __default:id    \"stockpile_6\"")
            .add("_:sc5 __default:class \"stock-purple\"")
            .add("_:sc5 __default:label \"Pu\"")
            .add("_:sc5 __default:type  \"shuffl-freetext-purple\"")

            .add("_:ws shuffl:layout _:l0")
            .add("_:l0 rdf:type  rdf:List")
            .add("_:l0 rdf:first _:c0")
            .add("_:l0 rdf:rest  _:l1")           
            .add("_:l1 rdf:type  rdf:List")
            .add("_:l1 rdf:first _:c1")
            .add("_:l1 rdf:rest  rdf:nil")

            .add("_:c0 __default:id \"card_1\"")
            .add("_:c0 __default:type \"shuffl-freetext-yellow\"")
            .add("_:c0 __default:data \"test-shuffl-card_1.json\"")
            .add("_:c0 __default:pos  _:p0")
              .add("_:p0 __default:left \"100\"^^xsd:integer")
              .add("_:p0 __default:top  \"30\"^^xsd:integer")

            .add("_:c1 __default:id \"card_2\"")
            .add("_:c1 __default:type \"shuffl-freetext-blue\"")
            .add("_:c1 __default:data \"test-shuffl-card_2.json\"")
            .add("_:c1 __default:pos  _:p1")
              .add("_:p1 __default:left \"400\"^^xsd:integer")
              .add("_:p1 __default:top  \"0\"^^xsd:integer")
            .add("_:c1 __default:size  _:s1")
              .add("_:s1 __default:width  \"600\"^^xsd:integer")
              .add("_:s1 __default:height \"400\"^^xsd:integer")
            .add("_:c1 __default:zindex   \"11\"^^xsd:integer")
            ;
        // Convert JRON to RDF databank
        var fromjron = jQuery.RDFfromJRON(jron);
        assertSameDatabankContents(fromjron, rdfdatabank, "Databank created from JRON");
        // Convert databank to JRON
        var tojron = jQuery.RDFtoJRON(rdfdatabank);
        assertSameJRON(tojron, jron, "JRON created from Databank");
        fromjron = jQuery.RDFfromJRON(tojron);
        assertSameDatabankContents(fromjron, rdfdatabank, "Databank round-tripped via JRON");
    });

    //TODO: Multiple statements with different subjects

    //TODO: Use regular JSON for numbers, Booleans

};

// End
