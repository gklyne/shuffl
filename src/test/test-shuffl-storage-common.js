/**
 * @fileoverview
 *  Test suite for shuffl-storage-common
 *  
 * @author Graham Klyne
 * @version $Id: test-shuffl-storage-common.js 639 2009-11-11 18:05:13Z gk-google@ninebynine.org $
 * 
 * Coypyright (C) 2009, University of Oxford
 *
 * Licensed under the MIT License.  You may obtain a copy of the license at:
 *
 *     http://www.opensource.org/licenses/mit-license.php
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Test data values
 */

/**
 * Define a dummy storage handler "class" derived from the common handler
 */
TestCommonStorage_DummyStorage = function (baseuri)
{
    // Invoke common initializer
    ////shuffl.StorageCommon.call(this, baseuri);
    this.prototype.constructor.call(this, baseuri);
};

TestCommonStorage_DummyStorage.prototype = new shuffl.StorageCommon(null);

/**
 * Function to register tests
 */
TestCommonStorage = function()
{

    module("TestCommonStorage");

    test("testAAA", function ()
    {
        logtest("testAAA");
        expect(1);
        var val=1;
        var exp=1;
        equals(val, exp, "what");
        same(val, exp, "what");
    });

    test("testBBB", function ()
    {
        logtest("testBBB");
        expect(11);
        log.debug("----- testBBB start -----");
        var m = new shuffl.AsyncComputation();
        m.eval(
            function (val, callback) {
                m.dosomethingBBB(
                    val,
                    paramsBBB, 
                    callback);
            });
        m.exec(initvalBBB,
            function(val) {
                equals(val, expect, "what");
                same(val, expect, "what");
                log.debug("----- testBBB end -----");
                start();
            });
        stop(2000);
    });


--------------------
-- storage handler factory test
-- instantiate two dummy handlers with different base URIs
-- add these hanlers with different names
-- list handlers and check names and properties
-- make session for first handler; check name
-- make session for second handler; check name
// Create Dummy storage handler object
//shuffl.addStorageHandler
shuffl.addStorageFactory("file:///", 
    { name:     "LocalFile"
    , factory:  shuffl.LocalFileStorage
    , canRead:  true,
    , canWrite: false
    });
//shuffl.listStorageHandlers = function ()
//shuffl.makeStorageSession = function (baseuri)
//shuffl.StorageCommon = function (baseuri) ** constructor **
//shuffl.StorageCommon.prototype.handlerName = function ()
--------------------

--------------------
-- instantiate dummy handler
-- add new handler
-- make session for handler
..... factor above as common function
-- resolve URI served by handler
-- resolve URI not served by handler
//shuffl.StorageCommon.prototype.resolve = function (uri, baseuri)
--------------------

--------
//shuffl.StorageCommon.prototype.info = function (uri)
-- instantiate
-- invoke info - should throw error
--------

--------
//shuffl.StorageCommon.prototype.createCollection =  function (coluri, colslug, callback)
-- instantiate
-- invoke createCollection - should throw error
--------


--------
//shuffl.StorageCommon.prototype.listCollection = function (coluri, callback)
-- instantiate
-- invoke function - should throw error
--------

--------
//shuffl.StorageCommon.prototype.removeCollection = function (coluri, callback)
-- instantiate
-- invoke function - should throw error
--------

--------
//shuffl.StorageCommon.prototype.create =  function (coluri, slug, data, callback)
-- instantiate
-- invoke function - should throw error
--------

--------
//shuffl.StorageCommon.prototype.get = function (uri)
-- instantiate
-- invoke function - should throw error
--------

--------
//shuffl.StorageCommon.prototype.put = function (uri, data, callback)
-- instantiate
-- invoke function - should throw error
--------

--------
//shuffl.StorageCommon.prototype.remove = function (uri, callback)
-- instantiate
-- invoke function - should throw error
--------

};

// End
