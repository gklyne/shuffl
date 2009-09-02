/**
 * @fileoverview
 *  Shuffl application main code.  Also needs card plugins to be loaded.
 *  
 * @author Graham Klyne
 * @version $Id$
 */

// If errors are seen, run Eclipse "(right-click project) > Validate" option

// Meanwhile, this suppresses many distracting errors:
jQuery = jQuery;

// ----------------------------------------------------------------
// Workspace layout and sizing
// ----------------------------------------------------------------

/**
 * Resize main shuffl spaces to fit current window
 */    
shuffl.resize = function() {
    log.debug("Resize workspace");
    // Adjust height of layout area
    var layout  = jQuery("#layout"); 
    var sheight = jQuery("#stockbar").outerHeight();
    var fheight = jQuery("#footer").outerHeight();
    var vmargin = parseInt(layout.css('margin-bottom'), 10);
    layout.height(layout.parent().innerHeight() - sheight - vmargin*7 - fheight);
};

// ----------------------------------------------------------------
// Save card
// ----------------------------------------------------------------

/**
 * Save card to indicated location
 * 
 * @param baseloc   is the base location (e.g. the Atom feed URI) at which the card is to be saved.
 * @param cardloc   is a suggested name for the dard data to be located within the feed.
 */
shuffl.saveCard = function(atompub, feedpath, cardloc, card, callback) {

    // Helper function extracts location from posted item response and 
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
    var cardclass = card.data('shuffl:class');
    var cardloc   = card.data('shuffl:location');
    var data      = card.data('shuffl:external');
    log.debug("shuffl.saveCard: "+cardid+", feedpath: "+feedpath+", cardloc: "+cardloc);
    // Build the card external object
    var cardext  = shuffl.createDataFromCard(card);
    atompub.createItem(
        { path:       feedpath
        , slug:       cardloc
        , datatype:   'application/json'
        , data:       data
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
 */
shuffl.saveNewWorkspace = function (atomuri, feedpath) {
    log.debug("shuffl.saveNewWorkspace: "+atomuri+", "+feedpath);
    var atompub = new shuffl.AtomPub(atomuri);
    var feeduri = atompub.serviceUri({path: feedpath});

    // Helper function extracts location from posted item response and 
    // displays it in the workspace
    var createComplete = function(val) {
        if (val instanceof shuffl.Error) { 
            // callback(data); 
        } else {
            log.debug("shuffl.saveCard:createComplete "+shuffl.objectString(val));
            // TODO: gfigure why wrong URI for data is returned
            jQuery('#workspaceuri').text(val.dataref.toString());
            // TODO: remove entries where wsdata value can be used later
            jQuery('#workspace').data('location', val.dataref);
            jQuery('#workspace').data('atomuri',  atomuri);
            jQuery('#workspace').data('feeduri',  feeduri);
            jQuery('#workspace').data('wsdata',   val.data);
            log.debug("- createComplete done");
            // callback(val);
        };
    };

    // Helper function to save card then invoke the next step
    var saveCard = function(card, next) {
        log.debug("shuffl.saveNewWorkspace:saveCard: "+card.id);
        var saveLoc = function(ret) {
            // Update card location
            log.debug("shuffl.saveNewWorkspace:saveCard:saveLoc: "+ret);
            card.data('shuffl:edituri', ret);
            next(card);
        };
        shuffl.saveRelativeCard(atompub, feedpath, card, saveLoc);
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
                    , 'data':   card.data('shuffl:external')
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
        atompub.createItem(
            { path:       feedpath
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

// ----------------------------------------------------------------
// Workspace menu command handlers
// ----------------------------------------------------------------

/**
 * Menu command "Save as new workspace..."
 */

// 1. use current location as default base
// 2. browse to save location via AtomPub
// 3. save cards, capture locations (or bail if error)
// 4. assemble workspace description and save
// 5. display location saved (where? title?)

// See also: shuffl.loadWorkspace("shuffl-sample-2.json")

shuffl.menuSaveNewWorkspace = function () {
    log.debug("shuffl.menuSaveNewWorkspace");
    var atomuri = jQuery('#workspace').data('atomuri');
    var feeduri = jQuery('#workspace').data('feeduri');
    log.debug("- atomuri "+atomuri+", feeduri "+feeduri);
    var atompub = new shuffl.AtomPub(atomuri);
    jQuery('#atomuri').val(atomuri);
    jQuery('#feedpath').val(atompub.getAtomPath(feeduri));
    atompub = null;
    jQuery("#dialog_savenew").dialog(
        { bgiframe: true,
          modal: true,
          dialogClass: 'dialog-savenew',
          width: 800,
          buttons: {
              Ok: function() {
                  var atomuri = jQuery('#atomuri').val();
                  var feedpath = jQuery('#feedpath').val();
                  jQuery(this).dialog('destroy');
                  log.debug("- OK: atomuri "+atomuri+", feedpath "+feedpath);
                  shuffl.saveNewWorkspace(atomuri, feedpath);
              },
              Cancel: function() {
                  log.debug("- Cancel");
                  jQuery(this).dialog('destroy');
              }
          }
        });
};

// ----------------------------------------------------------------
// Start-up logic
// ----------------------------------------------------------------

jQuery(document).ready(function() {

    log.info("shuffl starting");
       
    /**
     * Attach card-creation functions to stockpile cards
     */    

    log.debug("shuffl: attach card-creation functions to stockpile (TODO: allow function selection by stockpile definition)");

    jQuery("div.shuffl-stockpile").data( 'makeCard', shuffl.createCardFromStock);

    /**
     * Size workspace to fit within window (by default, it doesn't on Safari)
     */
    log.debug("shuffl: attach window resize handler)");
    jQuery(window).resize( shuffl.resize );
    shuffl.resize();

    /**
     * Connect up drag and drop for creating and moving cards
     * Only cards predefined in the original HTML are hooked up here
     */
    log.debug("shuffl: connect drag-and-drop logic");

    jQuery("div.shuffl-stockpile").draggable(shuffl.stockDraggable);
    jQuery("div.shuffl-card").draggable(shuffl.cardDraggable);
    jQuery("div.shuffl-card").click( function () { shuffl.toFront(jQuery(this)) } );

    jQuery("#layout").droppable({
        accept: "div.shuffl-stockpile",
        drop: 
            function(event, ui) {
                /**
                 * ui.draggable - current draggable element, a jQuery object.
                 * ui.helper - current draggable helper, a jQuery object
                 * ui.position - current position of the draggable helper { top: , left: }
                 * ui.offset - current absolute position of the draggable helper { top: , left: }
                 */
                log.debug("shuffl: drop "+ui.draggable);
                shuffl.dropCard(ui.draggable, jQuery(this), ui.offset);
            }
        });
    
    /**
     * TODO: connect up logic for saving changes to backend store
     */    
    log.debug("shuffl TODO: connect content save logic");

    /**
     * Create a pop-up workspace menu
     */    
    log.debug("shuffl: connect connect workspace menu");

    jQuery('div.shuffl-workspacemenu').contextMenu('workspacemenuoptions', {
        menuStyle: {
            'class': 'shuffl-contextmenu',
            'font-weight': 'bold',
            'background-color': '#DDDDDD',
            'border': 'thin #666666 solid'
            },
        showOnClick: true,
        bindings: {
            'open': function(t) {
                    log.info('Trigger was '+t.id+'\nAction was Open');
                },
            'save': function(t) {
                    log.info('Trigger was '+t.id+'\nAction was Save');
                },
            'savenew': function(t) {
                    log.info('Trigger was '+t.id+'\nAction was Save new');
                    shuffl.menuSaveNewWorkspace();
                }
          }
      });
    
    /**
     * Initialization is done - now it's all event-driven
     */
    
    log.info("shuffl initialization done");

    });

// End.
