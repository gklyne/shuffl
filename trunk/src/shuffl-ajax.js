/**
 * @fileoverview
 *  Shuffl application Ajax support functions.  These are a collection of
 *  helper functions that use the underlying jQuery.ajax call to access
 *  external resources in different ways.
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
// Initialize global data values
// ----------------------------------------------------------------

/**
 * Ensure shuffl namespace
 */
if (typeof shuffl == "undefined") 
{
    alert("shuffl-ajax.js: shuffl-base.js must be loaded first");
};

// ----------------------------------------------------------------
// Ajax resource access
// ----------------------------------------------------------------

/**
 * Returns function for handling ajax request failure
 */
shuffl.requestFailed = function (callback) {
    return function (xhr, status, except) {
        log.debug("shuffl.requestFailed: "+status);
        var err = new shuffl.Error("Ajax request failed", status);
        err.HTTPstatus     = xhr.status;
        err.HTTPstatusText = xhr.statusText; 
        err.response = err.HTTPstatus+" "+err.HTTPstatusText;
        callback(err, status);
    };
};

/**
 * Returns function for handling ajax request successful completion
 */
shuffl.requestFailed = function (callback) {
    return function (xhr, status, except) {
        log.debug("shuffl.requestFailed: "+status);
        var err = new shuffl.Error("Ajax request failed", status);
        err.HTTPstatus     = xhr.status;
        err.HTTPstatusText = xhr.statusText; 
        err.response = err.HTTPstatus+" "+err.HTTPstatusText;
        callback(err, status);
    };
};

/**
 * Retrieve JSON resource.  This function is similar to jQuery.getJSON,
 * except that the callback is invoked with an error value if the
 * request fails.
 * 
 * @param uri       URI of resource to retrieve
 * @param callback  function called when operation completes, with either
 *                  the data returned for a successful request, or an error
 *                  object if trhe request fails.  The second argument supplied
 *                  is a textual status indication.
 */
shuffl.getJSON = function (uri, callback)
{
    jQuery.ajax({
            type:         "GET",
            url:          uri.toString(),
            dataType:     datatype,
            success:      shuffl.AtomPub.decodeItemResponse(this, iteminfo, callback),
            error:        shuffl.AtomPub.requestFailed(callback),
            cache:        false
        });
};

// End.
