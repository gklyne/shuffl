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
 * Constructor for a dummy storage handler "class" derived from the 
 * common handler.
 */
TestCommonStorage_DummyStorage = function (baseuri, rooturi, hname)
{
    // Invoke common initializer
    TestCommonStorage_DummyStorage.prototype.constructor.call(this, baseuri, rooturi, hname);
};

TestCommonStorage_DummyStorage.canList    = false;
TestCommonStorage_DummyStorage.canRead    = true;
TestCommonStorage_DummyStorage.canWrite   = false;
TestCommonStorage_DummyStorage.canDelete  = false;

TestCommonStorage_DummyStorage.prototype      = new shuffl.StorageCommon(null, null, null);
TestCommonStorage_DummyStorage.prototype.name = "TestCommonStorage_DummyStorage";    

/**
 * Function to register tests
 */
TestCommonStorage = function()
{

    module("TestCommonStorage");

    test("TestCommonStorage", function ()
    {
        logtest("TestCommonStorage");
        ok(true, "TestCommonStorage running OK");
    });

    test("Storage handler registry", function ()
    {
        logtest("Storage handler registry");
        expect(3);
        // Instatiate dummy handler for two URIs
        shuffl.addStorageHandler(
            { uri:      "file://dummy1/"
            , name:     "Dummy1"
            , factory:  TestCommonStorage_DummyStorage
            });
        shuffl.addStorageHandler(
            { uri:      "file://dummy2/"
            , name:     "Dummy2"
            , factory:  TestCommonStorage_DummyStorage
            });
        // List registered storage handlers
        var shlist = shuffl.listStorageHandlers()
        equals(shlist.length, 2, "Storage handler list length");
        var h1 =
            { uri:        "file://dummy1/"
            , name:       "Dummy1"
            , canList:    false
            , canRead:    true
            , canWrite:   false
            , canDelete:  false
            };
        same(shlist[0], h1, "First handler added");
        var h2 =
            { uri:        "file://dummy2/"
            , name:       "Dummy2"
            , canList:    false
            , canRead:    true
            , canWrite:   false
            , canDelete:  false
            };
        same(shlist[1], h2, "Second handler added");
    });

    test("Storage handler factory", function ()
    {
        logtest("Storage handler factory");
        expect(6);
        // Instatiate dummy handler for two URIs
        shuffl.addStorageHandler(
            { uri:      "file://dummy1/"
            , name:     "Dummy1"
            , factory:  TestCommonStorage_DummyStorage
            });
        shuffl.addStorageHandler(
            { uri:      "file://dummy2/"
            , name:     "Dummy2"
            , factory:  TestCommonStorage_DummyStorage
            });
        // Instantiate session for first handler
        var s1 = shuffl.makeStorageSession("file://dummy1/foo/bar");
        equals(s1.getHandlerName(), "Dummy1", "s1.handlerName()");
        equals(s1.getRootUri(), "file://dummy1/", "s1.getRootUri()");
        equals(s1.getBaseUri(), "file://dummy1/foo/bar", "s1.getBaseUri()");
        // Instantiate session for second handler
        var s2 = shuffl.makeStorageSession("file://dummy2/foo/bar");
        equals(s2.getHandlerName(), "Dummy2", "s2.handlerName()");
        equals(s2.getRootUri(), "file://dummy2/", "s2.getRootUri()");
        equals(s2.getBaseUri(), "file://dummy2/foo/bar", "s2.getBaseUri()");
    });

    function createTestSession()
    {
        // Instatiate dummy handler
        shuffl.addStorageHandler(
            { uri:      "file://test/"
            , name:     "Test"
            , factory:  TestCommonStorage_DummyStorage
            });
        // Instantiate session for first handler
        return shuffl.makeStorageSession("file://test/base/path?query");
    }

    test("shuffl.StorageCommon.resolve", function ()
    {
        logtest("shuffl.StorageCommon.resolve");
        expect(6);
        var ss = createTestSession();
        equals(ss.resolve("file://notest/a/b"), null, "Unresolved URI");
        equals(ss.resolve("file://test/a/b"), "file://test/a/b", "Match absolute URI");
        equals(ss.resolve("/a/b"), "file://test/a/b", "Match URI reference");
        equals(ss.resolve("a/b"), "file://test/base/a/b", "Match relative URI reference");
        equals(ss.resolve("?q"), "file://test/base/path?q", "Match query URI reference");
        equals(ss.resolve("#f"), "file://test/base/path?query#f", "Match fragment URI reference");
    });



/*
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
*/


/*

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

*/

};

// End
