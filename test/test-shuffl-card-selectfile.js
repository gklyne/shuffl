// $Id$

/**
 * Test suite for free text card functions
 */

/**
 * Data
 */
var testcardselectfile_carddata = 
    { 'shuffl:id':        'card_N'
    , 'shuffl:class':     'shuffl-selectfile-ZZZZZZ'
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
      , 'shuffl:file':    "path/file"
      , 'shuffl:baseuri': "http://example.com/base/"
      }
    };

var baseuri = jQuery.uri("..").toString();

/**
 * Function to register tests
 */

TestCardSelectfile = function() {

    module("TestCardSelectfile");

    test("shuffl.addCardFactories",
        function () {
            log.debug("test shuffl.addCardFactories");
            // Card factories are created when shuffl-card-selectfile module is loaded
    		equals(shuffl.CardFactoryMap['shuffl-selectfile'].cardcss, "stock-default", "shuffl-selectfile");
        });
    
    test("shuffl.getCardFactories",
        function () {
            log.debug("test shuffl.getCardFactories");
            var c0 = shuffl.getCardFactory("default-type");
            equals(typeof c0, "function", "default factory");
    		var c1 = shuffl.getCardFactory("shuffl-selectfile");
    		equals(typeof c1, "function", "retrieved selectfile factory");
        });

    test("shuffl.card.selectfile.newCard",
        function () {
            log.debug("test shuffl.card.selectfile.newCard");
            var css = 'stock-default';
    		var c   = shuffl.card.selectfile.newCard("shuffl-selectfile", css, "card-1",
    			{ 'shuffl:tags': 	["card-tag"]
    			, 'shuffl:title':	"card-title"
                , 'shuffl:file':    "path/file"
                , 'shuffl:baseuri': "http://example.com/base/"
    			});
    		equals(c.attr('id'), "card-1", "card id attribute");
            ok(c.hasClass('shuffl-card-dialog'),   "shuffl card class");
            ok(c.hasClass('stock-default'), "default colour class");
    		equals(c.find("cident").text(), "card-1", "card id field");
    		equals(c.find("cclass").text(), "shuffl-selectfile", "card class field");
    		equals(c.find("ctitle").text(), "card-title", "card title field");
    		equals(c.find("ctags").text(),  "card-tag", "card tags field");
            equals(c.find("cbaseuri").text(),  "http://example.com/base/", "card cbaseuri field");
            equals(c.find("cfile").text(),  "path/file", "card cfile field");
            equals(c.find("curi").text(),  "http://example.com/base/path/file", "card curi field");
    });

    test("shuffl.createStockpiles",
        function () {
            log.debug("test shuffl.createStockpiles");
            equals(jQuery('#stockbar').children().length, 1, "old stockbar content");
    		var s1 = shuffl.createStockpile(
    			"stock_1", "stock-default", "File", "shuffl-selectfile");
    		equals(jQuery('#stockbar').children().length, 3, "new stockbar content");
    		//1
    		equals(s1.attr('id'), "stock_1", "stock 1 id");
    	    ok(s1.hasClass("stock-default"), "stock 1 class");
    	    equals(s1.text(), "File", "stock 1 label");
    	    equals(typeof s1.data('makeCard'), "function", "stock 1 function");
    	    equals(s1.data('CardType'), "shuffl-selectfile", "stock 1 type");
    });

    test("shuffl.createCardFromStock",
        function () {
            log.debug("test shuffl.createCardFromStock");
			var s = shuffl.createStockpile(
			    "stock_id", "stock-default", "File", "shuffl-selectfile");
    		var c = shuffl.createCardFromStock(jQuery("#stock_id"));
            log.debug("- card "+shuffl.objectString(c));
    		var card_id = shuffl.lastId("card_");
            equals(c.attr('id'), card_id,       "card id attribute");
            ok(c.hasClass('shuffl-card-dialog'), "shuffl card class");
            ok(c.hasClass('stock-default'),     "stock-default");
            equals(c.attr('class'), 'shuffl-card-dialog stock-default', "CSS class");
            equals(c.find("cident").text(),     card_id, "card id field");
            equals(c.find("cclass").text(),     "shuffl-selectfile", "card type");
            equals(c.find("ctitle").text(),     card_id+" - type shuffl-selectfile", "card title field");
            equals(c.find("ctags").text(),      card_id+",shuffl-selectfile", "card tags field");
            equals(c.find("cbaseuri").text(),   baseuri, "card cbaseuri field");
            equals(c.find("cfile").text(),      "Double-click to edit", "card cfile field");
            equals(c.find("curi").text(),       baseuri, "card curi field");
            // Check saved card data
            var d = testcardselectfile_carddata;
            equals(c.data('shuffl:id'),    card_id, "layout card id");
            equals(c.data('shuffl:class'), "shuffl-selectfile", "saved card type");
            equals(c.data('shuffl:external')['shuffl:id'],          card_id, "card data id");
            equals(c.data('shuffl:external')['shuffl:class'],       "shuffl-selectfile", "card data class");
            equals(c.data('shuffl:external')['shuffl:version'],     d['shuffl:version'], "card data version");
            equals(c.data('shuffl:external')['shuffl:base-uri'],    d['shuffl:base-uri'], "card data base-uri");
            same(c.data('shuffl:external')['shuffl:uses-prefixes'], d['shuffl:uses-prefixes'], "card data uses-prefixes");
            equals(c.data('shuffl:external')['shuffl:data'],        undefined, "card data");
        });

    test("shuffl.createCardFromData",
        function () {
            log.debug("test shuffl.createCardFromData");
            var d = testcardselectfile_carddata;
            var c = shuffl.createCardFromData("cardfromdata_id", "shuffl-selectfile", d);
            // Check card details
            equals(c.attr('id'), "cardfromdata_id", "card id attribute");
            ok(c.hasClass('shuffl-card-dialog'), "shuffl card class");
            ok(c.hasClass('stock-default'),     "CSS class");
            equals(c.find("cident").text(),     "cardfromdata_id", "card id field");
            equals(c.find("cclass").text(),     "shuffl-selectfile", "card class field");
            equals(c.find("ctitle").text(),     "Card N title", "card title field");
            equals(c.find("ctags").text(),      "card_N_tag,footag", "card tags field");
            equals(c.find("cbaseuri").text(),   "http://example.com/base/", "card cbaseuri field");
            equals(c.find("cfile").text(),      "path/file", "card cfile field");
            equals(c.find("curi").text(),       "http://example.com/base/path/file", "card curi field");
            same(c.data('shuffl:external'), d,  "card data");
        });

    test("shuffl.createDataFromCard",
        function () {
            log.debug("test shuffl.createDataFromCard");
            // Create card (copy of code already tested)
            var d = testcardselectfile_carddata;
            var c = shuffl.createCardFromData("cardfromdata_id", "shuffl-selectfile", d);
            // (Re)create data and test
            var e = shuffl.createDataFromCard(c);
            equals(e['shuffl:id'],          "cardfromdata_id",         'shuffl:id');
            equals(e['shuffl:class'],       "shuffl-selectfile",       'shuffl:class');
            equals(e['shuffl:version'],     d['shuffl:version'],       'shuffl:version');
            equals(e['shuffl:base-uri'],    d['shuffl:base-uri'],      'shuffl:base-uri');
            same(e['shuffl:uses-prefixes'], d['shuffl:uses-prefixes'], 'shuffl:uses-prefixes');
            equals(e['shuffl:data']['shuffl:title'], "Card N title",   'shuffl:data-title');
            same(e['shuffl:data']['shuffl:tags'], [ 'card_N_tag', 'footag' ], 'shuffl:data-tags');
            equals(e['shuffl:data']['shuffl:file'],  "path/file",       'shuffl:file');
            equals(e['shuffl:data']['shuffl:baseuri'], "http://example.com/base/", 'shuffl:baseuri');
        });

};

// End
