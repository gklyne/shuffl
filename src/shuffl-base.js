/**
 * @fileoverview
 *  Shuffl application common code.
 *  
 * @author Graham Klyne
 * @version $Id: ...$
 */

// If errors are seen, run Eclipse "(right-click project) > Validate" option

// Meanwhile, this suppresses many distracting errors:
jQuery = jQuery;

// ----------------------------------------------------------------
// Globals and data
// ----------------------------------------------------------------

/**
 *  Add logging functions to global namespace, for convenience
 */
if (typeof log == "undefined") {
    log = {};
    log.debug = MochiKit.Logging.logDebug   ;
    log.info  = MochiKit.Logging.log    ;
    log.warn  = MochiKit.Logging.logWarning ;
    log.error = MochiKit.Logging.logError   ;
};

/**
 * Abbreviated access for Mochikit functions
 */
mk = {};
mk.partial = MochiKit.Base.partial;
mk.map     = MochiKit.Base.map;

// Mochikit logging hack as default is no limit and default firebug off:
//MochiKit.Logging.logger.useNativeConsole = false;
//MochiKit.Logging.logger.maxSize = 2000;

/**
 * Ensure shuffl namespace is defined
 */
if (typeof shuffl == "undefined") {
    shuffl = {};
}
if (typeof shuffl.CardFactoryMap == "undefined") {
    shuffl.CardFactoryMap = {};   // Initial empty card factory map
}
if (typeof shuffl.idnext == "undefined") {
    shuffl.idnext         = 100;  // Counter for unique id generation    
}

// ----------------------------------------------------------------
// Miscellaneous support functions
// ----------------------------------------------------------------

/**
 * Get string value representing a supplied element
 */
shuffl.elemString = function(elem) {
    var attrs = elem.attributes || [];
    var attrtext = "";
    for ( var i = 0 ; i < attrs.length ; i++ ) {
        // log.debug("  - @"+attrs[i].name+": "+attrs[i].value);
        attrtext += " "+attrs[i].name+"='"+attrs[i].value+"'";
    };
    var tagName = elem.tagName;
    return "<"+tagName+attrtext+">"
        + mk.map(shuffl.nodeString, elem.childNodes).join("")
        + "</"+tagName+">";
};

/**
 * Get string value representing a supplied node
 * 
 * TODO: test this
 */
shuffl.nodeString = function(node) {
    if (node.nodeType == TEXT_NODE) {
        return node.textContent ;
    }
    if (node.nodeType == ELEMENT_NODE) {
        return shuffl.elemString(node);
    }
    return shuffl.objectString(node);
    //1 ELEMENT_NODE
    //2 ATTRIBUTE_NODE
    //3 TEXT_NODE
    //4 CDATA_SECTION_NODE
    //5 ENTITY_REFERENCE_NODE
    //6 ENTITY_NODE
    //7 PROCESSING_INSTRUCTION_NODE
    //8 COMMENT_NODE
};

/**
 * Get string value for object attributes
 */
shuffl.objectString = function (obj) {
    var str = "";
    var pre = "";
    for ( var k in obj ) {
        if ( typeof obj[k] != "function" ) {
            //log.debug("  - "+k+": "+obj[k]);
            str += pre + k + ': ' + obj[k];
            pre = ', ';
        }
    };
    return "{ "+str+" };";
};

/**
 * Helper function to return a string value from an object field, 
 * otherwise a supplied default.  This function processes incoming
 * JSON, so should be defensively implemented.
 * 
 * @param obj           the object value
 * @param key           the key of the member value to extract
 * @param def           the default value to use if there is any
 *                      problem with the object member value.
 */
shuffl.get = function (obj, key, def) {
    if (typeof obj == "object" && obj.hasOwnProperty(key)) {
        var val = obj[key];
        if (typeof val == "string") { return val; }
        if (val instanceof Array)   { return val.join(" "); }
    };
    return def;
};

/**
 * Parse integer value from string, or return supplied default value
 * 
 * @param str       string to be parsed
 * @param rad       radix to parse
 * @param def       default value
 */
shuffl.parseInt = function (str, rad, def) {
    return parseInt(str, 10) || def;
};

/**
 *  Test to see is supplied URI is relative
 */
shuffl.isRelativeUri = function (uriref) {
    return shuffl.toAbsoluteUri("abs://nodomain/", uriref) != uriref;
};

/**
 *  Get absolute URI for specified base and URI reference
 */
shuffl.toAbsoluteUri = function (baseuri, uriref) {
    var base = jQuery.uri(baseuri);
    return base.resolve(uriref);
};

// End.
