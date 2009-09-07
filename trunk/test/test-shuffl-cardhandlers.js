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
            log.debug("test shuffl.addCardFactory")
    		same(shuffl.CardFactoryMap, {}, "CardFactoryMap initially empty");
    		shuffl.addCardFactory("test-type", "test-css", shuffl.makeDefaultCard);
    		equals(shuffl.CardFactoryMap['test-type'].cardcss, "test-css", "CardFactoryMap with one entry");
        });

    test("shuffl.getCardFactory",
        function () {
            log.debug("test shuffl.getCardFactory")
    		var c1 = shuffl.getCardFactory("test-type");
    		equals(typeof c1, "function", "retrieved factory");
    		var c2 = shuffl.getCardFactory("default-type");
    		equals(typeof c2, "function", "default factory");
        });

    test("shuffl.makeDefaultCard",
        function () {
            log.debug("test shuffl.makeDefaultCard")
            var css = 'stock-default';
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
            log.debug("test shuffl.createStockpile")
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
            log.debug("test shuffl.createCardFromStock");
            // Note: type 'test-type' matches factory added earlier
			var s = shuffl.createStockpile(
			    "stock_id", "stock-class", "stock-label", "test-type");
    		var c = shuffl.createCardFromStock(s);
            equals(c.attr('id'), "card_101", "card id attribute");
            ok(c.hasClass('shuffl-card'),   "shuffl card class");
            ok(c.hasClass('test-css'),      "test class");
            equals(c.attr('class'), 'shuffl-card test-css', "default class");
            equals(c.find("cident").text(), "card_101", "card id field");
            equals(c.find("cclass").text(), "test-type", "card class field");
            equals(c.find("ctitle").text(), "card_101 - class test-type", "card title field");
            equals(c.find("ctags").text(),  "card_101 test-type", "card tags field");
        });

    test("shuffl.createCardFromData",
        function () {
            log.debug("test shuffl.createCardFromData")
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
            var c = shuffl.createCardFromData("cardfromdata_id", "test-type", d);
            // Check card details
            equals(c.attr('id'), "cardfromdata_id", "card id attribute");
            ok(c.hasClass('shuffl-card'),   "shuffl card type");
            ok(c.hasClass('test-css'),      "CSS class");
            equals(c.find("cident").text(), "cardfromdata_id", "card id field");
            equals(c.find("cclass").text(), "test-type", "card class field");
            equals(c.find("ctitle").text(), "Card 1 title here", "card title field");
            equals(c.find("ctags").text(),  "card_1_tag footag", "card tags field");
            same(c.data('shuffl:external'), d, "card data");
        });

    test("shuffl.placeCardFromData",
        function () {
            log.debug("test shuffl.placeCardFromData")
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
            shuffl.placeCardFromData(l, d);
            var c = jQuery("#card_id");
            // Check card details
            equals(c.attr('id'), "card_id", "card id attribute");
            ok(c.hasClass('shuffl-card'),   "shuffl card class");
            ok(c.hasClass('test-css'),      "CSS class");
            equals(c.find("cident").text(), "card_id", "card id field");
            equals(c.find("cclass").text(), "test-type", "card class field");
            equals(c.find("ctitle").text(), "Card 1 title here", "card title field");
            equals(c.find("ctags").text(),  "card_1_tag footag", "card tags field");
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
            log.debug("test shuffl.createDataFromCard");
            // Create card (copy of code already tested)
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
                  { 'shuffl:title':   "Card 1 title"
                  , 'shuffl:tags':    [ 'card_1_tag', 'footag' ]
                  , 'shuffl:text':    "Card 1 free-form text here<br/>line 2<br/>line3<br/>yellow"
                  }
                };
            equals(d['shuffl:id'], 'card_id', 'd:card-id (1)');
            var c = shuffl.createCardFromData("cardfromdata_id", "test-type", d);
            equals(d['shuffl:id'], 'card_id', 'd:card-id (2)'); // Test original not trashed
            // (Re)create data and test
            var e = shuffl.createDataFromCard(c);
            equals(d['shuffl:id'], 'card_id', 'd:card-id (3)'); // Test original still not trashed
            equals(d['shuffl:data']['shuffl:title'], 'Card 1 title', 'd:card-title');
            equals(e['shuffl:id'],          "cardfromdata_id",         'shuffl:id');
            equals(e['shuffl:class'],       d['shuffl:class'],         'shuffl:class');
            equals(e['shuffl:version'],     d['shuffl:version'],       'shuffl:version');
            equals(e['shuffl:location'],    d['shuffl:location'],      'shuffl:location');
            equals(e['shuffl:base-uri'],    d['shuffl:base-uri'],      'shuffl:base-uri');
            same(e['shuffl:uses-prefixes'], d['shuffl:uses-prefixes'], 'shuffl:uses-prefixes');
            equals(e['shuffl:data']['shuffl:title'], "Card 1 title",   'shuffl:data-title');
            same(e['shuffl:data']['shuffl:tags'],  [ 'card_1_tag', 'footag' ],   'shuffl:data-tags');
            equals(e['shuffl:data']['shuffl:text'],  undefined,        'shuffl:data-text');
        });

    test("shuffl.lineEditable",
        function () {
            log.debug("test shuffl.lineEditable")
            ok(false, "shuffl.lineEditable");
        });

    test("shuffl.blockEditable",
        function () {
            log.debug("test shuffl.blockEditable")
            ok(false, "shuffl.blockEditable");
        });

    test("shuffl.placeCard",
        function () {
            log.debug("test shuffl.placeCard")
            ok(false, "shuffl.placeCard");
        });

    test("shuffl.dropCard",
        function () {
            log.debug("test shuffl.dropCard")
            ok(false, "shuffl.dropCard");
        });

};

// End
