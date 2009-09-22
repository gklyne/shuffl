/**
 * @fileoverview
 *  Shuffl card plug-in for data upload card.  Initially, this card displays a
 *  form for uploading a data file.  When a file is selected, the data is
 *  uploaded and stored as an Atom Item, and the card changes to a reference
 *  to that data that can be linked to other cards (e.g. visualization).
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
    alert("shuffl-card-dataupload.js: shuffl-base.js must be loaded before this file");
}

// TODO: wrap these values and functions in an object

shuffl.card_dataupload_data =
    { 'shuffl:title':     undefined
    , 'shuffl:tags':      [ undefined ]
    , 'shuffl:file':      undefined
    , 'shuffl:basepath':  undefined
    , 'shuffl:baseuri':   undefined
    };

/**
 * jQuery base element for building new cards (used by shuffl.makeCard)
 */
shuffl.card_dataupload_blank = jQuery(
    "<div class='shuffl-card-dialog' style='z-index:10;'>\n"+
    "  <chead>\n"+
    "    <chandle><c></c></chandle>" +
    "    <ctitle>card title</ctitle>\n"+
    "  </chead>\n"+
/*
    "  <div class='card_dataupload_form' style='display: none;'>\n"+
    "      <fieldset>\n"+
    "        <legend>Select file to upload</legend>\n"+
    "        <crow>\n"+
    "          <label for='upload_file'>File:</label>\n"+
    "          <input type='file' name='upload_file' id='upload_file' class='text ui-widget-content ui-corner-all' size='80'/>\n"+
    "        </crow>\n"+
    "        <crow>\n"+
    "          <button type='upload'>Upload</button>\n"+
    "          <button type='cancel'>Cancel</button>\n"+
    "        </crow>\n"+
    "      </fieldset>\n"+
    "  </div>\n"+
*/
    "  <div class='card_dataupload_data'>\n"+
    "    <crow>File:      <cfile>(file)</cfile></crow>\n" +
    "    <crow>URI:       <curi>(uri)</curi></crow>\n" +
    "    <crow>Base path: <cbasepath>(base path)</cbasepath></crow>\n" +
    "    <crow>Base URI:  <cbaseuri>(base URI)</cbaseuri></crow>\n" +
    "  </div>\n"+
    "  <cfoot>\n"+
    "    <cident>card_ZZZ_ident</cident>:<cclass>card_ZZZ class</cclass>\n"+
    "    (<ctags>card_ZZZ tags</ctags>)\n"+
    "  </cfoot>"+
    "</div>");

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
shuffl.makeDataUploadCard = function (cardtype, cardcss, cardid, carddata) {
    log.debug("shuffl.makeDataUploadCard: "+cardtype+", "+cardcss+", "+cardid+", "+carddata);
    var card = shuffl.card_dataupload_blank.clone();
    var updateCuri = function() {
        log.debug("- update curi: cfile "+card.find("cfile").text());
        log.debug("- update curi: cbaseuri "+card.find("cbaseuri").text());
        var u = jQuery.uri(card.find("cfile").text(), card.find("cbaseuri").text());
        card.find("curi").text(u.toString());
    };
    card.data('shuffl:class',  cardtype);
    card.data('shuffl:id',     cardid);
    card.data("shuffl:tojson", shuffl.jsonDataUploadCard);
    card.attr('id', cardid);
    card.addClass(cardcss);
    var cardtitle    = shuffl.get(carddata, 'shuffl:title',    cardid+" - type "+cardtype);
    var cardtags     = shuffl.get(carddata, 'shuffl:tags',     [cardid,cardtype]);
    var cardfile     = shuffl.get(carddata, 'shuffl:file',     "");
    // TODO: plug-in backend framework to provide mapping to file system
    var cardbasepath = shuffl.get(carddata, 'shuffl:basepath', shuffl.uriPath("/Users/graham/workspace/googlecode-shuffl/"));
    //var cardbaseuri  = shuffl.get(carddata, 'shuffl:baseuri',  jQuery.uri("../").toString());
    //var cardbaseuri  = shuffl.get(carddata, 'shuffl:baseuri',  jQuery.uri("..").toString());
    var cardbaseuri  = shuffl.get(carddata, 'shuffl:baseuri',  shuffl.uriBase(".."));
    //log.debug("- cardbasepath "+cardbasepath+", cardbaseuri "+cardbaseuri);
    card.find("cident").text(cardid);               // Set card id text
    card.find("cclass").text(cardtype);             // Set card class/type text
    card.find("ctitle").text(cardtitle);            // Set card title text (editable) ..
    shuffl.lineEditable(card, card.find("ctitle"));
    card.find("ctags").text(cardtags.join(","));    // Set card tags (editable) ..
    shuffl.lineEditable(card, card.find("ctags"));
    //log.debug("- 1");
    card.find("cfile").text(cardfile);
    shuffl.lineEditable(card, card.find("cfile"), updateCuri);
    //log.debug("- 2");
    card.find("cbasepath").text(cardbasepath);
    shuffl.lineEditable(card, card.find("cbasepath"));
    card.find("cbaseuri").text(cardbaseuri);
    shuffl.lineEditable(card, card.find("cbaseuri"), updateCuri);
    updateCuri();
    //card.resizable();
    //card.find("cfile").change(updateCuri);
    //card.find("cbaseuri").change(updateCuri);
    
    /* -----------------------
    // Set up for filename entry:
    card.find("div.card_dataupload_data").click(function(event) {
        log.debug("- card_dataupload_data clicked: "+card.find("cfile").text());
        //card.find("input#upload_file").val(jQuery(this).text());
        card.find("div.card_dataupload_form").show("normal");
    });
    card.find("input#upload_file").change(function (event) {
        // See http://groups.google.com/group/turbogears/browse_thread/thread/c186b1435683b09e
        var inp = jQuery(this);
        var fil = inp[0].value;
        log.debug("- file changed: "+fil);
        inp.data('fullpath', inp.val());
    });
    card.find("button[type='upload']").click(function(event) {
        card.find("div.card_dataupload_form").hide("normal");
        log.debug("- upload clicked: "+card.find("input#upload_file").data('fullpath'));
        card.find("cfile").text(card.find("input#upload_file").data('fullpath'));
    });
    card.find("button[type='cancel']").click(function(event) {
        card.find("div.card_dataupload_form").hide("normal");
    });
    ------------------------ */
    return card;
};

/**
 * Serializes a data-upload card to JSON for storage
 * 
 * @param card      a jQuery object corresponding to the card
 * @return an object containing the card data
 */
shuffl.jsonDataUploadCard = function (card) {
    var carddata = shuffl.card_dataupload_data;
    carddata['shuffl:title']    = card.find("ctitle").text();
    carddata['shuffl:tags']     = jQuery.trim(card.find("ctags").text()).split(/[\s]*,[\s]*/);
    carddata['shuffl:file']     = card.find("cfile").text();
    carddata['shuffl:uri']      = card.find("curi").text();
    carddata['shuffl:basepath'] = card.find("cbasepath").text();
    carddata['shuffl:baseuri']  = card.find("cbaseuri").text();
    return carddata;
};

/**
 *   Add new card type factory
 */
shuffl.addCardFactory("shuffl-dataupload", "stock-default", shuffl.makeDataUploadCard);

// End.
