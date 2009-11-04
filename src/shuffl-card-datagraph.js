/**
 * @fileoverview
 * Shuffl card plug-in for a card graphing tabular data.
 * 
 * This plugin is initially based on the shuffl-card-datatable plugin, except
 * that the display area is rendered using 'flot' rather than as an HTML table.
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
    alert("shuffl-card-datagraph.js: shuffl-base.js must be loaded first");
}
if (typeof shuffl.card == "undefined") 
{
    alert("shuffl-card-datagraph.js: shuffl-cardhandlers.js must be loaded before this");
}

/**
 * Create namespace for this card type
 */
shuffl.card.datagraph = {};

/**
 * Template for initializing a card model, and 
 * creating new card object for serialization.
 */
shuffl.card.datagraph.datamap =
    { 'shuffl:title':     { def: '@id' }
    , 'shuffl:tags':      { def: '@tags', type: 'array' }
    , 'shuffl:source_id': { def: undefined }
    , 'shuffl:labels':    { def: undefined }
    , 'shuffl:series':    { def: undefined }
    , 'shuffl:dataminy':  { def: undefined }
    , 'shuffl:datamaxy':  { def: undefined }
    };

/*
 * Temporary default data for testing...
 * TODO: reset this when done testing
 */
shuffl.card.datagraph.table =
    [ [ "", "series1", "series2", "series3", "series4" ] ];

(function (table)
{
    function limit(val,min,max)
    {
        if (val<min) { return null; };
        if (val>max) { return null; };
        return val;
    }
    for (var x = 0.0 ; x <= 10.0 ; x = x+0.1) 
    {
        var x4 = Math.abs((x-5.0)*4);
        table.push(
          [ x
          , Math.sin(x)
          , Math.cos(x)
          , limit(Math.tan(x)*0.2, -4.0, +4.0)
          , (x4>0.0 ? Math.sin(x4)/x4 : 1.0)
          ]);
    };
})(shuffl.card.datagraph.table);

/**
 * jQuery base element for building new cards (used by shuffl.makeCard)
 */
shuffl.card.datagraph.blank = jQuery(
    "<div class='shuffl-card-setsize' style='z-index:10;'>\n"+
    "  <chead>\n"+
    "    <chandle><c></c></chandle>" +
    "    <ctitle>card title</ctitle>\n"+
    "  </chead>\n"+
    "  <crow>\n"+
    "    <cbody class='shuffl-nodrag'>\n"+
    "      <div style='width:98%; height:98%;'/>\n"+
    "    </cbody>\n"+
    "  </crow>\n"+
    "  <crow style='width: 100%;'>\n"+
    "    <span style='display: inline-block; width: 45%;'>min Y: <cdataminy style='display: inline-block; width: 20%;'>-100.0</cdataminy></span>\n"+
    "    <span style='display: inline-block; width: 45%;'>max Y: <cdatamaxy style='display: inline-block; width: 20%;'> 100.0</cdatamaxy></span>\n"+
    "  </crow>\n"+
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
 * @param cardid        local card identifier - a local name for the card, 
 *                      which may be combined with a base URI to form a URI 
 *                      for the card.
 * @param carddata      an object or string containing additional data used in 
 *                      constructing the body of the card.  This is either a 
 *                      string or an object structure with fields 
 *                      'shuffl:title', 'shuffl:tags', 'shuffl:labels' and 
 *                      'shuffl:series'.
 * @return              a jQuery object representing the new card.
 */
shuffl.card.datagraph.newCard = function (cardtype, cardcss, cardid, carddata) 
{
    ////log.debug("shuffl.card.datagraph.newCard: "+cardtype+", "+cardcss+", "+cardid);
    ////log.debug("- data: "+jQuery.toJSON(carddata));
    // Initialize the card object
    var card = shuffl.card.datagraph.blank.clone();
    card.data('shuffl:class',  cardtype);
    card.data('shuffl:id',     cardid);
    card.data("shuffl:tojson", shuffl.card.datagraph.serialize);
    card.attr('id', cardid);
    card.addClass(cardcss);
    card.find("cident").text(cardid);       // Set card id text
    card.find("cclass").text(cardtype);     // Set card class/type text
    card.data("resizeAlso", "cbody");
    card.resizable();
    // Set up function to (re)draw the card when placed or resized
    card.data("redrawFunc", shuffl.card.datagraph.redraw(card));
    // Set up card as drop-target for data table
    shuffl.dropTarget(card, '.shuffl-series', 'shuffl:source');
    // Set up model listener and user input handlers
    shuffl.bindLineEditable(card, "shuffl:title", "ctitle");
    shuffl.bindLineEditable(card, "shuffl:tags",  "ctags");
    shuffl.bindFloatEditable(card, "shuffl:dataminy", "cdataminy", 2,
        shuffl.card.datagraph.redraw(card));
    shuffl.bindFloatEditable(card, "shuffl:datamaxy", "cdatamaxy", 2,
        shuffl.card.datagraph.redraw(card));
    card.modelBind("shuffl:labels", shuffl.card.datagraph.redraw(card));
    card.modelBind("shuffl:series", shuffl.card.datagraph.setseriesdata(card));
    card.modelBind("shuffl:table",  shuffl.card.datagraph.setgraphdata(card));
    // Handle source drop, including subscription to changes in the source data
    card.modelBind("shuffl:source", function (_event, data) 
    {
        var oldsub = card.data("updatesubs");
        if (oldsub)
        {
            var oldsrc = data.oldval;
            oldsrc.modelUnbind("shuffl:title",  oldsub);
            oldsrc.modelUnbind("shuffl:labels", oldsub);
            oldsrc.modelUnbind("shuffl:series", oldsub);
        };
        var src    = data.newval;
        var newsub = shuffl.card.datagraph.updatedata(card, src);
        newsub();
        src.modelBind("shuffl:title",  newsub);
        src.modelBind("shuffl:labels", newsub);
        src.modelBind("shuffl:series", newsub);
        card.data("updatesubs", newsub);
        card.data("shuffl:source_id", src.data('shuffl:id'));
    });
    // Initialize the model
    shuffl.initModel(card, carddata, shuffl.card.datagraph.datamap,
        {id: cardid, tags: [cardtype]} 
        );
    // If card is linked, complete setting link when all cards have been loaded
    // (shuffl.LoadWorkspace triggers an event when all cards have been loaded)
    var cardsrcid = card.model('shuffl:source_id');
    if (cardsrcid)
    {
        card.one("shuffl:AllCardsLoaded", function () {
            var src = jQuery(document.getElementById(cardsrcid));
            if (src.length == 1)
            {
                card.model("shuffl:source", src.eq(0));
            };
        });
    };
    // TODO: remove this temporary code to define table data if none provided
    if (!card.model('shuffl:series'))
    {
        card.model("shuffl:table", shuffl.card.datagraph.table);
    };
    return card;
};

/**
 * Returns a function to set graphing data from an assigned table, where the 
 * first row of the table is graph labels, the first column contains X-values, 
 * and the remaining columns contain Y-values for each graph.
 */
shuffl.card.datagraph.setgraphdata = function (card) 
{
    function setgraphvalues(_event, data)
    {
        ////log.debug("- data "+jQuery.toJSON(data));
        card.data("shuffl:table",  null);
        shuffl.modelSetSeries(card)(_event, data);
    };
    return setgraphvalues;
};

/**
 * Returns a function to handle new graph data assigned to a series, which
 * is an array, each element of which is a list of [x,y] pairs.
 *   
 * Minimum and maximum Y values are recalculated, and a redraw is scheduled.
 */
shuffl.card.datagraph.setseriesdata = function (card) 
{
    function setseriesvalues(_event, data)
    {
        var series = data.newval;
        if (series && series.length)
        {
            ////log.debug("- series "+jQuery.toJSON(series));
            var ymin = series[0][0][1];
            var ymax = series[0][0][1];
            ////log.debug("- ymin "+ymin+", ymax "+ymax);
            for (var i = 0 ; i < series.length ; i++)
            {
                var graph = series[i];
                for (var j = 0 ; j < graph.length ; j++)
                {
                    var y = graph[j][1];
                    if (isFinite(y))
                    {
                        ymin = Math.min(ymin, y);
                        ymax = Math.max(ymax, graph[j][1]);
                    };
                };
            };
            ////log.debug("- ymin "+ymin+", ymax "+ymax);
            card.model("shuffl:dataminy", ymin);
            card.model("shuffl:datamaxy", ymax);
            shuffl.card.datagraph.redraw(card)();
        };
    };
    return setseriesvalues;
};

/**
 * Return function to update graph data from the supplied drop source
 */
shuffl.card.datagraph.updatedata = function (card, src)
{
    function update(_event, _data)
    {
        var srctitle = src.model("shuffl:title");
        if (srctitle)
        {
            var title = card.model("shuffl:title").replace(/ \([^)]+\)$/,"");
            card.model("shuffl:title", title+" ("+src.model("shuffl:title")+")");
        }
        card.data("shuffl:labels", src.model("shuffl:labels"));
        card.model("shuffl:series", src.model("shuffl:series"));
    };
    return update;
};

/**
 * Return function to redraw the graph in a supplied datagraph card
 * following an update to the card model.
 */
shuffl.card.datagraph.redraw = function (card)
{
    function drawgraph(_event, _data)
    {
        // Redraw after 50ms
        shuffl.redrawAfter(card, shuffl.card.datagraph.draw, 50.0);
        card.data('shuffl:datamod', true);
    };
    return drawgraph;
};

/**
 * Function to draw the graph in a supplied datagraph card
 */
shuffl.card.datagraph.draw = function (card)
{
    var ymin   = card.model('shuffl:dataminy');
    var ymax   = card.model('shuffl:datamaxy');
    var labels = card.model('shuffl:labels');
    var series = card.model('shuffl:series');
    var cbody  = card.find("cbody");
    var gelem  = cbody.find("div");
    ////log.debug("shuffl.card.datagraph.draw "+cbody.width()+", "+cbody.height());
    ////log.debug("shuffl.card.datagraph.draw "+gelem.width()+", "+gelem.height());
    if (labels && series && gelem.width() && gelem.height())
    {
        log.debug("- plot graphs "+ymin+", "+ymax);
        var data   = [];
        for (var i = 0 ; i < labels.length ; i++)
        {
            data.push({label: labels[i], data: series[i]});
        }
        var options =
            { series:
                { lines:  { show: true}
                , points: { show: false, fill: false }
                }
            , xaxis:
                { labelWidth: 40
                }
            };
        if (isFinite(ymin) && isFinite(ymax) && (ymin<ymax))
        {
            options.yaxis = { min: ymin, max: ymax };
        }
        var plot = jQuery.plot(gelem, data, options);
    };
};

/**
 * Serializes a tabular data card to JSON for storage
 * 
 * @param card      a jQuery object corresponding to the card
 * @return          an object containing the card data
 */
shuffl.card.datagraph.serialize = function (card) 
{
    return carddata = shuffl.serializeModel(card, shuffl.card.datagraph.datamap);
};

/**
 *   Add new card type factories
 */
shuffl.addCardFactory("shuffl-datagraph-yellow", "stock-yellow", shuffl.card.datagraph.newCard);
shuffl.addCardFactory("shuffl-datagraph-blue",   "stock-blue",   shuffl.card.datagraph.newCard);
shuffl.addCardFactory("shuffl-datagraph-green",  "stock-green",  shuffl.card.datagraph.newCard);
shuffl.addCardFactory("shuffl-datagraph-orange", "stock-orange", shuffl.card.datagraph.newCard);
shuffl.addCardFactory("shuffl-datagraph-pink",   "stock-pink",   shuffl.card.datagraph.newCard);
shuffl.addCardFactory("shuffl-datagraph-purple", "stock-purple", shuffl.card.datagraph.newCard);

// End.
