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

/**
 * Draggable options for stockpiles
 */
shuffl.stockDraggable = { 
        opacity: 0.8, 
        revert: true, 
        revertDuration: 0, 
        stack: { group: '.shuffl-card', min: 10 } 
        }

/**
 * Draggable options for cards
 */
shuffl.cardDraggable = { 
        opacity: 0.5, 
        stack: { group: '.shuffl-card', min: 10 } 
        };

jQuery(document).ready(function(){

    log.info("shuffl-test starting");
       
    /**
     * TODO: load card data and layout from backend store
     */    
    log.debug("shuffl-test TODO: load card data");

    jQuery("div.shuffl-stockpile").data( 'makeCard', shuffl.createCardFromStock );

    /**
     * Connect up drag and drop for creating and moving cards
     */
    log.debug("shuffl-test: connect drag-and-drop logic");

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
                log.debug("shuffl-test: drop "+ui.draggable);
                shuffl.dropCard(ui.draggable, jQuery(this), ui.offset);
            }
        });

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

    /**
     * Creeate a pop-up context menu
     */    
    log.debug("shuffl-test connect connect context menu");

    //var menu = jQuery("#myMenu");
    //log.debug("  - "+"buildMenu"+": "+menu["buildMenu"]);
/*
    for ( var k in menu ) {
        log.debug("  - "+k+": "+menu[k]);
    };
*/

    jQuery('span.demo1').contextMenu('myMenu1', {
        bindings: {
            'open': function(t) {
                  alert('Trigger was '+t.id+'\nAction was Open');
                },
            'email': function(t) {
                  alert('Trigger was '+t.id+'\nAction was Email');
                },
            'save': function(t) {
                  alert('Trigger was '+t.id+'\nAction was Save');
                },
            'delete': function(t) {
                  alert('Trigger was '+t.id+'\nAction was Delete');
                }
          }
      });

      jQuery('#demo2').contextMenu('myMenu2', {
        menuStyle: {
          border: '2px solid #000'
        },
        itemStyle : {
          fontFamily: 'verdana',
          backgroundColor: '#666',
          color: 'white',
          border: 'none',
          padding: '1px'
        },
        itemHoverStyle: {
          color: '#fff',
          backgroundColor: '#0f0',
          border: 'none'
        }
      });
    
    log.info("shuffl-test initialization done");

    });

/**
 * Create a new card where a stock pile has been dropped
 */
shuffl.dropCard = function(frompile, tolayout, pos) {
    log.debug("shuffl.dropCard: "+shuffl.objectString(pos));
    // Create card using stockpile card factory
    var newcard = frompile.data('makeCard')(frompile);
    // make child of layout
    tolayout.append(newcard);
    // Locate card at drop point
    pos = shuffl.positionRelative(pos, tolayout);
    // TODO calulate this properly
    pos = shuffl.positionRel(pos, { left:9, top:9 });
    newcard.css(pos);
    // Make new card draggable
    newcard.draggable(shuffl.cardDraggable);
    // Place new card on top of cards
    shuffl.toFront(newcard);
    //newcard.css( 'z-index', frompile.css('z-index') );
    // Click brings card back to top
    newcard.click( function () { shuffl.toFront(jQuery(this)) });
    // TODO: Consider making card-sized drag
};

/**
 * Function attached to stockpile to liberate a new card from that pile
 */    
shuffl.createCardFromStock = function (stockpile) { 
    log.debug("makeCard "+stockpile);
    var cardclass = stockpile.attr("class")
        .replace(/shuffl-stockpile/,'')
        .replace(/ui-draggable/,'')
        .replace(/ui-draggable-dragging/,'')
        +' shuffl-card';
    //log.debug("  - cardclass: "+cardclass);
    return shuffl.makeCard('div', 'card_', cardclass, "(content)" );
};

/**
 * Creates a new card instance.
 * 
 * @param cardtag       element name for new card
 * @param cardidpref    local card identifier prefix - an autogenerated string is appeneded to
 *                      this to create a local name for the card, which in turn can be combined
 *                      with a base URI to form a URI for the card.
 * @param cardclass     CSS class names for the new card element
 * @param cardbody      string used in constructing the body of the card
 */
shuffl.makeCard = function (cardtag, cardidpref, cardclass, cardbody) {
    var card = jQuery("<"+cardtag+">"+cardbody+"</"+cardtag+">");
    card.attr('id', shuffl.makeId(cardidpref));
    card.addClass(cardclass);
    log.debug("makeCard: "+shuffl.elemString(card[0]));
    return card;
};

/**
 * Generate a new identifier string using a supplied prefix
 */
shuffl.idnext = 100;
shuffl.makeId = function(pref) {
    shuffl.idnext++;
    return pref+shuffl.idnext;
};

/**
 * Get string value representing a supplied element
 */
shuffl.elemString = function(elem) {
    var attrs = elem.attributes;
    var attrtext = "";
    for ( var i = 0 ; i < attrs.length ; i++ ) {
        // log.debug("  - @"+attrs[i].name+": "+attrs[i].value);
        attrtext += " "+attrs[i].name+"='"+attrs[i].value+"'";
    };
    var tagName = elem.tagName;
    return "<"+tagName+attrtext+">"
        +elem.innerHTML
        +"</"+tagName+">";
};

/**
 * Get string value for object attributes
 */
shuffl.objectString = function (obj) {
    var str = "";
    var pre = "";
    for ( var k in obj ) {
        if ( typeof obj[k] != "function" ) {
            log.debug("  - "+k+": "+obj[k]);
            str += pre + k + ': ' + obj[k];
            pre = ', ';
        }
    };
    return "{ "+str+" };"
}

/**
 * Calculate supplied absolute position as offset from supplied object
 */
shuffl.positionRelative = function (pos, obj) {
    var base = obj.position();
    //log.debug("positionRelative: pos  "+pos.left+", "+pos.top);
    //log.debug("positionRelative: base "+base.left+", "+base.top);
    return shuffl.positionRel(pos, base);
}

/**
 * Calculate absolute position supplied as offset from object
 */
shuffl.positionAbsolute = function (off, obj) {
    var base = obj.position();
    //log.debug("positionAbsolute: off  "+off.left+", "+off.top);
    //log.debug("positionAbsolute: base "+base.left+", "+base.top);
    return shuffl.positionAbs(base, off);
}

/**
 * Calculate supplied absolute position as offset from supplied object
 */
shuffl.positionRel = function (pos, base) {
    return { left: pos.left-base.left, top: pos.top-base.top };
}

/**
 * Calculate absolute position from supplied base and offset
 */
shuffl.positionAbs = function (base, off) {
    return { left: base.left+off.left, top: base.top+off.top };
}

/**
 * Move indicated element to front in its draggable group
 * 
 * Code adapted from jQuery
 */
shuffl.toFront = function (elem) {
    var opts = elem.data("draggable").options;
    var group = jQuery.makeArray(jQuery(opts.stack.group)).sort(function(a,b) {
            return (parseInt(jQuery(a).css("zIndex"),10) || opts.stack.min) - 
                   (parseInt(jQuery(b).css("zIndex"),10) || opts.stack.min);
        });
    jQuery(group).each(function(i) {
            this.style.zIndex = opts.stack.min + i;
        });
    elem[0].style.zIndex = opts.stack.min + group.length;
};

// End.
