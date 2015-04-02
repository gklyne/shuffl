

# Introduction #

This page is where the final JISCRI project progress report is assembled, following the template at http://code.google.com/p/jiscri/wiki/ProjectDocumentation.

# Final project progress report #

## Title of Primary Project Output ##

Shuffl: A web-based system for supporting curation of small-scale research data for web publication

## Screenshots or diagram of prototype ##

![http://shuffl.googlecode.com/svn/trunk/docs/Shuffl-screenshot-annotated.png](http://shuffl.googlecode.com/svn/trunk/docs/Shuffl-screenshot-annotated.png)

## Description of Prototype ##

The prototype demonstrates the Shuffl framework, which allows new "cards" to be created by dragging and dropping from "stockpiles" at the top of the workspace, and changed in the workspace by double-clicking on text to be edited. Specific card types implemented so far include:
  * a simple text annotation card, for recording free-text notes
  * a data table card, which uses AJAX calls to read CSV data from a web location or file system (subject to the same origin restriction), display this as a table in the card, and provides for selection of data to be visualized.
  * a graph plotting card, an example of one way that data may be visualized.  Data for graphing is indicated by dragging a data table card and dropping it onto the graph card.

When loaded from an eXist AtomPub server, the demonstrator also shows how workspaces can be saved and loaded by selecting options from the workspace menu (which is activated by clicking on the "Shuffl" logo at the top of the workspace.

This demonstrator software has focused on the the underlying Shuffl framework and the data visualization framework.  Desired features that are not yet implemented include:
  * file system browser for loading and saving workspaces
  * card collections and card relationships structured as collections (e.g. as hierarchies)
  * support for Google Data and WebDAV back-ends
  * image gallery and image annotation
  * saving data as RDF (currently, Shuffl uses JSON, as that was quicker and easier to get working).
(Many of these features will be tackled as part of the forthcoming ADMIRAL project.)

Work has also been done, but not shown in the demonstrator, to prove that independently-developed widgets that access information from other web resources and services can be embedded in Shuffl cards (Wookie widgets and FlyWeb gene finder).

## Link to working prototype ##

These demonstration prototypes run directly from the Google Code subversion repository:
  * http://shuffl.googlecode.com/svn/trunk/static/demo/shuffl-demo.xhtml (with initially empty workspace)
  * http://shuffl.googlecode.com/svn/trunk/static/demo/shuffl-demo-notes.xhtml (with notes about how to execute demonstration)

Screencast (just over 6 mins;  to paraphrase Blaise Pascal and others<sup>1</sup>, _I made this demonstration longer than asked because I lack the time to make it shorter_):
  * http://shuffl.googlecode.com/svn/trunk/docs/Shuffl-screencast.mov
  * http://shuffl.googlecode.com/svn/trunk/docs/Shuffl-screencast.wmv

<sup>1</sup> http://answers.google.com/answers/threadview?id=177502

## Link to end user documentation ##

End-user documentation for Shuffl is rather thin on the ground, but I did prepare these:

  * http://code.google.com/p/shuffl/ (brief introduction)
  * http://code.google.com/p/shuffl/wiki/Shuffl_Demonstration (instructions for demonstrator)
  * http://shuffl.googlecode.com/svn/trunk/static/docs/shuffl-intro.xhtml (a brief introduction presented using Shuffl itself)

Not so much end-user documentation, but project management notes and design notes are recorded in the project wiki:
  * http://code.google.com/p/shuffl/w/list

## Link to code repository or API ##

  * http://code.google.com/p/shuffl/source/checkout (page with details for Subversion checkout of source)
  * http://code.google.com/p/shuffl/source/browse/#svn/trunk (source code browser)
  * http://code.google.com/p/shuffl/source/browse/#svn/trunk/src (browse main source code libraries for Shuffl itself)

## Link to technical documentation ##

  * http://code.google.com/p/shuffl/w/list (project management notes and technical design notes are recorded here)
  * Detailed code and API documentation is provided through source code comments:
    * http://code.google.com/p/shuffl/source/browse/#svn/trunk/src (to browse main Javascript source code)
  * Unit test code provides a key element of API usage documentation:
    * http://code.google.com/p/shuffl/source/browse/#svn/trunk/src/test (to browse unit test source code)
    * http://code.google.com/p/shuffl/source/browse/#svn/trunk/static/test (to browse web pages used to run the unit tests)
    * http://code.google.com/p/shuffl/source/browse/#svn/trunk/static/test/data (supporting data for unit tests)

## Date prototype was launched ##

  * Initial launch at this location: 18-Nov-2009
  * Most recent launch: 30-Nov-2009

The demonstrator runs straight out of the Google Code subversion repository, and is frequently updated without formal launch procedures.  Earlier versions have been available since soon after the start of serious development work.

## Project Team Names, Emails and Organisations ##

  * Graham Klyne <graham.klyne@zoo.ox.ac.uk>, Project Manager and Developer, Zoology Department, University of Oxford
  * David Shotton <david shotton@zoo.ox.ac.uk>, Principal Investigator, Zoology Department, University of Oxford

## Project Website ##

  * http://code.google.com/p/shuffl/ - see this page for links to blog, discussion list, DOAP file, etc.
    * http://shuffl-announce.blogspot.com/ - announcement blog
    * http://groups.google.com/group/shuffl-discuss - discussion group
    * http://shuffl.googlecode.com/svn/trunk/docs/shuffl.doap - DOAP record

## PIMS entry ##

  * https://pims.jisc.ac.uk/projects/view/1333

The details displayed here are not all correct, but I don't know how to change them.

There's also a DOAP record (see above).

## Table of contents for project posts ##

  * User documentation
    * http://code.google.com/p/shuffl/wiki/Shuffl_Demonstration - how to run the demonstrator
    * [shuffl.googlecode.com/svn/trunk/docs/Shuffl-screenshot-annotated.png](http://shuffl.googlecode.com/svn/trunk/docs/Shuffl-screenshot-annotated.png) - annotated screenshot
    * http://shuffl-announce.blogspot.com/2009/09/shuffl-basic-workspace-persistence.html - notes for using Shuffl with eXist to save a workspace
  * User requirements:
    * http://code.google.com/p/shuffl/wiki/RequirementsAndGoals - initial requirements and goals outline
    * http://code.google.com/p/shuffl/wiki/20091020_Chris_Holland - initial requirements session with Chris Holland
    * Use-cases:
      * http://code.google.com/p/shuffl/wiki/20091007_UseCase_TaskManagement
      * http://code.google.com/p/shuffl/wiki/20091002_FlyKit_Widgets
      * http://code.google.com/p/shuffl/wiki/20090902_UseCase_DataVisualization
      * http://code.google.com/p/shuffl/wiki/20090911_UseCase_WebSiteStatisticsVisualization
      * http://code.google.com/p/shuffl/wiki/20090904_UseCase_Simal
      * http://code.google.com/p/shuffl/wiki/UserStories
  * Technical design notes:
    * http://code.google.com/p/shuffl/wiki/TechnicalNotes - early overall design notes
    * http://code.google.com/p/shuffl/wiki/BackendSystemsSurvey - back-end systems survey, with rationale for choosing AtomPub as the initial back-end  storage protocol.  In hindsight, I think I'd have gone for WebDAV.
    * http://code.google.com/p/shuffl/wiki/InterfaceNotes - user interface design notes (not yet fully implemented)
    * http://code.google.com/p/shuffl/wiki/Card_Views_Data_Testing - notes for refactoring card implementation to use a simplified MVC pattern, leadingto the jQuery 'model' plugin.
    * http://code.google.com/p/shuffl/wiki/jQueryNotes
    * http://code.google.com/p/shuffl/wiki/CardReadWriteOptions - notes for keeping track of whether cards need to be written, and also what URIs to use for reading and writing.  These notes predate reworking of the storage interface, but still have some relevance.
    * http://code.google.com/p/shuffl/wiki/DataPublicationVocabulary - notes from a VoCamp session in Bristol with Andy Seaborne - this may form the basis of a vocabulary for representing table/graph data in RDF.
    * http://code.google.com/p/shuffl/wiki/RelatedWork - catalogue of related wotrk and projects, accummulated through the duration of the project
    * Reflections:
      * http://shuffl-announce.blogspot.com/2009/08/jquery-rocks.html - why is jQuery so effective?
      * http://shuffl-announce.blogspot.com/2009/08/implementing-atompub.html - reflections on using AtomPub
      * http://shuffl-announce.blogspot.com/2009/08/exist-and-jetty-configuration.html - using Jetty to serve static files
      * http://shuffl-announce.blogspot.com/2009/09/jquery-with-firefox-gotcha-use-html-not.html
      * http://shuffl-announce.blogspot.com/2009/09/delete-on-atompub-media-resource.html
      * http://shuffl-announce.blogspot.com/2009/09/shuffl-basic-workspace-persistence.html
      * http://shuffl-announce.blogspot.com/2009/09/accessing-files-from-browser-based.html - some experiments with file input form elements and Javascript
      * http://shuffl-announce.blogspot.com/2009/09/framework-for-testing-shuffl-card.html and http://shuffl-announce.blogspot.com/2009/10/mvc-pattern-and-mock-widgets.html - unit-testing user interface code with the simplified MVC pattern, implemented as a very simple jQuery plugin
      * http://shuffl-announce.blogspot.com/2009/10/flyui-genefinder-widget-in-shuffl-card.html - adding FlyWeb widgets to shuffl.  See also the discussion at http://groups.google.com/group/shuffl-discuss/browse_frm/thread/63234cb3d19229ba and also at http://groups.google.com/group/shuffl-discuss/browse_frm/thread/8a712f9e4616f653:  this additional discussion raises cautionary concerns that Shuffl may be getting deflected from its original purpose.
  * Futures:
    * http://code.google.com/p/shuffl/wiki/FutureApplicationNotes - Notes and ideas for future applications using Shuffl
    * http://imageweb.zoo.ox.ac.uk/wiki/index.php/ADMIRAL - ADMIRAL project, for which Shuffl is intended to provide some key elements
    * Unfinished business:
      * http://code.google.com/p/shuffl/wiki/TaskNotes
      * http://code.google.com/p/shuffl/wiki/TechnicalDebt
      * http://code.google.com/p/shuffl/wiki/ProblemsAndUnknowns
  * Project managemebnt and administration
    * Project proposal:
      * http://shuffl.googlecode.com/files/20090421-shuffl-proposal-no-budget-figures.pdf
    * Project plan and progress (see also the linked sprint plans):
      * http://code.google.com/p/shuffl/wiki/ProjectPlanOutline_200906_200911
      * http://code.google.com/p/shuffl/wiki/AgileProcess - agile process notes
      * http://code.google.com/p/shuffl/wiki/20091130_JISCRI_ProjectFinalProgressReport - final progress report: this document
      * http://code.google.com/p/shuffl/wiki/SWOT_analysis - SWOT analysis
    * Project open-source governance and sustainability:
      * http://code.google.com/p/shuffl/wiki/OpenSourceSustainabilityPlan - open-source software sustainability plan
      * http://code.google.com/p/shuffl/wiki/Individual_Contributor_License_Agreement
      * http://shuffl-announce.blogspot.com/2009/12/sustaining-shuffl-view-ahead.html - final reflections on continuing Shuffl development
    * Reflections
      * http://shuffl-announce.blogspot.com/2009/07/agile-modelling-and-development.html - reflections on agile development
      * http://shuffl-announce.blogspot.com/2009/09/relearning-agile-lessons.html
  * Project announcements and discussion:
    * http://shuffl-announce.blogspot.com/ - project blog
    * http://groups.google.com/group/shuffl-discuss - discussion forum

Selected blog posts have been indexed above, but not routine progress announcements as they mainly duplicate the sprint plans and progress reports already noted.

# Tags #

progressPosts, rapidInnovation, JISCRI, JISC, finalProgressPost, output, prototype, product, demonstrator, shuffl