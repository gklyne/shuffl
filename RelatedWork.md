|  |
|:-|

# jQuery #

  * http://jquery.com/
  * http://code.google.com/p/rdfquery/
  * http://jqueryui.com/
  * http://geekswithblogs.net/AzamSharp/archive/2008/02/21/119882.aspx - drag-and-drop article / tutorial
  * http://www.appelsiini.net/projects/jeditable - in-place text editing
  * http://bililite.com/blog/understanding-jquery-ui-widgets-a-tutorial/ - plugins tutorial
  * http://speckyboy.com/2008/04/02/65-excellent-jquery-resources-tutorialscheat-sheetsebooksdemosplugins/

## Extensions ##

  * http://www.rfk.id.au/blog/entry/xmlns-selectors-jquery - namespace selectors
  * http://code.google.com/p/rdfquery/ - rdfQuery: in-browser RDF processing, along with extras such as a fairly comprehensive URI handling library, limited namespace handling (but see above), etc.
  * http://plugins.jquery.com/project/Comet - Comet/Bayeux implementation (code at http://code.google.com/p/jquerycomet/)

## Widgets ##

  * http://jqueryui.com/
  * http://www.pathf.com/blogs/2006/10/jquery_widgets_/
  * http://www.appelsiini.net/projects/jeditable - in-place text editing
    * http://www.korvus.com/blog/geek/making-the-tab-key-work-with-jeditable-fields/ - tabbing between jeditable fields
  * http://www.spicyexpress.net/general/jquerry-at-it-best-downloadable-jquerry-plugins-and-widgets-for-you-2/
  * http://www.atomeye.com/portfolio/jquery-widgets.html
  * http://www.widgetbox.com/tag/jquery
  * http://www.trendskitchens.co.nz/jquery/contextmenu/ - nicely balanced context menu plugin
  * http://flowplayer.org/tools/scrollable.html - scrollable region, seems to scroll elements rather than text.
  * http://www.kelvinluck.com/assets/jquery/jScrollPane/jScrollPane.html - scrolling text pane plugin.  Turns out all I really needed was "overflow: auto;"
  * http://davecardwell.co.uk/javascript/jquery/plugins/jquery-em/ - interact with 'em' unit value (for text/pixel interactions)
  * http://www.prodevtips.com/2008/11/12/jquery-ui-draggable-and-resizable-combination/ - example of draggable and resizable together;  also has sample mini-plugin code to constrain object to box.
  * http://wiki.fluidproject.org/display/fluid/Demos - various tools, including a fairly heavyweight inline text editor, based on FCKedit. Also, some possibly-useful layout and sorting tools.
  * http://batiste.dosimple.ch/blog/posts/2007-09-11-1/rich-text-editor-jquery.html - A simple rich-text editor plug-in, provides headings, block text, paragraph (flowed) text, bullet lists, bold, italic, images, links, and that's it.  Doesn't hide away when not in use, though.
  * http://www.kollermedia.at/archive/2007/11/21/the-ultimate-jquery-plugin-list/ - ... and more

### MVC type frameworks ###

**http://knockoutjs.com/**

### Data viewing and  Visualization ###

  * http://code.google.com/p/flot/ - very nice graphing package
  * http://www.datatables.net/ - sorting **and** filtering
  * http://www.jnathanson.com/blog/client/jquery/heatcolor/index.cfm - pretty!
  * http://omnipotent.net/jquery.sparkline/ - jQuery sparklines
  * http://blog.parkerfox.co.uk/2009/09/22/bezier-curves-and-arcs-in-jquery/ - bezier curves (focuses on animation, but bezier calculation is there. I wonder if anyone has done a bezier-drawing plugin?)
  * http://www.openstudio.fr/Library-for-simple-drawing-with.html - **note** viral licence
See also:
  * http://www.webdesignbooth.com/15-great-jquery-plugins-for-better-table-manipulation/

## Atom and feeds ##

  * http://plugins.jquery.com/project/jFeed - despite earlier searching, I discovered this after I'd started work on the AtomPub handler.  It's mainly complementary, as it focuses on feed parsing.

# Atom publishing protocol #

  * The Atom Syndication Format, RFC 4287 - http://www.ietf.org/rfc/rfc4287.txt
  * The Atom Publishing Protocol, RFC 5023 - http://www.ietf.org/rfc/rfc5023.txt
  * Google Data APIs Protocol - http://code.google.com/apis/gdata/
  * eXist - http://exist.sourceforge.net/, http://exist.sourceforge.net/atompub.html - supports AtomPub out of the box
  * Abdera - http://abdera.apache.org/
  * Amplee - http://trac.defuze.org/wiki/amplee (has interesting range of back-end support, project activity appears sporadic)
  * Sword - http://www.swordapp.org/, http://www.ukoln.ac.uk/repositories/digirep/index/SWORD, http://www.swordapp.org/sword/specifications
    * Open Archives Initiative Object Reuse and Exchange - http://www.openarchives.org/ore/
  * mod\_atom - http://code.google.com/p/mod-atom/, http://www.tbray.org/ongoing/When/200x/2007/06/27/mod_atom-status, http://www.tbray.org/ongoing/When/200x/2007/06/25/mod_atom

  * http://blog.ianbicking.org/2009/01/11/atompub-instead-o-webdav/ - a blog piece by Ian Bicking exploring AtomPub as an alternative to webDAV, which is roughly how Shuffl uses AtomPub.

# RDF serialization, parsing and presentation #

  * Javascript RDF parser from MIT: http://dig.csail.mit.edu/breadcrumbs/node/149
  * RDF serialization in JSON: http://n2.talis.com/wiki/RDF_JSON_Specification
  * Fresnel - RDF data lenses, http://www.w3.org/2005/04/fresnel-info/, http://www.w3.org/2005/04/fresnel-info/fsl/, http://simile.mit.edu/wiki/Fresnel


# User interfaces for data #

  * http://www.piccolo2d.org/ - piccolo2d, a structured 2D graphics framework
  * http://sig.ma/ - Sig.ma - Live views on the Web of Data
  * Fresnel - RDF data lenses, http://www.w3.org/2005/04/fresnel-info/, http://www.w3.org/2005/04/fresnel-info/fsl/, http://simile.mit.edu/wiki/Fresnel
  * Tabulator redux - http://events.linkeddata.org/ldow2008/papers/11-berners-lee-hollenbach-tabulator-redux.pdf
  * Semantic Media Wiki - http://semantic-mediawiki.org/wiki/Semantic_MediaWiki
  * http://code.google.com/p/dsn-chassis/wiki/DocFractalUi- _FractalUI_ - Alistair Miles notes about a pattern that he originally developed for FlyWeb and is now re-employing in other contexts.  The self-similarity theme is neat.
  * http://www.langegger.at/content/xlwrap-released - _XLWrap released_ -  Spreadsheet-to-RDF wrapper XLWrap and XLWrap-Server, which can be used to: publish information stored in spreadsheets; semantically integrate multiple spreadsheets in LANs/Intra/Extranets; support rapid prototyping of Linked Data apps (edit human-readable live data behind the exposed SPARQL endpoint).
  * http://projects.csail.mit.edu/exhibit/Dido/ - _Dido_ - The Data-Interactive Document

# Back-end storage and serving options #

  * Caboto – Annotation storage for 3 JISC projects - http://code.google.com/p/caboto/
  * Apache CouchDB -  http://wiki.apache.org/couchdb/
  * Apache jackrabbit
  * http://xlwrap.sourceforge.net/ - wrap spreadsheet data to serve RDF (directly or via SPARQL?)
  * Databank
  * Fedorazon
  * Talis platform
  * WebDAV


# General Semantic Web #

  * RDF Concepts - http://www.w3.org/TR/rdf-concepts/
  * SPARQL – http://www.w3.org/TR/rdf-sparql-query/, http://www.w3.org/TR/rdf-sparql-protocol/
  * SPARQLite - http://sparqlite.googlecode.com
  * Linked data on the web - http://en.wikipedia.org/wiki/Linked_Data
  * Annotea - W3C web annotation system, http://www.w3.org/2001/Annotea/


# General data management #

  * ODIT – Oxford University, Office of the Director of IT: Scoping digital repository services for research data management - findings http://www.ict.ox.ac.uk/odit/projects/digitalrepository/findings.xml
  * Idealist - Idealist text indexing database http://www.chr.org.uk/idealist.htm
  * Mind mapping - Mind mapping systems http://en.wikipedia.org/wiki/Mind_map
  * HyperCard - http://en.wikipedia.org/wiki/HyperCard/
  * NoteCards - http://en.wikipedia.org/wiki/NoteCards, http://doi.acm.org/10.1145/30851.30859, http://doi.acm.org/10.1145/317426.317451, http://www.it.teithe.gr/~cs1msa/notecards.htm
  * Check out "voodoopad"
    * (cf. tomboy, tiddlywiki)
  * Mingle - http://studios.thoughtworks.com/mingle- agile-project-management
  * FlyTED - http://www.fly-ted.org/
  * FlyWeb - Linking Laboratory Image Data with Public Databases and Publication Repositories, http://www.jisc.ac.uk/whatwedo/programmes/resourcediscovery/flyweb.aspx
  * OpenFlyData - http://openflydata.org /
  * (sensors - dave de roure, simon coles, ...)


# Textual description to ontology migration #

  * http://lists.w3.org/Archives/Public/semantic-web/2009Sep/0170.html
    * Framework: http://marinemetadata.org/semanticframeworkconcept
      * This proposal describe how the earth science community can bootstrap from almost no documented controlled vocabularies, to a rich, archived, interoperable collection of terms, definitions, and associated metadata, leveraging semantic web tools and concepts.
    * Tools: http://mmisw.org/orr
      * The MMI Ontology Registry and Repository, leveraging tools from Stanford's BioPortal project, makes it easy to translate vocabularies from simple text formats to a semantic web format. It converts the text to RDF, registers it in an ontology repository, and serves information about each term in a browser (by resolving the unique URI for that term).


# Others (expand selected candidates in separate sections) #

  * Microsoft Surface - http://www.microsoft.com/SURFACE/Default.aspx
  * Perceptive Pixel - multitouch display screens, http://www.perceptivepixel.com/

David Shotton suggested some links from his Amsterdam meeting that seemed to have some bearing on Shuffl:
  * http://technologies.kmi.open.ac.uk/cohere/ - references work that may offer be some ideas for visualization of Shuffl decks?
  * http://kmi.open.ac.uk/publications/pdf/kmi-04-29.pdf - talks about "information bricks" - maybe analogous to Shuffl's use of record cards?