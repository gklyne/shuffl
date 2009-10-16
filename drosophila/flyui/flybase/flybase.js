/**
 * @fileoverview
 * This script defines utilities for interacting with data from flybase.
 * @author <a href="http://purl.org/net/aliman">Alistair Miles</a>
 * @version $Revision:538 $ on $Date: 2008-08-27 09:08:41 +0100 (Wed, 27 Aug 2008) $ by $Author: aliman $
 * @requires flyui.util
 * @requires YAHOO.util.Connect
 * TODO license terms
 */


// create a namespace if not already defined
flyui.namespace("flyui.flybase");




//flyui.flybase.provenance = "<a href='ftp://flybase.net/releases/FB2009_02/psql/'>FB2009_02</a>";
flyui.flybase.provenance = "FB2009_02";





/**
 * Create a service object.
 * @class
 * A wrapper for a flybase SPARQL endpoint.
 * @extends flyui.sparql.Service
 * @constructor 
 * @param {String} endpointURL the location of the flybase SPARQL endpoint
 */
flyui.flybase.Service = function( endpointURL ) {
	
	/**
	 * @private
	 */
	this._endpoint = endpointURL;
	
};


// extend
flyui.flybase.Service.prototype = new flyui.sparql.Service();


/**
 * Find genes by any name (case insensitive), for example "FBgn123456", "CG1234", "aly".
 * @param {String} anyName the gene name to search by
 * @param {Function} success the success case callback function, which must accept an array of Gene objects
 * @param {Function} failure the failure case callback function, which must accept a YUI HTTP response object
 */
flyui.flybase.Service.prototype.findGenesByAnyName = function( anyName, success, failure ) {
	var _context = "flyui.flybase.Service.prototype.findGenesByAnyName";
	try {
        flyui.info("request: "+anyName, _context);
        var chain = flyui.chain(flyui.flybase.Service.responseToGenes, success);
        var query = flyui.flybase.Service._buildQueryForFindGenesByAnyName(anyName);
        this.postQuery(query, chain, failure);    
    } catch (error) {
        flyui.debug("wrap and rethrow error to get a stack trace", _context);
        throw new flyui.UnexpectedException(_context, error);
    }    
};


/**
 * @param {Object} response
 * @type Array<flyui.flybase.Gene>
 * @private
 * @static
 */
flyui.flybase.Service.responseToGenes = function( response ) {
    var _context = "flyui.flybase.Service.responseToGenes";
    try {
        flyui.debug("response status: "+response.status, _context);
        
        flyui.debug("try parsing response text as json", _context);
        flyui.debug("parsing response: "+response.responseText, _context);
        var resultSet = YAHOO.lang.JSON.parse(response.responseText);
        
        flyui.debug("convert result set to an array of genes", _context);
        var genes = flyui.flybase.Gene.newInstancesFromSPARQLResults(resultSet);
        
        return genes;
    } catch (error) {
        flyui.debug("wrap and rethrow error to get a stack trace", _context);
        throw new flyui.UnexpectedException(_context, error);
    }    
};


/**
 * @param {Object} response
 * @type Array<flyui.flybase.Gene>
 * @private
 * @static
 */
flyui.flybase.Service.responseToGenesByMultiNamesMap = function( map ) {
    var _context = "flyui.flybase.Service.responseToGenesByMultiNamesMap";
    return function( response ) {
        try {
            flyui.debug("response status: "+response.status, _context);
            
            flyui.debug("try parsing response text as json", _context);
            flyui.debug("parsing response: "+response.responseText, _context);
            var resultSet = YAHOO.lang.JSON.parse(response.responseText);
            
            flyui.debug("convert result set to a map of names to gene arrays", _context);
    //        var genes = flyui.flybase.Gene.newInstancesFromSPARQLResults(resultSet);
    
            var bindings = resultSet.results.bindings;
            var pool = new flyui.flybase.GenePool();
    
            for (var i=0; i<bindings.length; i++) {
                
                var flybaseID = bindings[i].flybaseID.value;
                var gene = pool.get(flybaseID);
                if (bindings[i].symbol) {
                    gene.addSymbol(bindings[i].symbol.value);
                }
                if (bindings[i].annotationSymbol) {
                    gene.addAnnotationSymbol(bindings[i].annotationSymbol.value);
                }
                if (bindings[i].fullName) {
                    gene.addFullName(bindings[i].fullName.value);
                }
                if (bindings[i].synonym) {
                    gene.addSynonym(bindings[i].synonym.value);
                }
    
                var _label = bindings[i]["label"].value; 
                
                flyui.util.appendIfNotMember(map[_label], gene);
                
            }
            
            flyui.debug("return map", _context);
            return map;
        } catch (error) {
            flyui.debug("wrap and rethrow error to get a stack trace", _context);
            throw new flyui.UnexpectedException(_context, error);
        }    
    }
};


flyui.flybase.Service.prototype.findGenesByAnyNameBatch = function( names, success, failure ) {
    var _context = "flyui.flybase.Service.prototype.findGenesByAnyNameBatch";
    try {
        flyui.info("request: "+names.join(", "), _context);
        if (names.length == 0) {
            success({});
        } else {
            var map = {};
            for (var i=0; i<names.length; i++) {
                map[names[i]] = [];
            }
            var chain = flyui.chain(flyui.flybase.Service.responseToGenesByMultiNamesMap(map), success);
            var query = flyui.flybase.Service._buildQueryForFindGenesByAnyNameBatch(names);
            flyui.info("initiate sparql query", _context);
            this.postQuery(query, chain, failure);  
        }
    } catch (error) {
        flyui.debug("wrap and rethrow error to get a stack trace", _context);
        throw new flyui.UnexpectedException(_context, error);
    }    
    
}

/**
 * Build a SPARQL query to retrieve genes by any name.
 * @param {String} anyName the gene name to search by
 * @return a SPARQL query
 * @type String
 * @private
 * @static
 */
flyui.flybase.Service._buildQueryForFindGenesByAnyName = function( anyName ) {
    var _context = "flyui.flybase.Service._buildQueryForFindGenesByAnyName";
    try {

        var prefixes =  "PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>\n" +
                        "PREFIX chado: <http://purl.org/net/chado/schema/>\n" +
                        "PREFIX skos: <http://www.w3.org/2004/02/skos/core#>\n" +
                        "PREFIX so: <http://purl.org/obo/owl/SO#>\n" +
                        "PREFIX syntype: <http://purl.org/net/flybase/synonym-types/>\n";

        var body =      "SELECT DISTINCT ?flybaseID ?symbol ?annotationSymbol ?fullName WHERE {\n" +
                        "  ?feature skos:altLabel \""+anyName+"\" ;\n" +
                        "    a so:SO_0000704 ;\n" +
                        "    chado:organism <http://openflydata.org/id/flybase/organism/Drosophila_melanogaster> ;\n" +
                        "    chado:uniquename ?flybaseID ;\n" +
                        "    chado:name ?symbol ;\n" +
                        "    chado:feature_dbxref [\n" +
                        "      chado:accession ?annotationSymbol ;\n" +
                        "      chado:db <http://openflydata.org/id/flybase/db/FlyBase_Annotation_IDs>\n" +
                        "    ] .\n" +
                        "  OPTIONAL {\n" +
                        "    ?fs\n" +
                        "      chado:feature ?feature ;\n" +
                        "      chado:is_current \"true\"^^xsd:boolean ;\n" +
                        "      chado:synonym [\n" +
                        "        a syntype:FullName ;\n" +
                        "        chado:name ?fullName ;\n" +
                        "      ] ;\n" +
                        "    a chado:Feature_Synonym .\n" +
                        "  }\n" +
                        "  FILTER (regex(str(?annotationSymbol), \"^CG[0-9]*$\"))\n" +
                        "}" ;

        var query = prefixes + body;
    
        return query;
    } catch (error) {
        flyui.debug("wrap and rethrow error to get a stack trace", _context);
        throw new flyui.UnexpectedException(_context, error);
    }    

};


flyui.flybase.Service._buildQueryForFindGenesByAnyNameBatch = function( names ) {
    var _context = "flyui.flybase.Service._buildQueryForFindGenesByAnyName";
    try {

        var prefixes =      "PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>\n" +
                            "PREFIX chado: <http://purl.org/net/chado/schema/>\n" +
                            "PREFIX skos: <http://www.w3.org/2004/02/skos/core#>\n" +
                            "PREFIX so: <http://purl.org/obo/owl/SO#>\n" +
                            "PREFIX syntype: <http://purl.org/net/flybase/synonym-types/>\n";

        var body_open =     "SELECT DISTINCT ?label ?flybaseID ?symbol ?annotationSymbol ?fullName WHERE {\n";
        
        var body_union   =  "  {\n" +
                            "    {\n" +
                            "      LET (?label := \""+names[0]+"\")\n" +
                            "      ?feature skos:altLabel ?label .\n" +
                            "    }\n";
                            
        for (var i=1; i<names.length; i++) {
            body_union +=   "    UNION\n" + 
                            "    {\n" +
                            "      LET (?label := \""+names[i]+"\")\n" +
                            "      ?feature skos:altLabel ?label .\n" +
                            "    }\n";
        }

        body_union   +=     "  }\n";
                            
        var body_proper =   "  {\n" +
                            "    ?feature\n" +
                            "      a so:SO_0000704 ;\n" +
                            "      chado:organism <http://openflydata.org/id/flybase/organism/Drosophila_melanogaster> ;\n" +
                            "      chado:uniquename ?flybaseID ;\n" +
                            "      chado:name ?symbol ;\n" +
                            "      chado:feature_dbxref [\n" +
                            "        chado:accession ?annotationSymbol ;\n" +
                            "        chado:db <http://openflydata.org/id/flybase/db/FlyBase_Annotation_IDs>\n" +
                            "      ] .\n" +
                            "    OPTIONAL {\n" +
                            "      ?fs\n" +
                            "        chado:feature ?feature ;\n" +
                            "        chado:is_current \"true\"^^xsd:boolean ;\n" +
                            "        chado:synonym [\n" +
                            "          a syntype:FullName ;\n" +
                            "          chado:name ?fullName ;\n" +
                            "        ] ;\n" +
                            "      a chado:Feature_Synonym .\n" +
                            "    }\n" +
                            "    FILTER (regex(str(?annotationSymbol), \"^CG[0-9]*$\"))\n" +
                            "  }\n";

        var body_close =    "}" ;

        var query = prefixes + body_open + body_union + body_proper + body_close;
    
        return query;
    } catch (error) {
        flyui.debug("wrap and rethrow error to get a stack trace", _context);
        throw new flyui.UnexpectedException(_context, error);
    }    

    
};


/**
 * Construct a new gene object.
 * @class
 * A Gene object.
 * @constructor
 */
flyui.flybase.Gene = function() {
	
	var that = this;

	/**
	 * @type String
	 */
	this.flybaseID = null;
	
	/**
	 * @type Array
	 */
	this.symbols = new Array();

	/**
	 * @type Array
	 */
	this.annotationSymbols = new Array();

	/**
	 * @type Array
	 */
	this.fullNames = new Array();

//	/**
//	 * @type Array
//	 */
//	this.synonyms = new Array();

	/** 
	 * Add a symbol for this gene.
	 * @param {String} symbol e.g. "TODO"
	 */
	this.addSymbol = function( symbol ) {
		flyui.util.appendIfNotMember(that.symbols, symbol);
	};

	/** 
	 * Add an annotation symbol for this gene.
	 * @param {String} annotationSymbol e.g. "TODO"
	 */
	this.addAnnotationSymbol = function( annotationSymbol ) {
		flyui.util.appendIfNotMember(that.annotationSymbols, annotationSymbol);
	};


	/** 
	 * Add a full name for this gene.
	 * @param {String} fullName e.g. "TODO"
	 */
	this.addFullName = function( fullName ) {
		flyui.util.appendIfNotMember(that.fullNames, fullName);
	};


//	/** 
//	 * Add a synonym for this gene.
//	 * @param {String} synonym e.g. "TODO"
//	 */
//	this.addSynonym = function( synonym ) {
//		flyui.util.appendIfNotMember(that.synonyms, synonym);
//	};
//
};


/**
 * Create an array of gene objects from a SPARQL result set obejct.
 * @param {Object} resultSet a SPARQL result set
 * @return an array of Gene objects
 * @type Array
 */
flyui.flybase.Gene.newInstancesFromSPARQLResults = function( resultSet ) {
    var _context = "flyui.flybase.Gene.newInstancesFromSPARQLResults";
    try {
        var pool = new flyui.flybase.GenePool();
    
        var bindings = resultSet.results.bindings;
        for (var i in bindings) {
            var flybaseID = bindings[i].flybaseID.value;
            var gene = pool.get(flybaseID);
            if (bindings[i].symbol) {
                gene.addSymbol(bindings[i].symbol.value);
            }
            if (bindings[i].annotationSymbol) {
                gene.addAnnotationSymbol(bindings[i].annotationSymbol.value);
            }
            if (bindings[i].fullName) {
                gene.addFullName(bindings[i].fullName.value);
            }
//            if (bindings[i].synonym) {
//                gene.addSynonym(bindings[i].synonym.value);
//            }
        }
    
        return pool.toArray();
    } catch (error) {
        flyui.debug("wrap and rethrow error to get a stack trace", _context);
        throw new flyui.UnexpectedException(_context, error);
    }    
};


/**
 * Create a pool of gene objects.
 * @class
 * A pool of gene objects.
 * @constructor
 */
flyui.flybase.GenePool = function() {
	
	/**
	 * @private
	 */
	this._pool = new Object();

};


/**
 * Get a gene from the pool, or create a new one if it doesn't exist.
 * @param {String} flybaseID 
 * @return a flyui.flybase.Gene object
 */
flyui.flybase.GenePool.prototype.get = function( flybaseID ) {
    var _context = "flyui.flybase.GenePool.prototype.get";
    try {
        var gene = this._pool[flybaseID];
        
        if ( typeof gene == "undefined" || !gene ) {
            gene = new flyui.flybase.Gene();
            gene.flybaseID = flybaseID;
            this._pool[flybaseID] = gene;   
        }
        
        return gene;
    
    } catch (error) {
        flyui.debug("wrap and rethrow error to get a stack trace", _context);
        throw new flyui.UnexpectedException(_context, error);
    }    	
};


flyui.flybase.GenePool.prototype.toArray = function() {
    var _context = "flyui.flybase.GenePool.prototype.toArray";
    try {
        var array = new Array();
        for (var key in this._pool) {
            array[array.length] = this._pool[key];
        }
        function genesort(x,y) {
            if (x.symbols[0] > y.symbols[0]) return 1;
            else return -1;
        }
        array.sort(genesort);
        return array;
    } catch (error) {
        flyui.debug("wrap and rethrow error to get a stack trace", _context);
        throw new flyui.UnexpectedException(_context, error);
    }    
}




