/**
 * @fileoverview
 *  Shuffl card plug-in for simple card containing just free text.
 *  
 * @author Graham Klyne
 * @version $Id: shuffl-card-miidi-person.js 828 2010-06-14 15:26:11Z gk-google@ninebynine.org $
 * 
 * Coypyright (C) 2011, University of Oxford
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
    alert("shuffl-card-miidi-person.js: shuffl-base.js must be loaded first");
}
if (typeof shuffl.card == "undefined") 
{
    alert("shuffl-card-miidi-person.js: shuffl-cardhandlers.js must be loaded before this");
}

/**
 * Create namespace for this card type
 */
shuffl.card.miidiperson = {};

/**
 * Template for initializing a card model, and 
 * creating new card object for serialization.
 */
shuffl.card.miidiperson.datamap =
    { 'shuffl:first':   { def: '' }
    , 'shuffl:second':  { def: '' }
    , 'shuffl:phone':   { def: '' }
    , 'shuffl:email':   { def: '' }
    , 'shuffl:group':   { def: '' }
    , 'shuffl:dept':    { def: '' }
    , 'shuffl:inst':    { def: '' }
    };

/**
 * jQuery base element for building new cards (used by shuffl.makeCard)
 */
shuffl.card.miidiperson.blank = jQuery(
    "<div class='shuffl-card-autosize' style='z-index:10;'>\n"+
    "  <chead>\n"+
    "    <chandle><c></c></chandle>" +
    "    <ctitle>Person</ctitle>\n"+
    "  </chead>\n"+
    "  <ctable>\n"+
    "    <crow>\n"+
    "      <ccell><clabel></clabel></ccell>\n" +
    "      <ccell><cfieldlabel>First name</cfieldlabel></ccell>\n" +
    "      <ccell><cfieldlabel>Second name</cfieldlabel></ccell>\n" +
    "    </crow>\n"+
    "    <crow>\n"+
    "      <ccell><clabel>Person:</clabel></ccell>\n" +
    "      <ccell><cfirst>(first name)</cfirst></ccell>\n" +
    "      <ccell><csecond>(second name)</csecond></ccell>\n" +
    "    </crow>\n"+
    "    <crow>\n"+
    "      <ccell><clabel></clabel></ccell>\n" +
    "      <ccell><cfieldlabel>Phone number</cfieldlabel></ccell>\n" +
    "      <ccell><cfieldlabel>Email address</cfieldlabel></ccell>\n" +
    "    </crow>\n"+
    "    <crow>\n"+
    "      <ccell><clabel>Contact details:</clabel></ccell>\n" +
    "      <ccell><cphone>(phone number)</cphone></ccell>\n" +
    "      <ccell><cemail>(email address)</cemail></ccell>\n" +
    "    </crow>\n"+
    "    <crow>\n"+
    "      <ccell><clabel></clabel></ccell>\n" +
    "      <ccell><cfieldlabel>Research group:</cfieldlabel></ccell>\n" +
    "      <ccell><cfieldlabel>Department:</cfieldlabel></ccell>\n" +
    "      <ccell><cfieldlabel>Institution:</cfieldlabel></ccell>\n" +
    "    </crow>\n"+
    "    <crow>\n"+
    "      <ccell><clabel>Affiliation:</clabel></ccell>\n" +
    "      <ccell><cgroup>(research group)</cgroup></ccell>\n" +
    "      <ccell><cdept>(department)</cdept></ccell>\n" +
    "      <ccell><cinst>(institution)</cinst></ccell>\n" +
    "    </crow>\n"+
    "  </ctable>\n"+
    "  <crow>\n"+
    "    (But see <a href='http://www.kalzumeus.com/2010/06/17/falsehoods-programmers-believe-about-names/'>"+
    "    Falsehoods programmers believe about names</a>)"+
    "  </crow>\n"+
    "  <cfoot>\n"+
    "    <cident>card_ZZZ_ident</cident>:<cclass>card_ZZZ class</cclass>\n"+
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
 *                      'shuffl:title', 'shuffl:tags' and 'shuffl:text'.
 * @return              a jQuery object representing the new card.
 */
shuffl.card.miidiperson.newCard = function (cardtype, cardcss, cardid, carddata) {
    //log.debug("shuffl.card.miidiperson.newCard: "+
    //    cardtype+", "+cardcss+", "+cardid+", "+carddata);
    // Initialize the card object
    var card = shuffl.card.miidiperson.blank.clone();
    card.data('shuffl:type',   cardtype);
    card.data('shuffl:id',     cardid);
    card.data("shuffl:tojson", shuffl.card.miidiperson.serialize);
    card.attr('id', cardid);
    card.addClass(cardcss);
    card.find("cident").text(cardid);           // Set card id text
    card.find("cclass").text(cardtype);         // Set card class/type text
    // The next two lines for resizable cards:
    //card.data("resizeAlso", "cbody");
    //card.resizable();
    // Set up model listener and user input handlers
    shuffl.bindLineEditable(card, "shuffl:first",   "cfirst");
    shuffl.bindLineEditable(card, "shuffl:second",  "csecond");
    shuffl.bindLineEditable(card, "shuffl:phone",   "cphone");
    shuffl.bindLineEditable(card, "shuffl:email",   "cemail");
    shuffl.bindLineEditable(card, "shuffl:group",   "cgroup");
    shuffl.bindLineEditable(card, "shuffl:dept",    "cdept");
    shuffl.bindLineEditable(card, "shuffl:inst",    "cinst");
    // Initialize the model
    shuffl.initModel(card, carddata, shuffl.card.miidiperson.datamap,
        {id: cardid}
        );
    return card;
};

/**
 * Serializes a free-text card to JSON for storage
 * 
 * @param card      a jQuery object corresponding to the card
 * @return an object containing the card data
 */
shuffl.card.miidiperson.serialize = function (card) {
    return shuffl.serializeModel(card, shuffl.card.miidiperson.datamap);
};

/**
 *   Add new card type factories
 */
shuffl.addCardFactory("shuffl-miidi-person-yellow", "stock-yellow", shuffl.card.miidiperson.newCard);
shuffl.addCardFactory("shuffl-miidi-person-blue",   "stock-blue",   shuffl.card.miidiperson.newCard);
shuffl.addCardFactory("shuffl-miidi-person-green",  "stock-green",  shuffl.card.miidiperson.newCard);
shuffl.addCardFactory("shuffl-miidi-person-orange", "stock-orange", shuffl.card.miidiperson.newCard);
shuffl.addCardFactory("shuffl-miidi-person-pink",   "stock-pink",   shuffl.card.miidiperson.newCard);
shuffl.addCardFactory("shuffl-miidi-person-purple", "stock-purple", shuffl.card.miidiperson.newCard);

// End.
