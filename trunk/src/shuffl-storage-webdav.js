/**
 * @fileoverview
 *  Shuffl storage access framework.  This module defines storage session 
 *  class that performs read/write access to data accessed using a WebDAV 
 *  service.
 *  
 * @author Graham Klyne
 * @version $Id: shuffl-storage-webdav.js 671 2009-11-16 18:02:24Z gk-google@ninebynine.org $
 * 
 * Coypyright (C) 2010, University of Oxford
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

// ------------------------------------------------
// Global data
// ------------------------------------------------
 
/**
 * Check for shuffl and shuffl.stoage namespaces
 */
if (typeof shuffl == "undefined") 
{
    alert("shuffl-storage-webdav.js: shuffl-base.js must be loaded first");
};
if (typeof shuffl.storage == "undefined") 
{
    alert("shuffl-storage-webdav.js: shuffl-storage-common.js must be loaded before this");
};

// ------------------------------------------------
// WebDAV storage session handler
// ------------------------------------------------

/**
 * Create a local file storage session handler.
 * 
 * @constructor
 * @param baseuri   a base URI for the new session.  Relative URI references
 *                  are considered to be relative to this value.
 * @param rooturi   a root URI for the  session.  URIs that do not start with
 *                  this string cannot be used with this session.
 * @param hname     a handler name to be associated with this handler instance
 */
shuffl.WebDAVStorage = function (baseuri, rooturi, hname)
{
    // Invoke common initializer
    shuffl.WebDAVStorage.prototype.constructor.call(this, baseuri, rooturi, hname);
    this.className = "shuffl.WebDAVStorage";
};

shuffl.WebDAVStorage.canList    = true;
shuffl.WebDAVStorage.canRead    = true;
shuffl.WebDAVStorage.canWrite   = true;
shuffl.WebDAVStorage.canDelete  = true;

shuffl.WebDAVStorage.prototype      = new shuffl.StorageCommon(null, null, null);
shuffl.WebDAVStorage.prototype.name = "WebDAVStorage";    

/**
 * Return information about the resource associated with the supplied URI.
 * 
 * @param uri       a resource URI reference
 * @param callback  is a function called when the outcome of the request is
 *                  known.
 * @return          an object containing information about the identified
 *                  resource, or null if no such resource is accessible to
 *                  this handler.
 * The callback function is called as:
 *    callback(response) {
 *        // this = session object
 *    };
 * where 'response' is an Error value, or an object with the following fields:
 *    uri       the fully qualified URI as a jQuery.uri object.
 *    relref    the URI expressed as relative to the session base URI.
 *    type      'collection' or 'item'
 *    canList   'true' if collection can be listed
 *    canRead   'true' if resource can be read
 *    canWrite  'true' is resource can be modified
 *    canDelete 'true' is resource can be deleted
 */
shuffl.WebDAVStorage.prototype.info = function (uri, callback)
{
    log.debug(this.className+".info "+uri);
    if (!uri)
    {
        callback({ uri: null, relref: null });
        return;
    }
    info = this.resolve(uri);
    log.debug("shuffl.WebDAVStorage.prototype.info "+jQuery.toJSON(info));
    shuffl.ajax.get(info.uri, "text", function (val) {
        if (val instanceof shuffl.Error)
        {
            callback(val);
        }
        else
        {
            callback(
                { uri:        info.uri
                , relref:     info.relref
                , type:       shuffl.ends("/", info.uri) ? "collection" : "item"
                , canList:    shuffl.WebDAVStorage.canList
                , canRead:    shuffl.WebDAVStorage.canRead
                , canWrite:   shuffl.WebDAVStorage.canWrite
                , canDelete:  shuffl.WebDAVStorage.canDelete
                });
        };
    });
};

/**
 * Create a new collection resource.
 * 
 * @param coluri    is the URI reference of an existing collection within 
 *                  which the new collection is created.  The base URI of
 *                  a session can be used as a 'root' collection for this
 * @param colslug   is a suggested URI for the new collection, if a new
 *                  collection is successfully created, the actual URI used is
 *                  returned in the callback response.
 * @param callback  is a function called when the outcome of the request is
 *                  known.
 * 
 * The callback function is called as:
 *    callback(response) {
 *        // this = session object
 *    };
 * where 'response' is an Error value, or an object with the following fields:
 *    uri       the fully qualified URI of the created collection as a 
 *              jQuery.uri object.
 *    relref    the URI expressed as relative to the session base URI.
 */
shuffl.WebDAVStorage.prototype.createCollection = function (coluri, colslug, callback)
{
    ////log.debug(this.className+".createCollection "+coluri+", "+colslug);
    var newuri = shuffl.normalizeUri(coluri,"",true).resolve(colslug).toString();
    jQuery.ajax({
            type:         "MKCOL",
            url:          newuri,
            success:      shuffl.StorageCommon.resolveUriOnSuccess(this, newuri, callback),
            error:        shuffl.ajax.requestFailed(newuri, callback),
            cache:        false
        });
};

/**
 * List entries in a collection.
 * 
 * @param coluri    is the URI reference of a collection to be listed. 
 *                  The base URI of a session can be used as a 'root' 
 *                  collection for enumerating all the collections accessible
 *                  by a session handler.
 * @param callback  is a function called when the outcome of the request is
 *                  known.
 * 
 * The callback function is called as:
 *    callback(response) {
 *        // this = session object
 *    };
 * where 'response' is an Error value, or a list of objects with the following 
 * fields:
 *    uri       the fully qualified URI of a resource within the collection,
 *              returned as a jQuery.uri object.
 *    relref    the URI expressed as relative to the session base URI.
 *    type      'collection' or 'item'
 */
shuffl.WebDAVStorage.prototype.listCollection = function (coluri, callback)
{
    ////log.debug(this.className+".listCollection "+coluri);
    throw new shuffl.Error("shuffl.WebDAVStorage.prototype.listCollection not implemented");
};

/**
 * Delete a collection.
 * 
 * @param coluri    is the URI reference of a collection to be listed. 
 *                  The base URI of a session can be used as a 'root' 
 *                  collection for enumerating all the collections accessible
 *                  by a session handler.
 * @param callback  is a function called when the outcome of the request is
 *                  known.
 * 
 * The callback function is called as:
 *    callback(response) {
 *        // this = session object
 *    };
 * where 'response' is an Error value, or null if the named collection has
 * been successfully deleted.
 */
shuffl.WebDAVStorage.prototype.removeCollection = function (coluri, callback)
{
    ////log.debug(this.className+".removeCollection "+coluri);
    jQuery.ajax({
            type:         "DELETE",
            url:          coluri.toString(),
            //data:         jQuery.toJSON(cardext), 
            //contentType:  "application/json",
            //dataType:     "xml",    // Atom feed info expected as XML
            //beforeSend:   function (xhr, opts) { xhr.setRequestHeader("SLUG", "cardloc"); },
            //dataFilter:   examineRawData,
            success:      shuffl.ajax.decodeResponse(coluri, function (x) { callback(null) }, false),
            error:        shuffl.ajax.requestFailed(coluri, callback),
            //complete:     responseComplete,
            //username:     "...",
            //password:     "...",
            //timeout:      20000,     // Milliseconds
            //async:        true,
            cache:        false
        });
};

/**
 * Create a data resource in a collection.
 * 
 * @param coluri    is the URI reference of an existing collection within 
 *                  which the new resourcve is created.  The base URI of
 *                  a session can be used as a 'root' collection for this.
 * @param slug      is a suggested URI for the new resource.  If a new
 *                  resource is successfully created, the actual URI used is
 *                  returned in the callback response.
 * @param data      is a string or object containing data that is written to
 *                  the created resource.  If a string, it is written verbatim
 *                  as a byte sequence.  If an object, it is converted to a
 *                  suitable representation (JSON) and written.
 * @param callback  is a function called when the outcome of the request is
 *                  known.
 * 
 * The callback function is called as:
 *    callback(response) {
 *        // this = session object
 *    };
 * where 'response' is an Error value, or an object with the following fields:
 *    uri       the fully qualified URI of the created resource as a 
 *              jQuery.uri object.
 *    relref    the URI expressed as relative to the session base URI.
 */
 // TODO: add type parameter
shuffl.WebDAVStorage.prototype.create = function (coluri, slug, data, callback)
{
    ////log.debug(this.className+".create "+coluri+", "+slug);
    var newuri = shuffl.normalizeUri(coluri,"",true).resolve(slug).toString();
    jQuery.ajax({
            type:         "PUT",
            url:          newuri,
            data:         data,
            success:      shuffl.StorageCommon.resolveUriOnSuccess(this, newuri, callback),
            error:        shuffl.ajax.requestFailed(newuri, callback),
            cache:        false
        });
};

/**
 * Read resource data.
 * 
 * @param uri       the URI of a resource to be read.
 * @param callback  is a function called when the outcome of the request is
 *                  known.
 * 
 * The callback function is called as:
 *    callback(response) {
 *        // this = session object
 *    };
 * where 'response' is an Error value, or an object with the following fields:
 *    uri       the fully qualified URI of the created resource as a 
 *              jQuery.uri object.
 *    relref    the URI expressed as relative to the session base URI.
 *    data      the data read, either as an object value if the type of the
 *              data resource could be decoded, otherwise as a string value. 
 */
shuffl.WebDAVStorage.prototype.get = function (uri, callback)
{
    ////log.debug(this.className+".get "+uri);
    this.getData(uri, "text", callback);
};

/**
 * Update resource data.
 * 
 * @param uri       the URI of a resource to be updated.
 * @param data      is a string or object containing data that is written to
 *                  the created resource.  If a string, it is written verbatim
 *                  as a byte sequence.  If an object, it is converted to a
 *                  suitable representation (JSON) and written.
 * @param callback  is a function called when the outcome of the request is
 *                  known.
 * 
 * The callback function is called as:
 *    callback(response) {
 *        // this = session object
 *    };
 * where 'response' is an Error value, or an object with the following fields:
 *    uri       the fully qualified URI of the updated resource as a 
 *              jQuery.uri object.
 *    relref    the URI expressed as relative to the session base URI.
 */
 // TODO: add type parameter
shuffl.WebDAVStorage.prototype.put = function (uri, data, callback)
{
    ////log.debug(this.className+".put "+uri);
    throw "shuffl.WebDAVStorage.prototype.put not implemented";
};

/**
 * Delete a resource.
 * 
 * @param uri       the URI of a resource to be deleted.
 * @param callback  is a function called when the outcome of the request is
 *                  known.
 * 
 * The callback function is called as:
 *    callback(response) {
 *        // this = session object
 *    };
 * where 'response' is an Error value, or null if the named collection has
 * been successfully deleted.
 */
shuffl.WebDAVStorage.prototype.remove = function (uri, callback)
{
    ////log.debug(this.className+".remove "+uri);
    info = this.resolve(uri);
    ////log.debug(this.className+".remove "+info.uri);
    throw "shuffl.WebDAVStorage.prototype.remove not implemented";
};

// ------------------------------------------------
// Initialize on load
// ------------------------------------------------

/**
 * Add to storage handler factories
 * /
shuffl.addStorageHandler( 
    { uri:      "zzzfile:///" http://localhost:8080/exist/shuffl/
    , name:     "zzzLocalFile"
    , factory:  shuffl.WebDAVStorage
    });
*/

// End.
