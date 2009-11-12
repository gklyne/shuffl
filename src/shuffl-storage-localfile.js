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
    alert("shuffl-storage-localfile.js: shuffl-stotrage-common.js must be loaded before this");
};

// ------------------------------------------------
// Local file storage session handler
// ------------------------------------------------

/**
 * Create a local file storage session
 * 
 * @constructor
 * @param baseuri   a base URI for the new session.  Relative URI references
 *                  are considered to be relative to this value.
 */
shuffl.LocalFileStorage = function (baseuri)
{
    ////log.debug("shuffl.LocalFileStorage "+baseuri);
    throw shuffl.Error("shuffl.LocalFileStorage not implemented");
};

/**
 * Resolve a URI handled by the current storage handler session.
 * 
 * @param uri       a URI to be resolved.  This may be a relative URI reference,
 *                  in which case it is interpreted relative to the supplied
 *                  base URI or the base URI for the current session.
 * @param baseuri   if present, a base URI against which the supplied URI is
 *                  resolved.  If relative, this URI is resolved against the
 *                  session base URI.  Typically, this would be used for
 *                  resolving a resource URI relative to a collection.
 * @return          an object containing information about the supplied URI,
 *                  or null if the URI is not handled by the current session.
 * 
 * Fields in the return value include:
 *    uri       the fully qualified URI as a jQuery.uri object.
 *    relref    the URI expressed as relative to the session base URI.
 *    (others may be added as required)
 */
shuffl.LocalFileStorage.prototype.resolve = function (uri, baseuri)
{
    ////log.debug("shuffl.LocalFileStorage.prototype.resolve "+uri+", "+baseuri);
    throw shuffl.Error("shuffl.LocalFileStorage.prototype.resolve not implemented");
};

/**
 * Return information about the resource associated with the supplied URI.
 * 
 * @param uri       a resource URI reference
 * @return          an object containing information about the identified
 *                  resource, or null if no such resoiurce is accessible to
 *                  this handler.
 * 
 * Fields in the return value include:
 *    uri       the fully qualified URI as a jQuery.uri object.
 *    relref    the URI expressed as relative to the session base URI.
 *    type      'collection' or 'item'
 *    canList   'true' if collection can be listed
 *    canRead   'true' if resource can be read
 *    canWrite  'true' is resource can be modified
 *    canDelete 'true' is resource can be deleted
 */
shuffl.LocalFileStorage.prototype.info = function (uri)
{
    ////log.debug("shuffl.LocalFileStorage.prototype.info "+uri);
    throw shuffl.Error("shuffl.LocalFileStorage.prototype.info not implemented");
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
shuffl.LocalFileStorage.prototype.createCollection = 
    function (coluri, colslug, callback)
{
    ////log.debug("shuffl.LocalFileStorage.prototype.createCollection "+coluri+", "+colslug);
    throw shuffl.Error("shuffl.LocalFileStorage.prototype.createCollection not implemented");
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
    throw shuffl.Error("shuffl.LocalFileStorage.prototype.listCollection not implemented");
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
    throw shuffl.Error("shuffl.LocalFileStorage.prototype.removeCollection not implemented");
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
shuffl.LocalFileStorage.prototype.create = 
    function (coluri, slug, data, callback)
{
    ////log.debug("shuffl.LocalFileStorage.prototype.create "+coluri+", "+slug);
    throw shuffl.Error("shuffl.LocalFileStorage.prototype.create not implemented");
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
shuffl.LocalFileStorage.prototype.get = function (uri)
{
    ////log.debug("shuffl.LocalFileStorage.prototype.get "+uri);
    throw shuffl.Error("shuffl.LocalFileStorage.prototype.get not implemented");
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
    throw shuffl.Error("shuffl.LocalFileStorage.prototype.put not implemented");
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
    throw shuffl.Error("shuffl.LocalFileStorage.prototype.remove not implemented");
};

/**
 *   Add to storage handler factories
 */
shuffl.addStorageFactory("file:///", 
    { name:     "LocalFile"
    , factory:  shuffl.LocalFileStorage
    , canRead:  true,
    , canWrite: false
    });

// End.
