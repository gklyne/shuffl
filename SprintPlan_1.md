


# Introduction #

## Current milestone ##

| Month | Activity | Deliverables |
|:------|:---------|:-------------|
| 1: 31-Jul, 13 days| Initial planning. Project Setup, and further discussion with JISC OSS-Watch about open source tooling, licensing and governance issues. Prototype user interface in Javascript. | Project plan. Publicly hosted source and project tracking facility. Interface prototype that can be shown to users to elicit feedback and further requirements. |

## Current sprint ##

| Sprint 1 | 15 Jun - 31 Jul | 13 days |
|:---------|:----------------|:--------|

# User stories and activities #

| **Activity number** | **Description** | **Effort est** | **Effort actual** | **Target date** | **Completion date** |
|:--------------------|:----------------|:---------------|:------------------|:----------------|:--------------------|
| 1.    | **Project mananement** | **3.5** | **2.45** |
| 1.1. | Sprint 1 plan             | 0.25 | 0.25 | 30-Jun-2009 | 3-Jul-2009 |
| 1.2. | Sprint 1 review (retrospective)  | 0.25 | 0.25 | 31-Jul-2009 | 02-Aug-2009 |
| 1.3. | Project infrastructure | 0.5 | 0.25 | 30-Jun-2009 | 15-Jun-2009 |
| 1.4. | Project plan outline | 0.5   | 0.25 | 30-Jun-2009 | 19-Jun-2009 |
| 1.5. | Sustainability plan   | 0.5   | 0.75 | 30-Jun-2009 | (ongoing) |
| 1.6. | Agile ecosystem notes | 0.25 | 0.1 | 30-Jun-2009 | 3-Jul-20090 |
| 1.7. | Initial reports to JISC  | 0.25 | 0.25 | 30-Jun-2009 | 3-Jul-2009 |
| 1.8. | Miscellaneous admin, etc  | 1 | 0.35 | 30-Jun-2009 | -- |
| 2.    | **Community engagement and dissemination** | **2.0** | **1.0** |
| 2.1 | Sustainable agile JISC workshop | 1.0 | 1.0 | (unplanned) | 25-Jun-2009 |
| 2.2 | Set up meetings with users | 1.0 | -- | (sprint) | (incomplete) |
| 3.    | **Technical development** | **7.5** | **7.10** |
| 3.1  | Back-end requirements and survey | 1.0 | 1.05 | (sprint) | 07-Jul-2009 |
| 3.2  | Outline technical design and principles | 1.0 | 0.95 | (sprint) | 23-Jul-2009 |
| 3.3  | Identify pluggable elements | 1.0 | -- | (sprint) | (see 3.2) |
| 3.4  | jQuery / RDFQuery investigations (RDFQuery dazzle meeting) | 1.0 | 1.0 | (sprint) | 12-Jul-2009 |
| 3.5  | Initial UI prototype | 3.5 | 3.35 | (sprint) | 30-Jul-2009 |
| 3.6  | Initial content persistence  | -- | 0.75 | (bartered - 2.5) | -- |

About 2 days were lost to aother project.


# Task breakdowns #

(effort estimates in days to nearest 0.25)

## 3.5: Initial UI prototype ##

3.5 days:

  * (0.5)  initial test environment: display empty screen layout
  * (0.5) define and display "stock" cards
  * (0.5) define and display blank cards in workspace
  * (0.5) drag stock to workspace; create new blank card in workspace
  * (0.5) drag blank card in workspace
  * (0.5) define and display default card structure (id - title - tags - content)
  * (0.5) edit card content

## 3.6: Initial content persistence ##

2.5 days:

  * (1.0) deploy backend software
  * (1.0) persist workspace content/layout changes
  * (0.5) persist changes to card content


# Sprint review notes #

  * The sustainability plan is overrunning initial estimates, but the additional effort is providing valued feedback to OSS-watch.  My goal for this is that the resulting materials allow a rapid innovation project like this to make and document key decisions affecting sustainability in the initially allotted 0.5 day.

  * At 31-Jul, I am buried deep in coding trying to wrap some details before going on holiday, so I haven't properly updated the sprint plan.  I do have progress notes in a private diary, and will do a proper report later. Meanwhile, despite some loss of time to Claros, progress on functional elements is good, though I am having some problems getting on top of Ajax requests for Atom requests.  The only drawback is that I don't really have any automated tests in place yet.  But at least I have achieved my goal of having an outline user interface to discuss with users, and I'm close to having some basic persistence working (I think).

## End of sprint review ##

Admin activities are substantially done, except:
  * Sprint retrospective is a few days late: final notes added 2-Aug-2009.
  * Sustainability plan has received considerable attention, but can't claim to be complete.
  * User meetings not yet set up, wanting to be confident of the UI demonstrator.  Have been discussing joint meeting with Helen White-Cooper with Jun Zhao.  I've also mentioned the plan to Chris Holland, who remains enthusiastic.

Technical activities are substantially done, with some work slightly ahead of schedule, but test cases lacking:
  * Back-end requirements and survey: done 07-Jul-2009 (http://code.google.com/p/shuffl/wiki/BackendSystemsSurvey)
  * Outline technical design and principles: started, ongoing (http://code.google.com/p/shuffl/wiki/TechnicalNotes)
  * Identify pluggable elements: done.  Identified card types as pluggable, and refactored code to make initial free-text card type a plug-in.  (See also http://code.google.com/p/shuffl/wiki/TechnicalNotes#Plugins_for_front_end_and_back_end).
  * jQuery / RDFQuery investigations: done, ongoing.  Attended RDFQuery Dazzle and got startyup boost there.  Since then, learning by developing Shuffl functionality with jQuery, which is working really well.
  * Initial UI prototype: done (mostly).  Also started work on persistence, but still no functional capability for this.  As yet, I have no automated tests, but the exploratory nature of the early work has made it hard to be rigorous about this.


# Activity summary #

15-Jun-2009:
  * (0.25) set up project Google Code infrastructure, blog, group, etc.

18-Jun-2009:
  * (0.75) work on open source sustainability plan - have asked OSS-watch for a review
  * (0.25) outline project plan in wiki

25-Jun-2009:
  * (1.0) JISC "expert workshop" on open and agile development

3-Jul-2009:
  * (0.25) Sprint plan
  * (0.25) initial JISC reporting (core resources and project plan)
  * (0.1) agile process notes
  * (0.25) start on backend requirements and survey
  * (0.15) misc email

9-Jul-2009:
  * (0.2) Misc email and stuff
  * (0.3) complete backend survey - look like settling on Exist/AtomPub for now
  * (0.5) Install eXist and run series of tests using cURL. All required functionality appears to be present.

10-Jul-2009:
  * (0.5) document tech issues
    * separation of data: content, styling, layout, etc.
    * cards and containers
    * view types / render modes
    * plugins for front end and back end
    * etc
    * updated related work links
  * (0.5) started working on jQuery version of User Interface prototype/spike

11-Jul-2009:
  * (0.5) RDFQuery dazzle meeting - learning, trying jQuery ideas

12-Jul-2009:
  * (0.5) RDFQuery dazzle meeting - learning, trying jQuery ideas

16-Jul-2009:
  * (1 day ceded to CLAROS - will reclaim later)

17-Jul-2009:
  * (0.75) Getting new Shuffl workspace to display properly sized and without scroll bars, and responding to resize window events.
  * (0.25) investigate mechanisms for loading workspace from RDF. It turns out RDFQuery doesn't have an RDF parser, only gleans RDFa from the HTML DOM. Investigations show two Javascript RDF/XML parsers: one old from Jim Ley, and another from the Tabulator project. The tabulator one looks good. Additionally, there is a Notation3 parser with a similar interface. The store interface is separated, so I should be able to wrap the RDFQuery store.

23-Jul-2009:
  * (Part of day taken by CLAROS work)
  * (0.2) Read JSON file to populate shuffl task bar (no tests yet)
  * (0.2) Read JSON file to populate card data (partial)
  * (0.2) Document ideas on data formats for workspace/card data, and other technical issues
  * review JSON-RDF format, sketch extensions for free-labelling
  * (0.2) Work on shuffl appearance
  * tentative shuffl logo constructed (as XHTML/CSS, not image)
  * experiment with layout styling for stockbar

24-Jul-2009:
  * (0.2) dynamic creation of default card content, prepare for external content
  * (0.2) tidy up card display styling; spent half the morning investigating scrolling text panes, only to discover "overflow: auto;" CSS property. Oh well!
  * (0.2) card data loaded from JSON file
  * (0.2) resize cards to allow more of main text to be visible
  * (0.2) basic content editing implemented

30-Jul-2009:
  * (0.3) Refactor code so that the initial "free-text" card type is implemented as a plug-in. All future card types should be implemented similarly.

31-Jul-2009:
  * (0.5++) Working on persistence. Got somewhat delayed working through logic to sequence workspace layout saving **after** all the cards have been saved and their save-locations noted. I want to revisit this do do something more monadic in style.

02-Aug-2009:
  * (0.25) Sprint review