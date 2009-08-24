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
 * Function for decoding feed information values from an Ajax response via 
 * a 'success' callback.
 * 
 * @param atompubobj  AtomPub request object used for the request.
 * @param feedinfo    object containing inofmration about feed request from
 *                    previous call of serviceUri (see below).
 * @param callback    callback function with result information.
 * @return            jQuery.ajax success callback function to decode the
 *                    response and then call the supplied callback function.
 */
shuffl.AtomPub.decodeFeedInfoResponse = function (atompubobj, feedinfo, callback) {
    function decodeResponse(data, status) {
        //log.debug("shuffl.AtomPub.feedinfo.decodeResponse: "+feeduri+", "+status+", "+data);
        //log.debug("shuffl.AtomPub.feedinfo.decodeResponse: "+feeduri+", "+status+", "+shuffl.objectString(data.documentElement));
        //log.debug("shuffl.AtomPub.feedinfo.decodeResponse: "+feedinfo.path+", "+status+", "+shuffl.elemString(data.documentElement));
        //
        // <service xmlns='http://www.w3.org/2007/app'>
        //   <workspace>
        //     <title xmlns='http://www.w3.org/2005/Atom'>Test feed</title>
        //     <collection href='/atom/edit/testfeed'>
        //       <title xmlns='http://www.w3.org/2005/Atom'>Test feed</title>
        //       <accept>text/*,image/*,application/*</accept>
        //     </collection>
        //   </workspace>
        // </service>
        //
        var fi = { path: feedinfo.path };
        var c = jQuery(data.documentElement).find("collection");
        if (c.length != 0) {
            fi.uri   = shuffl.extendUriPath(atompubobj.baseuri, c.attr("href"));
            fi.title= c.find("title").text();
        };
        callback(fi);
    }
    return decodeResponse;
};

/**
 * Function for decoding feed listing values from an Ajax response via 
 * a 'success' callback.
 * 
 * @param atompubobj  AtomPub request object used for the request.
 * @param feedinfo    object containing inofmration about feed request from
 *                    previous call of serviceUri (see below).
 * @param callback    callback function with result information.
 * @return            jQuery.ajax success callback function to decode the
 *                    response and then call the supplied callback function.
 */
shuffl.AtomPub.decodeFeedListResponse = function (atompubobj, feedinfo, callback) {
    function decodeResponse(data, status) {
        //log.debug("shuffl.AtomPub.feedinfo.decodeResponse: "+feeduri+", "+status+", "+data);
        //log.debug("shuffl.AtomPub.feedinfo.decodeResponse: "+feeduri+", "+status+", "+shuffl.objectString(data.documentElement));
        //log.debug("shuffl.AtomPub.listFeed.decodeResponse: "+feedinfo.path+", "+status+", "+shuffl.elemString(data.documentElement));
        //
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
    return decodeResponse;
};

/**
 * Function for decoding feed item values from Ajax response via 'success'
 * callback.
 * 
 * @param atompubobj  AtomPub request object used for the request.
 * @param iteminfo    object containing inofmration about item request from
 *                    previous call of serviceUri (see below).
 * @param callback    callback function with result information.
 * @return            jQuery.ajax success callback function to decode the
 *                    response and then call the supplied callback function.
 */
shuffl.AtomPub.decodeItemResponse = function (atompubobj, iteminfo, callback) {
    function decodeResponse(data, status) {
        // <entry xmlns="http://www.w3.org/2005/Atom">
        //   <id>urn:uuid:9475cf17-eb4e-4887-9ac5-f579b2d79692</id>
        //   <updated>2009-08-24T12:38:01+01:00</updated>
        //   <published>2009-08-24T12:38:01+01:00</published>
        //   <link href="?id=urn:uuid:9475cf17-eb4e-4887-9ac5-f579b2d79692" 
        //         rel="edit" type="application/atom+xml"/>
        //   <title>Test item</title>
        //   <content>{"a": "A", "b": "B"}</content>
        // </entry>
        //
        //log.debug("shuffl.AtomPub.decodeResponse: "+
        //    iteminfo.path+", "+status);
        log.debug("shuffl.AtomPub.decodeResponse: "+
            iteminfo.path+", "+shuffl.elemString(data.documentElement));
        var itemelems = jQuery(data.documentElement).children();
        var iipathuri = atompubobj.getAtomPathUri(iteminfo, itemelems);
        var ii = {
            path:     iipathuri.path,
            uri:      iipathuri.uri,
            id:       itemelems.filter("id").text(),
            created:  itemelems.filter("published").text(),
            updated:  itemelems.filter("updated").text(),
            title:    itemelems.filter("title").text(),
            data:     itemelems.filter("content").text()
        };
        callback(ii);
    }
    return decodeResponse;
};

/**
 * Function for handling ajax request failure
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
 * Method to extract an Atom feed or item path from an Atom URI
 * 
 * @param uri       URI of Atom feed or item
 * @return          path of Atom feed or item with service elements stripped out.
 */
shuffl.AtomPub.prototype.getAtomPath = function(uri) {
    // I think there's an eXist AtomPub bug in returned href values,
    // leading to the removal of "atom/" about here.
    // This function isolates the hack.
    return uri.path.replace(/\/exist\/atom\/edit/, "")+shuffl.uriQuery(uri);
};

/**
 * Method to return an Atom service URI for operations on a feed or item.
 * 
 * @param feedinfo  object identifying a feed.
 * @param service   string indicating what feed service is required:
 *                  "introspect", "edit" or "content"
 *
 * The feed identification object has the following fields: 
 *   path:  is feed uri path of the feed to be accessed,
 * or:
 *   base:  names the feed uri path at which the new feed is 
 *          created, or "/".  Must end with '/'.
 *   name:  a name for the new feed, appended to the base path.
 */
shuffl.AtomPub.prototype.serviceUri = function (info, service) {
    if ( !info.path ) { info.path = info.base+info.name; };
    if ( !info.path ) { info.path = this.getAtomPath(info.uri); };
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
    var atomref = elems.filter("link[rel='edit']").attr("href");
    var atomuri = this.serviceUri(info, "edit").resolve(atomref);
    return (
        { 'uri':  atomuri
        , 'path': this.getAtomPath(atomuri)
        });
};

/**
 * Function to obtain information about a feed
 * 
 * @param feedinfo  object identifying a feed. See serviceUri for details.
 * @param callback  function to call with final result,
 *                  or a shuffl.Error value.
 */
shuffl.AtomPub.prototype.feedInfo = function (feedinfo, callback) {
    function examineRawData(data, type) { 
        log.debug("shuffl.AtomPub.feedinfo.examineRawData: "+type);
        log.debug("shuffl.AtomPub.feedinfo.examineRawData: "+data);
        //log.debug("shuffl.AtomPub.feedinfo.examineRawData: "+shuffl.elemString(data));
        return data;
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
            success:      shuffl.AtomPub.decodeFeedInfoResponse(this, feedinfo, callback),
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
 * @param callback  function to call with final result,
 *                  or a shuffl.Error value.
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
 * @param callback  function to call with final result,
 *                  or a shuffl.Error value.
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
    // listFeed main body starts here
    var uri = this.serviceUri(feedinfo, "content");
    log.debug("shuffl.AtomPub.listFeed: "+uri);
    jQuery.ajax({
            type:         "GET",
            url:          uri.toString(),
            dataType:     "xml",    // Atom feed info expected as XML
            success:      shuffl.AtomPub.decodeFeedListResponse(this, feedinfo, callback),
            error:        shuffl.AtomPub.requestFailed(callback),
            cache:        false
        });
};

/**
 * Create a new item in a feed
 * 
 * @param iteminfo  object identifying a feed and item to be created. 
 *                  See serviceUri for details, and below:
 *
 * The new item description has the following additional fields:
 *   slug:    a suggested name for the new item.  
 *            See http://www.ietf.org/rfc/rfc5023.txt, section 9.7.
 *   title:   a textual title for the new item.
 *   data:    a data object to be used for the new item.  This may be a
 *            javascript object that is serialized as JSON for the stored
 *            data, or a string, which is used as-is for the data.
 *   uri:     TBD
 */
shuffl.AtomPub.prototype.createItem = function (iteminfo, callback) {
    var template =  '<?xml version="1.0" ?>'+'\n'+
                    '<entry xmlns="http://www.w3.org/2005/Atom">'+'\n'+
                    '  <title>%(title)s</title>'+'\n'+
                    //'  <id>TEST-ITEM-ZZZZZZ.ext</id>'+'\n'+
                    //'  <updated>20090709T18:30:02Z</updated>'+'\n'+
                    //'  <author><name>TEST ITEM AUTHOR NAME</name></author>'+'\n'+
                    '  <content>%(data)s</content>'+'\n'+
                    '</entry>'+'\n';
    function setRequestHeaders(xhr, opts) {
        xhr.setRequestHeader("Content-Type", "application/atom+xml");
        if (iteminfo.slug) {
            xhr.setRequestHeader("SLUG", iteminfo.slug);
        }
    }
    //log.debug("shuffl.AtomPub.createItem: "+shuffl.objectString(iteminfo));
    var uri   = this.serviceUri(iteminfo, "edit");
    var data  = iteminfo.data;
    if (typeof data != "string") { data = jQuery.toJSON(data); };
    var title = iteminfo.title || "";
    log.debug("shuffl.AtomPub.createItem: "+uri+", "+title+", "+data);
    jQuery.ajax({
            type:         "POST",
            url:          uri.toString(),
            data:         shuffl.interpolate(template, {title: title, data: data}), 
            contentType:  "application/atom+xml",
            dataType:     "xml",    // Atom item info expected as XML
            beforeSend:   setRequestHeaders,
            success:      shuffl.AtomPub.decodeItemResponse(this, iteminfo, callback),
            error:        shuffl.AtomPub.requestFailed(callback),
            cache:        false
        });
};

/**
 * Function to obtain information about an item
 * 
 * @param iteminfo  object identifying an item. See serviceUri for details.
 */
shuffl.AtomPub.prototype.getItem = function (iteminfo, callback) {
    log.debug("shuffl.AtomPub.getItem: "+shuffl.objectString(iteminfo));
    var uri = this.serviceUri(iteminfo, "content");
    log.debug("shuffl.AtomPub.getItem: "+uri);
    jQuery.ajax({
            type:         "GET",
            url:          uri.toString(),
            dataType:     "xml",    // Atom feed info expected as XML
            success:      shuffl.AtomPub.decodeItemResponse(this, iteminfo, callback),
            error:        shuffl.AtomPub.requestFailed(callback),
            cache:        false
        });
};


// End