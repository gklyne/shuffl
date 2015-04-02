

# Introduction #

The problems with AtomPub and data persistence rumble on (see [previous sprint](SprintPlan_3.md)), but I think they are nearly resolved.  As I write this, a day into the sprint a full set of test cases covering "Save as.." functionality via AtomPub are all working, and the main outstanding item is to save an updated workspace, and implement the logic in the running Shuffl application.

I place the project as running about 2 weeks behind plan.

Focus for this sprint will be (a) to complete the workspace persistence via AtomPub, and tostart looking at card collections and structures to support the visualization use case raised in discussion with Chris Holland.  I'll probably focus on that to the exclusion of planned basic user authentication during this sprint, since the user emphasis here is on visualization rather than sharing/publication.

## Current milestone ##

| Month | Activity | Deliverables |
|:------|:---------|:-------------|
| 3: 2Oct 18days | Enhancements to system; capturing structure in data; basic user authentication and access control. Use of system for project tasks. Seminar/demonstrations to solicit users and feedback. | Updated system. Examples of system in use. Updated feature list. |

## Current sprint ##

| Sprint 4 | 14-Sep - 2 Oct | 12 working days |
|:---------|:---------------|:----------------|

In preparing this plan, I found that I'd "lost" a few days in the original sprint schedule, so this is a 3-week sprint to bring things back into line with the master plan.

# User stories and activities #

| **Activity number** | **Description** | **Effort est** | **Effort actual** | **Target date** | **Completion date** |
|:--------------------|:----------------|:---------------|:------------------|:----------------|:--------------------|
| 1.   | **Project mananement** | **2.0** | **3.6** |
| 1.1. | Sprint 3 review (retrospective)  | 0.25 | 0.2 | 11-Sep-2009 | 15-Sep-2009 |
| 1.2. | Sprint 4 plan             | 0.25 | 0.2 | 14-Sep-2009 | 16-Sep-2009 |
| 1.3. | Sprint 4 review (retrospective)  | 0.25 | 0.3 | 02-Oct-2009 | 04-Oct-2009 |
| 1.4. | Sustainability plan   | 0.25   | 0.1 |  -- | (ongoing) |
| 1.5. | Miscellaneous admin, etc  | 1.0 | 2.8 | -- | -- |
| 2.   | **Community engagement and dissemination** | **1.5** | **0.2** |
| 2.1  | Meeting with CH (Zoology silk group)  | 0.5 | -- | (sprint) | (not done) |
| 2.2  | Other use cases  | 0.5 | 0.2 | -- | -- |
| 2.3  | Introductory user documentation | 0.5 | -- | (sprint) | (incomplete) |
| 3.   | **Technical development** | **14.5** | **7.6** |
| 3.1  | Refactoring and test cases; esp. to support persistence  | 2.0 | 0.8 | 16-Sep-2009 | 16-Sep-2009 |
| 3.2  | Initial content persistence  | 2.0 | 1.7 | (sprint) | 21-Sep-2009 |
| 3.3  | Import CSV data as card collection  | 6.0 | 4.7 | (sprint) | 01-Oct-2009 |
| 3.4  | Basic graphing of data collections  | 3.5 | 0.3 | (sprint) | (incomplete) |
| 3.4  | Bug fixes  | -- | 0.1 | -- | -- |

# Task breakdowns #

(effort estimates in days to nearest 0.25)

## 3.1: Refactoring and test cases ##

2.0 days:

  * (1.0) Test case for saving new workspace - to complete (**Done** 16-Sep-2009)
  * (1.0) Test case for workspace update (**Done** 16-Sep-2009)

Actual effort: 0.8 days

## 3.2: Initial content persistence ##

3.0 days:

  * (1.0) complete static save of new workspace (**Save as...**), and implement load (**Open...**) to test this. (**Done**: 17-Sep-2009)
  * (0.5) implement resave of workspace (**Save**) (**Done** 18-Sep-2009)
  * (1.0) implement on-the-fly saving of changes to card content, layout, etc.  (**Defered** - need to also think about handling of read-only workspaces, etc.)
  * (0.5) save card size as well as position (**Done** 21-Sep-2009)

Actual effort: 1.7 days (for 2.0 planned activity)

## 3.3: Import CSV data as card collection ##

6.0 days:

  * (0.5) UI to locate CSV data in file system (**Done** 22-Sep-2009, actual 0.6, needs revisiting)
  * (1.0) Read and parse CSV data, with test cases (**Done** 29-Sep-2009, actual 0.4)
  * (0.5) Create plan for testing card plug-ins (**Done** 28-Sep-2009, actual 1.9, including refactoring)
  * (1.0) Design, implement, test card plug-in for a row of values (**and...**)
  * (1.0) Design, implement, test card plug-in for a collection of rows (**Done** 1-Oct-2009, actual 1.8, implemented as single table-data card)
  * (2.0) Design, implement, test alternative (e.g. collapsed) card views for collections and alternative workspace views (e.g. one-line display, small "icon" or "flag" display, etc.).  These will need to be implemented for all existing cards. (**Deferred**)

Actual effort: 4.7 days (for 4.0 planned activity)

## 3.4: Basic graphing of data collections ##

3.5 days:

  * (0.5) Survey jQuery plug-ins for data display and graphing (**Done** 2-Oct-2009, actual 0.3, focused on 'flot' as it seems to do all that is required)
  * (1.0) Design, implement, test card plug-in for tabular display of a data collection (this being easier to unit-test than a graphical display)
  * (2.0) Design, implement, test card plug-in for graphical display of a data collection - final testing may need to depend on user interaction, but as much as possible of the underlying logic should be automated.

Actual effort: 0.3 days (for 0.5 planned activity)


# Sprint review notes #

There has been a fair distraction by non-project and admin activities.  Despite this, the workspace persistence and data visualization work has proceeded reasonably well to plan, albeit with a number of technical compromises to get something demonstrable as soon as possible.

In activity 3.2 (initial persistence), I have decided to defer implementation of on-the-fly saving of changes to card content, layout, etc., as I also need to think about handling of read-only workspaces, etc.).  The user interface for accessing stored card/layout data is still very primitive.

In activity 3.3 (CSV data import), I changed the technical design to use a single card to hold the entire table, rather than creating a collection with one card for each row.  Implementing card-per-row threatened to introduce complications I didn't want to think about, so table-per-card seemed the expedient approach for getting a demo working.

In view of the compromises incurred, I've started a new wiki page for [Technical debt](TechnicalDebt.md).




## End-of-sprint review ##

Outline of activity:
  * week 1: complete workspace persistence (initial cut)
  * week 2: UI for data access; expand testing framework; card refactoring to MVC pattern
  * week 3: tabular data loading and display; started on data graphing

There has been less community engagement than planned, though some new use-cases have been noted (FlyKit, e-learning).

Admin and misc email: allow 1 day/week?

About half a day more than planned was lost to CLAROS.

Velocity (tasks completed/effort spent): 10.75/11.4 = 0.94

  * This velocity figure is a surprise to me: I was expecting it to be lower on account of the unplanned time spent on admin, etc.  Prediction of progress remains challenging with so many competing demands on limited time.

# Activity summary #

Monday, 14 September, 2009
  * (0.1) admin: expenses
  * (0.2) Sprint 3 review

Tuesday, 15 September, 2009
  * (0.4) continue work on AtomPub and workspace persistence. Chased down several bugs exposed by a new test case. AtomPub continues to be fragile for this application.

Wednesday, 16 September, 2009
  * (0.2) sprint 4 plan
  * (0.1) miscellaneous admin, reporting, etc.
  * (0.4) unit tests for workspace persistence all pass; some code refactoring

Thursday, 17 September, 2009
  * (0.2) Email
  * (0.6) Initial load/save of workspace to AtomPub is now working

Friday, 18 September, 2009
  * (0.2) Admin
  * (0.5) Refactoring and **Save**: basic load/save/save new logic is working.

Monday, 21 September, 2009
  * (0.2) Misc internal
  * (0.6) Workspace save card sizes and z-index values

Tuesday, 22 September, 2009
  * (0.4) Misc emails
  * (0.6) Exploring options for UI to upload data (e.g. CSV). Have a fairly primitive option working, but will want to find a way to make it more user friendly; browser restrictions are making this tough.

Wednesday, 23 September, 2009
  * (0.2) Email & admin, look at Wookie card from Scott
  * (0.2) Group meeting
  * (0.4) Outline plan for card plugin refactoring, move existing plugins to new namespace, create test cases for select file plugin.

Thursday, 24 September, 2009
  * (0.5) Card refactoring to MVC pattern - model plugin created and tested; default card done.

Friday, 25 September, 2009
  * (0.1) Misc admin
  * (0.2) Meeting David Flanders

Monday, 28 September, 2009
  * (1.0) Completed Shuffl card plugin refactoring to us an MVC-based pattern.

Tuesday, 29 September, 2009
  * (0.2) admin (prepare toner order), email, etc.
  * (0.2) BL meeting
  * (0.4) CSV import - support code implemented and tested

Wednesday, 30 September, 2009
  * (1.0) progress on card for CSV data handling. I've backed off the original plan to use a collection of cards for this tabular data. I have created basic card to hold tabular data, and jQuery plugin for mapping data between array-of-arrays and HTML table. Next step is to hook it up to the file selection card and CSV reader software.

Thursday, 1 October, 2009
  * (0.2) email and admin stuff
  * (0.3) experimenting with jQuery and svg plugin to create animated/rubberband lines for connectors. Can't update SVG attributes directly, but can remove and reinsert line elements in response to mouse events. Will come back to this later.
  * (0.5) have data table card working, though not linked to external file selector. Next step is to look at visualization options.

Friday, 2 October, 2009
  * (0.2) Help Jun with Fly-Ted HTTPD problem
  * (0.1) Other admin - emails
  * (0.1) Fixed scrollbar dragging problem
  * (0.1) Review and comment on CLA for Shuffl (from Ross)
  * (0.2) meeting with Joanne Skerry (Agilisys); discussed use of SemWeb in e-learning, and possible use-case for Shuffl.
  * (0.3) investigate jQuery graphing plug-ins, selected flot (without looking at much else), and started work on graph-display card to use 'flot'.  Got initial graph display working.

Sunday, 4 October, 2009
  * (0.3) Sprint review