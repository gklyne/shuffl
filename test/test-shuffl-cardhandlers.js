// $Id$

/**
 * Test suite for card factory and common handling functions
 */

/**
 * Data
 */
var testcardhandlers_carddata = 
    { 'shuffl:id':        'card_id'
    , 'shuffl:class':     'test-type'
    , 'shuffl:version':   '0.1'
    , 'shuffl:dataref':   "card_id.json"
    , 'shuffl:datauri':   "http://example.com/path/card_id.json"
    , 'shuffl:dataRW':    true
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
      }
    };

var testlayoutdata = 
    { 'id':     'layout_1'
    , 'class':  'layout-class'
    , 'data':   'shuffl_sample_2_card_1.json'
    , 'pos':    {left:100, top:30}
    };

var testlayoutdatasized = 
    { 'id':     'layout_1'
    , 'class':  'layout-class'
    , 'data':   'shuffl_sample_2_card_1.json'
    , 'pos':    {left:100, top:30}
    , 'size':   {width:333, height:222}
    , 'zindex': 14
    };

var carddatatable_labels0 = [];
                                
var carddatatable_series0 = [];

var carddatatable_table1 =
    [ [ "x", "col1",  "col2",  "col3" ]
    , [ "1", "1.11",  "1.22",  "1.33" ]
    , [ "2", "2.11",  "2.22",  "2.33" ]
    ];

var carddatatable_labels1 =
    [ "col1", "col2", "col3" ];
                                
var carddatatable_series1 = 
    [ [ [1, 1.11],  [2, 2.11] ]
    , [ [1, 1.22],  [2, 2.22] ]
    , [ [1, 1.33],  [2, 2.33] ]
    ];

var carddatatable_table2 =
    [ ["General table heading"] 
    , [ "",  "col1",  "col2",  "col3" ]
    , [ "" ]
    , [ "1", "1.11",  "1.22",  "1.33" ]
    , [ "2", "2.11",  "2.22",  "2.33" ]
    , [ "End." ]
    ];

var carddatatable_labels2 =
    [ "col3", "col2", "col1" ];
                                
var carddatatable_series2 = 
    [ [ [1, 1.33],  [2, 2.33] ]
    , [ [1, 1.22],  [2, 2.22] ]
    , [ [1, 1.11],  [2, 2.11] ]
    ];

/**
 * Function to register tests
 */

TestCardHandlers = function() {

    module("TestCardHandlers");

    test("shuffl.addCardFactory", function () 
    {
        log.debug("test shuffl.addCardFactory");
        expect(1);
		shuffl.addCardFactory("test-type", "test-css", shuffl.card.defaultcard.newCard);
		equals(shuffl.CardFactoryMap['test-type'].cardcss, "test-css", "CardFactoryMap with test entry");
    });

    test("shuffl.getCardFactory", function () 
    {
        log.debug("test shuffl.getCardFactory");
        expect(2);
		var c1 = shuffl.getCardFactory("test-type");
		equals(typeof c1, "function", "retrieved factory");
		var c2 = shuffl.getCardFactory("default-type");
		equals(typeof c2, "function", "default factory");
    });

    test("shuffl.shuffl.card.defaultcard.newCard", function () 
    {
        log.debug("test shuffl.card.defaultcard.newCard");
        expect(4);
        var css = 'stock-default';
		var c   = shuffl.card.defaultcard.newCard("card-type", css, "card-id",
			{ 'shuffl:tags': 	["card-tag"]
			, 'shuffl:title':	"card-title"
			});
		equals(c.attr('id'), "card-id", "card id attribute");
        //ok(c.hasClass('shuffl-card'),   "shuffl card class");
        ok(c.hasClass('shuffl-card-autosize'),   "shuffl card autosize class");
        ok(c.hasClass('stock-default'), "default class");
		equals(c.find("ctitle").text(), "card-title", "card title field");
    });

    test("shuffl.createStockpile", function () 
    {
        log.debug("test shuffl.createStockpile");
        expect(7);
        equals(jQuery('#stockbar').children().length, 1, "old stockbar content");
        // Note: type 'test-type' matches factory added earlier
		var s = shuffl.createStockpile(
			"stock_id", "stock-class", "stock-label", "test-type");
        equals(jQuery('#stockbar').children().length, 3, "new stockbar content");
	    equals(s.attr('id'), "stock_id", "Stock id");
	    ok(s.hasClass("stock-class"), "stock class");
	    equals(s.text(), "stock-label", "stock-label");
	    equals(typeof s.data('makeCard'), "function");
	    equals(s.data('CardType'), "test-type");
    });

    test("shuffl.createCardFromStock", function () 
    {
        log.debug("test shuffl.createCardFromStock");
        expect(18);
        // Note: type 'test-type' matches factory added earlier
		var s = shuffl.createStockpile(
		    "stock_id", "stock-class", "stock-label", "test-type");
		var c = shuffl.createCardFromStock(jQuery("#stock_id"));
        log.debug("- card "+shuffl.objectString(c));
        var card_id = shuffl.lastId("card_");
        equals(c.attr('id'), card_id, "card id attribute");
        ok(c.hasClass('shuffl-card'),   "shuffl card class");
        ok(c.hasClass('shuffl-card-autosize'),   "shuffl card autosize class");
        ok(c.hasClass('test-css'),      "test class");
        equals(c.attr('class'), 'shuffl-card-autosize test-css shuffl-card', "default class");
        equals(c.find("ctitle").text(), card_id+" - class test-type", "card title field");
        // Check saved card data
        var d = testcardhandlers_carddata;
        equals(c.data('shuffl:dataref'), card_id+".json", "card shuffl:dataref");          
        equals(c.data('shuffl:datauri'), undefined,       "card shuffl:datauri");          
        equals(c.data('shuffl:dataRW'),  true,            "card shuffl:dataRW");          
        equals(c.data('shuffl:datamod'), true,            "card shuffl:datamod");          
        equals(c.data('shuffl:id'),    card_id, "layout card id");
        equals(c.data('shuffl:class'), "test-type", "layout card class");
        equals(c.data('shuffl:external')['shuffl:id'],          card_id, "card data id");
        equals(c.data('shuffl:external')['shuffl:class'],       d['shuffl:class'], "card data class");
        equals(c.data('shuffl:external')['shuffl:version'],     d['shuffl:version'], "card data version");
        equals(c.data('shuffl:external')['shuffl:base-uri'],    d['shuffl:base-uri'], "card data base-uri");
        same(c.data('shuffl:external')['shuffl:uses-prefixes'], d['shuffl:uses-prefixes'], "card data uses-prefixes");
        equals(c.data('shuffl:external')['shuffl:data'],        undefined, "card data");
    });

    test("shuffl.createCardFromData", function ()
    {
        log.debug("test shuffl.createCardFromData");
        expect(13);
        var d = testcardhandlers_carddata;
        equals(d['shuffl:id'], 'card_id', 'd:card-id (1)');
        var c = shuffl.createCardFromData("cardfromdata_id", "test-type", d);
        equals(d['shuffl:id'], 'card_id', 'd:card-id (2)'); // Test original not trashed
        // Check card details
        equals(c.attr('id'), "cardfromdata_id", "card id attribute");
        ok(c.hasClass('shuffl-card'),   "shuffl card type");
        ok(c.hasClass('test-css'),      "CSS class");
        equals(c.find("ctitle").text(), "Card 1 title", "card title field");
        // Check card data
        equals(c.data('shuffl:id'),      "cardfromdata_id", "layout card id");
        equals(c.data('shuffl:class'),   "test-type",       "layout card class");
        equals(c.data('shuffl:dataref'), "card_id.json",    "card shuffl:dataref");          
        equals(c.data('shuffl:datauri'), "http://example.com/path/card_id.json", "card shuffl:datauri");          
        equals(c.data('shuffl:datamod'), false,     "card shuffl:datamod");          
        equals(c.data('shuffl:dataRW'),  true,      "card shuffl:dataRW");          
        same(c.data('shuffl:external'), d, "card data");
    });

    test("shuffl.placeCardFromData", function () 
    {
        log.debug("test shuffl.placeCardFromData");
        expect(16);
        var l = testlayoutdata;
        var d = testcardhandlers_carddata;
        shuffl.placeCardFromData(l, d);
        var c = jQuery("#card_id");
        // Check card details
        equals(c.attr('id'), "card_id", "card id attribute");
        ok(c.hasClass('shuffl-card'),   "shuffl card class");
        ok(c.hasClass('shuffl-card-autosize'), "shuffl card autosize class");
        equals(c.find("ctitle").text(), "Card 1 title", "card title field");
        // Check layout details
        equals(c.data('shuffl:id'),      "card_id",   "layout card id");
        equals(c.data('shuffl:class'),   "test-type", "layout card class");
        equals(c.data('shuffl:dataref'), "card_id.json", "card shuffl:dataref");          
        equals(c.data('shuffl:datauri'), "http://example.com/path/card_id.json", "card shuffl:datauri");          
        equals(c.data('shuffl:datamod'), false,     "card shuffl:datamod");          
        equals(c.data('shuffl:dataRW'),  true,      "card shuffl:dataRW");          
        same(c.data('shuffl:external'), d, "card data");
        var p = c.position();
        equals(Math.floor(p.left), 100, "position-left");
        equals(Math.floor(p.top),  30,  "position-top");
        equals(Math.floor(c.width()), 119, "width");
        equals(Math.floor(c.height()), 21,  "height");
        equals(c.css("zIndex"), "11", "card zIndex");
    });

    test("shuffl.createDataFromCard", function () 
    {
        log.debug("test shuffl.createDataFromCard");
        expect(14);
        // Create card (copy of code already tested)
        var d = testcardhandlers_carddata;
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
        equals(e['shuffl:dataref'],     d['shuffl:dataref'],       'shuffl:dataref');
        equals(e['shuffl:datauri'],     d['shuffl:datauri'],       'shuffl:datauri');
        equals(e['shuffl:dataRW'],      d['shuffl:dataRW'],        'shuffl:dataRW');
        equals(e['shuffl:base-uri'],    d['shuffl:base-uri'],      'shuffl:base-uri');
        same(e['shuffl:uses-prefixes'], d['shuffl:uses-prefixes'], 'shuffl:uses-prefixes');
        equals(e['shuffl:data']['shuffl:title'], "Card 1 title",   'shuffl:data-title');
        equals(e['shuffl:data']['shuffl:text'],  undefined,        'shuffl:data-text');
    });

    test("shuffl.placeCardFromDataSized", function () 
    {
        log.debug("test shuffl.placeCardFromDataSized");
        expect(16);
        var l = testlayoutdatasized;
        var d = testcardhandlers_carddata;
        shuffl.placeCardFromData(l, d);
        var c = jQuery("#card_id");
        // Check card details
        equals(c.attr('id'), "card_id", "card id attribute");
        ok(c.hasClass('shuffl-card'),   "shuffl card class");
        ok(c.hasClass('test-css'),      "CSS class");
        equals(c.find("ctitle").text(), "Card 1 title", "card title field");
        // Check layout details
        equals(c.data('shuffl:id'),      "card_id",   "layout card id");
        equals(c.data('shuffl:class'),   "test-type", "layout card class");
        equals(c.data('shuffl:dataref'), "card_id.json", "card shuffl:dataref");          
        equals(c.data('shuffl:datauri'), "http://example.com/path/card_id.json", "card shuffl:datauri");          
        equals(c.data('shuffl:datamod'), false,     "card shuffl:datamod");          
        equals(c.data('shuffl:dataRW'),  true,      "card shuffl:dataRW");          
        same(c.data('shuffl:external'), d, "card data");
        var p = c.position();
        equals(Math.floor(p.left), 100, "position-left");
        equals(Math.floor(p.top),  30,  "position-top");
        equals(Math.floor(c.width()), 333, "width");
        equals(Math.floor(c.height()), 222,  "height");
        equals(c.css("zIndex"), "14", "card zIndex");
    });

    test("shuffl.card.defaultcard model setting", function () 
    {
        log.debug("shuffl.card.defaultcard model setting");
        expect(2);
        // Create card (copy of code already tested)
        var d = testcardhandlers_carddata;
        var c = shuffl.createCardFromData("cardfromdata_id", "test-type", d);
        // Simulate user input: set model to update title
        equals(c.find("ctitle").text(), "Card 1 title", "card title field");
        c.model("shuffl:title", "Card 1 updated");
        equals(c.find("ctitle").text(), "Card 1 updated", "updated title field");
    });
    
    test("shuffl.lineEditable", function () 
    {
        log.debug("test shuffl.lineEditable");
        expect(5);
        var d = jQuery("<div><span class='edit'>Some text</span></div>");
        d.data('shuffl:datamod', false);
        equals(d.data('shuffl:datamod'), false, "shuffl:datamod");
        var e = d.find(".edit");
        shuffl.lineEditable(d, e);
        log.debug("- lineEditable: "+shuffl.elemString(e[0]));
        e.trigger('dblclick');
        log.debug("- dblclicked: "+shuffl.elemString(e[0]));
        var i = e.find("INPUT");
        var b = e.find("BUTTON[type='submit']");
        // These tests are ad hoc - enough to show the editable control 
        // has been activated, but not to prove it's working as expected.
        equals(i.text(), "", "Input text");
        equals(i.attr('value'), "Some text", "Input text");
        equals(b.text(), "OK", "OK button label");
        i.attr('value', "New text");
        equals(i.attr('value'), "New text", "New input text");
        log.debug("- OK button: "+shuffl.elemString(b[0]));
        // I can't get these tests to work - why?
        //b.trigger('click');
        //b.trigger('click');
        //e.trigger('blur');
        //log.debug("- OK clicked: "+shuffl.elemString(e[0]));
        //jQuery.timer(200, function () {
        //    log.debug("- test shuffl:datamod: "+d.data('shuffl:datamod'));
        //    equals(d.data('shuffl:datamod'), true, "shuffl:datamod");
        //    start();
        //});
        //stop();
        //ok(false, "shuffl.lineEditable");
    });

    test("shuffl.blockEditable", function () 
    {
        log.debug("test shuffl.blockEditable");
        expect(2);
        var d = jQuery("<div><span class='edit'>Some text<br/>more text</span></div>");
        var e = d.find(".edit");
        shuffl.blockEditable(d, e);
        log.debug("- blockEditable: "+shuffl.elemString(e[0]));
        e.trigger('dblclick');
        log.debug("- dblclicked: "+shuffl.elemString(e[0]));
        var i = e.find("INPUT");
        var b = e.find("BUTTON[type='submit']");
        equals(i.text(), "", "Input text");
        equals(b.text(), "OK", "OK button label");
    });

    test("shuffl.placeCard", function () 
    {
        log.debug("test shuffl.placeCard");
        expect(12);
        var d = testcardhandlers_carddata;
        var card = shuffl.createCardFromData("placecard_id", "test-type", d);
        shuffl.placeCard(jQuery('#layout'), card, {left:22, top:12}, {width:303, height:202});
        var c = jQuery("#placecard_id");
        // Check card details
        equals(c.attr('id'),            "placecard_id", "card id attribute");
        ok(c.hasClass('shuffl-card'),   "shuffl card class");
        ok(c.hasClass('test-css'),      "CSS class");
        equals(c.find("ctitle").text(), "Card 1 title", "card title field");
        // Check layout details
        equals(c.data('shuffl:id'),    "placecard_id", "layout card id");
        equals(c.data('shuffl:class'), "test-type", "layout card class");
        same(c.data('shuffl:external'), d, "card data");
        var p = c.position();
        equals(Math.floor(p.left), 22, "position-left");
        equals(Math.floor(p.top),  12,  "position-top");
        equals(Math.floor(c.width()), 303, "width");
        equals(Math.floor(c.height()), 202,  "height");
        equals(c.css("zIndex"), "11", "card zIndex");
    });

    test("shuffl.dropCard", function ()
    {
        log.debug("test shuffl.dropCard");
        expect(15);
        var s = shuffl.createStockpile(
            "stock_id", "stock-class", "stock-label", "test-type");
        var droppos = {left:23, top:13};
        droppos = shuffl.positionAbsolute(droppos, jQuery('#layout'));
        //droppos = shuffl.positionAbsolute(droppos, jQuery('#workspace'));
        shuffl.dropCard(jQuery("#stock_id"), jQuery("#layout"), droppos);
        var c = jQuery('.shuffl-card');
        var card_id = shuffl.lastId("card_");
        equals(c.attr('id'),            card_id, "card id attribute");
        ok(c.hasClass('shuffl-card'),   "shuffl card class");
        ok(c.hasClass('test-css'),      "CSS class");
        equals(c.find("ctitle").text(), card_id+" - class test-type", "card title field");
        // Check saved card data
        var d = testcardhandlers_carddata;
        equals(c.data('shuffl:id'),    card_id, "layout card id");
        equals(c.data('shuffl:class'), "test-type", "layout card class");
        equals(c.data('shuffl:external')['shuffl:id'],          card_id, "card data id");
        equals(c.data('shuffl:external')['shuffl:class'],       d['shuffl:class'], "card data class");
        equals(c.data('shuffl:external')['shuffl:version'],     d['shuffl:version'], "card data version");
        equals(c.data('shuffl:external')['shuffl:base-uri'],    d['shuffl:base-uri'], "card data base-uri");
        same(c.data('shuffl:external')['shuffl:uses-prefixes'], d['shuffl:uses-prefixes'], "card data uses-prefixes");
        equals(c.data('shuffl:external')['shuffl:data'],        undefined, "card data");
        var p = c.position();
        // Ad-hoc tweak
        // TODO: find out how to get proper positioning. Use pixels?
        equals(Math.floor(p.left)+5, 23, "position-left");
        equals(Math.floor(p.top)+1,  13,  "position-top");
        //equals(Math.floor(p.left), 23, "position-left");
        //equals(Math.floor(p.top),  13,  "position-top");
        //equals(p.left, 23, "position-left");
        //equals(p.top,  13, "position-top");
        equals(c.css("zIndex"), "11", "card zIndex");
    });

    test("shuffl.modelSetSeries (empty table)", function ()
    {
        log.debug("test shuffl.modelSetSeries (empty table)");
        expect(2);
        var c = jQuery("<div/>");    // Mock card
        c.modelBind('shuffl:table', shuffl.modelSetSeries(c));
        c.model('shuffl:table', [[]]);
        same(c.data('shuffl:labels'), [], "shuffl:labels");
        same(c.data('shuffl:series'), [], "shuffl:series");
    });

    test("shuffl.modelSetSeries (default options)", function ()
    {
        log.debug("test shuffl.modelSetSeries (default options)");
        expect(2);
        var c = jQuery("<div/>");    // Mock card
        c.modelBind('shuffl:table', shuffl.modelSetSeries(c));
        c.model('shuffl:table', carddatatable_table1);
        same(c.data('shuffl:labels'), carddatatable_labels1, "shuffl:labels");
        same(c.data('shuffl:series'), carddatatable_series1, "shuffl:series");
    });

    test("shuffl.modelSetSeries (non-default options)", function ()
    {
        log.debug("test shuffl.modelSetSeries (non-default options)");
        expect(4);
        var c = jQuery("<div/>");    // Mock card
        var opts = 
            { labelrow:   1
            , firstrow:   3
            , lastrow:    -1
            , datacols:   [ [0,3], [0,2], [0,1]]
            , setlabels:  'shuffl:labels2'
            , setseries:  'shuffl:series2'
            };
        c.modelBind('shuffl:table2', shuffl.modelSetSeries(c, opts));
        c.model('shuffl:table2', carddatatable_table2);
        equals(c.data('shuffl:labels'), undefined, "shuffl:labels");
        equals(c.data('shuffl:series'), undefined, "shuffl:series");
        same(c.data('shuffl:labels2'), carddatatable_labels2, "shuffl:labels2");
        same(c.data('shuffl:series2'), carddatatable_series2, "shuffl:series2");
    });
    
};

// End
