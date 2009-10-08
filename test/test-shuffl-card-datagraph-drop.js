/**
 * @fileoverview
 *  Test suite for dropping datatable card on datagraph card
 *  
 * @author Graham Klyne
 * @version $Id: $
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

var carddatagraph_labels0 = [];
                                
var carddatagraph_series0 = [];

var carddatatable_table1 =
    [ [ "col1",  "col2",  "col3" ]
    , [ "1.11",  "1.22",  "1.33" ]
    , [ "2.11",  "2.22",  "2.33" ]
    ];

var carddatagraph_labels1 =
    [ "col1", "col2", "col3" ];
                                
var carddatagraph_series1 = 
    [ [ 1.11,  1.22,  1.33 ]
    , [ 2.11,  2.22,  2.33 ]
    ];

var carddatatable_table2 =
    [ [ "",      "col1",  "col2",  "col3" ]
    , [ "" ]
    , [ "row_1", "1.11",  "1.22",  "1.33" ]
    , [ "row_2", "2.11",  "2.22",  "2.33" ]
    , [ "End." ]
    ];

var carddatagraph_labels2 =
    [ "col1", "col2", "col3" ];
                                
var carddatagraph_series2 = 
    [ [ 1.11,  1.22,  1.33 ]
    , [ 2.11,  2.22,  2.33 ]
    ];

/**
 * Function to register tests
 */
TestCardDatagraphDrop = function()
{

    module("TestCardDatagraphDrop");

    test("Mock drop on datagraph card", function ()
    {
        expect(21);
        log.debug("Mock drop on datagraph card");
        // Instantiate empty datagraph card
        var css = 'stock-yellow';
        var c   = shuffl.card.datagraph.newCard("shuffl-datagraph-yellow", css, "card-1",
            { 'shuffl:tags':  ["card-tag"]
            , 'shuffl:title': "card-title"
              , 'shuffl:uri':     ""
              , 'shuffl:dataminy': -1.2
              , 'shuffl:datamaxy': 1.2
              , 'shuffl:labels':   carddatagraph_labels0
              , 'shuffl:series':   carddatagraph_series0
            });
        // Check datagraph model values
        equals(c.model("shuffl:title"), "card-title", "shuffl:title");
        equals(c.model("shuffl:tags"),  "card-tag",   "shuffl:tags");
        equals(c.model("shuffl:dataminy"), -1.2, "shuffl:dataminy");
        equals(c.model("shuffl:datamaxy"),  1.2, "shuffl:datamaxy");
        same(c.model("shuffl:labels"), carddatagraph_labels0, "shuffl:labels");
        same(c.model("shuffl:series"), carddatagraph_series0, "shuffl:series");
        // Check datagraph rendered card
        equals(c.find("ctitle").text(), "card-title", "card title field");
        equals(c.find("ctags").text(),  "card-tag", "card tags field");
        equals(c.find("cdataminy").text(), "-1.20", "minimum Y field");
        equals(c.find("cdatamaxy").text(),  "1.20", "maximum Y field");
        equals(c.find("cbody").children().get(0).tagName.toLowerCase(), "div", "card body contains <div>");
        // Instatiate mock table card
        var tc = jQuery("<div/>");
        tc.data('shuffl:table',  carddatatable_table1);
        tc.data('shuffl:labels', carddatagraph_labels1);
        tc.data('shuffl:series', carddatagraph_series1);
        // Simulate drop on datagraph card
        c.model('shuffl:drop', tc);
        // Check updated datagraph model values
        equals(c.model("shuffl:title"), "card-title", "shuffl:title");
        equals(c.model("shuffl:tags"),  "card-tag",   "shuffl:tags");
        equals(c.model("shuffl:dataminy"), 1.11, "shuffl:dataminy");
        equals(c.model("shuffl:datamaxy"), 2.33, "shuffl:datamaxy");
        same(c.model("shuffl:labels"), carddatagraph_labels1, "shuffl:labels");
        same(c.model("shuffl:series"), carddatagraph_series1, "shuffl:series");
        // Check updated datagraph rendered card
        equals(c.find("ctitle").text(), "card-title", "card title field");
        equals(c.find("ctags").text(),  "card-tag", "card tags field");
        equals(c.find("cdataminy").text(), "1.11", "minimum Y field");
        equals(c.find("cdatamaxy").text(), "2.33", "maximum Y field");
    });

/*
    test("testBBB", function ()
    {
            log.debug("----- testBBB start -----");
            expect(11);
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

};

// End
