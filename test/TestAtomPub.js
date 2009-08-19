// $Id: $

/**
 * Test suite for AtomPub protocol handler
 */

/**
 *  Add logging functions to global namespace, for convenience
 * 
 * TODO: move to shuffl.base mofule
 */
if (typeof log == "undefined") {
    log = {};
    log.debug = MochiKit.Logging.logDebug   ;
    log.info  = MochiKit.Logging.log    ;
    log.warn  = MochiKit.Logging.logWarning ;
    log.error = MochiKit.Logging.logError   ;
};

/**
 * Function to register tests
 */
TestAtomPub = function() {

    module("TestAtomPub");

    log.info("TestAtomPub requires eXist service running on localhost:8080");

    test("Introspect initial service", 
        function () {
            log.debug("Introspect initial service");
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
                    equals(val, {}, "root feed information");
                });
        });
};

// End
