// $Id: $

/**
 * Test suite for jquery.readcsv plugin
 */

/**
 * Test data values
 */
test_shuffl_csv = (
    "rowlabel,col1,col2,col3,col4"+"\n"+
    "row1,a1,b1,c1,d1"+"\n"+
    " row2 , a2 , b2 , c2 , d2 "+"\n"+
    " row3 , a3 3a , b3 3b , c3 3c , d3 3d "+"\n"+
    " ' row4 ' , ' a4 ' , ' b4 ' , ' c4 ' , ' d4 ' "+"\n"+
    ' " row5 " , " a5 " , " b5 " , " c5 " , " d5 " '+"\n"+
    " 'row6' , 'a6,6a' , 'b6,6b' , 'c6,6c' , 'd6,6d' "+"\n"+
    " 'row7' , 'a7''7a' , 'b7''7b' , 'c7''7c' , 'd7''7d' "+"\n"+
    " 'row8' , 'a8'', 8a' , 'b8'', 8b' , 'c8'', 8c' , 'd8'', 8d' "+"\n"+
    "End.");

/**
 * Function to register tests
 */
TestJqueryReadCSV = function() {

    module("TestJqueryReadCSV");

    test("parse simple CSV from string", function ()
    {
        expect(4);
        var csv = (
            "rowlabel,col1,col2,col3,col4"+"\n"+
            "row1,a1,b1,c1,d1"+"\n"+
            "End.");
        var tbl = jQuery.csv(",")(csv);
        equals(tbl.length, 3, "just theree rows");
        same(tbl[0],["rowlabel", "col1", "col2", "col3", "col4"], "header row");
        same(tbl[1],["row1", "a1", "b1", "c1", "d1"],             "row 1");
        same(tbl[2],["End."],                                     "end row");
    });

    test("parse CSV quoted values from string", function ()
    {
        expect(4);
        var csv = (
            " ' row4 ' , ' a4 ' , ' b4 ' , ' c4 ' , ' d4 ' "+"\n"+
            ' " row5 " , " a5 " , " b5 " , " c5 " , " d5 " '+"\n"+
            "End.");
        var tbl = jQuery.csv(",")(csv);
        equals(tbl.length, 3, "just theree rows");
        same(tbl[0],[" row4 ", " a4 ", " b4 ", " c4 ", " d4 "],             "row 4");
        same(tbl[1],[" row5 ", " a5 ", " b5 ", " c5 ", " d5 "],             "row 5");
        same(tbl[2],["End."],                                             "end row");
    });

    test("parse more complicated CSV from string", function ()
    {
        expect(11);
        var tbl = jQuery.csv(",")(test_shuffl_csv);
        equals(tbl.length, 10, "just theree rows");
        same(tbl[0],["rowlabel", "col1", "col2", "col3", "col4"],         "header row");
        same(tbl[1],["row1", "a1", "b1", "c1", "d1"],                     "row 1");
        same(tbl[2],["row2", "a2", "b2", "c2", "d2"],                     "row 2");
        same(tbl[3],["row3", "a3 3a", "b3 3b", "c3 3c", "d3 3d"],         "row 3");
        same(tbl[4],[" row4 ", " a4 ", " b4 ", " c4 ", " d4 "],             "row 4");
        same(tbl[5],[" row5 ", " a5 ", " b5 ", " c5 ", " d5 "],             "row 5");
        same(tbl[6],["row6", "a6,6a", "b6,6b", "c6,6c", "d6,6d"],         "row 6");
        same(tbl[7],["row7", "a7'7a", "b7'7b", "c7'7c", "d7'7d"],         "row 7");
        same(tbl[8],["row8", "a8', 8a", "b8', 8b", "c8', 8c", "d8', 8d"], "row 8");
        same(tbl[9],["End."],                                             "end row");
    });

    test("read file as string", function ()
    {
        expect(2);
        function checkdata(data, status) {
            //log.debug("jQuery.get data: "+jQuery.toJSON(data));
            equals(status, "success", "jQuery.get status");
            equals(jQuery.toJSON(data), jQuery.toJSON(test_shuffl_csv), "jQuery.get data");
            start();
        };
        jQuery.get("test-shuffl-csv.csv", {}, checkdata, "text");
        stop(2000);
    });

    test("read file as CSV", function ()
    {
        expect(11);
        function checkdata(tbl, status) {
            equals(status, "success", "jQuery.get status");
            same(tbl[0],["rowlabel", "col1", "col2", "col3", "col4"],         "header row");
            same(tbl[1],["row1", "a1", "b1", "c1", "d1"],                     "row 1");
            same(tbl[2],["row2", "a2", "b2", "c2", "d2"],                     "row 2");
            same(tbl[3],["row3", "a3 3a", "b3 3b", "c3 3c", "d3 3d"],         "row 3");
            same(tbl[4],[" row4 ", " a4 ", " b4 ", " c4 ", " d4 "],             "row 4");
            same(tbl[5],[" row5 ", " a5 ", " b5 ", " c5 ", " d5 "],             "row 5");
            same(tbl[6],["row6", "a6,6a", "b6,6b", "c6,6c", "d6,6d"],         "row 6");
            same(tbl[7],["row7", "a7'7a", "b7'7b", "c7'7c", "d7'7d"],         "row 7");
            same(tbl[8],["row8", "a8', 8a", "b8', 8b", "c8', 8c", "d8', 8d"], "row 8");
            same(tbl[9],["End."],                                             "end row");
            start();
        };
        jQuery.getCSV("test-shuffl-csv.csv", checkdata);
        stop(2000);
    });

};

// End
