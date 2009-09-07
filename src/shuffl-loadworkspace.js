/**
 * @fileoverview
 *  Shuffl code to load card data into the workspace.
 *  
 * @author Graham Klyne
 * @version $Id$
 */

// ----------------------------------------------------------------
// Load up workspace
// ----------------------------------------------------------------

/**
 * Load card data into the workspace.
 * 
 * Note that loading data is done using pure web GET requests, without 
 * reference to AtomPub protocol elements.  The URIs used may be different 
 * from the AtomPub editing URIs, which are stored as part of the data.
 * 
 * The data loaded is added to any data which may already be present.
 * 
 * @param uri       URI of workspace description.
 * @param callback  function called when the load is complete.
 */

shuffl.loadWorkspace = function(uri, callback) {

    log.info("Load workspace from: "+uri);

    var m = new shuffl.AsyncComputation();

    jQuery.getJSON(uri, function (json) {
            // When layout JSON has been read...
            log.debug("Loading workspace from "+uri);
            var i;
            var atomuri  = json['shuffl:atomuri'];
            var feeduri  = json['shuffl:feeduri'];
            var stockbar = json['shuffl:workspace']['shuffl:stockbar'];
            var layout   = json['shuffl:workspace']['shuffl:layout'];
            // Display and save location information
            log.debug("Display location of workspace, and save values: "+wsuri);
            jQuery('#workspaceuri').text(wsuri);
            // TODO: remove entries where wsdata value can be used later
            jQuery('#workspace').data('location', wsuri);
            jQuery('#workspace').data('atomuri',  atomuri);
            jQuery('#workspace').data('feeduri',  feeduri);
            jQuery('#workspace').data('wsdata',   json);
            // Lopad up stock bar
            for (i = 0 ; i < stockbar.length ; i++) {
                log.debug("Loading stockbar["+i+"]: "+shuffl.objectString(stockbar[i]));
                // Create and append new blank stockpile element
                // TODO: use createStockpile helper
                var stockpile = shuffl.stockpile_blank.clone();
                stockpile.attr(stockbar[i]['id']);
                stockpile.addClass(stockbar[i]['class']);
                stockpile.text(stockbar[i]['label']);
                stockpile.data( 'makeCard', shuffl.createCardFromStock );
                stockpile.data( 'CardType', stockbar[i]['type'] );
                stockpile.draggable(shuffl.stockDraggable);
                jQuery('#stockbar').append(shuffl.stockpile_space.clone()).append(stockpile);
            }
            // Load up card data
            // TODO: factor out wait-for-all logic as general utility, or sequence
            log.debug("Loading layout");
            function readcard(layout) {
                jQuery.getJSON(layout['data'], 
                    function (val) {
                        // Card data available
                        shuffl.placeCardFromData(layout, val);
                        cardcount--;
                        if (cardcount == 0) { callback({}); };
                    });
            };
            var cardcount = 1;
            for (i = 0 ; i < layout.length ; i++) {
                cardcount++;
                log.debug("Loading card["+i+"]: "+shuffl.objectString(layout[i]));
                log.debug("Loading URI: "+layout[i]['data']);
                readcard(layout[i]);
            };
            cardcount--;
            if (cardcount == 0) { callback({}); };
            var wsuri = jQuery.uri().resolve(uri).toString();
        });
};

// End.
