// $Id$

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
 * Function for handlingajax request failure
 */
shuffl.AtomPub.requestFailed = function (callback) {
    return function (xhr, status, except) {
        log.debug("shuffl.AtomPub.requestFailed: "+status);
        var err = new shuffl.Error("AtomPub request failed", status);
        err.HTTPstatus     = xhr.status;
        err.HTTPstatusText = xhr.statusText; 
        err.response = err.HTTPstatus+" "+err.HTTPstatusText;
        //log.debug("- err: "+shuffl.objectString(err));
        callback(err);
    };
};

/**
 * Method to return an Atom service URI for operations on a feed or item.
 * 
 * @param feedinfo  object identifying a feed.
 * @param service   string indicating what feed service is required:
 *                  "introspect", "edit" or "content"
 *
 * The feed identification object has the following fields: 
 *   path:  is feed uri path of the feed to be deleted,
 * or:
 *   base:  names the feed uri path at which the new feed is 
 *          created, or "/".  Must end with '/'.
 *   name:  a name for the new feed, appended to the base path.
 */
shuffl.AtomPub.prototype.serviceUri = function (info, service) {
    if ( !info.path ) { info.path = info.base+info.name; };
    if ( !info.path ) { 
        return shuffl.Error(
            "shuffl.AtomPub.serviceUri: insufficient information ", 
            shuffl.objectString(info)) 
    };
    // TODO: I think there's an eXist AtomPub bug in returned href values,
    //       leading to the insertion of "atom/" about here: isolate the hack.
    info.uri = shuffl.extendUriPath(
        jQuery.uri(this.baseuri).resolve("atom/"+service+"/"),
        info.path);
    return info.uri;
};

/**
 * Method to assemble an atom object path and URI from an atompub
 * protocol response.
 * 
 * @param info      is the feed or item information for which the request 
 *                  was issued, containing the request path and URI
 * @param elems     is a jQuery object containing the immediate child
 *                  elements of an atom feed or item description.
 * @return          a structure containing .path and .uri fields assembled
 *                  from base URI information from the current request
 *                  and local reference information in the atompub response.
 */
shuffl.AtomPub.prototype.getAtomPathUri = function (info, elems) {
    var baseuri = this.serviceUri(info, "edit");
    var atomref = elems.filter("link[rel='edit']").text();
    var atomuri = baseuri.resolve(atomref);
    // TODO: I think there's an eXist AtomPub bug in returned href values,
    //       leading to the insertion of "atom/" about here: isolate the hack.
    var path    = atomuri.path.replace(/\/exist\/atom\/edit/,"");
    return { uri: atomuri, path: path+shuffl.uriQuery(atomuri) };
};

/**
 * Function to obtain information about a feed
 * 
 * @param feedinfo  object identifying a feed. See serviceUri for details.
 */
shuffl.AtomPub.prototype.feedInfo = function (feedinfo, callback) {
    var atompubobj = this;  // for decodeResponse
    function examineRawData(data, type) { 
        log.debug("shuffl.AtomPub.feedinfo.examineRawData: "+type);
        log.debug("shuffl.AtomPub.feedinfo.examineRawData: "+data);
        //log.debug("shuffl.AtomPub.feedinfo.examineRawData: "+shuffl.elemString(data));
        return data;
    }
    function decodeResponse(data, status) {
        //log.debug("shuffl.AtomPub.feedinfo.decodeResponse: "+feeduri+", "+status+", "+data);
        //log.debug("shuffl.AtomPub.feedinfo.decodeResponse: "+feeduri+", "+status+", "+shuffl.objectString(data.documentElement));
        //log.debug("shuffl.AtomPub.feedinfo.decodeResponse: "+feedinfo.path+", "+status+", "+shuffl.elemString(data.documentElement));
        // <service xmlns='http://www.w3.org/2007/app'>
        //   <workspace>
        //     <title xmlns='http://www.w3.org/2005/Atom'>Test feed</title>
        //     <collection href='/atom/edit/testfeed'>
        //       <title xmlns='http://www.w3.org/2005/Atom'>Test feed</title>
        //       <accept>text/*,image/*,application/*</accept>
        //     </collection>
        //   </workspace>
        // </service>
        delete feedinfo.uri;
        delete feedinfo.title;
        var c = jQuery(data.documentElement).find("collection");
        if (c.length != 0) {
            feedinfo.uri   = shuffl.extendUriPath(atompubobj.baseuri, c.attr("href"));
            feedinfo.title = c.find("title").text();
        };
        callback(feedinfo);
    }
    function responseComplete(xhr, status) { 
        log.debug("shuffl.AtomPub.feedinfo.responseComplete: "+status);
        log.debug("shuffl.AtomPub.feedinfo.responseComplete: "+xhr.responseText);
    }
    var uri = this.serviceUri(feedinfo, "introspect");
    log.debug("shuffl.AtomPub.feedInfo: "+uri);
    jQuery.ajax({
            type:         "GET",
            url:          uri.toString(),
            //data:         jQuery.toJSON(cardext), 
            //contentType:  "application/json",
            dataType:     "xml",    // Atom feed info expected as XML
            //beforeSend:   function (xhr, opts) { xhr.setRequestHeader("SLUG", "cardloc"); },
            //dataFilter:   examineRawData,
            success:      decodeResponse,
            error:        shuffl.AtomPub.requestFailed(callback),
            //complete:     responseComplete,
            //username:     "...",
            //password:     "...",
            //timeout:      20000,     // Milliseconds
            //async:        true,
            cache:        false
        });
};

/**
 * Create a new feed
 * 
 * @param feedinfo  object identifying a feed. See serviceUri for details.
 *
 * The new feed description object has the following additional fields: 
 *   title:   a textual title for the new feed.
 */
shuffl.AtomPub.prototype.createFeed = function (feedinfo, callback) {
    var uri = this.serviceUri(feedinfo, "edit");
    var template = '<?xml version="1.0" ?>'+'\n'+
                   '<feed xmlns="http://www.w3.org/2005/Atom">'+'\n'+
                   '  <title>%(title)s</title>'+'\n'+
                   '</feed>'+'\n';
    function decodeResponse(data, status) {
        log.debug("shuffl.AtomPub.createFeed.decodeResponse: "+
            feedinfo.path+", "+status);
        callback(feedinfo);
    }
    log.debug("shuffl.AtomPub.createFeed: "+uri);
    jQuery.ajax({
            type:         "POST",
            url:          uri.toString(),
            data:         shuffl.interpolate(template, {title: feedinfo.title}), 
            contentType:  "application/atom+xml",
            //dataType:     "xml",    // Atom feed info expected as XML
            success:      decodeResponse,
            error:        shuffl.AtomPub.requestFailed(callback),
            cache:        false
        });
};

/**
 * Delete a feed
 * 
 * @param feedinfo  object identifying a feed. See serviceUri for details.
 */
shuffl.AtomPub.prototype.deleteFeed = function (feedinfo, callback) {
    function decodeResponse(data, status) {
        callback({});
    }
    var uri = this.serviceUri(feedinfo, "edit");
    log.debug("shuffl.AtomPub.deleteFeed: "+uri);
    jQuery.ajax({
            type:         "DELETE",
            url:          uri.toString(),
            success:      decodeResponse,
            error:        shuffl.AtomPub.requestFailed(callback),
            cache:        false
        });
};

/**
 * Function to list the items in a feed
 * 
 * @param feedinfo  object identifying a feed. See serviceUri for details.
 * @param callback  function called with information about the identified feed, 
 *                  or a shuffl.Error value.
 * 
 * Feed information is returned in a structure:
 *    feedinfo.path     URI path for this feed
 *    feedinfo.uri      URI for 
 *    feedinfo.id       feed universally unique identifier string (IRI)
 *    feedinfo.updated  date and time of last update as an RFC3339 date/time string.
 *    feedinfo.title    feed title string
 *    feedinfo.entries  array of feed entry details
 * 
 * Feed entry information is returned in a structure:
 *    iteminfo.id       item universally unique identifier string (IRI)
 *    iteminfo.created  date and time of publication as an RFC3339 date/time string.
 *    iteminfo.updated  date and time of last update as an RFC3339 date/time string.
 *    iteminfo.title    item title string
 * 
 * Values are provided as available, or left undefined.  Additional values may
 * also be provided.
 */
shuffl.AtomPub.prototype.listFeed = function (feedinfo, callback) {
    var atompubobj = this;  // for decodeResponse
    function examineRawData(data, type) { 
        log.debug("shuffl.AtomPub.listFeed.examineRawData: "+type);
        log.debug("shuffl.AtomPub.listFeed.examineRawData: "+data);
        //log.debug("shuffl.AtomPub.feedinfo.examineRawData: "+shuffl.elemString(data));
        return data;
    }
    function decodeResponse(data, status) {
        // <atom:feed xmlns:atom="http://www.w3.org/2005/Atom">
        //   <id xmlns="http://www.w3.org/2005/Atom">urn:uuid:90c4d745-7b82-4f29-8b84-1b011630275c</id>
        //   <updated xmlns="http://www.w3.org/2005/Atom">2009-08-20T14:29:44+01:00</updated>
        //   <link xmlns="http://www.w3.org/2005/Atom" href="#" rel="edit" type="application/atom+xml"/>
        //   <title xmlns="http://www.w3.org/2005/Atom">MODIFIED TEST FEED</title>
        //   <entry xmlns="http://www.w3.org/2005/Atom">
        //     <id>urn:uuid:1199aa81-4347-47c0-8a41-f901a1d31fbe</id>
        //     <published>2009-08-20T14:29:44+01:00</published>
        //     <updated>2009-08-20T14:29:44+01:00</updated>
        //     <title>atom.jpg</title>
        //     <link href="?id=urn:uuid:1199aa81-4347-47c0-8a41-f901a1d31fbe" rel="edit" type="application/atom+xml"/>
        //     <link href="atom.jpg" rel="edit-media" type="image/jpeg"/>
        //     <content src="atom.jpg" type="image/jpeg"/>
        //   </entry>
        //   <entry xmlns="http://www.w3.org/2005/Atom">
        //     <published>2009-08-20T14:29:43+01:00</published>
        //     <link href="?id=urn:uuid:e8c1d3ec-56e2-4091-b5b8-ebe55d46ffa1" rel="edit" type="application/atom+xml"/>
        //     <id>urn:uuid:e8c1d3ec-56e2-4091-b5b8-ebe55d46ffa1</id>
        //     <updated>2009-08-20T14:29:43+01:00</updated>
        //     <title>MODIFIED ITEM ADDED TO TEST FEED</title>
        //     <author><name>MODIFIED TEST ITEM AUTHOR NAME</name></author>
        //     <content>MODIFIED TEST ITEM CONTENT</content>
        //   </entry>
        // </atom:feed>
        //
        //log.debug("shuffl.AtomPub.feedinfo.decodeResponse: "+feeduri+", "+status+", "+data);
        //log.debug("shuffl.AtomPub.feedinfo.decodeResponse: "+feeduri+", "+status+", "+shuffl.objectString(data.documentElement));
        log.debug("shuffl.AtomPub.listFeed.decodeResponse: "+feedinfo.path+", "+status+", "+shuffl.elemString(data.documentElement));
        var feedelems = jQuery(data.documentElement).children();
        var fipathuri = atompubobj.getAtomPathUri(feedinfo, feedelems);
        var fi = {
            path:     fipathuri.path,
            uri:      fipathuri.uri,
            id:       feedelems.filter("id").text(),
            updated:  feedelems.filter("updated").text(),
            title:    feedelems.filter("title").text(),
            entries:  []
        };
        log.debug("shuffl.AtomPub.listFeed.decodeResponse: return"+shuffl.objectString(fi));
        feedelems.filter("entry").each(
            function (index) {
                var itemelems = jQuery(this).children();
                var iipathuri = atompubobj.getAtomPathUri(feedinfo, itemelems);
                var ii = {
                    path:     iipathuri.path,
                    uri:      iipathuri.uri,
                    id:       itemelems.filter("id").text(),
                    created:  itemelems.filter("published").text(),
                    updated:  itemelems.filter("updated").text(),
                    title:    itemelems.filter("title").text()
                };
                fi.entries[index] = ii;
            });
        log.debug("shuffl.AtomPub.listFeed.decodeResponse: return"+shuffl.objectString(fi));
        callback(fi);
    }
    // listFeed main body starts here
    var uri = this.serviceUri(feedinfo, "content");
    log.debug("shuffl.AtomPub.listFeed: "+uri);
    jQuery.ajax({
            type:         "GET",
            url:          uri.toString(),
            dataType:     "xml",    // Atom feed info expected as XML
            //dataFilter:   examineRawData,
            success:      decodeResponse,
            error:        shuffl.AtomPub.requestFailed(callback),
            cache:        false
        });
};

// End.