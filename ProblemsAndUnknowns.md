

# Introduction #

Record here notes of any known problems and uncertainties that are not currently resolved.

See also:
  * [ProblemsAndUnknowns](ProblemsAndUnknowns.md) (this page)
  * [TaskNotes](TaskNotes.md)
  * [FutureApplicationNotes](FutureApplicationNotes.md)
  * [TechnicalNotes](TechnicalNotes.md)

# jQuery and XML namespaces #

jQuery does not natively support XML namerspaces.  This means that results from working with XML documents using namespaces (e.g. DAV, Atom) may be unreliable.  For now, I'm just coding so that it works with eXist Atom data, but that's not a good solution.

I did find [one library](http://www.rfk.id.au/blog/entry/xmlns-selectors-jquery) on the web that appears to be just what is required, but have not yet evaluated it.

There's also some discussion here:
  * http://groups.google.com/group/jquery-dev/browse_thread/thread/40befb9c680335a8
  * http://groups.google.com/group/sizzlejs/browse_thread/thread/48ef43723989de57

# AtomPub feed browsing #

Using eXist, I've been unable to implement AtomPub feed browsing, which means the workspace load/save user interface is less friendly than it might be.
