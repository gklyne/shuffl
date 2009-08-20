// $Id$

/**
 * Test suite for AtomPub protocol handler
 */

/**
 * Function to register tests
 */
TestAtomPub = function() {

    module("TestAtomPub");

    log.info("TestAtomPub requires eXist service running on localhost:8080");

    test("Introspect initial service", 
        function () {
            log.debug("Introspect initial service: start");
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
            log.debug("Create new feed at service root");
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
                    equals(val.uri,
                        "http://localhost:8080/exist/atom/edit/testfeed",
                        "New feed URI listed");
                    equals(val.title, "Test feed", "New feed title listed");
                    equals(val.id.slice(0,8), "urn:uuid", "New feed id listed");
                    equals(val.updated.slice(0,2), "20", "New feed update-date listed");
                    same(val.entries, [], "New feed empty");
                    start();
                });
            stop(2000);
        });

    test("Try to create feed in unavailable location", 
        function () {
            log.debug("Try to create feed in unavailable location");
            // 4. Try creating feed in non-available location; check for error return.
        });

    test("Try to create feed in unavailable service", 
        function () {
            log.debug("Try to create feed in unavailable service");
            // 5. Try creating feed at non-existent service; check for error return. 
        });

    test("Delete feed", 
        function () {
            log.debug("Delete feed");
            // 6. Delete original feed; check return
            //
            // 7. Get and check info about new feed; check the feed no longer exists.
            //
            // 8. List contents of new feed; check response indicates feed does not exist.
        });

};

// End
