/**
 * @fileoverview
 *  Shuffl application Ajax support functions.  These are a collection of
 *  helper functions that use the underlying jQuery.ajax call to access
 *  external resources in different ways.
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
// Initialize global data values
// ----------------------------------------------------------------

/**
 * Ensure shuffl namespace
 */
if (typeof shuffl == "undefined") 
{
    alert("shuffl-ajax.js: shuffl-base.js must be loaded first");
};
if (typeof shuffl.ajax == "undefined") 
{
    shuffl.ajax = {};
};

// ----------------------------------------------------------------
// Ajax resource access
// ----------------------------------------------------------------

/**
 * Returns function for handling ajax request failure
 */
shuffl.ajax.requestFailed = function (callback) {
    return function (xhr, status, except) {
        log.debug("shuffl.ajax.requestFailed: "+status);
        var err = new shuffl.Error(
            "Request failed", 
            status+"; HTTP status: "+xhr.status+" "+xhr.statusText);
        err.HTTPstatus     = xhr.status;
        err.HTTPstatusText = xhr.statusText; 
        err.response       = err.HTTPstatus+" "+err.HTTPstatusText;
        callback(err, status);
    };
};

/**
 * Returns function for handling ajax request successful completion
 * 
 * @param uri         requested URI
 * @param callback    callback function with result information.
 * @param trace       optional parameter, set 'true' if trace output of
 *                    response data is required.
 * @return            jQuery.ajax success callback function to decode the
 *                    response and then call the supplied callback function.
 */
shuffl.ajax.decodeResponse = function (uri, callback, trace) 
{
    function decodeResponse(data, status)
    {
        if (trace)
        {
            log.debug("shuffl.decodeResponse: "+uri+", "+status);
            log.debug("shuffl.decodeResponse: "+jQuery.toJSON(data));
        };
        callback(data);
    }
    return decodeResponse;
};

/**
 * Retrieve JSON resource.  This function is similar to jQuery.getJSON,
 * except that the callback is invoked with an error value if the
 * request fails.
 * 
 * @param uri       URI of resource to retrieve
 * @param type      type of result expected: "xml", "json", or "text"
 * @param callback  function called when operation completes, with either
 *                  the data returned for a successful request, or an error
 *                  object if trhe request fails.  The second argument supplied
 *                  is a textual status indication.
 */
shuffl.ajax.get = function (uri, type, callback)
{
    jQuery.ajax({
            type:         "GET",
            url:          uri.toString(),
            dataType:     type,
            success:      shuffl.ajax.decodeResponse(uri, callback),
            error:        shuffl.ajax.requestFailed(callback),
            cache:        false
        });
};

/**
 * Retrieve arbitrary resource.
 * 
 * @param uri       URI of resource to retrieve
 * @param callback  function called when operation completes, with either
 *                  the data returned for a successful request, or an error
 *                  object if trhe request fails.  The second argument supplied
 *                  is a textual status indication.
 */
shuffl.ajax.getJSON = function (uri, callback)
{
    shuffl.ajax.get(uri, "json", callback);
};

// End.
