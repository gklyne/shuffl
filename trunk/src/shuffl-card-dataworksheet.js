/**
 * @fileoverview
 * Shuffl card plug-in for a card containing a data worksheet.
 * 
 * This card is based on the "datatable" card, but expects a general 
 * spreadsheet worksheet from which label rows, data rows and data columns
 * can be selected from arbitrary locations.
 *  
 * @author Graham Klyne
 * @version $Id$
 * 
 * Coypyright (C) 2009, University of Oxford
 *
 * Licensed under the MIT License.  You may obtain a copy of the License at:
 *
 *     http://www.opensource.org/licenses/mit-license.php
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
 
// ----------------------------------------------------------------
// Globals and data
// ----------------------------------------------------------------
 
/**
 * Check shuffl namespace
 */
if (typeof shuffl == "undefined") 
{
    alert("shuffl-card-dataworksheet.js: shuffl-base.js must be loaded first");
}
if (typeof shuffl.card == "undefined") 
{
    alert("shuffl-card-dataworksheet.js: shuffl-cardhandlers.js must be loaded before this");
}

/**
 * Create namespace for this card type
 */
shuffl.card.dataworksheet = {};

/**
 * Template for creating new card object for serialization
 */
shuffl.card.dataworksheet.data =
    { 'shuffl:title':   undefined
    , 'shuffl:tags':    [ undefined ]
    , 'shuffl:uri':     undefined
    , 'shuffl:table':   undefined
    };

/**
 * Temporary default data for testing...
 * TODO: reset this when done testing
 */
shuffl.card.dataworksheet.table = [ [] ];

/**
 * jQuery base element for building new cards (used by shuffl.makeCard)
 */
shuffl.card.dataworksheet.blank = jQuery(
    "<div class='shuffl-card-setsize shuffl-series' style='z-index:10;'>\n"+
    "  <chead>\n"+
    "    <chandle><c></c></chandle>" +
    "    <ctitle>card title</ctitle>\n"+
    "  </chead>\n"+
    "  <crow>\n"+
    "    <curi>card_ZZZ uri</curi>\n"+
    "  </crow>\n"+
    "  <crow>\n"+
    "    <cbody class='shuffl-nodrag'>\n"+
    "      <table>\n"+
    "        <tr><td></td><td>col1</td><td>col2</td><td>col3</td></tr>\n"+
    "        <tr><td>row1</td><td>1.1</td><td>1.2</td><td>1.3</td></tr>\n"+
    "        <tr><td>End.</td></tr>\n"+
    "      </table>\n"+
    "    </cbody>\n"+
    "  </crow>\n"+
    "  <cfoot>\n"+
    "    <ctagslabel>Tags: </ctagslabel><ctags>card_ZZZ tags</ctags>\n"+
    "  </cfoot>"+
    "</div>");

/**
 * Creates and return a new card instance.
 * 
 * @param cardtype      type identifier for the new card element
 * @param cardcss       CSS class name(s) for the new card element
 * @param cardid        local card identifier - a local name for the card, 
 *                      which may be combined with a base URI to form a URI 
 *                      for the card.
 * @param carddata      an object or string containing additional data used in 
 *                      constructing the body of the card.  This is either a 
 *                      string or an object structure with fields 
 *                      'shuffl:title', 'shuffl:tags' and 'shuffl:table'.
 * @return              a jQuery object representing the new card.
 */
shuffl.card.dataworksheet.newCard = function (cardtype, cardcss, cardid, carddata) {
    log.debug("shuffl.card.dataworksheet.newCard: "+
        cardtype+", "+cardcss+", "+cardid+", "+carddata);
    // Initialize the card object
    var card = shuffl.card.dataworksheet.blank.clone();
    card.data('shuffl:class',  cardtype);
    card.data('shuffl:id',     cardid);
    card.data("shuffl:tojson", shuffl.card.dataworksheet.serialize);
    card.attr('id', cardid);
    card.addClass(cardcss);
    card.find("cident").text(cardid);           // Set card id text
    card.find("cclass").text(cardtype);         // Set card class/type text
    card.data("resizeAlso", "cbody");
    card.resizable();
    // Set up model listener and user input handlers
    shuffl.bindLineEditable(card, "shuffl:title", "ctitle");
    shuffl.bindLineEditable(card, "shuffl:tags",  "ctags");
    shuffl.bindLineEditable(card, "shuffl:uri",   "curi");
    var cbody    = card.find("cbody");
    var updatefn = shuffl.card.dataworksheet.updatedata(card, cbody);
    card.modelBind("shuffl:table", function (_event, data)
    {
        log.debug("shuffl.card.dataworksheet: shuffl:table updated");
        card.data("shuffl:header_row",    0);
        card.data("shuffl:data_firstrow", 1);
        card.data("shuffl:data_lastrow",  0);
        updatefn(_event, undefined);
    });
    card.modelBind("shuffl:header_row",    updatefn);
    card.modelBind("shuffl:data_firstrow", updatefn);
    card.modelBind("shuffl:data_lastrow",  updatefn);
    // Initialize the model
    var cardtitle  = shuffl.get(carddata, 'shuffl:title',  cardid);
    var cardtags   = shuffl.get(carddata, 'shuffl:tags',   [cardtype]);
    var carduri    = shuffl.get(carddata, 'shuffl:uri',    "");
    var cardtable  = shuffl.get(carddata, 'shuffl:table',  shuffl.card.dataworksheet.table);
    var cardhrow   = shuffl.get(carddata, 'shuffl:header_row', 0);
    var cardfrow   = shuffl.get(carddata, 'shuffl:data_firstrow',  1);
    var cardlrow   = shuffl.get(carddata, 'shuffl:data_lastrow',  0);
    card.model("shuffl:title", cardtitle);
    card.model("shuffl:tags",  cardtags.join(","));
    card.model("shuffl:uri",   carduri);
    card.model("shuffl:header_row",    cardhrow);
    card.model("shuffl:data_firstrow", cardfrow);
    card.model("shuffl:data_lastrow",  cardlrow);
    card.model("shuffl:table",         cardtable);
    // Finally, set listener for changes to URI value to read new data
    // This comes last so that the setting of shuffl:uri (above) does not
    // trigger a read when initializing a card.
    card.modelBind("shuffl:uri", function (event, data) {
        log.debug("Read "+data.newval+" into data table");
        jQuery.getCSV(data.newval, function (data, status) {
            ////log.debug("- data "+jQuery.toJSON(data));
            card.model("shuffl:table", data);
        });
    });
    return card;
};

/**
 * Serializes a tabular data card to JSON for storage
 * 
 * @param card      a jQuery object corresponding to the card
 * @return          an object containing the card data
 */
shuffl.card.dataworksheet.serialize = function (card) {
    var carddata = shuffl.card.dataworksheet.data;
    carddata['shuffl:title'] = card.model("shuffl:title");
    carddata['shuffl:tags']  = shuffl.makeTagList(card.model("shuffl:tags"));
    carddata['shuffl:uri']   = card.model("shuffl:uri");
    carddata['shuffl:header_row']    = card.model("shuffl:header_row");
    carddata['shuffl:data_firstrow'] = card.model("shuffl:data_firstrow");
    carddata['shuffl:data_lastrow']  = card.model("shuffl:data_lastrow");
    carddata['shuffl:table']         = card.model("shuffl:table");
    return carddata;
};

/**
 * Helper function to update data labels and series values in model, using
 * dynamically set row values from the card model.
 * 
 * @param card      is the card object containing the table data for display.
 * @param cbody     is the card element where the table data is displayed.
 */
shuffl.card.dataworksheet.updatedata = function (card, cbody)
{
    function update(_event, _data)
    {
        ////log.debug("shuffl.card.dataworksheet.updatedata:update");
        // Set header row above table
        var table = card.model("shuffl:table");
        if (table)
        {
            var hrow = card.model("shuffl:header_row");
            var htbl = [ table[hrow] ].concat(table);
            cbody.table(htbl, 1);
            // Now set up graph labels and series data
            var options =
                { labelrow:   hrow
                , firstrow:   card.model("shuffl:data_firstrow")
                , lastrow:    card.model("shuffl:data_lastrow")
                ////, datacols:   null
                ////, setlabels:  'shuffl:labels'
                ////, setseries:  'shuffl:series'
                };
            shuffl.modelSetSeries(card, options)(_event, {newval: table});
        };
    };
    return update;
};

/**
 *   Add new card type factories
 */
shuffl.addCardFactory("shuffl-dataworksheet-yellow", "stock-yellow", shuffl.card.dataworksheet.newCard);
shuffl.addCardFactory("shuffl-dataworksheet-blue",   "stock-blue",   shuffl.card.dataworksheet.newCard);
shuffl.addCardFactory("shuffl-dataworksheet-green",  "stock-green",  shuffl.card.dataworksheet.newCard);
shuffl.addCardFactory("shuffl-dataworksheet-orange", "stock-orange", shuffl.card.dataworksheet.newCard);
shuffl.addCardFactory("shuffl-dataworksheet-pink",   "stock-pink",   shuffl.card.dataworksheet.newCard);
shuffl.addCardFactory("shuffl-dataworksheet-purple", "stock-purple", shuffl.card.dataworksheet.newCard);

// End.
