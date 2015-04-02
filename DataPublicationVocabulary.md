

# Introduction #

This page contains notes about and links to vocabulary terms for publishing data in RDF.

# Vocabulary terms #

## Time-series data ##

(Notes from 20090910 VoCamp, working with Andy Seaborne)

http://www.thefigtrees.net/lee/blog/2008/03/modeling_statistics_in_rdf_a_s.html
http://sw.joanneum.at/scovo/schema.html (RDFa)

But scv:Item rdf:value LITERAL -- not a complex value

### Examples ###

TBD

### Draft ontology ###

LEVEL 0:
```
@prefix : <> .

:TimeDataSeries a rdfs:Class .

:data a rdf:Property 
  domain TimeDataSeries
  range rdf:list of :TimeDataPoint 
  :cardinality 1

:presentationSuggestion??
   graph
   histogram
   (what the name for this?)

:datatypeInSeries a property
   domain TimeDataSeries
   range  Class or datatype

:descr a rdf:Property .
   subpropertyOf rdfs:label

:TimeDataPoint a rdfs:Class .

:hasTime a rdf:Property ;
  domain  :TimeDataPoint
  range   ??
  :cardinality 1

:hasValue a rdf:Property ; # skos:narrower rdfs:value ??
  rdfs:subClassOf rdf:value
  domain  :TimeDataPoint
  range   ??
  :cardinality 1

# Subtype rdf:List?
# Must be Wellformed list

# ?? own first/rest

## Expectations:
all the values are comparable
often same XSD datatype hierarchy where appropriate

Timezone:

```

LEVEL 1:
```
Name for a collection of rows.
 :Table?
 :Collection 
```

# Other notes #

# Links #