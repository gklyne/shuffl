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
flyui.mvcutils.GenericModel2.ModuleTests = function() {}


/**
 * Set up function for the flyui.mvcutils.GenericModel2.ModuleTests.
 */
flyui.mvcutils.GenericModel2.ModuleTests.setUpTest = function() {
	try {
		trace("setUp test");
		// TODO anything?
	} catch (e) {
		flyui.err("setUp error, "+e.name+", "+e.message);
	}
}


/**
 * Tear down function for the flyui.mvcutils.GenericModel2.ModuleTests.
 */
flyui.mvcutils.GenericModel2.ModuleTests.tearDownTest = function() {
	try {
		trace("tearDown test");
		// TODO anything?
	} catch (e) {
		flyui.err("tearDown error, "+e.name+", "+e.message);
	}
}


/** Test that the contents of the flyui.mvcutils module have been defined.
 */
flyui.mvcutils.GenericModel2.ModuleTests.testModuleContents = function() {
	
	trace("==== flyui.mvcutils.GenericModel2.ModuleTests.testModuleContents ====");
	
	// test constructor
	assert.isNotUndefined(flyui.mvcutils.GenericModel2, "flyui.mvcutils.GenericModel2 is undefined");
	
	// test public methods
	assert.isNotUndefined(flyui.mvcutils.GenericModel2.prototype.setDefinition, "flyui.mvcutils.GenericModel2.setDefinition is undefined");	
	assert.isNotUndefined(flyui.mvcutils.GenericModel2.prototype.subscribe, "flyui.mvcutils.GenericModel2.subscribe is undefined");	
	assert.isNotUndefined(flyui.mvcutils.GenericModel2.prototype.subscribeAll, "flyui.mvcutils.GenericModel2.subscribeAll is undefined");	
	assert.isNotUndefined(flyui.mvcutils.GenericModel2.prototype.get, "flyui.mvcutils.GenericModel2.get is undefined");	
	assert.isNotUndefined(flyui.mvcutils.GenericModel2.prototype.set, "flyui.mvcutils.GenericModel2.set is undefined");	
	
	// test private members
	assert.isNotUndefined(flyui.mvcutils.GenericModel2.prototype._state, "flyui.mvcutils.GenericModel2._state is undefined");	
	assert.isNotUndefined(flyui.mvcutils.GenericModel2.prototype._events, "flyui.mvcutils.GenericModel2._events is undefined");
	assert.isNotUndefined(flyui.mvcutils.GenericModel2.prototype._properties, "flyui.mvcutils.GenericModel2._properties is undefined");
	assert.isNotUndefined(flyui.mvcutils.GenericModel2.prototype._values, "flyui.mvcutils.GenericModel2._values is undefined");
	
	// test private methods
	assert.isNotUndefined(flyui.mvcutils.GenericModel2.prototype._validateProperty, "flyui.mvcutils.GenericModel2._validateProperty is undefined");	
	assert.isNotUndefined(flyui.mvcutils.GenericModel2.prototype._validatePropertyValue, "flyui.mvcutils.GenericModel2._validatePropertyValue undefined");	
	assert.isNotUndefined(flyui.mvcutils.GenericModel2.prototype._notify, "flyui.mvcutils.GenericModel2._notify is undefined");	
	
		
}


/** Test get/set methods on the flyui.mvcutils.GenericModel2 class.
 */
flyui.mvcutils.GenericModel2.ModuleTests.testGenericModel = function() {
	
	trace("==== flyui.mvcutils.GenericModel2.ModuleTests.testGenericModel ====");
		
	trace("define a dummy model");
	var modelDefinition = {
		properties : [ "STATE", "IMAGES" ],
		values : {
			"STATE" : [ "LOADING", "PENDING", "READY"]
		},
		initialize : function( data ) {
			data["STATE"] = "LOADING";
		}
	}
	
	trace("instantiate a model");
	var model = new flyui.mvcutils.GenericModel2();
	model.setDefinition(modelDefinition);
	
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

flyui.mvcutils.GenericModel2.ModuleTests.testEvents = function()  {
	trace("==== flyui.mvcutils.GenericModel2.ModuleTests.testEvents ====");
		
	trace("define a dummy model");
	var modelDefinition = {
		properties : [ "STATE", "IMAGES" ],
		values : {
			"STATE" : [ "LOADING", "PENDING", "READY"]
		},
		initialize : function( data ) {
			data["STATE"] = "LOADING";
		}
	}
	
	trace("instantiate a model");
	var model = new flyui.mvcutils.GenericModel2();
	model.setDefinition(modelDefinition);
	
	var obj = {"notified":false};
	
	function listener(type, args, custom) {
		trace("listener notified");
		custom["notified"] = true;
		custom.type = type;
		custom.from = args[0];
		custom.to = args[1];
	}
	
	model.subscribe("STATE", listener, obj);
	model.set("STATE", "READY");

	assert.isTrue(obj.notified);
	assert.areEqual("STATE", obj.type);
	assert.areEqual("LOADING", obj.from);
	assert.areEqual("READY", obj.to);	
	
}

/**
 * Create a test case for the flyui.mvcutils module.
 */
flyui.mvcutils.GenericModel2.ModuleTestCase = function() {
	
	return new YAHOO.tool.TestCase({
	
		name: "=== flyui.mvcutils.GenericModel2 Test Case ===",
		
		setUp : flyui.mvcutils.GenericModel2.ModuleTests.setUpTest,
		
		tearDown : flyui.mvcutils.GenericModel2.ModuleTests.tearDownTest,
		
		testModuleContents : flyui.mvcutils.GenericModel2.ModuleTests.testModuleContents,
		
		testGenericModel : flyui.mvcutils.GenericModel2.ModuleTests.testGenericModel,
		
		testEvents : flyui.mvcutils.GenericModel2.ModuleTests.testEvents
		
	});

};


/** Create a test suite for the flyui.mvcutils module.
 */
flyui.mvcutils.GenericModel2.TestSuite = function() {
	var suite = new YAHOO.tool.TestSuite("== flyui.mvcutils.GenericModel2 Test Suite ==");
	suite.add(flyui.mvcutils.GenericModel2.ModuleTestCase());
	return suite;
}


/**
 * Run the flyui.mvcutils test suite.
 */
flyui.mvcutils.GenericModel2.runTests = function() {
	YAHOO.log("flyui.mvcutils :: running tests", "test");
	YAHOO.tool.TestRunner.add(flyui.mvcutils.GenericModel2.TestSuite());
	YAHOO.tool.TestRunner.run();
}


