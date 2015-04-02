

# Introduction #

This sprint will be a continuation of the previous sprint's data visualization work.  The focus will be making it relatively easy to create useful graphical displays from Chris Holland's data.  A number of details that need addressing are now coming apparent that were not allowed for in the original plan, mainly centred around the user interface and usability.  These additional details arise to a large extent as a result of the change of early focus to visualization rather than collection of data.

Software is not yet in a state to consider final packaging and documentation as envisaged by the original outline plan (see below).  Before the end of this or the final sprint, I really need to ensure that the sustainability plan has been wrapped up (as far as I can), and the CLA is in place so that development can continue in partnership with other projects.  (Despite possibly achieving less than a fully deployable application, I feel that a very useful platform has been created for continuing useful work, and that the original goals remain viable and attainable with further effort, which will be forthcoming as part of the ADMIRAL project.)

## Current milestone ##

| Month | Activity | Deliverables |
|:------|:---------|:-------------|
| 5: 27Nov 16days | Create promotional materials (webcast, dissemination, demonstrations, etc.). Establish a long-term home for the demo service. Ensure that users with whom we have engaged are comfortable with what is available as this project winds down. | Public repository contains fully tested software, documentation, promotional materials, deployment instructions, examples, etc., in a state suitable to support ongoing open community development. |


## Current sprint ##

| Sprint 7 | 2 Nov - 13 Nov  | 8 days |
|:---------|:----------------|:-------|

Previous sprint plan: [SprintPlan\_6](SprintPlan_6.md).

Project outline plan: [ProjectPlanOutline\_200906\_200911](ProjectPlanOutline_200906_200911.md).

# User stories and activities #

| **Activity number** | **Description** | **Effort est** | **Effort actual** | **Target date** | **Completion date** |
|:--------------------|:----------------|:---------------|:------------------|:----------------|:--------------------|
| 1.   | **Project administration**                 | **1.5** | **1.5** |
| 1.1. | Sprint 7 plan                            | 0.25  | 0.2 | 02-Nov-2009 | 03-Nov-2009 |
| 1.2. | Sprint 7 review (retrospective)          | 0.25  | -- | 13-Nov-2009 | 16-Nov-2009 |
| 1.3. | Sustainability plan                      | 0.25  | -- | (ongoing)   | -- |
| 1.4. | Miscellaneous admin, email, etc          | 0.75  | 1.3 | -- | -- |
| 2.   | **Community engagement and dissemination** | **0.5** | **0.3** |
| 2.1  | Other use cases                          | --    | -- | (ongoing) | -- |
| 2.2  | Demo revised graphing to Chris Holland (and others)  | 0.5   | 0.3 | (sprint)  | 11-Nov-2009 |
| 2.3  | Introductory user documentation          | --    | -- | (sprint)  | -- |
| 3.   | **Technical development**                  | **5.0+** | **5.6** |
| 3.1  | Code maintenance / bug fixes             | 0.5   | 0.8 | (ongoing) | -- |
| 3.2  | Revised data import/visualization        | 3.5   | 2.9 | (sprint) | 11-Nov-2009 |
| 3.3  | Improve I/O error handling               | 1.0   | 1.0 | (sprint) | 12-Nov-2009 |
| 3.4  | Load/Save user interface improvement   | _(5.0)_ | 0.9 | (start) | (ongoing) |

# Task breakdowns #

(effort estimates in days to nearest 0.25)

## 3.2: Revised data import/visualization ##

Estimated effort: 3.5 days

  * (1.0) add column status selectors (none, x1, y1, y2) and link to output data (**Done** 06-Nov-2009)
  * (0.5) add scale axis transformation options  (**Done** 06-Nov-2009)
  * (0.5) save card data linkage in serialization of workspace (**Done** 03-Nov-2009)
  * (0.5) implement user-editable labels and link to output (**Deferred**)
  * (1.0) add colour selection and link to output data (**Deferred**)

Actual effort: 2.9 days (for 2.0 planned activity)

## 3.3: Improve I/O error handling ##

The main goal of this task is to prevent I/O errors on workspace load (e.g. non-existent files) from completely locking up further Shuffl I/O.

Estimated effort: 1.0 days

  * (0.25) complete new error reporting functions (**Done** 11-Nov-2009/0.2)
  * (0.25) revise existing code to use new error reporting function (**Done** 11-Nov-2009/0.2)
  * (0.5) review workspace load/save code to catch I/O errors, report them and take appropriate recovery steps (**Done** 12-Nov-2009/0.6)

Actual effort: 1.0 days (for 1.0 planned activity)

## 3.4: User interface for load/save workspace ##

This task will be progressed but probably not completed within this sprint.

Estimated effort: 5.0 days

  * (0.5) implement generic read-only interface plugin for local files
  * (1.0) implement generic interface plugin for AtomPub
  * (1.0) implemented simplified load/save user interface using back-end plugin features
  * (0.5) investigate Google data interface
  * (2.0) implement generic interface plugin for Google Data

Actual effort: 0.9 days (for 0 planned activity)

# Sprint review notes #

First week:  most of the effort has been spent working on the user interface for graph display, which feels like a distraction from the main target.  I guess this is the price of taking the visualization route for engaging researchers.  I can't compete with Excel here. Even with the magic of jQuery, UI development is still very time consuming, dealing with the many minutiae that are needed for even rudimentary usability.  Label editing and colour selection are still outstanding, but I think I've done enough for now, at least until I can speak again with Chris.

The data visualization was deemed complete on 11 Nov 2009, when Chris Holland agreed that the outstanding sub-tasks were not an immediate priority.

Started work on improving I/O interface by attacking the I/O interface.  The system now handles basic I/O failures much more robustly, in particular not locking out subsequent load/save activity.  Started creating a framework to test and implement the revised API worked out in a previous sprint.  The basic test framework and basic structure is in place, and work has started on the local file system implementation, but none of the identified sub-tasks are actually complete.

Some unrecorded time was spent on sustainability-related activity, notably adapting the University-approved CLA forwarded by Ross at OSS Watch, and publishing that in the project wiki.  I need to revisit the sustainability plan and clean up loose ends, but this may not happen before project termination at the end of November.

## End-of-sprint review ##

The high point of this sprint was the enthusiastic reception of the visualization interface, even though this has been completed at the expense of some of the other more curation-oriented features.  If this truly helps us achieve better engagement for the ADMIRAL project, I judge this will have been a good trade-off, but some cautionary notes raised on the discussion group about maintaining the right project focus need to be borne in mind.  The mechanisms for working directly with spreadsheet data went some way to reducing the pressure for some of the features not yet implemented.  I have agreed with Chris Holland to install a copy of Shuffl on a system where he can use it directly with his own data, which will hopefully provide a powerful point of engagement for continuing work on ADMIRAL.

It may be worth noting that I don't feel the focus on visualization has been entirely at the expense of the original goals of Shuffl; i.e., to provide a lightweight tool for capturing and sharing annotations and data. Many of the fundamental capabilities have been demonstrated, but in different combinations: user-editable semi-structured data, card linking, and a flexible, pluggable framework for introducing new card structures.  On the down side, some of the intended work on containers (e.g. stacks of cards) has not been addressed, and the card serialization format currently deployed is not RDF.

The testing framework has been extremely valuable.  The full test suite now performs in excess of 2000 individual tests (though many of these are repetitious).  Areas which have proved more challenging to debug have been exactly those parts of the user interaction code that are not covered by unit tests.  I have resisted taking time to implement a UI test framework (e.g. based on Selenium), but rather have tried to move logic out of the user interaction code into unit-testable functions.  This is a debatable strategy, but in the limited time available I didn't feel the benefits of deploying a full UI test suite would get me further forward.  When I get time, I'd like to evaluate the Windmill framework (http://www.getwindmill.com/), as my past experience with Selenium has been somewhat mixed.

With work on Shuffl planned to continue as part of the ADMIRAL project, I feel my top priority is to implement as much as possible of the features desired by the actively engaged researcher - which is to improve the interface for saving and loading workspaces.  Other than that, I need to continue the steps taken to promote sustainability of the outputs, including creation of a more approachable demonstration prototype. These two strands of effort would ideally come together in a back-end storage plugin that works with the Google Data API - if the opportunity presents, I'd rather like to do a mini-hackathon with someone who is familiar with the details of the Google Data API.

## Velocity ##

Tasks completed/effort spent: 3.75/7.9 = 0.51

(Completed work excludes task 1.4, which is "non-productive" overhead)

The lower-than-usual velocity this sprint reflects a high load of misc admin activity, and effort spent productively on  task 3.4 has not yet resulted in completion of any identified goal.)

# Activity summary #

Date:	 Monday, 2 November, 2009
> Shuffl:
  * (0.1) Test graph display with CH data (had to hack code for now until column selection is implemented) (task 3.2)
  * (0.2) Exploratory work on column selection (task 3.2)
> Claros:
  * (0.3) MILARQ proposal review, outline plan review, wrestling with Word.
  * (0.1) Pygmalion words for proposal
  * (0.3) MILARQ proposal finalizing details.

Date:	 Tuesday, 3 November, 2009
> Shuffl:
  * (0.2) Sprint plan (task 1.1, done)
  * (0.3) Refactored and tested initial column selection code (UI for selection still to do) (task 3.2)
  * (0.4) Save and restore linkage between graph card and source data card (task 3.2, subtask done)
  * (0.1) Code refactoring (task 3.1)

Date:	 Wednesday, 4 November, 2009
> Shuffl:
  * (0.2) Fix fallout from a rare system crash, including a problem with the eXist database; couldn't see how to re-initialize, so I completely reinstalled the latest version of eXist (1.4rc). Tests all pass. I wonder if atompub service documents work any better now. (task 1.4)
  * (0.4) continued refactoring of card initialization/serialization code. (task 3.1)
  * (0.2) started to work on data transformation for log-scale graph displays (task 3.2)
> Misc:
  * (0.2) General discussion and catch-up (task 1.4)

Date:	 Thursday, 5 November, 2009
> Shuffl:
  * (0.1) flot investigations for log axis labelling (task 3.2)
  * (0.3) UI for selecting display transformations (task 3.2)
  * (0.5) UI for selecting columns/axes for display (task 3.2)
> Misc:
  * (0.1) Schema hunting, books, etc. (task 1.4)

Date:	 Friday, 6 November, 2009
> Shuffl:
  * (0.2) Connect plot axis selection to context menu UI (task 3.2)
  * (0.1) Update flot to version 0.6, and test (task 3.2)
  * (0.1) Worksheet headings greyed for no-data columns (task 3.2)
  * (0.2) Log-scale graph axis displays (task 3.2)
  * (0.2) Adding axis-selection logic to graph card (task 3.2)
> Misc:
  * (0.2) Problems with Ubuntu system upgrade (task 1.4)

Date:	 Monday, 9 November, 2009
> Claros:
  * (0.7) Work on presentation for Berlin - about half done
> Misc:
  * (0.3) Email catch-up (task 1.4)

Date:	 Tuesday, 10 November, 2009
> Claros:
  * (0.8) Work on presentation for Berlin - first draft done
  * (0.2) Respond to email from Martin Doerr about Time-Span, performance and words about CLAROS for the CRM web site

Date:	 Wednesday, 11 November, 2009
> Shuffl:
  * (0.2) Demo to Chris Holland and write up conclusions (task 2.2)
  * (0.1) Internal research group demo and discussion (task 2.2)
  * (0.4) Working on I/O error handling (task 3.3)
> Claros:
  * (0.1) Ongoing email discussion about CRM usage with Martin Doerr
  * (0.1) Final review of MILARQ submission; review David's Semuse slides
> Misc:
  * (0.1) Various admin (task 1.4)

Date:	 Thursday, 12 November, 2009
> Shuffl:
  * (0.6) completed improvements in I/O error handling (task 3.3)
  * (0.3) general code and user interaction improvements (task 3.1)
  * (0.1) started work on new storage framework (task 3.4)

Date:	 Friday, 13 November, 2009
> Shuffl:
  * (0.4) Pluggable storage framework - common storage module coded and tested (task 3.4)
  * (0.4) Pluggable storage framework - local file test cases and module skeleton (task 3.4)
> Misc:
  * (0.2) meeting with Paul Taylor (Melbourne) about data policies, etc. (task 1.4)