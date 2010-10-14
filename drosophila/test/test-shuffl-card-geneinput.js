/**
 * @fileoverview
 *  Test suite for Drosophila gene name entry card
 *  
 * @author Graham Klyne
 * @version $Id: $
 * 
 * Coypyright (C) 2009, University of Oxford
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
testcardgeneinput_carddata =
    { "__prefixes":
      { "shuffl:": "http://purl.org/NET/Shuffl/vocab#"
      , "rdf:":    "http://www.w3.org/1999/02/22-rdf-syntax-ns#"
      , "rdfs:":   "http://www.w3.org/2000/01/rdf-schema#"
      , "owl:":    "http://www.w3.org/2002/07/owl#"
      , "xsd:":    "http://www.w3.org/2001/XMLSchema#"
      , "":        "http://purl.org/NET/Shuffl/default#"
      }
    , "rdf:type":  { "__iri": "shuffl:Card" }
    , 'shuffl:id':        'card_N'
    , 'shuffl:type':      'shuffl-freetext-ZZZZZZ'
    , 'shuffl:version':   '0.1'
    , 'shuffl:base-uri':  '#'
    , 'shuffl:data':
      { 'drosophila:genename': "schuy"
      }
    };

/**
 * Function to register tests
 */
TestGeneInput = function()
{
    module("TestGeneInput");

    test("shuffl.addCardFactories",
        function () {
            log.debug("test shuffl.addCardFactories");
    		equals(shuffl.CardFactoryMap['shuffl-geneinput-yellow'].cardcss, "stock-yellow", "shuffl-geneinput factory map");
    		equals(shuffl.CardFactoryMap['shuffl-geneinput-blue'].cardcss, "stock-blue", "shuffl-geneinput factory map");
    		equals(shuffl.CardFactoryMap['shuffl-geneinput-green'].cardcss, "stock-green", "shuffl-geneinput factory map");
    		equals(shuffl.CardFactoryMap['shuffl-geneinput-orange'].cardcss, "stock-orange", "shuffl-geneinput factory map");
    		equals(shuffl.CardFactoryMap['shuffl-geneinput-pink'].cardcss, "stock-pink", "shuffl-geneinput factory map");
    		equals(shuffl.CardFactoryMap['shuffl-geneinput-purple'].cardcss, "stock-purple", "shuffl-geneinput factory map");
        });
    
    test("shuffl.getCardFactories",
        function () {
            log.debug("test shuffl.getCardFactories");
            var c0 = shuffl.getCardFactory("default-type");
            equals(typeof c0, "function", "default factory");
    		var c1 = shuffl.getCardFactory("shuffl-geneinput-yellow");
    		equals(typeof c1, "function", "retrieved selectfile factory");
        });

    test("shuffl.card.geneinput.newCard",
        function () {
            log.debug("test shuffl.card.geneinput.newCard");
            var css = 'stock-green';
    		var c   = shuffl.card.geneinput.newCard("shuffl-geneinput-green", css, "card-11",
    			{ 'drosophila:genename': "schuy"
    			});
    		equals(c.attr('id'), "card-11", "card id attribute");
            ok(c.hasClass('stock-green'),   "stock-green class");
            equals(c.attr('class'), 'shuffl-card-autosize stock-green', "CSS class");
    		equals(c.find("cgenename").text(), "schuy", "gene name field");
    });

    test("shuffl.createStockpiles",
        function () {
            log.debug("test shuffl.createStockpiles");
            equals(jQuery('#stockbar').children().length, 1, "old stockbar content");
    		var s1 = shuffl.createStockpile(
    			"stock_1", "stock-blue", "Gene", "shuffl-geneinput-blue");
    		equals(jQuery('#stockbar').children().length, 3, "new stockbar content");
    		//1
    		equals(s1.attr('id'), "stock_1", "stock 1 id");
    	    ok(s1.hasClass("stock-blue"), "stock 1 class");
    	    equals(s1.text(), "Gene", "stock 1 label");
    	    equals(typeof s1.data('makeCard'), "function", "stock 1 function");
    	    equals(s1.data('CardType'), "shuffl-geneinput-blue", "stock 1 type");
    });

    test("shuffl.createCardFromStock",
        function () {
            log.debug("test shuffl.createCardFromStock");
    		var s = shuffl.createStockpile(
    			"stock_id", "stock-pink", "Gene", "shuffl-geneinput-pink");
    		var c = shuffl.createCardFromStock(jQuery("#stock_id"));
            log.debug("- card "+shuffl.objectString(c));
    		var card_id = shuffl.lastId("card_");
            equals(c.attr('id'), card_id,       "card id attribute");
            ok(c.hasClass('shuffl-card'),   "shuffl card class");
            ok(c.hasClass('shuffl-card-autosize'),   "shuffl-card-autosize class");
            ok(c.hasClass('stock-pink'),   "stock-pink class");
            equals(c.attr('class'), 'shuffl-card-autosize stock-pink shuffl-card', "CSS class");
            equals(c.find("cgenename").text(),  "(gene name here)", "card gene name field");
            // Check saved card data
            equals(c.data('drosophila:genename'), "(gene name here)", "model gene name");
         });

    test("shuffl.createCardFromData",
        function () {
            log.debug("test shuffl.createCardFromData");
            var d = testcardgeneinput_carddata;
            var c = shuffl.createCardFromData("cardfromdata_id", "shuffl-geneinput-orange", d);
            // Check card details
            equals(c.attr('id'), "cardfromdata_id", "card id attribute");
            ok(c.hasClass('shuffl-card-autosize'), "shuffl card class");
            ok(c.hasClass('stock-orange'),     "CSS class");
            equals(c.find("cgenename").text(),  "schuy", "card gene name field");
            same(c.data('shuffl:external'), d,  "card data");
        });

    test("shuffl.createDataFromCard",
        function () {
            log.debug("test shuffl.createDataFromCard");
            // Create card (copy of code already tested)
            var d = testcardgeneinput_carddata;
            var c = shuffl.createCardFromData("cardfromdata_id", "shuffl-geneinput-yellow", d);
            // (Re)create data and test
            var e = shuffl.createDataFromCard(c);
            same(e['__prefixes'], d['__prefixes'], '__prefixes');
            equals(e['shuffl:id'],          "cardfromdata_id",         'shuffl:id');
            equals(e['shuffl:type'],        "shuffl-geneinput-yellow", 'shuffl:type');
            equals(e['shuffl:version'],     d['shuffl:version'],       'shuffl:version');
            equals(e['shuffl:base-uri'],    d['shuffl:base-uri'],      'shuffl:base-uri');
            equals(e['shuffl:data']['drosophila:genename'], "schuy",   'shuffl:data-genename');
        });

    test("shuffl.card.geneinput model setting",
        function () {
            log.debug("shuffl.card.geneinput model setting");
            // Create card (copy of code already tested)
            var d = testcardgeneinput_carddata;
            var c = shuffl.createCardFromData("cardfromdata_id", "shuffl-geneinput-yellow", d);
            // Check card content
            equals(c.find("cgenename").text(), "schuy", "gene input field");
            // Simulate user input: set model to update title, tags and body text
            c.model('drosophila:genename', "rbf");
            equals(c.find("cgenename").text(), "rbf", "gene input field");
    });

};

// End
