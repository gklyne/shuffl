# 20 Oct 2009 meeting with Chris Holland #

## Goals ##

  * understand Shuffl next steps that may be useful for Chris
  * get some representative sample data to work with

(Both goals were achieved.)

## Agenda ##

  * demo current state of Shuffl
    * go through whole warts-and-all process
  * discuss weaknesses
    * limited visualization
    * load/save interface is hostile
    * data loading interface is hostile
    * limitations of working in browser environment
  * visualization options; list 2 or 3 to try
  * priorities
  * usability issues
  * role of specialized backing service - am I right to try and avoid requiring this? _not covered_

## Demo sequence ##

  1. start eXist
  1. start browser
  1. show spreadsheet
  1. show file system layout and explain mapping into HTTP localhost space using eXist
  1. export CSV
  1. fire up Shuffl
  1. create cards in workspace
  1. read in various CSV data - note entry of filenames relative to current web page
  1. drop different data on graph
  1. save workspace (/shuffl/demo-20091020-1/)
  1. reload workspace

## Notes from meeting ##

We started copying some sample data from Chris onto my machine, for test purposes.  Some of the data was binary, and needs to be exported by the original software.  Some is parsable plain text, and will need some special Javascript to decode.  Some is Excel spreadsheets, and readily accessible as exported CSV.  The Excel spreadsheets also contain some sample visualizations, all of which lie within the capabilities of 'flot' to generate; i.e. line and point plots  with x1, x2, y1, y2 axes.  One of the key requirements Chris highlighted was to be able to easily select different plots so that differences could be visualized.  Also, to display x/y coordinates of mouse position while hovering over graph.

A number of specific enhancements were suggested, listed here in decreasing priority order:
  * Selection of data to plot, axis selection and colour selection.  Specifically, a selection field above each column, to control plotting for that column as 'none', x1, x2, y1, y2, and for 'y' values to select a colour.
  * Ability to type in axis labels when not available from a data row; default could use card name/title+col?
  * Quantitative analysis: trend-line calculation and X-Y coordinate display of mouse position when hovering over a graph.
  * Linking of rows between datasets, e.g. by keyword - need to determine how this would affect the user interface
  * Display of image linked to a dataset or row
  * Data "play-list": link one or more cards to the playlist, and update display as playlist selection is changed; e.g. click to select item, scroll though list, select multiple items, auto-play through list, autoplay through selected items.  _(LATER: I'm thinking that some kind of "matrix" or multiple selection input should be possible so that, for example, clicking different selections in one playlist cause corresponding but different data in linked cards to be updated in sync; e.g. spider species vs measured material parameter)_

Discussing usability of data loading, the real requirement (no surprise here) is for point-and-click file selection.  Currently, browser restrictions and server limitations make this hard for AtomPub, though some specialized eXist code might overcome this for the local data case.  I think this may be a problem for ADMIRAL to address in its local data store design.  Possibly acceptable is to have a directory manually entered once, then point-and-click files within that directory (the HTML file input element may be able to support this).

Other usability issues:
  * point and click form load/save
  * update card data on entry of filename - don't use separate button
  * feedback indicator when new data is loaded (use jQuery animation?)