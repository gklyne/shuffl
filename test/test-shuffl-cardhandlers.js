// $Id$

/**
 * Test suite for card factory and common handling functions
 */

/**
 * Function to register tests
 */

TestCardHandlers = function() {

    module("TestCardHandlers");

/*
    test("....",
        function () {
            expect(6);
            m.eval(function (val, callback) {this.saved = val; callback(val+1); });
            m.exec(0,
                function(val) {
                    equals(val, 3, "final return value");
                    equals(this.saved, 2, "manually saved parameter");
                    ok(state, "message");
                });
        });
*/

    test("shuffl.addCardFactory",
        function () {
    		same(shuffl.CardFactoryMap, {}, "CardFactoryMap initially empty");
    		shuffl.addCardFactory("test-type", "test-css", shuffl.makeDefaultCard);
    		equals(shuffl.CardFactoryMap['test-type'].cardcss, "test-css", "CardFactoryMap with one entry");
        });

    test("shuffl.getCardFactory",
        function () {
    		var c1 = shuffl.getCardFactory("test-type");
    		equals(typeof c1, "function", "retrieved factory");
    		var c2 = shuffl.getCardFactory("default-type");
    		equals(typeof c2, "function", "default factory");
        });

    test("shuffl.makeDefaultCard",
        function () {
            var css = undefined;
    		var c   = shuffl.makeDefaultCard("card-type", css, "card-id",
    			{ 'shuffl:tags': 	["card-tag"]
    			, 'shuffl:title':	"card-title"
    			});
    		equals(c.attr('id'), "card-id", "card id attribute");
            ok(c.hasClass('shuffl-card'),   "shuffl card class");
            ok(c.hasClass('stock-default'), "default class");
    		equals(c.find("cident").text(), "card-id", "card id field");
    		equals(c.find("cclass").text(), "card-type", "card class field");
    		equals(c.find("ctitle").text(), "card-title", "card title field");
    		equals(c.find("ctags").text(),  "card-tag", "card tags field");
        });

    test("shuffl.createStockpile",
        function () {
    		var s = shuffl.createStockpile(
    			"stock_id", "stock-class", "stock-label", "test-type");
    	    equals(s.attr('id'), "stock_id", "Stock id");
    	    ok(s.hasClass("stock-class"), "stock class");
    	    equals(s.text(), "stock-label", "stock-label");
    	    equals(typeof s.data('makeCard'), "function");
    	    equals(s.data('CardType'), "test-type");
    });

    test("shuffl.createCardFromStock",
        function () {
			var s = shuffl.createStockpile(
			    "stock_id", "stock-class", "stock-label", "test-type");
    		var c = shuffl.createCardFromStock(s);
            equals(c.attr('id'), "card_101", "card id attribute");
            ok(c.hasClass('shuffl-card'),   "shuffl card class");
            ok(c.hasClass('stock-default'), "default class");
            equals(c.find("cident").text(), "card_101", "card id field");
            equals(c.find("cclass").text(), "test-type", "card class field");
            equals(c.find("ctitle").text(), "card_101 - class test-type", "card title field");
            equals(c.find("ctags").text(),  "card_101 test-type", "card tags field");
        });

    test("shuffl.createCardFromData",
        function () {
            ok(false, "shuffl.createCardFromData");
        });

    test("shuffl.placeCardFromData",
        function () {
            var l = 
                { 'id':     'layout_1'
                , 'class':  'layout-class'
                , 'data':   'shuffl_sample_2_card_1.json'
                , 'pos':    {left:100, top:30}
                };
            var d = 
                { 'shuffl:id':        'card_id'
                , 'shuffl:class':     'test-type'
                , 'shuffl:version':   '0.1'
                , 'shuffl:location':  'http://localhost:8080/.../card_1'
                , 'shuffl:base-uri':  '#'
                , 'shuffl:uses-prefixes':
                  [ { 'shuffl:prefix':  'shuffl', 'shuffl:uri': 'http://purl.org/NET/Shuffl/vocab#' }
                  , { 'shuffl:prefix':  'rdf',    'shuffl:uri': 'http://www.w3.org/1999/02/22-rdf-syntax-ns#' }
                  , { 'shuffl:prefix':  'rdfs',   'shuffl:uri': 'http://www.w3.org/2000/01/rdf-schema#' }
                  , { 'shuffl:prefix':  'owl',    'shuffl:uri': 'http://www.w3.org/2002/07/owl#' }
                  , { 'shuffl:prefix':  'xsd',    'shuffl:uri': 'http://www.w3.org/2001/XMLSchema#' }
                  ]
                , 'shuffl:data':
                  { 'shuffl:title':   "Card 1 title here"
                  , 'shuffl:tags':    [ 'card_1_tag', 'footag' ]
                  , 'shuffl:text':    "Card 1 free-form text here<br/>line 2<br/>line3<br/>yellow"
                  }
                };
            log.debug("test shuffl.placeCardFromData");
            shuffl.placeCardFromData(l, d);
            var c = jQuery("#card_id");
            // Check card details
            equals(c.attr('id'), "card_id", "card id attribute");
            ok(c.hasClass('shuffl-card'),   "shuffl card class");
            ok(c.hasClass('stock-default'), "default class");
            equals(c.find("cident").text(), "card_id", "card id field");
            equals(c.find("cclass").text(), "test-type", "card class field");
            equals(c.find("ctitle").text(), "card_id - class test-type", "card title field");
            equals(c.find("ctags").text(),  "card_id test-type", "card tags field");
            // Check layout details
            equals(c.data('shuffl:id'),    "card_id",   "layout card id");
            equals(c.data('shuffl:class'), "test-type", "layout card class");
            same(c.data('shuffl:external'), d, "card data");
            var p = c.position();
            equals(Math.floor(p.left), 100, "position-left");
            equals(Math.floor(p.top),  30,  "position-top");
            equals(c.css("zIndex"), "11", "card zIndex");
        });

    test("shuffl.createDataFromCard",
        function () {
            ok(false, "shuffl.createDataFromCard");
        });

    test("shuffl.lineEditable",
        function () {
            ok(false, "shuffl.lineEditable");
        });

    test("shuffl.blockEditable",
        function () {
            ok(false, "shuffl.blockEditable");
        });

    test("shuffl.placeCard",
        function () {
            ok(false, "shuffl.placeCard");
        });

    test("shuffl.dropCard",
        function () {
            ok(false, "shuffl.dropCard");
        });

};

// End
