/**
 * @fileoverview
 * This script defines tests for the flyui.flybase module.
 * @requires YAHOO.log
 * @requires YAHOO.util.Assert
 * @requires YAHOO.tool.TestCase
 * @requires YAHOO.tool.TestRunner
 * @requires flyui.util
 * @author <a href="http://purl.org/net/aliman">Alistair Miles</a>
 * @version $Revision:538 $
 * TODO license terms
 */
 
  
// Shortcuts
var trace = function(message) { YAHOO.log(message, "test"); };
var assert = YAHOO.util.Assert;


// ************************************************************
// TEST DATA
// ************************************************************


/**
 * Container for some gene test data.
 */
flyui.flybase.TestData = function() {
	
	this.FBgn0004372 = new flyui.flybase.Gene();
	this.FBgn0004372.flybaseID = "FBgn0004372";
	this.FBgn0004372.symbols = ["aly"];
	this.FBgn0004372.annotationSymbols = ["CG2075"];
	this.FBgn0004372.fullNames = ["always early"];
//	this.FBgn0004372.synonyms = ["aly", "Aly", "CG2075", "143450_at", "ms(3)2", "ms(3)ry2", "always early"];	
	
    this.FBgn0010774 = new flyui.flybase.Gene();
    this.FBgn0010774.flybaseID = "FBgn0010774";
    this.FBgn0010774.symbols = ["Aly"];
    this.FBgn0010774.annotationSymbols = ["CG1101"];
    this.FBgn0010774.fullNames = ["Aly"];
    
    this.FBgn0036925 = new flyui.flybase.Gene();
    this.FBgn0036925.flybaseID = "FBgn0036925";
    this.FBgn0036925.symbols = ["schuy"];
    this.FBgn0036925.annotationSymbols = ["CG17736"];
    this.FBgn0036925.fullNames = ["schumacher-levy"];
    
	this.FBgn0015799 = new flyui.flybase.Gene();	
	this.FBgn0015799.flybaseID = "FBgn0015799";
	this.FBgn0015799.symbols = ["Rbf"]; 
	this.FBgn0015799.annotationSymbols = ["CG7413"]; 
	this.FBgn0015799.fullNames = ["Retinoblastoma-family protein"]; 
//	this.FBgn0015799.synonyms = []; // TODO populate for more testing?
	
	
	this.FBgn0004903 = new flyui.flybase.Gene();
	this.FBgn0004903.flybaseID = "FBgn0004903";
	this.FBgn0004903.symbols = ["Rb97D"]; 
	this.FBgn0004903.annotationSymbols = ["CG6354"]; 
	this.FBgn0004903.fullNames = ["Ribonuclear protein at 97D"]; 
//	this.FBgn0004903.synonyms = []; // TODO populate for more testing?

	/**
	 * 	SPARQL result set missing an (optional) full name
	 */
	this.resultSet_missingOptionals = {
		"head": {
			"vars": [ "gene" , "flybaseID" , "symbol" , "annotationSymbol" , "fullName" , "synonym" ]
		} ,
		"results": {
			"bindings": [
				{
					"gene": { "type": "uri" , "value": "http://rodos.zoo.ox.ac.uk/2008/flyweb/id/flybase/FBgn0004372" } ,
					"flybaseID": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "FBgn0004372" } 
				} 
			]
		}
	};
	
	/**
	 * 	SPARQL result set defining a single gene FBgn0004372 (aly)
	 */
	this.resultSet_aly = {
		"head": {
			"vars": [ "gene" , "flybaseID" , "symbol" , "annotationSymbol" , "fullName" , "synonym" ]
		} ,
		"results": {
			"bindings": [
				{
					"gene": { "type": "uri" , "value": "http://rodos.zoo.ox.ac.uk/2008/flyweb/id/flybase/FBgn0004372" } ,
					"flybaseID": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "FBgn0004372" } ,
					"symbol": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "aly" } ,
					"annotationSymbol": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "CG2075" } ,
					"fullName": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "always early" } ,
					"synonym": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "always early" }
				} ,
				{
					"gene": { "type": "uri" , "value": "http://rodos.zoo.ox.ac.uk/2008/flyweb/id/flybase/FBgn0004372" } ,
					"flybaseID": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "FBgn0004372" } ,
					"symbol": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "aly" } ,
					"annotationSymbol": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "CG2075" } ,
					"fullName": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "always early" } ,
					"synonym": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "aly" }
				} ,
				{
					"gene": { "type": "uri" , "value": "http://rodos.zoo.ox.ac.uk/2008/flyweb/id/flybase/FBgn0004372" } ,
					"flybaseID": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "FBgn0004372" } ,
					"symbol": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "aly" } ,
					"annotationSymbol": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "CG2075" } ,
					"fullName": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "always early" } ,
					"synonym": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "ms(3)2" }
				} ,
				{
					"gene": { "type": "uri" , "value": "http://rodos.zoo.ox.ac.uk/2008/flyweb/id/flybase/FBgn0004372" } ,
					"flybaseID": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "FBgn0004372" } ,
					"symbol": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "aly" } ,
					"annotationSymbol": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "CG2075" } ,
					"fullName": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "always early" } ,
					"synonym": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "ms(3)ry2" }
				} ,
				{
					"gene": { "type": "uri" , "value": "http://rodos.zoo.ox.ac.uk/2008/flyweb/id/flybase/FBgn0004372" } ,
					"flybaseID": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "FBgn0004372" } ,
					"symbol": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "aly" } ,
					"annotationSymbol": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "CG2075" } ,
					"fullName": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "always early" } ,
					"synonym": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "Aly" }
				} ,
				{
					"gene": { "type": "uri" , "value": "http://rodos.zoo.ox.ac.uk/2008/flyweb/id/flybase/FBgn0004372" } ,
					"flybaseID": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "FBgn0004372" } ,
					"symbol": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "aly" } ,
					"annotationSymbol": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "CG2075" } ,
					"fullName": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "always early" } ,
					"synonym": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "143450_at" }
				} ,
				{
					"gene": { "type": "uri" , "value": "http://rodos.zoo.ox.ac.uk/2008/flyweb/id/flybase/FBgn0004372" } ,
					"flybaseID": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "FBgn0004372" } ,
					"symbol": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "aly" } ,
					"annotationSymbol": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "CG2075" } ,
					"fullName": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "always early" } ,
					"synonym": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "CG2075" }
				}
			]
		}
	};
	
	/**
	 * 	SPARQL result set defining two genes both named "rbf"
	 */	
	this.resultSet_rbf = {
	  "head": {
	    "vars": [ "gene" , "flybaseID" , "symbol" , "annotationSymbol" , "fullName" , "synonym" ]
	  } ,
	  "results": {
	    "bindings": [
	      {
	        "gene": { "type": "uri" , "value": "http://rodos.zoo.ox.ac.uk/2008/flyweb/id/flybase/FBgn0015799" } ,
	        "flybaseID": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "FBgn0015799" } ,
	        "symbol": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "Rbf" } ,
	        "annotationSymbol": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "CG7413" } ,
	        "fullName": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "Retinoblastoma-family protein" } ,
	        "synonym": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "RBF1" }
	      } ,
	      {
	        "gene": { "type": "uri" , "value": "http://rodos.zoo.ox.ac.uk/2008/flyweb/id/flybase/FBgn0015799" } ,
	        "flybaseID": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "FBgn0015799" } ,
	        "symbol": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "Rbf" } ,
	        "annotationSymbol": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "CG7413" } ,
	        "fullName": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "Retinoblastoma-family protein" } ,
	        "synonym": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "RBF" }
	      } ,
	      {
	        "gene": { "type": "uri" , "value": "http://rodos.zoo.ox.ac.uk/2008/flyweb/id/flybase/FBgn0015799" } ,
	        "flybaseID": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "FBgn0015799" } ,
	        "symbol": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "Rbf" } ,
	        "annotationSymbol": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "CG7413" } ,
	        "fullName": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "Retinoblastoma-family protein" } ,
	        "synonym": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "Rbf" }
	      } ,
	      {
	        "gene": { "type": "uri" , "value": "http://rodos.zoo.ox.ac.uk/2008/flyweb/id/flybase/FBgn0015799" } ,
	        "flybaseID": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "FBgn0015799" } ,
	        "symbol": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "Rbf" } ,
	        "annotationSymbol": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "CG7413" } ,
	        "fullName": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "Retinoblastoma-family protein" } ,
	        "synonym": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "rbf1" }
	      } ,
	      {
	        "gene": { "type": "uri" , "value": "http://rodos.zoo.ox.ac.uk/2008/flyweb/id/flybase/FBgn0015799" } ,
	        "flybaseID": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "FBgn0015799" } ,
	        "symbol": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "Rbf" } ,
	        "annotationSymbol": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "CG7413" } ,
	        "fullName": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "Retinoblastoma-family protein" } ,
	        "synonym": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "rb" }
	      } ,
	      {
	        "gene": { "type": "uri" , "value": "http://rodos.zoo.ox.ac.uk/2008/flyweb/id/flybase/FBgn0015799" } ,
	        "flybaseID": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "FBgn0015799" } ,
	        "symbol": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "Rbf" } ,
	        "annotationSymbol": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "CG7413" } ,
	        "fullName": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "Retinoblastoma-family protein" } ,
	        "synonym": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "pRb" }
	      } ,
	      {
	        "gene": { "type": "uri" , "value": "http://rodos.zoo.ox.ac.uk/2008/flyweb/id/flybase/FBgn0015799" } ,
	        "flybaseID": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "FBgn0015799" } ,
	        "symbol": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "Rbf" } ,
	        "annotationSymbol": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "CG7413" } ,
	        "fullName": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "Retinoblastoma-family protein" } ,
	        "synonym": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "CG7413" }
	      } ,
	      {
	        "gene": { "type": "uri" , "value": "http://rodos.zoo.ox.ac.uk/2008/flyweb/id/flybase/FBgn0015799" } ,
	        "flybaseID": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "FBgn0015799" } ,
	        "symbol": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "Rbf" } ,
	        "annotationSymbol": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "CG7413" } ,
	        "fullName": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "Retinoblastoma-family protein" } ,
	        "synonym": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "rbf" }
	      } ,
	      {
	        "gene": { "type": "uri" , "value": "http://rodos.zoo.ox.ac.uk/2008/flyweb/id/flybase/FBgn0015799" } ,
	        "flybaseID": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "FBgn0015799" } ,
	        "symbol": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "Rbf" } ,
	        "annotationSymbol": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "CG7413" } ,
	        "fullName": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "Retinoblastoma-family protein" } ,
	        "synonym": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "dRBF" }
	      } ,
	      {
	        "gene": { "type": "uri" , "value": "http://rodos.zoo.ox.ac.uk/2008/flyweb/id/flybase/FBgn0015799" } ,
	        "flybaseID": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "FBgn0015799" } ,
	        "symbol": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "Rbf" } ,
	        "annotationSymbol": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "CG7413" } ,
	        "fullName": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "Retinoblastoma-family protein" } ,
	        "synonym": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "EG:34F3.3" }
	      } ,
	      {
	        "gene": { "type": "uri" , "value": "http://rodos.zoo.ox.ac.uk/2008/flyweb/id/flybase/FBgn0015799" } ,
	        "flybaseID": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "FBgn0015799" } ,
	        "symbol": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "Rbf" } ,
	        "annotationSymbol": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "CG7413" } ,
	        "fullName": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "Retinoblastoma-family protein" } ,
	        "synonym": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "Retinoblastoma-family protein" }
	      } ,
	      {
	        "gene": { "type": "uri" , "value": "http://rodos.zoo.ox.ac.uk/2008/flyweb/id/flybase/FBgn0015799" } ,
	        "flybaseID": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "FBgn0015799" } ,
	        "symbol": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "Rbf" } ,
	        "annotationSymbol": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "CG7413" } ,
	        "fullName": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "Retinoblastoma-family protein" } ,
	        "synonym": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "retinoblastoma" }
	      } ,
	      {
	        "gene": { "type": "uri" , "value": "http://rodos.zoo.ox.ac.uk/2008/flyweb/id/flybase/FBgn0015799" } ,
	        "flybaseID": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "FBgn0015799" } ,
	        "symbol": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "Rbf" } ,
	        "annotationSymbol": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "CG7413" } ,
	        "fullName": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "Retinoblastoma-family protein" } ,
	        "synonym": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "RbF" }
	      } ,
	      {
	        "gene": { "type": "uri" , "value": "http://rodos.zoo.ox.ac.uk/2008/flyweb/id/flybase/FBgn0015799" } ,
	        "flybaseID": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "FBgn0015799" } ,
	        "symbol": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "Rbf" } ,
	        "annotationSymbol": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "CG7413" } ,
	        "fullName": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "Retinoblastoma-family protein" } ,
	        "synonym": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "FBF" }
	      } ,
	      {
	        "gene": { "type": "uri" , "value": "http://rodos.zoo.ox.ac.uk/2008/flyweb/id/flybase/FBgn0015799" } ,
	        "flybaseID": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "FBgn0015799" } ,
	        "symbol": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "Rbf" } ,
	        "annotationSymbol": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "CG7413" } ,
	        "fullName": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "Retinoblastoma-family protein" } ,
	        "synonym": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "Rbf1" }
	      } ,
	      {
	        "gene": { "type": "uri" , "value": "http://rodos.zoo.ox.ac.uk/2008/flyweb/id/flybase/FBgn0015799" } ,
	        "flybaseID": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "FBgn0015799" } ,
	        "symbol": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "Rbf" } ,
	        "annotationSymbol": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "CG7413" } ,
	        "fullName": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "Retinoblastoma-family protein" } ,
	        "synonym": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "Rb" }
	      } ,
	      {
	        "gene": { "type": "uri" , "value": "http://rodos.zoo.ox.ac.uk/2008/flyweb/id/flybase/FBgn0015799" } ,
	        "flybaseID": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "FBgn0015799" } ,
	        "symbol": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "Rbf" } ,
	        "annotationSymbol": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "CG7413" } ,
	        "fullName": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "Retinoblastoma-family protein" } ,
	        "synonym": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "Rb1" }
	      } ,
	      {
	        "gene": { "type": "uri" , "value": "http://rodos.zoo.ox.ac.uk/2008/flyweb/id/flybase/FBgn0015799" } ,
	        "flybaseID": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "FBgn0015799" } ,
	        "symbol": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "Rbf" } ,
	        "annotationSymbol": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "CG7413" } ,
	        "fullName": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "retinoblastoma" } ,
	        "synonym": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "RBF1" }
	      } ,
	      {
	        "gene": { "type": "uri" , "value": "http://rodos.zoo.ox.ac.uk/2008/flyweb/id/flybase/FBgn0015799" } ,
	        "flybaseID": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "FBgn0015799" } ,
	        "symbol": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "Rbf" } ,
	        "annotationSymbol": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "CG7413" } ,
	        "fullName": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "retinoblastoma" } ,
	        "synonym": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "RBF" }
	      } ,
	      {
	        "gene": { "type": "uri" , "value": "http://rodos.zoo.ox.ac.uk/2008/flyweb/id/flybase/FBgn0015799" } ,
	        "flybaseID": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "FBgn0015799" } ,
	        "symbol": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "Rbf" } ,
	        "annotationSymbol": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "CG7413" } ,
	        "fullName": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "retinoblastoma" } ,
	        "synonym": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "Rbf" }
	      } ,
	      {
	        "gene": { "type": "uri" , "value": "http://rodos.zoo.ox.ac.uk/2008/flyweb/id/flybase/FBgn0015799" } ,
	        "flybaseID": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "FBgn0015799" } ,
	        "symbol": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "Rbf" } ,
	        "annotationSymbol": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "CG7413" } ,
	        "fullName": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "retinoblastoma" } ,
	        "synonym": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "rbf1" }
	      } ,
	      {
	        "gene": { "type": "uri" , "value": "http://rodos.zoo.ox.ac.uk/2008/flyweb/id/flybase/FBgn0015799" } ,
	        "flybaseID": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "FBgn0015799" } ,
	        "symbol": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "Rbf" } ,
	        "annotationSymbol": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "CG7413" } ,
	        "fullName": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "retinoblastoma" } ,
	        "synonym": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "rb" }
	      } ,
	      {
	        "gene": { "type": "uri" , "value": "http://rodos.zoo.ox.ac.uk/2008/flyweb/id/flybase/FBgn0015799" } ,
	        "flybaseID": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "FBgn0015799" } ,
	        "symbol": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "Rbf" } ,
	        "annotationSymbol": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "CG7413" } ,
	        "fullName": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "retinoblastoma" } ,
	        "synonym": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "pRb" }
	      } ,
	      {
	        "gene": { "type": "uri" , "value": "http://rodos.zoo.ox.ac.uk/2008/flyweb/id/flybase/FBgn0015799" } ,
	        "flybaseID": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "FBgn0015799" } ,
	        "symbol": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "Rbf" } ,
	        "annotationSymbol": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "CG7413" } ,
	        "fullName": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "retinoblastoma" } ,
	        "synonym": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "CG7413" }
	      } ,
	      {
	        "gene": { "type": "uri" , "value": "http://rodos.zoo.ox.ac.uk/2008/flyweb/id/flybase/FBgn0015799" } ,
	        "flybaseID": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "FBgn0015799" } ,
	        "symbol": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "Rbf" } ,
	        "annotationSymbol": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "CG7413" } ,
	        "fullName": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "retinoblastoma" } ,
	        "synonym": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "rbf" }
	      } ,
	      {
	        "gene": { "type": "uri" , "value": "http://rodos.zoo.ox.ac.uk/2008/flyweb/id/flybase/FBgn0015799" } ,
	        "flybaseID": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "FBgn0015799" } ,
	        "symbol": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "Rbf" } ,
	        "annotationSymbol": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "CG7413" } ,
	        "fullName": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "retinoblastoma" } ,
	        "synonym": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "dRBF" }
	      } ,
	      {
	        "gene": { "type": "uri" , "value": "http://rodos.zoo.ox.ac.uk/2008/flyweb/id/flybase/FBgn0015799" } ,
	        "flybaseID": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "FBgn0015799" } ,
	        "symbol": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "Rbf" } ,
	        "annotationSymbol": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "CG7413" } ,
	        "fullName": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "retinoblastoma" } ,
	        "synonym": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "EG:34F3.3" }
	      } ,
	      {
	        "gene": { "type": "uri" , "value": "http://rodos.zoo.ox.ac.uk/2008/flyweb/id/flybase/FBgn0015799" } ,
	        "flybaseID": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "FBgn0015799" } ,
	        "symbol": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "Rbf" } ,
	        "annotationSymbol": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "CG7413" } ,
	        "fullName": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "retinoblastoma" } ,
	        "synonym": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "Retinoblastoma-family protein" }
	      } ,
	      {
	        "gene": { "type": "uri" , "value": "http://rodos.zoo.ox.ac.uk/2008/flyweb/id/flybase/FBgn0015799" } ,
	        "flybaseID": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "FBgn0015799" } ,
	        "symbol": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "Rbf" } ,
	        "annotationSymbol": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "CG7413" } ,
	        "fullName": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "retinoblastoma" } ,
	        "synonym": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "retinoblastoma" }
	      } ,
	      {
	        "gene": { "type": "uri" , "value": "http://rodos.zoo.ox.ac.uk/2008/flyweb/id/flybase/FBgn0015799" } ,
	        "flybaseID": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "FBgn0015799" } ,
	        "symbol": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "Rbf" } ,
	        "annotationSymbol": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "CG7413" } ,
	        "fullName": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "retinoblastoma" } ,
	        "synonym": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "RbF" }
	      } ,
	      {
	        "gene": { "type": "uri" , "value": "http://rodos.zoo.ox.ac.uk/2008/flyweb/id/flybase/FBgn0015799" } ,
	        "flybaseID": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "FBgn0015799" } ,
	        "symbol": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "Rbf" } ,
	        "annotationSymbol": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "CG7413" } ,
	        "fullName": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "retinoblastoma" } ,
	        "synonym": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "FBF" }
	      } ,
	      {
	        "gene": { "type": "uri" , "value": "http://rodos.zoo.ox.ac.uk/2008/flyweb/id/flybase/FBgn0015799" } ,
	        "flybaseID": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "FBgn0015799" } ,
	        "symbol": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "Rbf" } ,
	        "annotationSymbol": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "CG7413" } ,
	        "fullName": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "retinoblastoma" } ,
	        "synonym": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "Rbf1" }
	      } ,
	      {
	        "gene": { "type": "uri" , "value": "http://rodos.zoo.ox.ac.uk/2008/flyweb/id/flybase/FBgn0015799" } ,
	        "flybaseID": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "FBgn0015799" } ,
	        "symbol": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "Rbf" } ,
	        "annotationSymbol": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "CG7413" } ,
	        "fullName": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "retinoblastoma" } ,
	        "synonym": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "Rb" }
	      } ,
	      {
	        "gene": { "type": "uri" , "value": "http://rodos.zoo.ox.ac.uk/2008/flyweb/id/flybase/FBgn0015799" } ,
	        "flybaseID": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "FBgn0015799" } ,
	        "symbol": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "Rbf" } ,
	        "annotationSymbol": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "CG7413" } ,
	        "fullName": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "retinoblastoma" } ,
	        "synonym": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "Rb1" }
	      } ,
	      {
	        "gene": { "type": "uri" , "value": "http://rodos.zoo.ox.ac.uk/2008/flyweb/id/flybase/FBgn0004903" } ,
	        "flybaseID": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "FBgn0004903" } ,
	        "symbol": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "Rb97D" } ,
	        "annotationSymbol": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "CG6354" } ,
	        "fullName": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "Ribonuclear protein at 97D" } ,
	        "synonym": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "CG6354" }
	      } ,
	      {
	        "gene": { "type": "uri" , "value": "http://rodos.zoo.ox.ac.uk/2008/flyweb/id/flybase/FBgn0004903" } ,
	        "flybaseID": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "FBgn0004903" } ,
	        "symbol": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "Rb97D" } ,
	        "annotationSymbol": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "CG6354" } ,
	        "fullName": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "Ribonuclear protein at 97D" } ,
	        "synonym": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "Hrb97D" }
	      } ,
	      {
	        "gene": { "type": "uri" , "value": "http://rodos.zoo.ox.ac.uk/2008/flyweb/id/flybase/FBgn0004903" } ,
	        "flybaseID": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "FBgn0004903" } ,
	        "symbol": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "Rb97D" } ,
	        "annotationSymbol": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "CG6354" } ,
	        "fullName": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "Ribonuclear protein at 97D" } ,
	        "synonym": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "Rb97D1" }
	      } ,
	      {
	        "gene": { "type": "uri" , "value": "http://rodos.zoo.ox.ac.uk/2008/flyweb/id/flybase/FBgn0004903" } ,
	        "flybaseID": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "FBgn0004903" } ,
	        "symbol": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "Rb97D" } ,
	        "annotationSymbol": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "CG6354" } ,
	        "fullName": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "Ribonuclear protein at 97D" } ,
	        "synonym": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "ms(3)03445" }
	      } ,
	      {
	        "gene": { "type": "uri" , "value": "http://rodos.zoo.ox.ac.uk/2008/flyweb/id/flybase/FBgn0004903" } ,
	        "flybaseID": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "FBgn0004903" } ,
	        "symbol": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "Rb97D" } ,
	        "annotationSymbol": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "CG6354" } ,
	        "fullName": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "Ribonuclear protein at 97D" } ,
	        "synonym": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "rbf" }
	      } ,
	      {
	        "gene": { "type": "uri" , "value": "http://rodos.zoo.ox.ac.uk/2008/flyweb/id/flybase/FBgn0004903" } ,
	        "flybaseID": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "FBgn0004903" } ,
	        "symbol": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "Rb97D" } ,
	        "annotationSymbol": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "CG6354" } ,
	        "fullName": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "Ribonuclear protein at 97D" } ,
	        "synonym": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "R16" }
	      } ,
	      {
	        "gene": { "type": "uri" , "value": "http://rodos.zoo.ox.ac.uk/2008/flyweb/id/flybase/FBgn0004903" } ,
	        "flybaseID": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "FBgn0004903" } ,
	        "symbol": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "Rb97D" } ,
	        "annotationSymbol": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "CG6354" } ,
	        "fullName": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "Ribonuclear protein at 97D" } ,
	        "synonym": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "Rb97D" }
	      } ,
	      {
	        "gene": { "type": "uri" , "value": "http://rodos.zoo.ox.ac.uk/2008/flyweb/id/flybase/FBgn0004903" } ,
	        "flybaseID": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "FBgn0004903" } ,
	        "symbol": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "Rb97D" } ,
	        "annotationSymbol": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "CG6354" } ,
	        "fullName": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "Ribonuclear protein at 97D" } ,
	        "synonym": { "datatype": "http://www.w3.org/2001/XMLSchema#string" , "type": "typed-literal" , "value": "Ribonuclear protein at 97D" }
	      }
	    ]
	  }
	};
};


// ************************************************************
// MODULE TESTS
// ************************************************************


/**
 * @class
 * A collection of tests to test the module contents.
 */
flyui.flybase.ModuleTests = function() {};


/** 
 * Set up function for the flyui.flybase ModuleTests.
 */
flyui.flybase.ModuleTests.setUpTest = function() {
	try {
		trace("setUp test");
	} catch (e) {
		flyui.err("setUp error, "+e.name+", "+e.message);
	}
};


/** 
 * Tear down function for the flyui.flybase ModuleTests.
 */
flyui.flybase.ModuleTests.tearDownTest = function() {
	try {
		trace("tearDown test");
	} catch (e) {
		flyui.err("tearDown error, "+e.name+", "+e.message);
	}
};


/** 
 * Test that the contents of the flyui.flybase module have been defined.
 */
flyui.flybase.ModuleTests.testModuleContents = function() {
	
	flyui.info("Test \"==== flyui.flybase ModuleTests :: testModuleContents ====\" started.");
	
	assert.isNotUndefined(flyui.flybase, "flyui.flybase is undefined");	
	
	assert.isNotUndefined(flyui.flybase.Service, "flyui.flybase.Service is undefined");	
	
	assert.isNotUndefined(flyui.flybase.Gene, "flyui.flybase.Gene is undefined");
		
	assert.isNotUndefined(flyui.flybase.GenePool, "flyui.flybase.GenePool is undefined");	
		
};


/** 
 * Construct a YUI test case for the flyui.flybase ModuleTests.
 * @return a YUI test case
 * @type YAHOO.tool.TestCase
 */
flyui.flybase.ModuleTestCase = function() {
	
	var testCase = new YAHOO.tool.TestCase({
		
		name: "=== flyui.flybase ModuleTests ===",
		
		setUp : flyui.flybase.ModuleTests.setUpTest,
		
		tearDown : flyui.flybase.ModuleTests.tearDownTest,
		
		testModuleContents : flyui.flybase.ModuleTests.testModuleContents
		
	});
	
	return testCase;
	
};


// ************************************************************
// GENE TESTS
// ************************************************************


/**
 * @class
 * A collection of tests to test the Gene class.
 */
flyui.flybase.GeneTests = function() {};


/** 
 * Set up function.
 */
flyui.flybase.GeneTests.setUpTest = function() {
	try {
		trace("setUp test");
	} catch (e) {
		flyui.err("setUp error, "+e.name+", "+e.message);
	}
};


/** 
 * Tear down function.
 */
flyui.flybase.GeneTests.tearDownTest = function() {
	try {
		trace("tearDown test");
	} catch (e) {
		flyui.err("tearDown error, "+e.name+", "+e.message);
	}
};


/**
 * Test the definition of the Gene class.
 */
flyui.flybase.GeneTests.testGeneClassDefinition = function() {
	flyui.info("Test \"==== flyui.flybase GeneTests :: testGeneClassDefinition ====\" started.");
	
	assert.isNotUndefined(flyui.flybase.Gene.newInstancesFromSPARQLResults, "newInstancesFromSPARQLResults is undefined");
	
	var gene = new flyui.flybase.Gene();
	assert.isNotUndefined(gene.addSymbol, "gene.addSymbol is undefined");	
	assert.isNotUndefined(gene.addAnnotationSymbol, "gene.addAnnotationSymbol is undefined");	
	assert.isNotUndefined(gene.addFullName, "gene.addFullName is undefined");	
//	assert.isNotUndefined(gene.addSynonym, "gene.addSynonym is undefined");	
	
};


/**
 * Test the methods add* for adding different types of name to a gene.
 */
flyui.flybase.GeneTests.testGeneAddNames = function() {
	flyui.info("Test \"==== flyui.flybase GeneTests :: testGeneAddNames ====\" started.");
	
	var gene = new flyui.flybase.Gene();

// old way of doing it...
//	trace("adding foo");
//	gene.addSymbol("foo");
//	assert.areEqual(1, gene.symbols.length, "gene field symbols length not as expected");
//	assert.areEqual("foo", gene.symbols[0], "gene symbols not as expected");
//
//	trace("adding bar");
//	gene.addSymbol("bar");
//	assert.areEqual(2, gene.symbols.length, "gene field symbols length not as expected");
//	assert.areEqual("bar", gene.symbols[1], "gene symbols not as expected");
//
//	trace("adding duplicate foo");
//	gene.addSymbol("foo"); // try a duplicate
//	assert.areEqual(2, gene.symbols.length, "gene field symbols length not as expected");
	
	// more concise way of doing it...
	
	// names of methods to test
	methods = ["addSymbol", "addAnnotationSymbol", "addFullName"];
	
	// names of corresponding fields
	fields = ["symbols", "annotationSymbols", "fullNames"];
	
	// test for each method/field
	for (var i=0; i<methods.length; i++) {

		var add = methods[i];
		var field = fields[i];
		trace("method "+add+" field "+field);
		
		assert.isNotUndefined(gene[add]);
		assert.isNotUndefined(gene[field]);
		
		trace("adding foo");
		gene[add]("foo");
		assert.areEqual(1, gene[field].length, "gene field "+field+" length not as expected");
		assert.areEqual("foo", gene[field][0], "gene "+field+" not as expected");

		trace("adding bar");
		gene[add]("bar");
		assert.areEqual(2, gene[field].length, "gene field "+field+" length not as expected");
		assert.areEqual("bar", gene[field][1], "gene "+field+" not as expected");

		trace("adding duplicate foo");
		gene[add]("foo"); // try a duplicate
		assert.areEqual(2, gene[field].length, "gene field "+field+" length not as expected");
	}
	
};


/**
 * Compare two gene objects.
 * @param {flyui.flybase.Gene} expected
 * @param {flyui.flybase.Gene} actual
 */
flyui.flybase.TestData.compareGenes = function( expected, actual ) {

	trace("test flybaseID");	
	assert.areEqual(expected.flybaseID, actual.flybaseID, "flybase ID not as expected");

	trace("test symbols, compare expected "+expected.symbols+" with actual "+actual.symbols);	
	assert.areEqual(expected.symbols.length, actual.symbols.length, "number of symbols not as expected");
	assert.isTrue(flyui.util.arrayMembersAreEqual(expected.symbols, actual.symbols), "symbols not as expected");
	
    trace("test annotation symbols, compare expected "+expected.annotationSymbols+" with actual "+actual.annotationSymbols);   
	assert.areEqual(expected.annotationSymbols.length, actual.annotationSymbols.length, "number of annotationSymbols not as expected");
	assert.isTrue(flyui.util.arrayMembersAreEqual(expected.annotationSymbols, actual.annotationSymbols), "annotationSymbols not as expected");
	
    trace("test full names, compare expected "+expected.fullNames+" with actual "+actual.fullNames);   
	assert.areEqual(expected.fullNames.length, actual.fullNames.length, "number of full names not as expected");
	assert.isTrue(flyui.util.arrayMembersAreEqual(expected.fullNames, actual.fullNames), "fullNames not as expected");
	
//	trace("test synonyms, compare expected "+expected.synonyms+" with actual "+actual.synonyms);	
//	assert.areEqual(expected.synonyms.length, actual.synonyms.length, "number of synonyms not as expected");
//	assert.isTrue(flyui.util.arrayMembersAreEqual(expected.synonyms, actual.synonyms), "synonyms not as expected");
//		
}


/**
 * Test constructing a single gene from a SPARQL result set.
 */
flyui.flybase.GeneTests.testNewGeneFromSPARQLResults = function() {
	flyui.info("Test \"==== flyui.flybase GeneTests :: testNewGeneFromSPARQLResults ====\" started.");

	var testData = new flyui.flybase.TestData();
	
	var genes = flyui.flybase.Gene.newInstancesFromSPARQLResults(testData.resultSet_aly);
	
	assert.areEqual(1, genes.length, "one gene expected");
	
	var gene = genes[0];
	
	flyui.flybase.TestData.compareGenes(testData.FBgn0004372, gene);

};


/**
 * Test constructing a single gene from a SPARQL result set.
 */
flyui.flybase.GeneTests.testNewGenesFromSPARQLResults = function() {
	flyui.info("Test \"==== flyui.flybase GeneTests :: testNewGenesFromSPARQLResults ====\" started.");
	
	var testData = new flyui.flybase.TestData();
	
	// result set desribing two genes, both with 'rbf' as synonym	
	var resultSet = testData.resultSet_rbf;
	var genes = flyui.flybase.Gene.newInstancesFromSPARQLResults(resultSet);
	
	assert.areEqual(2, genes.length, "expected two genes");
	
	for (var i in genes) {
		var gene = genes[i];
		trace("testing gene "+gene.flybaseID);
		
		if (gene.flybaseID == "FBgn0015799") {

			assert.areEqual(1, gene.symbols.length, "number of symbols not one");
			assert.areEqual("Rbf", gene.symbols[0], "symbol not as expected");			

			assert.areEqual(1, gene.annotationSymbols.length, "number of annotation symbols not as expected");
			assert.areEqual("CG7413", gene.annotationSymbols[0], "annotation symbol not as expected");			

			assert.areEqual(2, gene.fullNames.length, "number of full names not as expected");
			assert.isTrue(flyui.util.isArrayMember(gene.fullNames, "Retinoblastoma-family protein"), "full names not as expected");
			assert.isTrue(flyui.util.isArrayMember(gene.fullNames, "retinoblastoma"), "full names not as expected");

//			assert.areEqual(17, gene.synonyms.length, "number of synonyms not as expected");
//			for (var i in resultSet.results.bindings) {
//				var synonym = resultSet.results.bindings[i].synonym.value;
//				if (resultSet.results.bindings[i].flybaseID.value == "FBgn0015799") {
//					trace("checking synonym "+synonym);
//					assert.isTrue(flyui.util.isArrayMember(gene.synonyms, synonym), "synonyms not as expected");
//				}
//			}
		}
		else if (gene.flybaseID == "FBgn0004903") {
			assert.areEqual(1, gene.symbols.length, "number of symbols not one");
			assert.areEqual("Rb97D", gene.symbols[0], "symbol not as expected");

			assert.areEqual(1, gene.annotationSymbols.length, "number of annotation symbols not as expected");
			assert.areEqual("CG6354", gene.annotationSymbols[0], "annotation symbol not as expected");			

			assert.areEqual(1, gene.fullNames.length, "number of full names not as expected");
			assert.areEqual("Ribonuclear protein at 97D", gene.fullNames[0], "full name not as expected");			

//			assert.areEqual(8, gene.synonyms.length, "number of synonyms not as expected");
//			for (var i in resultSet.results.bindings) {
//				var synonym = resultSet.results.bindings[i].synonym.value;
//				if (resultSet.results.bindings[i].flybaseID.value == "FBgn0004903") {
//					trace("checking synonym "+synonym);
//					assert.isTrue(flyui.util.isArrayMember(gene.synonyms, synonym), "synonyms not as expected");
//				}
//			}
		}
		else {
			assert.fail("unexpected flybase id "+gene.flybaseID);
		}
	}
	
};


/**
 * TODO doc me
 */
flyui.flybase.GeneTests.testNewGeneFromSPARQLResults_missingOptionals = function() {
	flyui.info("Test \"==== flyui.flybase GeneTests :: testNewGeneFromSPARQLResults_missingOptionals ====\" started.");

	var testData = new flyui.flybase.TestData();
	
	var genes = flyui.flybase.Gene.newInstancesFromSPARQLResults(testData.resultSet_missingOptionals);
	
	assert.areEqual(1, genes.length, "one gene expected");
	
	var gene = genes[0];
	
	assert.areEqual(testData.FBgn0004372.flybaseID, gene.flybaseID);

}


/** 
 * Construct a YUI test case for the flyui.flybase GeneTests.
 * @return a YUI test case
 * @type YAHOO.tool.TestCase
 */
flyui.flybase.GeneTestCase = function() {
	
	var testCase = new YAHOO.tool.TestCase({
		
		name: "=== flyui.flybase GeneTests ===",
		
		setUp : flyui.flybase.GeneTests.setUpTest,
		
		tearDown : flyui.flybase.GeneTests.tearDownTest,
		
		testGeneClassDefinition : flyui.flybase.GeneTests.testGeneClassDefinition,
		
		testGeneAddNames : flyui.flybase.GeneTests.testGeneAddNames,
				
		testNewGeneFromSPARQLResults : flyui.flybase.GeneTests.testNewGeneFromSPARQLResults,
		
		testNewGenesFromSPARQLResults : flyui.flybase.GeneTests.testNewGenesFromSPARQLResults,
		
		testNewGeneFromSPARQLResults_missingOptionals : flyui.flybase.GeneTests.testNewGeneFromSPARQLResults_missingOptionals
				
	});
	
	return testCase;
	
};


// ************************************************************
// SERVICE TESTS
// ************************************************************

// TODO

/**
 * @class
 * Tests for the Service class.
 */
flyui.flybase.ServiceTests = function() {};


/** 
 * Set up function.
 */
flyui.flybase.ServiceTests.setUpTest = function() {
	try {
		trace("setUp test");
	} catch (e) {
		flyui.err("setUp error, "+e.name+", "+e.message);
	}
};


/** 
 * Tear down function.
 */
flyui.flybase.ServiceTests.tearDownTest = function() {
	try {
		trace("tearDown test");
	} catch (e) {
		flyui.err("tearDown error, "+e.name+", "+e.message);
	}
};


/**
 * Test the definition of the Service class.
 */
flyui.flybase.ServiceTests.testServiceClassDefinition = function() {
	flyui.info("Test \"==== flyui.flybase ServiceTests :: testServiceClassDefinition ====\" started.");
	
	var service = new flyui.flybase.Service();
	assert.isNotUndefined(service.query, "service.query is undefined");	
	assert.isNotUndefined(service.findGenesByAnyName, "service.findGenesByAnyName is undefined");	
};


/**
 * Test the query method of the Service class.
 * @param {String} endpointURL URL of service
 * @param {YAHOO.tool.TestCase} testCase the test case in which this test is run
 */
flyui.flybase.ServiceTests.testQuery = function(endpointURL, testCase) {
	flyui.info("Test \"==== flyui.flybase ServiceTests :: testQuery ====\" started.");
		
	var service = new flyui.flybase.Service(endpointURL);
	var query = "ASK { ?s ?p ?o }";
	
	var testOnSuccess = function(responseObject) {
		trace("resume test case (success)");
		testCase.resume(function() {
			
			// check status code			
			assert.areEqual(200, responseObject.status);
			
			// try parsing response text as json
			var resultSet = YAHOO.lang.JSON.parse(responseObject.responseText);
			
			// check json content
			assert.isTrue(resultSet["boolean"], "result set not as expected");
		});
	};
	
	var testOnFailure = function(responseObject) {
		trace("resume test case (failure)");
		testCase.resume(function() {
			// force failure
			assert.fail("request failed, status "+responseObject.status + " " +responseObject.statusText);
		});
	};
	
	trace("initiate request");
	service.query(query, testOnSuccess, testOnFailure);
	
	trace("suspend test case (if test runner hangs here, something is wrong)");
	testCase.wait();
}


/**
 * Test the findGenesByAnyName method of the Service class.
 * @param {String} geneName the name to use as test query
 * @param {Array} expectedGenes an array containing gene objects expected in the result
 * @param {String} endpointURL URL of service
 * @param {YAHOO.tool.TestCase} testCase the test case in which this test is run
 * @param {boolean} caseSensitive true if doing a case sensitive search
 */
flyui.flybase.ServiceTests.testFindGeneByAnyName = function(geneName, expectedGenes, endpointURL, testCase) {
	flyui.info("Test \"==== flyui.flybase ServiceTests :: testFindGeneByAnyName ("+geneName+") ====\" started.");

	var service = new flyui.flybase.Service(endpointURL);
	
	var testOnSuccess = function(genes) {
		trace("resume test case (success)");
		testCase.resume(function() {

			trace("testing number of genes found");
			assert.areEqual(expectedGenes.length, genes.length);
			
			trace("compare flybase IDs");
			for (var i in expectedGenes) {
				var expected = expectedGenes[i];
				trace("looking for expected gene "+expected.flybaseID);
				var found = false;
				for (var j in genes) {
					var actual = genes[j];
					if (expected.flybaseID == actual.flybaseID) {
						found = true;
						// uncomment following line for full testing (requires populating test data also)
//						flyui.flybase.TestData.compareGenes(expected, actual);
					}
				}
				assert.isTrue(found, "gene "+expected.flybaseID+" not found in results");
			}

		});
	};
	
	var testOnFailure = function(responseObject) {
		trace("resume test case (failure)");
		testCase.resume(function() {
			// force failure
			assert.fail("request failed, status "+responseObject.status + " " +responseObject.statusText);
		});
	};
	
	trace("initiate request");
	service.findGenesByAnyName(geneName, testOnSuccess, testOnFailure);
	
	trace("suspend test case (if test runner hangs here, something is wrong)");
	testCase.wait();
	
};


flyui.flybase.ServiceTests.testFindGenesByAnyNameBatch = function(names, expected, endpointURL, testCase) {
    flyui.info("Test \"==== flyui.flybase ServiceTests :: testFindGenesByAnyNameBatch ("+names.join(", ")+") ====\" started.");

    var testOnSuccess = function(actual) {
        trace("resume test case (success)");
        testCase.resume(function() {

            assert.isNotNull(actual, "map is null");
            assert.isNotUndefined(actual, "map is undefined");

            for (var key in expected) {
                trace("inspecting key: "+key);
                assert.isNotUndefined(actual[key], "map has undefined value for expected key: "+key);
                assert.isNotNull(actual[key], "map has null value for expected key: "+key);
                assert.areEqual(expected[key].length, actual[key].length, "number of genes found for key: "+key+" not as expected");
                
                var expectedGenes = expected[key];                
                var actualGenes = actual[key];  
                trace("compare flybase IDs");
                for (var i=0; i<expectedGenes.length; i++) {
                    var expectedGene = expectedGenes[i];
                    trace("looking for expected gene "+expectedGene.flybaseID);
                    var found = false;
                    for (var j=0; j<actualGenes.length; j++) {
                        var actualGene = actualGenes[j];
                        if (expectedGene.flybaseID == actualGene.flybaseID) {
                            trace("found "+actualGene.flybaseID);
                            found = true;
                            flyui.flybase.TestData.compareGenes(expectedGene, actualGene);
                        }
                    }
                    assert.isTrue(found, "gene "+expectedGene.flybaseID+" not found in result map for key: "+key);
                }
            }
            
        });
    };
    
    var testOnFailure = function(responseObject) {
        trace("resume test case (failure)");
        testCase.resume(function() {
            // force failure
            assert.fail("request failed, status "+responseObject.status + " " +responseObject.statusText);
        });
    };

    var service = new flyui.flybase.Service(endpointURL);
    
    trace("initiate request");
    service.findGenesByAnyNameBatch(names, testOnSuccess, testOnFailure);
    
    trace("suspend test case (if test runner hangs here, something is wrong)");
    testCase.wait();
    
}

var pause = 500;

/** 
 * Construct a YUI test case for the flyui.flybase ServiceTests.
 * @param {String} endpointURL URL of service
 * @return a YUI test case
 * @type YAHOO.tool.TestCase
 */
flyui.flybase.ServiceTestCase = function(endpointURL) {
	
	var testCase = new YAHOO.tool.TestCase({
		
		name: "=== flyui.flybase ServiceTests ===",
		
		setUp : flyui.flybase.ServiceTests.setUpTest,
		
		tearDown : flyui.flybase.ServiceTests.tearDownTest,
		
		testServiceClassDefinition : flyui.flybase.ServiceTests.testServiceClassDefinition,
		
		testQuery : function() {
			flyui.flybase.ServiceTests.testQuery(endpointURL, this);
		},

		testFindGeneByAnyName_aly : function() {
            var runner = this;
            runner.wait(function() {
                // 'aly' test case 
                var testData = new flyui.flybase.TestData();
                flyui.flybase.ServiceTests.testFindGeneByAnyName("aly", [testData.FBgn0004372, testData.FBgn0010774], endpointURL, runner);
            }, pause);			
		},
		
		testFindGeneByAnyName_rbf : function() {
            var runner = this;
            runner.wait(function() {
                // 'rbf' test 
                var testData = new flyui.flybase.TestData();
                flyui.flybase.ServiceTests.testFindGeneByAnyName("rbf", [testData.FBgn0015799, testData.FBgn0004903], endpointURL, runner);
            }, pause);          
		}, 
		
		testFindGenesByAnyNameBatch : function() {
            var runner = this;
            runner.wait(function() {
                var testData = new flyui.flybase.TestData();
                var names = ["aly","rbf","schuy","foo"];
                var expect = {
                    "aly":[testData.FBgn0004372, testData.FBgn0010774],
                    "rbf":[testData.FBgn0015799, testData.FBgn0004903],
                    "schuy":[testData.FBgn0036925],
                    "foo":[]
                    };
                flyui.flybase.ServiceTests.testFindGenesByAnyNameBatch(names, expect, endpointURL, runner);
            }, pause);          
		}

	});
	
	return testCase;
	
};


// ************************************************************
// TEST SUITE & RUNNER
// ************************************************************


/** 
 * Construct a YUI test suite for the flyui.flybase module.
 * @param {String} endpointURL URL of service
 * @return a YUI test suite
 * @type YAHOO.tool.TestSuite
 */
flyui.flybase.TestSuite = function(endpointURL) {
	var suite = new YAHOO.tool.TestSuite("== flyui.flybase Test Suite ==");
	suite.add(flyui.flybase.ModuleTestCase());
	suite.add(flyui.flybase.GeneTestCase());
	suite.add(flyui.flybase.ServiceTestCase(endpointURL));
	return suite;
}

/** 
 * Run the flyui.flybase test suite.
 * @param {String} endpointURL URL of service
 */
flyui.flybase.runTests = function(endpointURL) {
	trace("flyui.flybase :: running tests");
	YAHOO.tool.TestRunner.add(flyui.flybase.TestSuite(endpointURL));
	YAHOO.tool.TestRunner.run();
}
