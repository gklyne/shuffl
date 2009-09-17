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
// Workspace menu command handlers
// ----------------------------------------------------------------

// TODO: refactor dialog logic and form
// TODO: generate dialog dynamically instead of relying upon the page HTML

/**
 * Menu command "Open workspace..."
 */
shuffl.menuOpenWorkspace = function () {
    // Use current location (atomuri/feeduri) as default base
    log.debug("shuffl.menuLoadWorkspace");
    var wsdata   = jQuery('#workspace').data('wsdata');
    var atomuri  = wsdata['shuffl:atomuri'];
    var feeduri  = wsdata['shuffl:feeduri'];
    log.debug("- atomuri "+atomuri+", feeduri "+feeduri);
    var atompub = new shuffl.AtomPub(atomuri);
    jQuery('#open_atomuri').val(atomuri);
    jQuery('#open_feedpath').val(atompub.getAtomPath(feeduri));
    atompub = null;
    // Open dialog to obtain location of workspace data
    jQuery("#dialog_open").dialog(
        { bgiframe: true,
          modal: true,
          dialogClass: 'dialog-open',
          width: 800,
          buttons: {
              Ok: function() {
                  var atomuri  = jQuery('#open_atomuri').val();
                  var feedpath = jQuery('#open_feedpath').val();
                  var atompub  = new shuffl.AtomPub(atomuri);
                  var feeduri  = atompub.serviceUri({path: feedpath});
                  atompub = null;
                  jQuery(this).dialog('destroy');
                  log.debug("- OK: feeduri "+feeduri);
                  // Save cards, capture locations (or bail if error),
                  // assemble workspace description and save, and
                  // display location saved:
                  shuffl.resetWorkspace(function(val) {
                      shuffl.loadWorkspace(feeduri, shuffl.noop);                    
                  });
              },
              Cancel: function() {
                  log.debug("- Cancel");
                  jQuery(this).dialog('destroy');
              }
          }
        });
};

/**
 * Menu command "Save as new workspace..."
 */
shuffl.menuSaveNewWorkspace = function () {
    // Use current location (atomuri/feeduri) as default base
    log.debug("shuffl.menuSaveNewWorkspace");
    var wsdata   = jQuery('#workspace').data('wsdata');
    var atomuri  = wsdata['shuffl:atomuri'];
    var feeduri  = wsdata['shuffl:feeduri'];
    log.debug("- atomuri "+atomuri+", feeduri "+feeduri);
    var atompub = new shuffl.AtomPub(atomuri);
    jQuery('#save_atomuri').val(atomuri);
    jQuery('#save_feedpath').val(atompub.getAtomPath(feeduri));
    atompub = null;
    jQuery("#dialog_save").dialog(
        { bgiframe: true,
          modal: true,
          dialogClass: 'dialog-save',
          width: 800,
          buttons: {
              Ok: function() {
                  var atomuri = jQuery('#save_atomuri').val();
                  var feedpath = jQuery('#save_feedpath').val();
                  jQuery(this).dialog('destroy');
                  log.debug("- OK: atomuri "+atomuri+", feedpath "+feedpath);
                  // Save cards, capture locations (or bail if error),
                  // assemble workspace description and save, and
                  // display location saved:
                  shuffl.saveNewWorkspace(atomuri, feedpath, shuffl.noop);
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
                    log.debug('Menu trigger '+t.id+'\nAction is shuffl.menuOpenWorkspace');
                    shuffl.menuOpenWorkspace();
                },
            'save': function(t) {
                    log.debug('Menu trigger '+t.id+'\nAction is shuffl.menuSaveWorkspace');
                    shuffl.menuSaveWorkspace();
                },
            'savenew': function(t) {
                    log.debug('Menu trigger '+t.id+'\nAction is shuffl.menuSaveNewWorkspace');
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
