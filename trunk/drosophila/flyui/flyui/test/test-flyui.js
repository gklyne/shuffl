/**
 * @fileoverview
 * This script defines tests for the flyui enviroment setup module.
 * @requires YAHOO.log
 * @requires YAHOO.util.Assert
 * @requires YAHOO.tool.TestCase
 * @requires YAHOO.tool.TestRunner
 * @requires flyui
 * @author <a href="http://purl.org/net/aliman">Alistair Miles</a>
 * @version $Revision:538 $
 * TODO license terms
 */
 
  
// Shortcuts
var trace = function(message) { YAHOO.log(message, "test"); };
var assert = YAHOO.util.Assert;


/**
 * A collection of tests to test the module contents.
 * @class
 */
flyui.ModuleTests = function() {};


/** Set up function for the flyui.ModuleTests.
 */
flyui.ModuleTests.setUpTest = function() {
	try {
		trace("setUp test");
	} catch (e) {
		flyui.err("setUp error, "+e.name+", "+e.message);
	}
}


/** Tear down function for the flyui.ModuleTests.
 */
flyui.ModuleTests.tearDownTest = function() {
	try {
		trace("tearDown test");
	} catch (e) {
		flyui.err("tearDown error, "+e.name+", "+e.message);
	}
}


/** Test that the contents of the flyui module have been defined.
 */
flyui.ModuleTests.testModuleContents = function() {
	
	flyui.info("Test \"==== flyui ModuleTests :: testModuleContents ====\" started.");
	
	assert.isNotUndefined(flyui, "flyui is undefined");	
	assert.isNotUndefined(flyui.namespace, "flyui.namespace is undefined");	
		
}


/** 
 * Construct a YUI test case for the flyui.ModuleTests.
 * @return a YUI test case
 */
flyui.ModuleTestCase = function() {
	
	var testCase = new YAHOO.tool.TestCase({
		
		name: "=== flyui ModuleTests ===",
		
		setUp : flyui.ModuleTests.setUpTest,
		
		tearDown : flyui.ModuleTests.tearDownTest,
		
		testModuleContents : flyui.ModuleTests.testModuleContents
		
	});
	
	return testCase;
	
};

/** The flyui test suite.
 */
flyui.TestSuite = function() {
	var suite = new YAHOO.tool.TestSuite("== flyui Test Suite ==");
	suite.add(flyui.ModuleTestCase());
	return suite;
}

/** Runner for the flyui test suite.
 */
flyui.runTests = function() {
	trace("flyui :: running tests");
	YAHOO.tool.TestRunner.add(flyui.TestSuite());
	YAHOO.tool.TestRunner.run();
}


