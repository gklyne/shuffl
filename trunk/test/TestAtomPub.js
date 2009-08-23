// $Id$

/**
 * Test suite for AtomPub protocol handler
 */

/**
 * Function to register tests
 */
TestAtomPub = function() {

    module("TestAtomPub - feed manipulation tests");

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

    test("Create feed in non-root location", 
        function () {
            log.debug("Create feed in non-root location");
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
                    start();
                });
            stop(2000);
        });

    test("Try to create feed in unavailable service", 
        function () {
            log.debug("Try to create feed in unavailable service");
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
                    start();
                });
            stop(2000);
        });

    test("Delete feed at root", 
        function () {
            log.debug("Delete feed just created");
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
                    start();
                });
            stop(2000);
        });

    module("TestAtomPub - item manipulation tests");

};

// End
