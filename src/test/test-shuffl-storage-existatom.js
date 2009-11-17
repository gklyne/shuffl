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

var TestExistAtomStorage_baseUri = jQuery.uri();

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
TestExistAtomStorage = function()
{

    module("TestExistAtomStorage");

    test("TestExistAtomStorage", function ()
    {
        logtest("TestExistAtomStorage");
        ok(true, "TestExistAtomStorage running OK");
    });

    test("Storage handler factory", function ()
    {
        logtest("Storage handler factory");
        expect(9);
        // Instatiate dummy handler for two URIs
        shuffl.addStorageHandler(
            { uri:      "http://localhost:8080/dummy1/"
            , name:     "Dummy1"
            , factory:  shuffl.ExistAtomStorage
            });
        shuffl.addStorageHandler(
            { uri:      "http://localhost:8080/dummy2/"
            , name:     "Dummy2"
            , factory:  shuffl.ExistAtomStorage
            });
        // Instantiate session for first handler
        var s1 = shuffl.makeStorageSession("http://localhost:8080/dummy1/foo/bar");
        equals(s1.getHandlerName(), "Dummy1", "s1.handlerName()");
        equals(s1.getRootUri(), "http://localhost:8080/dummy1/", "s1.getRootUri()");
        equals(s1.getBaseUri(), "http://localhost:8080/dummy1/foo/bar", "s1.getBaseUri()");
        // Instantiate session for second handler
        var s2 = shuffl.makeStorageSession("http://localhost:8080/dummy2/foo/bar");
        equals(s2.getHandlerName(), "Dummy2", "s2.handlerName()");
        equals(s2.getRootUri(), "http://localhost:8080/dummy2/", "s2.getRootUri()");
        equals(s2.getBaseUri(), "http://localhost:8080/dummy2/foo/bar", "s2.getBaseUri()");
        // Instantiate session for built-in handler
        var s3 = shuffl.makeStorageSession("http://localhost:8080//foo/bar");
        equals(s3.getHandlerName(), "LocalFile", "s3.handlerName()");
        equals(s3.getRootUri(), "http://localhost:8080//", "s3.getRootUri()");
        equals(s3.getBaseUri(), "http://localhost:8080//foo/bar", "s3.getBaseUri()");
    });

    test("shuffl.ExistAtomStorage.resolve", function ()
    {
        logtest("shuffl.ExistAtomStorage.resolve");
        expect(10);
        this.rooturi = TestExistAtomStorage_baseUri.toString().replace(/(\/\/.[^\/]+\/).*$/,"$1");
        shuffl.addStorageHandler(
            { uri:      this.rooturi
            , name:     "Test"
            , factory:  shuffl.ExistAtomStorage
            });
        var ss = shuffl.makeStorageSession(TestExistAtomStorage_baseUri);
        var b  = TestExistAtomStorage_baseUri;
        equals(ss.resolve("http://localhost:8080/notest/a/b").uri, null, "Unresolved URI");
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
        ////this.rooturi = TestExistAtomStorage_baseUri.toString().replace(/(\/\/.[^\/]+\/).*$/,"$1");
        this.rooturi = TestExistAtomStorage_baseUri.toString().replace(/\/[^\/]*$/,"/");
        shuffl.addStorageHandler(
            { uri:      this.rooturi
            , name:     "Test"
            , factory:  shuffl.ExistAtomStorage
            });
        // Instantiate session for first handler
        return shuffl.makeStorageSession(TestExistAtomStorage_baseUri);
    }

    test("shuffl.ExistAtomStorage.info", function ()
    {
        logtest("shuffl.ExistAtomStorage.info");
        expect(8);
        log.debug("----- test shuffl.ExistAtomStorage.info start -----");
        var m = new shuffl.AsyncComputation();
        var ss = createTestSession();
        m.eval(
            function (val, callback) {
                try
                {
                    ss.info("data/test-csv.csv", callback);
                    ok(true, "shuffl.ExistAtomStorage.info no exception");
                }
                catch (e)
                {
                    log.debug("shuffl.ExistAtomStorage.info exception: "+e);
                    ok(false, "shuffl.ExistAtomStorage.info exception"+e);
                    callback(e);
                };
            });
        m.eval(
            function (val, callback) {
                var b = TestExistAtomStorage_baseUri;
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
                    ok(true, "shuffl.ExistAtomStorage.info no exception");
                }
                catch (e)
                {
                    log.debug("shuffl.ExistAtomStorage.info exception: "+e);
                    ok(false, "shuffl.ExistAtomStorage.info exception"+e);
                    callback(e);
                };
            });
        m.eval(
            function (val, callback) {
                var b = TestExistAtomStorage_baseUri;
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
                log.debug("----- test shuffl.ExistAtomStorage.info end -----");
                start();
            });
        stop(2000);
    });

    test("shuffl.ExistAtomStorage.info (non-existent resource)", function ()
    {
        logtest("shuffl.ExistAtomStorage.info");
        expect(2);
        log.debug("----- test shuffl.ExistAtomStorage.info (non-existent resource) start -----");
        var m = new shuffl.AsyncComputation();
        var ss = createTestSession();
        m.eval(
            function (val, callback) {
                try
                {
                    ss.info("data/test-csv.nodata", function (val) {
                        ok(true, "shuffl.ExistAtomStorage.info no exception");
                        callback(val);
                    });
                }
                catch (e)
                {
                    log.debug("shuffl.ExistAtomStorage.info exception: "+e);
                    ok(false, "shuffl.ExistAtomStorage.info exception"+e);
                    callback(e);
                }
            });
        m.exec({},
            function(val) {
                ////equals(val, null, "val");
                ////equals(val.toString(), "shuffl error: Request failed (error; HTTP status: 404 Not Found)", "val");
                equals(val.msg, "Request failed", "val.msg");
                log.debug("----- test shuffl.ExistAtomStorage.info (non-existent resource) end -----");
                start();
            });
        stop(2000);
    });

    test("shuffl.ExistAtomStorage.createCollection", function ()
    {
        logtest("shuffl.ExistAtomStorage.createCollection");
        var ss = createTestSession();
        try
        {
            ss.createCollection("a/b/", "c", shuffl.noop);
            ok(false, "shuffl.ExistAtomStorage.createCollection exception expected");
        }
        catch (e)
        {
            log.debug("shuffl.ExistAtomStorage.createCollection exception: "+e);
            ok(true, "shuffl.ExistAtomStorage.createCollection exception expected");
            ok(e.toString().match(/not implemented/), "Not implemented");
        }
    });

    test("shuffl.ExistAtomStorage.listCollection", function ()
    {
        logtest("shuffl.ExistAtomStorage.listCollection");
        var ss = createTestSession();
        try
        {
            ss.listCollection("a/b/", shuffl.noop);
            ok(false, "shuffl.ExistAtomStorage.listCollection exception expected");
        }
        catch (e)
        {
            log.debug("shuffl.ExistAtomStorage.listCollection exception: "+e);
            ok(true, "shuffl.ExistAtomStorage.listCollection exception expected");
            ok(e.toString().match(/not implemented/), "Not implemented");
        }
    });

    test("shuffl.ExistAtomStorage.removeCollection", function ()
    {
        logtest("shuffl.ExistAtomStorage.removeCollection");
        var ss = createTestSession();
        try
        {
            ss.removeCollection("a/b/", shuffl.noop);
            ok(false, "shuffl.ExistAtomStorage.removeCollection exception expected");
        }
        catch (e)
        {
            log.debug("shuffl.ExistAtomStorage.removeCollection exception: "+e);
            ok(true, "shuffl.ExistAtomStorage.removeCollection exception expected");
            ok(e.toString().match(/not implemented/), "Not implemented");
        }
    });

    test("shuffl.ExistAtomStorage.create", function ()
    {
        logtest("shuffl.ExistAtomStorage.create");
        var ss = createTestSession();
        try
        {
            ss.create("a/b/", "c", "data for new item", shuffl.noop);
            ok(false, "shuffl.ExistAtomStorage.create exception expected");
        }
        catch (e)
        {
            log.debug("shuffl.ExistAtomStorage.create exception: "+e);
            ok(true, "shuffl.ExistAtomStorage.create exception expected");
            ok(e.toString().match(/not implemented/), "Not implemented");
        }
    });

    test("shuffl.ExistAtomStorage.get", function ()
    {
        logtest("shuffl.ExistAtomStorage.get");
        expect(6);
        log.debug("----- test shuffl.ExistAtomStorage.get start -----");
        var m = new shuffl.AsyncComputation();
        var ss = createTestSession();
        m.eval(
            function (val, callback) {
                try
                {
                    ss.get("data/test-csv.csv", function (val) {
                        ok(true, "shuffl.ExistAtomStorage.get no exception");
                        callback(val);
                    });
                }
                catch (e)
                {
                    log.debug("shuffl.ExistAtomStorage.get exception: "+e);
                    ok(false, "shuffl.ExistAtomStorage.get exception: "+e);
                    callback(e);
                }
            });
        m.eval(
            function (val, callback) {
                var b = TestExistAtomStorage_baseUri;
                equals(val.uri,    b.resolve("data/test-csv.csv").toString(), "val.uri");
                equals(val.relref, "data/test-csv.csv", "val.relref");
                equals(typeof val.data, typeof test_csv, "typeof val.data");
                equals(val.data,        test_csv,        "val.data");
                equals(jQuery.toJSON(val.data), jQuery.toJSON(test_csv), "val.data");
                callback(val);
            });
        m.exec({},
            function(val) {
                log.debug("----- test shuffl.ExistAtomStorage.get end -----");
                start();
            });
        stop(2000);
    });

    test("shuffl.ExistAtomStorage.put", function ()
    {
        logtest("shuffl.ExistAtomStorage.put");
        var ss = createTestSession();
        try
        {
            ss.put("a/b/", "data for replaced item", shuffl.noop);
            ok(false, "shuffl.ExistAtomStorage.put exception expected");
        }
        catch (e)
        {
            log.debug("shuffl.ExistAtomStorage.put exception: "+e);
            ok(true, "shuffl.ExistAtomStorage.put exception expected");
            ok(e.toString().match(/not implemented/), "Not implemented");
        }
    });

    test("shuffl.ExistAtomStorage.remove", function ()
    {
        logtest("shuffl.ExistAtomStorage.remove");
        var ss = createTestSession();
        try
        {
            ss.remove("a/b/", shuffl.noop);
            ok(false, "shuffl.ExistAtomStorage.remove exception expected");
        }
        catch (e)
        {
            log.debug("shuffl.ExistAtomStorage.remove exception: "+e);
            ok(true, "shuffl.ExistAtomStorage.remove exception expected");
            ok(e.toString().match(/not implemented/), "Not implemented");
        }
    });

};

// End
