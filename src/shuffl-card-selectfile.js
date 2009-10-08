/**
 * @fileoverview
 *  Shuffl card plug-in for data upload card.  Initially, this card displays
 *  fields for specifying a data file.  When a file is selected, the data may
 *  be accessed, and the card changes to a reference to that data that can be 
 *  linked to other cards (e.g. visualization).
 * 
 *  (That was the intent - currently only file selection logic exists, and that
 *  is somewhat crude in its capabilities.)
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
 * create shuffl namespace
 */
if (typeof shuffl == "undefined") 
{
    alert("shuffl-card-selectfile.js: shuffl-base.js must be loaded first");
}

/**
 * Create namespace for this card type
 */
shuffl.card.selectfile = {};

/**
 * Define template for serializing card data
 */
shuffl.card.selectfile.data =
    { 'shuffl:title':     undefined
    , 'shuffl:tags':      [ undefined ]
    , 'shuffl:file':      undefined
    , 'shuffl:baseuri':   undefined
    };

/**
 * jQuery base element for building new cards (used by shuffl.makeCard)
 */
shuffl.card.selectfile.blank = jQuery(
    "<div class='shuffl-card-autosize' style='z-index:10;'>\n"+
    "  <chead>\n"+
    "    <chandle><c></c></chandle>" +
    "    <ctitle>card title</ctitle>\n"+
    "  </chead>\n"+
    "  <div class='card.selectfile.data'>\n"+
    "    <crow>Base URI:  <cbaseuri>(base URI)</cbaseuri></crow>\n" +
    "    <crow>File:      <cfile>(file)</cfile></crow>\n" +
    "    <crow>URI:       <curi>(uri)</curi></crow>\n" +
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
shuffl.card.selectfile.newCard = function (cardtype, cardcss, cardid, carddata) {
    log.debug("shuffl.card.selectfile.newCard: "+cardtype+", "+cardcss+", "+cardid+", "+carddata);
    var card = shuffl.card.selectfile.blank.clone();
    var updateCuri = function() {
        var b = card.model("shuffl:baseuri");
        var f = card.model("shuffl:file");
        //log.debug("- update curi: cbaseuri "+b);
        //log.debug("- update curi: cfile "+f);
        var u = jQuery.uri(f, b);
        card.find("curi").text(u.toString());
    };
    // Initialize the card object
    card.data('shuffl:class',  cardtype);
    card.data('shuffl:id',     cardid);
    card.data("shuffl:tojson", shuffl.card.selectfile.serialize);
    card.attr('id', cardid);
    card.addClass(cardcss);
    card.find("cident").text(cardid);               // Set card id text
    card.find("cclass").text(cardtype);             // Set card class/type text
    // Set up model listener and user input handlers
    shuffl.bindLineEditable(card, "shuffl:title",   "ctitle");
    shuffl.bindLineEditable(card, "shuffl:tags",    "ctags");
    shuffl.bindLineEditable(card, "shuffl:baseuri", "cbaseuri", updateCuri);
    shuffl.bindLineEditable(card, "shuffl:file",    "cfile",    updateCuri);
    // Initialize the model
    var cardtitle   = shuffl.get(carddata, 'shuffl:title', cardid+" - type "+cardtype);
    var cardtags    = shuffl.get(carddata, 'shuffl:tags',  [cardid,cardtype]);
    // TODO: plug-in backend framework to provide appropriate base URI
    var cardbaseuri = shuffl.get(carddata, 'shuffl:baseuri',  shuffl.uriBase(".."));
    var cardfile    = shuffl.get(carddata, 'shuffl:file',     "");
    card.model("shuffl:title",   cardtitle);
    card.model("shuffl:tags",    cardtags.join(","));
    card.model("shuffl:baseuri", cardbaseuri);
    card.model("shuffl:file",    cardfile);
    return card;
};

/**
 * Serializes a data-upload card to JSON for storage
 * 
 * @param card      a jQuery object corresponding to the card
 * @return an object containing the card data
 */
shuffl.card.selectfile.serialize = function (card) {
    var carddata = shuffl.card.selectfile.data;
    carddata['shuffl:title']    = card.model("shuffl:title");
    carddata['shuffl:tags']     = shuffl.makeTagList(card.model("shuffl:tags"));
    carddata['shuffl:file']     = card.model("shuffl:file");
    carddata['shuffl:basepath'] = card.model("shuffl:basepath");
    carddata['shuffl:baseuri']  = card.model("shuffl:baseuri");
    return carddata;
};

/**
 *   Add new card type factory
 */
shuffl.addCardFactory("shuffl-selectfile", "stock-default", shuffl.card.selectfile.newCard);

// End.
