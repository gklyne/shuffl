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
 * 
 * 'shuffl:coluse' is a list of values:
 *   null         column ignored
 *   {axis: 'x1'} value used for 'x1' axis
 *   {axis: 'x2'} value used for 'x2' axis
 *   {axis: 'y1'} value plotted on 'y1' axis (against 'x1')
 *   {axis: 'y2'} value plotted on 'y2' axis (against 'x2')
 * 
 * For {axis: 'y1'} and {axis: 'y2'} values, additional fields may be defined:
 *   col: colour  colour of graph, as index number or CSS value
 *
 * TODO: style (line/bar/scatter/etc), transform (lin/log/etc)
 */
shuffl.card.dataworksheet.data =
    { 'shuffl:title':         undefined
    , 'shuffl:tags':          [ undefined ]
    , 'shuffl:uri':           undefined
    , 'shuffl:header_row':    0
    , 'shuffl:data_firstrow': 1
    , 'shuffl:data_lastrow':  0
    , 'shuffl:coluse':        undefined
    , 'shuffl:table':         undefined
    };

/**
 * Default table data
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
    "  </cfoot>\n"+
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
shuffl.card.dataworksheet.newCard = function (cardtype, cardcss, cardid, carddata)
{
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
        card.data("shuffl:coluse",        []);
        updatefn(_event, undefined);
    });
    card.modelBind("shuffl:header_row", function (_event, data)
    {
        log.debug("shuffl.card.dataworksheet: shuffl:data_firstrow updated: "+data.newval);
        card.data("shuffl:data_firstrow", data.newval+1);
        try
        {
            updatefn(_event, undefined);
        }
        catch (e)
        {
            log.error("Error "+e)
        }
    });
    card.modelBind("shuffl:data_firstrow", updatefn);
    card.modelBind("shuffl:data_lastrow",  updatefn);
    // Hook up the row-selection pop-up menu
    // TODO: extract to separate function
    // @@@ shuffl.card.dataworksheet.contextMenu(card, cbody);
    log.debug("shuffl.card.dataworksheet.newCard: connect row select menu");
    cbody.contextMenu('dataworksheet_rowSelectMenu', {
        menuStyle: {
            'class': 'shuffl-contextmenu',
            'font-weight': 'bold',
            'background-color': '#DDDDDD',
            'border': 'thin #666666 solid'
            },
        showOnClick: true,
        onContextMenu: function (event)
        {
            // TODO: is there a better way to find which row was clicked?
            cbody.find("tbody tr").each(function (rownum)
            {
                // this = dom element
                // TODO: is there a better way to test for ancestry?
                if (jQuery(this).find("*").index(event.target) >= 0) {
                    log.debug("- selected row number "+rownum);
                    card.data("rownum", rownum);
                };
            });
            return true;
        },
        bindings: {
            'dataworksheet_labelrow': function (_elem)
            {
                log.debug('Row select dataworksheet_labelrow');
                shuffl.card.dataworksheet.setRowNumber(card, 'shuffl:header_row');
            },
            'dataworksheet_firstrow': function (_elem)
            {
                log.debug('Row select dataworksheet_firstrow');
                shuffl.card.dataworksheet.setRowNumber(card, 'shuffl:data_firstrow');
            },
            'dataworksheet_lastrow': function (_elem)
            {
                log.debug('Row select dataworksheet_lastrow');
                shuffl.card.dataworksheet.setRowNumber(card, 'shuffl:data_lastrow');
            }
        }
    });
    // @@@
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
    // Note that setting the table resets the row values..
    card.model("shuffl:table",         cardtable);
    card.model("shuffl:header_row",    cardhrow);
    card.model("shuffl:data_firstrow", cardfrow); 
    card.model("shuffl:data_lastrow",  cardlrow);
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
shuffl.card.dataworksheet.serialize = function (card) 
{
    var carddata = jQuery.extend({}, shuffl.card.dataworksheet.data);
    carddata['shuffl:title'] = card.model("shuffl:title");
    carddata['shuffl:tags']  = shuffl.makeTagList(card.model("shuffl:tags"));
    carddata['shuffl:uri']   = card.model("shuffl:uri");
    carddata['shuffl:header_row']    = card.model("shuffl:header_row");
    carddata['shuffl:data_firstrow'] = card.model("shuffl:data_firstrow");
    carddata['shuffl:data_lastrow']  = card.model("shuffl:data_lastrow");
    carddata['shuffl:coluse']        = card.model("shuffl:coluse");
    carddata['shuffl:table']         = card.model("shuffl:table");
    return carddata;
};

/**
 * Helper function sets an indicated card model variable to the previously 
 * saved row number.
 * 
 * @param card      is the card object containing the table data for display.
 * @param modelvar  is the card model variable that is set to the row number.
 */
shuffl.card.dataworksheet.setRowNumber = function (card, modelvar)
{
    var rownum = card.data("rownum");
    log.debug("- menu select: modelvar "+modelvar+", row "+rownum);
    card.model(modelvar, rownum);
    card.model('shuffl:datamod', true);
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
            // Sort out header row and data
            var hrow = card.model("shuffl:header_row");
            var hdrs = table[hrow];
            // Set new table data
            var htbl = [ hdrs ].concat(table);
            cbody.table(htbl, 1);
            // TODO: extract function + test case
            // @@@ datarows = shuffl.card.dataworksheet.rowuse(card, table);
            // @@@ datarows.first ...
            // @@@ datarows.last  ...
            // Sort out first and last data rows
            var frow = card.model("shuffl:data_firstrow");
            var lrow = card.model("shuffl:data_lastrow");
            if (lrow <= 0) { lrow = table.length-1; }
            if (frow > lrow)
            {
                frow = lrow;
                lrow = card.model("shuffl:data_firstrow");
            }
            // TODO: Extract function + test case
            // @@@ coluse = shuffl.card.dataworksheet.coluse(card, hdrs);
            // Sort out column usage
            var coluse   = card.model("shuffl:coluse");
            ////log.debug("- coluse "+jQuery.toJSON(coluse));
            if (!coluse || !coluse.length)
            {
                ////log.debug("- coluse default");
                coluse = [];
                var nxtuse = {axis: 'x1'};
                for (var i = 0 ; i < hdrs.length ; i++)
                {
                    if (hdrs[i])
                    {
                        coluse.push(nxtuse);
                        nxtuse = {axis: 'y1'};
                    }
                    else
                    {
                        coluse.push(null);
                    }
                };
            };
            // @@@
            // TODO: extract function + test case
            // @@@ datacols = shuffl.card.dataworksheet.datacols(card, coluse);
            var x1 = undefined;
            for (i=0 ; i<coluse.length ; i++)
            {
                if (coluse[i] && coluse[i].axis == 'x1') { x1 = i; };
            };
            var datacols = [];
            for (i=0 ; i<coluse.length ; i++)
            {
                if (coluse[i] && coluse[i].axis == 'y1')
                {
                    datacols.push([x1,i]);
                }
            };
            // @@@
            // Reflect this in the display:
            // unselect out-of-range rows and columns
            // @@@ shuffl.card.dataworksheet.???(cbody, datarows, datacols);
            log.debug("- datarows "+frow+", "+lrow);
            log.debug("- coluse   "+jQuery.toJSON(coluse));
            log.debug("- datacols "+jQuery.toJSON(datacols));
            cbody.find("tbody tr").each(function (rownum)
            {
                // this = dom element
               var trelem = jQuery(this);
                if (rownum >= frow && rownum <= lrow)
                {
                    // In row range: test column
                    trelem.removeClass("shuffl-deselected");
                    trelem.find("td").each(function (colnum)
                    {
                        ////log.debug("- colnum "+colnum+", coluse "+coluse[colnum]);
                        var tdelem = jQuery(this);
                        if (coluse[colnum])
                        {
                            tdelem.removeClass("shuffl-deselected");
                        }
                        else
                        {
                            tdelem.addClass("shuffl-deselected");
                        };
                    });
                } 
                else 
                {
                    // Out of row range
                    trelem.addClass("shuffl-deselected");
                };
            });
            // @@@
            // Now set up graph labels and series data
            var options =
                { labelrow:   hrow
                , firstrow:   frow
                , lastrow:    lrow
                , datacols:   datacols
                ////, setlabels:  'shuffl:labels'
                ////, setseries:  'shuffl:series'
                };
            shuffl.modelSetSeries(card, options)(_event, {newval: table});
        };
    };
    return update;
};

/**
 * Add row-selectr menu to main workspace
 */
jQuery(document).ready(function() 
{
    var rowSelectMenu = 
        "  <div class='contextMenu' id='dataworksheet_rowSelectMenu' style='display:none;'>\n"+
        "    <ul>\n"+
        "      <li id='dataworksheet_labelrow'>Label row</li>\n"+
        "      <li id='dataworksheet_firstrow'>First data row</li>\n"+
        "      <li id='dataworksheet_lastrow'>Last data row</li>\n"+
        "    </ul>\n"+
        "  </div>\n";
    jQuery("body").append(rowSelectMenu);
});

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
