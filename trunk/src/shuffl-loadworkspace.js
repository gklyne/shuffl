/**
 * @fileoverview
 *  Shuffl code to load cards into the workspace.
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

// TODO: refactor this code to accept a storage session object, so the
//       interface is more consistent with the save module.

// ----------------------------------------------------------------
// Load up workspace
// ----------------------------------------------------------------

/**
 * Load data for a single card.
 * 
 * @param baseuri   URI of workspace layout or feed, used as base for 
 *                  resolving the card data URI.
 * @param uri       URI of card description.
 * @param callback  function called when the load is complete.
 * 
 * The callback is invoked with an Error object, or an object containing
 * the card data.
 */
shuffl.readCard = function (baseuri, dataref, callback) {
    log.debug("shuffl.readCard: "+baseuri+", "+dataref);
    var datauri = jQuery.uri(baseuri).resolve(dataref);
    log.debug("- datauri "+datauri);
    jQuery.getJSON(datauri.toString(), function(data) {
        ////log.debug("shuffl.readCard from: "+datauri);
        ////log.debug("shuffl.readCard from: "+dataref);
        ////log.debug("- data: "+jQuery.toJSON(data));
        data['shuffl:dataref'] = dataref.toString();
        data['shuffl:datauri'] = datauri.toString();
        data['shuffl:dataRW']  = false;     // Assume not writeable for now
        callback(data);
    });
};

/**
 * Load card data into the workspace.
 * 
 * Note that loading data is done using pure web GET requests, without 
 * reference to AtomPub protocol elements.  The URIs used may be different 
 * from the AtomPub editing URIs, which are stored as part of the data.
 * 
 * The data loaded is added to any data which may already be present.
 * 
 * @param uri       URI of workspace description.
 * @param callback  function called when the load is complete.
 * 
 * The callback is invoked with an Error object, or an empty dictionary.
 */
shuffl.loadWorkspace = function(uri, callback) {
    log.debug("shuffl.loadWorkspace: "+uri);
    var m = new shuffl.AsyncComputation();
    m.eval(function(val,callback) {
            log.debug("Load layout from "+val);
            jQuery.getJSON(val.toString(), callback);
        });
    m.eval(function(json,callback) {
            // When layout JSON has been read...
            log.debug("Loading workspace content");
            var i;
            var atomuri  = json['shuffl:atomuri'];
            var feeduri  = json['shuffl:feeduri'];
            var stockbar = json['shuffl:workspace']['shuffl:stockbar'];
            var layout   = json['shuffl:workspace']['shuffl:layout'];
            //log.debug("- layout: "+jQuery.toJSON(layout));
            // Display and save location information
            var wsuri = jQuery.uri().resolve(uri);
            ////log.debug("Display location of workspace, and save values: "+wsuri);
            jQuery('#workspace_status').text(wsuri.toString());
            // TODO: save URI not string?
            jQuery('#workspace').data('location', wsuri.toString());
            jQuery('#workspace').data('wsname',   shuffl.uriName(wsuri));
            jQuery('#workspace').data('wsdata',   json);
            // Load up stock bar
            for (i = 0 ; i < stockbar.length ; i++) {
                ////log.debug("Loading stockbar["+i+"]: "+shuffl.objectString(stockbar[i]));
                // Create and append new blank stockpile element
                // TODO: use createStockpile helper
                var stockpile = shuffl.stockpile_blank.clone();
                stockpile.attr(stockbar[i]['id']);
                stockpile.addClass(stockbar[i]['class']);
                stockpile.text(stockbar[i]['label']);
                stockpile.data( 'makeCard', shuffl.createCardFromStock );
                stockpile.data( 'CardType', stockbar[i]['type'] );
                stockpile.draggable(shuffl.stockDraggable);
                jQuery('#stockbar').append(shuffl.stockpile_space.clone()).append(stockpile);
            };
            // Load up card data
            log.debug("Loading layout");
            function readLayoutCard(layout) {
                // Function creates closure with specific layout definition
                return function(val, callback) {
                    shuffl.readCard(feeduri, layout['data'], function (data) {
                        // Card data available
                        shuffl.placeCardFromData(layout, data);
                        callback({});
                    });
                };
            };
            var m2 = new shuffl.AsyncComputation();
            for (i = 0 ; i < layout.length ; i++) {
                // Queue up function to read next card
                m2.eval(readLayoutCard(layout[i]));
            };
            // Kick off loading cards
            m2.exec({}, callback);
        });
    // Kick of the workspace load
    m.exec(uri, callback);
};

/**
 * Reset workspace: remove all stockbar entries, cards and other values 
 * introduced by loadWorkspace from the workspace.
 * 
 * @param callback      function called when reset is complete.
 *                      (This function executes synchronously, but for 
 *                      consistency with other workspace functions it follows
 *                      the asynchonour callback pattern.)
 * 
 * The callback is invoked with an Error object, or an empty dictionary.
 */
shuffl.resetWorkspace = function(callback) {
    log.debug("Reset workspace");
    jQuery('#workspace_status').text("");
    jQuery('#workspace').data('location', null);
    jQuery('#workspace').data('wsname',   null);
    jQuery('#workspace').data('wsdata',   null);
    // Empty stock bar
    jQuery('#stockbar .shuffl-stockpile, #stockbar .shuffl-spacer').remove();
    // Remove card data
    jQuery('#layout').empty();
    callback({});
};

// End.
