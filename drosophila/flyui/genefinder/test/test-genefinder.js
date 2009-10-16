/**
 * @fileoverview
 * This script defines tests for the flyui.genefinder module.
 * @requires YAHOO.log
 * @requires YAHOO.util.Assert
 * @requires YAHOO.tool.TestCase
 * @requires YAHOO.tool.TestRunner
 * @requires flyui.flybase
 * @requires flyui.mvcutils
 * @author <a href="http://purl.org/net/aliman">Alistair Miles</a>
 * @version $Revision:538 $
 * TODO license terms
 */
 
  
// Shortcuts
var trace = function(message) { YAHOO.log(message, "test"); };
var assert = YAHOO.util.Assert;
assert.isVisible = function(element, message) {
	assert.isFalse(YAHOO.util.Dom.hasClass(element, "invisible"), message);
};
assert.isNotVisible = function(element, message) {
	assert.isTrue(YAHOO.util.Dom.hasClass(element, "invisible"), message);
}



// ************************************************************
// MODULE TESTS
// ************************************************************


/**
 * @class
 * A collection of tests to test the module contents.
 */
flyui.genefinder.ModuleTests = function() {};


/** 
 * Set up function for the flyui.genefinder ModuleTests.
 */
flyui.genefinder.ModuleTests.setUpTest = function() {
	try {
		trace("setUp test");
	} catch (e) {
		flyui.err("setUp error, "+e.name+", "+e.message);
	}
};


/** 
 * Tear down function for the flyui.genefinder ModuleTests.
 */
flyui.genefinder.ModuleTests.tearDownTest = function() {
	try {
		trace("tearDown test");
	} catch (e) {
		flyui.err("tearDown error, "+e.name+", "+e.message);
	}
};


/** 
 * Test that the contents of the flyui.genefinder module have been defined.
 */
flyui.genefinder.ModuleTests.testModuleContents = function() {
	
	flyui.info("Test \"==== flyui.genefinder ModuleTests :: testModuleContents ====\" started.");
	
	assert.isNotUndefined(flyui.genefinder, "flyui.genefinder is undefined");	
	assert.isNotUndefined(flyui.genefinder.Widget, "flyui.genefinder.Widget is undefined");	
	assert.isNotUndefined(flyui.genefinder.Controller, "flyui.genefinder.Controller is undefined");
	assert.isNotUndefined(flyui.genefinder.DefaultRenderer, "flyui.genefinder.DefaultRenderer is undefined");	
	assert.isNotUndefined(flyui.genefinder.modelDefinition, "flyui.genefinder.modelDefinition is undefined");	
		
};


/** 
 * Construct a YUI test case for the flyui.genefinder ModuleTests.
 * @return a YUI test case
 * @type YAHOO.tool.TestCase
 */
flyui.genefinder.ModuleTestCase = function() {
	
	var testCase = new YAHOO.tool.TestCase({
		
		name: "=== flyui.genefinder ModuleTests ===",
		
		setUp : flyui.genefinder.ModuleTests.setUpTest,
		
		tearDown : flyui.genefinder.ModuleTests.tearDownTest,
		
		testModuleContents : flyui.genefinder.ModuleTests.testModuleContents
		
	});
	
	return testCase;
	
};


// ************************************************************
// CONTROLLER TESTS
// ************************************************************


/**
 * @class
 * A collection of tests to test the Controller class.
 */
flyui.genefinder.ControllerTests = function() {};


/** 
 * Set up function for the flyui.genefinder ModuleTests.
 * @param {String} endpointURL URL of service
 * @param {YAHOO.tool.TestCase} testCase the test case context
 */
flyui.genefinder.ControllerTests.setUpTest = function( endpointURL, testCase ) {
	try {
		trace("setUp test");
		// create a model
		testCase.model = new flyui.mvcutils.GenericModel2();
		testCase.model.setDefinition(flyui.genefinder.modelDefinition);
	
		// create a service
		testCase.service = new flyui.flybase.Service(endpointURL);
		
		// create a dummy widget
		testCase.dummyWidget = {
			_geneSelectedEvent : new YAHOO.util.CustomEvent("Dummy widget gene selected event"),
			_genesFoundEvent : new YAHOO.util.CustomEvent("Dummy widget genes found event")
		};
		
		// create a new controller instance
		testCase.controller = new flyui.genefinder.Controller(testCase.model, testCase.service, testCase.dummyWidget);
		
	} catch (e) {
		flyui.err("setUp error, "+e.name+", "+e.message);
	}
};


/** 
 * Tear down function for the flyui.genefinder ModuleTests.
 * @param {YAHOO.tool.TestCase} testCase the test case context
 */
flyui.genefinder.ControllerTests.tearDownTest = function( testCase ) {
	try {
		trace("tearDown test");
	} catch (e) {
		flyui.err("tearDown error, "+e.name+", "+e.message);
	}
};


/**
 * Test the model definition and initialisation.
 * @synchronous
 */
flyui.genefinder.ControllerTests.testModelInit = function( testCase ) {
	flyui.info("Test \"==== flyui.genefinder ControllerTests :: testModelInit ====\" started.");

	// create a model
	var model = testCase.model;

	// check the model properties
	assert.areEqual("READY", model.get("STATE"));
	assert.isNull(model.get("RESULTS"));
	assert.isNull(model.get("ERRORMESSAGE"));
	assert.isNull(model.get("QUERY"));
	assert.isNull(model.get("SELECTIONINDEX"));
	
};


/**
 * Test the Controller class constructor.
 * @param {YAHOO.tool.TestCase} testCase the test case context
 * @synchronous
 */
flyui.genefinder.ControllerTests.testControllerConstructor = function( testCase ) {
	flyui.info("Test \"==== flyui.genefinder ControllerTests :: testControllerConstructor ====\" started.");

	// create a new controller instance
	var controller = testCase.controller;
	
	// check the API
	assert.isNotUndefined(controller.findGenesByAnyName);
	assert.isNotUndefined(controller.setSelectionIndex);
	
	// TODO more?
};


/**
 * Test the private implementation of the findGenesByAnyName method on the Controller class.
 * @param {YAHOO.tool.TestCase} testCase the test case context
 * @asynchronous
 */
flyui.genefinder.ControllerTests.test_findGenesByAnyName = function( testCase ) {
	flyui.info("Test \"==== flyui.genefinder ControllerTests :: test_findGenesByAnyName ====\" started.");
	
	var controller = testCase.controller;
	var model = testCase.model;
	
	// define a success callback
	var success = function(genes) {
		trace("success case, resume test runner");
		testCase.resume();
	};
	
	// define a failure callback
	var failure = function(response) {
		trace("failure case, resume test runner");
		testCase.resume(function() {
			assert.fail("request failed, status "+response.status+" "+response.statusText);
		});
	};
	
	// make the call
	controller._findGenesByAnyName("foo", success, failure);
	
	// test the model
	assert.areEqual("PENDING", model.get("STATE"));
	
	// test the query input
	assert.areEqual("foo", model.get("QUERY"));
	
	trace("suspend test runner (hang here means problem)");
	testCase.wait();
	
}


/**
 * TODO doc me
 * @synchronous
 */
flyui.genefinder.ControllerTests.test_findGenesByAnyNameSuccess = function( testCase ) {
	flyui.info("Test \"==== flyui.genefinder ControllerTests :: test_findGenesByAnyNameSuccess ====\" started.");
	
	var controller = testCase.controller;
	
	// TODO make model state pending
	
	// make the call
	var genes = [];
	controller._findGenesByAnyNameSuccess(genes);
	
	var model = testCase.model;
	
	// check the state
	assert.areEqual("READY", model.get("STATE"));
	
	// check the results
	var results = model.get("RESULTS");
	assert.isNotUndefined(results);
	assert.isNotUndefined(results.length);
	assert.areEqual(0, results.length);
	
}


/**
 * TODO doc me
 */
flyui.genefinder.ControllerTests.test_findGenesByAnyNameFailure = function( testCase ) {
	flyui.info("Test \"==== flyui.genefinder ControllerTests :: test_findGenesByAnyNameFailure ====\" started.");
	
	var controller = testCase.controller;
	
	// make the call
	var response = {status:999, statusText:"dummy error for testing"};
	controller._findGenesByAnyNameFailure(response);
	
	var model = testCase.model;

	// check the state
	assert.areEqual("SERVERERROR", model.get("STATE"));
	
	// check the error message
	var msg = model.get("ERRORMESSAGE");
	trace("error message: "+msg);
	assert.isNotNull(msg);
	
}


/**
 * TODO doc me
 */
flyui.genefinder.ControllerTests.testSetSelection = function( testCase ) {
	flyui.info("Test \"==== flyui.genefinder ControllerTests :: testSetSelection ====\" started.");
	
	var model = testCase.model;
	var controller = testCase.controller;
	
	// fake results
	var results = [{flybaseID:"FBgn12345"}, {flybaseID:"FBgn54321"}];
	model.set("RESULTS", results);
	
	// try setting selection index
	controller.setSelectionIndex(0);
	assert.areEqual(0, model.get("SELECTIONINDEX"));
	controller.setSelectionIndex(1);
	assert.areEqual(1, model.get("SELECTIONINDEX"));

	// try out of bounds
	try {
		controller.setSelectionIndex(2);
		assert.fail("should not be reached, expected exception to be thrown");
	} catch (e) {
		trace("expected exception was thrown, "+e.name+", "+e.message);
		assert.areEqual("flyui.genefinder.SelectionOutOfBounds", e.name);
	}
	
}


/** 
 * Construct a YUI test case for the flyui.genefinder ControllerTests.
 * @param {String} endpointURL URL of service
 * @return a YUI test case
 * @type YAHOO.tool.TestCase
 */
flyui.genefinder.ControllerTestCase = function( endpointURL ) {
	
	var testCase = new YAHOO.tool.TestCase({
		
		name: "=== flyui.genefinder ControllerTests ===",
		
		setUp : function() {
			flyui.genefinder.ControllerTests.setUpTest(endpointURL, this);
		},
		
		tearDown : function() {
			flyui.genefinder.ControllerTests.tearDownTest(this);
		},
		
		testModelInit : function() {
			flyui.genefinder.ControllerTests.testModelInit(this);
		},
		
		testControllerConstructor : function() {
			flyui.genefinder.ControllerTests.testControllerConstructor(this);
		}, 
		
		test_findGenesByAnyName : function() {
			flyui.genefinder.ControllerTests.test_findGenesByAnyName(this);
		}, 
		
		test_findGenesByAnyNameSuccess : function() {
			flyui.genefinder.ControllerTests.test_findGenesByAnyNameSuccess(this);
		},
		
		test_findGenesByAnyNameFailure : function() {
			flyui.genefinder.ControllerTests.test_findGenesByAnyNameFailure(this);
		}, 
		
		testSetSelection : function() {
			flyui.genefinder.ControllerTests.testSetSelection(this);
		}

	});
	
	return testCase;
	
};


// ************************************************************
// DEFAULT RENDERER TESTS
// ************************************************************


/**
 * @class
 * A collection of tests to test the DefaultRenderer class.
 */
flyui.genefinder.DefaultRendererTests = function() {};


/** 
 * Set up function for the flyui.genefinder DefaultRendererTests.
 * @param {YAHOO.tool.TestCase} testCase the test case context
 */
flyui.genefinder.DefaultRendererTests.setUpTest = function( testCase ) {
	try {
		trace("setUp test");
		
		trace("create a model");
		testCase.model = new flyui.mvcutils.GenericModel2();
		testCase.model.setDefinition(flyui.genefinder.modelDefinition);
		
		trace("create an element for the renderer");
		testCase.renderPane = document.createElement("div");
		
		trace("put the renderer's div into the dom");
		document.body.appendChild(testCase.renderPane);
		
		trace("create a renderer");
		testCase.renderer = new flyui.genefinder.DefaultRenderer();
		testCase.renderer.setCanvas(testCase.renderPane);
		testCase.pendingPane = testCase.renderPane.childNodes[0];
		testCase.resultsSummaryPane = testCase.renderPane.childNodes[1];
		testCase.resultsPane = testCase.renderPane.childNodes[2];
		testCase.messagePane = testCase.renderPane.childNodes[3];
		
		trace("connect the renderer the model");
		testCase.renderer.connect(testCase.model);
		
		trace("set dummy user event handler");
		testCase.renderer.setUserEventHandler({
			_onResultClicked : function(event, index) {
				trace("received click event, selection: "+index);	
			}
		});
				
	} catch (e) {
		flyui.err("setUp error, "+e.name+", "+e.message);
	}
};


/** 
 * Tear down function for the flyui.genefinder DefaultRendererTests.
 * @param {YAHOO.tool.TestCase} testCase the test case context
 */
flyui.genefinder.DefaultRendererTests.tearDownTest = function( testCase ) {
	try {
		trace("tearDown test");
		
		trace("remove the renderer element from the dom");
		document.body.removeChild(testCase.renderPane); 
		
	} catch (e) {
		flyui.err("tearDown error, "+e.name+", "+e.message);
	}
};


/**
 * TODO doc me
 */
flyui.genefinder.DefaultRendererTests.testAPI = function( testCase ) {
	flyui.info("Test \"==== flyui.genefinder DefaultRenderer Tests :: testAPI ====\" started.");
		
	var renderer = testCase.renderer;
	
	assert.isNotUndefined(renderer, "renderer");
	assert.isNotUndefined(renderer.connect, "renderer.connect");
	assert.isNotUndefined(renderer._onStateChanged, "renderer._onStateChanged");
	assert.isNotUndefined(renderer._onQueryChanged, "renderer._onQueryChanged");
	assert.isNotUndefined(renderer._onResultsChanged);
	assert.isNotUndefined(renderer._onSelectionIndexChanged);
	assert.isNotUndefined(renderer._onErrorMessageChanged);
	assert.isNotUndefined(renderer._canvas);
	assert.isNotUndefined(renderer._pendingPane);
	assert.isNotUndefined(renderer._messagePane);
	assert.isNotUndefined(renderer._resultsSummaryPane);
	assert.isNotUndefined(renderer._resultsPane);

}


/**
 * TODO doc me
 */
flyui.genefinder.DefaultRendererTests.testMainComponents = function( testCase ) {
	flyui.info("Test \"==== flyui.genefinder DefaultRenderer Tests :: testMainComponents ====\" started.");

	var renderPane = testCase.renderPane;
	var renderer = testCase.renderer;
	var pp = testCase.pendingPane;
	var mp = testCase.messagePane;
	var rsp = testCase.resultsSummaryPane;
	var rp = testCase.resultsPane;
	
	var children = renderPane.childNodes;
	trace(renderPane.innerHTML);
	for ( var i=0; i<children.length; i++ ) {
		trace("found child: "+children[i]);
	}
	assert.areEqual(4, children.length, "number of child elements not as expected");
	
	trace("check pending pane");
	assert.isNotVisible(pp, "pending pane should not be visible");

	trace("check message pane");
	assert.isNotVisible(mp, "message pane should not be visible");

	trace("check results summary pane");
	assert.isNotVisible(rsp, "results summary pane should not be visible");

	trace("check results pane");
	assert.isNotVisible(rp, "results pane should not be visible");
	
}


/**
 * TODO doc me
 */
flyui.genefinder.DefaultRendererTests.testModelStateChangeToPending = function( testCase ) {
	flyui.info("Test \"==== flyui.genefinder DefaultRenderer Tests :: testModelStateChangeToPending ====\" started.");
	
	var model = testCase.model;
	var pp = testCase.pendingPane;
	var mp = testCase.messagePane;
	var rsp = testCase.resultsSummaryPane;
	var rp = testCase.resultsPane;
	
	trace("set the model state to pending");
	model.set("STATE", "PENDING");
	
	trace("check the pending pane is visible");
	assert.isVisible(pp, "pending pane should be visible");

	trace("check the message pane is not visible");
	assert.isNotVisible(mp, "message pane should be invisible");

	trace("check the results summary pane is not visible");
	assert.isNotVisible(rsp, "results summary pane should be invisible");

	trace("check the results pane is not visible");
	assert.isNotVisible(rp, "results pane should be invisible");
}


/**
 * TODO doc me
 */
flyui.genefinder.DefaultRendererTests.testModelStateChangeToReady = function( testCase ) {
	flyui.info("Test \"==== flyui.genefinder DefaultRenderer Tests :: testModelStateChangeToReady ====\" started.");
	
	var model = testCase.model;
	var pp = testCase.pendingPane;
	var mp = testCase.messagePane;
	var rsp = testCase.resultsSummaryPane;
	var rp = testCase.resultsPane;
	
	trace("set the model state to ready");
	model.set("STATE", "READY");
	
	trace("check the pending pane is not visible");
	assert.isNotVisible(pp, "pending pane should be invisible");

	trace("check the message pane is visible");
	assert.isVisible(mp, "message pane should be visible");

	trace("check the results summary pane is visible");
	assert.isVisible(rsp, "results summary pane should be visible");

	trace("check the results pane is visible");
	assert.isVisible(rp, "results pane should be visible");
	
}


/**
 * TODO doc me
 */
flyui.genefinder.DefaultRendererTests.testModelStateChangeToServerError = function( testCase ) {
	flyui.info("Test \"==== flyui.genefinder DefaultRenderer Tests :: testModelStateChangeToServerError ====\" started.");
	
	var model = testCase.model;
	var pp = testCase.pendingPane;
	var mp = testCase.messagePane;
	var rsp = testCase.resultsSummaryPane;
	var rp = testCase.resultsPane;
	
	trace("set the model state to pending");
	model.set("STATE", "PENDING");	
	
	trace("set the model state to server error");
	model.set("STATE", "SERVERERROR");
	
	trace("check the pending pane is not visible");
	assert.isNotVisible(pp, "pending pane should be invisible");

	trace("check the message pane is visible");
	assert.isVisible(mp, "message pane should be visible");

	trace("check the results summary pane is not visible");
	assert.isNotVisible(rsp, "results summary pane should be invisible");

	trace("check the results pane is not visible");
	assert.isNotVisible(rp, "results pane should be invisible");
}


/**
 * TODO doc me
 */
flyui.genefinder.DefaultRendererTests.testModelStateChangeToUnexpectedError = function( testCase ) {
	flyui.info("Test \"==== flyui.genefinder DefaultRenderer Tests :: testModelStateChangeToUnexpectedError ====\" started.");
	
	var model = testCase.model;
	var pp = testCase.pendingPane;
	var mp = testCase.messagePane;
	var rsp = testCase.resultsSummaryPane;
	var rp = testCase.resultsPane;
	
	trace("set the model state to pending");
	model.set("STATE", "PENDING");	
	
	trace("set the model state to unexpected error");
	model.set("STATE", "UNEXPECTEDERROR");
	
	trace("check the pending pane is not visible");
	assert.isNotVisible(pp, "pending pane should be invisible");

	trace("check the message pane is visible");
	assert.isVisible(mp, "message pane should be visible");

	trace("check the results summary pane is not visible");
	assert.isNotVisible(rsp, "results summary pane should be invisible");

	trace("check the results pane is not visible");
	assert.isNotVisible(rp, "results pane should be invisible");
}


/**
 * TODO doc me
 */
flyui.genefinder.DefaultRendererTests.testOneResult = function( testCase ) {
	flyui.info("Test \"==== flyui.genefinder DefaultRenderer Tests :: testOneResult ====\" started.");
	
	var renderPane = testCase.renderPane;
	var model = testCase.model;
	var pp = testCase.pendingPane;
	var mp = testCase.messagePane;
	var rsp = testCase.resultsSummaryPane;
	var rp = testCase.resultsPane;
	var testData = new flyui.flybase.TestData();
	var genes = [testData.FBgn0004372];
	
	trace("set the model query");
	model.set("QUERY", "aly");
	
	trace("set the model results");
	model.set("RESULTS", genes);
	
	trace("checking the results summary pane");
	flyui.genefinder.assertResultsSummaryPaneAsExpected(1, "aly", rsp);

	trace("checking the results pane");
	flyui.genefinder.assertResultsPaneAsExpected(genes, rp);
		
}


/**
 * TODO doc me
 */
flyui.genefinder.DefaultRendererTests.testZeroResults = function( testCase ) {
	
	flyui.info("Test \"==== flyui.genefinder DefaultRenderer Tests :: testZeroResults ====\" started.");
	
	var renderPane = testCase.renderPane;
	var model = testCase.model;
	var pp = testCase.pendingPane;
	var mp = testCase.messagePane;
	var rsp = testCase.resultsSummaryPane;
	var rp = testCase.resultsPane;
	var genes = [];
	
	trace("set the model query");
	model.set("QUERY", "foo");
	
	trace("set the model results");
	model.set("RESULTS", genes);
	
	trace("checking the results summary pane");
	flyui.genefinder.assertResultsSummaryPaneAsExpected(0, "foo", rsp);

	trace("checking the results pane");
	flyui.genefinder.assertResultsPaneAsExpected(genes, rp);

}


/**
 * TODO doc me
 */
flyui.genefinder.DefaultRendererTests.testMultipleResults = function( testCase ) {
	flyui.info("Test \"==== flyui.genefinder DefaultRenderer Tests :: testMultipleResults ====\" started.");
	
	var renderPane = testCase.renderPane;
	var model = testCase.model;
	var pp = testCase.pendingPane;
	var mp = testCase.messagePane;
	var rsp = testCase.resultsSummaryPane;
	var rp = testCase.resultsPane;
	var testData = new flyui.flybase.TestData();
	
	var genes = [testData.FBgn0004903, testData.FBgn0015799];
	
	trace("set the model query");
	model.set("QUERY", "rbf");
	
	trace("set the model results");
	model.set("RESULTS", genes);
	
	trace("checking the results summary pane");
	flyui.genefinder.assertResultsSummaryPaneAsExpected(2, "rbf", rsp);

	trace("checking the results pane");
	flyui.genefinder.assertResultsPaneAsExpected(genes, rp);

};


/**
 * TODO doc me
 */
flyui.genefinder.DefaultRendererTests.testSetErrorMessage = function( testCase ) {
	flyui.info("Test \"==== flyui.genefinder DefaultRenderer Tests :: testSetErrorMessage ====\" started.");
	
	var renderPane = testCase.renderPane;
	var model = testCase.model;
	var pp = testCase.pendingPane;
	var mp = testCase.messagePane;
	var rsp = testCase.resultsSummaryPane;
	var rp = testCase.resultsPane;

	var msg = "this is a test error message";
	model.set("ERRORMESSAGE", msg);
	
	assert.areEqual(msg, mp.innerHTML);
};


flyui.genefinder.DefaultRendererTests.testSetSelectionIndex = function( testCase ) {
	flyui.info("Test \"==== flyui.genefinder DefaultRenderer Tests :: testSetSelectionIndex ====\" started.");

	var renderPane = testCase.renderPane;
	var model = testCase.model;
	var children = renderPane.childNodes;
	var resultsPane = children[3];
	var testData = new flyui.flybase.TestData();
	
	// first mock up some results
	var genes = [testData.FBgn0004903, testData.FBgn0015799];
	trace("set the model results");
	model.set("RESULTS", genes);
	
	// check nothing selected
	var rows = YAHOO.util.Selector.query("tr", resultsPane);
	for (var i=0; i<rows.length; i++) {
		assert.isFalse(YAHOO.util.Dom.hasClass(rows[i], "selected"), "nothing should be selected");
	}
	
	// set selection
	model.set("SELECTIONINDEX", 0);
	
	// check only zeroth element selected
	for (var i=0; i<rows.length; i++) {
		trace("SELECTIONINDEX 0: selected("+i+") "+YAHOO.util.Dom.hasClass(rows[i], "selected") + " classNames: "+rows[i].className);
		//assert.areEqual(i==0+1, YAHOO.util.Dom.hasClass(rows[i], "selected"));
	}
	
	// set selection
	model.set("SELECTIONINDEX", 1);
	
	// check only first element selected
	for (var i=0; i<rows.length; i++) {
		assert.areEqual(i==1+1, YAHOO.util.Dom.hasClass(rows[i], "selected"));
	}

}


/**
 * TODO doc me
 */
flyui.genefinder.assertResultsSummaryPaneAsExpected = function( count, query, summaryPane ) {
	var content = summaryPane.innerHTML;
	trace("innerHTML: "+content);

	/* check the results summary pane content
	 * expect something like...
	 * found 1 matching gene from .. for query "rbf"
	 */
//	var spans = YAHOO.util.Selector.query("span", summaryPane);
//	assert.areEqual(2, spans.length);
//	assert.areEqual(count, spans[0].innerHTML);
//	assert.areEqual(query, spans[1].innerHTML);
//	trace("showing?");
//	assert.isTrue(content.indexOf("showing")>=0);
	trace("count?");
	assert.isTrue(content.indexOf(count)>=0);
	trace("query?");
	assert.isTrue(content.indexOf(query)>=0);
	
};


/**
 * TODO doc me
 */
flyui.genefinder.assertResultsPaneAsExpected = function( genes, resultsPane ) {
	
	if (genes.length > 0) {
	
		/* check the results pane
		 * expect something like...
		 * <div>
		 *   <table>
		 *     <thead>
		 *       <tr>
		 *         <th>symbol</th><th>full name</th><th>annotation ID</th><th>flybase ID</th><th>user selection</th>
		 * 	     </tr>
		 *     </thead>
		 *     <tbody>
		 *       <tr>
		 *         ...
		 *       </tr>
		 *       ...
		 *     </tbody>
		 *   </table>
		 * </div>
		 */
		trace(resultsPane.innerHTML);
		var rows = YAHOO.util.Selector.query("tr", resultsPane);
		assert.areEqual(genes.length+1, rows.length); // expect 1 more row than results, including headings row
		
		trace("check the rendered result headings");
		trace(rows[0].innerHTML);
		var th = YAHOO.util.Selector.query("th", rows[0]);
		assert.areEqual(5, th.length);
//		assert.areEqual("Symbol", th[0].innerHTML);
//		assert.areEqual("Name", th[1].innerHTML);
//		assert.areEqual("Annotation ID", th[2].innerHTML);
//		assert.areEqual("Link to FlyBase", th[3].innerHTML);
		
		for ( var i=0; i<genes.length; i++ ) {
			trace("checking rendered result row "+(i+1));
			flyui.genefinder.assertGeneTableRowAsExpected(genes[i], rows[i+1]); 
		}

	}
	else {
		assert.areEqual("", resultsPane.innerHTML); // if no genes, pane is empty
	}
		
};


/**
 * TODO doc me
 */
flyui.genefinder.assertGeneTableRowAsExpected = function( gene, row ) {
	trace("check the rendered result values");
	trace(row.innerHTML);

	/*
	 * expect something like...
	 * <tr><td>aly</td><td>always early</td><td>CG2075</td><td>FBgn0004372</td><td>select this gene</td></tr>
	 */
	var cells  = YAHOO.util.Selector.query("td", row);
	assert.areEqual(5, cells.length, "number of table cells not as expected");
//	assert.areEqual(gene.symbols.join(" / "), cells[0].innerHTML);
//	assert.areEqual(gene.fullNames.join(" / "), cells[1].innerHTML);
//	assert.areEqual(gene.annotationSymbols.join(" / "), cells[2].innerHTML);

//	var flybaseLink = cells[3].childNodes[0];
//	assert.areEqual("http://flybase.org/reports/"+gene.flybaseID+".html", flybaseLink.href);
//	assert.areEqual(gene.flybaseID, flybaseLink.innerHTML);

};

/** 
 * Construct a YUI test case for the flyui.genefinder DefaultRendererTests.
 * @return a YUI test case
 * @type YAHOO.tool.TestCase
 */
flyui.genefinder.DefaultRendererTestCase = function() {
	
	var testCase = new YAHOO.tool.TestCase({
		
		name: "=== flyui.genefinder DefaultRenderer Tests ===",
		
		setUp : function() {
			flyui.genefinder.DefaultRendererTests.setUpTest(this);
		},
		
		tearDown : function() {
			flyui.genefinder.DefaultRendererTests.tearDownTest(this);
		},
		
		testAPI : function() {
			flyui.genefinder.DefaultRendererTests.testAPI(this);
		},
		
		testMainComponents : function() {
			flyui.genefinder.DefaultRendererTests.testMainComponents(this);	
		}, 
		
		testModelStateChangeToPending : function() {
			flyui.genefinder.DefaultRendererTests.testModelStateChangeToPending(this);
		},
		
		testModelStateChangeToReady : function() {
			flyui.genefinder.DefaultRendererTests.testModelStateChangeToReady(this);
		},

		testModelStateChangeToServerError : function() {
			flyui.genefinder.DefaultRendererTests.testModelStateChangeToServerError(this);
		},

		testModelStateChangeToUnexpectedError : function() {
			flyui.genefinder.DefaultRendererTests.testModelStateChangeToUnexpectedError(this);
		},

		testOneResult : function() {
			flyui.genefinder.DefaultRendererTests.testOneResult(this);
		}, 
		
		testZeroResults : function() {
			flyui.genefinder.DefaultRendererTests.testZeroResults(this);
		}, 
		
		testMultipleResults : function() {
			flyui.genefinder.DefaultRendererTests.testMultipleResults(this);
		}, 
		
		testSetErrorMessage : function() {
			flyui.genefinder.DefaultRendererTests.testSetErrorMessage(this);
			
		},
		
		testSetSelectionIndex : function() {
			flyui.genefinder.DefaultRendererTests.testSetSelectionIndex(this);
		}
		
	});
	
	return testCase;
	
};


/**
 * TODO doc me
 * @class
 */
flyui.genefinder.WidgetTests = function() {};


/** 
 * Set up function for the flyui.genefinder ModuleTests.
 * @param {String} endpointURL URL of service
 * @param {YAHOO.tool.TestCase} testCase the test case context
 */
flyui.genefinder.WidgetTests.setUpTest = function( endpointURL, testCase ) {
	try {
		trace("setUp test");
		
		// create a renderer
		trace("create an element for the renderer");
		testCase.renderPane = document.createElement("div");
		
		trace("put the renderer's div into the dom");
		document.body.appendChild(testCase.renderPane);
		
		trace("create a renderer");
		var renderer = new flyui.genefinder.DefaultRenderer();
		renderer.setCanvas(testCase.renderPane);
		
		// create a service
		var service = new flyui.flybase.Service(endpointURL);
		
		// create a widget and store it
		testCase.testWidget = new flyui.genefinder.Widget(service, renderer);

	} catch (e) {
		flyui.err("setUp error, "+e.name+", "+e.message);
	}
};


/** 
 * Tear down function for the flyui.genefinder ModuleTests.
 * @param {YAHOO.tool.TestCase} testCase the test case context
 */
flyui.genefinder.WidgetTests.tearDownTest = function( testCase ) {
	try {
		trace("tearDown test");
		
		trace("remove the renderer element from the dom");
		document.body.removeChild(testCase.renderPane); 
		
	} catch (e) {
		flyui.err("tearDown error, "+e.name+", "+e.message);
	}
};


/**
 * TODO doc me
 */
flyui.genefinder.WidgetTests.testClickSelection = function( testCase ) {
	flyui.info("Test \"==== flyui.genefinder Widget Tests :: testClickSelection ====\" started.");

	// get our widget
	var widget = testCase.testWidget;
	
	// set a gene variable as null which will be set if listener gets called back
	var geneContainer = {gene: null};
	
	// define a listener to get notified with a gene object and store value for later testing
	var selectionListener = function(type, args, obj) {
		// type is the event type
		// args is the array of arguments passed to the fire() method, in this case we expect a gene
		// obj is the custom object passed to the subscribe() method
		trace("selection listener received call, type: "+type+" args: "+args+" obj:"+obj);
		
		// check type
		assert.areEqual("GENESELECTED", type);
		
		// check args
		assert.areEqual(1, args.length);
		
		// store gene in obj (should be geneContainer)
		obj.gene = args[0];
	};
	
	// subscribe a listener to the widget
	widget.subscribe("GENESELECTED", selectionListener, geneContainer);
	
	// inject some results into model
	var testData = new flyui.flybase.TestData();
	var genes = [testData.FBgn0004903, testData.FBgn0015799];
	var model = widget._model;
	model.set("RESULTS", genes); 
	
	// check no selection
	assert.isNull(model.get("SELECTIONINDEX"), "Initial selection should be null");
	
	// get something to click and click it
	var renderer = widget._renderer;
	var widgetDom = renderer._resultsPane ;
	var rows = widgetDom.getElementsByTagName("tr");
	// TODO: consider splitting this as separate test...

	// Select header row and click it.  Nothing should be selected.
	YAHOO.util.UserAction.click(rows[0]);
	assert.isNull(model.get("SELECTIONINDEX"), "Initial selection should still be null");
	assert.isNull(geneContainer.gene, "Selected gene should still be null");

	// Select first data row and check model updates accordingly, also widget event firing
	YAHOO.util.UserAction.click(rows[1]);
	assert.areEqual(0, model.get("SELECTIONINDEX"), "Selection index should be 0"); 
	assert.isNotNull(geneContainer.gene, "Selected gene should be non-null"); // we're here!!!
	flyui.flybase.TestData.compareGenes(testData.FBgn0004903, geneContainer.gene);

	// Select second data row and check model updates accordingly, also widget event firing
	YAHOO.util.UserAction.click(rows[2]);
	assert.areEqual(1, model.get("SELECTIONINDEX"), "Selection index should be 1");
	assert.isNotNull(geneContainer.gene, "Selected gene should be non-null");
	flyui.flybase.TestData.compareGenes(testData.FBgn0015799, geneContainer.gene);

};


/** 
 * Construct a YUI test case for the flyui.genefinder DefaultRendererTests.
 * @return a YUI test case
 * @type YAHOO.tool.TestCase
 */
flyui.genefinder.WidgetTestCase = function(endpointURL) {
	
	var testCase = new YAHOO.tool.TestCase({
		
		name: "=== flyui.genefinder Widget Tests ===",
		
		setUp : function() {
			flyui.genefinder.WidgetTests.setUpTest(endpointURL, this);
		},
		
		tearDown : function() {
			flyui.genefinder.WidgetTests.tearDownTest(this);
		},
		
		testClickSelection : function() {
			flyui.genefinder.WidgetTests.testClickSelection(this);
		}
	});
	
	return testCase;

}




// ************************************************************
// TEST SUITE & RUNNER
// ************************************************************


/** 
 * Construct a YUI test suite for the flyui.genefinder module.
 * @param {String} endpointURL URL of service
 * @return a YUI test suite
 * @type YAHOO.tool.TestSuite
 */
flyui.genefinder.TestSuite = function(endpointURL) {
	var suite = new YAHOO.tool.TestSuite("== flyui.genefinder Test Suite ==");
	suite.add(flyui.genefinder.ModuleTestCase());
	suite.add(flyui.genefinder.ControllerTestCase(endpointURL));
	suite.add(flyui.genefinder.DefaultRendererTestCase());
	suite.add(flyui.genefinder.WidgetTestCase(endpointURL));
	return suite;
}

/** 
 * Run the flyui.genefinder test suite.
 * @param {String} endpointURL URL of service
 */
flyui.genefinder.runTests = function(endpointURL) {
	trace("flyui.genefinder :: running tests");
	YAHOO.tool.TestRunner.add(flyui.genefinder.TestSuite(endpointURL));
	YAHOO.tool.TestRunner.run();
}
