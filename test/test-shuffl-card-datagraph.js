// $Id$

/**
 * Test suite for data graphing card functions
 */

/**
 * Data
 */

var testcarddatagraph_labels =
    ["graph1", "graph2", "graph3", "graph4"];

var testcarddatagraph_series = [ [], [], [], [] ];

(function (series)
{
    var limit = function (val,min,max)
    {
        if (val<min) { return null; };
        if (val>max) { return null; };
        return val;
    };
    for (var x = -3.0 ; x <= 5.0 ; x = x+0.2) 
    {
        series[0].push([x, Math.sin(x)]);
        series[1].push([x, Math.cos(x)]);
        series[2].push([x, limit(Math.tan(x)/5.0, -1.0, +1.0)]);
        var y = Math.abs(x*4);
        series[3].push([x, (y>0.0 ? Math.sin(y)/y : 1.0)]);
    };
})(testcarddatagraph_series);

var testcarddatagraph_carddata = 
    { 'shuffl:id':        'card_N'
    , 'shuffl:class':     'shuffl-datagraph-ZZZZZZ'
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
      , 'shuffl:uri':     "test-graph.csv"
      , 'shuffl:labels':  testcarddatagraph_labels
      , 'shuffl:series':  testcarddatagraph_series
      }
    };

/**
 * Function to register tests
 */

TestCardDatagraph = function() {

    module("TestCardDatatable");

    test("shuffl.addCardFactories",
        function () {
            log.debug("test shuffl.addCardFactories");
            // Card factories are created when shuffl-card-datagraph module is loaded
    		equals(shuffl.CardFactoryMap['shuffl-datagraph-yellow'].cardcss, "stock-yellow", "shuffl-datagraph-yellow");
            equals(shuffl.CardFactoryMap['shuffl-datagraph-blue'  ].cardcss, "stock-blue",   "shuffl-datagraph-blue");
            equals(shuffl.CardFactoryMap['shuffl-datagraph-green' ].cardcss, "stock-green",  "shuffl-datagraph-green");
            equals(shuffl.CardFactoryMap['shuffl-datagraph-orange'].cardcss, "stock-orange", "shuffl-datagraph-orange");
            equals(shuffl.CardFactoryMap['shuffl-datagraph-pink'  ].cardcss, "stock-pink",   "shuffl-datagraph-pink");
            equals(shuffl.CardFactoryMap['shuffl-datagraph-purple'].cardcss, "stock-purple", "shuffl-datagraph-purple");
        });
    
    test("shuffl.getCardFactories",
        function () {
            log.debug("test shuffl.getCardFactories");
            var c0 = shuffl.getCardFactory("default-type");
            equals(typeof c0, "function", "default factory");
    		var c1 = shuffl.getCardFactory("shuffl-datagraph-yellow");
    		equals(typeof c1, "function", "retrieved factory yellow");
            var c2 = shuffl.getCardFactory("shuffl-datagraph-blue");
            equals(typeof c2, "function", "retrieved factory blue");
            var c3 = shuffl.getCardFactory("shuffl-datagraph-green");
            equals(typeof c3, "function", "retrieved factory green");
            var c4 = shuffl.getCardFactory("shuffl-datagraph-orange");
            equals(typeof c4, "function", "retrieved factory orange");
            var c5 = shuffl.getCardFactory("shuffl-datagraph-pink");
            equals(typeof c5, "function", "retrieved factory pink");
            var c6 = shuffl.getCardFactory("shuffl-datagraph-purple");
            equals(typeof c6, "function", "retrieved factory purple");
        });

    test("shuffl.card.datagraph.newCard",
        function () {
            log.debug("test shuffl.card.datagraph.newCard");
            var css = 'stock-yellow';
            var c   = shuffl.card.datagraph.newCard("shuffl-datagraph-yellow", css, "card-1",
            	{ 'shuffl:tags': 	["card-tag"]
            	, 'shuffl:title':	"card-title"
                , 'shuffl:uri':     "http://example.org/test-uri.csv"
                , 'shuffl:labels':  testcarddatagraph_labels
                , 'shuffl:series':  testcarddatagraph_series
            	});
            equals(c.attr('id'), "card-1",  "card id attribute");
            ok(c.hasClass('stock-yellow'),  "yellow colour class");
            ok(c.hasClass('shuffl-card-setsize'), "shuffl card setsize class");
            equals(c.attr('class'), 'shuffl-card-setsize stock-yellow ui-resizable', "CSS class");
            equals(c.find("cident").text(), "card-1", "card id field");
            equals(c.find("cclass").text(), "shuffl-datagraph-yellow", "card class field");
            equals(c.find("ctitle").text(), "card-title", "card title field");
            equals(c.find("ctags").text(),  "card-tag", "card tags field");
            equals(c.find("curi").text(),   "http://example.org/test-uri.csv", "card URI field");
            equals(c.find("crow").eq(0).find("button").val(), "readcsv", "readcsv button value");
            equals(c.find("cbody").children().get(0).tagName.toLowerCase(), "div", "card body contains <div>");
        });

    test("shuffl.createCardFromStock",
        function () {
            log.debug("test shuffl.createCardFromStock");
			var s = shuffl.createStockpile(
			    "stock_id", "stock-green", "stock-label", "shuffl-datagraph-green");
    		var c = shuffl.createCardFromStock(jQuery("#stock_id"));
            //log.debug("- card "+shuffl.objectString(c));
    		var card_id = shuffl.lastId("card_");
            equals(c.attr('id'), card_id, "card id attribute");
            ok(c.hasClass('shuffl-card'),   "shuffl card class");
            ok(c.hasClass('shuffl-card-setsize'),   "shuffl card setsize class");
            ok(c.hasClass('stock-green'),   "stock-green");
            ok(c.hasClass('ui-resizable'),  "ui-resizable");
            equals(c.attr('class'), 'shuffl-card-setsize stock-green ui-resizable shuffl-card', "CSS class");
            equals(c.find("cident").text(), card_id, "card id field");
            equals(c.find("cclass").text(), "shuffl-datagraph-green", "card type");
            equals(c.find("ctitle").text(), card_id+" - type shuffl-datagraph-green", "card title field");
            equals(c.find("ctags").text(),  card_id+",shuffl-datagraph-green", "card tags field");
            equals(c.find("curi").text(),   "(Double-click to edit)", "card URI field");
            equals(c.find("crow").eq(0).find("button").val(), "readcsv", "readcsv button value");
            equals(c.find("cbody").children().get(0).tagName.toLowerCase(), "div", "card body contains <div>");
            // Check saved card data
            var d = testcarddatagraph_carddata;
            equals(c.data('shuffl:id'),    card_id, "layout card id");
            equals(c.data('shuffl:class'), "shuffl-datagraph-green", "saved card type");
            equals(c.data('shuffl:external')['shuffl:id'],          card_id, "card data id");
            equals(c.data('shuffl:external')['shuffl:class'],       "shuffl-datagraph-green", "card data class");
            equals(c.data('shuffl:external')['shuffl:version'],     d['shuffl:version'], "card data version");
            equals(c.data('shuffl:external')['shuffl:base-uri'],    d['shuffl:base-uri'], "card data base-uri");
            same(c.data('shuffl:external')['shuffl:uses-prefixes'], d['shuffl:uses-prefixes'], "card data uses-prefixes");
            equals(c.data('shuffl:external')['shuffl:data'],        undefined, "card data");
        });

    test("shuffl.createCardFromData",
        function () {
            log.debug("test shuffl.createCardFromData");
            var d = testcarddatagraph_carddata;
            var c = shuffl.createCardFromData("cardfromdata_id", "shuffl-datagraph-orange", d);
            // Check card details
            equals(c.attr('id'), "cardfromdata_id", "card id attribute");
            ok(c.hasClass('shuffl-card'),   "shuffl card type");
            ok(c.hasClass('shuffl-card-setsize'),   "shuffl card setsize class");
            ok(c.hasClass('stock-orange'),  "stock-orange class");
            equals(c.attr('class'), 'shuffl-card-setsize stock-orange ui-resizable shuffl-card', "CSS class");
            equals(c.find("cident").text(), "cardfromdata_id", "card id field");
            equals(c.find("cclass").text(), "shuffl-datagraph-orange", "card class field");
            equals(c.find("ctitle").text(), "Card N title", "card title field");
            equals(c.find("ctags").text(),  "card_N_tag,footag", "card tags field");
            equals(c.find("curi").text(),   "test-graph.csv", "card URI field");
            equals(c.find("crow").eq(0).find("button").val(), "readcsv", "readcsv button value");
            equals(c.find("cbody").children().get(0).tagName.toLowerCase(), "div", "card body contains <div>");
            same(c.data('shuffl:external'), d, "card data");
        });

    test("shuffl.createDataFromCard",
        function () {
            log.debug("test shuffl.createDataFromCard");
            // Create card (copy of code already tested)
            var d = testcarddatagraph_carddata;
            var c = shuffl.createCardFromData("cardfromdata_id", "shuffl-datagraph-pink", d);
            // (Re)create data and test
            var e = shuffl.createDataFromCard(c);
            equals(e['shuffl:id'],          "cardfromdata_id",         'shuffl:id');
            equals(e['shuffl:class'],       "shuffl-datagraph-pink",    'shuffl:class');
            equals(e['shuffl:version'],     d['shuffl:version'],       'shuffl:version');
            equals(e['shuffl:base-uri'],    d['shuffl:base-uri'],      'shuffl:base-uri');
            same(e['shuffl:uses-prefixes'], d['shuffl:uses-prefixes'], 'shuffl:uses-prefixes');
            equals(e['shuffl:data']['shuffl:title'], "Card N title",   'shuffl:data-title');
            same(e['shuffl:data']['shuffl:tags'],    [ 'card_N_tag', 'footag' ], 'shuffl:data-tags');
            same(e['shuffl:data']['shuffl:uri'],     "test-graph.csv", 'shuffl:data-uri');
            same(e['shuffl:data']['shuffl:labels'], testcarddatagraph_labels, 'shuffl:data-labels');
            same(e['shuffl:data']['shuffl:series'], testcarddatagraph_series, 'shuffl:data-series');
        });

    test("shuffl.card.datagraph model setting",
        function () {
            log.debug("shuffl.card.datagraph model setting");
            // Create card (copy of code already tested)
            var d = testcarddatagraph_carddata;
            var c = shuffl.createCardFromData("cardfromdata_id", "shuffl-datagraph-pink", d);
            var NewDataTable =
                [ [ "x", "c=cos x", "c3=cos 3x", "c5=cos 5x" ]
                , [ "0.0",  "1",       "1",       "1"        ]
                , [ "0.2",  "0.9801",  "0.8253",  "0.5403"   ]
                , [ "0.4",  "0.9211",  "0.3624",  "-0.4161"  ]
                , [ "0.6",  "0.8253",  "-0.2272", "-0.99"    ]
                , [ "0.8",  "0.6967",  "-0.7374", "-0.6536"  ]
                , [ "1.0",  "0.5403",  "-0.99",   "0.2837"   ]
                ];
            var NewDataLabels =
                [ "c=cos x", "c3=cos 3x", "c5=cos 5x" ];
            var NewDataSeries = [];
            NewDataSeries[0] =
                [ [ 0.0,  1,     ]
                , [ 0.2,  0.9801 ]
                , [ 0.4,  0.9211 ]
                , [ 0.6,  0.8253 ]
                , [ 0.8,  0.6967 ]
                , [ 1.0,  0.5403 ]
                ];
            NewDataSeries[1] =
                [ [ 0.0,  1,       ]
                , [ 0.2,  0.8253,  ]
                , [ 0.4,  0.3624,  ]
                , [ 0.6,  -0.2272, ]
                , [ 0.8,  -0.7374, ]
                , [ 1.0,  -0.99,   ]
                ];
            NewDataSeries[2] =
                [ [ 0.0,  1,       ]
                , [ 0.2,  0.5403,  ]
                , [ 0.4,  -0.4161, ]
                , [ 0.6,  -0.99,   ]
                , [ 0.8,  -0.6536, ]
                , [ 1.0,  0.2837,  ]
                ];
            // Simulate user input: set model to update title, tags and body text
            equals(c.find("ctitle").text(), "Card N title", "card title field");
            equals(c.find("ctags").text(),  "card_N_tag,footag", "card tags field");
            c.model("shuffl:title", "Card N updated");
            c.model("shuffl:tags",  "card_N_tag,bartag");
            c.model("shuffl:uri",   "http://example.org/update/uri.csv");
            equals(c.find("ctitle").text(), "Card N updated", "updated title field");
            equals(c.find("ctags").text(),  "card_N_tag,bartag", "updated tags field");
            equals(c.find("curi").text(),   "http://example.org/update/uri.csv", "updated uri field");
            // Setting table updates labels and series..
            c.model("shuffl:table", NewDataTable);
            same(c.model("shuffl:table"),  null,          "shuffl:table");
            same(c.model("shuffl:labels"), NewDataLabels, "shuffl:labels");
            same(c.model("shuffl:series"), NewDataSeries, "shuffl:series");
        });

    test("shuffl.card.datagraph model URI setting",
        function () {
            log.debug("shuffl.card.datagraph model URI setting");
            // Create card (copy of code already tested)
            var d = testcarddatagraph_carddata;
            var c = shuffl.createCardFromData("cardfromdata_id", "shuffl-datagraph-pink", d);
            var NewDataLabels =
                [ "c=cos x", "c3=cos 3x", "c5=cos 5x" ];
            var NewDataSeries = [];
            NewDataSeries[0] =
                [ [ 0.0,  1,     ]
                , [ 0.2,  0.9801 ]
                , [ 0.4,  0.9211 ]
                , [ 0.6,  0.8253 ]
                , [ 0.8,  0.6967 ]
                , [ 1.0,  0.5403 ]
                ];
            NewDataSeries[1] =
                [ [ 0.0,  1,       ]
                , [ 0.2,  0.8253,  ]
                , [ 0.4,  0.3624,  ]
                , [ 0.6,  -0.2272, ]
                , [ 0.8,  -0.7374, ]
                , [ 1.0,  -0.99,   ]
                ];
            NewDataSeries[2] =
                [ [ 0.0,  1,       ]
                , [ 0.2,  0.5403,  ]
                , [ 0.4,  -0.4161, ]
                , [ 0.6,  -0.99,   ]
                , [ 0.8,  -0.6536, ]
                , [ 1.0,  0.2837,  ]
                ];
            // Simulate user input: set model URI - should read data file
            equals(c.find("ctitle").text(), "Card N title", "card title field");
            equals(c.find("ctags").text(),  "card_N_tag,footag", "card tags field");
            // Simulate user input: set model URI - should read data file
            c.model("shuffl:uri", "test-csv-graph-c135.csv");
            c.modelBindExec("shuffl:table",
                function () {
                    // Executed immediately
                    c.model("shuffl:readcsv", c.model("shuffl:uri"));
                },
                function () {
                    // Executed when shuffl:table is updated...
                    equals(c.find("curi").text(),  "test-csv-graph-c135.csv", "updated uri field");
                    same(c.model("shuffl:table"),  null,          "shuffl:table");
                    same(c.model("shuffl:labels"), NewDataLabels, "shuffl:labels");
                    same(c.model("shuffl:series"), NewDataSeries, "shuffl:series");
                    start();
                }),
            stop(2000);
        });

};

// End
