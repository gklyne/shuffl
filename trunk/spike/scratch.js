{ "__iri": "http://example.com/card#id_1"
, "__base": "http://example.com/cardzzz#"
, "__prefixes": { "shuffl:": "http://purl.org/NET/Shuffl/vocab#", "rdf:": "http://www.w3.org/1999/02/22-rdf-syntax-ns#" }
, "rdf:type": { "__iri": "shuffl:Card" }, "shuffl:base-uri": { "__iri": "http://example.com/card#" } 
}
______ result: 
{ "__base": "http://example.com/card#"
, "__prefixes": { "rdf:": "http://www.w3.org/1999/02/22-rdf-syntax-ns#", "shuffl:": "http://purl.org/NET/Shuffl/vocab#" }
, "__iri": "http://example.com/card#id_1"
, "rdf:type": { "__iri": "shuffl:Card" }
, "shuffl:base-uri": { "__iri": "http://example.com/card#" } 
}