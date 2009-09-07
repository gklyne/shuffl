// $Id$

/**
 * Test suite for workspace loading function
 * 
 * Dependencies:
 *  test-shuffl-loadworkspace-layout.json
 *  test-shuffl-loadworkspace-card_1.json
 *  test-shuffl-loadworkspace-card_2.json
 */

/**
 * Function to register tests
 */

TestLoadWorkspace = function() {

    module("TestLoadWorkspace");

    test("shuffl.LoadWorkspace", function () {
        log.debug("test shuffl.LoadWorkspace");
        var m = new shuffl.AsyncComputation();
        m.eval(function(val,callback) {
            shuffl.loadWorkspace("test-shuffl-loadworkspace-layout.json", callback);
        });
        m.eval(function(val,callback) {
            //1
            var c1 = jQuery("#id_1");
            debugger;
            ok(c1 != undefined, "card id_1 defined")
            equals(c1.attr('id'), "id_1",  
                "card 1 id attribute");
            ok(c1.hasClass('shuffl-card'),
                "card 1 shuffl card class");
            ok(c1.hasClass('stock-yellow'),
                "card 1 CSS class");
            equals(c1.find("cident").text(), "id_1",
                "card 1 id field");
            equals(c1.find("cclass").text(), "shuffl-freetext-yellow",
                "card 1 class/type field");
            equals(c1.find("ctitle").text(), "Card 1 title", 
                "card 1 title field");
            equals(c1.find("ctags").text(),  "card_1_tag,yellowtag", 
                "card 1 tags field");
            equals(c1.data('shuffl:id'),    "id_1",
                "card 1 data id");
            equals(c1.data('shuffl:class'), "shuffl-freetext-yellow",
                "card 1 data class/type");
            var p1 = c1.position();
            equals(Math.floor(p1.left), 100, "position-left");
            equals(Math.floor(p1.top),  30,  "position-top");
            equals(c1.css("zIndex"), "11", "card zIndex");
            //2
            ok(false, "TODO card_2");
            //3
            ok(false, "TODO card_3");
            callback(true);
        });        
        m.exec({}, start);
        ok(true, "shuffl.LoadWorkspace initiated");
        stop();
    });
};

// End
