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

    module("TestSaveWorkspace");

    test("NOTE: this test must be run from the AtomPub server used to store shuffl workspace data", shuffl.noop);
    
    test("shuffl.LoadWorkspace (empty)", function () {
        log.debug("test shuffl.LoadWorkspace empty workspace");
        var m = new shuffl.AsyncComputation();
        m.eval(function(val,callback) {
            shuffl.loadWorkspace("test-shuffl-saveworkspace-layout.json", callback);
        });
        m.eval(function(val,callback) {
            // Check empty workspace
            var u = jQuery.uri().resolve("test-shuffl-saveworkspace-layout.json");
            equals(jQuery('#workspaceuri').text(), u.toString(), '#workspaceuri');
            equals(jQuery('#workspace').data('location'), u.toString(), "location");
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

    test("shuffl.SaveNewWorkspace (empty)", function () {
        log.debug("test shuffl.SaveNewWorkspace new empty workspace");
        var m = new shuffl.AsyncComputation();
        m.eval(function(val,callback) {
            log.debug("Load empty workspace");
            shuffl.loadWorkspace("test-shuffl-saveworkspace-layout.json", callback);
        });
        m.eval(function(val,callback) {
            log.debug("Delete old workspace");
            this.atomuri  = jQuery('#workspace').data('atomuri');
            this.feeduri  = jQuery('#workspace').data('feeduri');
            this.atompub  = new shuffl.AtomPub(this.atomuri);
            this.feedpath = this.atompub.getAtomPath(this.feeduri);
            equals(this.atomuri,  "http://localhost:8080/exist/atom/", "atomuri");
            equals(this.feeduri,  "http://localhost:8080/exist/atom/edit/shuffl/", "feeduri");
            equals(this.feedpath, "/shuffl/", "feedpath");
            this.atompub.deleteFeed({path:this.feedpath}, callback);
        });
        m.eval(function(val,callback) {
            log.debug("Save empty workspace");
            ok(true, "deleted old feed "+this.feedpath);
            shuffl.saveNewWorkspace(this.atomuri, this.feedpath, callback);
        });        
        m.eval(function(val,callback) {
            log.debug("Check result from save: "+shuffl.objectString(val));
            var uuid = val.id;
            equals(val.path,     "/shuffl/?id="+uuid, "val.path");
            equals(val.uri,      "http://localhost:8080/exist/atom/edit/shuffl/?id="+uuid, "val.uri");
            equals(val.title,    "test-shuffl-saveworkspace", "val.title");
            equals(val.data,     undefined, "val.data");
            equals(val.dataref,  "test-shuffl-saveworkspace.json", "val.dataref");
            //equals(val.datatype, "application/json", "val.datatype");
            equals(val.datatype, "application/octet-stream", "val.datatype");
            equals(val.datauri,  this.feeduri+"test-shuffl-saveworkspace.json", "val.datauri");
            equals(val.datapath, "/shuffl/test-shuffl-saveworkspace.json", "val.datapath");
            // Test results
            log.debug("Reload empty workspace from AtomPub");
            shuffl.resetWorkspace();
            shuffl.loadWorkspace("/shuffl/test-shuffl-saveworkspace-layout.json", callback);
            // Done
            callback(true);
        });
        m.eval(function(val,callback) {
            log.debug("Check reloaded workspace");
            var u = jQuery.uri(this.feedpath).resolve("test-shuffl-saveworkspace-layout.json");
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
        ok(true, "shuffl.SaveNewWorkspace (empty) initiated");
        stop();
    });

};

// End
