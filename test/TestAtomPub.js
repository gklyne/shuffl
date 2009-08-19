// $Id: $

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
            expect(1);
            var m = new shuffl.AsyncComputation();
            m.eval(
                function (val, callback) {
                    log.debug("  init: "+val);
                    m.atompub = new shuffl.AtomPub(val);
                    m.atompub.feedinfo("/", callback);
                });
            m.exec("http://localhost:8080/exist/atom/",
                function(val) {
                    log.debug("  finish: "+shuffl.objectString(val));
                    same(val, {}, "root feed information");
                    start();
                });
            stop();
            log.debug("Introspect initial service: done");
        });
    test("Introspect initial service done", 
        function () {
            log.debug("Introspect initial service done");
        });
};

// End
