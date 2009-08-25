// $Id$

/**
 * Test suite for AtomPub protocol handler
 */

/**
 * Function to register tests
 */
TestAtomPub = function() {

    var save_item_uri1;
    var save_item_val1;
    var save_item_uri2;
    var save_item_val2;
    var save_item_uri3;
    var save_item_val3;

    module("TestAtomPub - feed manipulation");

    log.info("TestAtomPub requires eXist service running on localhost:8080");

    test("Introspect initial service", 
        function () {
            log.debug("---------- 1. Introspect initial service: start ----------");
            expect(2);
            var m = new shuffl.AsyncComputation();
            m.eval(
                function (val, callback) {
                    log.debug("  init: "+val);
                    m.atompub = new shuffl.AtomPub(val);
                    m.atompub.feedInfo({path:"/"}, callback);
                });
            m.exec("http://localhost:8080/exist/",
                function(val) {
                    log.debug("  finish: "+shuffl.objectString(val));
                    equals(val.path, "/", "root path");
                    equals(val.uri, undefined, "root feed uri (no such feed)");
                    log.debug("---------- 1. ----------");
                    start();    // Resume next test
                });
            stop();   // Stop for test to run
            log.debug("Introspect initial service: done");
        });

    test("Introspect initial service done", 
        function () {
            log.debug("Introspect initial service done");
        });

    test("Create new feed at service root", 
        function () {
            log.debug("---------- 2. Create new feed at service root ----------");
            expect(11);
            var m = new shuffl.AsyncComputation();
            m.eval(
                function (val, callback) {
                    m.atompub = new shuffl.AtomPub(val);
                    // First delete old feed, ignore status response
                    m.atompub.deleteFeed(
                        {path:"/testfeed"}, 
                        callback);
                });
            m.eval(
                function (val, callback) {
                    m.atompub.createFeed(
                        {base:"/", name:"testfeed", title:"Test feed"}, 
                        callback);
                });
            m.eval(
                function (val, callback) {
                    equals(val.path, "/testfeed", "New feed path returned");
                    equals(val.uri,  
                        "http://localhost:8080/exist/atom/edit/testfeed",
                        "New feed URI returned");
                    m.atompub.feedInfo({path: "/testfeed"}, callback);
                });
            m.eval(
                function (val, callback) {
                    equals(val.path, "/testfeed", "New feed path retrieved");
                    equals(val.uri,
                        "http://localhost:8080/exist/atom/edit/testfeed",
                        "New feed URI retrieved");
                    equals(val.title, "Test feed", "New feed title retrieved");
                    m.atompub.listFeed({path: "/testfeed"}, callback);
                });
            m.exec("http://localhost:8080/exist/",
                function(val) {
                    equals(val.path, "/testfeed", "New feed path listed");
                    equals(shuffl.uriWithoutFragment(val.uri),
                        "http://localhost:8080/exist/atom/edit/testfeed",
                        "New feed URI listed");
                    equals(val.title, "Test feed", "New feed title listed");
                    equals(val.id.slice(0,8), "urn:uuid", "New feed id listed");
                    equals(val.updated.slice(0,2), "20", "New feed update-date listed");
                    same(val.entries, [], "New feed empty");
                    log.debug("---------- 2. ----------");
                    start();
                });
            stop(2000);
        });

    test("Create feed in non-root location", 
        function () {
            log.debug("---------- 3. Create feed in non-root location ----------");
            expect(4);
            var m = new shuffl.AsyncComputation();
            m.eval(
                function (val, callback) {
                    m.atompub = new shuffl.AtomPub(val);
                    // First delete old feed, ignore status response
                    m.atompub.deleteFeed(
                        {path:"/other/loc/otherfeed"}, 
                        callback);
                });
            m.eval(
                function (val, callback) {
                    m.atompub.createFeed(
                        {base:"/other/loc/", name:"otherfeed", title:"Other feed"}, 
                        callback);
                });
            m.eval(
                function (val, callback) {
                    equals(val.path, "/other/loc/otherfeed", "New feed path returned");
                    equals(val.uri,  
                        "http://localhost:8080/exist/atom/edit/other/loc/otherfeed",
                        "New feed URI returned");
                    callback(val);
                });
            m.exec("http://localhost:8080/exist/",
                function(val) {
                    log.debug("- return: "+shuffl.objectString(val));
                    equals(val.path, "/other/loc/otherfeed", "New feed path returned");
                    equals(val.uri,  
                        "http://localhost:8080/exist/atom/edit/other/loc/otherfeed",
                        "New feed URI returned");
                    log.debug("---------- 3. ----------");
                    start();
                });
            stop(2000);
        });

    test("Try to create feed in unavailable service", 
        function () {
            log.debug("---------- 4. Try to create feed in unavailable service ----------");
            expect(6);
            var m = new shuffl.AsyncComputation();
            m.eval(
                function (val, callback) {
                    m.atompub = new shuffl.AtomPub(val);
                    // First delete old feed, ignore status response
                    m.atompub.deleteFeed(
                        {path:"/nopath/nofeed"}, 
                        callback);
                });
            m.eval(
                function (val, callback) {
                    m.atompub.createFeed(
                        {base:"/", name:"otherfeed", title:"Other feed"}, 
                        callback);
                });
            m.exec("http://localhost:8080/noexist/",
                function(val) {
                    //log.debug("- return: "+shuffl.objectString(val));
                    equals(val.val, "error", "Error response");
                    equals(val.msg, "AtomPub request failed", "msg");
                    equals(val.message, "AtomPub request failed", "message");
                    equals(val.HTTPstatus, 404);
                    equals(val.HTTPstatusText, "%2Fnoexist%2Fatom%2Fedit%2Fotherfeed+Not+Found");
                    equals(val.response, "404 %2Fnoexist%2Fatom%2Fedit%2Fotherfeed+Not+Found", "response");
                    log.debug("---------- 4. ----------");
                    start();
                });
            stop(2000);
        });

    test("Delete feed at root", 
        function () {
            log.debug("---------- 5. Delete feed just created ----------");
            expect(9);
            var m = new shuffl.AsyncComputation();
            m.eval(
                function (val, callback) {
                    m.atompub = new shuffl.AtomPub(val);
                    m.atompub.deleteFeed(
                        {path:"/testfeed"}, 
                        callback);
                });
            m.eval(
                function (val, callback) {
                    //log.debug("- deleteFeed return: "+shuffl.objectString(val));
                    same(val, {}, "deleteFeed return value");
                    m.atompub.feedInfo({path: "/testfeed"}, callback);
                });
            m.eval(
                function (val, callback) {
                    //log.debug("- feedInfo return: "+shuffl.objectString(val));
                    equals(val.val,        "error", 
                        "feedInfo return val");
                    equals(val.message,    "AtomPub request failed", 
                        "feedInfo return message");
                    equals(val.HTTPstatus, 400, 
                        "feedInfo return HTTPstatus");
                    equals(val.HTTPstatusText, 
                        "Collection+%2Ftestfeed+does+not+exist%2E", 
                        "feedInfo return HTTPstatusText");
                    m.atompub.listFeed({path: "/testfeed"}, callback);
                });
            m.exec("http://localhost:8080/exist/",
                function(val) {
                    //log.debug("- listFeed return: "+shuffl.objectString(val));
                    equals(val.val,        "error", 
                        "feedInfo return val");
                    equals(val.message,    "AtomPub request failed", 
                        "feedInfo return message");
                    equals(val.HTTPstatus, 404,
                        "feedInfo return HTTPstatus");
                    equals(val.HTTPstatusText, 
                        "Resource+%2Ftestfeed+not+found", 
                        "feedInfo return HTTPstatusText");
                    log.debug("---------- 5. ----------");
                    start();
                });
            stop(2000);
        });

    module("TestAtomPub - item manipulation");

    //module("TestAtomPub - item manipulation (atom data)");

    // 1. Create item test feed.  Check response and no content.
    test("Create item test feed", 
        function () {
            log.debug("---------- 6. Create item test feed ----------");
            expect(11);
            var m = new shuffl.AsyncComputation();
            m.eval(
                function (val, callback) {
                    m.atompub = new shuffl.AtomPub(val);
                    // First delete old feed, ignore status response
                    m.atompub.deleteFeed(
                        {path:"/item/test/feed"}, 
                        callback);
                });
            m.eval(
                function (val, callback) {
                    m.atompub.createFeed(
                        {base:"/item/test/", name:"feed", title:"Item test feed"}, 
                        callback);
                });
            m.eval(
                function (val, callback) {
                    equals(val.path, "/item/test/feed", "Item test feed path returned");
                    equals(val.uri,  
                        "http://localhost:8080/exist/atom/edit/item/test/feed",
                        "Item test feed URI returned");
                    m.atompub.feedInfo({path: "/item/test/feed"}, callback);
                });
            m.eval(
                function (val, callback) {
                    equals(val.path, "/item/test/feed", "Item test feed path retrieved");
                    equals(val.uri,
                        "http://localhost:8080/exist/atom/edit/item/test/feed",
                        "Item test feed URI retrieved");
                    equals(val.title, "Item test feed", "Item test feed title retrieved");
                    m.atompub.listFeed({path: "/item/test/feed"}, callback);
                });
            m.eval(
                function (val, callback) {
                    equals(val.path, "/item/test/feed", "Item test feed path listed");
                    equals(shuffl.uriWithoutFragment(val.uri),
                        "http://localhost:8080/exist/atom/edit/item/test/feed",
                        "Item test feed URI listed");
                    equals(val.title, "Item test feed", "Item test feed title listed");
                    equals(val.id.slice(0,8), "urn:uuid", "Item test feed id listed");
                    equals(val.updated.slice(0,2), "20", "Item test feed update-date listed");
                    same(val.entries, [], "Item test feed empty");
                    callback(val);
                });
            m.exec("http://localhost:8080/exist/",
                function(val) {
                    // final tests
                    log.debug("---------- 6. ----------");
                    start();
                });
            stop(2000);
        });

    // 2. Create data item in item feed.  Check response and note URI.
    // 3. Read newly created feed item.  Check content is correct.
    // 4. List feed content; check item is listed. 
    test("Create new item", 
        function () {
            log.debug("---------- 7. Create new item ----------");
            expect(22);
            var m = new shuffl.AsyncComputation();
            m.atompub = new shuffl.AtomPub("http://localhost:8080/exist/");
            m.eval(
                function (val, callback) {
                    // createitem([feed, slug, title, data], callback)
                    // -> callback returns actual URI of created object, 
                    //    or error information
                    m.atompub.createItem(
                        { path:  "/item/test/feed", slug:"testitem1"
                        , title: "Test item 1"
                        , data:  {a:"A", b:"B"}
                        },
                        callback);
                });
            m.eval(
                function (val, callback) {
                    log.debug("- createItem return: "+shuffl.objectString(val));
                    equals(val.uri.toString().replace(/urn:uuid:.*$/, "urn:uuid:..."),
                        "http://localhost:8080/exist/atom/edit/item/test/feed?id=urn:uuid:...",
                        "Item URI returned");
                    equals(val.path, m.atompub.getAtomPath(val.uri), 
                        "Item path returned");
                    equals(val.id, val.uri.query.replace(/id=/, ""),
                        "Item Id returned");
                    equals(val.created.slice(0,2), 
                        "20", 
                        "Item creation time returned");
                    equals(val.updated.slice(0,2), 
                        "20", 
                        "Item updated time returned");
                    equals(val.title, 
                        "Test item 1", 
                        "Item title returned");
                    equals(val.data, 
                        '{"a": "A", "b": "B"}',
                        "Item data returned");
                    equals(typeof val.data, "string",
                        "Item data type returned");
                    equals(val.dataref, undefined, 
                        "Item data reference returned");
                    save_item_uri1 = val.uri;
                    save_item_val1 = val;
                    m.atompub.getItem({uri: save_item_uri1}, callback);
                });
            m.eval(
                function (val, callback) {
                    //log.debug("- getItem return: "+shuffl.objectString(val));
                    same(val, save_item_val1, "getItem item details retrieved");
                    m.atompub.listFeed({path: "/item/test/feed"}, callback);
                });
            m.eval(
                function (val, callback) {
                    equals(val.path, "/item/test/feed", "Item test feed path listed");
                    equals(shuffl.uriWithoutFragment(val.uri),
                        "http://localhost:8080/exist/atom/edit/item/test/feed",
                        "Item test feed URI listed");
                    equals(val.title, "Item test feed", "Item test feed title listed");
                    equals(val.id.slice(0,8), "urn:uuid", "Item test feed id listed");
                    equals(val.updated.slice(0,2), "20", "Item test feed update-date listed");
                    equals(val.entries.length, 1, "Feed has one item");
                    equals(val.entries[0].id,      save_item_val1.id,      "Feed item id");
                    equals(val.entries[0].path,    save_item_val1.path,    "Feed item path");
                    equals(val.entries[0].uri,     save_item_val1.uri,     "Feed item uri");
                    equals(val.entries[0].title,   save_item_val1.title,   "Feed item title");
                    equals(val.entries[0].created, save_item_val1.created, "Feed item created");
                    equals(val.entries[0].updated, save_item_val1.updated, "Feed item updated");
                    callback(val);
                });
            m.exec(null,
                function(val) {
                    log.debug("---------- 7. ----------");
                    start();
                });
            stop(2000);
        });

    // 6. Update content of item, check response.
    // 7. Get item: check is updated as appropriate
    test("Update item", 
        function () {
            log.debug("---------- 8. Update item ----------");
            expect(9);
            var m = new shuffl.AsyncComputation();
            m.atompub = new shuffl.AtomPub("http://localhost:8080/exist/");
            m.eval(
                function (val, callback) {
                    // putitem([uri, data], callback)
                    //  -> callback returns item information, or error information
                    m.atompub.putItem(
                        { uri:   save_item_uri1
                        , title: "Test item updated"
                        , data:  {a:"AA", b:"BB"}
                        },
                        callback);
                });
            m.eval(
                function (val, callback) {
                    //log.debug("- putItem return: "+shuffl.objectString(val));
                    equals(val.uri,  save_item_uri1, 
                        "Updated item URI returned");
                    equals(val.path, m.atompub.getAtomPath(save_item_uri1), 
                        "Updated item path returned");
                    equals(val.created, 
                        save_item_val1.created, 
                        "Updated item creation time returned");
                    equals(val.updated.slice(0,2), 
                        "20", 
                        "Updated item updated time returned");
                    equals(val.title, 
                        "Test item updated", 
                        "Updated item title returned");
                    equals(val.data, 
                        '{"a": "AA", "b": "BB"}',
                        "Updated item data returned");
                    equals(typeof val.data, "string",
                        "Updated item data type returned");
                    equals(val.dataref, undefined, 
                        "Item data reference returned");
                    save_item_val_updated = val;
                    m.atompub.getItem({uri: save_item_uri1}, callback);
                });
            m.eval(
                function (val, callback) {
                    //log.debug("- getItem updated item return: "+shuffl.objectString(val));
                    same(val, save_item_val_updated, 
                        "getItem updated item details retrieved");
                    m.atompub.listFeed({path: "/item/test/feed"}, callback);
                });
            m.exec(null,
                function(val) {
                    log.debug("---------- 8. ----------");
                    start();
                });
            stop(2000);
        });

    //module("TestAtomPub - item manipulation (non-atom data)");

    // 8. Add second item with non Atom type, check response
    test("Create item with non-atom data", 
        function () {
            log.debug("---------- 9. Create item with non-atom data ----------");
            expect(12);
            var m = new shuffl.AsyncComputation();
            m.atompub = new shuffl.AtomPub("http://localhost:8080/exist/");
            m.eval(
                function (val, callback) {
                    m.atompub.createItem(
                        { path:     "/item/test/feed"
                        , slug:     "testitem2.json"
                        , title:    "Test item 2"
                        , datatype: "application/json"
                        , data:     {a:"A2", b:"B2"}
                        },
                        callback);
                });
            m.eval(
                function (val, callback) {
                    log.debug("- createItem (non-atom) return: "+shuffl.objectString(val));
                    equals(val.uri.toString().replace(/urn:uuid:.*$/, "urn:uuid:..."),
                        "http://localhost:8080/exist/atom/edit/item/test/feed?id=urn:uuid:...",
                        "Item URI returned");
                    equals(val.path, m.atompub.getAtomPath(val.uri), 
                        "Item path returned");
                    equals(val.id, val.uri.query.replace(/id=/, ""),
                        "Item Id returned");
                    equals(val.created.slice(0,2), 
                        "20", 
                        "Item creation time returned");
                    equals(val.updated.slice(0,2), 
                        "20", 
                        "Item updated time returned");
                    equals(val.title, 
                        "Test item 2", 
                        "Item title returned");
                    equals(val.data, undefined,
                        "Item data returned");
                    equals(val.dataref, "testitem2.json", 
                        "Item data reference returned");
                    equals(val.datatype, "application/octet-stream", // TODO: "application/json", 
                        "Item data content-type returned");
                    equals(val.datauri, "http://localhost:8080/exist/atom/edit/item/test/testitem2.json", 
                        "Item data URI returned");
                    equals(val.datapath, "/item/test/testitem2.json", 
                        "Item data URI path returned");
                    save_item_uri1 = val.uri;
                    save_item_val1 = val;
                    m.atompub.getItem({uri: save_item_uri1}, callback);
                });
            m.eval(
                function (val, callback) {
                    log.debug("- getItem return: "+shuffl.objectString(val));
                    same(val, save_item_val1, "getItem item details retrieved");
                    callback(val);
                });
            m.exec(null,
                function(val) {
                    log.debug("---------- 9. ----------");
                    start();
                });
            stop(2000);
        });

};

        // 
        // 10. List feed, check three items.
        // 
        // 11. Delete first item; check response.
        // 
        // 13. List feed; check only second/third items remain.
        // 
        // 14. Delete test feed.
        // 
        // 15. Get item info; check item no longer exists


// End
