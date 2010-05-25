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
    var webdav_root = null;
    var baseuri_list =
        [ "http://localhost/webdav/shuffl/static/test/"
        , "http://zoo-samos.zoo.ox.ac.uk/webdav/shuffl/static/test/"
        ];
    var webdav_root_list =
        [ "/webdav/shuffl/static/test/"
        , "/webdav/shuffl/static/test/"
        ];
    for (i in baseuri_list)
    {
        var b = baseuri_list[i];
        if (shuffl.starts(b, pageuri))
        {
            baseuri = b;
            webdav_root = webdav_root_list[i];
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
            { uri:      "http://localhost/test/"
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
                { 'shuffl:title':    "card-title"
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
                    equals(c.find("clist").text(), "../.svn/directory/test-csv.csv", "collection content listing field");
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
            equals(c.data('shuffl:fileuri'),  baseuri+"file", "shuffl:fileuri");
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
                var fileuri = jQuery.uri(files[i], baseuri).toString();
                equals(filelist[i].uri,    fileuri,  "shuffl:filelist["+i+"].uri");
                equals(filelist[i].relref, files[i], "shuffl:filelist["+i+"].relref");
                equals(filelist[i].type,   types[i], "shuffl:filelist["+i+"].type");
            }
        };

    test("shuffl.card.selectfile model 'shuffl:collpath' setting",
        function () {
		    var nextcallback;
            logtest("TestCardSelectfile: shuffl.card.selectfile model 'shuffl:collpath' setting");
            expect(72);
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
                equals(c.find("ctitle").text(), "Card N title", "card title field");
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
                var files = ["../", ".svn/", "directory/", "test-csv.csv"];
                var types = ["collection", "collection", "collection", "item"];
                equals(c.data('shuffl:collpath'), basepath+"testdir/", "shuffl:collpath");
                checkFileList(c, "path:testdir", baseuri+"testdir/", files, types);
                equals(c.data('shuffl:filename'), "file", "shuffl:filename");
                // Update collection path with new filename
                c.model("shuffl:collpath", "newfile");
                // No refresh of file list this time..
                callback(val);
            })
            m.eval(function(val,callback) {
                c.modelUnbind("shuffl:filelist", nextcallback);
                var files = ["../", ".svn/", "directory/", "test-csv.csv"];
                var types = ["collection", "collection", "collection", "item"];
                equals(c.data('shuffl:collpath'), basepath+"testdir/", "shuffl:collpath");
                checkFileList(c, "path:testdir", baseuri+"testdir/", files, types);
                equals(c.data('shuffl:filename'), "newfile", "shuffl:filename");
                // Update collection path with new directory and filename
                nextcallback = callback;
                c.modelBind("shuffl:filelist", nextcallback);
                c.model("shuffl:collpath", "directory/file3.c");
            }); 
            m.eval(function(val,callback) {
                c.modelUnbind("shuffl:filelist", nextcallback);
                var files = ["../", ".svn/", "file1.a", "file1.b", "file2.a"];
                var types = ["collection", "collection", "item", "item", "item"];
                equals(c.data('shuffl:collpath'), basepath+"testdir/directory/", "shuffl:collpath");
                checkFileList(c, "path:testdir", baseuri+"testdir/directory/", files, types);
                equals(c.data('shuffl:filename'), "file3.c", "shuffl:filename");
                equals(c.find("ccoll").text(), basepath+"testdir/directory/", "<ccoll>");
                // Update collection path with new directory and filename
                nextcallback = callback;
                c.modelBind("shuffl:filelist", nextcallback);
                c.model("shuffl:collpath", basepath+"testdir/directory/../");
            }); 
            m.eval(function(val,callback) {
                c.modelUnbind("shuffl:filelist", nextcallback);
                var files = ["../", ".svn/", "directory/", "test-csv.csv"];
                var types = ["collection", "collection", "collection", "item"];
                equals(c.data('shuffl:collpath'), basepath+"testdir/", "shuffl:collpath");
                checkFileList(c, "path:testdir", baseuri+"testdir/", files, types);
                equals(c.data('shuffl:filename'), "file3.c", "shuffl:filename");
                equals(c.find("ccoll").text(), basepath+"testdir/", "<ccoll>");
                // Update collection path with non-existent directory
                nextcallback = callback;
                c.modelBind("shuffl:filelist", nextcallback);
                c.model("shuffl:collpath", "../testdir/nosuchdirectory/");
            }); 
            m.eval(function(val,callback) {
                c.modelUnbind("shuffl:filelist", nextcallback);
                var files = [];
                var types = [];
                equals(c.data('shuffl:collpath'), basepath+"testdir/nosuchdirectory/", "shuffl:collpath");
                checkFileList(c, "path:testdir", baseuri+"testdir/nosuchdirectory/", files, types);
                equals(c.data('shuffl:filename'), "file3.c", "shuffl:filename");
                callback(val);
            }); 
            m.exec({}, start);
            stop(2500);
    });

    test("shuffl.card.selectfile model 'shuffl:filename' setting",
        function () {
            var nextcallback;
            logtest("TestCardSelectfile: shuffl.card.selectfile model 'shuffl:filename' setting");
            expect(55);
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
                equals(c.find("ctitle").text(), "Card N title", "card title field");
                equals(c.data('shuffl:collpath'), basepath, "shuffl:collpath");
                equals(c.data('shuffl:filename'), "file",   "shuffl:filename");
                // Simulate user input: set model to update title
                c.model("shuffl:title", "Card N updated");
                equals(c.find("ctitle").text(), "Card N updated", "updated title field");
                // Update collection path with new directory
                nextcallback = callback;
                c.modelBind("shuffl:filelist", nextcallback);
                c.model("shuffl:filename", "testdir/");
            });
            m.eval(function(val,callback) {
                c.modelUnbind("shuffl:filelist", nextcallback);
                var files = ["../", ".svn/", "directory/", "test-csv.csv"];
                var types = ["collection", "collection", "collection", "item"];
                equals(c.data('shuffl:collpath'), basepath+"testdir/", "shuffl:collpath");
                checkFileList(c, "path:testdir", baseuri+"testdir/", files, types);
                equals(c.data('shuffl:filename'), "", "shuffl:filename");
                // Update collection path with new filename
                c.model("shuffl:filename", "newfile");
                // No refresh of file list this time..
                callback(val);
            })
            m.eval(function(val,callback) {
                c.modelUnbind("shuffl:filelist", nextcallback);
                var files = ["../", ".svn/", "directory/", "test-csv.csv"];
                var types = ["collection", "collection", "collection", "item"];
                equals(c.data('shuffl:collpath'), basepath+"testdir/", "shuffl:collpath");
                checkFileList(c, "path:testdir", baseuri+"testdir/", files, types);
                equals(c.data('shuffl:filename'), "newfile", "shuffl:filename");
                // Update collection path with new directory and filename
                nextcallback = callback;
                c.modelBind("shuffl:filelist", nextcallback);
                c.model("shuffl:filename", "directory/file3.c");
            }); 
            m.eval(function(val,callback) {
                c.modelUnbind("shuffl:filelist", nextcallback);
                var files = ["../", ".svn/", "file1.a", "file1.b", "file2.a"];
                var types = ["collection", "collection", "item", "item", "item"];
                equals(c.data('shuffl:collpath'), basepath+"testdir/directory/", "shuffl:collpath");
                checkFileList(c, "path:testdir", baseuri+"testdir/directory/", files, types);
                equals(c.data('shuffl:filename'), "file3.c", "shuffl:filename");
                // Update collection path with non-existent directory
                nextcallback = callback;
                c.modelBind("shuffl:filelist", nextcallback);
                c.model("shuffl:filename", "../nosuchdirectory/file");
            }); 
            m.eval(function(val,callback) {
                c.modelUnbind("shuffl:filelist", nextcallback);
                var files = [];
                var types = [];
                equals(c.data('shuffl:collpath'), basepath+"testdir/nosuchdirectory/", "shuffl:collpath");
                checkFileList(c, "path:testdir", baseuri+"testdir/nosuchdirectory/", files, types);
                equals(c.data('shuffl:filename'), "file", "shuffl:filename");
                callback(val);
            }); 
            m.exec({}, start);
            stop(2500);
    });

    test("shuffl.card.selectfile model 'shuffl:filelist' selection",
        function () {
        var nextcallback;
            logtest("TestCardSelectfile: shuffl.card.selectfile model 'shuffl:filelist' selection");
            expect(52);
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
                equals(c.find("ctitle").text(), "Card N title", "card title field");
                equals(c.data('shuffl:collpath'), basepath, "shuffl:collpath");
                equals(c.data('shuffl:filename'), "file",   "shuffl:filename");
                // Simulate user input: set model to update title
                c.model("shuffl:title", "Card N updated");
                equals(c.find("ctitle").text(), "Card N updated", "updated title field");
                // Update collection path with new directory
                nextcallback = callback;
                c.modelBind("shuffl:filelist", nextcallback);
                c.model("shuffl:filename", "testdir/");
            });
            m.eval(function(val,callback) {
                c.modelUnbind("shuffl:filelist", nextcallback);
                var files = ["../", ".svn/", "directory/", "test-csv.csv"];
                var types = ["collection", "collection", "collection", "item"];
                equals(c.data('shuffl:collpath'), basepath+"testdir/", "shuffl:collpath");
                checkFileList(c, "path:testdir", baseuri+"testdir/", files, types);
                equals(c.data('shuffl:filename'), "", "shuffl:filename");
                // simulate click on file
                c.model("shuffl:filelistelem", 3);
                callback(val);
            });
            m.eval(function(val,callback) {
                c.modelUnbind("shuffl:filelist", nextcallback);
                var files = ["../", ".svn/", "directory/", "test-csv.csv"];
                var types = ["collection", "collection", "collection", "item"];
                equals(c.data('shuffl:collpath'), basepath+"testdir/", "shuffl:collpath");
                checkFileList(c, "path:testdir", baseuri+"testdir/", files, types);
                equals(c.data('shuffl:filename'), "test-csv.csv", "shuffl:filename");
                // simulate click on dir
                nextcallback = callback;
                c.modelBind("shuffl:filelist", nextcallback);
                c.model("shuffl:filelistelem", 2);
            });
            m.eval(function(val,callback) {
                c.modelUnbind("shuffl:filelist", nextcallback);
                var files = ["../", ".svn/", "file1.a", "file1.b", "file2.a"];
                var types = ["collection", "collection", "item", "item", "item"];
                equals(c.data('shuffl:collpath'), basepath+"testdir/directory/", "shuffl:collpath");
                checkFileList(c, "path:testdir", baseuri+"testdir/directory/", files, types);
                equals(c.data('shuffl:filename'), "", "shuffl:filename");
                callback(val);
            });
            m.exec({}, start);
            stop(2500);
    });

    test("shuffl.card.selectfile model non-webdav path setting",
        function () {
        var nextcallback;
            logtest("TestCardSelectfile: shuffl.card.selectfile non-webdav path setting");
            expect(27);
            // Create card (copy of code already tested)
            var d = testcardselectfile_carddata;
            var c = shuffl.createCardFromData("cardfromdata_id", "shuffl-selectfile", d);
            var m = new shuffl.AsyncComputation();
            var savelist = null;
            m.eval(function(val,callback) {
                // Continue testing after card is fully initialized
                setTimeout(callback, 500);
            });
            m.eval(function(val,callback) {
                // Check updatable values
                equals(c.find("ctitle").text(),     "Card N title", "card title field");
                equals(c.data('shuffl:collpath'), basepath, "shuffl:collpath");
                equals(c.data('shuffl:filename'), "file",   "shuffl:filename");
                // Update collection path with new directory
                nextcallback = callback;
                c.modelBind("shuffl:filelist", nextcallback);
                c.model("shuffl:collpath", webdav_root+"data/");
            });
            m.eval(function(val,callback) {
                c.modelUnbind("shuffl:filelist", nextcallback);
                equals(c.data('shuffl:collpath'), webdav_root+"data/", "shuffl:collpath");
                equals(c.data('shuffl:filename'), "file", "shuffl:filename");
                savelist = c.data('shuffl:filelist');
                // Update collection path with out-of-webdav path
                c.model("shuffl:collpath", webdav_root+"data/../../");
                nextcallback = callback;
                setTimeout(callback, 500);
            })
            m.eval(function(val,callback) {
                c.modelUnbind("shuffl:filelist", nextcallback);
                equals(c.data('shuffl:collpath'), webdav_root+"data/", "shuffl:collpath (.../data/../..)");
                equals(c.data('shuffl:filename'), "file", "shuffl:filename");
                same(c.data('shuffl:filelist'), savelist, "shuffl:filelist unchanged");
                // Update collection path with new directory
                c.model("shuffl:collpath", "../../");
                nextcallback = callback;
                setTimeout(callback, 500);
            })
            m.eval(function(val,callback) {
                c.modelUnbind("shuffl:filelist", nextcallback);
                equals(c.data('shuffl:collpath'), webdav_root+"data/", "shuffl:collpath (http://localhost/test/)");
                equals(c.data('shuffl:filename'), "file", "shuffl:filename");
                same(c.data('shuffl:filelist'), savelist, "shuffl:filelist unchanged");
                // Try valid session but without canList capability
                try
                {
                    c.model("shuffl:collpath", "http://localhost/test/");
                    ok(true, "No exception setting shuffl:collpath = http://localhost/test/");
                }
                catch (e)
                {
                    log.error("Exception setting shuffl:collpath = http://localhost/test/: "+e);
                    ok(false, "Exception setting shuffl:collpath = http://localhost/test/: "+e);
                }
                nextcallback = callback;
                setTimeout(callback, 500);
            });
            m.eval(function(val,callback) {
                c.modelUnbind("shuffl:filelist", nextcallback);
                equals(c.data('shuffl:collpath'), webdav_root+"data/", "shuffl:collpath (http://localhost/test/)");
                equals(c.data('shuffl:filename'), "file", "shuffl:filename");
                same(c.data('shuffl:filelist'), savelist, "shuffl:filelist unchanged");
                // Update collection path with new directory without listable parent
                try
                {
                    c.model("shuffl:collpath", webdav_root);
                    ok(true, "No exception setting shuffl:collpath = "+webdav_root);
                }
                catch (e)
                {
                    log.error("Exception setting shuffl:collpath = "+webdav_root+": "+e);
                    ok(false, "Exception setting shuffl:collpath = "+webdav_root+": "+e);
                }
                nextcallback = callback;
                setTimeout(callback, 500);
            })
            m.eval(function(val,callback) {
                c.modelUnbind("shuffl:filelist", nextcallback);
                equals(c.data('shuffl:collpath'), webdav_root, "shuffl:collpath (webdav_root)");
                equals(c.data('shuffl:filename'), "file", "shuffl:filename");
                // Check listing does not include "../" entry
                try
                {
                    var files = [".svn/", "data/", "images/"];
                    var types = ["collection", "collection", "collection"];
                    var filelist = c.data('shuffl:filelist').slice(0, 3);
                    for ( var i = 0 ; i < 3 ; i++ )
                    {
                        equals(filelist[i].uri,    baseuri+files[i], "shuffl:filelist["+i+"].uri");
                        equals(filelist[i].relref, files[i],         "shuffl:filelist["+i+"].relref");
                        equals(filelist[i].type,   types[i],         "shuffl:filelist["+i+"].type");
                    }
                }
                catch(e)
                {
                    ok(false, "Exception: "+e);
                };
                callback(val);
            }); 
            m.exec({}, start);
            stop(5000);
    });

    test("shuffl.clickCloseButton",
        function () {
            logtest("TestCardSelectfile: shuffl.clickCloseButton");
            expect(8);
            // Create card (copy of code already tested)
            var d = testcardselectfile_carddata;
            var c = shuffl.createCardFromData("cardfromdata_id", "shuffl-selectfile", d);
            var m = new shuffl.AsyncComputation();
            var savelist = null;
            m.eval(function(val,callback) {
                // Continue testing after card is fully initialized
                setTimeout(callback, 500);
            });
            m.eval(function(val,callback) {
                // Check updatable values
                equals(c.find("ctitle").text(),     "Card N title", "card title field");
                equals(c.data('shuffl:collpath'), basepath, "shuffl:collpath");
                equals(c.data('shuffl:filename'), "file",   "shuffl:filename");
                // Update collection path with new directory
                nextcallback = callback;
                c.modelBind("shuffl:filelist", nextcallback);
                c.model("shuffl:collpath", webdav_root+"data/closevalue");
            });
            m.eval(function(val,callback) {
                c.modelUnbind("shuffl:filelist", nextcallback);
                equals(c.data('shuffl:collpath'), webdav_root+"data/", "shuffl:collpath (data)");
                equals(c.data('shuffl:filename'), "closevalue", "shuffl:filename");
                // Simulate click on close button
                nextcallback = function (event, val) { callback(val); };
                c.modelBind("shuffl:closeUri", nextcallback);
                c.model("shuffl:close", "-");
            });
            m.eval(function(val,callback) {
                c.modelUnbind("shuffl:closeUri", nextcallback);
                equals(val.name, "shuffl:closeUri", "shuffl:closeUri (name)");
                equals(val.oldval, undefined, "shuffl:closeUri (oldval)");
                equals(val.newval.toString(), baseuri+"data/closevalue", "shuffl:closeUri (oldval)");
                callback(val);
            });
            m.exec({}, start);
            stop(2500);             
        });

};

// End
