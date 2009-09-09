// $Id$

/**
 * Test suite for AtomPub protocol handler
 */

/**
 * Function to register tests
 */
TestAtomPub = function() {

    var atomserviceuri = "http://localhost:8080/exist/atom/";

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
            log.debug("----- 1. Introspect initial service: start -----");
            expect(2);
            var m = new shuffl.AsyncComputation();
            m.eval(
                function (val, callback) {
                    log.debug("  init: "+val);
                    m.atompub = new shuffl.AtomPub(val);
                    m.atompub.feedInfo({path:"/"}, callback);
                });
            m.exec(atomserviceuri,
                function(val) {
                    log.debug("  finish: "+shuffl.objectString(val));
                    equals(val.path, "/", "root path");
                    equals(val.uri, undefined, "root feed uri (no such feed)");
                    log.debug("----- 1. -----");
                    start();    // Resume next test
                });
            stop();   // Stop for test to run
            log.debug("Introspect initial service: done");
        });

    test("Create new feed at service root", 
        function () {
            log.debug("----- 2. Create new feed at service root -----");
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
            m.exec(atomserviceuri,
                function(val) {
                    equals(val.path, "/testfeed", "New feed path listed");
                    equals(shuffl.uriWithoutFragment(val.uri),
                        "http://localhost:8080/exist/atom/edit/testfeed",
                        "New feed URI listed");
                    equals(val.title, "Test feed", "New feed title listed");
                    equals(val.id.slice(0,8), "urn:uuid", "New feed id listed");
                    equals(val.updated.slice(0,2), "20", "New feed update-date listed");
                    same(val.entries, [], "New feed empty");
                    log.debug("----- 2. -----");
                    start();
                });
            stop(2000);
        });

    test("Create feed in non-root location", 
        function () {
            log.debug("----- 3. Create feed in non-root location -----");
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
                    //log.debug("- createFeed return: "+shuffl.objectString(val));
                    equals(val.path, "/other/loc/otherfeed", "New feed path returned");
                    equals(val.uri,  
                        "http://localhost:8080/exist/atom/edit/other/loc/otherfeed",
                        "New feed URI returned");
                    callback(val);
                });
            m.exec(atomserviceuri,
                function(val) {
                    equals(val.path, "/other/loc/otherfeed", "New feed path returned");
                    equals(val.uri,  
                        "http://localhost:8080/exist/atom/edit/other/loc/otherfeed",
                        "New feed URI returned");
                    log.debug("----- 3. -----");
                    start();
                });
            stop(2000);
        });

    test("Try to create feed in unavailable service", 
        function () {
            log.debug("----- 4. Try to create feed in unavailable service -----");
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
            m.exec("http://localhost:8080/noexist/atom/",
                function(val) {
                    //log.debug("- return: "+shuffl.objectString(val));
                    equals(val.val, "error", "Error response");
                    equals(val.msg, "AtomPub request failed", "msg");
                    equals(val.message, "AtomPub request failed", "message");
                    equals(val.HTTPstatus, 404);
                    equals(val.HTTPstatusText, "%2Fnoexist%2Fatom%2Fedit%2Fotherfeed+Not+Found");
                    equals(val.response, "404 %2Fnoexist%2Fatom%2Fedit%2Fotherfeed+Not+Found", "response");
                    log.debug("----- 4. -----");
                    start();
                });
            stop(2000);
        });

    test("Delete feed at root", 
        function () {
            log.debug("----- 5. Delete feed just created -----");
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
            m.exec(atomserviceuri,
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
                    log.debug("----- 5. -----");
                    start();
                });
            stop(2000);
        });

    module("TestAtomPub - item manipulation");

    //module("TestAtomPub - item manipulation (atom data)");

    // 1. Create item test feed.  Check response and no content.
    test("Create item test feed", 
        function () {
            log.debug("----- 6. Create item test feed -----");
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
            m.exec(atomserviceuri,
                function(val) {
                    // final tests
                    log.debug("----- 6. -----");
                    start();
                });
            stop(2000);
        });

    // 2. Create data item in item feed.  Check response and note URI.
    // 3. Read newly created feed item.  Check content is correct.
    // 4. List feed content; check item is listed. 
    test("Create new item", 
        function () {
            log.debug("----- 7. Create new item -----");
            expect(22);
            var m = new shuffl.AsyncComputation();
            m.atompub = new shuffl.AtomPub(atomserviceuri);
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
                    //log.debug("- createItem return: "+shuffl.objectString(val));
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
                    log.debug("----- 7. -----");
                    start();
                });
            stop(2000);
        });

    // 6. Update content of item, check response.
    // 7. Get item: check is updated as appropriate
    test("Update item", 
        function () {
            log.debug("----- 8. Update item -----");
            expect(9);
            var m = new shuffl.AsyncComputation();
            m.atompub = new shuffl.AtomPub(atomserviceuri);
            m.eval(
                function (val, callback) {
                    // putitem([uri, data], callback)
                    //  -> callback returns item information, or error information
                    m.atompub.putItem(
                        { uri:   save_item_uri1
                        , title: "Test item 1 updated"
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
                        "Test item 1 updated", 
                        "Updated item title returned");
                    equals(val.data, 
                        '{"a": "AA", "b": "BB"}',
                        "Updated item data returned");
                    equals(typeof val.data, "string",
                        "Updated item data type returned");
                    equals(val.dataref, undefined, 
                        "Item data reference returned");
                    save_item_val1 = val;
                    m.atompub.getItem({uri: save_item_uri1}, callback);
                });
            m.eval(
                function (val, callback) {
                    //log.debug("- getItem updated item return: "+shuffl.objectString(val));
                    same(val, save_item_val1, 
                        "getItem updated item details retrieved");
                    callback(val);
                });
            m.exec(null,
                function(val) {
                    log.debug("----- 8. -----");
                    start();
                });
            stop(2000);
        });

    // 8. Add second item with non Atom type, check response
    test("Create item with non-atom data", 
        function () {
            log.debug("----- 9. Create item with non-atom data -----");
            expect(12);
            var m = new shuffl.AsyncComputation();
            m.atompub = new shuffl.AtomPub(atomserviceuri);
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
                    //log.debug("- createItem (non-atom) return: "+shuffl.objectString(val));
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
                    save_item_uri2 = val.uri;
                    save_item_val2 = val;
                    m.atompub.getItem({uri: save_item_uri2}, callback);
                });
            m.eval(
                function (val, callback) {
                    //log.debug("- getItem return: "+shuffl.objectString(val));
                    same(val, save_item_val2, "getItem item details retrieved");
                    callback(val);
                });
            m.exec(null,
                function(val) {
                    log.debug("----- 9. -----");
                    start();
                });
            stop(2000);
        });

    // 10. List feed, check two items.
    test("List feed, check two items", 
        function () {
            log.debug("----- 10. List feed, check two items -----");
            expect(18);
            var m = new shuffl.AsyncComputation();
            m.atompub = new shuffl.AtomPub(atomserviceuri);
            m.eval(
                function (val, callback) {
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
                    equals(val.entries.length, 2, "Feed has two items");
                    // Note: feed items may be listed in either order
                    var i1 = val.entries[0].id == save_item_val1.id ? 0 : 1;
                    var i2 = 1-i1;
                    equals(val.entries[i1].id,      save_item_val1.id,      "Feed item 1 id");
                    equals(val.entries[i1].path,    save_item_val1.path,    "Feed item 1 path");
                    equals(val.entries[i1].uri,     save_item_val1.uri,     "Feed item 1 uri");
                    equals(val.entries[i1].title,   save_item_val1.title,   "Feed item 1 title");
                    equals(val.entries[i1].created, save_item_val1.created, "Feed item 1 created");
                    equals(val.entries[i1].updated, save_item_val1.updated, "Feed item 1 updated");
                    equals(val.entries[i2].id,      save_item_val2.id,      "Feed item 2 id");
                    equals(val.entries[i2].path,    save_item_val2.path,    "Feed item 2 path");
                    equals(val.entries[i2].uri,     save_item_val2.uri,     "Feed item 2 uri");
                    equals(val.entries[i2].title,   save_item_val2.title,   "Feed item 2 title");
                    equals(val.entries[i2].created, save_item_val2.created, "Feed item 2 created");
                    equals(val.entries[i2].updated, save_item_val2.updated, "Feed item 2 updated");
                    callback(val);
                });
            m.exec(null,
                function(val) {
                    log.debug("----- 10. -----");
                    start();
                });
            stop(2000);
        });

    // 11. Delete first item; check response.
    test("Delete item", 
        function () {
            log.debug("----- 11. Delete item -----");
            expect(5);
            var m = new shuffl.AsyncComputation();
            m.atompub = new shuffl.AtomPub(atomserviceuri);
            m.eval(
                function (val, callback) {
                    m.atompub.deleteItem({ uri: save_item_uri1}, callback);
                });
            m.eval(
                function (val, callback) {
                    //log.debug("- deleteItem return: "+shuffl.objectString(val));
                    same(val, {}, "deleteItem return value");
                    m.atompub.getItem({uri: save_item_uri1}, callback);
                });
            m.eval(
                function (val, callback) {
                    //log.debug("- getItem deleted item return: "+shuffl.objectString(val));
                    equals(val.val,        "error", 
                        "getItem deleted item return val");
                    equals(val.message,    "AtomPub request failed", 
                        "getItem deleted item return message");
                    equals(val.HTTPstatus, 400, 
                        "getItem deleted item return HTTPstatus");
                    equals(val.HTTPstatusText, 
                        "No+topic+was+found%2E", 
                        "getItem deleted item return HTTPstatusText");
                    callback(val);
                });
            m.exec(null,
                function(val) {
                    log.debug("----- 11. -----");
                    start();
                });
            stop(2000);
        });


    // 13. List feed; check only second item remains.
    test("List feed; check only second item remains", 
        function () {
            log.debug("----- 12. List feed; check only second item remains -----");
            expect(13);
            var m = new shuffl.AsyncComputation();
            m.atompub = new shuffl.AtomPub(atomserviceuri);
            m.eval(
                function (val, callback) {
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
                    equals(val.entries.length, 1, "Feed has two items");
                    equals(val.entries[0].id,      save_item_val2.id,      "Feed item 2 id");
                    equals(val.entries[0].path,    save_item_val2.path,    "Feed item 2 path");
                    equals(val.entries[0].uri,     save_item_val2.uri,     "Feed item 2 uri");
                    equals(val.entries[0].title,   save_item_val2.title,   "Feed item 2 title");
                    equals(val.entries[0].created, save_item_val2.created, "Feed item 2 created");
                    equals(val.entries[0].updated, save_item_val2.updated, "Feed item 2 updated");
                    m.atompub.getItem({uri: save_item_uri2}, callback);
                });
            m.eval(
                function (val, callback) {
                    //log.debug("- getItem return: "+shuffl.objectString(val));
                    same(val, save_item_val2, "getItem item details retrieved");
                    callback(val);
                });
            m.exec(null,
                function(val) {
                    log.debug("----- 12. -----");
                    start();
                });
            stop(2000);
        });

    // 14. Delete test feed.
    test("Delete test feed", 
        function () {
            log.debug("----- 13. Delete test feed -----");
            expect(5);
            var m = new shuffl.AsyncComputation();
            m.eval(
                function (val, callback) {
                    m.atompub = new shuffl.AtomPub(val);
                    m.atompub.deleteFeed(
                        {path:"/item/test/feed"}, 
                        callback);
                });
            m.eval(
                function (val, callback) {
                    //log.debug("- deleteFeed return: "+shuffl.objectString(val));
                    same(val, {}, "deleteFeed return value");
                    m.atompub.feedInfo({path: "/item/test/feed"}, callback);
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
                        "Collection+%2Fitem%2Ftest%2Ffeed+does+not+exist%2E", 
                        "feedInfo return HTTPstatusText");
                    callback(val);
                });
            m.exec(atomserviceuri,
                function(val) {
                    log.debug("----- 13. -----");
                    start();
                });
            stop(2000);
        });

    // 15. Get item; check it no longer exists
    test("Get item; check it no longer exists", 
        function () {
            log.debug("----- 14. Get item; check it no longer exists -----");
            expect(4);
            var m = new shuffl.AsyncComputation();
            m.atompub = new shuffl.AtomPub(atomserviceuri);
            m.eval(
                function (val, callback) {
                    m.atompub.getItem({uri: save_item_uri2}, callback);
                });
            m.eval(
                function (val, callback) {
                    //log.debug("- getItem return: "+shuffl.objectString(val));
                    equals(val.val,        "error", 
                        "getItem deleted item return val");
                    equals(val.message,    "AtomPub request failed", 
                        "getItem deleted item return message");
                    equals(val.HTTPstatus, 404, 
                        "getItem deleted item return HTTPstatus");
                    equals(val.HTTPstatusText, 
                        "Resource+%2Fitem%2Ftest%2Ffeed+not+found", 
                        "getItem deleted item return HTTPstatusText");
                    callback(val);
                });
            m.exec(null,
                function(val) {
                    log.debug("----- 14. -----");
                    start();
                });
            stop(2000);
        });

    // Create feed, create media resource, try to delete media resource
    test("Delete media resource", function () {
            log.debug("----- 15. Delete media resource -----");
            expect(8);
            var m = new shuffl.AsyncComputation();
            m.atompub = new shuffl.AtomPub(atomserviceuri);
            m.eval(
                function (val, callback) {
                    m.atompub.createFeed(
                        {base:"/item/test/", name:"feed", title:"Item test feed"}, 
                        callback);
                });
            m.eval(
                function (val, callback) {
                    equals(val.uri.toString(),  
                        "http://localhost:8080/exist/atom/edit/item/test/feed",
                        "New feed URI");
                    m.atompub.createItem(
                        { path:     "/item/test/feed"
                        , slug:     "testitem3.json"
                        , title:    "Test item 3"
                        , datatype: "application/json"
                        , data:     {a:"A3", b:"B"}
                        },
                        callback);
                });
            m.eval(
                function (val, callback) {
                    //log.debug("- createItem (non-atom) return: "+shuffl.objectString(val));
                    equals(val.uri.toString(), "http://localhost:8080/exist/atom/edit/item/test/feed?id="+val.id,
                        "Item URI returned");
                    equals(val.datauri, "http://localhost:8080/exist/atom/edit/item/test/testitem3.json", 
                        "Item data URI returned");
                    save_item_uri3 = val.uri;
                    save_item_val3 = val;
                    // delete media resource should also delete feed item..
                    //TODO: this does not work:
                    //m.atompub.deleteItem({uri: val.datauri}, callback);
                    // Use feed URI for now...
                    m.atompub.deleteItem({uri: val.uri}, callback);
                });
            m.eval(
                function (val, callback) {
                    same(val, {}, "deleteItem return")
                    m.atompub.getItem({uri: save_item_uri3}, callback);
                });
            m.eval(
                function (val, callback) {
                    //log.debug("- getItem return: "+shuffl.objectString(val));
                    equals(val.val,        "error", 
                        "getItem deleted item return val");
                    equals(val.message,    "AtomPub request failed", 
                        "getItem deleted item return message");
                    equals(val.HTTPstatus, 400, 
                        "getItem deleted item return HTTPstatus");
                    equals(val.HTTPstatusText, 
                        "No+topic+was+found%2E", 
                        "getItem deleted item return HTTPstatusText");
                    callback(val);
                });
            m.exec(null,
                function(val) {
                    log.debug("----- 15. -----");
                    start();
                });
            stop(2000);
    });

    // Delete test feed again.
    test("Delete test feed again", 
        function () {
            log.debug("----- 16. Delete test feed again -----");
            expect(1);
            var m = new shuffl.AsyncComputation();
            m.eval(
                function (val, callback) {
                    m.atompub = new shuffl.AtomPub(val);
                    m.atompub.deleteFeed(
                        {path:"/item/test/feed"}, 
                        callback);
                });
            m.eval(
                function (val, callback) {
                    //log.debug("- deleteFeed return: "+shuffl.objectString(val));
                    same(val, {}, "deleteFeed return value");
                    callback(val);
                });
            m.exec(atomserviceuri,
                function(val) {
                    log.debug("----- 16. -----");
                    start();
                });
            stop(2000);
        });

};

// End