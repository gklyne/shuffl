/**
 * @fileoverview
 * This script sets up the flyui environment.
 * @author <a href="http://purl.org/net/aliman">Alistair Miles</a>
 * @version $Revision:538 $ on $Date: 2008-08-14 10:36:17 +0100 (Thu, 14 Aug 2008) $ by $Author: aliman $
 * TODO license terms
 */


if (typeof flyui == "undefined" || !flyui) {
    /**
     * @class
	 * The flyui global namespace. If flyui is already defined, the
     * existing flyui will not be overwritten so that defined
     * namespaces are preserved.
     */
	function flyui() {};
}

/**
 * Returns the namespace specified and creates it if it doesn't exist.
 * <pre>
 * flyui.namespace("property.package");
 * flyui.namespace("flyui.property.package");
 * </pre>
 * Either of the above would create flyui.property, then
 * flyui.property.package
 *
 * Be careful when naming packages. Reserved words may work in some browsers
 * and not others. For instance, the following will fail in Safari:
 * <pre>
 * flyui.namespace("really.long.nested.namespace");
 * </pre>
 * This fails because "long" is a future reserved word in ECMAScript
 *
 * @param  {String*} arguments 1-n namespaces to create 
 * @return {Object}  A reference to the last namespace object created
 */
flyui.namespace = function() {
    var a=arguments, o=null, i, j, d;
    for (i=0; i<a.length; i=i+1) {
        d=a[i].split(".");
        o=flyui;

        // flyui is implied, so it is ignored if it is included
        for (j=(d[0] == "flyui") ? 1 : 0; j<d.length; j=j+1) {
            o[d[j]]=o[d[j]] || {};
            o=o[d[j]];
        }
    }

    return o;
};

flyui.log = function(message, channel, context) {
    if (typeof channel == "undefined") {
        channel = "info";
    }
    if (typeof context != "undefined") {
        message = context + " :: " +message;
    }
    YAHOO.log(message,channel);
};

flyui.info = function(message, context) {
    var channel = "info";
    flyui.log(message, channel, context);
};

flyui.debug = function(message, context) {
    var channel = "debug";
    flyui.log(message, channel, context);
};

flyui.err = function(message, context) {
    var channel = "error";
    flyui.log(message, channel, context);
};

flyui.chain = function( glue, chained ) {
    return function(o) {
    	flyui.debug("in chained function, calling glue");
        var p = glue(o);
        flyui.debug("in chained function, calling next in chain");
        chained(p);
    }
};

/**
 * @class
 * Encapsulates an unexpected exception.
 * @constructor
 * @param {String} methodName the name of the method or function in which the cause exception was caught
 * @param {Object} nested
 */
flyui.UnexpectedException = function( methodName, nested ) {
    this.name = "flyui.UnexpectedException";
    this.nested = nested;
    this.message = methodName+" :: unexpected error";
    for (var p in nested) {
        if (p != "message") {
            this.message += "\n      "+p+": "+nested[p];
        }
    }
    if (nested.message) {
        this.message += "\n..."+nested.message;
    }
    flyui.debug(this.message)
};

