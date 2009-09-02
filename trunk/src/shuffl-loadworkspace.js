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
 */

shuffl.loadWorkspace = function(uri) {

    log.info("Load workspace from: "+uri);

    jQuery.getJSON(uri, function (json) {
            // When JSON has been read...
            log.debug("Loading workspace from "+uri);
            var i;
            var atomuri  = json['shuffl:atomuri'];
            var feeduri  = json['shuffl:feeduri'];
            var stockbar = json['shuffl:workspace']['shuffl:stockbar'];
            var layout   = json['shuffl:workspace']['shuffl:layout'];
            for (i = 0 ; i < stockbar.length ; i++) {
                log.debug("Loading stockbar["+i+"]: "+shuffl.objectString(stockbar[i]));
                // Create and append new blank stockpile element
                var stockpile = shuffl.stockpile_blank.clone();
                stockpile.attr(stockbar[i]['id']);
                stockpile.addClass(stockbar[i]['class']);
                stockpile.text(stockbar[i]['label']);
                stockpile.data( 'makeCard', shuffl.createCardFromStock );
                stockpile.data( 'CardType', stockbar[i]['type'] );
                stockpile.draggable(shuffl.stockDraggable);
                jQuery('#stockbar').append(shuffl.stockpile_space.clone()).append(stockpile);
            }
            log.debug("Loading layout");
            for (i = 0 ; i < layout.length ; i++) {
                log.debug("Loading card["+i+"]: "+shuffl.objectString(layout[i]));
                log.debug("Loading URI: "+layout[i]['data']);
                jQuery.getJSON(layout[i]['data'], 
                    mk.partial(shuffl.createCardFromData, layout[i]));
            };
            var wsuri = jQuery.uri().resolve(uri).toString();
            log.debug("Display location of workspace, and save values: "+wsuri);
            jQuery('#workspaceuri').text(wsuri);
            // TODO: remove entries where wsdata value can be used later
            jQuery('#workspace').data('location', wsuri);
            jQuery('#workspace').data('atomuri',  atomuri);
            jQuery('#workspace').data('feeduri',  feeduri);
            jQuery('#workspace').data('wsdata',   json);
        });
};

// End.
