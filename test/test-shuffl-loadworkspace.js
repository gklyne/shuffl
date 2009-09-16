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
            var u = jQuery.uri().resolve("test-shuffl-loadworkspace-layout.json");
            equals(jQuery('#workspaceuri').text(), u.toString(), '#workspaceuri');
            equals(jQuery('#workspace').data('location'), u.toString(), "location");
            //1
            var c1 = jQuery("#id_1");
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
            var c2 = jQuery("#id_2");
            ok(c2 != undefined, "card id_2 defined")
            equals(c2.attr('id'), "id_2",  
                "card 2 id attribute");
            ok(c2.hasClass('shuffl-card'),
                "card 2 shuffl card class");
            ok(c2.hasClass('stock-blue'),
                "card 2 CSS class");
            equals(c2.find("cident").text(), "id_2",
                "card 2 id field");
            equals(c2.find("cclass").text(), "shuffl-freetext-blue",
                "card 2 class/type field");
            equals(c2.find("ctitle").text(), "Card 2 title", 
                "card 2 title field");
            equals(c2.find("ctags").text(),  "card_2_tag,bluetag", 
                "card 2 tags field");
            equals(c2.data('shuffl:id'),    "id_2",
                "card 2 data id");
            equals(c2.data('shuffl:class'), "shuffl-freetext-blue",
                "card 2 data class/type");
            var p2 = c2.position();
            equals(Math.floor(p2.left), 150, "position-left");
            equals(Math.floor(p2.top),  60,  "position-top");
            equals(c2.css("zIndex"), "12", "card zIndex");
            //3 (third case mainly intended to check z-index values)
            var c3 = jQuery("#id_3");
            ok(c3 != undefined, "card id_3 defined")
            equals(c3.attr('id'), "id_3",  
                "card 3 id attribute");
            ok(c3.hasClass('shuffl-card'),
                "card 3 shuffl card class");
            ok(c3.hasClass('stock-green'),
                "card 3 CSS class");
            equals(c3.find("cident").text(), "id_3",
                "card 3 id field");
            equals(c3.find("cclass").text(), "shuffl-freetext-green",
                "card 3 class/type field");
            equals(c3.find("ctitle").text(), "Card 3 title", 
                "card 3 title field");
            equals(c3.find("ctags").text(),  "card_3_tag,greentag",
                "card 3 tags field");
            equals(c3.data('shuffl:id'),    "id_3",
                "card 3 data id");
            equals(c3.data('shuffl:class'), "shuffl-freetext-green",
                "card 3 data class/type");
            var p3 = c3.position();
            equals(Math.floor(p3.left), 200, "position-left");
            equals(Math.floor(p3.top),  90,  "position-top");
            equals(c3.css("zIndex"), "13", "card zIndex");
            //Done
            callback(true);
        });        
        m.exec({}, start);
        ok(true, "shuffl.LoadWorkspace initiated");
        stop();
    });

    test("shuffl.ResetWorkspace", function () {
        log.debug("test shuffl.ResetWorkspace");
        var m = new shuffl.AsyncComputation();
        m.eval(function(val,callback) {
            shuffl.loadWorkspace("test-shuffl-loadworkspace-layout.json", callback);
        });
        m.eval(function(val,callback) {
            log.debug("Test workspace reloaded");
            var u = jQuery.uri().resolve("test-shuffl-loadworkspace-layout.json");
            equals(jQuery('#workspaceuri').text(), u.toString(), '#workspaceuri');
            equals(jQuery('#workspace').data('location'), u.toString(), "location");
            equals(jQuery('#workspace').data('atomuri'),  "http://localhost:8080/exist/atom/", "atomuri");
            equals(jQuery('#workspace').data('feeduri'),  "file:///Users/graham/workspace/googlecode_shuffl/test/", "feeduri");
            equals(jQuery('#workspace').data('wsdata')['shuffl:base-uri'], "#", "shuffl:base-uri");
            // Reset workspace
            shuffl.resetWorkspace(callback);
        });        
        m.eval(function(val,callback) {
            log.debug("Workspace reset")
            equals(jQuery('#workspaceuri').text(), "", '#workspaceuri');
            equals(jQuery('#workspace').data('location'), null, "location");
            equals(jQuery('#workspace').data('atomuri'),  null, "atomuri");
            equals(jQuery('#workspace').data('feeduri'),  null, "feeduri");
            equals(jQuery('#workspace').data('wsdata'), null, "wsdata");
            equals(jQuery('.shuffl-stockpile').length, 0, "empty stockbar");
            equals(jQuery("#stockbar").children().length, 1, "initial entries in stockbar");
            // Empty workspace?
            equals(jQuery("#layout").children().length, 0, "no cards in workspace");
            // Done
            callback(true);
        });        
        m.exec({}, start);
        ok(true, "shuffl.ResetWorkspace initiated");
        stop();
    });

};

// End
