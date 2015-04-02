

# Shuffl, RDF/XML, JSON and JRON #

These are notes for test cases to implement the [JRON](http://decentralyze.com/2010/06/04/from-json-to-rdf-in-six-easy-steps-with-jron/) format for Shuffl workspace and card data.

**Notes:**
  * the JRON examples in this page were early design notes, and may be out-of-date: refer to the [actual test suite](http://code.google.com/p/shuffl/source/browse/trunk/src/test/test-rdfquery.jron.js) for real JRON data.  In particular, note that numeric values and default prefixes are now handled much more cleanly than allowed by the original mapping design.
  * For notes about the actual implementation and its status, see [here](http://code.google.com/p/shuffl/source/browse/trunk/docs/JRON-for-rdfquery-implementation-notes.txt).

The intent is that the main transformation logic will be a generic plugin or library to work with [RDFQuery](http://code.google.com/p/rdfquery/); e.g.

```
JRONobject = RDFtoJRON(RDFQuery_databank);
```
and
```
RDFQuery_databank = JRONtoRDF(JRONObject);
```



# Simple statements with literal object #

## RDF/XML ##

```
<rdf:RDF
    xmlns:shuffl="http://purl.org/NET/Shuffl/vocab#"
    xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
>
  <shuffl:Card rdf:about="http://example.com/card#id_1">
    <shuffl:id>id_1</shuffl:id>
  </shuffl:Card>
</rdf:RDF>
```

## Shuffl JSON ##

```
{ "shuffl:id": "id_1"
, "shuffl:uses-prefixes":
  [ { "shuffl:prefix":  "shuffl", "shuffl:uri": "http://purl.org/NET/Shuffl/vocab#" }
  , { "shuffl:prefix":  "rdf",    "shuffl:uri": "http://www.w3.org/1999/02/22-rdf-syntax-ns#" }
  ]
}
```

## JRON ##

```
{ "__iri":     "http://example.com/card#id_1"
, "__prefixes":
  { "shuffl:": "http://purl.org/NET/Shuffl/vocab#"
  , "rdf:":    "http://www.w3.org/1999/02/22-rdf-syntax-ns#"
  }
, "rdf:type":  { "__iri": "shuffl:Card" }
, "shuffl:id": "id_1"
}
```

## Notes ##

The Shuffl format does not explicitly encode the URI of the resource being described:
it is deduced implictly from the shuffl:id value.



# Simple statements with non-literal object #

## RDF/XML ##

```
<rdf:RDF
    xmlns:shuffl="http://purl.org/NET/Shuffl/vocab#"
    xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
>
  <shuffl:Card rdf:about="http://example.com/card#id_1">
    <shuffl:base-uri rdf:resource="http://example.com/card#" />
  </shuffl:Card>
</rdf:RDF>
```

## Shuffl JSON ##

```
{ "shuffl:base-uri":    "http://example.com/card#id_1"
, "shuffl:uses-prefixes":
  [ { "shuffl:prefix":  "shuffl", "shuffl:uri": "http://purl.org/NET/Shuffl/vocab#" }
  ]
}
```

## JRON ##

```
{ "__iri":     "http://example.com/card#id_1"
, "__prefixes":
  { "shuffl:": "http://purl.org/NET/Shuffl/vocab#"
  , "rdf:":    "http://www.w3.org/1999/02/22-rdf-syntax-ns#"
  }
, "rdf:type":        { "__iri": "shuffl:Card" }
, "shuffl:base-uri": { "__iri": "http://example.com/card#" }
}
```



# Statements with xml:base #

## RDF/XML ##

```
<rdf:RDF
    xmlns:shuffl="http://purl.org/NET/Shuffl/vocab#"
    xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
    xml:base="http://example.com/card"
>
  <shuffl:Card rdf:about="#id_1">
    <shuffl:base-uri rdf:resource="http://example.com/card#" />
  </shuffl:Card>
</rdf:RDF>
```

## Shuffl JSON ##

```
{ "shuffl:base-uri":    "http://example.com/card#id_1"
, "shuffl:uses-prefixes":
  [ { "shuffl:prefix":  "shuffl", "shuffl:uri": "http://purl.org/NET/Shuffl/vocab#" }
  ]
}
```

## JRON ##

```
{ "__iri":     "http://example.com/card#id_1"
, "__base":    "http://example.com/card#"
, "__prefixes":
  { "shuffl:": "http://purl.org/NET/Shuffl/vocab#"
  , "rdf:":    "http://www.w3.org/1999/02/22-rdf-syntax-ns#"
  }
, "rdf:type":        { "__iri": "shuffl:Card" }
, "shuffl:base-uri": { "__iri": "http://example.com/card#" }
}
```



# Nested statements #

## RDF/XML ##

```
<rdf:RDF
    xmlns:shuffl="http://purl.org/NET/Shuffl/vocab#"
    xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
    xml:base="http://example.com/card"
>
  <shuffl:Card rdf:about="#id_1">
    <shuffl:data>
      <rdf:Description>
        <shuffl:title>Card 1 title</shuffl:title>
      </rdf:Description>
    </shuffl:data>
  </shuffl:Card>
</rdf:RDF>
```

## Shuffl JSON ##

```
{ "shuffl:data":
  { "shuffl:title":   "Card 1 title"
  }
, "shuffl:uses-prefixes":
  [ { "shuffl:prefix":  "shuffl", "shuffl:uri": "http://purl.org/NET/Shuffl/vocab#" }
  , { "shuffl:prefix":  "rdf",    "shuffl:uri": "http://www.w3.org/1999/02/22-rdf-syntax-ns#" }
  ]
}
```

## JRON ##

```
{ "__iri":     "http://example.com/card#id_1"
, "__prefixes":
  { "shuffl:": "http://purl.org/NET/Shuffl/vocab#"
  , "rdf:":    "http://www.w3.org/1999/02/22-rdf-syntax-ns#"
  }
, "rdf:type":  { "__iri": "shuffl:Card" }
, "shuffl:data": 
  { "shuffl:title":   "Card 1 title"
  }
}
```



# List of literal values #

## RDF/XML ##

```
<rdf:RDF
    xmlns:shuffl="http://purl.org/NET/Shuffl/vocab#"
    xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
    xml:base="http://example.com/card"
>
  <shuffl:Card rdf:about="#id_1">
    <shuffl:data>
      <rdf:Description>
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
      </rdf:Description>
    </shuffl:data>
  </shuffl:Card>
</rdf:RDF>
```

## Shuffl JSON ##

```
{ "shuffl:data":
  { "shuffl:tags":    [ "card_1_tag", "yellowtag" ]
  }
, "shuffl:uses-prefixes":
  [ { "shuffl:prefix":  "shuffl", "shuffl:uri": "http://purl.org/NET/Shuffl/vocab#" }
  , { "shuffl:prefix":  "rdf",    "shuffl:uri": "http://www.w3.org/1999/02/22-rdf-syntax-ns#" }
  ]
}
```

## JRON ##

```
{ "__iri":     "http://example.com/card#id_1"
, "__prefixes":
  { "shuffl:": "http://purl.org/NET/Shuffl/vocab#"
  , "rdf:":    "http://www.w3.org/1999/02/22-rdf-syntax-ns#"
  }
, "rdf:type":  { "__iri": "shuffl:Card" }
, "shuffl:data": 
  { "shuffl:tags":    [ "card_1_tag", "yellowtag" ]
  }
}
```



# List of non-literal values #

## RDF/XML ##

```
<rdf:RDF
    xmlns:shuffl="http://purl.org/NET/Shuffl/vocab#"
    xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
    xml:base="http://example.com/workspace"
>
  <shuffl:Workspace rdf:about="#id_1">
    <shuffl:layout rdf:parseType="Collection">
      <rdf:Description>
        <shuffl:id>card_1</shuffl:id>
      </rdf:Description>
      <rdf:Description>
        <shuffl:id>card_2</shuffl:id>
      </rdf:Description>
    </shuffl:layout>
  </shuffl:Workspace>
</rdf:RDF>
```

## Shuffl JSON ##

```
{ "shuffl:workspace":
  { "shuffl:layout":
    [ { "shuffl:id": "card_1"
      }
    , { "shuffl:id": "card_2"
      }
    ]
  }
, "shuffl:uses-prefixes":
  [ { "shuffl:prefix":  "shuffl", "shuffl:uri": "http://purl.org/NET/Shuffl/vocab#" }
  , { "shuffl:prefix":  "rdf",    "shuffl:uri": "http://www.w3.org/1999/02/22-rdf-syntax-ns#" }
  ]
}
```

## JRON ##

```
{ "__iri":     "http://example.com/workspace#id_1"
, "__prefixes":
  { "shuffl:": "http://purl.org/NET/Shuffl/vocab#"
  , "rdf:":    "http://www.w3.org/1999/02/22-rdf-syntax-ns#"
  }
, "rdf:type":  { "__iri": "shuffl:Workspace" }
, "shuffl:workspace":
  { "shuffl:layout":
    [ { "shuffl:id": "card_1"
      }
    , { "shuffl:id": "card_2"
      }
    ]
  }
}
```


# Non-string literal values #

## RDF/XML ##

```
<rdf:RDF
    xmlns:shuffl="http://purl.org/NET/Shuffl/vocab#"
    xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
    xml:base="http://example.com/workspace"
>
  <shuffl:Workspace rdf:about="#id_1">
    <shuffl:layout rdf:parseType="Collection">
      <rdf:Description>
        <shuffl:pos>
          <rdf:Description>
            <shuffl:left rdf:datatype="http://www.w3.org/2001/XMLSchema#integer">100</shuffl:left>
            <shuffl:top rdf:datatype="http://www.w3.org/2001/XMLSchema#integer">30</shuffl:top>
          </rdf:Description>
        </shuffl:pos>
      </rdf:Description>
      <rdf:Description>
        <shuffl:zindex rdf:datatype="http://www.w3.org/2001/XMLSchema#integer">11</shuffl:zindex>
      </rdf:Description>
    </shuffl:layout>
  </shuffl:Workspace>
</rdf:RDF>
```

## Shuffl JSON ##

```
{ "shuffl:workspace":
  , "shuffl:layout":
    [ { "pos": 
        { "left": 100
        , "top": 30
        } 
      }
    , { "zindex": 11
      }
    ]
, "shuffl:uses-prefixes":
  [ { "shuffl:prefix":  "shuffl", "shuffl:uri": "http://purl.org/NET/Shuffl/vocab#" }
  , { "shuffl:prefix":  "rdf",    "shuffl:uri": "http://www.w3.org/1999/02/22-rdf-syntax-ns#" }
  ]
}
```

## JRON ##

```
{ "__iri":     "http://example.com/workspace#id_1"
, "__prefixes":
  { "shuffl:": "http://purl.org/NET/Shuffl/vocab#"
  , "rdf:":    "http://www.w3.org/1999/02/22-rdf-syntax-ns#"
  , "xsd:":    "http://www.w3.org/2001/XMLSchema#"
  , ":":       "http://purl.org/NET/Shuffl/default#"
  }
, "rdf:type":  { "__iri": "shuffl:Workspace" }
, "shuffl:workspace":
  { "shuffl:layout":
    [ { ":pos": 
        { ":left": 
          { "__repr": "100"
          , "__type": "xsd:integer"
          }
        , ":top":
          { "__repr": "30"
          , "__type": "xsd:integer"
          }
        } 
      }
    , { ":zindex":
        { "__repr": "11"
        , "__type": "xsd:integer"
        }
      }
    ]
  }
}
```



# Full Shuffl card #

## RDF/XML ##

```
<rdf:RDF
    xmlns:shuffl="http://purl.org/NET/Shuffl/vocab#"
    xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
    xmlns:rdfs="http://www.w3.org/2000/01/rdf-schema#"
    xmlns:owl="http://www.w3.org/2002/07/owl#"
    xmlns:xsd="http://www.w3.org/2001/XMLSchema#"
    xml:base="http://example.com/card"
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

## Shuffl JSON ##

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

## JRON ##

```
{ "__iri":     "http://example.com/card#id_1"
, "__prefixes":
  { "shuffl:": "http://purl.org/NET/Shuffl/vocab#"
  , "rdf:":    "http://www.w3.org/1999/02/22-rdf-syntax-ns#"
  , "rdfs:",   "http://www.w3.org/2000/01/rdf-schema#"
  , "owl:",    "http://www.w3.org/2002/07/owl#"
  , "xsd:",    "http://www.w3.org/2001/XMLSchema#"
  }
, "rdf:type":  { "__iri": "shuffl:Card" }
, "shuffl:id":        "id_1"
, "shuffl:type":      "shuffl-freetext-yellow"
, "shuffl:version":   "0.1"
, "shuffl:base-uri":  "#"
, "shuffl:data":
  { "shuffl:title":   "Card 1 title"
  , "shuffl:tags":    [ "card_1_tag", "yellowtag" ]
  , "shuffl:text":    "Card 1 free-form text here<br/>line 2<br/>line3<br/>yellow"
  }
}
```


# Full Shuffl workspace description #

## RDF/XML ##

```
<rdf:RDF
    xmlns:shuffl="http://purl.org/NET/Shuffl/vocab#"
    xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
    xmlns:rdfs="http://www.w3.org/2000/01/rdf-schema#"
    xmlns:owl="http://www.w3.org/2002/07/owl#"
    xmlns:xsd="http://www.w3.org/2001/XMLSchema#"
    xml:base="http://example.com/workspace"
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
            <shuffl:left rdf:datatype="http://www.w3.org/2001/XMLSchema#integer">100</shuffl:left>
            <shuffl:top rdf:datatype="http://www.w3.org/2001/XMLSchema#integer">30</shuffl:top>
          </rdf:Description>
        </shuffl:pos>
      </rdf:Description>
      <rdf:Description>
        <shuffl:id>card_2</shuffl:id>
        <shuffl:type>shuffl-freetext-blue</shuffl:type>
        <shuffl:data rdf:resource="test-shuffl-card_2.rdf" />
        <shuffl:pos>
          <rdf:Description>
            <shuffl:left rdf:datatype="http://www.w3.org/2001/XMLSchema#integer">400</shuffl:left>
            <shuffl:top rdf:datatype="http://www.w3.org/2001/XMLSchema#integer">0</shuffl:top>
          </rdf:Description>
        </shuffl:pos>
        <shuffl:size>
          <rdf:Description>
            <shuffl:width rdf:datatype="http://www.w3.org/2001/XMLSchema#integer">600</shuffl:width>
            <shuffl:height rdf:datatype="http://www.w3.org/2001/XMLSchema#integer">400</shuffl:height>
          </rdf:Description>
        </shuffl:size>
        <shuffl:zindex rdf:datatype="http://www.w3.org/2001/XMLSchema#integer">11</shuffl:zindex>
      </rdf:Description>
    </shuffl:layout>
  </shuffl:Workspace>
</rdf:RDF>
```

## Shuffl JSON ##

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
    [ { "id": "card_1"
      , "type": "shuffl-freetext-yellow"
      , "data": "test-shuffl-card_1.json"
      , "pos": 
        { "left": 100
        , "top": 30
        } 
      }
    , { "id": "card_2"
      , "type": "shuffl-freetext-blue"
      ,   "data": "test-shuffl-card_2.json"
      , "pos":
        { "top": 0
        , "left": 400
        }
      , "size":
        { "width": 600
        , "height": 400
        }
      , "zindex": 11
      }
    ]
  }
}
```

## JRON ##

```
{ "__iri":     "http://example.com/workspace#id_1"
, "__prefixes":
  { "shuffl:": "http://purl.org/NET/Shuffl/vocab#"
  , "rdf:":    "http://www.w3.org/1999/02/22-rdf-syntax-ns#"
  , "rdfs:",   "http://www.w3.org/2000/01/rdf-schema#"
  , "owl:",    "http://www.w3.org/2002/07/owl#"
  , "xsd:",    "http://www.w3.org/2001/XMLSchema#"
  , ":":       "http://purl.org/NET/Shuffl/default#"
  }
, "rdf:type":  { "__iri": "shuffl:Workspace" }
, "shuffl:id":        "test-shuffl-workspace"
, "shuffl:class":     "shuffl:Workspace"
, "shuffl:version":   "0.1"
, "shuffl:base-uri":  "#"
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
    [ { "id": "card_1"
      , "type": "shuffl-freetext-yellow"
      , "data": "test-shuffl-card_1.json"
      , ":pos": 
        { "left": 
          { "__repr": "100"
          , "__type": "xsd:integer"
          }
        , ":top":
          { "__repr": "30"
          , "__type": "xsd:integer"
          }
        } 
      }
    , { ":id": "card_2"
      , ":type": "shuffl-freetext-blue"
      , ":data": "test-shuffl-card_2.json"
      , ":pos":
        { ":top":
          { "__repr": "0"
          , "__type": "xsd:integer"
          }
        , ":left":
          { "__repr": "400"
          , "__type": "xsd:integer"
          }
        }
      , ":size":
        { ":width":
          { "__repr": "600"
          , "__type": "xsd:integer"
          }
        , ":height":
          { "__repr": "400"
          , "__type": "xsd:integer"
          }
        }
      , ":zindex":
        { "__repr": "11"
        , "__type": "xsd:integer"
        }
      }
    ]
  }
}
```