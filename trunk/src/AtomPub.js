// $Id$

// -------------------------
// AtomPub class and methods
// -------------------------

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

// ---------------------
// AtomPub class methods
// ---------------------

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
        var fipathuri = atompubobj.getAtomLinkPathUri(feedinfo, feedelems);
        var fi = {
            path:     fipathuri.path,
            uri:      fipathuri.uri,
            id:       feedelems.filter("id").text(),
            updated:  feedelems.filter("updated").text(),
            title:    feedelems.filter("title").text(),
            entries:  []
        };
        feedelems.filter("entry").each(
            function (index) {
                var itemelems = jQuery(this).children();
                var iipathuri = atompubobj.getAtomLinkPathUri(feedinfo, itemelems);
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
        log.debug("shuffl.AtomPub.decodeFeedListResponse: return"+shuffl.objectString(fi));
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
        //log.debug("shuffl.AtomPub.decodeResponse: "+
        //    iteminfo.path+", "+status);
        log.debug("shuffl.AtomPub.decodeResponse: "+
            iteminfo.path+", "+shuffl.elemString(data.documentElement));
        //
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
        // <entry xmlns='http://www.w3.org/2005/Atom'>
        //   <id>urn:uuid:2aad829b-29e1-43f0-98b8-955cc2c70cc4</id>
        //   <published>2009-08-25T11:50:16+01:00</published>
        //   <updated>2009-08-25T11:50:16+01:00</updated>
        //   <title>testitem2.json</title>
        //   <link href='?id=urn:uuid:2aad829b-29e1-43f0-98b8-955cc2c70cc4' rel='edit' type='application/atom+xml'></link>
        //   <link href='testitem2.json' rel='edit-media' type='application/octet-stream'></link>
        //   <content src='testitem2.json' type='application/octet-stream'></content>
        // </entry>
        //
        var itemelems = jQuery(data.documentElement).children();
        var iipathuri = atompubobj.getAtomLinkPathUri(iteminfo, itemelems);
        var ii = {
            path:     iipathuri.path,
            uri:      iipathuri.uri,
            id:       itemelems.filter("id").text(),
            created:  itemelems.filter("published").text(),
            updated:  itemelems.filter("updated").text(),
            title:    itemelems.filter("title").text(),
            data:     itemelems.filter("content").text(),
            dataref:  itemelems.filter("content").attr("src"),
            datatype: itemelems.filter("content").attr("type")
        };
        if (ii.dataref != undefined && ii.data == "") { 
            var pathuri = atompubobj.getAtomPathUri(iteminfo, ii.dataref); 
            ii.data     = undefined;
            ii.datauri  = pathuri.uri;
            ii.datapath = pathuri.path;
        };
        callback(ii);
    }
    return decodeResponse;
};

/**
 * Function used to update title of an entry that references an AtomPub 
 * "media resource" (initially, this is created using the slug).
 * 
 * @param atompubobj  AtomPub request object used for the request.
 * @param iteminfo    object containing inofmration about item request from
 *                    previous call of serviceUri (see below).
 * @param callback    callback function with result information.
 * @return            function chained from jQuery.ajax success callback to 
 *                    update the title if appropriate.
 */
shuffl.AtomPub.updateTitle = function(atompubobj, iteminfo, callback) {
    function update(val) {
        log.debug("shuffl.AtomPub.updateTitle: "+shuffl.objectString(val));
        if (val.dataref == undefined || true ||
            val.title   == iteminfo.title || iteminfo.title == "") {
            // No update required
            log.debug("- no update");
            callback(val);
            return;
        };
        // Update title in feed item:
        log.debug("- update title");
        atompubobj.putItem(
            { uri:     val.uri
            , title:   iteminfo.title
            , datauri: val.datauri
            },
            callback);
    };
    return update;
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

// ----------------------
// AtomPub object methods
// ----------------------

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
            shuffl.objectString(info)); 
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
shuffl.AtomPub.prototype.getAtomPathUri = function (info, atomref) {
    var atomuri = this.serviceUri(info, "edit").resolve(atomref);
    return (
        { 'uri':  atomuri
        , 'path': this.getAtomPath(atomuri)
        });
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
shuffl.AtomPub.prototype.getAtomLinkPathUri = function (info, elems) {
    var atomref = elems.filter("link[rel='edit']").attr("href");
    return this.getAtomPathUri(info, atomref);
};

/**
 * Function to assemble a data object for publication for createItem or putItem.
 * 
 * @param iteminfo  object containing information about the item to be created.
 * @return          an object containing request entity values to be passed
 *                  in an Ajax POST or PUT request.
 *
 * The new item data description uses the following fields:
 *   title:     a textual title for the new item.
 *   data:      a data object to be used for the new item.  This may be a
 *              javascript object that is serialized as JSON for the stored
 *              data, or a string, which is used as-is for the data.
 *   datatype:  is the MIME content type of the supplied data.  If this is
 *              "application/atom+xml" the data is embedded in a new feed item
 *              description, otherwise it is pushed to the AtomPub server as-is
 *              and a new item description is created by the server 
 *              (cf. AtomPub "media resource").
 * 
 * The Ajax request values provided are
 *   content:     entity body to be passed with the request
 *   contentType: content type header to be passed with the request
 */
shuffl.AtomPub.assembleData = function (iteminfo) {
    var template =
        '<?xml version="1.0" ?>'+'\n'+
        '<entry xmlns="http://www.w3.org/2005/Atom">'+'\n'+
        '  <title>%(title)s</title>'+'\n'+
        //'  <id>TEST-ITEM-ZZZZZZ.ext</id>'+'\n'+
        //'  <updated>20090709T18:30:02Z</updated>'+'\n'+
        //'  <author><name>TEST ITEM AUTHOR NAME</name></author>'+'\n'+
        '  <content>%(data)s</content>'+'\n'+
        '</entry>'+'\n';
    //log.debug("shuffl.AtomPub.assembleData: "+shuffl.objectString(iteminfo));
    var data  = iteminfo.data;
    var type  = iteminfo.datatype || "application/atom+xml";
    var title = iteminfo.title || "";
    if (typeof data != "string") { data = jQuery.toJSON(data); };
    if (type == "application/atom+xml") {
        data = shuffl.interpolate(template, {title: title, data: data});
    };
    var datainfo = {
        title:        title,
        contentType:  type,
        content:      data
    };
    //log.debug("shuffl.AtomPub.assembleData: "+shuffl.objectString(datainfo));
    return datainfo;
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
 *                  See serviceUri and assembleData for details, and below.
 *
 * The new item description has the following additional fields:
 *   slug:    a suggested name for the new item.  
 *            See http://www.ietf.org/rfc/rfc5023.txt, section 9.7.
 */
shuffl.AtomPub.prototype.createItem = function (iteminfo, callback) {
    function setRequestHeaders(xhr, opts) {
        if (iteminfo.slug) {
            xhr.setRequestHeader("SLUG", iteminfo.slug);
        }
    }
    //log.debug("shuffl.AtomPub.createItem: "+shuffl.objectString(iteminfo));
    var uri      = this.serviceUri(iteminfo, "edit");
    var datainfo = shuffl.AtomPub.assembleData(iteminfo);
    log.debug("shuffl.AtomPub.createItem: "+uri+", "+shuffl.objectString(datainfo));
    jQuery.ajax({
            type:         "POST",
            url:          uri.toString(),
            data:         datainfo.content,
            contentType:  datainfo.contentType,
            dataType:     "xml",    // Atom item info expected as XML
            beforeSend:   setRequestHeaders,
            success:      shuffl.AtomPub.decodeItemResponse(this, iteminfo, 
                              shuffl.AtomPub.updateTitle(this, iteminfo,
                                  callback)),
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

/**
 * Function to update an existing feed item.
 * 
 * @param iteminfo  object identifying a feed and item to be created. 
 *                  See serviceUri and assembleData for details, and below.
 */
shuffl.AtomPub.prototype.putItem = function (iteminfo, callback) {
    // TODO: avoid specifying service when using previous URI?
    var uri = this.serviceUri(iteminfo, "edit");
    var datainfo = shuffl.AtomPub.assembleData(iteminfo);
    log.debug("shuffl.AtomPub.putItem: "+uri+", "+shuffl.objectString(datainfo));
    jQuery.ajax({
            type:         "PUT",
            url:          uri.toString(),
            data:         datainfo.content,
            contentType:  datainfo.contentType,
            dataType:     "xml",    // Atom response expected as XML
            success:      shuffl.AtomPub.decodeItemResponse(this, iteminfo, callback),
            error:        shuffl.AtomPub.requestFailed(callback),
            cache:        false
        });
};

// End