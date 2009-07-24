/**
 * @fileoverview
 *  Functions to support shuffl-card dragging and other animations
 *  
 * @author Graham Klyne
 * @version $Id: ...$
 */

// ----------------------------------------------------------------
// Globals and data
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
 * create shuffl namespace
 */
if (typeof shuffl == "undefined") {
    shuffl = {};
}

/**
 * Dummy assignment to keep Javascript, editor happy
 */
jQuery = jQuery;

// ----------------------------------------------------------------
// Stockpile and card functions
// ----------------------------------------------------------------

/**
 * Draggable options for stockpiles
 */
shuffl.stockDraggable = { 
    opacity: 0.8, 
    revert: true, 
    revertDuration: 0, 
    stack: { group: '.shuffl-card', min: 10 } 
};

/**
 * Draggable options for cards
 */
shuffl.cardDraggable = { 
    opacity: 0.5, 
    stack: { group: '.shuffl-card', min: 10 } 
};

/**
 * jQuery base element for building stockbar entries
 */
shuffl.stockpile_blank = jQuery("<div class='shuffl-stockpile' style='z-index:1;' />");

/**
 * jQuery element for stockpile spacer in stock bar
 */
shuffl.stockpile_space = jQuery("<div class='shuffl-spacer' />");

/**
 * jQuery base element for building new cards (used by shuffl.makeCard)
 */
shuffl.card_blank = jQuery(
    "<div class='shuffl-card' style='z-index:10;'>\n"+
    "  <chead>\n"+
    "    <cident>card_7_ident</cident>\n"+
    "    <ctitle>card_7 title</ctitle>\n"+
    "  </chead>\n"+
    "  <crow>\n"+
    "    <cbody>card_7 body</cbody>\n"+
    "  </crow>\n"+
    "  <crow>\n"+
    "    <cclass>card_7 class</cclass>n"+
    "    (<ctags>card_7 tags</ctags>)n"+
    "  </crow>"+
    "</div>");

/**
 * Function attached to stockpile to liberate a new card from that pile
 */    
shuffl.createCardFromStock = function (stockpile) { 
    log.debug("makeCard "+stockpile);
    var cardclass = stockpile.attr("class")
        .replace(/shuffl-stockpile/,'')
        .replace(/ui-draggable/,'')
        .replace(/ui-draggable-dragging/,'');
    log.debug("cardclass '"+cardclass+"'");
    return shuffl.getCardFactory(cardclass)(shuffl.makeId('card_'), cardclass, "..." );
    //return shuffl.makeCard(shuffl.makeId('card_'), cardclass, "..." );
};

/**
 * Creates and return a new card instance.
 * 
 * @param cardid        local card identifier - a local name for the card, which may be
 *                      combined with a base URI to form a URI for the card.
 * @param cardclass     CSS class names for the new card element
 * @param carddata      an object or string containing additional data used in constructing
 *                      the body of the card
 */

shuffl.makeCard = function (cardid, cardclass, carddata) {
    var card = shuffl.card_blank.clone();
    card.attr('id', shuffl.makeId(cardid));
    card.addClass(cardclass);
    // TODO: replace the text more selectively
    ...
    if (typeof carddata == "object") {
        cardtext = shuffl.objectString(carddata);
    } else {
        cardtext = carddata;
    };
    card.text(cardtext);
    log.debug("makeCard: "+shuffl.elemString(card[0]));
    return card;
};

/**
 * Return factory for creating new cards given a card type/class.
 */
shuffl.getCardFactory = function (cardclass) {
    var factorymap =
        { 'stock_1': shuffl.makeCard
        , 'stock_2': shuffl.makeCard
        , 'stock_3': shuffl.makeCard
        , 'stock_4': shuffl.makeCard
        , 'stock_5': shuffl.makeCard
        , 'stock_6': shuffl.makeCard
        };
    ////log.debug("getCardFactory: cardclass '"+cardclass+"'");
    ////log.debug("getCardFactory: cardclass "+jQuery.trim(cardclass));
    ////log.debug("cardFactory "+shuffl.objectString(shuffl.cardFactory));
    var factory = factorymap[jQuery.trim(cardclass)];
    if ( factory == undefined) {
        log.warn("getCardFactory: unrecognized card class: "+cardclass+", returning default factory");
        factory = shuffl.makeCard;
    };
    ////log.debug("factory "+factory);
    return factory;
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
 * Place card on the shuffl layout area
 * 
 * @param   layout  the layout area where the card will be placed
 * @param   card    the card to be placed
 * @param   pos     the position at which the card is to be placed
 */
shuffl.placeCard = function (layout, card, pos) {
    layout.append(card);
    card.css(pos);
    card.draggable(shuffl.cardDraggable);
    shuffl.toFront(card);
    // Click brings card back to top
    card.click( function () { shuffl.toFront(jQuery(this)); });
    // TODO: Consider making card-sized drag
};

/**
 * Create a new card where a stock pile has been dropped
 */
shuffl.dropCard = function(frompile, tolayout, pos) {
    log.debug("shuffl.dropCard: "+shuffl.objectString(pos));
    // Create card using stockpile card factory
    var newcard = frompile.data('makeCard')(frompile);
    //�Place card on layout
    pos = shuffl.positionRelative(pos, tolayout);
    pos = shuffl.positionRel(pos, { left:5, top:1 });   // TODO calulate this properly
    shuffl.placeCard(tolayout, newcard, pos);
};

// ----------------------------------------------------------------
// Miscellaneous support functions
// ----------------------------------------------------------------

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
            //log.debug("  - "+k+": "+obj[k]);
            str += pre + k + ': ' + obj[k];
            pre = ', ';
        }
    };
    return "{ "+str+" };";
};

/**
 * Calculate supplied absolute position as offset from supplied object
 */
shuffl.positionRelative = function (pos, obj) {
    var base = obj.position();
    //log.debug("positionRelative: pos  "+pos.left+", "+pos.top);
    //log.debug("positionRelative: base "+base.left+", "+base.top);
    return shuffl.positionRel(pos, base);
};

/**
 * Calculate absolute position supplied as offset from object
 */
shuffl.positionAbsolute = function (off, obj) {
    var base = obj.position();
    //log.debug("positionAbsolute: off  "+off.left+", "+off.top);
    //log.debug("positionAbsolute: base "+base.left+", "+base.top);
    return shuffl.positionAbs(base, off);
};

/**
 * Calculate supplied absolute position as offset from supplied object
 */
shuffl.positionRel = function (pos, base) {
    return { left: pos.left-base.left, top: pos.top-base.top };
};

/**
 * Calculate absolute position from supplied base and offset
 */
shuffl.positionAbs = function (base, off) {
    return { left: base.left+off.left, top: base.top+off.top };
};

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
    layout.height(layout.parent().innerHeight() - sheight - vmargin*4 - fheight);
};

// ----------------------------------------------------------------
// Load up workspace
// ----------------------------------------------------------------

shuffl.loadWorkspace = function(uri) {

    log.info("Load workspace from "+uri);

    jQuery.getJSON(uri, function (json) {
            // When JSON has beed read...
            log.debug("Loading workspace from "+uri);
            var i;
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
                stockpile.draggable(shuffl.stockDraggable);
                jQuery('#stockbar').append(shuffl.stockpile_space.clone()).append(stockpile);
            }
            log.debug("Loading layout");
            for (i = 0 ; i < layout.length ; i++) {
                log.debug("Loading card["+i+"]: "+shuffl.objectString(layout[i]));
                // Create card using card factory
                var cardclass = layout[i]['class'];
                var cardid    = layout[i]['id'];
                var carddata  = layout[i]['data'];   // TODO: populate data properly
                log.debug("cardclass "+cardclass);
                var newcard   = shuffl.getCardFactory(cardclass)(cardid, cardclass, carddata);
                //�Place card on layout
                var cardpos   = layout[i]['pos'];
                shuffl.placeCard(jQuery('#layout'), newcard, cardpos);
            }
            log.warn("TODO: populate data properly");
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

    jQuery("div.shuffl-stockpile").data( 'makeCard', shuffl.createCardFromStock );

    /**
     * Size workspace to fit within window (by default, it doesn't on Safari)
     */
    log.debug("shuffl: attach window resize handler)");
    jQuery(window).resize( shuffl.resize );
    shuffl.resize();

    /**
     * Connect up drag and drop for creating and moving cards
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
     * TODO: connect up logic for editing cards
     */
    
    log.debug("shuffl TODO: connect content editing logic");
    
    /**
     * TODO: connect up logic for saving changes to backend store
     */
    
    log.debug("shuffl TODO: connect content save logic");
    
    /**
     * Initialization is done - now it's all event-driven
     */

    /**
     * Creeate a pop-up context menu
     */    
    log.debug("shuffl connect connect context menu");

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
                }
          }
      });
    
    log.info("shuffl initialization done");

    });

// End.