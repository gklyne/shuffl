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

// ------------------------------------------------
// Global data
// ------------------------------------------------

// ------------------------------------------------
// Storage handler discovery and session factory
// ------------------------------------------------

/**
 * List storage handler URIs, and the associated capabilities.
 * 
 * @return          a list of entries, where each entry is an object with the
 *                  fields described below.
 * 
 * Storage handler description fields:
 *    uri       root URI serviced by the storage handler
 *    canRead   'true' if the handler can read data resources identified by 
 *              the associated URIs
 *    canWrite  'true' if the handler can write data resources identified by 
 *              the associated URIs
 */
shuffl.listStorageHandlers = function ()
{
    ////log.debug("shuffl.listStorageHandlers");
    throw shuffl.Error("shuffl.listStorageHandlers not implemented");
    return [];
};

/**
 * Create a storage handler session, and return an object for performing
 * operations in that session.
 * 
 * @param baseuri   a base URI for the new session.  Relative URI references
 *                  are considered to be relative to this value.
 * @return          a new storage session object is returned, or null if no 
 *                  handler is available to service the specified URI.
 */
shuffl.makeStorageSession = function (baseuri)
{
    ////log.debug("shuffl.makeStorageSession "+baseuri);
    throw shuffl.Error("shuffl.makeStorageSession not implemented");
    return null;
};

// ------------------------------------------------
// Local storage session handler base class
// ------------------------------------------------

// TODO: factor out

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
 * @param uri       A URI to be resolved.  This may be a relative URI reference,
 *                  in which case it is interpreted relative to the base URI
 *                  for the current session.
 * @return          an object containing information about the supplied URI,
 *                  or null if the URI is not handled by the current session.
 * 
 * Fields in the return value include:
 *    uri       the fully qualified URI as a jQuery.uri object.
 *    relref    the URI expressed as relative to the session base URI.
 *    (others may be added as required)
 */
shuffl.LocalFileStorage.prototype.resolve = function (uri)
{
    ////log.debug("shuffl.LocalFileStorage.prototype.resolve "+uri);
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
shuffl.LocalFileStorage.prototype.info = function (aaaa, bbbb)
{
    ////log.debug("shuffl.LocalFileStorage.prototype.info "+aaaa+", "+bbbb);
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
 *    type      is set to 'collection'
 */
shuffl.LocalFileStorage.prototype.createCollection = 
    function (coluri, colslug, callback)
{
    ////log.debug("shuffl.LocalFileStorage.prototype.createCollection "+aaaa+", "+bbbb);
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
    ////log.debug("shuffl.LocalFileStorage.prototype.listCollection "+aaaa+", "+bbbb);
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
 * beed successfully deleted.
 */
shuffl.LocalFileStorage.prototype.deleteCollection = function (aaaa, bbbb)
{
    ////log.debug("shuffl.LocalFileStorage.prototype.deleteCollection "+aaaa+", "+bbbb);
    throw shuffl.Error("shuffl.LocalFileStorage.prototype.deleteCollection not implemented");
};

/**
 * .....
 * 
 * @param aaaa      zzzzzz
 * @param bbbb      zzzzzz
 * @return          zzzzzz
 */
shuffl.LocalFileStorage.prototype.create = function (aaaa, bbbb)
{
    ////log.debug("shuffl.LocalFileStorage.prototype.create "+aaaa+", "+bbbb);
    throw shuffl.Error("shuffl.LocalFileStorage.prototype.create not implemented");
};

/**
 * .....
 * 
 * @param aaaa      zzzzzz
 * @param bbbb      zzzzzz
 * @return          zzzzzz
 */
shuffl.LocalFileStorage.prototype.get = function (aaaa, bbbb)
{
    ////log.debug("shuffl.LocalFileStorage.prototype.get "+aaaa+", "+bbbb);
    throw shuffl.Error("shuffl.LocalFileStorage.prototype.get not implemented");
};

/**
 * .....
 * 
 * @param aaaa      zzzzzz
 * @param bbbb      zzzzzz
 * @return          zzzzzz
 */
shuffl.LocalFileStorage.prototype.put = function (aaaa, bbbb)
{
    ////log.debug("shuffl.LocalFileStorage.prototype.put "+aaaa+", "+bbbb);
    throw shuffl.Error("shuffl.LocalFileStorage.prototype.put not implemented");
};

/**
 * .....
 * 
 * @param aaaa      zzzzzz
 * @param bbbb      zzzzzz
 * @return          zzzzzz
 */
shuffl.LocalFileStorage.prototype.remove = function (aaaa, bbbb)
{
    ////log.debug("shuffl.LocalFileStorage.prototype.remove "+aaaa+", "+bbbb);
    throw shuffl.Error("shuffl.LocalFileStorage.prototype.remove not implemented");
};

/**
 * .....
 * 
 * @param aaaa      zzzzzz
 * @param bbbb      zzzzzz
 * @return          zzzzzz
 */
shuffl.LocalFileStorage.prototype.ffffff = function (aaaa, bbbb)
{
    ////log.debug("shuffl.LocalFileStorage.prototype.ffffff "+aaaa+", "+bbbb);
    throw shuffl.Error("shuffl.LocalFileStorage.prototype.ffffff not implemented");
};

// End.
