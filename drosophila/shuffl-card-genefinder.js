/**
 * @fileoverview
 *  Shuffl card plug-in for entering gene name for drosophila gene data viewing
 *  
 * @author Graham Klyne
 * @version $Id: $
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
shuffl.card.genefinder = {};

/**
 * Global data
 */
shuffl.card.genefinder.FlyBaseSPARQLEndPointUri = "http://openflydata.org/sparqlite-0.4-alpha4/endpoint-lax/flybase-FB2009_02";

/**
 * Template for creating new card object for serialization
 */
shuffl.card.genefinder.data =
    { 'drosophila:genename':	undefined
    , 'drosophila:flybaseid':	undefined
    };

/**
 * jQuery base element for building new cards (used by shuffl.makeCard)
 */
shuffl.card.genefinder.blank = jQuery(
    "<div class='shuffl-card-autosize' style='z-index:10;'>\n"+
    "    <crow>\n"+
    "      <b><i>Drosophila</i> gene name: </b><cgenename/>\n"+
    "    </crow><crow>\n" +
    "      <b><i>Drosophila</i> FlyBase ID: </b><cflybaseid/>\n"+
    "    </crow>\n"+
    "    <cbody>\n"+
    "      <div/>\n"+
    "    </cbody>\n"+
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
 *                      'shuffl:title', 'shuffl:tags' and 'shuffl:text'.
 * @return              a jQuery object representing the new card.
 */
shuffl.card.genefinder.newCard = function (cardtype, cardcss, cardid, carddata) {
    ////log.debug("shuffl.card.genefinder.newCard: "+
    ////    cardtype+", "+cardcss+", "+cardid+", "+carddata);
    // Initialize the card object
    var card = shuffl.card.genefinder.blank.clone();
    card.data('shuffl:class',  cardtype);
    card.data('shuffl:id',     cardid);
    card.data("shuffl:tojson", shuffl.card.genefinder.serialize);
    card.attr('id', cardid);
    card.addClass(cardcss);
    // Set up model listener and user input handlers
    shuffl.bindLineEditable(card, "drosophila:genename", "cgenename");
    shuffl.bindLineEditable(card, "drosophila:flybaseid", "cflybaseid");
    // Initialize the model
    var genename = shuffl.get(carddata, 'drosophila:genename', "(gene name here)");
    var flybaseid = shuffl.get(carddata, 'drosophila:flybaseid', "(flybase id here)");
    card.model("drosophila:genename", genename);
    card.model("drosophila:flybaseid", flybaseid);

    // Instantiate a FlyUI gene finder service
    var genefinder = undefined;
    try {
		log.debug("instantiate a service for the genefinder widget");
		var service = new flyui.flybase.Service(shuffl.card.genefinder.FlyBaseSPARQLEndPointUri);
        log.debug("instantiate a renderer for the genefinder widget");
        var renderPane = card.find("cbody div").get(0);		// Render flyui widget here
        var renderer = new flyui.genefinder.DefaultRenderer(); // default renderer
        renderer.setCanvas(renderPane);
        log.debug("instantiate a genefinder widget");
        genefinder = new flyui.genefinder.Widget(service, renderer);
    } catch (e) {
        log.error("unexpected error: "+e.name+" "+e.message);
        throw e;
    }

	// Hook up user gene name entry to genefinder widget
	card.modelBind('drosophila:genename', function (event, data) {
		var caseSensitive = false;
		genefinder.findGenesByAnyName(data.newval, caseSensitive);
	});

    return card;
};

/**
 * Serializes a free-text card to JSON for storage
 * 
 * @param card      a jQuery object corresponding to the card
 * @return an object containing the card data
 */
shuffl.card.genefinder.serialize = function (card) {
    var carddata = shuffl.card.genefinder.data;
    carddata['drosophila:genename'] = card.model("drosophila:genename");
    carddata['drosophila:flybaseid'] = card.model("drosophila:flybaseid");
    return carddata;
};

/**
 *   Add new card type factories
 */
shuffl.addCardFactory("shuffl-genefinder-yellow", "stock-yellow", shuffl.card.genefinder.newCard);
shuffl.addCardFactory("shuffl-genefinder-blue",   "stock-blue",   shuffl.card.genefinder.newCard);
shuffl.addCardFactory("shuffl-genefinder-green",  "stock-green",  shuffl.card.genefinder.newCard);
shuffl.addCardFactory("shuffl-genefinder-orange", "stock-orange", shuffl.card.genefinder.newCard);
shuffl.addCardFactory("shuffl-genefinder-pink",   "stock-pink",   shuffl.card.genefinder.newCard);
shuffl.addCardFactory("shuffl-genefinder-purple", "stock-purple", shuffl.card.genefinder.newCard);

// End.
