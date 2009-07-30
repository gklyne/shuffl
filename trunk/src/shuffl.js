/**
 * @fileoverview
 *  Shuffl application main code.  Also needs card plugins to be loaded.
 *  
 * @author Graham Klyne
 * @version $Id: ...$
 */

// If errors are seen, run Eclipse "(right-click project) > Validate" option

// Meanwhile, this suppresses many distracting errors:
jQuery = jQuery;

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

// Mochikit logging hack as default is no limit and default firebug off:
//MochiKit.Logging.logger.useNativeConsole = false;
//MochiKit.Logging.logger.maxSize = 2000;

/**
 * create shuffl namespace
 */
if (typeof shuffl == "undefined") {
    shuffl = {};
    shuffl.CardFactoryMap = {};   // Initial empty card factory map
    shuffl.idnext         = 100;  // Counter for unique id generation    
}

// ----------------------------------------------------------------
// Card factory functions
// ----------------------------------------------------------------

/**
 * Add factory for new card type to the factory map
 */
shuffl.addCardFactory = function (cardtype, cssclass, factory) {
    shuffl.CardFactoryMap[cardtype] = { cardcss: cssclass, cardfactory: factory };
};

/**
 * Return factory for creating new cards given a card type/class.
 */
shuffl.getCardFactory = function (cardtype) {
    ////log.debug("getCardFactory: cardclass '"+cardclass+"'");
    ////log.debug("getCardFactory: cardclass "+jQuery.trim(cardclass));
    ////log.debug("cardFactory "+shuffl.objectString(shuffl.cardFactory));
    var factory = shuffl.CardFactoryMap[jQuery.trim(cardtype)];
    if ( factory == undefined) {
        log.warn("getCardFactory: unrecognized card type: "+cardtype+", returning default factory");
        factory = MochiKit.Base.partial(shuffl.makeDefaultCard, cardtype);
    } else {
        var cssclass = factory.cardcss;
        log.debug("getCardFactory: card type: "+cardtype+", card CSS class: "+cssclass);
        factory    = MochiKit.Base.partial(factory.cardfactory, cardtype, cssclass);
    }
    ////log.debug("factory "+factory);
    return factory;
};

/**
 * jQuery base element for building new default cards
 */
shuffl.card_default_blank = jQuery(
    "<div class='shuffl-card' style='z-index:10;'>\n"+
    "  <chead>\n"+
    "    <chandle><c></c></chandle>" +
    "    <ctitle>card title</ctitle>\n"+
    "  </chead>\n"+
    "  <cfoot>\n"+
    "    <cident>card_ZZZ_ident</cident>:<cclass>card_ZZZ class</cclass>\n"+
    "    (<ctags>card_ZZZ tags</ctags>)\n"+
    "  </cfoot>"+
    "</div>");

/**
 * Default card factory: title and tags only
 */
shuffl.makeDefaultCard = function (cardtype, cardid, carddata) {
    var card_default_blank =
    log.debug("shuffl.makeDefaultCard: "+cardid+", "+carddata);
    var card = shuffl.card_default_blank.clone();
    card.attr('id', cardid);
    card.addClass("stock-default");
    var cardtags  = shuffl.get(carddata, 'shuffl:tags',  cardid+" "+cardtype);
    var cardtitle = shuffl.get(carddata, 'shuffl:title', cardid+" - class "+cardtype);
    card.find("cident").text(cardid);
    card.find("cclass").text(cardtype);
    card.find("ctitle").text(cardtitle);
    shuffl.lineEditable(card.find("ctitle"));
    card.find("ctags").text(cardtags);
    shuffl.lineEditable(card.find("ctags"));
    return card;
};

// ----------------------------------------------------------------
// Stockpile and card support functions
// ----------------------------------------------------------------

/**
 * Helper function to return a string value from an object field, 
 * otherwise a supplied default.  This function processes incoming
 * JSON, so should be defensively implemented.
 * 
 * @param obj           the object value
 * @param key           the key of the member value to extract
 * @param def           the default value to use if there is any
 *                      problem with the object member value.
 */
shuffl.get = function (obj, key, def) {
    if (typeof obj == "object" && obj.hasOwnProperty(key)) {
        var val = obj[key];
        if (typeof val == "string") { return val; }
        if (val instanceof Array)   { return val.join(" "); }
    };
    return def;
};

/**
 * Generate a new identifier string using a supplied prefix
 */
shuffl.makeId = function(pref) {
    shuffl.idnext++;
    return pref+shuffl.idnext;
};

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
 * jQuery element for drag handle in card title bar
 * (this is just an inactive area that doesn't try to do anything when clicked)
 */
shuffl.stockpile_handle = jQuery("<div class='shuffl-handle' />");

/**
 * Function attached to stockpile to liberate a new card from that pile
 */    
shuffl.createCardFromStock = function (stockpile) { 
    log.debug("makeCard "+stockpile);
    var cardtype = stockpile.data("CardType");
    var cardclass = stockpile.attr("class")
        .replace(/shuffl-stockpile/,'')
        .replace(/ui-draggable/,'')
        .replace(/ui-draggable-dragging/,'');
    // log.debug("cardclass '"+cardclass+"'");
    return shuffl.getCardFactory(cardtype)(shuffl.makeId('card_'), cardclass, "[body text ...]" );
    //return shuffl.makeCard(shuffl.makeId('card_'), cardclass, "..." );
};

/**
 * Create a new card using a supplied layout value and card data
 */
shuffl.createCardFromData = function (layout, data) { 
    //log.debug("shuffl.createCardFromData, layout:    "+shuffl.objectString(layout));
    //log.debug("shuffl.createCardFromData, card data: "+shuffl.objectString(data));
    // Create card using card factory
    var carddata  = data['shuffl:data'];
    var cardid    = shuffl.get(data, 'shuffl:id',    layout['id']);
    var cardclass = shuffl.get(data, 'shuffl:class', layout['class']);
    log.debug("cardid: "+cardid+", cardclass: "+cardclass);
    var newcard   = shuffl.getCardFactory(cardclass)(cardid, cardclass, carddata);
    //ÊPlace card on layout
    var cardpos   = layout['pos'];
    shuffl.placeCard(jQuery('#layout'), newcard, cardpos);
};

/**
 * Function called before a text element is edited with a copy of the text,
 * and returning a modified version.  In this case, the raw text is extracted.
 */
shuffl.initEditText = function(value) {
    log.debug("shuffl.initEditText: "+value);
    return value.replace(/<br[^>]*>/g, "\n\n");
};

/**
 * Function called when done editing text: newlines are converted back to <br/>
 * and '<' to '&lt;.
 */
shuffl.doneEditText = function(value, settings) {
    log.debug("shuffl.doneEditText: "+value);
    return value.replace(/</g,"&lt;").replace(/\n\n/g, "<br/>");
};

/**
 * Function that can be used for submitting new edit text unchaged.
 */
shuffl.passEditText = function(value, settings) {
    log.debug("shuffl.passEditText: "+value);
    return value;
};

/**
 * Set up single line inline edit field
 */
shuffl.lineEditable = function (field) {
    field.editable(shuffl.passEditText, 
        { data: shuffl.passEditText
        , onblur: 'submit'
        , tooltip: 'Click to edit...'
        , submit: 'OK'
        , cancel: 'cancel'
        , cssclass: 'shuffl-lineedit'
        , width: 400
        });
};

/**
 * Set up multiline inline edit field
 */
shuffl.blockEditable = function (field) {
    field.editable(shuffl.doneEditText, 
        { data: shuffl.initEditText
        , type: 'textarea'
        , onblur: 'submit'
        , tooltip: 'Click to edit...'
        , submit: 'OK'
        , cancel: 'cancel'
        , cssclass: 'shuffl-blockedit'
        });
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
    card.css(pos).css('position', 'absolute');
    card.draggable(shuffl.cardDraggable);
    // card.resizable({ghost: true, alsoResize: '#'+card.attr('id')+' cbody'});
    //card.addClass("resizable ui-resizable")
    //card.resizable();
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
    //ÊPlace card on layout
    pos = shuffl.positionRelative(pos, tolayout);
    pos = shuffl.positionRel(pos, { left:5, top:1 });   // TODO calculate this properly
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
 * Parse integer value from string, or return supplied default value
 * 
 * @param str       string to be parsed
 * @param rad       radix to parse
 * @param def       default value
 */
shuffl.parseInt = function (str, rad, def) {
    return parseInt(str, 10) || def;
};

/**
 * Move indicated element to front in its draggable group
 * 
 * Code adapted from jQuery
 */
shuffl.toFront = function (elem) {
    if (elem.data("draggable")) {
        var opts = elem.data("draggable").options;
        var group = jQuery.makeArray(jQuery(opts.stack.group)).sort(function(a,b) {
                return shuffl.parseInt(jQuery(a).css("zIndex"), 10, opts.stack.min) - 
                       shuffl.parseInt(jQuery(b).css("zIndex"), 10, opts.stack.min);
            });
        jQuery(group).each(function(i) {
                this.style.zIndex = opts.stack.min + i;
            });
        elem[0].style.zIndex = opts.stack.min + group.length;
    };
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

    log.info("Load workspace from: "+uri);

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
                stockpile.data( 'CardType', stockbar[i]['type'] );
                stockpile.draggable(shuffl.stockDraggable);
                jQuery('#stockbar').append(shuffl.stockpile_space.clone()).append(stockpile);
            }
            log.debug("Loading layout");
            for (i = 0 ; i < layout.length ; i++) {
                log.debug("Loading card["+i+"]: "+shuffl.objectString(layout[i]));
                log.debug("Loading URI: "+layout[i]['data']);
                jQuery.getJSON(layout[i]['data'], 
                    MochiKit.Base.partial(shuffl.createCardFromData, layout[i]));
            };
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
    log.debug("shuffl: connect connect context menu");

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
