// $Id$

/**
 * Test suite for card factory and common handling functions
 */

/**
 * Data
 */
var testcardhandlers_carddata = 
    { 'shuffl:id':        'card_id'
    , 'shuffl:class':     'test-type'
    , 'shuffl:version':   '0.1'
    , 'shuffl:dataref':   "card_id.json"
    , 'shuffl:datauri':   "http://example.com/path/card_id.json"
    , 'shuffl:dataRW':    true
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
      , 'shuffl:tags':    [ 'card_1_tag', 'footag' ]
      , 'shuffl:text':    "Card 1 free-form text here<br/>line 2<br/>line3<br/>yellow"
      }
    };

var testlayoutdata = 
    { 'id':     'layout_1'
    , 'class':  'layout-class'
    , 'data':   'shuffl_sample_2_card_1.json'
    , 'pos':    {left:100, top:30}
    };

var testlayoutdatasized = 
    { 'id':     'layout_1'
    , 'class':  'layout-class'
    , 'data':   'shuffl_sample_2_card_1.json'
    , 'pos':    {left:100, top:30}
    , 'size':   {width:333, height:222}
    , 'zindex': 14
    };

var testwsdata =
    { 'shuffl:id':        'test-shuffl-saveworkspace-layout'
    , 'shuffl:class':     'shuffl:workspace'
    , 'shuffl:version':   '0.1'
    , 'shuffl:base-uri':  '#'
    , 'shuffl:uses-prefixes':
      [ { 'shuffl:prefix':  'shuffl',  'shuffl:uri': 'http://purl.org/NET/Shuffl/vocab#' }
      , { 'shuffl:prefix':  'rdf',     'shuffl:uri': 'http://www.w3.org/1999/02/22-rdf-syntax-ns#' }
      , { 'shuffl:prefix':  'rdfs',    'shuffl:uri': 'http://www.w3.org/2000/01/rdf-schema#' }
      , { 'shuffl:prefix':  'owl',     'shuffl:uri': 'http://www.w3.org/2002/07/owl#' }
      , { 'shuffl:prefix':  'xsd',     'shuffl:uri': 'http://www.w3.org/2001/XMLSchema#' }
      ]
    , 'shuffl:workspace':
      { 'shuffl:stockbar':
          [ { 'id': 'stockpile_1', 'class': 'stock-yellow',  'label': 'Ye', 'type': 'shuffl-freetext-yellow'  }
          , { 'id': 'stockpile_2', 'class': 'stock-blue',    'label': 'Bl', 'type': 'shuffl-freetext-blue'    }
          , { 'id': 'stockpile_3', 'class': 'stock-green',   'label': 'Gr', 'type': 'shuffl-freetext-green'   }
          , { 'id': 'stockpile_4', 'class': 'stock-orange',  'label': 'Or', 'type': 'shuffl-freetext-orange'  }
          , { 'id': 'stockpile_5', 'class': 'stock-pink',    'label': 'Pi', 'type': 'shuffl-freetext-pink'    }
          , { 'id': 'stockpile_6', 'class': 'stock-purple',  'label': 'Pu', 'type': 'shuffl-freetext-purple'  }
          ]
      , 'shuffl:layout':
          [ testlayoutdata
          , testlayoutdatasized
          ]
      }
    };
    
/**
 * Function to register tests
 */

TestAssembleWorkspaceDescription = function() {

    module("TestAssembleWorkspaceDescription");

    test("shuffl.assembleWorkspaceDescription",
        function () {
            log.debug("test shuffl.assembleWorkspaceDescription");
            shuffl.resetWorkspace(shuffl.noop);
            jQuery('#workspace').data('wsdata', testwsdata);
            shuffl.placeCardFromData(testlayoutdata,      testcardhandlers_carddata);
            shuffl.placeCardFromData(testlayoutdatasized, testcardhandlers_carddata);
            var atomuri = "http://example.com/atomuri/";
            var feeduri = atomuri+"feeduri/";
            var ws = shuffl.assembleWorkspaceDescription(atomuri, feeduri);
            equals(ws['shuffl:id'],          "test-shuffl-saveworkspace-layout", "shuffl:id");
            equals(ws['shuffl:class'],       "shuffl:workspace",    "shuffl:class");
            equals(ws['shuffl:version'],     "0.1",                 "shuffl:version");
            equals(ws['shuffl:base-uri'],    "#",                   "shuffl:base-uri");
            same(ws['shuffl:uses-prefixes'], 
                testwsdata['shuffl:uses-prefixes'],                 "shuffl:uses-prefixes");
            same(ws['shuffl:workspace']['shuffl:stockbar'],
                testwsdata['shuffl:workspace']['shuffl:stockbar'],  "shuffl:workspace.shuffl:stockbar");
            // Check layout entries
            var lo     = ws['shuffl:workspace']['shuffl:layout'];
            var testlo = testwsdata['shuffl:workspace']['shuffl:layout'];
            for (var i = 0; i < lo.length; i++) {
                equals(lo[i]['id'],    "card_id",                   "shuffl:layout["+i+"].id");
                equals(lo[i]['class'], "test-type",                 "shuffl:layout["+i+"].class");
                equals(lo[i]['data'],  "card_id.json",              "shuffl:layout["+i+"].data");
                var p = lo[i]['pos'];
                equals(Math.floor(p.left), testlo[i]['pos'].left,   "position-left");
                equals(Math.floor(p.top),  testlo[i]['pos'].top,    "position-top");
                var testsize = testlo[i]['size'] || {width:119, height:21};
                same(lo[i]['size'],    testsize,                    "shuffl:layout["+i+"].size");
                var testzindex = testlo[i]['zindex'] || 11;
                same(lo[i]['zindex'],  testzindex,                  "shuffl:layout["+i+"].zindex");
            };
        });

};

// End