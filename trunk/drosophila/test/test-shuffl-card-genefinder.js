/**
 * @fileoverview
 *  Test suite for Drosophila gene finder card
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
testcardgenefinder_carddata =
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
      , 'drosophila:flybaseid': "FBgn0036925"
      }
    };

/**
 * Function to register tests
 */
TestGeneFinder = function()
{
    module("TestGeneFinder");

    test("shuffl.addCardFactories",
        function () 
        {
            log.debug("test shuffl.addCardFactories");
        		equals(shuffl.CardFactoryMap['shuffl-genefinder-yellow'].cardcss, "stock-yellow", "shuffl-genefinder factory map");
        		equals(shuffl.CardFactoryMap['shuffl-genefinder-blue'].cardcss, "stock-blue", "shuffl-genefinder factory map");
        		equals(shuffl.CardFactoryMap['shuffl-genefinder-green'].cardcss, "stock-green", "shuffl-genefinder factory map");
        		equals(shuffl.CardFactoryMap['shuffl-genefinder-orange'].cardcss, "stock-orange", "shuffl-genefinder factory map");
        		equals(shuffl.CardFactoryMap['shuffl-genefinder-pink'].cardcss, "stock-pink", "shuffl-genefinder factory map");
        		equals(shuffl.CardFactoryMap['shuffl-genefinder-purple'].cardcss, "stock-purple", "shuffl-genefinder factory map");
        });
    
    test("shuffl.getCardFactories",
        function () 
        {
            log.debug("test shuffl.getCardFactories");
            var c0 = shuffl.getCardFactory("default-type");
            equals(typeof c0, "function", "default factory");
        		var c1 = shuffl.getCardFactory("shuffl-genefinder-yellow");
        		equals(typeof c1, "function", "retrieved selectfile factory");
        });

    test("shuffl.card.genefinder.newCard",
        function () 
        {
            log.debug("test shuffl.card.genefinder.newCard");
            var css = 'stock-green';
        		var c   = shuffl.card.genefinder.newCard("shuffl-genefinder-green", css, "card-11",
        			{ 'drosophila:genename': "schuy"
        			, 'drosophila:flybaseid': "FBgn0036925"
        			});
        		equals(c.attr('id'), "card-11", "card id attribute");
            ok(c.hasClass('stock-green'),   "stock-green class");
            equals(c.attr('class'), 'shuffl-card-autosize stock-green', "CSS class");
        		equals(c.find("cgenename").text(), "schuy", "gene name field");
        		equals(c.find("cflybaseid").text(), "FBgn0036925", "FlyBase Id field");
        });

    test("shuffl.createStockpiles",
        function ()
        {
            log.debug("test shuffl.createStockpiles");
            equals(jQuery('#stockbar').children().length, 1, "old stockbar content");
        		var s1 = shuffl.createStockpile(
        			"stock_1", "stock-blue", "GeneFinder", "shuffl-genefinder-blue");
        		equals(jQuery('#stockbar').children().length, 3, "new stockbar content");
        		//1
        		equals(s1.attr('id'), "stock_1", "stock 1 id");
      	    ok(s1.hasClass("stock-blue"), "stock 1 class");
      	    equals(s1.text(), "GeneFinder", "stock 1 label");
      	    equals(typeof s1.data('makeCard'), "function", "stock 1 function");
      	    equals(s1.data('CardType'), "shuffl-genefinder-blue", "stock 1 type");
        });

    test("shuffl.createCardFromStock",
        function () 
        {
            log.debug("test shuffl.createCardFromStock");
        		var s = shuffl.createStockpile(
        			"stock_id", "stock-pink", "GeneFinder", "shuffl-genefinder-pink");
        		var c = shuffl.createCardFromStock(jQuery("#stock_id"));
            log.debug("- card "+shuffl.objectString(c));
        		var card_id = shuffl.lastId("card_");
            equals(c.attr('id'), card_id,       "card id attribute");
            ok(c.hasClass('shuffl-card'),       "shuffl card class");
            ok(c.hasClass('shuffl-card-autosize'), "shuffl-card-autosize class");
            ok(c.hasClass('stock-pink'),        "stock-pink class");
            equals(c.attr('class'), 'shuffl-card-autosize stock-pink shuffl-card', "CSS class");
            equals(c.find("cgenename").text(),  "(gene name here)", "card gene name field");
            equals(c.find("cflybaseid").text(), "(flybase id here)", "card flybase id field");
            // Check saved card data
            equals(c.data('drosophila:genename'),  "(gene name here)", "model gene name");
            equals(c.data('drosophila:flybaseid'), "(flybase id here)", "model gene name");
        });

    test("shuffl.createCardFromData",
        function () 
        {
            log.debug("test shuffl.createCardFromData");
            var d = testcardgenefinder_carddata;
            var c = shuffl.createCardFromData("cardfromdata_id", "shuffl-genefinder-orange", d);
            // Check card details
            equals(c.attr('id'), "cardfromdata_id", "card id attribute");
            ok(c.hasClass('shuffl-card-autosize'), "shuffl card class");
            ok(c.hasClass('stock-orange'),     "CSS class");
            equals(c.find("cgenename").text(),  "schuy", "card gene name field");
            equals(c.find("cflybaseid").text(), "FBgn0036925", "card Flybase Id field");
            same(c.data('shuffl:external'), d,  "card data");
        });

    test("shuffl.createDataFromCard",
        function ()
        {
            log.debug("test shuffl.createDataFromCard");
            // Create card (copy of code already tested)
            var d = testcardgenefinder_carddata;
            var c = shuffl.createCardFromData("cardfromdata_id", "shuffl-genefinder-yellow", d);
            // (Re)create data and test
            var e = shuffl.createDataFromCard(c);
            same(e['__prefixes'], d['__prefixes'], '__prefixes');
            equals(e['rdf:type']['__iri'],  "shuffl:Card",             'rdf:type');
            equals(e['shuffl:id'],          "cardfromdata_id",         'shuffl:id');
            equals(e['shuffl:type'],        "shuffl-genefinder-yellow", 'shuffl:type');
            equals(e['shuffl:version'],     d['shuffl:version'],       'shuffl:version');
            equals(e['shuffl:base-uri'],    d['shuffl:base-uri'],      'shuffl:base-uri');
            equals(e['shuffl:data']['drosophila:genename'], "schuy",   'shuffl:data-genename');
            equals(e['shuffl:data']['drosophila:flybaseid'], "FBgn0036925", 'shuffl:data-flybaseid');
        });

    test("shuffl.card.genefinder model setting",
        function ()
        {
            log.debug("shuffl.card.genefinder model setting");
            // Create card (copy of code already tested)
            var d = testcardgenefinder_carddata;
            var c = shuffl.createCardFromData("cardfromdata_id", "shuffl-genefinder-yellow", d);
            // Check card content
            equals(c.find("cgenename").text(), "schuy", "gene input field");
            equals(c.find("cflybaseid").text(), "FBgn0036925", "Flybase Id field");
            // Simulate user input: set model to update title, tags and body text
            c.model('drosophila:genename', "rbf");
            equals(c.find("cgenename").text(), "rbf", "gene input field");
            c.model('drosophila:flybaseid', "");
            equals(c.find("flybaseid").text(), "", "FlyBase Id field");
      });

};

// End
