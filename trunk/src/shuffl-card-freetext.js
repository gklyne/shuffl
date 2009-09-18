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
 *  Add logging functions to global namespace, for convenience
 */
/*
log = {};
log.debug = MochiKit.Logging.logDebug   ;
log.info  = MochiKit.Logging.log    ;
log.warn  = MochiKit.Logging.logWarning ;
log.error = MochiKit.Logging.logError   ;

// Mochikit logging hack as default is no limit and default firebug off:
//MochiKit.Logging.logger.useNativeConsole = false;
//MochiKit.Logging.logger.maxSize = 2000;
*/
 
/**
 * create shuffl namespace
 */
if (typeof shuffl == "undefined") {
    alert("shuffl-card-freetext.js: shuffl.js must be loaded before this file");
}

// TODO: wrap these values and functions in an object

shuffl.card_freetext_data =
    { 'shuffl:title':   undefined
    , 'shuffl:tags':    [ undefined ]
    , 'shuffl:text':    undefined
    };

/**
 * jQuery base element for building new cards (used by shuffl.makeCard)
 */
shuffl.card_freetext_blank = jQuery(
    "<div class='shuffl-card' style='z-index:10;'>\n"+
    "  <chead>\n"+
    "    <chandle><c></c></chandle>" +
    "    <ctitle>card title</ctitle>\n"+
    "  </chead>\n"+
    "  <crow>\n"+
    "    <cbody>card_ZZZ body</cbody>\n"+
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
 * @return a jQuery object representing the new card.
 */
shuffl.makeFreetextCard = function (cardtype, cardcss, cardid, carddata) {
    //log.debug("shuffl.makeFreetextCard: "+cardtype+", "+cardcss+", "+cardid+", "+carddata);
    var card = shuffl.card_freetext_blank.clone();
    card.data('shuffl:class',  cardtype);
    card.data('shuffl:id',     cardid);
    card.data("shuffl:tojson", shuffl.jsonFreetextCard);
    card.attr('id', cardid);
    card.addClass(cardcss);
    var cardtext  = shuffl.get(carddata, 'shuffl:text',  carddata);
    var cardtags  = shuffl.get(carddata, 'shuffl:tags',  [cardid,cardtype]);
    var cardtitle = shuffl.get(carddata, 'shuffl:title', cardid+" - type "+cardtype);
    card.find("cident").text(cardid);           // Set card id text
    card.find("cclass").text(cardtype);         // Set card class/type text
    card.find("ctitle").text(cardtitle);        // Set card title text (editable) ..
    shuffl.lineEditable(card, card.find("ctitle"));
    card.find("cbody").html(cardtext);
    shuffl.blockEditable(card, card.find("cbody"));   // Set card body text (editable) ..
    card.find("ctags").text(cardtags.join(","));
    shuffl.lineEditable(card, card.find("ctags"));    // Set card tags (editable) ..
    //log.debug("makeCard: "+shuffl.elemString(card[0]));
    card.resizable( {alsoResize: 'div#'+cardid+' cbody'} );
    //
    //ÊNote: 'ghost' and 'alsoResize' seem to conflict
    // card.resizable( {ghost: true} );
    //
    // TODO: rather than alsoResize, try to use resize event to resize the 
    //       card body area.  Then we can also save the size and restore it 
    //       on reload.  Or test to see if we can manually change the size of 
    //       a resizable.
    //
    return card;
};

/**
 * Serializes a free-text card to JSON for storage
 * 
 * @param card      a jQuery object corresponding to the card
 * @return an object containing the card data
 */
shuffl.jsonFreetextCard = function (card) {
    var carddata = shuffl.card_freetext_data;
    carddata['shuffl:title'] = card.find("ctitle").text();
    carddata['shuffl:tags']  = jQuery.trim(card.find("ctags").text()).split(/[\s]*,[\s]*/);
    carddata['shuffl:text']  = card.find("cbody").html();
    return carddata;
};

/**
 *   Add new card type factories
 */
shuffl.addCardFactory("shuffl-freetext-yellow", "stock-yellow", shuffl.makeFreetextCard);
shuffl.addCardFactory("shuffl-freetext-blue",   "stock-blue",   shuffl.makeFreetextCard);
shuffl.addCardFactory("shuffl-freetext-green",  "stock-green",  shuffl.makeFreetextCard);
shuffl.addCardFactory("shuffl-freetext-orange", "stock-orange", shuffl.makeFreetextCard);
shuffl.addCardFactory("shuffl-freetext-pink",   "stock-pink",   shuffl.makeFreetextCard);
shuffl.addCardFactory("shuffl-freetext-purple", "stock-purple", shuffl.makeFreetextCard);

// End.
