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
    , 'shuffl:fileuri':   undefined
    };

/**
 * jQuery base element for building new cards (used by shuffl.makeCard)
 */
shuffl.card.selectfile.blank = jQuery(
    "<div class='shuffl-card-setsize' style='z-index:10;'>\n"+
    "  <chead>\n"+
    "    <chandle><c></c></chandle>" +
    "    <ctitle>(card title)</ctitle>\n"+
    "  </chead>\n"+
    "  <ctable>\n"+
    "    <crow>\n"+
    "      <ccell><clabel>Collection</clabel></ccell>\n" +
    "      <ccell><ccoll>(collection path)</ccoll></ccell>\n" +
    "    </crow>\n"+
    "    <crow>\n"+
    "      <ccell/>\n" +
    "      <ccell>\n" +
    "        <clist class='shuffl-nodrag'>\n"+
    "          <cdir>(dir)/</cdir>\n"+
    "          <cname>(filename)</cname>\n"+
    "        </clist>" +
    "      </ccell>\n"+
    "    </crow>\n"+
    "    <crow>" +
    "      <ccell><clabel>Filename</clabel></ccell>\n" +
    "      <ccell><cfile>(filename)</cfile></ccell>" +
    "    </crow>\n" +
    "  </ctable>\n"+
    "</div>");

/**
 * Template for initializing a card model, and 
 * creating new card object for serialization.
 */
shuffl.card.selectfile.datamap =
    { 'shuffl:title':         { def: '@id' }
    , 'shuffl:tags':          { def: '@tags', type: 'array' }
    , 'shuffl:fileuri':       { def: "" }
    , 'shuffl:collpath':      { def: "" }
    , 'shuffl:filelist':      { def: [], type: 'array' }
    , 'shuffl:filename':      { def: "" }
    };

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

    var displayFileList = function (event, data)
    {
        // this  = jQuery object containing changed model variable
        // data  = {name:modelvarname, oldval:oldval, newval:value}
        // where 'value' is a list of items:
        //   { uri: ..., relref: ..., type: ("item" or "collection") }
        ////log.debug("displayFileList "+shuffl.objectString(data));
        var filelist = card.find("clist");
        filelist.empty();
        // TODO: sort members by type and name
        for (i in data.newval)
        {
            var tag  = (data.newval[i].type == "collection" ? "cdir" : "cname");
            var elem = jQuery("<"+tag+">"+data.newval[i].relref+"</"+tag+">");
            filelist.append(elem);
        }
    }
    var updateFileList = function (val)
    {
        // Callback to update file list in model
        // 'val' is either a Shuffl.error, or an object like:
        //   { uri:    (collection URI)
        //   , relref  (relative URI reference)
        //   , members (list of values of the form:
        //             { uri: ..., relref: ..., type: ("item" or "collection") }
        ////log.debug("updateFileList "+shuffl.objectString(val));
        if (val instanceof shuffl.Error)
        {
            log.error("listCollection error: "+val);
            card.model('shuffl:filelist', []);
        } 
        else 
        {
            card.model('shuffl:filelist', val.members);
        }
    }
    var updateCollectionUri = function() {
        // Collection URI updated: refresh file list
        var f = card.model("shuffl:fileuri") || "" ;    // File URI
        var b = card.model("shuffl:collpath") || "" ;   // Collection URI path
        var n = card.model("shuffl:filename") || "";    // Filename
        var ss = shuffl.makeStorageSession(shuffl.uriBase(f));
        card.find("clist").text("Updating...");
        ss.listCollection(b, updateFileList);
    };

    // Initialize the card object
    var card = shuffl.card.selectfile.blank.clone();
    card.data('shuffl:class',  cardtype);
    card.data('shuffl:id',     cardid);
    card.data("shuffl:tojson", shuffl.card.selectfile.serialize);
    card.attr('id', cardid);
    card.addClass(cardcss);
    card.data("resizeAlso", "clist");
    card.resizable();
    // Set up model listener and user input handlers
    shuffl.bindLineEditable(card, "shuffl:title",    "ctitle");
    shuffl.bindLineEditable(card, "shuffl:collpath", "ccoll", updateCollectionUri);
    shuffl.bindLineEditable(card, "shuffl:filename", "cfile");
    card.modelBind("shuffl:filelist", displayFileList);
    // Initialize the model
    shuffl.initModelVar(card, 'shuffl:title',    carddata, cardid);
    shuffl.initModelVar(card, 'shuffl:tags',     carddata, [cardtype], 'array');
    shuffl.initModelVar(card, 'shuffl:fileuri',  carddata, shuffl.uriBase("."));
    card.data("shuffl:filename", "");
    card.data("shuffl:collpath", "");
    // During initialization , split file URI into collaction and filename
    // Card operations use these separate values, which are recombined when the card
    // is serialized.
    //
    // Allow card to finish initializing (250ms), then set file name and collection URI 
    // which triggers population of file list
    setTimeout(
        function () 
        {
            var f = card.model("shuffl:fileuri");   // Full URI
            var b = shuffl.uriPath(f);              // Collection URI
            var n = shuffl.uriName(f);              // File name
            card.model("shuffl:filename", n);
            card.model("shuffl:collpath", b);
        },
        250);
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
    var b = jQuery.uri(card.model("shuffl:fileuri"));
    var f = jQuery.uri(card.model("shuffl:collpath"), b).toString();
    carddata['shuffl:fileuri']  = f;
    return carddata;
};

/**
 *   Add new card type factory
 */
shuffl.addCardFactory("shuffl-selectfile", "stock-default", shuffl.card.selectfile.newCard);

// End.
