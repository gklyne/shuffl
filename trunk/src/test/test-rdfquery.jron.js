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
            };
        var rdfdatabank = jQuery.rdf.databank()
            .base("http://example.com/card#")
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
    
    //TODO: test case with empty list

    //TODO: Multiple statements with different subjects

};

// End
