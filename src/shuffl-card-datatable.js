/**
 * @fileoverview
 * Shuffl card plug-in for simple card containing tabular data.
 * 
 * The original intent was to have a collection card for the table, and 
 * represent each row as a separate card, but on closer examination this 
 * would create problems about when or which cards should be deleted, 
 * e.g., when the table is reloaded.  So, instead, I've gone for a table
 * resource, with the intent that, in due course, individual rows can be 
 * pulled out as separate cards when required.
 * 
 * Also, I think this approach is better suited for working with existing
 * research data sets - the card-first approach may be more appropriate for 
 * primary data capture activities.
 *  
 * @author Graham Klyne
 * @version $Id$
 */

// ----------------------------------------------------------------
// Globals and data
// ----------------------------------------------------------------
 
/**
 * Check shuffl namespace
 */
if (typeof shuffl == "undefined") 
{
    alert("shuffl-card-datatable.js: shuffl-base.js must be loaded first");
}
if (typeof shuffl.card == "undefined") 
{
    alert("shuffl-card-datatable.js: shuffl-cardhandlers.js must be loaded before this");
}

/**
 * Create namespace for this card type
 */
shuffl.card.datatable = {};

/**
 * Template for creating new card object for serialization
 */
shuffl.card.datatable.data =
    { 'shuffl:title':   undefined
    , 'shuffl:tags':    [ undefined ]
    , 'shuffl:data':    undefined
    };

/**
 * Temporary default data for testing...
 * TODO: reset this when done testing
 */
shuffl.card.datatable.table =
    [ [ "",     "col1", "col2", "col3", "col4_is_much_wider", "col5" ]
    , [ "row1", "1.1",  "1.2",  "1.3",  "1.4",                "1.5"  ]
    , [ "row2", "2.1",  "2.2",  "2.3",  "2.4",                "2.5"  ]
    , [ "row3", "3.1",  "3.2",  "3.3",  "3.4",                "3.5"  ]
    , [ "row4", "4.1",  "4.2",  "4.3",  "4.4",                "4.5"  ]
    , [ "row5", "5.1",  "5.2",  "5.3",  "5.4",                "5.5"  ]
    , [ "row6", "6.1",  "6.2",  "6.3",  "6.4",                "6.5"  ]
    , [ "row7", "7.1",  "7.2",  "7.3",  "7.4",                "7.5"  ]
    , [ "row8", "8.1",  "8.2",  "8.3",  "8.4",                "8.5"  ]
    , [ "End." ]
    ];

/**
 * jQuery base element for building new cards (used by shuffl.makeCard)
 */
shuffl.card.datatable.blank = jQuery(
    "<div class='shuffl-card-setsize' style='z-index:10;'>\n"+
    "  <chead>\n"+
    "    <chandle><c></c></chandle>" +
    "    <ctitle>card title</ctitle>\n"+
    "  </chead>\n"+
    "  <crow>\n"+
    "    <curi>card_ZZZ uri</curi>\n"+
    "    <button value='readcsv'>Read CSV data</button>\n"+
    "  </crow>\n"+
    "  <crow>\n"+
    "    <cbody>\n"+
    "      <table>\n"+
    "        <tr><th></th><th>col1</th><th>col2</th><th>col3</th></tr>\n"+
    "        <tr><td>row1</td><td>1.1</td><td>1.2</td><td>1.3</td></tr>\n"+
    "        <tr><td>row1</td><td>2.1</td><td>2.2</td><td>2.3</td></tr>\n"+
    "        <tr><td>End.</td></tr>\n"+
    "      </table>\n"+
    "    </cbody>\n"+
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
shuffl.card.datatable.newCard = function (cardtype, cardcss, cardid, carddata) {
    //log.debug("shuffl.card.datatable.newCard: "+
    //    cardtype+", "+cardcss+", "+cardid+", "+carddata);
    // Initialize the card object
    var card = shuffl.card.datatable.blank.clone();
    card.data('shuffl:class',  cardtype);
    card.data('shuffl:id',     cardid);
    card.data("shuffl:tojson", shuffl.card.datatable.serialize);
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
    var curi = card.find("curi");
    card.modelBind("shuffl:uri", shuffl.modelSetText(curi, true));
    shuffl.lineEditable(card, curi, shuffl.editSetModel(card, "shuffl:uri"));
    var cbody = card.find("cbody");
    card.modelBind("shuffl:table", shuffl.modelSetTable(cbody, 1));
    card.modelBind("shuffl:readcsv", function (event, data) {
        log.debug("Read "+data.newval+" into data table");
        jQuery.getCSV(data.newval, function (data, status) {
            ////log.debug("- data "+jQuery.toJSON(data));
            card.model("shuffl:table", data);
        });
    });
    card.find("button[value='readcsv']").click(function (eventobj) {
        log.debug("shuffl.card.datatable readcsv button clicked");
        card.model("shuffl:readcsv", card.model("shuffl:uri"));
    });
    // Initialize the model
    var cardtitle = shuffl.get(carddata, 'shuffl:title', cardid+" - type "+cardtype);
    var cardtags  = shuffl.get(carddata, 'shuffl:tags',  [cardid,cardtype]);
    var carduri   = shuffl.get(carddata, 'shuffl:uri',   "");
    var cardtable = shuffl.get(carddata, 'shuffl:table', shuffl.card.datatable.table);
    card.model("shuffl:title", cardtitle);
    card.model("shuffl:tags",  cardtags.join(","));
    card.model("shuffl:table", cardtable);
    card.model("shuffl:uri",   carduri);
    return card;
};

/**
 * Serializes a tabular data card to JSON for storage
 * 
 * @param card      a jQuery object corresponding to the card
 * @return          an object containing the card data
 */
shuffl.card.datatable.serialize = function (card) {
    var carddata = shuffl.card.datatable.data;
    carddata['shuffl:title'] = card.model("shuffl:title");
    carddata['shuffl:tags']  = shuffl.makeTagList(card.model("shuffl:tags"));
    carddata['shuffl:uri']   = card.model("shuffl:uri");
    carddata['shuffl:table'] = card.model("shuffl:table");
    return carddata;
};

/**
 *   Add new card type factories
 */
shuffl.addCardFactory("shuffl-datatable-yellow", "stock-yellow", shuffl.card.datatable.newCard);
shuffl.addCardFactory("shuffl-datatable-blue",   "stock-blue",   shuffl.card.datatable.newCard);
shuffl.addCardFactory("shuffl-datatable-green",  "stock-green",  shuffl.card.datatable.newCard);
shuffl.addCardFactory("shuffl-datatable-orange", "stock-orange", shuffl.card.datatable.newCard);
shuffl.addCardFactory("shuffl-datatable-pink",   "stock-pink",   shuffl.card.datatable.newCard);
shuffl.addCardFactory("shuffl-datatable-purple", "stock-purple", shuffl.card.datatable.newCard);

// End.
