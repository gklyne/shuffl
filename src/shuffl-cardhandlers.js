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
if (typeof shuffl == "undefined") 
{
    alert("shuffl-cardhndlers.js: shuffl-base.js must be loaded first");
};
if (typeof shuffl.card == "undefined") 
{
    shuffl.card = {};                   // Namespace for card types
};
if (typeof shuffl.CardFactoryMap == "undefined") 
{
    shuffl.CardFactoryMap = {};         // Initial empty card factory map
};
if (typeof shuffl.idnext == "undefined") 
{
    shuffl.idnext         = 100;        // Counter for unique id generation    
};
if (typeof shuffl.idpref == "undefined") 
{
    shuffl.idpref         = "card_";   // Prefix for unique id generation    
};

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
shuffl.addCardFactory = function (cardtype, cssclass, factory) 
{
    shuffl.CardFactoryMap[cardtype] = { cardcss: cssclass, cardfactory: factory };
};

/**
 * Return factory for creating new cards given a card type/class.
 */
shuffl.getCardFactory = function (cardtype) 
{
    ////log.debug("getCardFactory: cardclass '"+cardclass+"'");
    ////log.debug("getCardFactory: cardclass "+jQuery.trim(cardclass));
    ////log.debug("cardFactory "+shuffl.objectString(shuffl.cardFactory));
    var factory = shuffl.CardFactoryMap[jQuery.trim(cardtype)];
    if ( factory == undefined) 
    {
        log.warn("getCardFactory: unrecognized card type: "+cardtype+", returning default factory");
        factory = mk.partial(shuffl.card.defaultcard.newCard, cardtype, "stock-default");
    } 
    else
    {
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

shuffl.card.defaultcard = {};

shuffl.card.defaultcard.data =
    { 'shuffl:title':   undefined
    };

/**
 * jQuery base element for building new default cards
 */
shuffl.card.defaultcard.blank = jQuery(
    "<div class='shuffl-card-autosize' style='z-index:10;'>\n"+
    "  <chead>\n"+
    "    <chandle><c></c></chandle>" +
    "    <ctitle>card title</ctitle>\n"+
    "  </chead>\n"+
    "</div>");

/**
 * Default card factory: title only
 * 
 * @param cardtype      type identifier for the new card element
 * @param cardcss       CSS class name(s) added to the new card element
 * @param cardid        local card identifier - a local name for the card, 
 *                      which may be combined with a base URI to form a URI
 *                      for the card.
 * @param carddata      an object or string containing additional data used in 
 *                      constructing the body of the card.  
 *                      This is an object structure with field 'shuffl:title'.
 * @return              a jQuery object representing the new card.
 */
shuffl.card.defaultcard.newCard = function (cardtype, cardcss, cardid, carddata) 
{
    //log.debug("shuffl.shuffl.card.defaultcard.newCard: "+
    //    cardid+", "+shuffl.objectString(carddata));
    var card = shuffl.card.defaultcard.blank.clone();
    card.model('shuffl:class',  cardtype);
    card.model('shuffl:id',     cardid);
    card.model("shuffl:tojson", shuffl.card.defaultcard.serialize);
    card.attr('id', cardid);
    card.addClass(cardcss);
    // Set up model listener and user input handlers
    var ctitle = card.find("ctitle");
    card.modelBind("shuffl:title", 
        shuffl.modelSetText(ctitle));
    shuffl.lineEditable(card, ctitle, 
        shuffl.editSetModel(card, "shuffl:title"));
    // Initialze card model
    var cardtitle = shuffl.get(
        carddata, 'shuffl:title', cardid+" - class "+cardtype);
    card.model("shuffl:title", cardtitle);
    return card;
};

/**
 * Serializes a default card to JSON for storage
 * 
 * @param card      a jQuery object corresponding to the card
 * @return an object containing the card data
 */
shuffl.card.defaultcard.serialize = function (card) 
{
    var carddata = shuffl.card.defaultcard.data;
    carddata['shuffl:title'] = card.model("shuffl:title");
    return carddata;
};

// ----------------------------------------------------------------
// Stockpile and card support functions
// ----------------------------------------------------------------

/**
 * Generate a new identifier string using a supplied prefix
 */
shuffl.makeId = function(pref) 
{
    shuffl.idnext++;
    return pref+shuffl.idnext;
};

/**
 * Return identifier string based on last value returned (used for testing)
 */
shuffl.lastId = function(pref) 
{
    return pref+shuffl.idnext;
};

/**
 * Update ID generator if necessary to prevent clash with loaded card.
 */
shuffl.loadId = function(cardid) 
{
    var l = shuffl.idpref.length;
    if (cardid.slice(0,l) == shuffl.idpref) 
    {
        var n = parseInt(cardid.slice(l));
        if (typeof n == "number" && shuffl.idnext < n) 
        {
            log.debug("Load card id "+cardid+", "+n);
            shuffl.idnext = n;
        }
    };
};

/**
 * Draggable options for stockpiles
 */
shuffl.stockDraggable = 
{ 
    opacity: 0.8, 
    revert: true, 
    revertDuration: 0, 
    stack: { group: '.shuffl-card', min: 10 } 
};

/**
 * Draggable options for cards
 */
shuffl.cardDraggable = 
{ 
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
shuffl.createStockpile = function(sid, sclass, slabel, stype) 
{
    // Create new blank stockpile element
    var stockpile = shuffl.stockpile_blank.clone();
    stockpile.attr('id', sid);
    stockpile.addClass(sclass);
    stockpile.text(slabel);
    stockpile.data( 'makeCard', shuffl.createCardFromStock );
    stockpile.data( 'CardType', stype);
    stockpile.draggable(shuffl.stockDraggable);
    log.debug("- append to stockbar");
    jQuery('#stockbar').append(shuffl.stockpile_space.clone())
    jQuery('#stockbar').append(stockpile);
    return stockpile;
};

/**
 * Function attached to stockpile to liberate a new card from that pile
 */
shuffl.createCardFromStock = function (stockpile) { 
    log.debug("makeCard "+stockpile);
    var cardtype = stockpile.data("CardType");
    var cardid = shuffl.makeId(shuffl.idpref);
    // log.debug("cardclass '"+cardclass+"'");
    var newcard = shuffl.getCardFactory(cardtype)(cardid, {});
    newcard.addClass('shuffl-card');
    // Initialize card workspace parameters
    // See: http://code.google.com/p/shuffl/wiki/CardReadWriteOptions
    // Use id of new card as hint for file name
    newcard.data('shuffl:dataref', cardid+".json");
    newcard.data('shuffl:datauri', undefined);
    newcard.data('shuffl:dataRW',  true);
    newcard.data('shuffl:datamod', true);
    // Instantiate external data values
    var extdata = {};
    jQuery.extend(true, extdata, shuffl.ExternalCardData);  // Deep copy..
    extdata['shuffl:id']    = cardid;
    extdata['shuffl:class'] = cardtype;
    newcard.data('shuffl:external', extdata);
    return newcard;
};

/**
 * Create a new card using a supplied layout value and card data
 * 
 * Note: layout provides default values for card id and class; the primary 
 * source is the card data.
 * 
 * Note: the supplied card data is assumed to be initialized with data
 * reference, data URI and data writeable values.
 * 
 * @param cardid    the new card identifier
 * @param cardclass a card class (factory type, not CSS class) for the new card
 * @param origdata  structure indicating attributes of the card, as well as
 *                  card-type-dependent data values.
 * @return          a jQuery object representing the new card.
 */
shuffl.createCardFromData = function (cardid, cardclass, origdata) 
{ 
    //log.debug("shuffl.createCardFromData, card data: "+shuffl.objectString(origdata));
    var copydata = {};  // Make deep copy..
    jQuery.extend(true, copydata, origdata);
    var carddata = copydata['shuffl:data'];  // Card-type specific data
    // Create card using card factory
    //log.debug("shuffl.createCardFromData, cardid: "+cardid+", cardclass: "+cardclass);
    var newcard   = shuffl.getCardFactory(cardclass)(cardid, carddata);
    newcard.addClass('shuffl-card');
    // Initialize card workspace parameters
    // See: http://code.google.com/p/shuffl/wiki/CardReadWriteOptions
    newcard.data('shuffl:dataref', copydata['shuffl:dataref']);
    newcard.data('shuffl:datauri', copydata['shuffl:datauri']);
    newcard.data('shuffl:dataRW',  copydata['shuffl:dataRW']);
    newcard.data('shuffl:datamod', false);
    // Save full copy of external data in jQuery card object
    newcard.data('shuffl:external', copydata);
    return newcard;
};

/**
 * Create and place a new card using a supplied layout value and card data
 * 
 * Note: layout provides default values for card id and class; the primary 
 * source is the card data.
 * 
 * @param layout    structure indicating where and how the card appears in
 *                  the shuffl workspace, and a URI reference to where the card 
 *                  data (purports) to come from.
 * @param data      structure indicating attributes of the card, as well as
 *                  card-type-dependent data values.
 */
shuffl.placeCardFromData = function (layout, data) 
{ 
    //log.debug("shuffl.placeCardFromData, layout:    "+shuffl.objectString(layout));
    //log.debug("shuffl.placeCardFromData, card data: "+shuffl.objectString(data));
    var cardid    = shuffl.get(data, 'shuffl:id',    layout['id']);
    var cardclass = shuffl.get(data, 'shuffl:class', layout['class']);
    // Create card using card factory
    //log.debug("shuffl.placeCardFromData, cardid: "+cardid+", cardclass: "+cardclass);
    var newcard = shuffl.createCardFromData(cardid, cardclass, data);
    shuffl.loadId(cardid);
    //�Place card on layout
    var cardsize = layout['size'] || shuffl.defaultSize;
    shuffl.placeCard(jQuery('#layout'), newcard, 
        layout['pos'], cardsize, layout['zindex']);
};

/**
 * Create an external representation object for a card
 * 
 * Note: JSON is represented internally as a Javascript structure, and is
 * serialized on transmission by ther jQuery AJAX components.
 */
shuffl.createDataFromCard = function (card) 
{ 
    var extdata = card.data('shuffl:external');
    extdata['shuffl:id']    = card.data('shuffl:id');
    extdata['shuffl:class'] = card.data('shuffl:class');
    extdata['shuffl:data']  = card.data('shuffl:tojson')(card);
    //log.debug("shuffl.createDataFromCard, extdata: "+shuffl.objectString(extdata));
    //log.debug("shuffl.createDataFromCard, data: "+shuffl.objectString(extdata['shuffl:data']));
    //log.debug("shuffl.createDataFromCard, id: "+extdata['shuffl:id']+", class: "+extdata['shuffl:class']);
    return extdata;
};

/**
 * Return tags from card as list
 * 
 * @param card      card from which tags are returned.
 * @param selector  jQuery selector for element containing tag list
 */
shuffl.getTagList = function (card, selector)
{
    //log.debug("shuffl.getTagList "+selector);
    return shuffl.makeTagList(card.find(selector).text());
};

/**
 * Make list of tags from string
 * 
 * @param text      string containing a comma-separated list of tag names
 * @return          an array of tag names
 */
shuffl.makeTagList = function (ttext)
{
    //log.debug("shuffl.makeTagList "+ttext);
    return jQuery.trim(ttext).split(/[\s]*,[\s]*/);
};

// ----------------------------------------------------------------
// Card MVC support functions
// ----------------------------------------------------------------

/**
 * Return a model-change event handler that sets the text value in a supplied
 * field to a placeholder value if the model value is empty.
 * 
 * @param fieldobj  is a jQuery object corresponding to a field that is to be 
 *                  updated with new values assigned to a model element.
 * @param holder    is a placeholder string which, if defined, is displayed 
 *                  if the model value is an empty string.
 * @param thencall  if defined, this is an additional function to call
 *                  after the card text has been updated.
 * @return          a function to be used as the update handler for a model
 *                  field.
 * 
 * Example:
 *    card.modelBind("shuffl:title", modelSetText(card.find("ctitle"),"[edit]"));
 */
shuffl.modelSetText = function (fieldobj, holder, thencall)
{
    function setTextOrPlaceHolder(event, data) {
        var newtext = jQuery.trim(data.newval);
        fieldobj.text(newtext || holder);
        if (thencall !== undefined) { thencall(event, data); };
    }
    if (holder === true)      { holder = shuffl.PlaceHolder; };
    if (holder === undefined) { holder = ""; };
    return setTextOrPlaceHolder;
};

/**
 * Return a model-change event handler that sets the text value in a supplied
 * field.
 * 
 * @param fieldobj  is a jQuery object correspondingto a field that is to be 
 *                  updated with new values assigned to a model element.
 * @param thencall  if defined, this is an additional function to call
 *                  after the card text has been updated.
 * @return          a function to be used as the update handler for a model
 *                  field.
 * 
 * Example:
 *    card.modelBind("shuffl:title", modelSetText(card.find("ctitle"));
 */
shuffl.modelSetTextNoPlaceHolder = function (fieldobj, thencall)
{
    function setText(event, data) {
        fieldobj.text(data.newval);
        if (thencall !== undefined) { thencall(event, data); };
    }
    return setText;
};

/**
 * Return a model-change event handler that sets the innerHTML value in a 
 * supplied field.
 * 
 * @param fieldobj  is a jQuery object correspondingto a field that is to be 
 *                  updated with new values assigned to a model element.
 * @param thencall  if defined, this is an additional function to call
 *                  after the card text has been updated.
 * @return          a function to be used as the update handler for a model
 *                  field.
 * 
 * Example:
 *    card.modelBind("shuffl:title", modelSetHTML(card.find("ctitle"));
 */
shuffl.modelSetHtml = function (fieldobj, thencall)
{
    function setHtml(event, data) {
        fieldobj.html(data.newval);
        if (thencall !== undefined) { thencall(event, data); };
    }
    return setHtml;
};

/**
 * Return an edit-completion function that sets a model value on a given card
 * 
 * @param card      is a jQuery card object whose model is linked to an 
 *                  editable field.
 * @param name      is the name of the field to be updated with changes to the
 *                  editable field.
 * @return          a function to be used as an edit-completion function.
 * 
 * Example:
 *    shuffl.lineEditable(card, ctitle, shuffl.editSetModel(card, "shuffl:title")); 
 */
shuffl.editSetModel = function (card, name)
{
    function setModel(val, settings) {
        log.debug("shuffl.editSetModel: "+val);
        card.model(name, val);
    };
    return setModel;
};


// ----------------------------------------------------------------
// Text editing support functions
// ----------------------------------------------------------------

/**
 * Placeholder string (if no text on display, it's not possible to click
 * on it to edit in a value.)
 */
shuffl.PlaceHolder = "(Double-click to edit)"

/**
 * Compose a supplied completion function with logic to flag a card as 
 * having been modified.
 * 
 * cf. http://code.google.com/p/shuffl/wiki/CardReadWriteOptions
 * 
 * @param card      jQuery card object to be flagged as modified.
 * @param fn        completion function to be called to process result
 *                  values before they are used to update the card content.
 */
shuffl.modifiedCard = function(card, fn) 
{
    function editDone() {
        log.debug("shuffl.midifiedCard:editDone");
        card.data('shuffl:datamod', true);
        return fn.apply(this, arguments);
    };
    return editDone;
}

/**
 * Function called before a text element is edited with a copy of the text,
 * and returning a modified version.  In this case, the raw text is extracted.
 */
shuffl.initEditText = function(value) 
{
    log.debug("shuffl.initEditText: "+value);
    return value.replace(/<br[^>]*>/g, "\n\n").replace(/&lt;/g, "<");
};

/**
 * Function called when done editing text: newlines are converted back to <br/>
 * and '<' to '&lt;.
 */
shuffl.doneEditText = function(value, settings) 
{
    log.debug("shuffl.doneEditText: "+value);
    return value.replace(/</g,"&lt;").replace(/\n\n/g, "<br/>");
};

/**
 * Function that can be used for submitting new edit text unchanged.
 */
shuffl.passEditText = function(value, settings)
{
    log.debug("shuffl.passEditText: "+value);
    return value;
};

/**
 * Set up single line inline edit field
 * 
 * See: http://www.appelsiini.net/projects/jeditable
 */
shuffl.lineEditable = function (card, field, callback) 
{
    field.editable(shuffl.modifiedCard(card, shuffl.passEditText), 
        { data: shuffl.passEditText
        , onblur: 'submit'
        //, tooltip: 'Click to edit...'
        , tooltip: 'Double-click to edit...'
        , placeholder: shuffl.PlaceHolder
        , event:   'dblclick'
        , submit: 'OK'
        , cancel: 'cancel'
        , cssclass: 'shuffl-lineedit'
        , width: 400
        , callback: callback    // (new inerHTML, settings)
        });
};

/**
 * Set up multiline inline edit field
 * 
 * See: http://www.appelsiini.net/projects/jeditable
 */
shuffl.blockEditable = function (card, field, callback) 
{
    field.editable(shuffl.modifiedCard(card, shuffl.doneEditText), 
        { data: shuffl.initEditText
        , type: 'textarea'
        , onblur: 'submit'
        //, tooltip: 'Click to edit...'
        , tooltip: 'Double-click to edit...'
        , placeholder: shuffl.PlaceHolder
        , event:   'dblclick'
        , submit: 'OK'
        , cancel: 'cancel'
        , cssclass: 'shuffl-blockedit'
        , callback: callback    // (new inerHTML, settings)
        });
};

// ----------------------------------------------------------------
// Card workspace placement support functions
// ----------------------------------------------------------------

shuffl.defaultSize = {width:0, height:0};

/**
 * Returns a function that catches a resize event to resize specified 
 * sub-elements in sync with any changes the main card element.
 * 
 * @param card      card element jQuery object whose resize events are to 
 *                  be tracked.
 * @param selector  jQuery selector string for the sub-element to be resized 
 *                  with changes to the card element.
 * @return          a function that serves as a resize handler for the
 *                  selected sub-element.
 */
shuffl.resizeAlso = function (card, selector) 
{
    //log.debug("shuffl.resizeAlso "+selector);
    var elem = card.find(selector);
    if (elem.length == 1) {
        var dw = card.width() - elem.width();
        var dh = card.height() - elem.height();
        var handleResize = function (event, ui) 
        {
            // Track changes in width and height
            var c = jQuery(this);
            elem.width(c.width()-dw);
            elem.height(c.height()-dh);
        };
        return handleResize;
    };
    return undefined;
};

/**
 * Place card on the shuffl layout area
 * 
 * @param layout    the layout area where the card will be placed
 * @param card      the card to be placed
 * @param pos       the position at which the card is to be placed
 * @param size      the size for the created card (zero dimensions leave the
 *                  default values (e.g. from CSS) in effect).
 * @param zindex    the z-index for the created card; zero or undefined brings
 *                  the new card to the top of the display stack.
 */
shuffl.placeCard = function (layout, card, pos, size, zindex) 
{
    layout.append(card);
    var resizefn = shuffl.resizeAlso(card, card.data("resizeAlso"));
    if (resizefn) { card.bind('resize', resizefn); };
    card.css(pos).css('position', 'absolute');
    if (size.width > 0 || size.height > 0) 
    {
        if (size.width  > 0) { card.width(size.width);   };
        if (size.height > 0) { card.height(size.height); };
        if (resizefn) { resizefn.call(card, null, null); };
    };    
    // Make card draggable and to front of display
    card.draggable(shuffl.cardDraggable);
    if (zindex) 
    {
        card.css('zIndex', zindex)
    } 
    else 
    {
        shuffl.toFront(card);
    };
    // Click brings card back to top
    card.click( function () { shuffl.toFront(jQuery(this)); });
    // TODO: Consider making card-sized drag
};

/**
 * Create a new card where a stock pile has been dropped
 * 
 * @param frompile  the stock pile jQuery object from which a new card will
 *                  be derived
 * @param tolayout  the layout area jQuery obejct in which the new card will
 *                  be displayed.
 * @param pos       the position within the layout area where the new card 
 *                  will be displayed
 */
shuffl.dropCard = function(frompile, tolayout, pos) 
{
    log.debug("shuffl.dropCard: "+shuffl.objectString(pos));
    // Create card using stockpile card factory
    var newcard = frompile.data('makeCard')(frompile);
    //�Place card on layout
    pos = shuffl.positionRelative(pos, tolayout);
    pos = shuffl.positionRel(pos, { left:5, top:1 });   // TODO calculate this properly
    shuffl.placeCard(tolayout, newcard, pos, shuffl.defaultSize, 0);
};

/**
 * Move indicated element to front in its draggable group
 * 
 * Code adapted from jQuery
 */
shuffl.toFront = function (elem) 
{
    if (elem.data("draggable")) 
    {
        var opts = elem.data("draggable").options;
        var group = jQuery.makeArray(jQuery(opts.stack.group)).sort(function(a,b) 
            {
                return shuffl.parseInt(jQuery(a).css("zIndex"), 10, opts.stack.min) - 
                       shuffl.parseInt(jQuery(b).css("zIndex"), 10, opts.stack.min);
            });
        jQuery(group).each(function(i) 
            {
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
shuffl.positionRelative = function (pos, obj) 
{
    var base = obj.position();
    //log.debug("positionRelative: pos  "+pos.left+", "+pos.top);
    //log.debug("positionRelative: base "+base.left+", "+base.top);
    return shuffl.positionRel(pos, base);
};

/**
 * Calculate absolute position supplied as offset from object
 */
shuffl.positionAbsolute = function (off, obj) 
{
    var base = obj.position();
    //log.debug("positionAbsolute: off  "+off.left+", "+off.top);
    //log.debug("positionAbsolute: base "+base.left+", "+base.top);
    return shuffl.positionAbs(base, off);
};

/**
 * Calculate supplied absolute position as offset from supplied object
 */
shuffl.positionRel = function (pos, base) 
{
    return { left: pos.left-base.left, top: pos.top-base.top };
};

/**
 * Calculate absolute position from supplied base and offset
 */
shuffl.positionAbs = function (base, off) 
{
    return { left: base.left+off.left, top: base.top+off.top };
};

// End.
