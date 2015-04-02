

Discussion with Davide Eynard: about use cases for data visualizion

## Description ##

Information from reviews in social review web site (tripadviser); visualize different aspects of data:

Example displays:
  * tag cloud of keywords from review(s) (own code)
  * pie chart (Google visualization(
  * number of reviews/month over period of several years (..)
  * graph of sum of reviews for all hotels: i.e. add time-series (..)

Example sources:
  * info from sparql query, then visualize (as table of data)
  * data saved explicitly in knowlegde base

See: http://web2rism.ath.cx/old/

Tools used:
  * rainbow tool to extract text statistics TFIDF (term freq inverse doc freq)
    * http://www.cs.cmu.edu/~mccallum/bow/rainbow/
  * jane16 API
  * PERL library for language detection

Would like to:
  * grab data from the Web, using SPARQL and/or other means
  * extract statistics from the data
  * possibly to combine statistics (e.g. different vars fro same source, or vars from different sources - e.g. sum, average, range).  Also compare results from different sites corresponding to the same query.  Combine with information obtained through manual characterization: e.g. how many results in top-30 Google results are commercial vs official vs personal.
  * visualize in appropriate format(s)

Would like to generalize this...

## Extra notes and links ##

http://esw.w3.org/topic/WoDo  cf. sect 3.2

See http://buzzword.org.uk/2009/WoDo/test-data/ for sketch of framework for extracting raw data from SPARQL queries.

See JSON tables used for Google visualization
  * http://code.google.com/apis/visualization/

Use case would include transformation from SPARQL JSON query result to Google chart API format - could this be generalized.

See: http://www.gapminder.org/ for examples of interesting visualizations