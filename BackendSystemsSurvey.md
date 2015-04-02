

# Introduction #

See also: [RequirementsAndGoals](RequirementsAndGoals.md)

Required:
  * simple REST interface
  * saved data available as RDF using simple HTTP request
  * off-the-shelf (no new code required)
  * arbitrary binary object storage and web access (images, etc.)
  * available for local **or** service deployment

Desired:
  * easy integration with University SSO
  * standard, replaceable API

## Conclusion ##

Subject to a little experimentation, I am currently inclined to go with an AtomPub-based approach, initially using eXist but later to maybe consider other options.  This should also be supportable through the Google data APIs, with at most a little tweaking.


# Caboto #

Provides back-end service for annotations.  At first seems very similar to Shuffl requirements, but on discussion with Damian Steer, I think it's probably too much skewed to annotations, and not really providing general RDF object storage suitable for Shuffl.

# Databank #

  * http://databank.ouls.ox.ac.uk

SVN repositories?  hmm- I can't find the software

See also:
  * http://www.rabbitmq.com/
  * http://www.amqp.org/

Question:
Open source?

Another project from Ben O'Steen:
  * http://oxfordrepo.blogspot.com/2009/05/rdf-ui-fedora-for-object-metadata-rdf.html
there's some cool jQuery stuff here to be used.

I quote:

<blockquote>
For the Web UI:<br>
<br>
Using jQuery and 3 plugins: jEditable, autocomplete and rdfquery.<br>
<br>
<ul><li>jeditable: <a href='http://www.appelsiini.net/projects/jeditable'>http://www.appelsiini.net/projects/jeditable</a>
</li><li>jeditable live demo: <a href='http://www.appelsiini.net/projects/jeditable/default.html'>http://www.appelsiini.net/projects/jeditable/default.html</a> <-- see this to understand what it gives.<br>
</li><li><a href='http://jquery.bassistance.de/autocomplete/demo/'>http://jquery.bassistance.de/autocomplete/demo/</a> <-- example autocomplete demo<br>
</li><li><a href='http://code.google.com/p/rdfquery/'>http://code.google.com/p/rdfquery/</a> from jeni tennison for reading RDFa information from the DOM of an HTML page using javascript.</li></ul>

Needed middleware controls from the Web App:<br>
<ul><li>create new session (specifically, a delta of the RDF expressed in iand's ChangeSet schema<br>
</li><li><a href='http://vocab.org/changeset/schema'>http://vocab.org/changeset/schema</a> ) POST /{object-id}/{RDF}/session/new -> HTTP 201 - session url (includes object id root)<br>
</li><li>POST triples to /{session-url}/update to add to the 'add' and/or 'delete' portions<br>
</li><li>A POST to /{session-url}/commit or just DELETE /{session-url}</li></ul>

And all objects typed by rdf:type (multitypes allowed)<br>
</blockquote>


# Talis platform #

  * http://www.talis.com/platform/

Talis Platform ticks most of the boxes here.  My main reservation is that it's a service-only offering, so research groups don't have the option of using a local server.  Why might they want to do that?  I don't know, but I don't want to impose the choice on them.

Also, integration with a university SSO might be problematic.

I think the API is a Talis design - I don't know if they have any more standard interfaces.


# GetDropBox #

Another web service offering.  This one emulates a file system using HTTP protocol requests.  The implementation is very smooth, but is a service-only offering.


# Atom Publication Protocol options #

See (initially copied from http://www.swordapp.org/sword/specifications):
  * The Atom Syndication Format, RFC 4287 - http://www.ietf.org/rfc/rfc4287.txt
  * The Atom Publishing Protocol, RFC 5023 - http://www.ietf.org/rfc/rfc5023.txt
  * Open Archives Initiative Object Reuse and Exchange, http://www.openarchives.org/ore/
  * Google Data APIs Protocol, http://code.google.com/apis/gdata/
  * http://abdera.apache.org/
  * http://trac.defuze.org/wiki/amplee (has interesting range of back-end support, project activity appears sporadic)

AtomPub is a standard protocol layered on HTTP to read and write Atom feeds.  If the feed structure works for Shuffl collections, this could be an attractive option.

AtomPub implementations...

Need to explore and make sure I can use for arbitrary BLOB storage.  According to Tim Bray, it should work.

## SWORD ##

An AtomPub-derived deposit protocol.

  * http://www.swordapp.org/
  * http://www.ukoln.ac.uk/repositories/digirep/index/SWORD
  * http://www.swordapp.org/sword/specifications

We're not yet looking to be or in a repository, but that may come and it's something to be aware of.


# eXist #

Exist (http://exist.sourceforge.net/) is an XML database implementation that supports a number of APIs, including AtomPub, WebDAV and an HTTP/REST style interface.  This looks like a quick way to get up-and-running, with a number of options fror future exploration.

Exist is servlet-based, and by default installs with Jetty.

There's a lot of XQuery capability here, which I'm not sure I currently see any need for.  But that might change?

Google data APIs?

## Note from Alistair Miles ##

Also, I thought I'd mention that I've been looking at the atom
publishing protocol. I also found that the eXist XML database supports
atompub out of the box<sup>1</sup>. I deployed eXist 1.2 as a war to tomcat,
and I had an atom server running with no coding or configuration. You
can then store/update/delete what is effectively arbitrary XML
content. It might be a quick option for you to get up and running with
your shuffl demo -- you could design a simple XML format for the card
data based on the atom syndication format, use atompub as the protocol
for managing the data, and use an OTS atom server for implementation.

  1. http://exist.sourceforge.net/atompub.html


# Google data APIs #

  * AtomPub-derived

Maybe use as a service backend for Shuffl:  Exist for local or workgroup storage, Google for public free service?

## Note from Alistair Miles ##

I also note that the google data apis <sup>1</sup> are all based
on extensions to atompub. I haven't looked at them in detail, but
might provide some best practice on how to extend atompub.

  1. http://code.google.com/apis/gdata/


# mod\_atom #

See:
  * http://code.google.com/p/mod-atom/
  * http://www.tbray.org/ongoing/When/200x/2007/06/27/mod_atom-status
  * http://www.tbray.org/ongoing/When/200x/2007/06/25/mod_atom


# WebDAV #

WebDAV is a file-access-over-HTTP protocol.  It's main advantage is that many systems have WebDAV file systems.  There's also some support for version management via DeltaV in some implementations.  (Jackrabbit?)

Exist has a WebDAV implementation.

I quickly found a WebDAV client implementation in Javascript.

See:
  * http://ajaxian.com/archives/javascript-webdav-client
  * http://github.com/aslakhellesoy/webdavjs/tree/master
  * http://debris.demon.nl/projects/davclient.js/doc/README.html
  * http://www.webdavsystem.com/ajax


# Apache Jackrabbit / JCR / JSR 170 / JSR 283 #

  * http://jackrabbit.apache.org/

JCR = Java Content Repository

Implements WebDAV/DeltaV

(David Flanders also mentioned another package, named In...?)

Hmmm... I'm more interested in a web interface than a Java API.

For the purposes of Shuffl, the focus is overly on structure and organization.


# Apache CouchDB #

  * http://wiki.apache.org/couchdb/

"Apache CouchDB is a distributed, fault-tolerant and schema-free document-oriented database accessible via a RESTful HTTP/JSON API. Among other features, it provides robust, incremental replication with bi-directional conflict detection and resolution, and is queryable and indexable using a table-oriented view engine with JavaScript acting as the default view definition language."

(Thanks, Al, for the pointer!)


# Garlik 4store #

  * http://4store.org/

(Thanks to Ben O'Steen for the link.)

## Note from Ben O'Steen ##

I've checked with them, and there is no real support for 'FROM' or 'FROM
NAMED' sparql commands, but 'FROM' support can be enabled by
uncommenting a line in the config, apparently.