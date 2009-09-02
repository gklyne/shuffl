// $Id$

/**
 * Test suite for card factory and common handling functions
 */

/**
 * Function to register tests
 */

TestCardHandlers = function() {

    module("TestCardHandlers");

    test("....", 
        function () {
            expect(6);
            m.eval(function (val, callback) {this.saved = val; callback(val+1); });
            m.exec(0, 
                function(val) {
                    equals(val, 3, "final return value");
                    equals(this.saved, 2, "manually saved parameter");
                });
        });
};

// End
