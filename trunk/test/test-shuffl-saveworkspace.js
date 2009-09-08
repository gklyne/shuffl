// $Id: $

/**
 * Test suite for workspace saving functions
 * 
 * Dependencies:
 *  test-shuffl-saveworkspace-layout.json
 *  eXist server running at localhost:8080
 *  The test page must be loaded from the eXist server for the test to run
 *  (due to same-origin security restriction).
 */

/**
 * Function to register tests
 */

TestSaveWorkspace = function() {

    // These definitions should match usage in the layout file, and
    // the location of the AtomPub server
    var atomuri    = "http://localhost:8080/exist/atom/";
    var feeduri    = "http://localhost:8080/exist/atom/edit/shuffltest1/";
    var feedpath   = "/shuffltest1/";
    var layoutname = "test-shuffl-saveworkspace-layout.json";
    var layouturi  = jQuery.uri(layoutname, feeduri);
    
    module("TestSaveWorkspace");

    test("NOTE: this test must be run from the AtomPub server used to store shuffl workspace data", shuffl.noop);
    
    test("shuffl.LoadWorkspace (empty)", function () {
        log.debug("test shuffl.LoadWorkspace empty workspace");
        var m = new shuffl.AsyncComputation();
        m.eval(function(val,callback) {
            shuffl.loadWorkspace(layoutname, callback);
        });
        m.eval(function(val,callback) {
            // Check empty workspace
            var u = jQuery.uri().resolve(layoutname);
            equals(jQuery('#workspaceuri').text(), u.toString(), '#workspaceuri');
            equals(jQuery('#workspace').data('location'), u.toString(), "location");
            equals(jQuery('#workspace').data('atomuri'),  atomuri, "atomuri");
            equals(jQuery('#workspace').data('feeduri'),  feeduri, "feeduri");
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

    test("shuffl.SaveNewWorkspace (empty)", function () {
        log.debug("test shuffl.SaveNewWorkspace new empty workspace");
        var m = new shuffl.AsyncComputation();
        m.eval(function(val,callback) {
            log.debug("Load empty workspace");
            shuffl.loadWorkspace(layoutname, callback);
        });
        m.eval(function(val,callback) {
            log.debug("Delete old workspace");
            this.atompub  = new shuffl.AtomPub(atomuri);
            equals(jQuery('#workspace').data('atomuri'),  atomuri, "atomuri");
            equals(jQuery('#workspace').data('feeduri'),  feeduri, "feeduri");
            equals(this.atompub.getAtomPath(feeduri), "/shuffltest1/", "feedpath");
            this.atompub.deleteFeed({path:feedpath}, callback);
        });
        m.eval(function(val,callback) {
            log.debug("Save empty workspace");
            ok(true, "deleted old feed "+feedpath);
            shuffl.saveNewWorkspace(atomuri, feedpath, callback);
        });        
        m.eval(function(val,callback) {
            log.debug("Check result from save: "+shuffl.objectString(val));
            this.wsuri = jQuery.uri(val.uri, val.itemuri).toString();
            var uuid = val.itemid;
            equals(val.title,    "test-shuffl-saveworkspace", "val.title");
            equals(val.uri,      "test-shuffl-saveworkspace.json", "val.uri");
            equals(val.path,     "/shuffltest1/"+val.uri, "val.path");
            equals(val.itemuri,  atomuri+"edit/shuffltest1/?id="+uuid, "val.itemuri");
            equals(val.itempath, feedpath+"?id="+uuid, "val.itempath");
            equals(val.feeduri,  feeduri,  "val.feeduri");
            equals(val.feedpath, feedpath, "val.feedpath");
            equals(val.atomuri,  atomuri,  "val.atomuri");
            log.debug("Reset workspace...");
            shuffl.resetWorkspace(callback);
        });
        m.eval(function(val,callback) {
            log.debug("Workspace is reset");
            log.debug("Reload empty workspace from AtomPub...");
            shuffl.loadWorkspace(this.wsuri, callback);
        });
        m.eval(function(val,callback) {
            log.debug("Check reloaded workspace "+this.wsuri);
            var u = jQuery.uri(this.wsuri);
            equals(jQuery('#workspaceuri').text(), u.toString(), '#workspaceuri');
            equals(jQuery('#workspace').data('location'), u.toString(), "location");
            equals(jQuery('#workspace').data('atomuri'),  atomuri, "atomuri");
            equals(jQuery('#workspace').data('feeduri'),  feeduri, "feeduri");
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
        ok(true, "shuffl.SaveNewWorkspace (empty) initiated");
        stop();
    });

    test("shuffl.SaveCard", function () {
        log.debug("test shuffl.SaveCard");
        var m = new shuffl.AsyncComputation();
        m.eval(function(val,callback) {
            log.debug("Load empty workspace from AtomPub");
            shuffl.loadWorkspace(layouturi, callback);
        });
    });
    
    
};

// End
