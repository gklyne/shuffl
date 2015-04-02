

# Introduction #

Responding to expressed user desiderata, project activities are now diverging quite significantly from the original outline plan (other than user engagement still being a key activity at this stage).  The original milestone is included below for reference and interest.

The primary focus for this sprint will be (a) to complete the initial data graphing display for the visualization use case, to demonstrate this to Chris Holland, and use that session to gather more detailed requirements for this aspect of Shuffl.  Secondary foci will be: improving aspects of the user interface, especially for workspace loading/saving, and creating some user documentation.

I also have an ongoing discussion with Ross Gardler about long-term sustainability and CLAs (contributor licence agreements) - see the issue list for details.

## Current milestone ##

| Month | Activity | Deliverables |
|:------|:---------|:-------------|
| 4: 30Oct 16days | Further enhancements. External linking and data integration. Continued user engagement. | Updated system, more examples of system in use. Updated feature list. Initial community web page describing the system and applications. |

## Current sprint ##

| Sprint 5 | 5 Oct - 16 Oct  | 8 days |
|:---------|:----------------|:-------|

Previous sprint plan: [SprintPlan\_4](SprintPlan_4.md).

Project outline plan: [ProjectPlanOutline\_200906\_200911](ProjectPlanOutline_200906_200911.md).

# User stories and activities #

| **Activity number** | **Description** | **Effort est** | **Effort actual** | **Target date** | **Completion date** |
|:--------------------|:----------------|:---------------|:------------------|:----------------|:--------------------|
| 1.   | **Project administration**             | **2.5** | **2.5** |
| 1.1. | Sprint 5 plan                    | 0.25 | 0.2 | 05-Oct-2009 | 05-Oct-2009 |
| 1.2. | Sprint 5 review (retrospective)  | 0.25 | 0.3 | 16-Oct-2009 | 18-Oct-2009 |
| 1.3. | Sustainability plan              | 0.25 | -- | (ongoing)   | -- |
| 1.4. | Miscellaneous admin, email, etc  | 1.75 | 1.2 | --          | -- |
| 1.5. | Admiral project preparation/meetings  | 0.5 | 0.8 | 14-Oct-2009 | 14-Oct-2009 |
| 2.   | **Community engagement and dissemination** | **2.0** | **0.4** |
| 2.1  | Other use cases                          | 0.5 | -- | (ongoing) | -- |
| 2.2  | Demo initial graphing to Chris Holland   | 0.5 | -- | (sprint)  | -- |
| 2.3  | Introductory user documentation          | 0.5 | -- | (sprint)  | -- |
| 2.4  | Data curation workshop               | 0.5 | 0.4 | 14-Oct-2009 | 14-Oct-2009 |
| 3.   | **Technical development**              | **3.0** | **4.5** |
| 3.1  | Code maintenance / bug fixes      | --   | 0.6 | (ongoing) | -- |
| 3.2  | Basic graphing of data collections   | 3.0  | 2.7 | (sprint)  | 09-Oct-2009 |
| _3.3_ | _Load/Save user interface improvement_ | _6.0_  | 0.5 | _(out of scope)_ | -- |
| 3.4  | FlyUI cards (unplanned) | --  | 0.7 | --  | 16-Oct-2009 |


# Task breakdowns #

(effort estimates in days to nearest 0.25)

## 3.2: Basic graphing of data collections ##

Estimated effort: 3.0 days

  * (0.5) Investigate card-to-card drag-and-drop (**Done**)
  * (0.5) Finalize design of graphing card interface (**Done**)
  * (1.0) Write test suite for graphing card (**Done**)
  * (1.0) Implement graphing card (**Done**)

Actual effort: 2.7 days (for 3.0 planned activity)

## 3.3: User interface for load/save workspace ##

This task is bartered out of scope for this sprint, but may be started if time permits.
It may be reviewed in light of the planned meeting with Chris Holland.

Estimated effort: 6.0 days

  * (0.5) review requirements for generic back-end interface
  * (0.5) design generic back-end and plugin interface
  * (1.0) implement generic interface plugin for AtomPub
  * (0.5) implement generic read-only interface plugin for local files
  * (1.0) implemented simplified load/save user interface using back-end plugin features
  * (0.5) investigate Google data interface
  * (2.0) implement generic interface plugin for Google Data

Actual effort: 0.5 days (for 0.0 planned activity)

# Sprint review notes #

## End-of-sprint review ##

This was a sprint of highs and lows.  Other project activities and some personal matters eat into the available time, and the direction of progress seems to be diverging more from the original plan.  I have also spent a fair amount of time cleaning up existing code in various ways.

On the positive side, a demonstrable drag-and-drop data graphing interface has been completed (as planned), and I worked with Jun Zhao to successfully implement a card containing a FlyUI gene finder widget (not planned).  This last success is an important confidence builder, as it further demonstrates the power and flexibility of the Shuffl card plugin model: we were able to embed quite complex FlyUI widget logic unmodified into a Shuffl card.

One of the harder problems seems to be creating a flexible browser-based data fusion and annotation application without specialized server-side support;  this is a known area of difficulty, caused by browsers' "same origin" security restrictions on Ajax calls. The FlyUI widget required the Shuffl program to be served from an Apache server specifically configured to redirect and proxy requests to the services used, which falls a little short of the desired goal of having an application that "just works".

A session to demonstrate the nascent data graphing capability to Chris Holland was scheduled, but had to be postponed at the last minute because of external factors.  This is now rescheduled to take place early in the next sprint.

I have started to look at making the data access modules more robust - currently, an I/O error (such as accessing a non-existent web resource) can leave the application broken.

Funding for the ADMIRAL project has been announced, which is good for Shuffl as parts of ADMIRAL will be based on Shuffl, and this means that there will be continuing development of Shuffl over the coming year.  I am also discussing with colleagues the possibility of a proposal that may also use Shuffl to provide some user interface elements over a classical arts data web.  Both of these projects will require other developers to become involved in creating Shuffl plug-in card components, and hopefully to help in maintaining the core framework.

Although it doesn't appear explicitly in the sprint plan, I have updated the project home page to show a screenshot and also link to a page that describes how to play with the Shuffl data graphing (which goes some way to one of the milestone objectives for this month).

## Velocity ##

Tasks completed/effort spent: 4.5/7.4 = 0.61

This lower velocity compared with the last sprint reflects the various distractions from the intended development plan.

# Activity summary #

(I'm starting to include notes of activities related to other projects that are intended to build upon Shuffl.)

Date:	 Monday, 5 October, 2009
> Shuffl:
  * (0.2) Sprint plan
  * (0.1) Investigate drag-and-drop for card-to-card drop
  * (0.1) Update test cases for datagraph card
> Other:
  * (0.6)

Date:	 Tuesday, 6 October, 2009
> Shuffl:
  * (0.2) New test cases for card-datagraph
  * (0.1) Debug jQuery.readcsv
  * (0.1) Plan out datagraph card interface
  * (0.1) Rework datagraph card redraw logic to ease resizing (NOTE: flot has API for this too)
  * (0.4) test cases for revised data graphing card interface
> Misc:
  * (0.1) Check Rodos disk usage and performance (Postgtres databases and Virtuoso)

Date:	 Wednesday, 7 October, 2009
> Shuffl:
  * (0.2) Rethinking graphing card structure. Yesterday's test cases put too much complexity in the card. Separate the data selection from the graphing, simplifiying the graph card. Eventually, the external interface will specify labels and series only (no table or URI value).
  * (0.2) Implemented display range scanning and setting for data graphing cards.
  * (0.2) Refactored card implementations to use some generic setup helper functions.
> Misc:
  * (0.2) sys admin - Telendos SSL certificate renewal
> Other:
  * (0.2)

Date:	 Thursday, 8 October, 2009
> Shuffl:
  * (0.2) Added copyright notices to Shuffl source code
  * (0.2) Reworked some test cases to make them less brittle
  * (0.3) Work on drag-and-drop logic for data visualization
> Misc:
  * (0.3) IEG seminar

Date:	 Friday, 9 October, 2009
> Shuffl:
  * (0.5) Test cases for drag-and-drop interface for graphing (new module), and implement drag-and-drop interface for graphing
  * (0.2) Reorganize code, fix test cases
  * (0.3) Attended part of OSS-Watch day on open source engagement

Date:	 Tuesday, 13 October, 2009
> Admiral:
  * (0.5) Map out Admiral workplan schedule
> Sick:
  * (0.5)

Date:	 Wednesday, 14 October, 2009
> Admiral:
  * (0.3) Meeting with Simon Hodson
> Misc:
  * (0.4) Data curation workshop
> Other:
  * (0.3)

Date:	 Thursday, 15 October, 2009
> Shuffl:
  * (0.2) code cleanup
  * (0.5) Reviewing error handling. Reworking Atompub module to better handle media resources and treat all feeds as directories.
> Misc:
  * (0.1) Email
  * (0.1) Activity review and planning with David, and follow-up
> Other:
  * (0.1)

Date:	 Friday, 16 October, 2009
> Shuffl:
  * (0.7) Working with Jun to embed a FlyUI widget in a Shuffl card. The work went well, with good test cases constructed as we went along. (At the end of the day, Jun had a copy of the Genefinder widget running in a Shuffl card.)
Admiral:
  * (0.1) Review job ad with David
Other:
  * (0.2) Meet with Sebastian about AHRC proposal - Shuffl could play a useful role

Date:	 Sunday, 18 October, 2009
> Shuffl:
  * (0.3) Sprint review/retrospective