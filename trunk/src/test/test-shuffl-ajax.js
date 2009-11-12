/**
 * @fileoverview
 *  Test suite for shuffl-ajax
 *  
 * @author Graham Klyne
 * @version $Id: test-shuffl-ajax.js 568 2009-10-27 13:08:33Z gk-google@ninebynine.org $
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

var TestShufflAjax_JSONdata =
    { 'shuffl:id':        'getJSON'
    , 'shuffl:class':     'shuffl-freetext-yellow'
    , 'shuffl:version':   '0.1'
    , 'shuffl:base-uri':  '#'
    , 'shuffl:uses-prefixes':
      [ { 'shuffl:prefix':  'shuffl', 'shuffl:uri': 'http://purl.org/NET/Shuffl/vocab#' }
      , { 'shuffl:prefix':  'rdf',    'shuffl:uri': 'http://www.w3.org/1999/02/22-rdf-syntax-ns#' }
      , { 'shuffl:prefix':  'rdfs',   'shuffl:uri': 'http://www.w3.org/2000/01/rdf-schema#' }
      , { 'shuffl:prefix':  'owl',    'shuffl:uri': 'http://www.w3.org/2002/07/owl#' }
      , { 'shuffl:prefix':  'xsd',    'shuffl:uri': 'http://www.w3.org/2001/XMLSchema#' }
      ]
    , 'shuffl:data':
      { 'shuffl:title':   "Card 1 title"
      , 'shuffl:tags':    [ 'card_1_tag', 'yellowtag' ]
      , 'shuffl:text':    "Card 1 free-form text here<br/>line 2<br/>line3<br/>yellow"
      }
    };

/**
 * Function to register tests
 */
TestShufflAjax = function()
{

    module("TestShufflAjax");

    test("shuffl.ajax.getJSON (success)", function ()
    {
        logtest("shuffl.ajax.getJSON (success)");
        expect(1);
        log.debug("----- shuffl.ajax.getJSON (success) start -----");
        var m = new shuffl.AsyncComputation();
        m.eval(function (val, callback) {
                shuffl.ajax.getJSON("data/test-shuffl-ajax-getJSON.json", callback);
            });
        m.eval(
            function (val, callback) {
                same(val, TestShufflAjax_JSONdata, "Data value returned");
                callback(true);
            });
        m.exec(null,
            function(val) {
                log.debug("----- shuffl.ajax.getJSON (success) end -----");
                start();
            });
        stop(2000);
    });

    test("shuffl.ajax.getJSON (error)", function ()
    {
        logtest("shuffl.ajax.getJSON (error)");
        expect(3);
        log.debug("----- shuffl.ajax.getJSON (error) start -----");
        var m = new shuffl.AsyncComputation();
        m.eval(
            function (val, callback) {
                shuffl.ajax.getJSON("data/test-shuffl-ajax-getJSON.NODATA", callback);
            });
        m.eval(
            function (val, callback) {
                ok(val instanceof shuffl.Error, "Error value returned");
                equals(val.toString(), "shuffl error: Request failed (error; HTTP status: 404 Not Found)", "Error message returned");
                equals(val.response, "404 Not Found", "Ajax HTTP response details");
                callback(true);
            });
        m.exec(null,
            function(val) {
                log.debug("----- shuffl.ajax.getJSON (error) end -----");
                start();
            });
        stop(2000);
    });

    test("shuffl.ajax.getJSON (wrong datatype)", function ()
    {
        logtest("shuffl.ajax.getJSON (error)");
        expect(3);
        log.debug("----- shuffl.ajax.getJSON (wrong datatype) start -----");
        var m = new shuffl.AsyncComputation();
        m.eval(
            function (val, callback) {
                shuffl.ajax.getJSON("data/test-shuffl-ajax-getJSON.xml", callback);
            });
        m.eval(
            function (val, callback) {
                ok(val instanceof shuffl.Error, "Error value returned");
                equals(val.toString(), "shuffl error: Request failed (parsererror; HTTP status: 200 OK)", "Error message returned");
                equals(val.response, "200 OK", "Ajax HTTP response details");
                callback(true);
            });
        m.exec(null,
            function(val) {
                log.debug("----- shuffl.ajax.getJSON (wrong datatype) end -----");
                start();
            });
        stop(2000);
    });

};

// End
