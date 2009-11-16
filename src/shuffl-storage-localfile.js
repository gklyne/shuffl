/**
 * @fileoverview
 *  Shuffl storage access framework.  This module defines storage session 
 *  discovery and factory methods, and also defines a default storage object 
 *  that performs read-only access to the local file system.
 * 
 *  Each storage handler is associated with a hierarchical-form URI.  All URIs
 *  that fall hierachically under that URI must be accessed using the 
 *  corresponding storage handler.
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

// ------------------------------------------------
// Global data
// ------------------------------------------------
 
/**
 * Check for shuffl and shuffl.stoage namespaces
 */
if (typeof shuffl == "undefined") 
{
    alert("shuffl-storage-localfile.js: shuffl-base.js must be loaded first");
};
if (typeof shuffl.storage == "undefined") 
{
    alert("shuffl-storage-localfile.js: shuffl-storage-common.js must be loaded before this");
};

// ------------------------------------------------
// Local file storage session handler
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
shuffl.LocalFileStorage = function (baseuri, rooturi, hname)
{
    // Invoke common initializer
    shuffl.LocalFileStorage.prototype.constructor.call(this, baseuri, rooturi, hname);
};

shuffl.LocalFileStorage.canList    = false;
shuffl.LocalFileStorage.canRead    = true;
shuffl.LocalFileStorage.canWrite   = false;
shuffl.LocalFileStorage.canDelete  = false;

shuffl.LocalFileStorage.prototype      = new shuffl.StorageCommon(null, null, null);
shuffl.LocalFileStorage.prototype.name = "LocalFileStorage";    

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
shuffl.LocalFileStorage.prototype.info = function (uri, callback)
{
    ////log.debug("shuffl.LocalFileStorage.prototype.info "+uri);
    info = this.resolve(uri);
    ////log.debug("shuffl.LocalFileStorage.prototype.info "+jQuery.toJSON(info));
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
                , canList:    shuffl.LocalFileStorage.canList
                , canRead:    shuffl.LocalFileStorage.canRead
                , canWrite:   shuffl.LocalFileStorage.canWrite
                , canDelete:  shuffl.LocalFileStorage.canDelete
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
shuffl.LocalFileStorage.prototype.createCollection = function (coluri, colslug, callback)
{
    ////log.debug("shuffl.LocalFileStorage.prototype.createCollection "+coluri+", "+colslug);
    throw new shuffl.Error("shuffl.LocalFileStorage.prototype.createCollection not implemented");
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
shuffl.LocalFileStorage.prototype.listCollection = function (coluri, callback)
{
    ////log.debug("shuffl.LocalFileStorage.prototype.listCollection "+coluri);
    throw new shuffl.Error("shuffl.LocalFileStorage.prototype.listCollection not implemented");
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
shuffl.LocalFileStorage.prototype.removeCollection = function (coluri, callback)
{
    ////log.debug("shuffl.LocalFileStorage.prototype.removeCollection "+coluri);
    throw new shuffl.Error("shuffl.LocalFileStorage.prototype.removeCollection not implemented");
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
shuffl.LocalFileStorage.prototype.create = function (coluri, slug, data, callback)
{
    ////log.debug("shuffl.LocalFileStorage.prototype.create "+coluri+", "+slug);
    throw new shuffl.Error("shuffl.LocalFileStorage.prototype.create not implemented");
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
shuffl.LocalFileStorage.prototype.get = function (uri, callback)
{
    ////log.debug("shuffl.LocalFileStorage.prototype.get "+uri);
    info = this.resolve(uri);
    ////log.debug("shuffl.LocalFileStorage.prototype.info "+jQuery.toJSON(info));
    shuffl.ajax.get(info.uri, "text", function (val) {
        if (!(val instanceof shuffl.Error))
        {
            val =
                { uri:        info.uri
                , relref:     info.relref
                , data:       val
                };
        };
        callback(val);
    });
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
shuffl.LocalFileStorage.prototype.put = function (uri, data, callback)
{
    ////log.debug("shuffl.LocalFileStorage.prototype.put "+uri);
    throw new shuffl.Error("shuffl.LocalFileStorage.prototype.put not implemented");
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
shuffl.LocalFileStorage.prototype.remove = function (uri, callback)
{
    ////log.debug("shuffl.LocalFileStorage.prototype.remove "+uri);
    throw new shuffl.Error("shuffl.LocalFileStorage.prototype.remove not implemented");
};

/**
 *   Add to storage handler factories
 */
shuffl.addStorageHandler( 
    { uri:      "file:///"
    , name:     "LocalFile"
    , factory:  shuffl.LocalFileStorage
    });

// End.
