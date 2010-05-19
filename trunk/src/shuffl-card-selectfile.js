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

    var filelistelemSelected = function (val)
    {
        // This function is provided as a means of testing the file list click 
        // handler, and is invoked by setting model "shuffl:filelistelem" to
        // the index (0-based) of a list element whose click is to be simulated.
        var i = card.model("shuffl:filelistelem");
        var e = card.find("clist > *")[i];
        filelistClicked({target:e});
    };

    var filelistClicked = function (event)
    {
        // Note: on the surface, it would be possible to shortcut most of this 
        // logic by simply using jQyery(event.target).text(), but I have 
        // observed that it is possible to generate button clicks that do not
        // correspond to child elements of the <clist> element - probably the
        // scroll bar.  Hence, scan through the known child elements and look
        // for a match with .index().
        //
        // this = <clist> element
        ////log.debug("filelistClicked "+shuffl.elemString(this));
        ////log.debug("- event.target "+shuffl.elemString(event.target));
        ////jQuery(event.target).css("border", "2px dotted blue");
        var n = null;
        card.find("clist > *").each(function (rownum)
        {
            // this = dom element in list
            ////log.debug("filelistelem "+rownum+", "+shuffl.elemString(this));
            if (jQuery(this).index(event.target) >= 0) 
            {
                n = jQuery(this).text();
                ////log.debug("- match rownum "+rownum+", text "+n);
            };
        });
        if (n) card.model("shuffl:filename", n);
        return true;
    };

    var displayFileList = function (event, data)
    {
        // this  = jQuery object containing changed model variable
        // data  = {name:modelvarname, oldval:oldval, newval:value}
        // where 'value' is a list of items:
        //   { uri: ..., relref: ..., type: ("item" or "collection") }
        ////log.debug("displayFileList "+shuffl.objectString(data));
        var filelist = card.find("clist");
        filelist.empty();
        // Sort members by type and name
        data.newval.sort(function (a,b)
            {
                if (a.type == b.type)
                {
                    return a.relref < b.relref ? -1 
                         : a.relref > b.relref ? +1 : 0;
                }
                return a.type == "collection" ? -1 : +1;
            });
        for (i in data.newval)
        {
            var tag  = (data.newval[i].type == "collection" ? "cdir" : "cname");
            var elem = jQuery("<"+tag+">"+data.newval[i].relref+"</"+tag+">");
            filelist.append(elem);
        }
    };
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
    };
    var updateFileUri = function() {
        var f  = card.model("shuffl:fileuri")  || "" ;   // File URI
        var p  = card.model("shuffl:collpath") || "" ;   // Collection URI path
        var n  = card.model("shuffl:filename") || "" ;   // File name
        f = jQuery.uri(n, jQuery.uri(p, jQuery.uri(f)));
        var b  = shuffl.uriBase(f);
        log.debug( "updateFileUri: f "+f+", b "+b+", p "+p+", n "+n);
        card.model("shuffl:fileuri", f);
        // Generate new file list if base URI has changed
        if (card.model("shuffl:collbase") != b)
        {
            card.model("shuffl:collbase", b);
            card.find("clist").text("Updating...");
            var ss = shuffl.makeStorageSession(b);
            ss.listCollection(b, updateFileList);
        };
    };
    var resolvePath = function (p) {
        var f = card.model("shuffl:fileuri");
        log.debug("resolvePath: p "+p+", f "+f);
        return shuffl.uriPath(jQuery.uri(p, f));
    };
    var updatedCollectionUri = function(_event, data) {
        if (data.newval == data.oldval) return;
        ////log.debug("updatedCollectionUri: oldval "+data.oldval+", newval "+data.newval);
        // Collection URI updated
        var p = card.model("shuffl:collpath") || "" ;   // Collection URI path
        var n = shuffl.uriName(p);
        ////log.debug("updatedCollectionUri: p "+p+", n "+n);
        p = resolvePath(p);
        if (n != "")
        {
            card.model("shuffl:filename", n);
            card.model("shuffl:collpath", p);
        }
        else
        {
            card.model("shuffl:collpath", p);
            updateFileUri();           
        }
    };
    var updatedFilename = function(_event, data) {
        if (data.newval == data.oldval) return;
        // File name updated
        var n = card.model("shuffl:filename") || "" ;   // File name
        log.debug("updatedFilename: n "+n);
        if (n.match(/\//))
        {
            card.model("shuffl:filename", shuffl.uriName(n));
            card.model("shuffl:collpath", resolvePath(n));
        }
        else
        {
            updateFileUri();            
        }
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
    shuffl.bindLineEditable(card, "shuffl:collpath", "ccoll", updatedCollectionUri);
    shuffl.bindLineEditable(card, "shuffl:filename", "cfile", updatedFilename);
    card.modelBind("shuffl:filelist", displayFileList);
    // Hook up file-list click handler
    card.find("clist").click(filelistClicked);
    card.modelBind("shuffl:filelistelem", filelistelemSelected);  // For testing
    // Initialize the model
    shuffl.initModelVar(card, 'shuffl:title',    carddata, cardid);
    shuffl.initModelVar(card, 'shuffl:tags',     carddata, [cardtype], 'array');
    shuffl.initModelVar(card, 'shuffl:fileuri',  carddata, shuffl.uriBase("."));
    card.data("shuffl:filename", "");
    card.data("shuffl:collpath", "");
    card.data("shuffl:collbase", "(initializing...)");
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
