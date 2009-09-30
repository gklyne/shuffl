// $Id$

/**
 * Test suite for free text card functions
 */
var TestDataTable =
    [ [ "",      "col1",  "col2",  "col3" ]
    , [ "row_1", "1.11",  "1.22",  "1.33" ]
    , [ "row_2", "2.11",  "2.22",  "2.33" ]
    , [ "End." ]
    ];

/**
 * Data
 */
var testcarddatatable_carddata = 
    { 'shuffl:id':        'card_N'
    , 'shuffl:class':     'shuffl-datatable-ZZZZZZ'
    , 'shuffl:version':   '0.1'
    , 'shuffl:base-uri':  '#'
    , 'shuffl:uses-prefixes':
      [ { 'shuffl:prefix':  'shuffl', 'shuffl:uri': 'http://purl.org/NET/Shuffl/vocab#' }
      , { 'shuffl:prefix':  'rdf',    'shuffl:uri': 'http://www.w3.org/1999/02/22-rdf-syntax-ns#' }
      , { 'shuffl:prefix':  'rdfs',   'shuffl:uri': 'http://www.w3.org/2000/01/rdf-schema#' }
      , { 'shuffl:prefix':  'owl',    'shuffl:uri': 'http://www.w3.org/2002/07/owl#' }
      , { 'shuffl:prefix':  'xsd',    'shuffl:uri': 'http://www.w3.org/2001/XMLSchema#' }
      ]
    , 'shuffl:data':
      { 'shuffl:title':   "Card N title"
      , 'shuffl:tags':    [ 'card_N_tag', 'footag' ]
      , 'shuffl:table':   TestDataTable
      }
    };

/**
 * Function to register tests
 */

TestCardDatatable = function() {

    module("TestCardDatatable");

    test("shuffl.addCardFactories",
        function () {
            log.debug("test shuffl.addCardFactories");
            // Card factories are created when shuffl-card-datatable module is loaded
    		equals(shuffl.CardFactoryMap['shuffl-datatable-yellow'].cardcss, "stock-yellow", "shuffl-datatable-yellow");
            equals(shuffl.CardFactoryMap['shuffl-datatable-blue'  ].cardcss, "stock-blue",   "shuffl-datatable-blue");
            equals(shuffl.CardFactoryMap['shuffl-datatable-green' ].cardcss, "stock-green",  "shuffl-datatable-green");
            equals(shuffl.CardFactoryMap['shuffl-datatable-orange'].cardcss, "stock-orange", "shuffl-datatable-orange");
            equals(shuffl.CardFactoryMap['shuffl-datatable-pink'  ].cardcss, "stock-pink",   "shuffl-datatable-pink");
            equals(shuffl.CardFactoryMap['shuffl-datatable-purple'].cardcss, "stock-purple", "shuffl-datatable-purple");
        });
    
    test("shuffl.getCardFactories",
        function () {
            log.debug("test shuffl.getCardFactories");
            var c0 = shuffl.getCardFactory("default-type");
            equals(typeof c0, "function", "default factory");
    		var c1 = shuffl.getCardFactory("shuffl-datatable-yellow");
    		equals(typeof c1, "function", "retrieved factory yellow");
            var c2 = shuffl.getCardFactory("shuffl-datatable-blue");
            equals(typeof c2, "function", "retrieved factory blue");
            var c3 = shuffl.getCardFactory("shuffl-datatable-green");
            equals(typeof c3, "function", "retrieved factory green");
            var c4 = shuffl.getCardFactory("shuffl-datatable-orange");
            equals(typeof c4, "function", "retrieved factory orange");
            var c5 = shuffl.getCardFactory("shuffl-datatable-pink");
            equals(typeof c5, "function", "retrieved factory pink");
            var c6 = shuffl.getCardFactory("shuffl-datatable-purple");
            equals(typeof c6, "function", "retrieved factory purple");
        });

    test("shuffl.card.datatable.newCard",
        function () {
            log.debug("test shuffl.card.datatable.newCard");
            var css = 'stock-yellow';
            var c   = shuffl.card.datatable.newCard("shuffl-datatable-yellow", css, "card-1",
            	{ 'shuffl:tags': 	["card-tag"]
            	, 'shuffl:title':	"card-title"
            	, 'shuffl:table':   TestDataTable
            	});
            equals(c.attr('id'), "card-1", "card id attribute");
            ok(c.hasClass('stock-yellow'),  "yellow colour class");
            ok(c.hasClass('shuffl-card-setsize'),   "shuffl card setsize class");
            equals(c.attr('class'), 'shuffl-card-setsize stock-yellow ui-resizable', "CSS class");
            equals(c.find("cident").text(), "card-1", "card id field");
            equals(c.find("cclass").text(), "shuffl-datatable-yellow", "card class field");
            equals(c.find("ctitle").text(), "card-title", "card title field");
            equals(c.find("ctags").text(),  "card-tag", "card tags field");
            equals(c.find("cbody").children().get(0).tagName.toLowerCase(), "table", "card body contains <table>");
            same(c.find("cbody").table(),   TestDataTable, "card data table");
            //log.debug("- table :"+jQuery.toJSON(c.find("cbody").table()));
        });

    test("shuffl.createStockpiles",
        function () {
            log.debug("test shuffl.createStockpiles");
            equals(jQuery('#stockbar').children().length, 1, "old stockbar content");
    		var s1 = shuffl.createStockpile(
    			"stock_1", "stock-yellow", "Y", "shuffl-datatable-yellow");
            var s2 = shuffl.createStockpile(
                "stock_2", "stock-blue", "B", "shuffl-datatable-blue");
            var s3 = shuffl.createStockpile(
                "stock_3", "stock-green", "G", "shuffl-datatable-green");
            var s4 = shuffl.createStockpile(
                "stock_4", "stock-orange", "O", "shuffl-datatable-orange");
            var s5 = shuffl.createStockpile(
                "stock_5", "stock-pink", "P", "shuffl-datatable-pink");
            var s6 = shuffl.createStockpile(
                "stock_6", "stock-purple", "P", "shuffl-datatable-purple");
    		equals(jQuery('#stockbar').children().length, 13, "new stockbar content");
    		//1
    		equals(s1.attr('id'), "stock_1", "stock 1 id");
    	    ok(s1.hasClass("stock-yellow"), "stock 1 class");
    	    equals(s1.text(), "Y", "stock 1 label");
    	    equals(typeof s1.data('makeCard'), "function", "stock 1 function");
    	    equals(s1.data('CardType'), "shuffl-datatable-yellow", "stock 1 type");
    	    //2
            equals(s2.attr('id'), "stock_2", "stock 2 id");
            ok(s2.hasClass("stock-blue"), "stock 2 class");
            equals(s2.text(), "B", "stock 2 label");
            equals(typeof s2.data('makeCard'), "function", "stock 2 function");
            equals(s2.data('CardType'), "shuffl-datatable-blue", "stock 2 type");
            //3
            equals(s3.attr('id'), "stock_3", "stock 3 id");
            ok(s3.hasClass("stock-green"), "stock 3 class");
            equals(s3.text(), "G", "stock 3 label");
            equals(typeof s3.data('makeCard'), "function", "stock 3 function");
            equals(s3.data('CardType'), "shuffl-datatable-green", "stock 3 type");
            //4
            equals(s4.attr('id'), "stock_4", "stock 4 id");
            ok(s4.hasClass("stock-orange"), "stock 4 class");
            equals(s4.text(), "O", "stock 4 label");
            equals(typeof s4.data('makeCard'), "function", "stock 4 function");
            equals(s4.data('CardType'), "shuffl-datatable-orange", "stock 4 type");
            //5
            equals(s5.attr('id'), "stock_5", "stock 5 id");
            ok(s5.hasClass("stock-pink"), "stock 5 class");
            equals(s5.text(), "P", "stock 5 label");
            equals(typeof s5.data('makeCard'), "function", "stock 5 function");
            equals(s5.data('CardType'), "shuffl-datatable-pink", "stock 5 type");
            //6
            equals(s6.attr('id'), "stock_6", "stock 6 id");
            ok(s6.hasClass("stock-purple"), "stock 6 class");
            equals(s6.text(), "P", "stock 6 label");
            equals(typeof s6.data('makeCard'), "function", "stock 6 function");
            equals(s6.data('CardType'), "shuffl-datatable-purple", "stock 6 type");
    });

    test("shuffl.createCardFromStock",
        function () {
            log.debug("test shuffl.createCardFromStock");
			var s = shuffl.createStockpile(
			    "stock_id", "stock-green", "stock-label", "shuffl-datatable-green");
    		var c = shuffl.createCardFromStock(jQuery("#stock_id"));
            log.debug("- card "+shuffl.objectString(c));
    		var card_id = shuffl.lastId("card_");
            equals(c.attr('id'), card_id, "card id attribute");
            ok(c.hasClass('shuffl-card'),   "shuffl card class");
            ok(c.hasClass('shuffl-card-setsize'),   "shuffl card setsize class");
            ok(c.hasClass('stock-green'),   "stock-green");
            ok(c.hasClass('ui-resizable'),  "ui-resizable");
            equals(c.attr('class'), 'shuffl-card-setsize stock-green ui-resizable shuffl-card', "CSS class");
            equals(c.find("cident").text(), card_id, "card id field");
            equals(c.find("cclass").text(), "shuffl-datatable-green", "card type");
            equals(c.find("ctitle").text(), card_id+" - type shuffl-datatable-green", "card title field");
            equals(c.find("ctags").text(),  card_id+",shuffl-datatable-green", "card tags field");
            equals(c.find("cbody").children().get(0).tagName.toLowerCase(), "table", "card body contains <table>");
            // Check saved card data
            var d = testcarddatatable_carddata;
            equals(c.data('shuffl:id'),    card_id, "layout card id");
            equals(c.data('shuffl:class'), "shuffl-datatable-green", "saved card type");
            equals(c.data('shuffl:external')['shuffl:id'],          card_id, "card data id");
            equals(c.data('shuffl:external')['shuffl:class'],       "shuffl-datatable-green", "card data class");
            equals(c.data('shuffl:external')['shuffl:version'],     d['shuffl:version'], "card data version");
            equals(c.data('shuffl:external')['shuffl:base-uri'],    d['shuffl:base-uri'], "card data base-uri");
            same(c.data('shuffl:external')['shuffl:uses-prefixes'], d['shuffl:uses-prefixes'], "card data uses-prefixes");
            equals(c.data('shuffl:external')['shuffl:data'],        undefined, "card data");
        });

    test("shuffl.createCardFromData",
        function () {
            log.debug("test shuffl.createCardFromData");
            var d = testcarddatatable_carddata;
            var c = shuffl.createCardFromData("cardfromdata_id", "shuffl-datatable-orange", d);
            // Check card details
            equals(c.attr('id'), "cardfromdata_id", "card id attribute");
            ok(c.hasClass('shuffl-card'),   "shuffl card type");
            ok(c.hasClass('shuffl-card-setsize'),   "shuffl card setsize class");
            ok(c.hasClass('stock-orange'),  "stock-orange class");
            equals(c.attr('class'), 'shuffl-card-setsize stock-orange ui-resizable shuffl-card', "CSS class");
            equals(c.find("cident").text(), "cardfromdata_id", "card id field");
            equals(c.find("cclass").text(), "shuffl-datatable-orange", "card class field");
            equals(c.find("ctitle").text(), "Card N title", "card title field");
            equals(c.find("ctags").text(),  "card_N_tag,footag", "card tags field");
            equals(c.find("cbody").children().get(0).tagName.toLowerCase(), "table", "card body contains <table>");
            same(c.find("cbody").table(),   TestDataTable, "card data table");
            same(c.data('shuffl:external'), d, "card data");
        });

    test("shuffl.createDataFromCard",
        function () {
            log.debug("test shuffl.createDataFromCard");
            // Create card (copy of code already tested)
            var d = testcarddatatable_carddata;
            var c = shuffl.createCardFromData("cardfromdata_id", "shuffl-datatable-pink", d);
            // (Re)create data and test
            var e = shuffl.createDataFromCard(c);
            equals(e['shuffl:id'],          "cardfromdata_id",         'shuffl:id');
            equals(e['shuffl:class'],       "shuffl-datatable-pink",    'shuffl:class');
            equals(e['shuffl:version'],     d['shuffl:version'],       'shuffl:version');
            equals(e['shuffl:base-uri'],    d['shuffl:base-uri'],      'shuffl:base-uri');
            same(e['shuffl:uses-prefixes'], d['shuffl:uses-prefixes'], 'shuffl:uses-prefixes');
            equals(e['shuffl:data']['shuffl:title'], "Card N title",   'shuffl:data-title');
            same(e['shuffl:data']['shuffl:tags'],  [ 'card_N_tag', 'footag' ], 'shuffl:data-tags');
            same(e['shuffl:data']['shuffl:table'],  TestDataTable,     'shuffl:data-table');
        });

    test("shuffl.card.datatable model setting",
        function () {
            log.debug("shuffl.card.datatable model setting");
            // Create card (copy of code already tested)
            var d = testcarddatatable_carddata;
            var c = shuffl.createCardFromData("cardfromdata_id", "shuffl-datatable-pink", d);
            var NewDataTable =
                [ [ "",      "zzz1",  "zzz2",  "zzz3" ]
                , [ "row_1", "rz1",   "rz2",   "rz3"  ]
                ];
            // Simulate user input: set model to update title, tags and body text
            equals(c.find("ctitle").text(), "Card N title", "card title field");
            equals(c.find("ctags").text(),  "card_N_tag,footag", "card tags field");
            equals(c.find("cbody").text(),  "col1col2col3row_11.111.221.33row_22.112.222.33End.", "card data table text");
            same(c.find("cbody").table(), TestDataTable, "card data table");
            c.model("shuffl:title", "Card N updated");
            c.model("shuffl:tags",  "card_N_tag,bartag");
            c.model("shuffl:table", NewDataTable);
            equals(c.find("ctitle").text(), "Card N updated", "updated title field");
            equals(c.find("ctags").text(),  "card_N_tag,bartag", "updated tags field");
            equals(c.find("cbody").text(),  "zzz1zzz2zzz3row_1rz1rz2rz3", "updated data table text");
            same(c.find("cbody").table(), NewDataTable, "updated data table");
        });

};

// End
