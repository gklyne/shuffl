

# Introduction #

The main goals for this sprint are:
  * to complete the back-end storage interface work started in the previous sprint
  * to improve the online prototype demonstrator for project evaluation (mainly, create a new Shuffl workspace with instructions displayed for doing the various things that Shuffl can do.)  Also, notes for installing eXist and Shuffl on a new system
  * If possible, install a copy of Shuffl and eXist on a machine in CH's workgroup
  * final reporting and project wrap-up


## Current milestone ##

| Month | Activity | Deliverables |
|:------|:---------|:-------------|
| 5: 27Nov 16days | Create promotional materials (webcast, dissemination, demonstrations, etc.). Establish a long-term home for the demo service. Ensure that users with whom we have engaged are comfortable with what is available as this project winds down. | Public repository contains fully tested software, documentation, promotional materials, deployment instructions, examples, etc., in a state suitable to support ongoing open community development. |


## Current sprint ##

| Sprint 8 | 16 Nov - 27 Nov | 8 days | [sprint 8 plan](SprintPlan_8.md) |
|:---------|:----------------|:-------|:---------------------------------|

Previous sprint plan: [SprintPlan\_7](SprintPlan_7.md).

Project outline plan: [ProjectPlanOutline\_200906\_200911](ProjectPlanOutline_200906_200911.md).


# User stories and activities #

| **Activity number** | **Description** | **Effort est** | **Effort actual** | **Target date** | **Completion date** |
|:--------------------|:----------------|:---------------|:------------------|:----------------|:--------------------|
| 1.   | **Project administration**                 | **1.7** | **1.7** |
| 1.1. | Sprint 8 plan                            | 0.2  | 0.2 | 16-Nov-2009 | 16-Nov-2009 |
| 1.2. | Sprint 8 review (retrospective) and final project report notes | 0.3  | 0.2 | 27-Nov-2009 | 30-Nov-2009 |
| 1.3. | Sustainability plan review/stabilize     | 0.25 | 0.2 | 27-Nov-2009 | 18-Nov-2009 |
| 1.4. | Miscellaneous admin, email, etc          | 0.75 | 0.9 | -- | -- |
| 1.5. | Sprint 7 review (retrospective)          | 0.2  | 0.2 | 13-Nov-2009 | 16-Nov-2009 |
| 2.   | **Community engagement and dissemination** | **0.5** | **1.4** |
| 2.1  | Other use cases                          | --   | -.- | (ongoing)   | -- |
| 2.2  | Install/demo system for Chris Holland    | 0.5  | -.- | 27-Nov-2009 | -- |
| 2.3  | Demonstrator documentation               | 0.5  | 0.2 | 27-Nov-2009 | -- |
| 2.4  | Other meetings and dissemination       | -.-  | 1.2 | -- | -- |
| 3.   | **Technical development**                  | **4.0** | **3.4** |
| 3.1  | Code maintenance / bug fixes             | 0.5  | 0.2 | (ongoing)   | -- |
| 3.2  | Pluggable back-end storage framework     | 2.5  | 2.2 | 27-Nov-2009 | 19-Nov-2009 |
| 3.3  | Load/Save user interface improvement     | 1.0  | 1.0 | 27-Nov-2009 | 20-Nov-2009 |
| 3.4  | Load/Save workspace browsing             | 3.0  | -.- | 27-Nov-2009 | -- |


# Task breakdowns #

(effort estimates in days to nearest 0.25)


## 3.2: Pluggable storage framework ##

Implementation to be sufficient to pass the current load/save test suite.

Estimated effort: 2.5 days

  * (0.5) implement generic read-only interface plugin for local files (**Done** 16-Nov-2009/0.5)
  * (1.0) implement generic interface plugin for eXist AtomPub (**Done** 17-Nov-2009/0.8)
  * (0.5) update load workspace module to use the revised framework (**Done** 19-Nov-2009/0.5)
  * (0.5) update save workspace module to use the revised framework (**Done** 19-Nov-2009/0.5)

Actual effort: 2.2 days (for 2.5 planned activity)

## 3.3: Load/save workspace user interface improvement ##

Estimated effort: 1.0 days

  * (0.5) Implement simplified load/save user interface with dialogs, using the pluggable storage interface and presenting a single workspace URI rather than 3 fields,
  * (0.5) Work through and replace all direct references to AtomPub module, except those in the eXist pluggable storage module.

Actual effort: 1.0 days (for 1.0 planned activity)

## 3.4: User interface for workspace browsing ##

Estimated effort: 3.0 days

  * (0.25) check service document handling in eXist 1.4
  * (0.25) investigate Google Data API for loading/saving workspaces
  * (0.5) plan strategy to implement collection/workspace browsing via eXist
  * (1.0) implement browsing capability in eXist storage plug-in module
  * (1.0) add browse facility to load/save dialogs

Actual effort: 0 days (for 0 planned activity)


# Sprint review notes #

Finished cleaning up the underlying storage framework, but the user interface still needs some work.

Otherwise, focused on wrapping up the JISCRI development phase - online demo, screencast, etc.

A fair amount of time was taken up by other projects, including travel to the CRM workshop in Berlin.


## End-of-sprint review ##

The demonstrator running from Google Code SVN has been enhanced to represent the current state of development, and the underlying framework has been significantly improved and stabilized.  While the delivered functionality is less than had been intended, the project is in fairly good shape for ongoing development as part of the Shuffl project, and the basic ideas have been somewhat vindicated.

I did not make time to install the system on one of Chris Holland's machines, but still hope to do this soon.

## Velocity ##

Tasks completed/effort spent: 4.3/6.5 = 0.66


# Activity summary #

Date:	 Monday, 16 November, 2009
> Shuffl:
  * (0.2) sprint 7 review
  * (0.2) sprint 8 plan
  * (0.5) local file storage module (task 3.2, subtask done)
> Misc:
  * (0.1) email catch-up

Date:	 Tuesday, 17 November, 2009
> Shuffl:
  * (0.2) code fixes and clean-up (task 3.1)
  * (0.8) eXist atompub storage module (task 3.2, subtask completed)

Date:	 Wednesday, 18 November, 2009
> Shuffl:
  * (0.2) Review and update sustainability plan; create and publish initial DOAP description file (task 1.3)
  * (0.2) Shuffl exit: start creating demonstration app (task 2.3)
  * (0.4) Shuffl loadworkspace using new storage framework (task 3.2, subtask done)
> Claros:
  * (0.2) CLAROS meeting with ISIS rep to discuss possible commercial opportunities

Date:	 Thursday, 19 November, 2009
> Shuffl:
  * (0.5) working on save workspace using new storage API
> Misc:
  * (0.5) A tidal wave of relevant emails

Date:	 Friday, 20 November, 2009
> Shuffl:
  * (1.0) Completed save workspace using new storage API

Date:	 Monday, 23 November, 2009
> CLAROS:
  * (1.0) CIDOC CRM meeting

Date:	 Tuesday, 24 November, 2009
> CLAROS:
  * (0.7) CIDOC CRM meeting
> Shuffl:
  * (0.3) Meet with Chris Bizer, discuss linked data etc.

Date:	 Wednesday, 25 November, 2009
> CLAROS:
  * (0.7) travel
> Misc:
  * (0.3) various catch-up

Date:	 Thursday, 26 November, 2009
> Shuffl:
  * (0.4) Screencast
> ADMIRAL:
  * (0.3) Meeting with Sally Rumsey / Ben O'Steen
  * (0.3) Travel to meeting

Date:	 Friday, 27 November, 2009
> ADMIRAL:
  * (1.0) JISC Programme meeting
> Shuffl:
  * (0.5) Complete Shuffl screencast

Notes for wrapping up Shuffl
  * Finalize screencast as QT and WMV
  * Publish screencast, demo app
  * Final progress report
  * Expenses - Berlin, screencast s/w, ...
  * Final retrospective
  * Final project budget to David F