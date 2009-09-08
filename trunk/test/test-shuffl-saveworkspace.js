// $Id: $

/**
 * Test suite for workspace saving functions
 * 
 * Dependencies:
 *  test-shuffl-saveworkspace-layout.json
 *  eXist server running at localhost:8080
 */

/**
 * Function to register tests
 */

TestSaveWorkspace = function() {

    module("TestSaveWorkspace");

    test("shuffl.LoadWorkspace", function () {
        log.debug("test shuffl.LoadWorkspace empty workspace");
        var m = new shuffl.AsyncComputation();
        m.eval(function(val,callback) {
            shuffl.loadWorkspace("test-shuffl-saveworkspace-layout.json", callback);
        });
        m.eval(function(val,callback) {
            // Check empty workspace
            var u = jQuery.uri().resolve("test-shuffl-saveworkspace-layout.json");
            equals(jQuery('#workspaceuri').text(), u, '#workspaceuri');
            equals(jQuery('#workspace').data('location'), u, "location");
            equals(jQuery('#workspace').data('atomuri'),  "http://localhost:8080/exist/atom/", "atomuri");
            equals(jQuery('#workspace').data('feeduri'),  "http://localhost:8080/exist/atom/edit/shuffl/", "feeduri");
            equals(jQuery('#workspace').data('wsdata')['shuffl:base-uri'], "#", "shuffl:base-uri");
            // More tests as needed
            var stockcolour=["yellow","blue","green","orange","pink","purple"];
            var stocklabel=["Ye","Bl","Gr","Or","Pi","Pu"];
            for (var i = 0; i<6; i++) {
                var s = jQuery('.shuffl-stockpile').eq(i);
                equals(s.attr('id'), "", "["+i+"] stock id ");  // No ID on stockpiles
                ok(s.hasClass('stock-'+stockcolour[i]), "["+i+"] stock-"+stockcolour[i]);
                equals(s.text(), stocklabel[i], "["+i+"] stock text "+stocklabel[i]);
                equals(s.data('CardType'), "shuffl-freetext-"+stockcolour[i], "["+i+"] stock CardType "+"shuffl-freetext-"+stockcolour[i]);
                ok(typeof s.data('makeCard') == "function", "["+i+"] stock makeCard");
            };
            // Empty workspace?
            equals(jQuery("#layout").children().length, 0, "no cards in workspace");
            // Done
            callback(true);
        });        
        m.exec({}, start);
        ok(true, "shuffl.LoadWorkspace (empty) initiated");
        stop();
    });
};

// End
