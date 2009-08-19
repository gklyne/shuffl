// $Id: $

/**
 * Ensure shuffl namespace is defined
 */
if (typeof shuffl == "undefined") {
    shuffl = {};
}

/**
 * Error class for Shuffl
 * 
 * TODO: move to base module
 */
shuffl.Error = function(msg, val) {
    this.msg = msg;
    this.val = val;
};

shuffl.Error.prototype = new Error("(shuffl)");

shuffl.Error.prototype.toString = function () {
    var s = "shuffl error: "+this.msg;
    if (this.val) {
        s += "("+this.val.toString()+")";
    }
    return s;
};

/**
 * Class for accessing and manimpulating Atom feeds via AtomPub
 * 
 * The class is instantiated with the URI of the AtomPub server, from which
 * is derived a base URI for subsequent requests.  This attempts to isolate 
 * most of the code from the servioce location details.
 */
shuffl.AtomPub = function(baseuri) {
    this.baseuri = baseuri;
};

/**
 * Function to obtain informatiomn about a feed
 */
shuffl.AtomPub.prototype.feedinfo = function (feeduri, callback) {
    function examineRawData(data, type) { 
        log.debug("shuffl.AtomPub.feedinfo.examineRawData: "+type);
        log.debug("shuffl.AtomPub.feedinfo.examineRawData: "+data);
        //log.debug("shuffl.AtomPub.feedinfo.examineRawData: "+shuffl.elemString(data));
        return data;
    }
    function decodeResponse(data, status) {
        log.debug("shuffl.AtomPub.feedinfo.decodeResponse: "+feeduri+", "+status+", "+data);
        callback({});
    }
    function requestFailed(xhr, status, except) {
        log.debug("shuffl.AtomPub.feedinfo.requestFailed: "+status);
        callback(shuffl.Error("AtomPub request failed", status));
    }
    function responseComplete(xhr, status) { 
        log.debug("shuffl.AtomPub.feedinfo.responseComplete: "+status);
        log.debug("shuffl.AtomPub.feedinfo.responseComplete: "+xhr.responseText);
    }
    var uri = jQuery.uri(this.baseuri).resolve("introspect")+feeduri;
    log.debug("shuffl.AtomPub.feedinfo: "+uri);
    jQuery.ajax({
            type:         "GET",
            url:          uri.toString(),
            //data:         jQuery.toJSON(cardext), 
            //contentType:  "application/json",
            dataType:     "xml",    // Atom feed item expected as XML
            //beforeSend:   function (xhr, opts) { xhr.setRequestHeader("SLUG", "cardloc"); },
            //dataFilter:   examineRawData,
            success:      decodeResponse,
            error:        requestFailed,
            complete:     responseComplete,
            //username:     "...",
            //password:     "...",
            //timeout:      20000,     // Milliseconds
            //async:        true,
            cache:        false
        });
};

// End
