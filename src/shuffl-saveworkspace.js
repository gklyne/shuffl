/**
 * @fileoverview
 *  Shuffl code to save workspace and card data to an AtomPub service.
 *  
 * @author Graham Klyne
 * @version $Id$
 * 
 * Coypyright (C) 2009, University of Oxford
 *
 * Licensed under the MIT License.  You may obtain a copy of the License at:
 *
 *     http://www.opensource.org/licenses/mit-license.php
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
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
    // Set up and issue the HTTP request to delete the card data
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
            //log.debug("shuffl.updateCard:putComplete "+shuffl.objectString(data));
            callback(data.uri);
        };
    };
    // Set up and issue the HTTP request to save the card data
    var cardid    = card.data('shuffl:id');
    var cardref   = card.data('shuffl:dataref');
    log.debug("shuffl.updateCard: "+cardid+", feedpath: "+feedpath+", cardref: "+cardref);
    // Build the card external object
    var cardext = shuffl.createDataFromCard(card);
    //log.debug("- cardext: "+shuffl.objectString(cardext));
    atompub.putItem(
        { base:       feedpath
        , name:       cardref
        , datatype:   'application/json'
        , title:      cardref
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
 * @param cardref   is a suggested name for the dard data to be located within the feed.
 * @param card      is the card jQuery object to be saved
 * @param callback  called when the operation is complete
 * 
 * The callback is invoked with an Error value, or the URI of the location
 * where the card data is saved, possibly expressed relative to the feed URI.
 */
shuffl.saveCard = function(atompub, feedpath, cardref, card, callback) {
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
    log.debug("shuffl.saveCard: "+cardid+", feedpath: "+feedpath+", cardref: "+cardref);
    // Build the card external object
    var cardext  = shuffl.createDataFromCard(card);
    atompub.createItem(
        { path:       feedpath
        , slug:       cardref
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
    var cardref   = card.data('shuffl:dataref');
    //log.debug("shuffl.saveRelativeCard: "+cardid+", cardref: "+cardref+", atompub: "+atompub+", feedpath: "+feedpath);
    if (shuffl.isRelativeUri(cardref)) {
        shuffl.saveCard(atompub, feedpath, cardref, card, callback);
    } else {
        callback(null);
    }
};

// ----------------------------------------------------------------
// Assemble workspace description
// ----------------------------------------------------------------

/**
 * Scan the current workspace and assemble a description that can be written to 
 * persistent storage.  The description is returned as a JSON structure which
 * will be serialized as required when written.
 * 
 * @param atomuri   is the URI of the current AtomPub service
 * @param feeduri   is the URI of the feed to which the current workspace
 *                  is being written
 * @return          a Javascript object containing a description of the current
 *                  workspace, ready to be serialized and written out.
 */
shuffl.assembleWorkspaceDescription = function (atomuri, feeduri) {
    log.debug("Assemble workspace description "+feeduri);
    // Assemble card layout info
    var layout   = [];
    jQuery("div.shuffl-card").each(
        function (i) {
            var card = jQuery(this);
            var size = {width:card.width(), height:card.height()} ;
            var cardlayout =
                { 'id':     card.data('shuffl:id')
                , 'class':  card.data('shuffl:class')
                , 'data':   card.data('shuffl:dataref')
                , 'pos':    card.position()
                , 'size':   size
                , 'zindex': parseInt(card.css('zIndex'), 10)
                };
            layout.push(cardlayout);
        });
    // Assemble and save workspace description
    var wsload = jQuery('#workspace').data('wsdata');
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
        };
    //log.debug("Workspace description: "+jQuery.toJSON(ws));
    return ws;
};

// ----------------------------------------------------------------
// Process cards in workspace with asynchronous function
// ----------------------------------------------------------------

/**
 * Perform some asynchronous-completing operation on each card in the workspace,
 * then call a suppliued function when all are done.
 * 
 * @param firstval  a parameter value passed to the first function in the
 *                  constructed callback chain.
 * @param firstcall a function called with the supplied parameter and a 
 *                  callback function before processing the card data.
 * @param proccard  a function called with a jQuery card object and callback 
 *                  function for each card in the workspace.
 * @param thencall  a function called with the result from the last card-
 *                  processing function called when all cards have been 
 *                  processed.
 */
shuffl.processWorkspaceCards = function(firstval, firstcall, proccard, thencall) {
        log.debug("shuffl.processWorkspaceCards");
        var m = new shuffl.AsyncComputation();
        m.eval(firstcall);
        jQuery("div.shuffl-card").each(
            function (i) {
                var card = jQuery(this);
                //log.debug("- card "+i+", id "+card.id);
                m.eval(function (val, next) { proccard(card, next); });
            });
        //log.debug("Invoke exec(...) for saving cards");
        m.exec(firstval, thencall);
    };

/**
 * Helper function for processing return value when a new card is created, 
 * to save the card details into the jQuery card object.
 * 
 * @param card      is the jQuery card object to be updated
 * @param next      callback function to invoke when the results from card 
 *                  creation have been saved.
 * @return          a function that is used as a callback with shuffl.saveCard
 *                  or shuffl.saveRelativeCard.
 */
shuffl.saveNewCardDetails = function (card, next) {
    var saveDetails = function(ret) {
        // Update card location with result from shuffl.saveCard
        // See: http://code.google.com/p/shuffl/wiki/CardReadWriteOptions
        //log.debug("shuffl.saveNewCardDetails: "+ret);
        card.data('shuffl:dataref', shuffl.uriName(ret));
        card.data('shuffl:datauri', ret);
        card.data('shuffl:dataRW',  true);
        card.data('shuffl:datamod', false);
        next(card);
    };
    return saveDetails;
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
 * @param wsname      is the name of a resource withinthe feed where the
 *                    workspace layout is saved.
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
shuffl.saveNewWorkspace = function (atomuri, feedpath, wsname, callback) {
    log.debug("shuffl.saveNewWorkspace: "+atomuri+", "+feedpath+", "+wsname);
    var atompub = new shuffl.AtomPub(atomuri);
    var feeduri = atompub.serviceUri({path: feedpath});
    var wsdata  = undefined;

    // Helper function extracts location from posted item response and 
    // displays it in the workspace.  Also assembles return values.
    var createComplete = function(val) {
        if (val instanceof shuffl.Error) { 
            callback(val); 
        } else {
            //log.debug("shuffl.saveNewWorkspace:createComplete "+shuffl.objectString(val));
            jQuery('#workspace_status').text(val.datauri.toString());
            jQuery('#workspace').data('location', val.datauri);
            jQuery('#workspace').data('wsname',   wsname);
            jQuery('#workspace').data('wsdata',   wsdata);
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
    var localSaveCard = function(card, next) {
        //log.debug("shuffl.saveNewWorkspace:saveCard: "+card.id);
        shuffl.saveRelativeCard(
            atompub, feedpath, card, shuffl.saveNewCardDetails(card, next));
    };

    // Save all cards in the workspace
    var saveWorkspaceCards = function(thencall) {
        shuffl.processWorkspaceCards(
            {path: feedpath, title: "Shuffl feed"}, 
            function (val,next) { atompub.createFeed(val, next); },
            localSaveCard, 
            thencall);
    };

    // Save layout once all cards have been saved
    var saveWorkspaceDescription = function(val) {
        log.debug("Assemble workspace description with details from workspace");
        wsdata = shuffl.assembleWorkspaceDescription(atomuri, feeduri);
        if (wsname == undefined || wsname == "") {
            //�Default name from workspace Id + ".json"
            wsname = wsdata['shuffl:id']+".json";
        }
        // NOTE: need slug and/or title here when saving AtomPub media resource
        atompub.createItem(
            { path:       feedpath
            , slug:       wsname
            , title:      wsdata['shuffl:id']
            , datatype:   'application/json'
            , data:       wsdata
            },
            createComplete);
        log.debug("shuffl.saveNewWorkspace, done.");
    };

    // Initiate workspace save now
    saveWorkspaceCards(saveWorkspaceDescription);
    log.debug("shuffl.saveNewWorkspace, returning.");
};

// ----------------------------------------------------------------
// Update workspace
// ----------------------------------------------------------------

/**
 * Save current data as updated version of current workspace.
 * 
 * @param callback    function called when the update is complete.
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
shuffl.updateWorkspace = function (callback) {
    var wsdata   = jQuery('#workspace').data('wsdata');
    var wsuri    = jQuery('#workspace').data('location');
    var atomuri  = wsdata['shuffl:atomuri'];
    var feeduri  = wsdata['shuffl:feeduri'];
    var atompub  = new shuffl.AtomPub(atomuri);
    var feedpath = atompub.getAtomPath(feeduri);
    log.debug("shuffl.updateWorkspace: "+atomuri+", "+feeduri+", "+feedpath);

    // Helper function extracts return values following update
    var updateComplete = function(val) {
        if (val instanceof shuffl.Error) { 
            callback(val); 
        } else {
            //log.debug("shuffl.saveCard:updateComplete "+shuffl.objectString(val));
            var ret = 
                { uri:      val.uri
                , path:     val.path
                , feeduri:  feeduri
                , feedpath: feedpath
                , atomuri:  atomuri
                };
            callback(ret);
        };
    };

    // Helper function to update card then invoke the next step
    var localUpdateCard = function(card, next) {
        //log.debug("shuffl.updateWorkspace:localUpdateCard: "+card.id);
        if (card.data('shuffl:datauri') == null) {
            shuffl.saveRelativeCard(atompub, feedpath, card, 
                shuffl.saveNewCardDetails(card, next));
        } else if (card.data('shuffl:datamod')) {
            shuffl.updateCard(atompub, feedpath, card, next);
        } else {
            next({});   // Nod modified: skip this card, invoke callback
        };
    };

    // Update all cards in workspace
    var updateWorkspaceCards = function(thencall) {
        shuffl.processWorkspaceCards(
            null,
            function (val, next) { next(val); },
            localUpdateCard,
            thencall);
    };

    // Update layout once all cards have been saved
    var updateWorkspaceDescription = function(val) {
        log.debug("Assemble workspace description with details from workspace");
        var ws = shuffl.assembleWorkspaceDescription(atomuri, feeduri);
        atompub.putItem(
            { uri:        wsuri
            , title:      ws['shuffl:id']
            , datatype:   'application/json'
            , data:       ws
            },
            updateComplete);
        log.debug("shuffl.updateWorkspaceDescription, initiated.");
    };

    // Initiate workspace update
    updateWorkspaceCards(updateWorkspaceDescription);

    log.debug("shuffl.updateWorkspace, returning.");
};

// ----------------------------------------------------------------
// Delete workspace
// ----------------------------------------------------------------

/**
 * Delete workspace.
 * 
 * @param atomuri     URI of AtomPub service.
 * @param feedpath    Feed path of workspace to delete
 * @param callback    function called when the update is complete.
 * 
 * The callback supplies an empty object, or an Error instance
 */
shuffl.deleteWorkspace = function (atomuri, feedpath, callback) {
    log.debug("shuffl.deleteWorkspace: "+atomuri+", "+feedpath);
    this.atompub  = new shuffl.AtomPub(atomuri);
    this.atompub.deleteFeed({path:feedpath}, callback);
};

// End.