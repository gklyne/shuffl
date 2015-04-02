

# Introduction #

This sprint should mark an acceleration of Shuffl development, with an increase to 80% developer effort allocated to the project.

Due to getting bogged down with AtomPub and data persistence in the [previous sprint](SprintPlan_2.md), the project is running behind schedule (1-2 weeks, allowing for meetings this sprint).

## Current milestone ##

| Month | Activity | Deliverables |
|:------|:---------|:-------------|
| 3: 2Oct 18days | Enhancements to system; capturing structure in data; basic user authentication and access control. Use of system for project tasks. Seminar/demonstrations to solicit users and feedback. | Updated system. Examples of system in use. Updated feature list. |

## Current sprint ##

| Sprint 3 | 31 Aug - 11 Sep | 8 working days |
|:---------|:----------------|:---------------|

(Probably 2 more days effort in practice, from odd weekends, working during travel to meetings, etc. )

# User stories and activities #

| **Activity number** | **Description** | **Effort est** | **Effort actual** | **Target date** | **Completion date** |
|:--------------------|:----------------|:---------------|:------------------|:----------------|:--------------------|
| 1.   | **Project mananement** | **1.5** | **1.2** |
| 1.1. | Sprint 3 plan             | 0.25 | 0.2 | 31-Aug-2009 | 05-Sep-2009 |
| 1.2. | Sprint 3 review (retrospective)  | 0.25 | -- | 17-Sep-2009 | -- |
| 1.3. | Sustainability plan   | 0.25   | -- |  ?? | (ongoing) |
| 1.4. | Miscellaneous admin, etc  | 0.75 | 1.0 | -- | -- |
| 2.   | **Community engagement and dissemination** | **5.0** | **4.7** |
| 2.1  | Meeting with CH (Zoology silk group)  | 0.5 | 0.3 | (sprint) | 05-Sep-2009 |
| 2.2  | Other use cases  | -- | 0.4 | -- | -- |
| 2.3  | Introductory user documentation | 0.5 | -- | 28-Aug-2009 | (incomplete) |
| 2.4  | JISCRI meeting | 2.0 | 1.6 | 04-Sep-2009 | 04-Sep-2009 |
| 2.5  | Linked data meeting | -- | 0.8 | -- | 09-Sep-2009 |
| 2.6  | VoCamp Bristol | 2.0 | 1.6  | 11-Sep-2009 | 11-Sep-2009 |
| 3.   | **Technical development** | **6.0** | **4.1** |
| 3.1  | Refactoring and test cases; esp. to support persistence  | 3.0 | 4.1 | 09-Sep-2009 | -- |
| 3.2  | Initial content persistence  | 3.0 | -- | 11-Sep-2009 | (incomplete) |

# Task breakdowns #

(effort estimates in days to nearest 0.25)

## 3.1: Refactoring and test cases ##

3.0 days:

  * (0.5) identify functional areas
  * (1.5)  Create test cases for key methods in main functional areas
  * (1.0)  Refactor code and ensure all test cases pass

## 3.2: Initial content persistence ##

3.0 days:

  * (1.0) complete static save of new workspace (**Save as...**)
  * (0.5) implement resave of workspace (**Save**)
  * (1.0) implement on-the-fly saving of changes to card content, layout, etc
  * (0.5) save card size as well as position

# Sprint review notes #

Having thought I had all functionality tested, adding some additional test cases uncovered a problem with file location handling whose resolution has broken some earlier test cases.

## End-of-sprint review ##

Early in this sprint, I decided to re-evaluate how I was proceeding.  See http://shuffl-announce.blogspot.com/2009/09/relearning-agile-lessons.html.  I've backed off trying to complete the workspace persistence immediately and decided to build an extra layer of test cases (something I should have done all along).  I've made steady progress on these, but the immediate effect has been to crystalize an overrun on the worksopace persistence, which is still not yet complete.

Also, 5 days of meetings weren't anticipated in the original plan.  Coupled with the overrun on card persistence, progress this sprint looks pretty slow.  I still feel this is a failure of estimation rather than fundamental problems, but there is the ongoing issue that the complexities of using AtomPub to save cards haven't really been recognized ahead of actually doing it.  I'm wondering if WebDAV would not have been a better choice (e.g. see http://shuffl-announce.blogspot.com/2009/09/delete-on-atompub-media-resource.html), but I feel it's inappropriate to change at this time.  This all underscores the desire for a plug-in approach to back-end access.

I have spent some time discussing use-cases, in some cases with potential users, including some who were not in the original plan.  It looks as if the best approach to getting users for shuffl will be to focus on tooling to help visualization, and use that as a beach-head for introducing data management capabilities.

# Activity summary #

01-Sep-2009:
  * (0.2) Save/display workspace location when loading
  * (0.8) Continue work on saving workspace to AtomPub server. Ran into some problems of AtomPub naming, edit URIs and duplicate naming. Resolution adopted and work continues.

02-Sep-2009:
  * (0.5) email catch-up
  * (0.2) meeting with Chris Holland
  * (0.3) restructuring code and creating test cases for card handling

03-Sep-2009:
  * (0.2) continue work on card handling test cases
  * (0.8) JISCRI meeting

04-Sep-2009:
  * (0.8) JISCRI meeting
  * (0.2) discuss new use-case with Ross Gardler

05-Sep-2009 (unscheduled):
  * (0.1) revise pitch from JISCRI and publish on project home page.  Also add link to runnable demo in SVN.
  * (0.2) write up notes of Ross Gardler's use-case
  * (0.2) prepare sprint 3 plan
  * (0.1) Post use-case for data visualization to wiki

Monday, 7 September, 2009:
  * (1.0) Continue working on test cases and code reorganization. Card services test cases all OK. Working on loadworkspace test cases.

Tuesday, 8 September, 2009:
  * (0.3) email catch-up
  * (0.1) notes for shuffl lightning talk
  * (0.6) continue shuffl test cases and debugging. Some problems with the workspace save logic have been overcome in the unit tests.

Wednesday, 9 September, 2009:
  * (0.2) Working through persistence test cases
  * (0.8) Linked data meeting in London.  Lightning talk planned but not given due to schedule overrun.

Thursday, 10 September, 2009:
  * (0.2) AtomPub persistence test cases
  * (0.8) VoCamp meeting; among other things, sketched vocab for time-series data

Friday, 11 September, 2009:
  * (0.8) VoCamp meeting; Shuffl lightning talk introducing use of JSON intended to be RDF; discussed ontologies and data validation; worked with Davide Eynard on Shuffl use-case for data visualization of data scraped from web sites
  * (0.2) AtomPub persistence test cases