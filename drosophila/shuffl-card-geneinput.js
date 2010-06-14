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
shuffl.card.geneinput = {};

/**
 * Template for creating new card object for serialization
 */
shuffl.card.geneinput.data =
    { 'drosophila:genename':	undefined
    };

/**
 * jQuery base element for building new cards (used by shuffl.makeCard)
 */
shuffl.card.geneinput.blank = jQuery(
    "<div class='shuffl-card-autosize' style='z-index:10;'>\n"+
    "  <crow>\n"+
    "    <cbody>\n"+
    "      <b><i>Drosophila</i> gene name: </b><cgenename/>\n"+
    "    </cbody>\n"+
    "  </crow>\n"+
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
shuffl.card.geneinput.newCard = function (cardtype, cardcss, cardid, carddata) {
    ////log.debug("shuffl.card.geneinput.newCard: "+
    ////    cardtype+", "+cardcss+", "+cardid+", "+carddata);
    // Initialize the card object
    var card = shuffl.card.geneinput.blank.clone();
    card.data('shuffl:type',   cardtype);
    card.data('shuffl:id',     cardid);
    card.data("shuffl:tojson", shuffl.card.geneinput.serialize);
    card.attr('id', cardid);
    card.addClass(cardcss);
    // Set up model listener and user input handlers
    shuffl.bindLineEditable(card, "drosophila:genename", "cgenename");
    // Initialize the model
    var genename = shuffl.get(carddata, 'drosophila:genename', "(gene name here)");
    card.model("drosophila:genename", genename);
    return card;
};

/**
 * Serializes a free-text card to JSON for storage
 * 
 * @param card      a jQuery object corresponding to the card
 * @return an object containing the card data
 */
shuffl.card.geneinput.serialize = function (card) {
    var carddata = shuffl.card.geneinput.data;
    carddata['drosophila:genename'] = card.model("drosophila:genename");
    return carddata;
};

/**
 *   Add new card type factories
 */
shuffl.addCardFactory("shuffl-geneinput-yellow", "stock-yellow", shuffl.card.geneinput.newCard);
shuffl.addCardFactory("shuffl-geneinput-blue",   "stock-blue",   shuffl.card.geneinput.newCard);
shuffl.addCardFactory("shuffl-geneinput-green",  "stock-green",  shuffl.card.geneinput.newCard);
shuffl.addCardFactory("shuffl-geneinput-orange", "stock-orange", shuffl.card.geneinput.newCard);
shuffl.addCardFactory("shuffl-geneinput-pink",   "stock-pink",   shuffl.card.geneinput.newCard);
shuffl.addCardFactory("shuffl-geneinput-purple", "stock-purple", shuffl.card.geneinput.newCard);

// End.
