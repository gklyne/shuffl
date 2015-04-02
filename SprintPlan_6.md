

# Introduction #

The main targets for this sprint will be to work towards improved usability in two areas:
  * Visualization of data: after demonstrating the data graphing interface to Chris Holland, I hope to find out what he _really_ wants, and to get some representative sample data from him.
  * Improve usability of the interface for importing data and loading/saving workspaces.
  * Improve reliability around load/save workspaces

## Current milestone ##

| Month | Activity | Deliverables |
|:------|:---------|:-------------|
| 4: 30Oct 16days | Further enhancements. External linking and data integration. Continued user engagement. | Updated system, more examples of system in use. Updated feature list. Initial community web page describing the system and applications. |

## Current sprint ##

| Sprint 6 | 19 Oct - 30 Oct | 8 days |
|:---------|:----------------|:-------|

Previous sprint plan: [SprintPlan\_5](SprintPlan_5.md).

Project outline plan: [ProjectPlanOutline\_200906\_200911](ProjectPlanOutline_200906_200911.md).

# User stories and activities #

| **Activity number** | **Description** | **Effort est** | **Effort actual** | **Target date** | **Completion date** |
|:--------------------|:----------------|:---------------|:------------------|:----------------|:--------------------|
| 1.   | **Project administration**                 | **2.0** | **0.5** |
| 1.1. | Sprint 5 plan                            | 0.25  | 0.2 | 19-Oct-2009 | 19-Oct-2009 |
| 1.2. | Sprint 5 review (retrospective)          | 0.25  | 0.2 | 30-Oct-2009 | 01-Nov-2009 |
| 1.3. | Sustainability plan                      | 0.25  | -- | (ongoing)   | -- |
| 1.4. | Admiral project preparation/meetings     | 0.25  | -- | -- | -- |
| 1.5. | Miscellaneous admin, email, etc          | 1.0   | 0.1 | -- | -- |
| 2.   | **Community engagement and dissemination** | **1.0** | **0.3** |
| 2.1  | Other use cases                          | 0.5   | -- | (ongoing) | -- |
| 2.2  | Demo initial graphing to Chris Holland   | 0.5   | 0.3 | (sprint)  | 20-Oct-2009 |
| 2.3  | Introductory user documentation          | --    | -- | (sprint)  | -- |
| 3.   | **Technical development**                  | **5.0** | **2.9** |
| 3.1  | Code maintenance / bug fixes             | --    | 0.2 | (ongoing) | -- |
| 3.2  | Revised data import/visualization        | 4.0    | 2.2 | -- | -- |
| 3.3  | _Load/Save user interface improvement_   | _6.0_ | 0.5 | _(deferred)_ | -- |
| 3.4  | Improve I/O error handling     | 1.0   | -- | -- | -- |

# Task breakdowns #

(effort estimates in days to nearest 0.25)

## 3.2: Revised data import/visualization ##

Estimated effort: 4.0 days

  * Agree next-steps with Chris Holland (task 2.2) - focus on data selection from table cards
  * Finalize design of graphing card interface (**Done**)
  * (0.25) Remove filename/read option from graphing card (**Done** 26-Oct-2009/0.1)
  * (0.25) Subscribe graph card to changes in data table card (**Done** 26-Oct-2009/0.2)
  * (0.25) remove "read CSV" button from table card, re-read data whenever filename is changed, provide user feedback when data is updated. (**Done** 26-Oct-2009/0.2)
  * (0.5) implement label-row selection and link to output (**Done** 30-Oct-2009/1.3)
  * (0.5) implement data-rows selection and link to output (**Done** 30-Oct-2009/0.4)
  * (0.25) Implement user-editable labels and link to output
  * (1.0) add row of column status selectors (none, x1, x2, y1, y2) and link to output data
  * (1.0) add colour selection and link to output data

Actual effort: 2.2 days (for 1.75 planned activity)

## 3.3: User interface for load/save workspace ##

This task will be started but probably not completed within this sprint.
It may be reviewed in light of the planned meeting with Chris Holland.

Estimated effort: 6.0 days

  * (0.5) review requirements for generic back-end interface (**Done** 19-Oct-2009/...)
  * (0.5) design generic back-end and plugin interface (**Done** 19-Oct-2009/0.5)
  * (0.5) implement generic read-only interface plugin for local files
  * (1.0) implement generic interface plugin for AtomPub
  * (1.0) implemented simplified load/save user interface using back-end plugin features
  * (0.5) investigate Google data interface
  * (2.0) implement generic interface plugin for Google Data

Actual effort: 0.5 days (for 1.0 planned activity)

## 3.4: Improve I/O error handling ##

The main goal of this task is to prevent I/O errors on workspace load (e.g. non-existent files) from completely locking up further Shuffl I/O.

Estimated effort: 1.0 days

  * (0.25) complete new error reporting functions
  * (0.25) revise existing code to use new error reporting function
  * (0.5) review workspace load/save code to catch I/O errors, report them and take appropriate recovery steps

Actual effort: 0 days (for 0 planned activity)

# Sprint review notes #

Following the meeting with Chris Holland, the first user function to tackle next will be data selection from data table cards - see the [meeting notes](http://code.google.com/p/shuffl/wiki/20091020_Chris_Holland) for more details.

Task 3.2 remains a priority.  Usability and error handling issues also remain important to address.

The first week of this sprint has been largely wiped out by non-project activities.

## End-of-sprint review ##

Progress during this sprint has been fairly poor, largely due to distraction from both personal and non-project affairs.  The total amount of effort spent was 3.5 days against planned effort of 8 days. A further factor impacting progress was that reorganizing the code to enable label-row selection took somewhat longer than planned.

On the positive side, I did hold a second review meeting with Chris Holland, and the current development is being conducted very much in response to his feedback, to make the data graphing display more useful to him.

Also on the positive side, the mechanisms for linking data between cards seem to be working nicely (e.g. when I reload new data into a table card, or change the label row, an associated graph card updates immediately.  But I do need to capture this relationship when I save and restore a workspace.

Some thoughts about sprint planning: for a sprint with fewer than 4 days actual effort expended, the sprint planning process seems to lack sufficient data to be meaningful.  In setting sprint duration, it would seem reasonable to take account of the total amount of effort being applied rather than simply the number of elapsed days.  I don't plan to change the duration of the remaining two sprints for this project, but for future projects, planning sprints with fewer than 10-15 total days of effort may be something to avoid.

## Velocity ##

On a strict measure, velocity is zero as no tasks were fully completed in this sprint.  But taking account of partially completed tasks, I get:

Tasks completed/effort spent: 2.75/3.7 = 0.74.

# Activity summary #

Date:	 Monday, 19 October, 2009
> Shuffl:
  * (0.2) sprint plan (initial: review after meeting with Chris Holland) (task 1.1)
  * (0.5) draft API for generic storage interface (task 3.3)
> Claros:
  * (0.2) respond to AHRC proposal document
> Misc:
  * (0.1) Email

Date:	 Tuesday, 20 October, 2009
> Shuffl:
  * (0.3) Meeting with Chris Holland to discuss next steps, and write-up (task 2.2)
> Claros:
  * (0.5) Meetings for AHRC bid, drafting work on AHRC bid
> Misc:
  * (0.2) Meeting with Daviud Duce, Brian Mattews and "Oz" to discuss CIDOC CRM

Date:	 Wednesday, 21 October, 2009
> Claros:
  * (0.6) Meetings with Ian Horrocks and LASIMOS
> ADMIRAL:
  * (0.4) Work on project plan

Date:	 Thursday, 22 October, 2009
> ADMIRAL:
  * (0.8) Project plan, first draft done
> Misc:
  * (0.2) Discuss RDF data use with Birte from Ian Horrocks' group

Date:	 Monday, 26 October, 2009
> Shuffl:
  * (0.1) clean up some test cases (task 3.1)
  * (0.1) remove URI field from graph card (task 3.2)
  * (0.2) remove read CSV button from data table card (task 3.2)
  * (0.2) graph card subscribed to changes in data source (task 3.2)
> Claros:
  * (0.2) Summary of ongoing work and proposals for partners
> Misc:
  * (0.2) URI registration (oid:) review

Date:	 Tuesday, 27 October, 2009
> Shuffl:
  * (0.9) working on revised data table to allow label row selection (task 3.2)
> Claros:
  * (0.1) Sort out screencast for Reinhard

Date:	 Wednesday, 28 October, 2009
> Claros:
  * (1.0) CLAROS meetings and presentation

Date:	 Thursday, 29 October, 2009
> Shuffl:
  * (0.1) email discussion about related work (task 1.5)
> Claros:
  * (0.1) Berlin
  * (0.1) AHRC bid discussion
  * (0.1) plans for Berlin
  * (0.1) MILARQ bid discussion
> ADMIRAL:
  * (0.1) Project plan revised, send to Simon Hodson
  * (0.4) Meeting with Paul Jeffreys, John Milner, at al

Date:	 Friday, 30 October, 2009
> Shuffl:
  * (0.4) table label-row selection (task 3.2)
  * (0.4) table data range selection (task 3.2)
  * (0.1) code improvement and bug fixes (task 3.1)
> Claros:
  * (0.1) MILARQ bid discussion and revision

Date:	 Sunday, 1 November, 2009
> Shuffl:
  * (0.2) Sprint review