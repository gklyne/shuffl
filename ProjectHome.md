## About Shuffl ##

Shuffl helps researchers, and others, to capture and organize data for re-use, without having to think up-front about its structure.  One problem that it aims to address is loss of original science research data because available publication systems are too hard to set up and use.

Shuffl is a web browser application that lets researchers interact with their data using an interface metaphor based on index cards. It facilitates capture of raw data, and subsequent crystalization of structure. Data can then be published to the Web, with each card an addressable Web resource.

Shuffl is also applicable to a range of tasks where visual presentation and manipulation play key roles.  It could be viewed as like a mind map with real data, or Hypercards on the web.

See also:
  * [Final report](http://code.google.com/p/shuffl/wiki/20091130_JISCRI_ProjectFinalProgressReport)
  * [Screencast (.mov)](http://shuffl.googlecode.com/svn/trunk/docs/Shuffl-screencast.mov) or [(.wmv)](http://shuffl.googlecode.com/svn/trunk/docs/Shuffl-screencast.wmv)
  * [JISC project page](http://www.jisc.ac.uk/whatwedo/programmes/inf11/jiscri/shuffl.aspx)

_Status note (March 2010): the Shuffl project has been rather quiet for the past couple of months.  The original development suffered from some usability problems that we aim to address shortly as part of the ADMIRAL project (http://imageweb.zoo.ox.ac.uk/wiki/index.php/ADMIRAL), by using WebDAV to support a more usable  back-end storage interface than we were able to achieve using the Atom Publishing Protocol. Look for further updates in the next few months._

_Update (June 2010): a file browsing interface has been implemented for loading and saving workspaces and accessing data files from a WebDAV-enabled server (tested with Apache httpd with mod\_dav).  Current work is addressing use of RDF/XML as an alternative format for saving workspace and card descriptions. Some other usability issues remain to be addressed before Shuffl is ready to be let loose with real users._

![http://shuffl.googlecode.com/svn/trunk/images/shuffl-screenshot-graph.png](http://shuffl.googlecode.com/svn/trunk/images/shuffl-screenshot-graph.png)

The current work-in-progress Shuffl application can be activated directly from subversion by clicking [here](http://shuffl.googlecode.com/svn/trunk/static/demo/shuffl-demo.xhtml) or [here for a version with notes](http://shuffl.googlecode.com/svn/trunk/static/demo/shuffl-demo-notes.xhtml).  There is a [brief introduction](http://shuffl.googlecode.com/svn/trunk/static/docs/shuffl-intro.xhtml) that is presented using Shuffl.  Currently, this is still in development, and is not a fully functional application.  It can be expected to break from time-to-time.  Currently, it's being developed for Firefox, and also seems to work in Safari.

A page of instructions for Shuffl work-in-progress demonstration applications  is [here](Shuffl_Demonstration.md).

## Project goals (initial phase to November 2009) ##

This project aims to provide an easy-to-use web-based data and information management environment, using as its theme a visual metaphor based on record cards, mimicking the use of physical cards in existing information handling tasks.  Its goal is a system with a user interface that is very
approachable and easily adopted by researchers and others who are uninterested in the intricacies of data management, but whose work involves the creation of valuable data resources.

The initial target is a simple but useful application, supported by a lightweight back-end web service provisioned locally or through shared infrastructure. Data will be stored as RDF on a web server, accessible to other tools as linked web data.

## Project support ##

The initial work on this project is funded by [JISC](http://www.jisc.ac.uk/) under their [03/09 Rapid Innovation call](http://www.jisc.ac.uk/fundingopportunities/funding_calls/2009/03/309ricall.aspx), with the intent to create a basis for future work in the field of data curation and publication by a community of interested users and developers.

The funded proposal can be viewed [here](http://shuffl.googlecode.com/files/20090421-shuffl-proposal-no-budget-figures.pdf).

## Project status/history ##

July 2009: this project is in an early exploratory phase.  There are some plans, an initial project infrastructure, notes, a little experimental code, a user interface mock-up, but nothing that remotely resembles a working product.  We hope this will change rapidly - watch this space!

October 2009: I have an early data visualization demonstration. (Based on discussions with one researcher, I decided to focus initially on visualization rather than primary capture, as that seemed a quicker route to value and did not require the researcher to trust the framework to look after his data.  But it still helps to get the data into a sharable space.)

November 2009: a refined version of the data visualization demonstration represents the main first project phase deliverable.

March 2010: started work on developing Shuffl as an annotation tool for the ADMIRAL project.

June 2010: WebDAV-based file browsing interface implemented.  Working on RDF/XML workspace and card storage options.

## Enquires ##

Please direct technical and user queries about this project to the indicated Google group.  For other enquiries, please contact Graham Klyne at Oxford University Zoology Department.


---




&lt;link rel="meta" title="DOAP" href="http://shuffl.googlecode.com/svn/trunk/docs/shuffl.doap" type="application/rdf+xml"/&gt;



