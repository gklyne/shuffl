// $Id$

/**
 * Test suite for card factory and common handling functions
 */

/**
 * Function to register tests
 */

TestCardHandlers = function() {

    module("TestCardHandlers");

/*
    test("....", 
        function () {
            expect(6);
            m.eval(function (val, callback) {this.saved = val; callback(val+1); });
            m.exec(0, 
                function(val) {
                    equals(val, 3, "final return value");
                    equals(this.saved, 2, "manually saved parameter");
                    ok(state, "message");
                });
        });
*/

    test("shuffl.addCardFactory", 
        function () {
    		same(shuffl.CardFactoryMap, {}, "CardFactoryMap initially empty");
    		shuffl.addCardFactory("test-type", "test-css", shuffl.makeDefaultCard);
    		equals(shuffl.CardFactoryMap['test-type'].cardcss, "test-css", "CardFactoryMap with one entry");
        });

    test("shuffl.getCardFactory", 
        function () {
    		var c1 = shuffl.getCardFactory("test-type");
    		equals(typeof c1, "function", "retrieved factory");
    		var c2 = shuffl.getCardFactory("default-type");
    		equals(typeof c2, "function", "default factory");
        });

    test("shuffl.makeDefaultCard", 
        function () {
    		var c = shuffl.makeDefaultCard("card-type", "card-id", 
    			{ 'shuffl:tags': 	["card-tag"]
    			, 'shuffl:title':	"card-title"
    			});
    		equals(c.attr('id'), "card-id", "card id attribute");
    		ok(c.hasClass('shuffl-card',   "shuffl card class"));
    		ok(c.hasClass('stock-default', "default class"));
    		equals(c.find("cident").text(), "card-id", "card id field");
    		equals(c.find("cclass").text(), "card-type", "card class field");
    		equals(c.find("ctitle").text(), "card-title", "card title field");
    		equals(c.find("ctags").text(),  "card-tag", "card tags field");
        });

    test("shuffl.createCardFromStock", 
        function () {
            ok(false, "shuffl.createCardFromStock");
        });

    test("shuffl.createCardFromData", 
        function () {
            ok(false, "shuffl.createCardFromData");
        });

    test("shuffl.createDataFromCard", 
        function () {
            ok(false, "shuffl.createDataFromCard");
        });

    test("shuffl.lineEditable", 
        function () {
            ok(false, "shuffl.lineEditable");
        });

    test("shuffl.blockEditable", 
        function () {
            ok(false, "shuffl.blockEditable");
        });

    test("shuffl.placeCard", 
        function () {
            ok(false, "shuffl.placeCard");
        });

    test("shuffl.dropCard", 
        function () {
            ok(false, "shuffl.dropCard");
        });

};

// End
