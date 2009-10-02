/**
 * @fileoverview
 *  Shuffl card plug-in for simple card containing just free text.
 *  
 * @author Graham Klyne
 * @version $Id$
 */

// ----------------------------------------------------------------
// Globals and data
// ----------------------------------------------------------------
 
/**
 * create shuffl namespace
 */
if (typeof shuffl == "undefined") 
{
    alert("shuffl-card-freetext.js: shuffl-base.js must be loaded first");
}
if (typeof shuffl.card == "undefined") 
{
    alert("shuffl-card-freetext.js: shuffl-cardhandlers.js must be loaded before this");
}

/**
 * Create namespace for this card type
 */
shuffl.card.freetext = {};

/**
 * Template for creating new card object for serialization
 */
shuffl.card.freetext.data =
    { 'shuffl:title':   undefined
    , 'shuffl:tags':    [ undefined ]
    , 'shuffl:text':    undefined
    };

/**
 * jQuery base element for building new cards (used by shuffl.makeCard)
 */
shuffl.card.freetext.blank = jQuery(
    "<div class='shuffl-card-setsize' style='z-index:10;'>\n"+
    "  <chead>\n"+
    "    <chandle><c></c></chandle>" +
    "    <ctitle>card title</ctitle>\n"+
    "  </chead>\n"+
    "  <crow>\n"+
    "    <cbody class='shuffl-nodrag'>card_ZZZ body</cbody>\n"+
    "  </crow>\n"+
    "  <cfoot>\n"+
    "    <cident>card_ZZZ_ident</cident>:<cclass>card_ZZZ class</cclass>\n"+
    "    (<ctags>card_ZZZ tags</ctags>)\n"+
    "  </cfoot>"+
    "</div>");

// TODO: refactor this to run from full card object as converted from JSON
//       (to preserve prefixes, etc.)

/**
 * Creates and return a new card instance.
 * 
 * @param cardtype      type identifier for the new card element
 * @param cardcss       CSS class name(s) for the new card element
 * @param cardid        local card identifier - a local name for the card, which may be
 *                      combined with a base URI to form a URI for the card.
 * @param carddata      an object or string containing additional data used in constructing
 *                      the body of the card.  This is either a string or an object structure
 *                      with fields 'shuffl:title', 'shuffl:tags' and 'shuffl:text'.
 * @return              a jQuery object representing the new card.
 */
shuffl.card.freetext.newCard = function (cardtype, cardcss, cardid, carddata) {
    //log.debug("shuffl.card.freetext.newCard: "+
    //    cardtype+", "+cardcss+", "+cardid+", "+carddata);
    // Initialize the card object
    var card = shuffl.card.freetext.blank.clone();
    card.data('shuffl:class',  cardtype);
    card.data('shuffl:id',     cardid);
    card.data("shuffl:tojson", shuffl.card.freetext.serialize);
    card.attr('id', cardid);
    card.addClass(cardcss);
    card.find("cident").text(cardid);           // Set card id text
    card.find("cclass").text(cardtype);         // Set card class/type text
    card.data("resizeAlso", "cbody");
    card.resizable();
    // Set up model listener and user input handlers
    var ctitle = card.find("ctitle");
    card.modelBind("shuffl:title", shuffl.modelSetText(ctitle, true));
    shuffl.lineEditable(card, ctitle, shuffl.editSetModel(card, "shuffl:title"));
    var ctags = card.find("ctags");
    card.modelBind("shuffl:tags", shuffl.modelSetText(ctags, true));
    shuffl.lineEditable(card, ctags, shuffl.editSetModel(card, "shuffl:tags"));
    var cbody = card.find("cbody");
    card.modelBind("shuffl:text", shuffl.modelSetHtml(cbody, true));
    shuffl.blockEditable(card, cbody, shuffl.editSetModel(card, "shuffl:text"));
    // Initialize the model
    var cardtitle = shuffl.get(carddata, 'shuffl:title', cardid+" - type "+cardtype);
    var cardtags  = shuffl.get(carddata, 'shuffl:tags',  [cardid,cardtype]);
    var cardtext  = shuffl.get(carddata, 'shuffl:text',  "");
    card.model("shuffl:title", cardtitle);
    card.model("shuffl:tags",  cardtags.join(","));
    card.model("shuffl:text",  cardtext);
    return card;
};

/**
 * Serializes a free-text card to JSON for storage
 * 
 * @param card      a jQuery object corresponding to the card
 * @return an object containing the card data
 */
shuffl.card.freetext.serialize = function (card) {
    var carddata = shuffl.card.freetext.data;
    carddata['shuffl:title'] = card.model("shuffl:title");
    carddata['shuffl:tags']  = shuffl.makeTagList(card.model("shuffl:tags"));
    carddata['shuffl:text']  = card.model("shuffl:text");
    return carddata;
};

/**
 *   Add new card type factories
 */
shuffl.addCardFactory("shuffl-freetext-yellow", "stock-yellow", shuffl.card.freetext.newCard);
shuffl.addCardFactory("shuffl-freetext-blue",   "stock-blue",   shuffl.card.freetext.newCard);
shuffl.addCardFactory("shuffl-freetext-green",  "stock-green",  shuffl.card.freetext.newCard);
shuffl.addCardFactory("shuffl-freetext-orange", "stock-orange", shuffl.card.freetext.newCard);
shuffl.addCardFactory("shuffl-freetext-pink",   "stock-pink",   shuffl.card.freetext.newCard);
shuffl.addCardFactory("shuffl-freetext-purple", "stock-purple", shuffl.card.freetext.newCard);

// End.
