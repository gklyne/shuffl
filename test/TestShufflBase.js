// $Id$

/**
 * Test suite for shuffl-base module
 */

/**
 * Function to register tests
 */
TestShufflBase = function() {

    module("TestShufflBase");

    test("URI base",
        function () {
            expect(3);
            var u = jQuery.uri("http://example.com/path/segment/name.type?query#frag");
            var b = shuffl.uriBase(u);
            var d = jQuery.uri().toString();
            equals(b, "http://example.com/path/segment/", "shuffl.uriBase");
            b = shuffl.uriBase("").toString();
            ok(b != "", "shuffl.uriBase (default non-blank)");
            equals(b, d.slice(0, b.length), "shuffl.uriBase (default)");
        });

    test("URI path and name", 
        function () {
            expect(2);
            var u = jQuery.uri("http://example.com/path/segment/name.type");
            var p = shuffl.uriPath(u);
            var n = shuffl.uriName(u);
            equals(p, "/path/segment/", "shuffl.uriPath");
            equals(n, "name.type",      "shuffl.uriName");
        });

    test("URI excluding fragment", 
            function () {
                expect(4);
                var r = jQuery.uri("http://example.com/path/segment/name.type?query/path#fragment/path");
                var u = shuffl.uriWithoutFragment(r);
                equals(u, "http://example.com/path/segment/name.type?query/path", "shuffl.uriWithoutFragment (1)");
                r = jQuery.uri("file:/path/segment/name.type#fragment/path");
                u = shuffl.uriWithoutFragment(r);
                equals(u, "file:/path/segment/name.type", "shuffl.uriWithoutFragment (2)");
                r = jQuery.uri("http://example.com/?query/path#fragment/path");
                u = shuffl.uriWithoutFragment(r);
                equals(u, "http://example.com/?query/path", "shuffl.uriWithoutFragment (3)");
                r = jQuery.uri("http://example.com/path/segment/name.type?query/path");
                u = shuffl.uriWithoutFragment(r);
                equals(u, "http://example.com/path/segment/name.type?query/path", "shuffl.uriWithoutFragment (4)");
        });

};

// End
