/**
 * @fileoverview
 * This script defines tests for the flyui.mvcutils module.
 * @requires YAHOO.log
 * @requires YAHOO.util.Assert
 * @requires YAHOO.tool.TestCase
 * @requires YAHOO.tool.TestRunner
 * @requires flyui.mvcutils
 * @author <a href="http://purl.org/net/aliman">Alistair Miles</a>
 * @version $Revision: 724 $
 * TODO license terms
 */
 
 
// Shortcuts
var trace = function(message) { YAHOO.log(message, "test"); };
var assert = YAHOO.util.Assert;


/**
 * @class
 * A collection of tests for the flyui.mvcutils module.
 */
flyui.mvcutils.ModuleTests = function() {}


/**
 * Set up function for the flyui.mvcutils.ModuleTests.
 */
flyui.mvcutils.ModuleTests.setUpTest = function() {
	try {
		trace("setUp test");
		// TODO anything?
	} catch (e) {
		flyui.err("setUp error, "+e.name+", "+e.message);
	}
}


/**
 * Tear down function for the flyui.mvcutils.ModuleTests.
 */
flyui.mvcutils.ModuleTests.tearDownTest = function() {
	try {
		trace("tearDown test");
		// TODO anything?
	} catch (e) {
		flyui.err("tearDown error, "+e.name+", "+e.message);
	}
}


/** Test that the contents of the flyui.mvcutils module have been defined.
 */
flyui.mvcutils.ModuleTests.testModuleContents = function() {
	
	trace("==== flyui.mvcutils.ModuleTests.testModuleContents ====");
	
	assert.isNotUndefined(flyui.mvcutils.GenericModel, "flyui.mvcutils.GenericModel is undefined");	
	assert.isNotUndefined(flyui.mvcutils.show, "flyui.mvcutils.show is undefined");	
	assert.isNotUndefined(flyui.mvcutils.hide, "flyui.mvcutils.hide is undefined");
		
}


/** Test get/set methods on the flyui.mvcutils.GenericModel class.
 */
flyui.mvcutils.ModuleTests.testGenericModel = function() {
	
	trace("==== flyui.mvcutils.ModuleTests.testGenericModel ====");
		
	trace("define a dummy model");
	var modelDefinition = {
		propertyNames : [ "STATE", "IMAGES" ],
		controlledValues : {
			"STATE" : [ "LOADING", "PENDING", "READY"]
		},
		initialize : function( data ) {
			data["STATE"] = "LOADING";
		}
	}
	
	trace("instantiate a model");
	var model = new flyui.mvcutils.GenericModel(modelDefinition);
	
	trace("test initial property values");
	assert.areEqual("LOADING", model.get("STATE"));
	
	trace("test change property value");
	model.set("STATE", "PENDING");
	assert.areEqual("PENDING", model.get("STATE"));
	
	trace("test invalid property name");
	try {
		model.get("FOO");
		assert.fail("no exception was thrown");
	} catch( e ) {
		trace("caught expected exception: "+e.name+", "+e.message);
	} 

	trace("test invalid property name");
	try {
		model.set("FOO", "BAR");
		assert.fail("no exception was thrown");
	} catch( e ) {
		trace("caught expected exception: "+e.name+", "+e.message);
	} 

	trace("test invalid property value");
	try {
		model.set("STATE", "FOO");
		assert.fail("no exception was thrown");
	} catch( e ) {
		trace("caught expected exception: "+e.name+", "+e.message);
	} 

	trace("test uncontrolled property value");
	model.set("IMAGES", "FOO");
	assert.areEqual("FOO", model.get("IMAGES"));

}


/** Test show/hide.
 */
flyui.mvcutils.ModuleTests.testShowHide = function() {
	var element = document.createElement("div");
	flyui.mvcutils.hide(element);
	assert.areEqual("invisible", element.className);
	flyui.mvcutils.show(element);
	assert.areEqual("", element.className);
}


/**
 * Create a test case for the flyui.mvcutils module.
 */
flyui.mvcutils.ModuleTestCase = function() {
	
	return new YAHOO.tool.TestCase({
	
		name: "=== flyui.mvcutils Test Case ===",
		
		setUp : flyui.mvcutils.ModuleTests.setUpTest,
		
		tearDown : flyui.mvcutils.ModuleTests.tearDownTest,
		
		testModuleContents : flyui.mvcutils.ModuleTests.testModuleContents,
		
		testGenericModel : flyui.mvcutils.ModuleTests.testGenericModel,
		
		testShowHide : flyui.mvcutils.ModuleTests.testShowHide
		
	});

};


/** Create a test suite for the flyui.mvcutils module.
 */
flyui.mvcutils.TestSuite = function() {
	var suite = new YAHOO.tool.TestSuite("== flyui.mvcutils Test Suite ==");
	suite.add(flyui.mvcutils.ModuleTestCase());
	return suite;
}


/**
 * Run the flyui.mvcutils test suite.
 */
flyui.mvcutils.runTests = function() {
	YAHOO.trace("flyui.mvcutils :: running tests");
	YAHOO.tool.TestRunner.add(flyui.mvcutils.TestSuite());
	YAHOO.tool.TestRunner.run();
}


