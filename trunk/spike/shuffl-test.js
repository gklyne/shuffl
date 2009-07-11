/**
 * @fileoverview
 *  Functions to support shuffl-card dragging and other animations
 *  
 * @author Graham Klyne
 * @version $Id: ...$
 */

// ----------------------------------------------------------------
// Globals
// ----------------------------------------------------------------

/**
 *  Add logging functions to global namespace, for convenience
 */
log = {};
log.debug = MochiKit.Logging.logDebug   ;
log.info  = MochiKit.Logging.log    ;
log.warn  = MochiKit.Logging.logWarning ;
log.error = MochiKit.Logging.logError   ;

// Hack as default is no limit and default firebug off
//MochiKit.Logging.logger.useNativeConsole = false;
//MochiKit.Logging.logger.maxSize = 2000;

/**
 * Namespace object
 */
if (typeof shuffl == "undefined") {
    shuffl = {};
}


jQuery(document).ready(function(){

    log.info("shuffl-test starting");
       
    /**
     * TODO: load card data and layout from backend store
     */
    
    log.debug("shuffl-test TODO: load card data");

    /**
     *         //  Find all stickpiles cards, and connect them to the Drag handler.
        var d = MochiKit.DOM.getElementsByTagAndClassName('div', 'shuffl-stockpile');
        MochiKit.Iter.forEach(d,
            function(elem) {
                var cardclass = MochiKit.DOM.getNodeAttribute(elem, 'class').replace(/shuffl-stockpile/,'')+' shuffl-card';
                elem.makeCard = shuffl.cardFactory('div', 'card_', cardclass, "(content)" );
                new MochiKit.DragAndDrop.Draggable(elem,
                    { revert: true
                    , ghosting: true
                    });
            });
     
     */
    
    /**
     * TODO: connect up drag and drop for creating and moving cards
     */
    
    log.debug("shuffl-test: connect drag-and-drop logic");

    jQuery("div.shuffl-stockpile").draggable({ 
        opacity: 0.8, revert: true, revertDuration: 0, stack: { group: '.shuffl-card', min: 10 } 
        });
    jQuery("div.shuffl-card").draggable({ 
        opacity: 0.5, stack: { group: '.shuffl-card', min: 10 } 
        });
    jQuery("#layout").droppable({
        accept: "div.shuffl-stockpile",
        drop: 
            function(event, ui) {
                shuffl.dropCard(ui.draggable, this);
                // jQuery(this).addClass('ui-state-highlight').find('p').html('Dropped!');
            }
        });
/**
 *                 {accept:["shuffl-stockpile"], ondrop:shuffl.dropCard});
 */

            /**
             * ui.draggable - current draggable element, a jQuery object.
             * ui.helper - current draggable helper, a jQuery object
             * ui.position - current position of the draggable helper { top: , left: }
             * ui.offset - current absolute position of the draggable helper { top: , left: }
             */


    /**
     * TODO: connect up logic for editing cards
     */
    
    log.debug("shuffl-test TODO: connect content editing logic");
    
    /**
     * TODO: connect up logic for saving changes to backend store
     */
    
    log.debug("shuffl-test TODO: connect content save logic");
    
    /**
     * Initialization is done - now it's all event-driven
     */
    
    log.info("shuffl-test initialization done");

    });

/**
 * Create a new card where a stock pile has been dropped
 */
shuffl.dropCard = function(frompile, tolayout) {
    log.debug("shuffl.dropCard")
    // Create card using stockpile card factory
    var newcard = frompile.makeCard();
    // make child of layout
    MochiKit.DOM.appendChildNodes(tolayout, newcard);
    // Locate card at drop point
    MochiKit.Style.setElementPosition(newcard, shuffl.boundedPosition(newcard, frompile, tolayout));
    // Place new card on top of cards
    shuffl.toFront(newcard, tolayout);
    // Click brings carc back to top
    MochiKit.Signal.connect(newcard, 'onclick', shuffl.bringToFront);
    // Make new card draggable
    new MochiKit.DragAndDrop.Draggable(newcard,
        { snap: shuffl.doBoundary(newcard)
        });
    // Consider making card-sized drag
}


// End.
