

# Introduction #

This page is a collection of technical notes and rationale affecting the design choices made in implementing Shuffl.


# Cards, collections and workspaces #

The key underlying concept in Shuffl is a "card", which is roughly analogous to a physical record card.  In its simplest form, a card may contain free-form text notes, with some minimal additional structure: identifier, type, title, tags and content.  Different types of card may be associated with different display characteristics, e.g. colour, size, shape, etc.  The different types may also indicate some additional structure (analogous to pre-printed cards for, say, contact details).  And, within such an extended structure, one card may refer (link) to other cards, building up to a network of information. Card content is not limited to text:  it should be possible to include any web-displayable content in a card (e.g. images, videos, etc.)

Cards may be grouped into collections (or decks?).  Typically, such a collection would be an assembly of similar information (e.g. a stack of address cards), but such homogeneity within a collection is not a requirement.

Collections may also include sub-collections to arbitrary depth.  Inclusion of a card or collection in one collection does not preclude its inclusion in some other collection.

A workspace is a particular visual arrangement of cards and collections:  user interaction is via a workspace.


# Separation of data: content, styling and layout #

As far as possible, card content should be kept logically separate from styling and workspace layout.  The raw data for each card is made available as an addressable web resource.

Information about additional structures, or fields, within card data is associated with a card's type.  Such information does not necessarily constrain the content of any card: there is no enforcement of structural validity, rather this information is intended mainly to guide user interface generation.

Data about inclusion of cards in collections is kept logically separate, so that a separate store or system may be used to define different collections over the same cards.

Data about workspace layout is kept separately from the card and collection data, so that different workspaces may be created for different views over the card and collection  data.  Layout and styling information is also kept separately, and is associated with card types by the workspace data.  Thus different workspaces may select different styling, e.g., suitable for different kinds of display device.

Thus we derive the following logical data elements:
  * Structure descriptions, keyed by type identifier
  * Card data, keyed by card identifier and linked to structures by a type attribute
  * Collection data, linking to cards and other collections, having a collection type, and keyed by a collection identifier
  * Card and collection visual layout and styling information, keyed by layout/style identifiers
  * Workspace description, referencing card data, collection data. containing positioning information and mapping type identiers to layout/style identifiers.


# Card view types / render modes #

Each card may appear in a number of different ways in a workspace:

  * 1-line summary (Title, etc.) and/or icon
  * Full content display
  * Editing display (but see also: http://www.appelsiini.net/projects/jeditable)
  * "Stock" card: icon dragged to main workspace to create a new card

Styling information will be required for each of these.


# Tagging, namespaces and ontologies #

  * informal tags: bare names, syntactic only, but may form groups, clouds, trees, etc.  (SKOS?)
  * local semantics: prefixed tags, assigned default local namespace URI based on serving data store
  * global semantics: prefixed tags with defined PREFIX URI declaration to use global namespace

# Representing card data #

## Custom JSON ##

Initially, I plan to use custom-designed JSON formats as the quickest and most easily adjusted way to get something going.  A workspace description currently looks like this:

```
{ 'shuffl:id':        'sample-2'
, 'shuffl:class':     'shuffl:workspace'
, 'shuffl:version':   '0.1'
, 'shuffl:location':  'http://localhost:8080/.../card_1',
, 'shuffl:base-uri':  '#'
, 'shuffl:uses-prefixes':
  [ { 'shuffl:prefix':  'shuffl',  'shuffl:uri': 'http://purl.org/NET/Shuffl/vocab#' }
  , { 'shuffl:prefix':  'rdf',     'shuffl:uri': 'http://www.w3.org/1999/02/22-rdf-syntax-ns#' }
  , { 'shuffl:prefix':  'rdfs',    'shuffl:uri': 'http://www.w3.org/2000/01/rdf-schema#' }
  , { 'shuffl:prefix':  'owl',     'shuffl:uri': 'http://www.w3.org/2002/07/owl#' }
  , { 'shuffl:prefix':  'xsd',     'shuffl:uri': 'http://www.w3.org/2001/XMLSchema#' }
  ]
, 'shuffl:workspace':
  { 'shuffl:stockbar':
      [ { 'id': 'stockpile_1', 'class': 'stock_1', 'label': 'stock 1' }
      , { 'id': 'stockpile_2', 'class': 'stock_2', 'label': 'stock 2' }
      , { 'id': 'stockpile_3', 'class': 'stock_3', 'label': 'stock 3' }
      , { 'id': 'stockpile_4', 'class': 'stock_4', 'label': 'stock 4' }
      , { 'id': 'stockpile_5', 'class': 'stock_5', 'label': 'stock 5' }
      , { 'id': 'stockpile_6', 'class': 'stock_6', 'label': 'stock 6' }
      ]
  , 'shuffl:layout':
      [ { 'id': '1', 'class': 'stock_1', 'data': 'shuffl_sample_2_card_1.json', 'pos': {left:100, top:20} }
      , { 'id': '2', 'class': 'stock_2', 'data': 'shuffl_sample_2_card_2.json', 'pos': {left:140, top:40} }
      , { 'id': '3', 'class': 'stock_3', 'data': 'shuffl_sample_2_card_3.json', 'pos': {left:180, top:60} }
      , { 'id': '4', 'class': 'stock_4', 'data': 'shuffl_sample_2_card_4.json', 'pos': {left:220, top:80} }
      , { 'id': '5', 'class': 'stock_5', 'data': 'shuffl_sample_2_card_5.json', 'pos': {left:260, top:100} }
      , { 'id': '6', 'class': 'stock_6', 'data': 'shuffl_sample_2_card_6.json', 'pos': {left:300, top:120} }
      ]
  }
}
```

Card data looks like this (where additional data fields may be added in the shuffl:data value):

```
{ 'shuffl:id':        'card_1'
, 'shuffl:class':     'stock_1'
, 'shuffl:version':   '0.1'
, 'shuffl:location':  'http://localhost:8080/.../card_1',
, 'shuffl:base-uri':  '#'
, 'shuffl:uses-prefixes':
  [ { 'shuffl:prefix':  'shuffl', 'shuffl:uri': 'http://purl.org/NET/Shuffl/vocab#' }
  , { 'shuffl:prefix':  'rdf',    'shuffl:uri': 'http://www.w3.org/1999/02/22-rdf-syntax-ns#' }
  , { 'shuffl:prefix':  'rdfs',   'shuffl:uri': 'http://www.w3.org/2000/01/rdf-schema#' }
  , { 'shuffl:prefix':  'owl',    'shuffl:uri': 'http://www.w3.org/2002/07/owl#' }
  , { 'shuffl:prefix':  'xsd',    'shuffl:uri': 'http://www.w3.org/2001/XMLSchema#' }
  ]
, 'shuffl:data':
  { 'shuffl:title':   "Card title here"
  , 'shuffl:tags':    [ 't1', 't2' ]
  , 'shuffl:text':    "Free-form text here"
  }
```


## Extended JSON-RDF ##

For a second phase, I intend to use an extended form of JSON-RDF, as described at http://n2.talis.com/wiki/RDF_JSON_Specification.  By extended, I mean a strict superset:  any valid JSON-RDF file will be acceptable and properly interpreted.

But as part of the process of migrating from relatively free-form data to RDF, I want to allow free-tagging, locally interpreted scoped names (in the style of "machine tags" use by Flickr, etc.), and globally scoped names in the same framework.  Thus, I intend to relax the allowable form of resource identifier to include CURIE-like forms and simple names, yet be able to add appropriate declarations so these can be exported as proper URIs.

```
{ '#card_1': 
    { 'shuffl:uses-format': 
        [ { 'type':'literal', 'value':'extended RDF_JSON' } ]
    , 'shuffl:base-uri':
          [ { 'type':'uri', 'value':'http://example.org/base/path/name#' } ]
    , 'shuffl:location':  
          [ { 'type':'uri', 'value':'http://example.org/location/of/card/data' } ]
    , 'shuffl:uses-prefixes':
        [ { 'type':'bnode', 'value':'_:rdf' }
        , { 'type':'bnode', 'value':'_:rdfs' }
        , { 'type':'bnode', 'value':'_:xsd' }
        ]
, '_:rdf':
    { 'shuffl:prefix': { 'type':'literal', 'value':'rdf' }
    , 'shuffl:uri':    { 'type':'uri',     'value':'...' }
    }
, '_:rdf's:
    { 'shuffl:prefix': { 'type':'literal', 'value':'rdfs' }
    , 'shuffl:uri':    { 'type':'uri',     'value':'...' }
    }
, '_:xsd':
    { 'shuffl:prefix': { 'type':'literal', 'value':'xsd' }
    , 'shuffl:uri':    { 'type':'uri',     'value':'...' }
    }
 :
(main body of data here)
 :
```


## Full RDF/XML ##

Full RDF/XML will be supported though use of the MIT Javascript parser, described at http://dig.csail.mit.edu/breadcrumbs/node/149, which interfaces easily to an rdfQuery store.

Notes for using the Tabulator RDF parser:
  * http://brondsema.net/blog/index.php/2006/11/25/javascript_rdfparser_from_tabulator
  * http://dig.csail.mit.edu/breadcrumbs/node/149 (is this the same parser? I think not.)
  * in terms.js, RDFFormula provides a store for RDF data.
    * there is a simpler one in tabulator/test/rdf/rdfparser.test.html: maybe use this interface to create a wrapper for the rdfquery store?
  * The test store also uses something called XMLSerializer for dealing with XML literals.
  * For Notation3, look for SinkParser (!)

Tabulator RDF store interface methods:
  * @@enumerate the store interface methods here/below


# Modularization of code #

The initial code for Shuffl is somewhat monolithic.  Candidates for modularization include:

  * Core: workspace, drag/drop handlers, card factory index
  * Layout: resize and positioning support
  * External storage: back-end storage interfaces
  * Internal RDF storage: abstraction that can support various interfaces (e.g. RDFQuery, Tabulator/Cwm, etc.)
  * Styling: to some extent, each card type will need its own styling support, but we also want some style concepts that are applicable across all workspaces and card types, to provide a consistent look-and-feel.  Also, we want a way to apply alternative styling schemes in pluggable fashion: how can Javascript interact with external CSS files?  Can we switch in a set of styles from another CSS source file? Each scheme may be a combination of CSS, images files, Javascript.
  * Utils: object formatting, sequencing (monadic?), etc
  * Card-specific code: template, styling: new card types should be added as plug-ins


# Plugins for front end and back end #

Areas where functionality should be devolved to replaceable plug-in components

  * back-end storage (using AtomPub goes some way to achieving this, but we may need to be able to support different implementations such as Google data APIs, etc.)
  * card types and styles
  * embedable web content (images, widgets, etc...)
  * ...

How much of this can be provided by building to the jQuery plugin structure?  Hopefully, all of it.