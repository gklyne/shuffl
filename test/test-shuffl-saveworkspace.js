// $Id$

/**
 * @fileoverview
 * Test suite for workspace saving functions
 *  
 * @author Graham Klyne
 * @version $Id$
 * 
 * Dependencies:
 *  test-shuffl-saveworkspace-layout.json
 *  eXist server running at localhost:8080
 *  The test page must be loaded from the eXist server for the test to run
 *  (due to same-origin security restriction).
 */

/**
 * Test case counter
 */
var testnum = 1;

/**
 * Skip test function (change 'test' to 'notest' and leave the body intact)
 */
function notest(name, fn) {
    test("SKIPPED TEST: "+name, function() {
        ok(true, "SKIPPED TEST: "+name);
        log.info("----------");
        log.info((testnum++)+". SKIPPED: "+name);
    });
}

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
    var layouturi  = jQuery.uri(layoutname, feeduri).toString();
    var card3uri   = feeduri+"test-shuffl-loadworkspace-card_3.json";

    var shuffl_prefixes =
        [ { 'shuffl:prefix':  'shuffl', 'shuffl:uri': 'http://purl.org/NET/Shuffl/vocab#' }
        , { 'shuffl:prefix':  'rdf',    'shuffl:uri': 'http://www.w3.org/1999/02/22-rdf-syntax-ns#' }
        , { 'shuffl:prefix':  'rdfs',   'shuffl:uri': 'http://www.w3.org/2000/01/rdf-schema#' }
        , { 'shuffl:prefix':  'owl',    'shuffl:uri': 'http://www.w3.org/2002/07/owl#' }
        , { 'shuffl:prefix':  'xsd',    'shuffl:uri': 'http://www.w3.org/2001/XMLSchema#' }
        ];
    
    module("TestSaveWorkspace");
    
    test("NOTE: this test must be run from the AtomPub server used to store shuffl workspace data", shuffl.noop);
    
    test("shuffl.loadWorkspace (empty)", function () {
        log.info("----------");
        log.info((testnum++)+". test shuffl.loadWorkspace empty workspace");
        expect(37);
        var m = new shuffl.AsyncComputation();
        m.eval(function(val,callback) {
            shuffl.loadWorkspace(layoutname, callback);
        });
        m.eval(function(val,callback) {
            // Check empty workspace
            var u = jQuery.uri().resolve(layoutname);
            equals(jQuery('#workspaceuri').text(), u.toString(), '#workspaceuri');
            equals(jQuery('#workspace').data('location'), u.toString(), "location");
            equals(jQuery('#workspace').data('wsdata')['shuffl:atomuri'],  atomuri, "atomuri");
            equals(jQuery('#workspace').data('wsdata')['shuffl:feeduri'],  feeduri, "feeduri");
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

    test("shuffl.saveNewWorkspace (empty)", function () {
        log.info("----------");
        log.info((testnum++)+". test shuffl.saveNewWorkspace new empty workspace");
        expect(49);
        var m = new shuffl.AsyncComputation();
        m.eval(function(val,callback) {
            log.debug("Load empty workspace");
            shuffl.loadWorkspace(layoutname, callback);
        });
        m.eval(function(val,callback) {
            log.debug("Delete old workspace");
            this.atompub  = new shuffl.AtomPub(atomuri);
            equals(jQuery('#workspace').data('wsdata')['shuffl:atomuri'],  atomuri, "atomuri");
            equals(jQuery('#workspace').data('wsdata')['shuffl:feeduri'],  feeduri, "feeduri");
            equals(this.atompub.getAtomPath(feeduri), "/shuffltest1/", "feedpath");
            this.atompub.deleteFeed({path:feedpath}, callback);
        });
        m.eval(function(val,callback) {
            log.debug("Save empty workspace");
            ok(true, "deleted old feed "+feedpath);
            shuffl.saveNewWorkspace(atomuri, feedpath, layoutname, callback);
        });
        m.eval(function(val,callback) {
            //log.debug("Check result from save: "+shuffl.objectString(val));
            log.debug("Check result from save: "+val.uri);
            this.wsuri = jQuery.uri(val.uri, val.itemuri).toString();
            var uuid = val.itemid;
            equals(val.title,    "test-shuffl-saveworkspace-layout", "val.title");
            equals(val.uri,      "test-shuffl-saveworkspace-layout.json", "val.uri");
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
            equals(jQuery('#workspace').data('wsdata')['shuffl:atomuri'],  atomuri, "atomuri");
            equals(jQuery('#workspace').data('wsdata')['shuffl:feeduri'],  feeduri, "feeduri");
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

    test("shuffl.saveCard", function () {
        log.info("----------");
        log.info((testnum++)+". test shuffl.saveCard");
        expect(26);
        var m = new shuffl.AsyncComputation();
        m.eval(function(val,callback) {
            log.debug("Load empty workspace from AtomPub");
            this.atompub  = new shuffl.AtomPub(atomuri);
            shuffl.loadWorkspace(layouturi, callback);
        });
        m.eval(function(val,callback) {
            log.debug("Get new card data");
            shuffl.readCard("", "test-shuffl-loadworkspace-card_1.json", callback)
        });
        m.eval(function(val,callback) {
            log.debug("Check new card data");
            equals(val['shuffl:id'], 'id_1', "shuffl:id");
            equals(val['shuffl:class'], 'shuffl-freetext-yellow', "shuffl:class");
            equals(val['shuffl:version'], '0.1', "shuffl:version");
            equals(val['shuffl:base-uri'], '#', "shuffl:base-uri");
            for (var i = 0 ; i<shuffl_prefixes.length ; i++) {
                same(val['shuffl:uses-prefixes'][i], shuffl_prefixes[i], "shuffl:uses-prefixes["+i+"]");
            };
            equals(val['shuffl:data']['shuffl:title'], "Card 1 title",   'shuffl:data-title');
            same  (val['shuffl:data']['shuffl:tags'],  [ 'card_1_tag', 'yellowtag' ],   'shuffl:data-tags');
            equals(val['shuffl:data']['shuffl:text'],  "Card 1 free-form text here<br/>line 2<br/>line3<br/>yellow", 'shuffl:data-text');
            log.debug("Save card data");
            var card = shuffl.createCardFromData(val['shuffl:id'], val['shuffl:class'], val);
            shuffl.saveCard(this.atompub, feedpath, val['shuffl:id']+".json", card, callback);
        });
        m.eval(function(val,callback) {
            log.debug("Check response");
            equals(val, "id_1.json", "card relative URI");
            log.debug("Read back card");
            var carduri = this.atompub.serviceUri({base:feedpath, name:val});
            shuffl.readCard(feeduri, carduri, callback);
        });
        m.eval(function(val,callback) {
            log.debug("Check card values ");
            equals(val['shuffl:id'], 'id_1', "shuffl:id");
            equals(val['shuffl:class'], 'shuffl-freetext-yellow', "shuffl:class");
            equals(val['shuffl:version'], '0.1', "shuffl:version");
            equals(val['shuffl:base-uri'], '#', "shuffl:base-uri");
            for (var i = 0 ; i<shuffl_prefixes.length ; i++) {
                same(val['shuffl:uses-prefixes'][i], shuffl_prefixes[i], "shuffl:uses-prefixes["+i+"]");
            };
            equals(val['shuffl:data']['shuffl:title'], "Card 1 title",   'shuffl:data-title');
            same  (val['shuffl:data']['shuffl:tags'],  [ 'card_1_tag', 'yellowtag' ],   'shuffl:data-tags');
            equals(val['shuffl:data']['shuffl:text'],  "Card 1 free-form text here<br>line 2<br>line3<br>yellow", 'shuffl:data-text');
            callback({});
        });
        m.exec({}, start);
        ok(true, "shuffl.saveCard initiated");
        stop();
    });

    // eXist won't delete a media resource
    notest("shuffl.deleteCard", function () {
        log.info("----------");
        log.info((testnum++)+". test shuffl.deleteCard");
        expect(3);
        var m = new shuffl.AsyncComputation();
        m.eval(function(val,callback) {
            log.debug("Read back card again");
            this.atompub = new shuffl.AtomPub(atomuri);
            var carduri = this.atompub.serviceUri({base:feedpath, name:"id_1.json"});
            shuffl.readCard(feeduri, carduri, callback);
        });
        m.eval(function(val,callback) {
            log.debug("Check card is read OK");
            equals(val['shuffl:id'], 'id_1', "shuffl:id");
            log.debug("Delete card");
            shuffl.deleteCard(this.atompub, feedpath, "id_1.json", callback);
        });
        m.eval(function(val,callback) {
            log.debug("deleteCard returns: "+val);
            same(val, {}, "deleteCard return");
            callback(val);
        });
        m.exec({}, start);
        ok(true, "shuffl.deleteCard initiated");
        stop();
    });

    // This "test" is run to remove the card saved previously.
    test("Recreate empty workspace", function() {
        log.info("----------");
        log.info((testnum++)+". Recreate empty workspace");
        expect(4);
        var m = new shuffl.AsyncComputation();
        m.eval(function(val,callback) {
            log.debug("Load empty workspace");
            shuffl.loadWorkspace(layoutname, callback);
        });
        m.eval(function(val,callback) {
            log.debug("Delete old workspace");
            this.atompub  = new shuffl.AtomPub(atomuri);
            this.atompub.deleteFeed({path:feedpath}, callback);
        });
        m.eval(function(val,callback) {
            log.debug("Save empty workspace");
            ok(true, "deleted old feed "+feedpath);
            shuffl.saveNewWorkspace(atomuri, feedpath, layoutname, callback);
        });        
        m.eval(function(val,callback) {
            //log.debug("Check result from save: "+shuffl.objectString(val));
            log.debug("Check result from save: "+val.uri);
            this.wsuri = jQuery.uri(val.uri, val.itemuri).toString();
            equals(val.uri, "test-shuffl-saveworkspace-layout.json", "val.uri");
            log.debug("Reset workspace...");
            shuffl.resetWorkspace(callback);
        });
        m.eval(function(val,callback) {
            log.debug("Reload empty workspace from AtomPub...");
            shuffl.loadWorkspace(this.wsuri, callback);
        });
        m.eval(function(val,callback) {
            log.debug("Check reloaded workspace "+this.wsuri);
            var u = jQuery.uri(this.wsuri);
            equals(jQuery('#workspaceuri').text(), u.toString(), '#workspaceuri');
            callback(true);
        });
        m.exec({}, start);
        ok(true, "Reload empty workspace initiated");
        stop();
    });

    // Add card to workspace, save workspace, read back, check content
    test("shuffl.saveNewWorkspace (with card)", function () {
        log.info("----------");
        log.info((testnum++)+". test shuffl.saveNewWorkspace new workspace with card");
        expect(59);
        var m = new shuffl.AsyncComputation();
        m.eval(function(val,callback) {
            log.debug("Load empty workspace");
            this.atompub = new shuffl.AtomPub(atomuri);
            shuffl.loadWorkspace(layoutname, callback);
        });
        m.eval(function(val,callback) {
            log.debug("Read card data from local file");
            shuffl.readCard("", "test-shuffl-loadworkspace-card_3.json", callback);
        });
        m.eval(function(val,callback) {
            ////log.debug("readCard response: "+shuffl.objectString(val));
            equals(val['shuffl:location'], "test-shuffl-loadworkspace-card_3.json", "new card location");
            log.debug("Add card to workspace");
            var layout = 
                { 'id': 'card_3'
                , 'class': 'stock_3'
                , 'data': 'test-shuffl-loadworkspace-card_3.json'
                , 'pos': {left:200, top:90}
                };
            shuffl.placeCardFromData(layout, val);
            log.debug("Check card added to workspace");
            var c3 = jQuery("#id_3");
            ok(c3 != undefined, "card id_3 defined");
            ok(c3.hasClass('shuffl-card'), "card 3 shuffl card class");
            equals(c3.find("ctitle").text(), "Card 3 title", "Card 3 title");
            equals(c3.data('shuffl:location'), "test-shuffl-loadworkspace-card_3.json", "Card location in jQuery object")
            log.debug("Reset workspace...");
            var p3 = c3.position();
            equals(Math.floor(p3.left), 200, "position-left");
            equals(Math.floor(p3.top),  90,  "position-top");
            equals(c3.css("zIndex"), "11", "card zIndex");
            log.debug("Delete old workspace");
            this.atompub.deleteFeed({path:feedpath}, callback);
        });
        m.eval(function(val,callback) {
            log.debug("Save new workspace with card");
            shuffl.saveNewWorkspace(atomuri, feedpath, layoutname, callback);
        });        
        m.eval(function(val,callback) {
            //log.debug("Check result from save: "+shuffl.objectString(val));
            log.debug("Check result from save: "+val.uri);
            this.wsuri = jQuery.uri(val.uri, val.itemuri).toString();
            var uuid = val.itemid;
            equals(val.title,    "test-shuffl-saveworkspace-layout", "val.title");
            equals(val.uri,      "test-shuffl-saveworkspace-layout.json", "val.uri");
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
            equals(jQuery('#workspace').data('wsdata')['shuffl:atomuri'],  atomuri, "atomuri");
            equals(jQuery('#workspace').data('wsdata')['shuffl:feeduri'],  feeduri, "feeduri");
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
            // Check card in workspace
            equals(jQuery("#layout").children().length, 1, "one card in workspace");
            var c3 = jQuery("#id_3");
            ok(c3 != undefined, "card id_3 defined")
            ok(c3.hasClass('shuffl-card'), "card 3 shuffl card class");
            equals(c3.find("ctitle").text(), "Card 3 title", "Card 3 title");
            var p3 = c3.position();
            equals(Math.floor(p3.left), 200, "position-left");
            equals(Math.floor(p3.top),  90,  "position-top");
            equals(c3.css("zIndex"), "11", "card zIndex");
            // Done
            callback(true);
        });
        m.exec({}, start);
        ok(true, "shuffl.SaveNewWorkspace (with card) initiated");
        stop();
    });

    // Update card in atom feed, re-read workspace, check content
    test("shuffl.updateCard", function () {
        log.info("----------");
        log.info((testnum++)+". test shuffl.updateCard");
        expect(48);
        var m = new shuffl.AsyncComputation();
        m.eval(function(val,callback) {
            log.debug("Load workspace");
            this.atompub = new shuffl.AtomPub(atomuri);
            // Read workspace from AtomPub service
            shuffl.loadWorkspace(layouturi, callback);
        });
        m.eval(function(val,callback) {
            // Check for card
            equals(jQuery("#layout").children().length, 1, "one card in workspace");
            var c3 = jQuery("#id_3");
            ok(c3 != undefined, "card id_3 defined")
            ok(c3.hasClass('shuffl-card'), "card 3 shuffl card class");
            equals(c3.find("ctitle").text(), "Card 3 title", "Card 3 title");
            // Update card in workspace
            c3.find("ctitle").text("Card 3 updated");
            shuffl.updateCard(this.atompub, feedpath, c3, callback);
        });
        m.eval(function(val, callback) {
            log.debug("Card saved: "+val);
            equals(val, card3uri, "updateCard URI returned");
            log.debug("Reset workspace...");
            shuffl.resetWorkspace(callback);
        });
        m.eval(function(val,callback) {
            log.debug("Workspace is reset");
            log.debug("Reload empty workspace from AtomPub...");
            shuffl.loadWorkspace(layouturi, callback);
        });
        m.eval(function(val,callback) {
            log.debug("Check reloaded workspace ");
            equals(jQuery('#workspaceuri').text(), layouturi.toString(), '#workspaceuri');
            equals(jQuery('#workspace').data('location'), layouturi.toString(), "location");
            equals(jQuery('#workspace').data('wsdata')['shuffl:atomuri'],  atomuri, "atomuri");
            equals(jQuery('#workspace').data('wsdata')['shuffl:feeduri'],  feeduri, "feeduri");
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
            // Check card in workspace
            equals(jQuery("#layout").children().length, 1, "one card in workspace");
            var c3 = jQuery("#id_3");
            ok(c3 != undefined, "card id_3 defined")
            ok(c3.hasClass('shuffl-card'), "card 3 shuffl card class");
            equals(c3.find("ctitle").text(), "Card 3 updated", "Card 3 title");
            var p3 = c3.position();
            equals(Math.floor(p3.left), 200, "position-left");
            equals(Math.floor(p3.top),  90,  "position-top");
            equals(c3.css("zIndex"), "11", "card zIndex");
            // Done
            callback(true);
        });        
        m.exec({}, start);
        ok(true, "shuffl.updateCard");
        stop();
    });

    // Update and move card in workspace, save workspace, read back, check content
    test("shuffl.saveWorkspace (updated moved card)", function () {
        log.info("----------");
        log.info((testnum++)+". test shuffl.saveWorkspace with updated and moved card");
        expect(52);
        var m = new shuffl.AsyncComputation();
        m.eval(function(val,callback) {
            log.debug("Load workspace");
            this.atompub = new shuffl.AtomPub(atomuri);
            // Read workspace from AtomPub service
            shuffl.loadWorkspace(layouturi, callback);
        });
        m.eval(function(val,callback) {
            // Check for card
            equals(jQuery("#layout").children().length, 1, "one card in workspace");
            var c3 = jQuery("#id_3");
            ok(c3 != undefined, "card id_3 defined")
            ok(c3.hasClass('shuffl-card'), "card 3 shuffl card class");
            equals(c3.find("ctitle").text(), "Card 3 updated", "Card 3 title");
            // Update and move card in workspace
            c3.find("ctitle").text("Card 3 updated and moved");
            c3.css({left:20, top:10});
            // Save workspace
            log.debug("Save workspace with updated and moved card");
            shuffl.updateWorkspace(callback);
        });
        m.eval(function(val, callback) {
            log.debug("Check result from update: "+val.uri);
            this.wsuri = jQuery.uri(val.uri, val.itemuri).toString();
            var uuid = val.itemid;
            equals(val.uri,      feeduri+"test-shuffl-saveworkspace-layout.json", "val.uri");
            equals(val.path,     feedpath+"test-shuffl-saveworkspace-layout.json", "val.path");
            equals(val.feeduri,  feeduri,  "val.feeduri");
            equals(val.feedpath, feedpath, "val.feedpath");
            equals(val.atomuri,  atomuri,  "val.atomuri");
            log.debug("Reset workspace...");
            shuffl.resetWorkspace(callback);
        });
        m.eval(function(val,callback) {
            log.debug("Workspace is reset");
            log.debug("Reload empty workspace from AtomPub...");
            shuffl.loadWorkspace(layouturi, callback);
        });
        m.eval(function(val,callback) {
            log.debug("Check reloaded workspace ");
            equals(jQuery('#workspaceuri').text(), layouturi.toString(), '#workspaceuri');
            equals(jQuery('#workspace').data('location'), layouturi.toString(), "location");
            equals(jQuery('#workspace').data('wsdata')['shuffl:atomuri'],  atomuri, "atomuri");
            equals(jQuery('#workspace').data('wsdata')['shuffl:feeduri'],  feeduri, "feeduri");
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
            // Check card in workspace
            equals(jQuery("#layout").children().length, 1, "one card in workspace");
            var c3 = jQuery("#id_3");
            ok(c3 != undefined, "card id_3 defined")
            ok(c3.hasClass('shuffl-card'), "card 3 shuffl card class");
            equals(c3.find("ctitle").text(), "Card 3 updated and moved", "Card 3 title");
            var p3 = c3.position();
            equals(Math.floor(p3.left), 20, "position-left");
            equals(Math.floor(p3.top),  10,  "position-top");
            equals(c3.css("zIndex"), "11", "card zIndex");
            // Done
            callback(true);
        });        
        m.exec({}, start);
        ok(true, "shuffl.SaveNewWorkspace (updated card) initiated");
        stop();
    });
    
    // TODO: create workspace with mix of absolute and relative card references
    //       save workspace as new
    //       reload workspace
    //       check card URIs
    
};

// End
