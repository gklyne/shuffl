/**
 * @fileoverview
 *  Test suite for shuffl-data-readwrite
 *  
 * @author Graham Klyne
 * @version $Id: test-shuffl-data-readwrite.js 840 2010-06-18 09:50:42Z gk-google@ninebynine.org $
 * 
 * Coypyright (C) 2010, University of Oxford
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
 * Figure root URI based on page URI
 */
var TestDataReadWrite_rootUri_list =
    [ "http://localhost/webdav/"
    , "http://zoo-samos.zoo.ox.ac.uk/webdav/"
    , "http://tinos.zoo.ox.ac.uk/webdav/"
    ];
var TestDataReadWrite_rootUri = null;
var TestDataReadWrite_pageUri = jQuery.uri().toString();
for (i in TestDataReadWrite_rootUri_list)
{
    var r =  TestDataReadWrite_rootUri_list[i];
    if (shuffl.starts(r, TestDataReadWrite_pageUri))
    {
        TestDataReadWrite_rootUri = r;
    }
}
var TestDataReadWrite_baseUri = TestDataReadWrite_rootUri+"shuffltest/";

/**
 * Test data values
 */
TestDataReadWrite_workspace_data =
    { "__prefixes":
      { "shuffl:": "http://purl.org/NET/Shuffl/vocab#"
      , "rdf:":    "http://www.w3.org/1999/02/22-rdf-syntax-ns#"
      , "rdfs:":   "http://www.w3.org/2000/01/rdf-schema#"
      , "owl:":    "http://www.w3.org/2002/07/owl#"
      , "xsd:":    "http://www.w3.org/2001/XMLSchema#"
      , "":        "http://purl.org/NET/Shuffl/default#"
      }
    , "rdf:type":  { "__iri": "shuffl:Workspace" }
    , "shuffl:id":        "test-shuffl-workspace"
    , "shuffl:version":   "0.1"
    , "shuffl:base-uri":  "#"
    , "shuffl:workspace":
      { "shuffl:stockbar":
          [ { "id": "stockpile_1", "class": "stock-yellow",  "label": "Ye", "type": "shuffl-freetext-yellow"  }
          , { "id": "stockpile_2", "class": "stock-blue",    "label": "Bl", "type": "shuffl-freetext-blue"    }
          , { "id": "stockpile_3", "class": "stock-green",   "label": "Gr", "type": "shuffl-freetext-green"   }
          , { "id": "stockpile_4", "class": "stock-orange",  "label": "Or", "type": "shuffl-freetext-orange"  }
          , { "id": "stockpile_5", "class": "stock-pink",    "label": "Pi", "type": "shuffl-freetext-pink"    }
          , { "id": "stockpile_6", "class": "stock-purple",  "label": "Pu", "type": "shuffl-freetext-purple"  }
          ]
      , "shuffl:layout":
          [ { "id": "card_1", "type": "shuffl-freetext-yellow", "data": "test-shuffl-card_1.json"
            , "pos": {"left":100, "top":30} 
            }
          , { "id": "card_2", "type": "shuffl-freetext-blue",   "data": "test-shuffl-card_2.json"
            , "pos": {"top":0, "left":400}
            , "size": {"width":600,"height":400}
            , "zindex":11
            }
          ]
      }
    };

TestDataReadWrite_workspace_data1 = jQuery.extend(true, {}, TestDataReadWrite_workspace_data);
TestDataReadWrite_workspace_data1["shuffl:id"] = "test-shuffl-workspace1";
TestDataReadWrite_workspace_data1["shuffl:workspace"]["shuffl:layout"].push(
    { "id": "card_3", "type": "shuffl-freetext-green",   "data": "test-shuffl-card_3.json"
    , "pos": {"top":30, "left":30}
    });

TestDataReadWrite_card_data =
    { "__prefixes":
      { "shuffl:": "http://purl.org/NET/Shuffl/vocab#"
      , "rdf:":    "http://www.w3.org/1999/02/22-rdf-syntax-ns#"
      , "rdfs:":   "http://www.w3.org/2000/01/rdf-schema#"
      , "owl:":    "http://www.w3.org/2002/07/owl#"
      , "xsd:":    "http://www.w3.org/2001/XMLSchema#"
      , "":        "http://purl.org/NET/Shuffl/default#"
      }
    , "rdf:type":  { "__iri": "shuffl:Card" }
    , "shuffl:id":        "id_1"
    , "shuffl:type":      "shuffl-freetext-yellow"
    , "shuffl:version":   "0.1"
    , "shuffl:base-uri":  "#"
    , "shuffl:data":
      { "shuffl:title":   "Card 1 title"
      , "shuffl:tags":    [ "card_1_tag", "yellowtag" ]
      , "shuffl:text":    "Card 1 free-form text here<br/>line 2<br/>line3<br/>yellow"
      }
    };

TestDataReadWrite_card_data1 = jQuery.extend(true, {}, TestDataReadWrite_card_data);
TestDataReadWrite_card_data1["shuffl:type"] = "shuffl-freetext-purple";
TestDataReadWrite_card_data1["shuffl:data"]["shuffl:title"] =
    "Card 1 title updated";
TestDataReadWrite_card_data1["shuffl:data"]["shuffl:text"] =
    "Card 1 free-form text here<br/>line 2<br/>line3<br/>purple";

/**
 * Function to register tests
 * 
 * These test cases deal with high-level functions for reading and writing
 * workspace and card data in a variety of serialization formats.
 */
TestDataReadWrite = function()
{
    module("TestDataReadWrite");

    test("NOTE: TestDataReadWrite must be loaded from WebDAV server", function ()
    {
        logtest("TestDataReadWrite origin check");
        if (!TestDataReadWrite_rootUri)
        {
            ok(false, "TestDataReadWrite must be loaded from WebDAV server");
            return;
        }
        ok(true, "TestDataReadWrite running OK");
    });

    test("TestDataReadWrite(init)", function ()
    {
        logtest("TestDataReadWrite(init)");
        shuffl.resetStorageHandlers();
        shuffl.addStorageHandler( 
            { uri:      "file:///"
            , name:     "LocalFile"
            , factory:  shuffl.LocalFileStorage
            });
        shuffl.addStorageHandler( 
            { uri:      TestDataReadWrite_rootUri
            , name:     "WebDAV"
            , factory:  shuffl.WebDAVStorage
            });

        //// init test area

        ok(true, "TestDataReadWrite initialized");
    });

    function createTestSession()
    {
        return shuffl.makeStorageSession(TestDataReadWrite_baseUri);
    }

    function initializeTestCollections(ss, rooturi, callback)
    {
        var m = new shuffl.AsyncComputation();
        var rooturi = TestDataReadWrite_rootUri;
        m.eval(
            function (val, callback) {
                // Delete collection /shuffltest/data/
                ss.removeCollection(rooturi+"shuffltest/data/", callback);
            });
        m.eval(
            function (val, callback) {
                // Delete collection /shuffltest/
                ss.removeCollection(rooturi+"shuffltest/", callback);
            });
        m.eval(
            function (val, callback) {
                // Create collection /shuffltest/
                ss.createCollection(rooturi, "shuffltest", callback);
            });
        m.eval(
            function (val, callback) {
                // Create collection /shuffltest/data/
                ss.createCollection(rooturi+"shuffltest", "data", callback);
            });
        m.eval(
            function (val, callback) {
                // Delay to allow creation to complete (???)
                log.debug("Start delay...");
                setTimeout(function() { log.debug("End delay..."); callback(val) }, 100);
            });
        m.exec(rooturi,
            function (val) {
                log.debug("initializeTestCollection "+shuffl.objectString(val));
                callback(val);
            });
    };

    // Read JSON workspace
    test("testReadWorkspaceJSON", function ()
    {
        logtest("testReadWorkspaceJSON");
        expect(1);
        log.debug("----- testReadWorkspaceJSON start -----");
        var m = new shuffl.AsyncComputation();
        var s = createTestSession();
        m.eval(
            function (val, callback) {
                shuffl.readWorkspaceData(s, val, null, callback);
            });
        m.exec("data/test-shuffl-workspace.json",
            function(val) {
                same(val, TestDataReadWrite_workspace_data, "Workspace data");
                log.debug("----- testReadWorkspaceJSON end -----");
                start();
            });
        stop(2000);
    });
    
    // Read JSON card
    test("testReadCardJSON", function ()
    {
        logtest("testReadCardJSON");
        expect(1);
        log.debug("----- testReadCardJSON start -----");
        var m = new shuffl.AsyncComputation();
        var s = createTestSession();
        m.eval(
            function (val, callback) {
                shuffl.readCardData(s, val, null, callback);
            });
        m.exec("data/test-shuffl-card_1.json",
            function(val) {
                same(val, TestDataReadWrite_card_data, "Card data");
                log.debug("----- testReadCardJSON end -----");
                start();
            });
        stop(2000);
    });
    
    // Create JSON workspace
    test("testCreateWorkspaceJSON", function ()
    {
        logtest("testCreateWorkspaceJSON");
        expect(2);
        log.debug("----- testCreateWorkspaceJSON start -----");
        var m = new shuffl.AsyncComputation();
        var s = createTestSession();
        m.eval(
            function (val, callback) {
                initializeTestCollections(s, val, function (v) { callback(val); });
            });
        m.eval(
            function (val, callback) {
                shuffl.createWorkspaceData(s, val, TestDataReadWrite_workspace_data, null, callback);
            });
        m.eval(
            function (val, callback) {
                equals(val.uri, TestDataReadWrite_baseUri+"data/test-shuffl-workspace.json", "Workspace data uri");
                callback(val);
            });
        m.eval(
            function (val, callback) {
                shuffl.readWorkspaceData(s, val.uri, null, callback);
            });
        m.exec(TestDataReadWrite_baseUri+"data/test-shuffl-workspace.json",
            function(val) {
                same(val, TestDataReadWrite_workspace_data, "Workspace data read back");
                log.debug("----- testCreateWorkspaceJSON end -----");
                start();
            });
        stop(2000);
    });
    
    // Update JSON workspace
    test("testUpdateWorkspaceJSON", function ()
    {
        logtest("testUpdateWorkspaceJSON");
        expect(4);
        log.debug("----- testUpdateWorkspaceJSON start -----");
        var m = new shuffl.AsyncComputation();
        var s = createTestSession();
        var u = null;
        m.eval(
            function (val, callback) {
                initializeTestCollections(s, val, function (v) { callback(val); });
            });
        m.eval(
            function (val, callback) {
                shuffl.createWorkspaceData(s, val, TestDataReadWrite_workspace_data, null, callback);
            });
        m.eval(
            function (val, callback) {
                equals(val.uri, TestDataReadWrite_baseUri+"data/test-shuffl-workspace.json", "Workspace data uri (created)");
                u = val.uri;
                callback(val);
            });
        m.eval(
            function (val, callback) {
                shuffl.readWorkspaceData(s, val.uri, null, callback);
            });
        m.eval(
            function (val, callback) {
                same(val, TestDataReadWrite_workspace_data, "Workspace data read back (created)");
                callback(val);
            });
        m.eval(
            function (val, callback) {
                shuffl.updateWorkspaceData(s, u, TestDataReadWrite_workspace_data1, null, callback);
            });
        m.eval(
            function (val, callback) {
                if (val instanceof shuffl.Error)
                {
                    log.error("Update error: "+val.toString());
                    ok(false, val.toString());
                    throw val;
                };
                equals(val.uri, u, "Workspace data uri (updated)");
                callback(val);
            });
        m.eval(
            function (val, callback) {
                shuffl.readWorkspaceData(s, val.uri, null, callback);
            });
        m.eval(
            function (val, callback) {
                same(val, TestDataReadWrite_workspace_data1, "Workspace data read back (updated");
                callback(val);
            });
        m.exec(TestDataReadWrite_baseUri+"data/test-shuffl-workspace.json",
            function(val) {
                log.debug("----- testUpdateWorkspaceJSON end -----");
                start();
            });
        stop(2000);
    });
    
    // Create JSON card
    test("testCreateCardJSON", function ()
    {
        logtest("testCreateCardJSON");
        expect(2);
        log.debug("----- testCreateCardJSON start -----");
        var m = new shuffl.AsyncComputation();
        var s = createTestSession();
        m.eval(
            function (val, callback) {
                initializeTestCollections(s, val, function (v) { callback(val); });
            });
        m.eval(
            function (val, callback) {
                shuffl.createCardData(s, val, TestDataReadWrite_card_data, null, callback);
            });
        m.eval(
            function (val, callback) {
                equals(val.uri, TestDataReadWrite_baseUri+"data/test-shuffl-card_1.json", "Card data uri");
                callback(val);
            });
        m.eval(
            function (val, callback) {
                shuffl.readWorkspaceData(s, val.uri, null, callback);
            });
        m.exec(TestDataReadWrite_baseUri+"data/test-shuffl-card_1.json",
            function(val) {
                same(val, TestDataReadWrite_card_data, "Card data read back");
                log.debug("----- testCreateCardJSON end -----");
                start();
            });
        stop(2000);
    });

    // Update JSON card
    test("testUpdateCardJSON", function ()
    {
        logtest("testUpdateCardJSON");
        expect(4);
        log.debug("----- testUpdateCardJSON start -----");
        var m = new shuffl.AsyncComputation();
        var s = createTestSession();
        var u = null;
        m.eval(
            function (val, callback) {
                initializeTestCollections(s, val, function (v) { callback(val); });
            });
        m.eval(
            function (val, callback) {
                shuffl.createCardData(s, val, TestDataReadWrite_card_data, null, callback);
            });
        m.eval(
            function (val, callback) {
                equals(val.uri, TestDataReadWrite_baseUri+"data/test-shuffl-card_1.json", "Card data uri (created)");
                u = val.uri;
                callback(val);
            });
        m.eval(
            function (val, callback) {
                shuffl.readCardData(s, val.uri, null, callback);
            });
        m.eval(
            function (val, callback) {
                same(val, TestDataReadWrite_card_data, "Card data read back (created)");
                callback(val);
            });
        m.eval(
            function (val, callback) {
                shuffl.updateCardData(s, u, TestDataReadWrite_card_data1, null, callback);
            });
        m.eval(
            function (val, callback) {
                if (val instanceof shuffl.Error)
                {
                    log.error("Update error: "+val.toString());
                    ok(false, val.toString());
                    throw val;
                };
                equals(val.uri, u, "Card data uri (updated)");
                callback(val);
            });
        m.eval(
            function (val, callback) {
                shuffl.readCardData(s, val.uri, null, callback);
            });
        m.eval(
            function (val, callback) {
                same(val, TestDataReadWrite_card_data1, "Card data read back (updated");
                callback(val);
            });
        m.exec(TestDataReadWrite_baseUri+"data/test-shuffl-card_1.json",
            function(val) {
                log.debug("----- testUpdateCardJSON end -----");
                start();
            });
        stop(2000);
    });

//// The plan here is to implement each test case, then to implement the 
//// necessary functionality ib shuffl-data-readwrite to pass the test.
//// Currently, most of the required functions just don't exist.

    // Read RDF/XML workspace
    test("testReadWorkspaceRDFXML", function ()
    {
        logtest("testReadWorkspaceRDFXML");
        expect(1);
        log.debug("----- testReadWorkspaceRDFXML start -----");
        var m = new shuffl.AsyncComputation();
        var s = createTestSession();
        m.eval(
            function (val, callback) {
                shuffl.readWorkspaceData(s, val, null, callback);
            });
        m.exec("data/test-shuffl-workspace.rdf",
            function(val) {
                same(val, TestDataReadWrite_workspace_data, "Workspace data");
                log.debug("----- testReadWorkspaceRDFXML end -----");
                start();
            });
        stop(2000);
    });
    
    // Read RDF/XML card
    
    // Create RDF/XML workspace
    
    // Update RDF/XML workspace
    
    // Create RDF/XML card
    
    // Update RDF/XML card

    // Read non-existent workspace

    // Read non-existent card

    // Update non-existent workspace

    // Update non-existent card

    // Create existing workspace
    
    // Create existing card
    
    // Create workspace to non-writable location
    
    // Create card to non-writable location
    
    // Update workspace in non-writable location
    
    // Update card in non-writable location

};

// End
