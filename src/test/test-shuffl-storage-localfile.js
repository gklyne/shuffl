/**
 * @fileoverview
 *  Test suite for 00-skeleton
 *  
 * @author Graham Klyne
 * @version $Id: test-00-skeleton.js 639 2009-11-11 18:05:13Z gk-google@ninebynine.org $
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

var TestLocalFileStorage_baseUri = jQuery.uri();

var test_csv =
    "rowlabel,col1,col2,col3,col4\n"+
    "row1,a1,b1,c1,d1\n"+
    " row2 , a2 , b2 , c2 , d2 \n"+ 
    " row3 , a3 3a , b3 3b , c3 3c , d3 3d \n"+
    " ' row4 ' , ' a4 ' , ' b4 ' , ' c4 ' , ' d4 ' \n"+ 
    ' " row5 " , " a5 " , " b5 " , " c5 " , " d5 " \n'+
    " 'row6' , 'a6,6a' , 'b6,6b' , 'c6,6c' , 'd6,6d' \n"+
    " 'row7' , 'a7''7a' , 'b7''7b' , 'c7''7c' , 'd7''7d' \n"+
    " 'row8' , 'a8'', 8a' , 'b8'', 8b' , 'c8'', 8c' , 'd8'', 8d' \n"+
    "End.";

/**
 * Function to register tests
 */
TestLocalFileStorage = function()
{

    module("TestLocalFileStorage");

    test("TestLocalFileStorage", function ()
    {
        logtest("TestLocalFileStorage");
        shuffl.resetStorageHandlers();
        shuffl.addStorageHandler( 
            { uri:      "file:///"
            , name:     "LocalFile"
            , factory:  shuffl.LocalFileStorage
            });
        ok(true, "TestLocalFileStorage running OK");
    });

    test("Storage handler factory", function ()
    {
        logtest("Storage handler factory");
        expect(9);
        // Instatiate dummy handler for two URIs
        shuffl.addStorageHandler(
            { uri:      "file://dummy1/"
            , name:     "Dummy1"
            , factory:  shuffl.LocalFileStorage
            });
        shuffl.addStorageHandler(
            { uri:      "file://dummy2/"
            , name:     "Dummy2"
            , factory:  shuffl.LocalFileStorage
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
        // Instantiate session for built-in handler
        var s3 = shuffl.makeStorageSession("file:///foo/bar");
        equals(s3.getHandlerName(), "LocalFile", "s3.handlerName()");
        equals(s3.getRootUri(), "file:///", "s3.getRootUri()");
        equals(s3.getBaseUri(), "file:///foo/bar", "s3.getBaseUri()");
    });

    test("shuffl.LocalFileStorage.resolve", function ()
    {
        logtest("shuffl.LocalFileStorage.resolve");
        expect(10);
        this.rooturi = TestLocalFileStorage_baseUri.toString().replace(/(\/\/.[^\/]+\/).*$/,"$1");
        shuffl.addStorageHandler(
            { uri:      this.rooturi
            , name:     "Test"
            , factory:  shuffl.LocalFileStorage
            });
        var ss = shuffl.makeStorageSession(TestLocalFileStorage_baseUri);
        var b  = TestLocalFileStorage_baseUri;
        equals(ss.resolve("file://notest/a/b").uri, null, "Unresolved URI");
        equals(ss.resolve(b+"/a/b").uri, b+"/a/b", "Match absolute URI");
        equals(ss.resolve("a/b").uri, b.resolve("a/b").toString(), "Match relative URI reference");
        equals(ss.resolve("?q").uri, b+"?q", "Match query URI reference");
        equals(ss.resolve("#f").uri, b+"#f", "Match fragment URI reference");
        var s4 = shuffl.makeStorageSession(this.rooturi+"p/q/a/");
        equals(s4.resolve(this.rooturi+"p/q/a/b").relref, "b",      "s4.resolve(p/q/a/b).relref");
        equals(s4.resolve(this.rooturi+"p/q/x/y").relref, "../x/y", "s4.resolve(p/q/x/y).relref");
        var s5 = shuffl.makeStorageSession(this.rooturi+"p/q/a/b");
        equals(s5.resolve(this.rooturi+"p/q/a/b").relref, "",       "s5.resolve(p/q/a/b).relref");
        equals(s5.resolve(this.rooturi+"p/q/a/c").relref, "c",      "s5.resolve(p/q/a/c).relref");
        equals(s5.resolve(this.rooturi+"p/q/x/y").relref, "../x/y", "s5.resolve(p/q/x/y).relref");
    });

    function createTestSession()
    {
        // Instatiate dummy handler
        ////this.rooturi = TestLocalFileStorage_baseUri.toString().replace(/(\/\/.[^\/]+\/).*$/,"$1");
        this.rooturi = TestLocalFileStorage_baseUri.toString().replace(/\/[^\/]*$/,"/");
        shuffl.addStorageHandler(
            { uri:      this.rooturi
            , name:     "Test"
            , factory:  shuffl.LocalFileStorage
            });
        // Instantiate session for first handler
        return shuffl.makeStorageSession(TestLocalFileStorage_baseUri);
    }

    test("shuffl.LocalFileStorage.info", function ()
    {
        logtest("shuffl.LocalFileStorage.info");
        expect(8);
        log.debug("----- test shuffl.LocalFileStorage.info start -----");
        var m = new shuffl.AsyncComputation();
        var ss = createTestSession();
        m.eval(
            function (val, callback) {
                try
                {
                    ss.info("data/test-csv.csv", callback);
                    ok(true, "shuffl.LocalFileStorage.info no exception");
                }
                catch (e)
                {
                    log.debug("shuffl.LocalFileStorage.info exception: "+e);
                    ok(false, "shuffl.LocalFileStorage.info exception"+e);
                    callback(e);
                };
            });
        m.eval(
            function (val, callback) {
                var b = TestLocalFileStorage_baseUri;
                equals(val.uri,       b.resolve("data/test-csv.csv").toString(), "val.uri");
                equals(val.relref,    "data/test-csv.csv", "val.relref");
                equals(val.type,      "item", "val.type");
                equals(val.canList,   false, "val.canList");
                equals(val.canRead,   true,  "val.canRead");
                equals(val.canWrite,  false, "val.canWrite");
                equals(val.canDelete, false, "val.canDelete");
                callback(val);
            });
        // --- only works for HTTP ---
        /*
        m.eval(
            function (val, callback) {
                try
                {
                    ss.info("data/", callback);
                    ok(true, "shuffl.LocalFileStorage.info no exception");
                }
                catch (e)
                {
                    log.debug("shuffl.LocalFileStorage.info exception: "+e);
                    ok(false, "shuffl.LocalFileStorage.info exception"+e);
                    callback(e);
                };
            });
        m.eval(
            function (val, callback) {
                var b = TestLocalFileStorage_baseUri;
                equals(val.uri,       b.resolve("data/").toString(), "val.uri");
                equals(val.relref,    "data/", "val.relref");
                equals(val.type,      "collection", "val.type");
                equals(val.canList,   false, "val.canList");
                equals(val.canRead,   true,  "val.canRead");
                equals(val.canWrite,  false, "val.canWrite");
                equals(val.canDelete, false, "val.canDelete");
                callback(val);
            });
        */
        m.exec({},
            function(val) {
                log.debug("----- test shuffl.LocalFileStorage.info end -----");
                start();
            });
        stop(2000);
    });

    test("shuffl.LocalFileStorage.info (non-existent resource)", function ()
    {
        logtest("shuffl.LocalFileStorage.info");
        expect(2);
        log.debug("----- test shuffl.LocalFileStorage.info (non-existent resource) start -----");
        var m = new shuffl.AsyncComputation();
        var ss = createTestSession();
        m.eval(
            function (val, callback) {
                try
                {
                    ss.info("data/test-csv.nodata", function (val) {
                        ok(true, "shuffl.LocalFileStorage.info no exception");
                        callback(val);
                    });
                }
                catch (e)
                {
                    log.debug("shuffl.LocalFileStorage.info exception: "+e);
                    ok(false, "shuffl.LocalFileStorage.info exception"+e);
                    callback(e);
                }
            });
        m.exec({},
            function(val) {
                ////equals(val, null, "val");
                ////equals(val.toString(), "shuffl error: Request failed (error; HTTP status: 404 Not Found)", "val");
                equals(val.msg, "Request failed", "val.msg");
                log.debug("----- test shuffl.LocalFileStorage.info (non-existent resource) end -----");
                start();
            });
        stop(2000);
    });

    test("shuffl.LocalFileStorage.createCollection", function ()
    {
        logtest("shuffl.LocalFileStorage.createCollection");
        var ss = createTestSession();
        try
        {
            ss.createCollection("a/b/", "c", shuffl.noop);
            ok(false, "shuffl.LocalFileStorage.createCollection exception expected");
        }
        catch (e)
        {
            log.debug("shuffl.LocalFileStorage.createCollection exception: "+e);
            ok(true, "shuffl.LocalFileStorage.createCollection exception expected");
            ok(e.toString().match(/not implemented/), "Not implemented");
        }
    });

    test("shuffl.LocalFileStorage.listCollection", function ()
    {
        logtest("shuffl.LocalFileStorage.listCollection");
        var ss = createTestSession();
        try
        {
            ss.listCollection("a/b/", shuffl.noop);
            ok(false, "shuffl.LocalFileStorage.listCollection exception expected");
        }
        catch (e)
        {
            log.debug("shuffl.LocalFileStorage.listCollection exception: "+e);
            ok(true, "shuffl.LocalFileStorage.listCollection exception expected");
            ok(e.toString().match(/not implemented/), "Not implemented");
        }
    });

    test("shuffl.LocalFileStorage.removeCollection", function ()
    {
        logtest("shuffl.LocalFileStorage.removeCollection");
        var ss = createTestSession();
        try
        {
            ss.removeCollection("a/b/", shuffl.noop);
            ok(false, "shuffl.LocalFileStorage.removeCollection exception expected");
        }
        catch (e)
        {
            log.debug("shuffl.LocalFileStorage.removeCollection exception: "+e);
            ok(true, "shuffl.LocalFileStorage.removeCollection exception expected");
            ok(e.toString().match(/not implemented/), "Not implemented");
        }
    });

    test("shuffl.LocalFileStorage.create", function ()
    {
        logtest("shuffl.LocalFileStorage.create");
        var ss = createTestSession();
        try
        {
            ss.create("a/b/", "c", "data for new item", shuffl.noop);
            ok(false, "shuffl.LocalFileStorage.create exception expected");
        }
        catch (e)
        {
            log.debug("shuffl.LocalFileStorage.create exception: "+e);
            ok(true, "shuffl.LocalFileStorage.create exception expected");
            ok(e.toString().match(/not implemented/), "Not implemented");
        }
    });

    test("shuffl.LocalFileStorage.get", function ()
    {
        logtest("shuffl.LocalFileStorage.get");
        expect(6);
        log.debug("----- test shuffl.LocalFileStorage.get start -----");
        var m = new shuffl.AsyncComputation();
        var ss = createTestSession();
        m.eval(
            function (val, callback) {
                try
                {
                    ss.get("data/test-csv.csv", function (val) {
                        ok(true, "shuffl.LocalFileStorage.get no exception");
                        callback(val);
                    });
                }
                catch (e)
                {
                    log.debug("shuffl.LocalFileStorage.get exception: "+e);
                    ok(false, "shuffl.LocalFileStorage.get exception: "+e);
                    callback(e);
                }
            });
        m.eval(
            function (val, callback) {
                var b = TestLocalFileStorage_baseUri;
                equals(val.uri,    b.resolve("data/test-csv.csv").toString(), "val.uri");
                equals(val.relref, "data/test-csv.csv", "val.relref");
                equals(typeof val.data, typeof test_csv, "typeof val.data");
                equals(val.data,        test_csv,        "val.data");
                equals(jQuery.toJSON(val.data), jQuery.toJSON(test_csv), "val.data");
                callback(val);
            });
        m.exec({},
            function(val) {
                log.debug("----- test shuffl.LocalFileStorage.get end -----");
                start();
            });
        stop(2000);
    });

    test("shuffl.LocalFileStorage.put", function ()
    {
        logtest("shuffl.LocalFileStorage.put");
        var ss = createTestSession();
        try
        {
            ss.put("a/b/", "data for replaced item", shuffl.noop);
            ok(false, "shuffl.LocalFileStorage.put exception expected");
        }
        catch (e)
        {
            log.debug("shuffl.LocalFileStorage.put exception: "+e);
            ok(true, "shuffl.LocalFileStorage.put exception expected");
            ok(e.toString().match(/not implemented/), "Not implemented");
        }
    });

    test("shuffl.LocalFileStorage.remove", function ()
    {
        logtest("shuffl.LocalFileStorage.remove");
        var ss = createTestSession();
        try
        {
            ss.remove("a/b/", shuffl.noop);
            ok(false, "shuffl.LocalFileStorage.remove exception expected");
        }
        catch (e)
        {
            log.debug("shuffl.LocalFileStorage.remove exception: "+e);
            ok(true, "shuffl.LocalFileStorage.remove exception expected");
            ok(e.toString().match(/not implemented/), "Not implemented");
        }
    });

};

// End