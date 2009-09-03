/**
 * @fileoverview
 *  Shuffl application main code.  Also needs card plugins to be loaded.
 *  
 * @author Graham Klyne
 * @version $Id$
 */

// ----------------------------------------------------------------
// Initialize global data values
// ----------------------------------------------------------------

/**
 * Ensure card-related values are initialized in the shuffl namespace
 */
if (typeof shuffl == "undefined") {
    shuffl = {};
}
if (typeof shuffl.CardFactoryMap == "undefined") {
    shuffl.CardFactoryMap = {};   // Initial empty card factory map
}
if (typeof shuffl.idnext == "undefined") {
    shuffl.idnext         = 100;  // Counter for unique id generation    
}

// ----------------------------------------------------------------
// Blank object for externally stored card data
// ----------------------------------------------------------------

shuffl.ExternalCardData =
    { 'shuffl:id':        undefined
    , 'shuffl:class':     undefined
    , 'shuffl:version':   '0.1'
    , 'shuffl:base-uri':  '#'
    , 'shuffl:uses-prefixes':
      [ { 'shuffl:prefix':  'shuffl', 'shuffl:uri': 'http://purl.org/NET/Shuffl/vocab#' }
      , { 'shuffl:prefix':  'rdf',    'shuffl:uri': 'http://www.w3.org/1999/02/22-rdf-syntax-ns#' }
      , { 'shuffl:prefix':  'rdfs',   'shuffl:uri': 'http://www.w3.org/2000/01/rdf-schema#' }
      , { 'shuffl:prefix':  'owl',    'shuffl:uri': 'http://www.w3.org/2002/07/owl#' }
      , { 'shuffl:prefix':  'xsd',    'shuffl:uri': 'http://www.w3.org/2001/XMLSchema#' }
      ]
    , 'shuffl:data': undefined
    };

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
        factory = mk.partial(shuffl.makeDefaultCard, cardtype);
    } else {
        var cssclass = factory.cardcss;
        log.debug("getCardFactory: card type: "+cardtype+", card CSS class: "+cssclass);
        factory    = mk.partial(factory.cardfactory, cardtype, cssclass);
    }
    ////log.debug("factory "+factory);
    return factory;
};

// ----------------------------------------------------------------
// Default card functions
// ----------------------------------------------------------------

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
shuffl.makeDefaultCard = function (cardtype, unused_cardcss, cardid, carddata) {
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
 * Create a new stockpile
 */
shuffl.createStockpile = function(sid, sclass, slabel, stype) {
    // Create new blank stockpile element
    var stockpile = shuffl.stockpile_blank.clone();
    stockpile.attr('id', sid);
    stockpile.addClass(sclass);
    stockpile.text(slabel);
    stockpile.data( 'makeCard', shuffl.createCardFromStock );
    stockpile.data( 'CardType', stype);
    stockpile.draggable(shuffl.stockDraggable);
    return stockpile;
};

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
    var cardid = shuffl.makeId('card_');
    // log.debug("cardclass '"+cardclass+"'");
    var newcard = shuffl.getCardFactory(cardtype)(cardid, cardclass, "");
    // Instantiate location and external data valuesshuffl.makeId('card_')
    newcard.data('shuffl:location', cardid);
    newcard.data('shuffl:external', shuffl.ExternalCardData);
    return newcard;
};

/**
 * Create and place a new card using a supplied layout value and card data
 */
shuffl.placeCardFromData = function (layout, data) { 
    //log.debug("shuffl.placeCardFromData, layout:    "+shuffl.objectString(layout));
    //log.debug("shuffl.placeCardFromData, card data: "+shuffl.objectString(data));
    var carddata  = data['shuffl:data'];  // Card-type specific data
    var cardid    = shuffl.get(data, 'shuffl:id',    layout['id']);
    var cardclass = shuffl.get(data, 'shuffl:class', layout['class']);
    var cardloc   = layout['data'];
    // Create card using card factory
    log.debug("cardid: "+cardid+", cardclass: "+cardclass);
    var newcard   = shuffl.getCardFactory(cardclass)(cardid, cardclass, carddata);
    // Save details in jQuery card object
    newcard.data('shuffl:id',       cardid);
    newcard.data('shuffl:class',    cardclass);
    newcard.data('shuffl:location', cardloc);
    newcard.data('shuffl:external', data);
    //ÊPlace card on layout
    var cardpos   = layout['pos'];
    shuffl.placeCard(jQuery('#layout'), newcard, cardpos);
};

/**
 * Create an external representation object for a card
 */
shuffl.createDataFromCard = function (card) { 
    var extdata = card.data('shuffl:external');
    extdata['shuffl:id']    = card.data('shuffl:id');
    extdata['shuffl:class'] = card.data('shuffl:class');
    extdata['shuffl:data']  = card.data('shuffl:tojson')(card);
    //log.debug("shuffl.createDataFromCard, extdata: "+shuffl.objectString(extdata));
    //log.debug("shuffl.createDataFromCard, data: "+shuffl.objectString(extdata['shuffl:data']));
    log.debug("shuffl.createDataFromCard, id: "+extdata['shuffl:id']+", class: "+extdata['shuffl:class']);
    return extdata;
};

// ----------------------------------------------------------------
// Text editing support functions
// ----------------------------------------------------------------

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
        //, tooltip: 'Click to edit...'
        , tooltip: 'Doubleclick to edit...'
        , event:   'dblclick'
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
        //, tooltip: 'Click to edit...'
        , tooltip: 'Doubleclick to edit...'
        , event:   'dblclick'
        , submit: 'OK'
        , cancel: 'cancel'
        , cssclass: 'shuffl-blockedit'
        });
};

// ----------------------------------------------------------------
// Card workspace placement support functions
// ----------------------------------------------------------------

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

// ----------------------------------------------------------------
// Miscellaneous positioning support functions
// ----------------------------------------------------------------

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

// End.
