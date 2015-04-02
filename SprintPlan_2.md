

# Introduction #

## Current milestone ##

| Month | Activity | Deliverables |
|:------|:---------|:-------------|
| 2: 28Aug 12days | Develop supporting back-end service, and canvass potential users for feedback on initial interface - identification of a minimum system that target users would actually use for some purpose, however trivial. | Initial front-to-back system. Basic user documentation. A "hit list" of desired features. |

## Current sprint ##

| Sprint 2 | 2 Aug - 28 Aug  | 12 days including vacation: 6 working days |
|:---------|:----------------|:-------------------------------------------|

# User stories and activities #

| **Activity number** | **Description** | **Effort est** | **Effort actual** | **Target date** | **Completion date** |
|:--------------------|:----------------|:---------------|:------------------|:----------------|:--------------------|
| 1.   | **Project mananement** | **1.0** | **0.2** |
| 1.1. | Sprint 2 plan             | 0.2 | 0.2 | 02-Aug-2009 | 17-Aug-2009 |
| 1.2. | Sprint 2 review (retrospective)  | 0.2 | -- | 28-Aug-2009 | -- |
| 1.3. | Sustainability plan   | 0.2   | -- |  ?? | (ongoing) |
| 1.4. | Miscellaneous admin, etc  | 0.4 | 0.4 | -- | -- |
| 2.   | **Community engagement and dissemination** | **1.5** | **0.0** |
| 2.1  | Set up and conduct meetings with users | 1.0 | 0.1 | (sprint) | (incomplete) |
| 2.2  | Introductory user documentation | 0.5 | -- | 28-Aug-2009 | -- |
| 3.   | **Technical development** | **3.5** | **0.0** |
| 3.1  | Initial content persistence  | 3.5 | 3.8 | 28-Aug-2009 | (incomplete) |

# Task breakdowns #

(effort estimates in days to nearest 0.25)

## 3.1: Initial content persistence ##

3.5 days:

  * (2.0) AtomPub protocol library, tested against eXist
    * completed with 3.8 days effort
  * (1.0) persist workspace content/layout changes
  * (0.5) persist changes to card content

# Sprint review notes #

AtomPub implementation overran estimate: see http://shuffl-announce.blogspot.com/2009/08/implementing-atompub.html.

## End of sprint review ##

Sprint dominated by AtomPub implementation - see notes linked above.

Workspace persistence is not yet completed.

Some planned time was lost to another project, which has now passed a key milestone, so I should be able to start clawing this back.

# Activity summary #

17-Aug-2009:
  * (0.1) prepared order for portable demo system
  * (0.2) sprint plan
  * (0.1) investigate AtomPub introspection with eXist
  * (0.1) wrestle with Eclipse/SVN problems

18-Aug-2009:
  * (0.2) work on AtomPub tests and code

19-Aug-2009:
  * (0.2) explore Jetty configuration for running shuffl tests locally - it seems rather hard work - best guide so far is http://www.nabble.com/How-to-serve-static-content-from-packaged-Jetty-web-server--td22094983.html.  Symlinks don't work, so it looks as if I may need to copy all the test data :(
  * (0.1) finally found jetty configuration for eXist: tools/jetty/etc/jetty.xml.  Can disable alias checking to simplify file serving.  Also lists directories.
  * (0.4) continue working on AtomPub protocol handler - got basic Ajax tests working.

20-Aug-2009:
  * (0.9) Had an long session working on AtomPub protocol implementation, making substantial progress, but slower than anticipated. I now have a fairly substantial battery of tests running around feed creation and access, and in the process have established code for analyzing Atom feed and item values. The next major step is to create items within a feed, and recover them successfully. There's an outstanding issue of namespace handling (jQuery doesn't), but I'll come back to that later.

24-Aug-2009:
  * (0.1) Arranged meeting with Chrs Holland for 2-Sep
  * (0.7) AtomPub test cases. Item creation and retrieval working and tested

25-Aug-2009:
  * (1.0) AtomPub implementation, almost complete

26-Aug-2009:
  * (0.2) Misc email, demo system order chasing
  * (0.2) Completed AtomPub implementation and tests (!)