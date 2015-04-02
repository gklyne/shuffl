

# Introduction #

This page is a work-in-progress.

Strengths, Weaknesses, Opportunities, Threats will be recorded as they arise or are noticed.

I read recently:
  * Strengths and Weaknesses are internal factors
  * Opportunities and Threats are external.

# Strengths #

  * Simple, adaptable underlying structure; it has been easy to see how unanticipated user requests can be satisfied.
  * Most potential users respond quickly and positively to the basic UI ideas
  * Card plug-in framework seems to mean that almost any desired functionality is possible. We also have proof-of-concept implementations of quite diverse plugins.

# Weaknesses #

  * Browser portability problems (focusing on Firefox and Safari for now)
  * Impediments of browser "same origin" restriction for Ajax calls
  * eXist AtomPub implementation isn't great; maybe need to consider another?
  * User interface for accessing workspace data is not very attractive, and could be easier to use.  A good implementation will take some effort.  Meanwhile, we can focus on presenting users with dedicated web pages that pre-load a specific workspace.

# Opportunities #

  * Card plug-in architecture allows framework to grow in response to new requirements
  * Possible framework for rapid UI development for other web applications (e.g. Simal use-case).
  * Alternative, more flexible interface to faceted browsers?

# Threats #

  * Failure to achieve stable underlying platform
  * Problems with access to persistent storage (e.g. fragility of AtomPub handler)
  * Failure to fully engage with end users to the extent that they will actually use the system
  * Failure to package the system in a way that meets user expectations for usability; this relates to persistent storage access problems