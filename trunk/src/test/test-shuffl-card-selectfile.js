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
      , 'shuffl:fileuri': "./file"
      }
    };

var baseuri = jQuery.uri("..").toString();

/**
 * Function to register tests
 */

TestCardSelectfile = function() {

    module("TestCardSelectfile");

    // Figure base URI based on page URI
    var pageuri = jQuery.uri().toString();
    var baseuri = null;
    var baseuri_list =
        [ "http://localhost/webdav/shuffl/static/test/"
        , "http://zoo-samos.zoo.ox.ac.uk/webdav/shuffl/static/test/"
        ];
    for (i in baseuri_list)
    {
        var b = baseuri_list[i];
        if (shuffl.starts(b, pageuri))
        {
            baseuri = b;
        }
    }
    var basepath = shuffl.uriPath(baseuri);

    // Check we have a suitable base URI
    test("NOTE: this test must be run from the web server used to store shuffl workspace data", function ()
    {
        logtest("TestCardSelectfile source check");
        if (!baseuri)
        {
            ok(baseuri, "TestCardSelectfile must be served from WebDAV location");
            throw "TestSaveWorkspace must be served from WebDAV location";
        }
    });

    test("TestCardSelectfile(init)", function ()
    {
        logtest("TestCardSelectfile(init)");
        shuffl.resetStorageHandlers();
        shuffl.addStorageHandler( 
            { uri:      "file:///"
            , name:     "LocalFile"
            , factory:  shuffl.LocalFileStorage
            });
        shuffl.addStorageHandler(
            { uri:      "http://zoo-samos.zoo.ox.ac.uk/webdav/shuffl/static/test/"
            , name:     "WebDAVsamos"
            , factory:  shuffl.WebDAVStorage
            });
        shuffl.addStorageHandler(
            { uri:      "http://localhost/webdav/shuffl/static/test/"
            , name:     "WebDAVlocalhost"
            , factory:  shuffl.WebDAVStorage
            });
        log.debug("Storage handlers: "+jQuery.toJSON(shuffl.listStorageHandlers()));
        ok(true, "TestCardSelectfile storage handlers initialized");
    });

    test("shuffl.addCardFactories",
        function () {
            logtest("TestCardSelectfile: shuffl.addCardFactories");
            // Card factories are created when shuffl-card-selectfile module is loaded
            equals(shuffl.CardFactoryMap['shuffl-selectfile'].cardcss, "stock-default", "shuffl-selectfile");
        });
    
    test("shuffl.getCardFactories",
        function () {
            logtest("TestCardSelectfile: shuffl.getCardFactories");
            var c0 = shuffl.getCardFactory("default-type");
            equals(typeof c0, "function", "default factory");
            var c1 = shuffl.getCardFactory("shuffl-selectfile");
            equals(typeof c1, "function", "retrieved selectfile factory");
        });

    test("shuffl.card.selectfile.newCard",
        function () {
            logtest("TestCardSelectfile: shuffl.card.selectfile.newCard");
            var css = 'stock-default';
            var c   = shuffl.card.selectfile.newCard("shuffl-selectfile", css, "card-1",
                { 'shuffl:tags':     ["card-tag"]
                , 'shuffl:title':    "card-title"
                , 'shuffl:fileuri': baseuri+"testdir/test-csv.csv"
                });
            equals(c.attr('id'), "card-1", "card id attribute");
            //ok(c.hasClass('shuffl-card'),   "shuffl card class");
            ok(c.hasClass('shuffl-card-setsize'),   "shuffl-card-setsize class");
            ok(c.hasClass('stock-default'),   "stock-default class");
            equals(c.attr('class'), 'shuffl-card-setsize stock-default ui-resizable', "CSS class");
            ok(c.hasClass('stock-default'), "default colour class");
            equals(c.find("ctitle").text(), "card-title", "card title field");
            // Created with dummy values
            equals(c.find("ccoll").text(), "(collection path)", "collection path field");
            equals(c.find("clist > cdir").text(), "(dir)/", "collection content listing field (dir)");
            equals(c.find("clist > cname").text(), "(filename)", "collection content listing field (name)");
            equals(c.find("cfile").text(), "(filename)", "file name field");
            // Later, after card has been placed, values are updated to reflect supplied data
            setTimeout( function()
                {
                    equals(c.find("ccoll").text(), basepath+"testdir/", "collection path field");
                    // TODO: Work out what to do about .svn/ directory
                    equals(c.find("clist").text(), ".svn/directory/test-csv.csv", "collection content listing field");
                    equals(c.find("cfile").text(), "test-csv.csv", "file name field");
                    start();
                },
                500);
            stop(2500);                
    });
    
    test("shuffl.createStockpiles",
        function () {
            logtest("TestCardSelectfile: shuffl.createStockpiles");
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
            logtest("TestCardSelectfile: shuffl.createCardFromStock");
            var s = shuffl.createStockpile(
                      "stock_id", "stock-default", "File", "shuffl-selectfile");
            var c = shuffl.createCardFromStock(jQuery("#stock_id"));
            ////log.debug("- card "+shuffl.objectString(c));
            var card_id = shuffl.lastId("card_");
            equals(c.attr('id'), card_id,       "card id attribute");
            ok(c.hasClass('shuffl-card'),   "shuffl card class");
            ok(c.hasClass('shuffl-card-setsize'),   "shuffl-card-setsize class");
            ok(c.hasClass('stock-default'),   "stock-default class");
            equals(c.attr('class'), 'shuffl-card-setsize stock-default ui-resizable shuffl-card', "CSS class");
            equals(c.find("ctitle").text(),     card_id, "card title field");
            equals(c.find("ccoll").text(), "(collection path)", "collection path field");
            equals(c.find("clist > cdir").text(), "(dir)/", "collection content listing field (dir)");
            equals(c.find("clist > cname").text(), "(filename)", "collection content listing field (name)");
            equals(c.find("cfile").text(), "(filename)", "file name field");            
            // Check saved card data
            var d = testcardselectfile_carddata;
            equals(c.data('shuffl:id'),    card_id, "layout card id");
            equals(c.data('shuffl:class'), "shuffl-selectfile", "saved card type");
            equals(c.data('shuffl:title'),    card_id, "shuffl:title");
            equals(c.data('shuffl:tags'),     "shuffl-selectfile", "shuffl:tags");
            equals(c.data('shuffl:fileuri'),  baseuri, "shuffl:fileuri");
            equals(c.data('shuffl:collpath'), "", "shuffl:collpath");
            equals(c.data('shuffl:filename'), "", "shuffl:filename");
            equals(c.data('shuffl:external')['shuffl:id'],          card_id, "card data id");
            equals(c.data('shuffl:external')['shuffl:class'],       "shuffl-selectfile", "card data class");
            equals(c.data('shuffl:external')['shuffl:version'],     d['shuffl:version'], "card data version");
            equals(c.data('shuffl:external')['shuffl:base-uri'],    d['shuffl:base-uri'], "card data base-uri");
            same(c.data('shuffl:external')['shuffl:uses-prefixes'], d['shuffl:uses-prefixes'], "card data uses-prefixes");
            equals(c.data('shuffl:external')['shuffl:data'],        undefined, "card data");
            setTimeout( function()
                {
                    equals(c.find("ccoll").text(), basepath, "collection path field");
                    equals(c.find("cfile").text(), "(Double-click to edit)", "file name field");
                    equals(c.data('shuffl:collpath'), basepath, "shuffl:collpath");
                    equals(c.data('shuffl:filename'), "", "shuffl:filename");
                    start();
                },
                500);
            stop(2500);
        });

    test("shuffl.createCardFromData",
        function () {
            logtest("TestCardSelectfile: shuffl.createCardFromData");
            var d = testcardselectfile_carddata;
            var c = shuffl.createCardFromData("cardfromdata_id", "shuffl-selectfile", d);
            // Check card details
            equals(c.attr('id'), "cardfromdata_id", "card id attribute");
            ok(c.hasClass('shuffl-card-setsize'), "shuffl card class");
            ok(c.hasClass('stock-default'),     "CSS class");
            equals(c.find("ctitle").text(),     "Card N title", "card title field");
            equals(c.find("ccoll").text(), "(collection path)", "collection path field");
            equals(c.find("clist > cdir").text(), "(dir)/", "collection content listing field (dir)");
            equals(c.find("clist > cname").text(), "(filename)", "collection content listing field (name)");
            equals(c.find("cfile").text(), "(filename)", "file name field");            
            // Check saved card data
            var d = testcardselectfile_carddata;
            equals(c.data('shuffl:id'),       "cardfromdata_id", "layout card id");
            equals(c.data('shuffl:class'),    "shuffl-selectfile", "saved card type");
            equals(c.data('shuffl:title'),    "Card N title", "shuffl:title");
            equals(c.data('shuffl:tags'),     "card_N_tag,footag", "shuffl:tags");
            equals(c.data('shuffl:fileuri'),  "./file", "shuffl:fileuri");
            equals(c.data('shuffl:collpath'), "", "shuffl:collpath");
            equals(c.data('shuffl:filename'), "", "shuffl:filename");
            same(c.data('shuffl:external'),   d,  "card data");
            setTimeout( function()
                {
                    equals(c.find("ccoll").text(), basepath, "collection path field");
                    equals(c.find("cfile").text(), "file", "file name field");
                    equals(c.data('shuffl:collpath'), basepath, "shuffl:collpath");
                    equals(c.data('shuffl:filename'), "file", "shuffl:filename");
                    start();
                },
                500);
            stop(2500);             
        });

    test("shuffl.createDataFromCard",
        function () {
            logtest("TestCardSelectfile: shuffl.createDataFromCard");
            // Create card (copy of code already tested)
            var d = testcardselectfile_carddata;
            var c = shuffl.createCardFromData("cardfromdata_id", "shuffl-selectfile", d);
            // (Re)create data and test
            var e = shuffl.createDataFromCard(c);
            setTimeout( function()
                {
                    equals(e['shuffl:id'],          "cardfromdata_id",         'shuffl:id');
                    equals(e['shuffl:class'],       "shuffl-selectfile",       'shuffl:class');
                    equals(e['shuffl:version'],     d['shuffl:version'],       'shuffl:version');
                    equals(e['shuffl:base-uri'],    d['shuffl:base-uri'],      'shuffl:base-uri');
                    same(e['shuffl:uses-prefixes'], d['shuffl:uses-prefixes'], 'shuffl:uses-prefixes');
                    equals(e['shuffl:data']['shuffl:title'], "Card N title",   'shuffl:data-title');
                    same(e['shuffl:data']['shuffl:tags'], [ 'card_N_tag', 'footag' ], 'shuffl:data-tags');
                    equals(e['shuffl:data']['shuffl:fileuri'], baseuri+"file", 'shuffl:fileuri');
                    for ( k in e['shuffl:data'] )
                    {
                        ok( d['shuffl:data'][k] != undefined, "Unexpected serialized data "+k);
                    }
                    start();
                },
                500);
            stop(2500);             
        });

    var checkFileList = function (card, tag, baseuri, files, types)
        {
        	var filelist = card.data('shuffl:filelist');
            equals(filelist.length, files.length, "shuffl:filelist.length ("+tag+")");
            for ( var i = 0 ; (i < files.length) && (i < filelist.length) ; i++ )
            {
                equals(filelist[i].uri,    baseuri+files[i], "shuffl:filelist["+i+"].uri");
                equals(filelist[i].relref, files[i],         "shuffl:filelist["+i+"].relref");
                equals(filelist[i].type,   types[i],         "shuffl:filelist["+i+"].type");
            }
        };

    test("shuffl.card.selectfile model 'shuffl:collpath' setting",
        function () {
		    var nextcallback;
            logtest("TestCardSelectfile: shuffl.card.selectfile model setting");
            expect(28);
            // Create card (copy of code already tested)
            var d = testcardselectfile_carddata;
            var c = shuffl.createCardFromData("cardfromdata_id", "shuffl-selectfile", d);
            var m = new shuffl.AsyncComputation();
            m.eval(function(val,callback) {
                // Continue testing after card is fully initialized
                setTimeout(callback, 500);
            });
            m.eval(function(val,callback) {
                // Check updatable values
                equals(c.find("ctitle").text(),     "Card N title", "card title field");
                equals(c.data('shuffl:collpath'), basepath, "shuffl:collpath");
                equals(c.data('shuffl:filename'), "file",   "shuffl:filename");
                // Simulate user input: set model to update title
                c.model("shuffl:title", "Card N updated");
                equals(c.find("ctitle").text(), "Card N updated", "updated title field");
                // Update collection path with new directory
                nextcallback = callback;
                c.modelBind("shuffl:filelist", nextcallback);
                c.model("shuffl:collpath", "testdir/");
            });
            m.eval(function(val,callback) {
                c.modelUnbind("shuffl:filelist", nextcallback);
                var files = [".svn/", "directory/", "test-csv.csv"];
                var types = ["collection", "collection", "item"];
                equals(c.data('shuffl:collpath'), basepath+"testdir/", "shuffl:collpath");
                checkFileList(c, "path:testdir", baseuri+"testdir/", files, types);
                equals(c.data('shuffl:filename'), "file", "shuffl:filename");
                // Update collection path with new filename
                c.model("shuffl:collpath", "newfile");
                // No refresh of file list this time..
                callback(val);
            })
            m.eval(function(val,callback) {
                var files = [".svn/", "directory/", "test-csv.csv"];
                var types = ["collection", "collection", "item"];
                equals(c.data('shuffl:collpath'), basepath+"testdir/", "shuffl:collpath");
                checkFileList(c, "path:testdir", baseuri+"testdir/", files, types);
                equals(c.data('shuffl:filename'), "newfile", "shuffl:filename");
                // Update collection path with new filename
                //nextcallback = callback;
                //c.modelBind("shuffl:filelist", nextcallback);
                //c.model("shuffl:collpath", "newfile");
                callback(val);
            }); 
            m.exec({}, start);
            stop(2500);
    });

/*
            // Simulate user input: set model to update title, tags and body text
            // Update title and tags
            c.model("shuffl:title", "Card N updated");
            c.model("shuffl:tags", "card_N_tag,bartag");
            equals(c.find("ctitle").text(),     "Card N updated", "updated title field");
            equals(c.find("ctags").text(),      "card_N_tag,bartag", "updated tags field");
            equals(c.find("cbaseuri").text(),   "http://example.com/base/", "card cbaseuri field");
            equals(c.find("cfile").text(),      "path/file", "card cfile field");
            equals(c.find("curi").text(),       "http://example.com/base/path/file", "card curi field");
            // Update base URI
            c.model("shuffl:baseuri", "http://example.com/newbase/");
            equals(c.find("cbaseuri").text(),   "http://example.com/newbase/", "updated cbaseuri field (1)");
            equals(c.find("cfile").text(),      "path/file", "card cfile field (1)");
            equals(c.find("curi").text(),       "http://example.com/newbase/path/file", "updated curi field (1)");
            // Update file name
            c.model("shuffl:file", "newpath/newfile");
            equals(c.find("ctitle").text(),     "Card N updated", "recheck title field");
            equals(c.find("ctags").text(),      "card_N_tag,bartag", "recheck tags field");
            equals(c.find("cbaseuri").text(),   "http://example.com/newbase/", "updated cbaseuri field (2)");
            equals(c.find("cfile").text(),      "newpath/newfile", "updated cfile field (2)");
            equals(c.find("curi").text(),       "http://example.com/newbase/newpath/newfile", "updated curi field (2)");
            // Update filename to empty string - check for placeholder
            c.model("shuffl:file", "");
            equals(c.find("cbaseuri").text(),   "http://example.com/newbase/", "updated cbaseuri field (3)");
            equals(c.find("cfile").text(),      "(Double-click to edit)", "updated cfile field (3)");
            equals(c.find("curi").text(),       "http://example.com/newbase/", "updated curi field (3)");
*/

};

// End
