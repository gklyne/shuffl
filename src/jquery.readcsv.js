/**
 * @fileoverview
 *  jQuery.csv plugin, parsses CSV data from a string
 *  
 * @author Graham Klyne (adpated from 'root.node' [1,2])
 * @version $Id$
 * 
 * [1] http://plugins.jquery.com/project/csv
 * [2] http://code.google.com/p/js-tables/wiki/CSV
 */

/**
 * Usage:
 *  jQuery.csv()(csvtext)       returns an array of arrays representing the CSV text.
 *  jQuery.csv("\t")(tsvtext)   uses Tab as a delimiter (comma is the default)
 *                              and single & double quotes as the quote character
 */

jQuery.extend({
    csv:
        function(delim, lined)
        {
            delim = delim || ",";
            lined = typeof lined == "string" 
                ? new RegExp( "[" + (lined || "\\r\\n") + "]+") 
                : lined || new RegExp("[\r\n]+");
            var mitem  = "\\s*"+
                         '((("[^"]*["])+)'+           // 2
                         "|(('[^']*['])+)"+           // 4
                         "|([^"+delim+"]*))\\s*"+     // 6
                         "(["+delim+"])?";            // 7
            ////log.debug("jQuery.csv: '"+mitem+"'");
            mitem = new RegExp(mitem, "g");

            function unquote(s, q) {
                ////log.debug("- unquote "+s+", "+q);
                return s.slice(1,s.length-1).replace(q+q,q);
            }

            function pickitem (v, out) {
                var r = mitem.exec(v);
                ////log.debug("- v: |"+v+"|");0
                ////log.debug("- r: "+r.join("<>"));
                if (r != null) {
                    if (r[2]) {
                        out.push(unquote(r[2], '"'));
                    } else if (r[4]) {
                        out.push(unquote(r[4], "'"));
                    } else {
                        out.push(jQuery.trim(r[6]));
                    };
                    if (!r[7]) { r = null; };
                };
                return r;
            };

            function splitline (v) {
                var out = [];
                mitem.lastIndex = 0;
                var r = pickitem(v, out);
                while (r != null) {
                    r = pickitem(v, out);
                };
            return out;
            }
    
            return function(text) {
                var lines = text.split(lined);
                ////log.debug("- lined: "+jQuery.toJSON(lined));
                ////log.debug("- lines: "+lines.join("//"));
                for (var i=0, l=lines.length; i<l; i++) {
                    lines[i] = splitline(lines[i]);
                }
                return lines;
            };
        },

    getCSV:
        function(uri, callback)
        {
            function parseCSV(data, status) {
                if (status == "success") {
                    data = jQuery.csv()(data); 
                } else {
                    data = null; 
                };
                callback(data, status);
            };
            jQuery.get(uri, {}, parseCSV, "text");
        }    

});
