// $Id$

/**
 * Test suite for jquery.model plugin
 */

/**
 * Function to register tests
 */
TestJqueryModel = function() {

    module("TestJqueryModel");

    test("set and get data values", function ()
    {
        var j = jQuery("<element><sub1 /><sub2 /></element>");
        j.data("v1",1);
        j.data("v2","2");
        equals(j.data("v1"), 1, "v1");
        equals(j.data("v2"), "2", "v2");
    });

    test("set and get model values", function () 
    {
        log.debug("set and get model values");
        var j = jQuery("<element><sub1 /><sub2 /></element>");
        j.model("v1",1);
        j.model("v2","2");
        equals(j.model("v1"), 1, "v1");
        equals(j.model("v2"), "2", "v2");
        equals(j.data("v1"), 1, "v1");
        equals(j.data("v2"), "2", "v2");
    });

    test("event subscription", function ()
    {
        var j = jQuery("<element><sub1 /><sub2 /></element>");
        var save = [];
        function saver(event, data) {
            save.push(data);
        };
        j.model("v1",1);
        j.model("v2",2);
        equals(j.model("v1"), 1, "v1");
        equals(j.model("v2"), 2, "v2");
        j.modelBind("v1", saver);
        j.model("v1",11);
        j.model("v2",22);
        equals(j.model("v1"), 11, "v1");
        equals(j.model("v2"), 22, "v2");
        equals(save.length, 1, "save.length");
        same(save[0], { "name": "v1", "oldval": 1, "newval": 11 }, "save[0]");
    });

    test("event unsubscription", function ()
    {
        var j = jQuery("<element><sub1 /><sub2 /></element>");
        var save = [];
        function saver(event, data) {
            save.push(data);
        };
        j.model("v1",1);
        j.model("v2",2);
        equals(j.model("v1"), 1, "v1");
        equals(j.model("v2"), 2, "v2");
        j.modelBind("v1", saver);
        j.model("v1",11);
        j.model("v2",22);
        equals(j.model("v1"), 11, "v1");
        equals(j.model("v2"), 22, "v2");
        equals(save.length, 1, "save.length");
        same(save[0], { "name": "v1", "oldval": 1, "newval": 11 }, "save[0]");
        j.modelUnbind("v1", saver);
        j.modelBind("v2", saver);
        j.model("v1",111);
        j.model("v2",222);
        equals(j.model("v1"), 111, "v1");
        equals(j.model("v2"), 222, "v2");
        equals(save.length, 2, "save.length");
        same(save[0], { "name": "v1", "oldval": 1, "newval": 11 }, "save[0]");
        same(save[1], { "name": "v2", "oldval": 22, "newval": 222 }, "save[1]");
    });

    test("multiple elements selected", function ()
    {
        var j = jQuery("<element><sub/><sub/></element>").find("sub");
        var save = [];
        function saver(event, data) {
            save.push(data);
        };
        j.model("v1",1);
        j.model("v2",2);
        equals(j.model("v1"), 1, "v1");
        equals(j.model("v2"), 2, "v2");
        j.modelBind("v1", saver);
        j.model("v1",11);
        j.model("v2",22);
        equals(j.model("v1"), 11, "v1");
        equals(j.model("v2"), 22, "v2");
        equals(save.length, 2, "save.length");
        same(save[0], { "name": "v1", "oldval": 1, "newval": 11 }, "save[0]");
        same(save[1], { "name": "v1", "oldval": 1, "newval": 11 }, "save[1]");
        j.modelUnbind("v1", saver);
        j.modelBind("v2", saver);
        j.model("v1",111);
        j.model("v2",222);
        equals(j.model("v1"), 111, "v1");
        equals(j.model("v2"), 222, "v2");
        equals(save.length, 4, "save.length");
        same(save[1], { "name": "v1", "oldval": 1, "newval": 11 }, "save[1]");
        same(save[2], { "name": "v2", "oldval": 22, "newval": 222 }, "save[2]");
        same(save[3], { "name": "v2", "oldval": 22, "newval": 222 }, "save[3]");
    });

};

// End
