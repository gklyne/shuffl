/**
 * @fileoverview
 * Shuffl card plug-in for a card graphing tabular data.
 * 
 * This plugin is initially based on the shuffl-card-datatable plugin, except
 * that the display area is rendered using 'flot' rather than as an HTML table.
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
 * Template for creating new card object for serialization
 */
shuffl.card.datagraph.data =
    { 'shuffl:title':   undefined
    , 'shuffl:tags':    [ undefined ]
    , 'shuffl:uri':     undefined
    , 'shuffl:labels':  undefined
    , 'shuffl:series':  undefined
    };

/*
 * Temporary default data for testing...
 * TODO: reset this when done testing
 */
shuffl.card.datagraph.labels =
    [ "series1", "series2", "series3", "series4" ];

shuffl.card.datagraph.series = [ [], [], [], [] ];

(function (series)
{
    function limit(val,min,max)
    {
        if (val<min) { return null; };
        if (val>max) { return null; };
        return val;
    }
    for (var x = 0.0 ; x <= 10.0 ; x = x+0.2) 
    {
        series[0].push([x, Math.sin(x)]);
        series[1].push([x, Math.cos(x)]);
        series[2].push([x, limit(Math.tan(x)/5.0, -1.0, +1.0)]);
        var y = Math.abs((x-5.0)*4);
        series[3].push([x, (y>0.0 ? Math.sin(y)/y : 1.0)]);
    };
})(shuffl.card.datagraph.series);

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
    "    <curi>card_ZZZ uri</curi>\n"+
    "    <button value='readcsv'>Read CSV data</button>\n"+
    "  </crow>\n"+
    "  <crow>\n"+
    "    <cbody class='shuffl-nodrag'>\n"+
    "      <div style='width:99%; height:96%;'/>\n"+
    "    </cbody>\n"+
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
 *                      'shuffl:title', 'shuffl:tags' and 'shuffl:table'.
 * @return              a jQuery object representing the new card.
 */
shuffl.card.datagraph.newCard = function (cardtype, cardcss, cardid, carddata) 
{
    //log.debug("shuffl.card.datagraph.newCard: "+
    //    cardtype+", "+cardcss+", "+cardid+", "+carddata);
    // Initialize the card object
    var card = shuffl.card.datagraph.blank.clone();
    card.data('shuffl:class',  cardtype);
    card.data('shuffl:id',     cardid);
    card.data("shuffl:tojson", shuffl.card.datagraph.serialize);
    card.attr('id', cardid);
    card.addClass(cardcss);
    card.find("cident").text(cardid);           // Set card id text
    card.find("cclass").text(cardtype);         // Set card class/type text
    card.data("resizeAlso", "cbody");
    card.resizable();
    // Set up function to (re)draw the card when placed or resized
    card.data("redrawFunc", shuffl.card.datagraph.redraw(card));
    // Set up model listener and user input handlers
    var ctitle = card.find("ctitle");
    card.modelBind("shuffl:title",   shuffl.modelSetText(ctitle, true));
    shuffl.lineEditable(card, ctitle, shuffl.editSetModel(card, "shuffl:title"));
    var ctags = card.find("ctags");
    card.modelBind("shuffl:tags", shuffl.modelSetText(ctags, true));
    shuffl.lineEditable(card, ctags, shuffl.editSetModel(card, "shuffl:tags"));
    var curi = card.find("curi");
    card.modelBind("shuffl:uri",     shuffl.modelSetText(curi, true));
    shuffl.lineEditable(card, curi, shuffl.editSetModel(card, "shuffl:uri"));
    card.modelBind("shuffl:labels",  shuffl.card.datagraph.redraw(card));
    card.modelBind("shuffl:series",  shuffl.card.datagraph.redraw(card));
    card.modelBind("shuffl:readcsv", function (event, data) 
    {
        log.debug("Read "+data.newval+" into data table");
        jQuery.getCSV(data.newval, function (data, status) 
        {
            ////log.debug("- data "+jQuery.toJSON(data));
            // First row is series labels
            card.model("shuffl:labels", data.slice(0,1));
            card.model("shuffl:series", data.slice(1));
        });
    });
    card.find("button[value='readcsv']").click(function (eventobj) 
    {
        ////log.debug("shuffl.card.datagraph readcsv button clicked");
        card.model("shuffl:readcsv", card.model("shuffl:uri"));
    });
    // Initialize the model
    var cardtitle  = shuffl.get(carddata, 'shuffl:title', cardid+" - type "+cardtype);
    var cardtags   = shuffl.get(carddata, 'shuffl:tags',  [cardid,cardtype]);
    var carduri    = shuffl.get(carddata, 'shuffl:uri',   "");
    var cardlabels = shuffl.get(carddata, 'shuffl:labels', shuffl.card.datagraph.labels);
    var cardseries = shuffl.get(carddata, 'shuffl:series', shuffl.card.datagraph.series);
    card.model("shuffl:title",  cardtitle);
    card.model("shuffl:tags",   cardtags.join(","));
    card.model("shuffl:uri",    carduri);
    card.model("shuffl:labels", cardlabels);
    card.model("shuffl:series", cardseries);
    return card;
};

/**
 * Return function to redraw the graph in a supplied datagraph card
 */
shuffl.card.datagraph.redraw = function (card)
{
    function drawgraph(_event, _data)
    {
        var labels = card.model('shuffl:labels');
        var series = card.model('shuffl:series');
        var cbody  = card.find("cbody");
        var gelem  = cbody.find("div");
        //log.debug("shuffl.card.datagraph.redraw:drawgraph "+cbody.width()+", "+cbody.height());
        //log.debug("shuffl.card.datagraph.redraw:drawgraph "+gelem.width()+", "+gelem.height());
        if (labels && series && gelem.width() && gelem.height())
        {
            log.debug("- plot graphs");
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
                };
            var plot = jQuery.plot(gelem, data, options);
        };
    };
    return drawgraph;
};

/**
 * Serializes a tabular data card to JSON for storage
 * 
 * @param card      a jQuery object corresponding to the card
 * @return          an object containing the card data
 */
shuffl.card.datagraph.serialize = function (card) 
{
    var carddata = shuffl.card.datagraph.data;
    carddata['shuffl:title']  = card.model("shuffl:title");
    carddata['shuffl:tags']   = shuffl.makeTagList(card.model("shuffl:tags"));
    carddata['shuffl:uri']    = card.model("shuffl:uri");
    carddata['shuffl:labels'] = card.model("shuffl:labels");
    carddata['shuffl:series'] = card.model("shuffl:series");
    return carddata;
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
