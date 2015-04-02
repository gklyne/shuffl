# Introduction #

These are notes for possible future developments, not forming part of the current active project

See also:
  * [FutureApplicationNotes](FutureApplicationNotes.md) (this page)
  * [TaskNotes](TaskNotes.md)
  * [ProblemsAndUnknowns](ProblemsAndUnknowns.md)
  * [TechnicalNotes](TechnicalNotes.md)

# Google Wave integration #

Embed a Shuffl workspace in a Wave.

Embed a Wave in a Shuffl card.

Embed exported Shuffl data in a Wave =

# Video annotation #

Embed VLC browser-based player in a card

Provide UI for stop/start/location control of video

Event passing framework to synchronize multiple instances

# Audio recordings and annotations #

Possible experimentation with audio-to-text conversion.

and/or:

Embed audio in card and create time-stamped annotations, similar to video annotation.

# Open citation network #

One thing that comes over to me from discussion with Nathan Pike and David Shotton is that,
despite the availability of several systems to help researchers,
reference management is still a pain point.

I hypothesize that one reason for this is the somewhat closed or inward-looking nature of many
of these existing systems, which stands in contrast to many principles of the World Wide Web.
Even systems that are nominally open, in that they don't actually lock the data away,
> are not entirely supportive of open exchange because they use application-specific data formats.
This is something the semantic web aims to change (just as the original web has done for documents).

Which has led me to think of a possible application that might include Shuffl,
which also ties in with some of David's ideas for citation network analysis.

  * references are a pain point for researchers
  * many specialized systems (Endnote, Connotea, Zotero, ...)
  * but references don't exist in isolation - they **refer** to real things!  Reference management shouldn't be completely isolated from those things.
  * want to find ways of accessing, sharing and analyzing references and their relationships

OPEN UP THE CITATION INFORMATION:
  * near-term value: relieve (or share) some of the pain
  * long term value: expose paths to new knowledge, etc...
  * use RDF, with vocabulary (Cito), and open publication like FOAF
  * link to existing systems and expose content as RDF/Cito
  * gives Cito an immediate purpose
  * augment, don't compete with existing systems:  unlock their content, don't try to displace it.
  * add tooling to support linkage to other real-world entities (e.g. Shuffl?)

# Twitter-card #

Design a card to act as a mini feed aggregator; also possibly fire of messages from linked cards?

# Ontology/vocabulary creation #

Building upon experiments using spreadsheets to provide a frame-oriented vocabulary description, use cards for frames, with fields for properties, etc., and generate OWL description from these.

# Other #

  * Synchronize with mobile device notes !!!
  * More generally, card as unit of synchronization / update