// $Id: $

/**
 * Test suite for asyncronous computations and composition
 */

/**
 *  Add logging functions to global namespace, for convenience
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
TestAsyncComputation = function() {

    module("TestAsyncComputation");

    test("asynchronous computation sequencing", 
        function () {
            expect(6);
            var m = new shuffl.AsyncComputation();
            m.bind("step1");
            m.eval(function (val, callback) {callback(val+1); });
            m.bind("step2");
            m.eval(function (val, callback) {callback(val+1); });
            m.bind("step3");
            m.eval(function (val, callback) {this.saved = val; callback(val+1); });
            m.bind("step4");
            m.exec(0, 
                function(val) {
                    equals(val, 3, "final return value");
                    equals(this.step1, 0, "step1 bound value");
                    equals(this.step2, 1, "step2 bound value");
                    equals(this.step3, 2, "step3 bound value");
                    equals(this.step4, 3, "step4 bound value");
                    equals(this.saved, 2, "manually saved parameter");
                });
        });

};

// End
