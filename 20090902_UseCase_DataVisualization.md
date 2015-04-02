# Data visualization use case #

This use case was suggested in discussion with Chris Holland, a zoology researcher, as an application that he might use now if it were available.  It focuses on visualization rather than data capture, which is probably a good way to start building user trust and familiarity with the software.

## Shuffl data visualization ##

Assume a card or collection represent a dataset; assume another card represents a way to visualize data.  Being able to easily "join" these to create an instance of the visualization would be very useful.  I think this is eminently do-able.

If I add capabilities to import CSV data as a stack (collection) of cards with defined fields and create a plug-in that, when linked to a card stack, generates a graph or graphs of numeric values on the cards, then I think the basic idea described above could be demonstrated.

The user interface I envisage would be to have a "stock" item for the visualization, an instance of which can be created by dragging to the workspace.  Initially, the displayed card would be empty.  Linking a card-stack with the visualization instance, using some form of drag-and-drop, would cause the visualization to populate with data from the stack.

More complex visualizations would be achieved by implementing more sophisticated plug-in cards.

A pragmatic advantage of focusing on this application would be that it is one that researchers could use without giving control of the original data to a prototype system, and which could provide some real value even if the system is not fully hardened for production use.  This would see Shuffl initially presented as a visualization tool rather than a curation tool; this might turn out to be advantageous, and is not as much at variance with the original vision as might be supposed.

# Full notes from meeting with Chris Holland #

Notes from meeting with Chris Holland: 2-Sep-2009, 10:00

From my initial email, setting up the meeting:

> I'd like to keep it fairly brief (say 30mins-1hour). What I'd like to get from this is:
    1. a feeling for the types, diversity and volume of data that you collect in your research, and
    1. an initial indication (no more than an expression of interest) of ways in which Shuffl might be adapted to be actually useful for you. Ideally, some small task(s), possibly quite trivial and peripheral to your core work, for which you could say: "If Shuffl does this (well, easily, etc.), I'd use it for real".

> What I hope this could do is focus my ongoing Shuffl developments on particular functions that have the potential to be of real use to you in your work.

## Research data ##

(Chris describes)

### Overview of research ###

Chris' research involves studying the mechanical properties of biologically produced silk.  Silk is an unusual in being one of relatively few proteins that have been naturally selected for structural rather than chemical properties.

Silk is produced and stored within an organism as a gel, and undergoes transition to a fibre when subjected to certain physical manipulations and stresses.  The experiments are, in part, studying this transformation under varying conditions of species and age of producing organism, (genetic information?), physical conditions of processing such as temperature, force applied, time over which processing is performed, etc.  For any given sample, many different experimental observations may be made using different techniques and under varying conditions.  Thus generating a matrix of results indexed by species, measurement technique and processing conditions.

Much of the experimentation involves applying tools and techniques well-known to material science and engineering to biological samples.  Silk is a "non-Newtonian fluid", and many of the measurements are used outside biological research in areas such as food and polymer research.

### Types of observation/data collected ###

Measurements are mainly of physical properties of samples.

A workflow may involve extracting sample material from anaesthetized spiders, and subjecting the samples to a battery of tests, results of which are recorded separately.  For analysis of the data, the researcher is looking for interesting relationships between the various samples.

The the data handling tools used are mainly in support of visualization of the data, and commonly involve using Access databases and spreadsheets.

### What media types ###

Everything!

Data collected takes just about all imaginable forms: textual annotation, numeric data, images, videos (including multidimensional confocal images).

Particularly useful would be a facility for linking video frames with actual data: being able to play a video and see corresponding data displayed side-by-side, possibly by timestamping the video and data observations with a common timestamp.

### How is data managed at present? ###

Spreadsheets, Access database, file system folders with pictures, scanning electron microscope (SEM) images.

### How does data relate to other available data sources? ###

No known related public sources at present.

### What particular data handling problems are encountered ###

(e.g. relating data to each other, or to public information, sharing)

Relating different observation data (e.g. different observations for a common sample, or common observations across different samples, or the effect of varying processing conditions), and visualizing the results.

## Shuffl status ##

(GK describes)

### Current status ###

Currently have:
  * prototype user interface implemented entirely in Javascript
  * plug-in framework for adding new card types and structures
  * working on persistence and web-sharing via AtomPub, but not yet complete
  * JSON representation of data

A lot of the code is still somewhat experimental, and needs "hardening" to make the application more robust.

### Shuffl futures ###

Very few of these will be possible in the funded 3 months remaining.
  * test framework
  * collections
  * RDF/XML data representation (for LDOW)
  * incremental data saving
  * links to external data sources
  * images (annotation and organization)
  * plug-in modules for back-end storage/persistence of data
  * "cloud" data storage (Google data, etc.)
  * video (annotation)
  * collaborative editing/viewing of data
  * real-time "live" data
  * Save size information for cards
  * Tie in to version management
  * Calculated fields and values linked across cards

### Possible applications ###

  * project management (esp. Agile)
  * online brainstorming / retrospective

## Notes ##

(from discussion)

In discussion, we noted that Shuffl could be viewed as a mindmap with real data (as opposed to just ideas).

### Target application ###

Chris described one application of Shuffl that he thought might be very useful:  assume a card or collection represent a dataset; assume another card represent a way to visualize data.  Being able to easily "join" these to create an instance of the visualization.  I think this is eminently do-able.

If I add capabilities to import CSV data as a stack (collection) of cards with defined fields and create a plug-in that, when linked to a card stack, generates a graph or graphs of numeric values on the cards, then I think the basic idea described above could be demonstrated.

The user interface I envisage would be to have a "stock" item for the visualization, an instance of which can be created by dragging to the workspace.  Initially, the displayed card would be empty.  Linking a card-stack with the visualization instance, using some form of drag-and-drop, would cause the visualization to populate with data from the stack.

More complex visualizations would be achieved by implementing more sophisticated plug-in cards.

A pragmatic advantage of focusing on this application would be that it is one that researchers could use without giving control of the original data to a prototype system, and which could provide some real value even if the system is not fully hardened for production use.  This would see Shuffl initially presented as a visualization tool rather than a curation tool; this might turn out to be advantageous, and is not as much at variance with the original vision as might be supposed.