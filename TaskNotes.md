See also:
  * [TaskNotes](TaskNotes.md) (this page)
  * [ProblemsAndUnknowns](ProblemsAndUnknowns.md)
  * [FutureApplicationNotes](FutureApplicationNotes.md)
  * [TechnicalNotes](TechnicalNotes.md)

# Project admin #

  * Notes about project setup and sustainability choices for OSS-Watch

# Requirements gathering #

  * Meet with Alistair Miles / malariagen group?
  * Meet with someone in Donna's group about annotations

# Architecture #

  * tech issues (separation of data: content, styling, layout, etc.)
  * tech issues (cards and containers; grouping / stack management)
  * tech issues (different card view types / render modes; e.g. icon, thumbnail, row view, ... )
  * tech issues (organization of stored data; formats, use of directories, etc.)
    * Using RDF for stored card data.  For now, JSON is just very much quicker and easier.  Maybe, will even use back-end service to deliver RDF?
    * CSV import as a collection of cards;  instead use a single card.  Problem here was that with multiple cards, it was not clear what to do on reload.  Later, may provide facility to pull out individual rows as separate cards.

# Technical debt #

  * Card delete (or hide)
  * Atom feed browser / file browsing
    * File browsing interface:  the file input widget won't return the full file path, and eXist service document does not list available feeds.  May want instead to keep a record of a user's recent activities ad allow pick from that.
    * Look to WebDAV?
  * Card menu
  * Refactor CSS so that card layout is more cleanly separated from styling
  * Visual linking indication (e.g. line between cards) requires disproportionate effort for this stage (e.g. drawing "rubberband" lines on workspace.  Have done a little spike code with a jQuery SVG plugin, but more effort is required. For now, cards are stand-alone.
  * On-the-fly saving of card changes.  I think the backend framework needs to be reviewed (maybe also supporting WebDAV) before this is really practical.