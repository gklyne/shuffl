

# Shuffl alternative serialization #

Implementation notes for RDF and other serialization formats.

The intent is to introduce RDF serialization alongside the existing JSON serialization, via a plugin framework similar to those implemented for card types and storage access.

# Proposed new APIs #

## Application APIs ##

```
shuffl.readCardData(session, carduri, format, callback)
 -> callback(carddata or shuffl.Error value)

shuffl.readWorkspaceData(session, wsuri, format, callback)
 -> callback(wsdata or shuffl.Error value)

shuffl.createCardData(session, carduri, format, carddata, callback)
 -> callback(uri or shuffl.Error value)

shuffl.updateCardData(session, carduri, format, carddata, callback)
 -> callback(uri or shuffl.Error value)

shuffl.createWorkspaceData(session, wsuri, format, wsdata, callback)
 -> callback(uri or shuffl.Error value)

shuffl.updateWorkspaceData(session, wsuri, format, wsdata, callback)
 -> callback(uri or shuffl.Error value)
```

where:

`format` is `"rdf"` or `"json"`; otherwise `null`, in which case the format
is deduced from the URI.

## Factory/Handler SPIs ##

```
shuffl.addSerializationHandler(handlername, uripattern, handler);
```
where:

```
str = handler.toWorkspaceString(obj);

str = handler.toCardString(obj);

obj = handler.toWorkspaceObject(str);

obj = handler.toCardObject(str);

str = handler.serializedMimeType();
```

# RDF formats #

## Workspace ##

### JSON example ###

```
{ "shuffl:id":        "test-shuffl-workspace"
, "shuffl:class":     "shuffl:Workspace"
, "shuffl:version":   "0.1"
, "shuffl:base-uri":  "#"
, "shuffl:uses-prefixes":
  [ { "shuffl:prefix":  "shuffl",  "shuffl:uri": "http://purl.org/NET/Shuffl/vocab#" }
  , { "shuffl:prefix":  "rdf",     "shuffl:uri": "http://www.w3.org/1999/02/22-rdf-syntax-ns#" }
  , { "shuffl:prefix":  "rdfs",    "shuffl:uri": "http://www.w3.org/2000/01/rdf-schema#" }
  , { "shuffl:prefix":  "owl",     "shuffl:uri": "http://www.w3.org/2002/07/owl#" }
  , { "shuffl:prefix":  "xsd",     "shuffl:uri": "http://www.w3.org/2001/XMLSchema#" }
  ]
, "shuffl:workspace":
  { "shuffl:stockbar":
      [ { "id": "stockpile_1", "class": "stock-yellow",  "label": "Ye", "type": "shuffl-freetext-yellow"  }
      , { "id": "stockpile_2", "class": "stock-blue",    "label": "Bl", "type": "shuffl-freetext-blue"    }
      , { "id": "stockpile_3", "class": "stock-green",   "label": "Gr", "type": "shuffl-freetext-green"   }
      , { "id": "stockpile_4", "class": "stock-orange",  "label": "Or", "type": "shuffl-freetext-orange"  }
      , { "id": "stockpile_5", "class": "stock-pink",    "label": "Pi", "type": "shuffl-freetext-pink"    }
      , { "id": "stockpile_6", "class": "stock-purple",  "label": "Pu", "type": "shuffl-freetext-purple"  }
      ]
  , "shuffl:layout":
      [ { "id": "card_1", "type": "shuffl-freetext-yellow", "data": "test-shuffl-card_1.json"
        , "pos": {"left":100, "top":30} 
        }
      , { "id": "card_2", "type": "shuffl-freetext-blue",   "data": "test-shuffl-card_2.json"
        , "pos": {"top":0, "left":400}
        , "size": {"width":600,"height":400}
        , "zindex":11
        }
      ]
  }
}
```

### RDF/XML example ###

```
<rdf:RDF
    xmlns:shuffl="http://purl.org/NET/Shuffl/vocab#"
    xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
    xmlns:rdfs="http://www.w3.org/2000/01/rdf-schema#"
    xmlns:owl="http://www.w3.org/2002/07/owl#"
    xmlns:xsd="http://www.w3.org/2001/XMLSchema#"
    xml:base="#"
>
  <shuffl:Workspace rdf:about="#test-shuffl-workspace">
    <shuffl:base-uri>#</shuffl:base-uri>
    <shuffl:version>0.1</shuffl:version>
    <shuffl:id>test-shuffl-workspace</shuffl:id>
    <shuffl:stockbar rdf:parseType="Collection">
      <rdf:Description>
        <shuffl:id>stockpile_1</shuffl:id>
        <shuffl:css>stock-yellow</shuffl:css>
        <shuffl:label>Ye</shuffl:label>
        <shuffl:type>shuffl-freetext-yellow</shuffl:type>
      </rdf:Description>
      <rdf:Description>
        <shuffl:id>stockpile_2</shuffl:id>
        <shuffl:css>stock-blue</shuffl:css>
        <shuffl:label>Bl</shuffl:label>
        <shuffl:type>shuffl-freetext-blue</shuffl:type>
      </rdf:Description>
      <rdf:Description>
        <shuffl:id>stockpile_3</shuffl:id>
        <shuffl:css>stock-green</shuffl:css>
        <shuffl:label>Gr</shuffl:label>
        <shuffl:type>shuffl-freetext-green</shuffl:type>
      </rdf:Description>
      <rdf:Description>
        <shuffl:id>stockpile_4</shuffl:id>
        <shuffl:css>stock-orange</shuffl:css>
        <shuffl:label>Or</shuffl:label>
        <shuffl:type>shuffl-freetext-orange</shuffl:type>
      </rdf:Description>
      <rdf:Description>
        <shuffl:id>stockpile_5</shuffl:id>
        <shuffl:css>stock-pink</shuffl:css>
        <shuffl:label>Pi</shuffl:label>
        <shuffl:type>shuffl-freetext-pink</shuffl:type>
      </rdf:Description>
      <rdf:Description>
        <shuffl:id>stockpile_6</shuffl:id>
        <shuffl:css>stock-purple</shuffl:css>
        <shuffl:label>Pu</shuffl:label>
        <shuffl:type>shuffl-freetext-purple</shuffl:type>
      </rdf:Description>
    </shuffl:stockbar>
    <shuffl:layout rdf:parseType="Collection">
      <rdf:Description>
        <shuffl:id>card_1</shuffl:id>
        <shuffl:type>shuffl-freetext-yellow</shuffl:type>
        <shuffl:data rdf:resource="test-shuffl-card_1.rdf" />
        <shuffl:pos>
          <rdf:Description>
            <shuffl:left>100</shuffl:left>
            <shuffl:top>30</shuffl:top>
          </rdf:Description>
        </shuffl:pos>
      </rdf:Description>
      <rdf:Description>
        <shuffl:id>card_2</shuffl:id>
        <shuffl:type>shuffl-freetext-blue</shuffl:type>
        <shuffl:data rdf:resource="test-shuffl-card_2.rdf" />
        <shuffl:pos>
          <rdf:Description>
            <shuffl:left>400</shuffl:left>
            <shuffl:top>0</shuffl:top>
          </rdf:Description>
        </shuffl:pos>
        <shuffl:size>
          <rdf:Description>
            <shuffl:width>600</shuffl:width>
            <shuffl:height>400</shuffl:height>
          </rdf:Description>
        </shuffl:size>
        <shuffl:zindex>11</shuffl:zindex>
      </rdf:Description>
    </shuffl:layout>
  </shuffl:Workspace>
</rdf:RDF>
```

Validated by http://www.rdfabout.com/demo/validator/, 20100614

## Card ##

### JSON example ###

```
{ "shuffl:id":        "id_1"
, "shuffl:type":      "shuffl-freetext-yellow"
, "shuffl:version":   "0.1"
, "shuffl:base-uri":  "#"
, "shuffl:uses-prefixes":
  [ { "shuffl:prefix":  "shuffl", "shuffl:uri": "http://purl.org/NET/Shuffl/vocab#" }
  , { "shuffl:prefix":  "rdf",    "shuffl:uri": "http://www.w3.org/1999/02/22-rdf-syntax-ns#" }
  , { "shuffl:prefix":  "rdfs",   "shuffl:uri": "http://www.w3.org/2000/01/rdf-schema#" }
  , { "shuffl:prefix":  "owl",    "shuffl:uri": "http://www.w3.org/2002/07/owl#" }
  , { "shuffl:prefix":  "xsd",    "shuffl:uri": "http://www.w3.org/2001/XMLSchema#" }
  ]
, "shuffl:data":
  { "shuffl:title":   "Card 1 title"
  , "shuffl:tags":    [ "card_1_tag", "yellowtag" ]
  , "shuffl:text":    "Card 1 free-form text here<br/>line 2<br/>line3<br/>yellow"
  }
}
```

### RDF/XML example ###
```
<rdf:RDF
    xmlns:shuffl="http://purl.org/NET/Shuffl/vocab#"
    xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
    xmlns:rdfs="http://www.w3.org/2000/01/rdf-schema#"
    xmlns:owl="http://www.w3.org/2002/07/owl#"
    xmlns:xsd="http://www.w3.org/2001/XMLSchema#"
    xml:base="#"
>
  <shuffl:Card rdf:about="#id_1">
    <shuffl:base-uri>#</shuffl:base-uri>
    <shuffl:version>0.1</shuffl:version>
    <shuffl:id>id_1</shuffl:id>
    <shuffl:type>shuffl-freetext-yellow</shuffl:type>
    <shuffl:data>
      <rdf:Description>
        <shuffl:title>Card 1 title</shuffl:title>
        <shuffl:tags>
          <rdf:List>
            <rdf:first>card_1_tag</rdf:first>
            <rdf:rest>
              <rdf:List>
                <rdf:first>yellowtag</rdf:first>
                <rdf:rest rdf:resource="http://www.w3.org/1999/02/22-rdf-syntax-ns#nil" />
              </rdf:List>
            </rdf:rest>
          </rdf:List>
        </shuffl:tags>
        <shuffl:text rdf:parseType="Literal">Card 1 free-form text here<br/>line 2<br/>line3<br/>yellow"</shuffl:text>
      </rdf:Description>
    </shuffl:data>
  </shuffl:Card>
</rdf:RDF>
```

Validated by http://www.rdfabout.com/demo/validator/, 20100614

# Software interfaces affected #

Current interface functions, and where used.

Assume that a new interface will accept/return a Javascript object as now.

## Module shuffl.loadworkspace ##

session.getData
  * shuffl.readCard
  * shuffl.loadworkspace

## Module shuffl.saveworkspace ##

session.create
  * shuffl.saveCard
  * shuffl.saveNewWorkspace
    * saveWorkspaceDescription

session.put
  * shuffl.updatecard
  * shuffl.updateworkspace
    * updateWorkspaceDescription

# Format selection #

Possible techniques for deciding what format to use when saving/loading Shuffl data.

## Desiderata ##

  * Prefer no change to UI
  * Able to mix JSON and RDF card data when loading a workspace
  * Interchangeable, round-trippable format
  * work with local file access and HTTP access

## Options ##

### Filename extension ###

For:
  * meets all desiderata

Against:
  * goes against general presumption against the desirability of inferring data semantics from URI format.  (But such inference would apply locally to the  Shuffl applications, not generally across the Web.)
  * could fail if uncommon extensions are used

### Explicit parameter ###

For:
  * avoids inferring data semantics from URI form
  * can satisfy 2 out of 4 desiderata

Against:
  * requires UI change
  * doesn't (easily) support format mixing
  * requires internal API changes

### Sniffing ###

For:
  * meets all desiderata

Against:
  * cannot be used when saving a workspace -> incomplete solution
  * possible implementation complexity

## Conclusion for format selection ##

In the first instance, base decision on file extension, as this satisfies all
immediate requirements and is generally the easiest to implement.

Later, if specific problems are noted, revisit and consider alternatives.