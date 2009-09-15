/**
 * @fileoverview
 *  Shuffl code to save workspace and card data to an AtomPub service.
 *  
 * @author Graham Klyne
 * @version $Id$
 */

// ----------------------------------------------------------------
// Delete card
// ----------------------------------------------------------------

/**
 * Delete card at indicated location
 * 
 * @param atompub   is the AtomPub session object to use
 * @param feedpath  is the feed path from which the card is to be deleted.
 * @param carduri   is the uri of the card to be deleted, 
 *                  possibly relative to the feed.
 * @param callback  called when the operation is complete
 * 
 * The callback is invoked with an Error value, or an empty dictionary
 * to indicate success.
 */
shuffl.deleteCard = function(atompub, feedpath, carduri, callback) {
    // Set up and issue the HTTP request to save the card data
    log.debug("shuffl.deleteCard, feedpath: "+feedpath+", carduri: "+carduri);
    // Build the card external object
    atompub.deleteItem(
        { base: feedpath
        , name: carduri.toString()
        },
        callback);
};

// ----------------------------------------------------------------
// Update card
// ----------------------------------------------------------------

/**
 * Update card
 * 
 * @param atompub   is the AtomPub session object to use
 * @param feedpath  patjh of the ATomPub feed containing this card
 * @param card      is the card jQuery object to be saved
 * @param callback  called when the operation is complete
 * 
 * The callback is invoked with an Error value, or the URI of the location
 * where the card data is saved, possibly expressed relative to the feed URI.
 */
shuffl.updateCard = function(atompub, feedpath, card, callback) {
    // Helper function extracts saved location from posted item response and 
    // returns it via callback
    var putComplete = function(data) {
        if (data instanceof shuffl.Error) { 
            callback(data); 
        } else {
            log.debug("shuffl.updateCard:putComplete "+shuffl.objectString(data));
            callback(data.uri);
        };
    };
    // Set up and issue the HTTP request to save the card data
    var cardid    = card.data('shuffl:id');
    var cardloc   = card.data('shuffl:location');
    log.debug("shuffl.updateCard: "+cardid+", feedpath: "+feedpath+", cardloc: "+cardloc);
    // Build the card external object
    var cardext = shuffl.createDataFromCard(card);
    log.debug("- cardext: "+shuffl.objectString(cardext));
    atompub.putItem(
        { base:       feedpath
        , name:       cardloc
        , datatype:   'application/json'
        , title:      cardloc
        , data:       cardext
        },
        putComplete);
};

// ----------------------------------------------------------------
// Save card
// ----------------------------------------------------------------

/**
 * Save card to indicated location
 * 
 * @param atompub   is the AtomPub session object to use
 * @param feedpath  is the feed path at which the card is to be saved.
 * @param cardloc   is a suggested name for the dard data to be located within the feed.
 * @param card      is the card jQuery object to be saved
 * @param callback  called when the operation is complete
 * 
 * The callback is invoked with an Error value, or the URI of the location
 * where the card data is saved, possibly expressed relative to the feed URI.
 */
shuffl.saveCard = function(atompub, feedpath, cardloc, card, callback) {
    // Helper function extracts saved location from posted item response and 
    // returns it via callback
    var createComplete = function(data) {
        if (data instanceof shuffl.Error) { 
            callback(data); 
        } else {
            log.debug("shuffl.saveCard:createComplete "+shuffl.objectString(data));
            callback(data.dataref);
        };
    };
    // Set up and issue the HTTP request to save the card data
    var cardid    = card.data('shuffl:id');
    log.debug("shuffl.saveCard: "+cardid+", feedpath: "+feedpath+", cardloc: "+cardloc);
    // Build the card external object
    var cardext  = shuffl.createDataFromCard(card);
    atompub.createItem(
        { path:       feedpath
        , slug:       cardloc
        , datatype:   'application/json'
        , data:       cardext
        },
        createComplete);
};

/**
 * Save card to indicated location if the location is relative 
 * (i.e. card is copied along with workspace), 
 * otherwise absolute card location is accessed by reference.
 */
shuffl.saveRelativeCard = function(atompub, feedpath, card, callback) {
    var cardid    = card.data('shuffl:id');
    var cardloc   = card.data('shuffl:location');
    log.debug("shuffl.saveRelativeCard: "+
        cardid+", cardloc: "+cardloc+", atompub: "+
        atompub+", feedpath: "+feedpath);
    if (shuffl.isRelativeUri(cardloc)) {
        shuffl.saveCard(atompub, feedpath, cardloc, card, callback);
    } else {
        callback(null);
    }
};

// ----------------------------------------------------------------
// Save workspace
// ----------------------------------------------------------------

/**
 * Save current data as new workspace.  Cards references by relative URIs are
 * saved as part of the new workspace.  Cards referenced using absilute URIs
 * are not saved, and are referenced at their current locations.
 * 
 * @param atomuri     URI of an AtomPub service that will be used to save 
 *                    the workspace data
 * @param feedpath    URI-path of Atom feed that will receive the new workspace
 *                    and card descriptions
 * @param callback    function called when the save is complete.
 * 
 * The callback supplies an Error instance, or information about the newly
 * saved workspace, thus:
 *   title:     title of the Atom item referencing the workspace description
 *   uri:       URI of the workspace description
 *   path:      URI path used by the AtomPub service API for accessing the
 *              workspace data
 *   itemuri:   URI of the Atom item referencing the workspace description
 *   itempath:  AtomPub service path for the referencing item
 *   itemid:    AtomPub item identifier for the referencing item
 *   feeduri:   URI of the atom feed where the workspace is saved
 *   feedpath:  AtomPub path, used in conjunction with the service, to access
 *              the atom feed containing the workspace.
 *   atomuri:   URI of the AtomPub service used
 * The atom-, feed- and item- values are intended to be opaque, and are 
 * intended to be stored with objects to assist in subsequent retrieval 
 * and editing using atompub.  The workspace URI should be resolved relative 
 * to the item URI. 
 */
// TODO: need to properly plan and document pattern of AtomPub URI usage
//       with workspace loads and saves.
shuffl.saveNewWorkspace = function (atomuri, feedpath, callback) {
    log.debug("shuffl.saveNewWorkspace: "+atomuri+", "+feedpath);
    var atompub = new shuffl.AtomPub(atomuri);
    var feeduri = atompub.serviceUri({path: feedpath});

    // Helper function extracts location from posted item response and 
    // displays it in the workspace
    var createComplete = function(val) {
        if (val instanceof shuffl.Error) { 
            callback(val); 
        } else {
            log.debug("shuffl.saveCard:createComplete "+shuffl.objectString(val));
            // TODO: figure why wrong URI for data is returned
            jQuery('#workspaceuri').text(val.dataref.toString());
            // TODO: remove entries where wsdata value can be used later
            jQuery('#workspace').data('location', val.dataref);
            jQuery('#workspace').data('atomuri',  atomuri);
            jQuery('#workspace').data('feeduri',  feeduri);
            jQuery('#workspace').data('wsdata',   val.data);
            log.debug("- createComplete done");
            var ret = 
                { title:    val.title
                , uri:      val.dataref
                , path:     val.datapath
                , itemuri:  val.uri
                , itempath: val.path
                , itemid:   val.id
                , feeduri:  feeduri
                , feedpath: feedpath
                , atomuri:  atomuri
                } 
            callback(ret);
        };
    };

    // Helper function to save card then invoke the next step
    var saveCard = function(card, next) {
        log.debug("shuffl.saveNewWorkspace:saveCard: "+card.id);
        var saveSaveLoc = function(ret) {
            // Update card location with result from saveRelativeCard
            log.debug("shuffl.saveNewWorkspace:saveCard:saveSaveLoc: "+ret);
            // shuffl:edituri is used later for card location in layout
            card.data('shuffl:edituri', ret);
            next(card);
        };
        shuffl.saveRelativeCard(atompub, feedpath, card, saveSaveLoc);
    };

    var saveWorkspaceCards = function(thencall) {
        log.debug("Scan cards - save any with relative location");
        var m = new shuffl.AsyncComputation();
        m.eval(
            function (val, next) {
                // Create feed if not already existing
                atompub.createFeed({path: feedpath, title: "Shuffl feed"}, next);
            });
        jQuery("div.shuffl-card").each(
            function (i) {
                var card = jQuery(this);
                //log.debug("- card "+i+", id "+card.id);
                m.eval(function (val, next) { saveCard(card, next); });
            });
        //log.debug("Invoke exec(...) for saving cards");
        m.exec(null, thencall);
    };

    // Save layout once all cards have been saved
    var saveWorkspaceDescription = function(val) {
        log.debug("Assemble workspace description with details from saved cards");
        var wsload = jQuery('#workspace').data('wsdata');

        // Assemble card layout info
        var layout   = [];
        jQuery("div.shuffl-card").each(
            function (i) {
                var card = jQuery(this);
                var cardlayout =
                    { 'id':     card.data('shuffl:id')
                    , 'class':  card.data('shuffl:class')
                    , 'data':   card.data('shuffl:edituri')
                    , 'pos':    card.position()
                    };
                layout.push(cardlayout);
            });

        // Assemble and save workspace description
        var ws = 
            { 'shuffl:id':            wsload['shuffl:id']
            , 'shuffl:class':         'shuffl:workspace'
            , 'shuffl:version':       '0.1'
            , 'shuffl:atomuri':       atomuri.toString()
            , 'shuffl:feeduri':       feeduri.toString()
            , 'shuffl:base-uri':      '#'
            , 'shuffl:uses-prefixes': wsload['shuffl:uses-prefixes']
            , 'shuffl:workspace':
              { 'shuffl:stockbar':      wsload['shuffl:workspace']['shuffl:stockbar']
              , 'shuffl:layout':        layout
              }
            }
        log.debug("Save workspace description");
        log.debug("- ws "+jQuery.toJSON(ws));
        // NOTE: need slug and/or title here when saving AtomPub media resource
        atompub.createItem(
            { path:       feedpath
            , slug:       ws['shuffl:id']+".json"
            , title:      ws['shuffl:id']
            , datatype:   'application/json'
            , data:       ws
            },
            createComplete);
        log.debug("shuffl.saveNewWorkspace, done.");
    };

    // Initiate workspace save now
    saveWorkspaceCards(saveWorkspaceDescription);

    log.debug("shuffl.saveNewWorkspace, returning.");
};

// End.
