/**
 * @fileoverview
 * This script defines a widget for finding Drosophila melanogaster genes via FlyBase.
 * @author <a href="http://purl.org/net/aliman">Alistair Miles</a>
 * @version $Revision:539 $ on $Date: 2008-08-13 16:09:30 +0100 (Wed, 13 Aug 2008) $ by $Author: aliman $
 * @requires YAHOO.log
 * @requires YAHOO.lang.JSON
 * @requires YAHOO.util.Dom
 * @requires YAHOO.util.Connect
 * @requires YAHOO.util.CustomEvent
 * @requires flyui.util
 * @requires flyui.flybase
 * TODO license terms
 */
 
 
// create a namespace if not already defined
flyui.namespace("flyui.genefinder");

/*
 * ----------------------------------------------------------------
 *                             WIDGET
 * ----------------------------------------------------------------
 */


/** 
 * Create a new widget instance.
 * @class
 * A widget for finding and displaying D. melanogaster genes from FlyBase.
 * @constructor
 * @param {flyui.flybase.Service} service the service to use to retrieve data from
 * @param {Object} renderer the renderer to use with this widget instance (see also flyui.genefinder.DefaultRenderer)
 */
flyui.genefinder.Widget = function( service, renderer ) {
	
	// do initialisation
	this._Widget(service, renderer);
	
};

/** @private */
flyui.genefinder.Widget.prototype._controller = null;

/**
 * @private
 * @type flyui.mvcutils.GenericModel2
 */ 
flyui.genefinder.Widget.prototype._model = null;

/**
 * @private
 */
flyui.genefinder.Widget.prototype._renderer = null;

/**
 * @private
 */
flyui.genefinder.Widget.prototype._service = null;

/**
 * @private
 */
flyui.genefinder.Widget.prototype._geneSelectedEvent = null;

/**
 * @private
 */
flyui.genefinder.Widget.prototype._genesFoundEvent = null;

/**
 * @private
 * TODO doc me
 */
flyui.genefinder.Widget.prototype._Widget = function(service, renderer) {
	var _context = "flyui.genefinder.Widget.prototype._Widget";
	try {
        
        this._service = service;
        this._renderer = renderer;
        
        // create events
        this._geneSelectedEvent = new YAHOO.util.CustomEvent("GENESELECTED", this);
        this._genesFoundEvent = new YAHOO.util.CustomEvent("GENESFOUND", this);
    
        // create a model
        this._model = new flyui.mvcutils.GenericModel2();
        this._model.setDefinition(flyui.genefinder.modelDefinition);
        
        // instantiate the controller
        this._controller = new flyui.genefinder.Controller(this._model, service, this);
        
        // connect the renderer to the model
        this._renderer.connect(this._model);
        
        // instantiate a user event handler and pass to renderer
        this._renderer.setUserEventHandler(new flyui.genefinder.UserEventHandler(this._controller));
        	    
    } catch (e) {
        flyui.debug("caught "+e.name, ", "+e.message, _context);
        throw new flyui.UnexpectedException(_context, e);
    }    
};


/**
 * Subscribe to a custom event.
 * @param {String} type the type of the event
 * @param {Function} listener the callback function
 * @param {Object} obj a custom object, passed back to the callback function 
 */
flyui.genefinder.Widget.prototype.subscribe = function(type, listener, obj) {
    var _context = "flyui.genefinder.Widget.prototype.subscribe";
    try {
        if (type == "GENESELECTED") {
            this._geneSelectedEvent.subscribe(listener, obj);
        }
        else if (type == "GENESFOUND") {
            this._genesFoundEvent.subscribe(listener, obj);
        }
    } catch (e) {
        flyui.debug("caught "+e.name, ", "+e.message, _context);
        throw new flyui.UnexpectedException(_context, e);
    }    
};







/**
 * Find Drosophila genes by any gene name or identifier (case insensitive).
 * @param {String} anyName the name or identifier to search by
 */
flyui.genefinder.Widget.prototype.findGenesByAnyName = function( anyName ) {
    var _context = "flyui.genefinder.Widget.prototype.findGenesByAnyName";
    try {
        flyui.debug("pass through to controller", _context);
        this._controller.findGenesByAnyName(anyName);
    } catch (e) {
        flyui.debug("caught "+e.name, ", "+e.message, _context);
        throw new flyui.UnexpectedException(_context, e);
    }    
};









/**
 * Find Drosophila genes by any gene name or identifier (case insensitive).
 * @param {String} anyName the name or identifier to search by
 */
flyui.genefinder.Widget.prototype.findGenesByAnyNameBatch = function( names ) {
    var _context = "flyui.genefinder.Widget.prototype.findGenesByAnyNameBatch";
    try {
        flyui.debug("pass through to controller: "+names, _context);
        this._controller.findGenesByAnyNameBatch(names);
    } catch (e) {
        flyui.debug("caught "+e.name, ", "+e.message, _context);
        throw new flyui.UnexpectedException(_context, e);
    }    
};












/**
 * Set the selection index, where more than one genes are available.
 * @param {Number} index the new selection index
 */
flyui.genefinder.Widget.prototype.setSelectionIndex = function( index ) {
    var _context = "flyui.genefinder.Widget.prototype.setSelectionIndex";
    try {
        flyui.debug("pass through to controller", _context);
        this._controller.setSelectionIndex(index);
    } catch (e) {
        flyui.debug("caught "+e.name, ", "+e.message, _context);
        throw new flyui.UnexpectedException(_context, e);
    }    
};








/**
 * Create a new user event handler for the GeneFinder widget.
 * @class
 * Handles user events (clicks etc.) for the genefinder widget.
 * @constructor
 * @param {flyui.genefinder.Controller} controller the widget's controller
 */
flyui.genefinder.UserEventHandler = function( controller ) {

    /**
     * @private
     * Handle a mouse click on a result.
     * @param event the browser event
     * @param {Number} index the index of the result clicked
     */
	this._onResultClicked = function( event, index ) {
	    var _context = "flyui.genefinder.UserEventHandler this._onResultClicked";
	    try {
            flyui.info("received click event, call the controller to set selection: "+index, _context); 
            controller.setSelectionIndex(index);	        
        } catch (e) {
            flyui.debug("caught "+e.name, ", "+e.message, _context);
            throw new flyui.UnexpectedException(_context, e);
        }    
	};	
	
};








/** 
 * Create a new controller instance.
 * @class
 * Controller class for the flyui.genefinder widget.
 * @constructor
 * @param {flyui.mvcutils.GenericModel2} model the model to use to store data
 * @param {flyui.flybase.Service} service the service to use to retrieve data from
 * @param {flyui.genefinder.Widget} widget the widget for which this is the controller
 */
flyui.genefinder.Controller = function( model, service, widget ) {
	
	var that = this;
	
	/**
	 * @private
	 */
	this._model = model;

	/**
	 * @private
	 */
	this._service = service;

	/**
	 * @private
	 */
	this._parent = widget;
	
	

	/**
	 * @private
	 * Success case callback for the findGenesByAnyName operation.
	 * @param {Array<flyui.flybase.Gene>} genes the results of the operation 
	 */
	this._findGenesByAnyNameSuccess = function( genes ) {
	    var _context = "flyui.genefinder.Controller this._findGenesByAnyNameSuccess";
        try {
            
            flyui.info("request success", _context);
            
            // set the results
            that._model.set("RESULTS", genes);
            
            // set model state
            that._model.set("STATE", "READY");
            
            // fire event
            flyui.info("firing GENESFOUND event", _context);
            var _event = that._parent._genesFoundEvent;
    //          flyui.debug("event: "+event, _context);
            _event.fire(genes);
    
            // auto-select if only one result
            if (genes.length == 1) {
                that.setSelectionIndex(0);
            }
            
        } catch (e) {
            flyui.debug("caught "+e.name, ", "+e.message, _context);
            throw new flyui.UnexpectedException(_context, e);
        }    
	};
	
	


    /**
     * @private
     * Success case callback for the findGenesByAnyNameBatch operation.
     * @param {Map<String,Array<Gene>>} map the results of the operation 
     */
    this._findGenesByAnyNameBatchSuccess = function( map ) {
        var _context = "flyui.genefinder.Controller this._findGenesByAnyNameBatchSuccess";
        try {
            
            flyui.info("request success", _context);
            
            flyui.debug("collect all genes from the result", _context);
            var allgenes = [];
            for (key in map) {
                var genes = map[key];
                for (var i=0;i<genes.length;i++) {
                    allgenes[allgenes.length] = genes[i];
                }
            }
            function genesort(x,y) {
                if (x.symbols[0] > y.symbols[0]) return 1;
                else return -1;
            }
            allgenes.sort(genesort);
            
            that._findGenesByAnyNameSuccess(allgenes);
            
        } catch (e) {
            flyui.debug("caught "+e.name, ", "+e.message, _context);
            throw new flyui.UnexpectedException(_context, e);
        }    
    };
    
    

	/**
	 * @private
	 * Failure case callback for the findGenesByAnyName operation.
	 * @param response the HTTP response object (YUI)
	 */
	this._findGenesByAnyNameFailure = function( response ) {
	    var _context = "flyui.genefinder.Controller this._findGenesByAnyNameFailure";
		try {
            flyui.err("request failed, status "+response.status+" "+response.statusText+" "+response.responseText, _context);
            
            // set the error message
            var msg = "There was an error retrieving data from FlyBase, see the logs for more info. The server may be busy or down, please try again later. If this message persists, please contact the Image Bioinformatics Research Group at bioimage@mail.ontonet.org.";        
            that._model.set("ERRORMESSAGE", msg);
    
            // set the state
            that._model.set("STATE", "SERVERERROR");        
        } catch (e) {
            flyui.debug("caught "+e.name, ", "+e.message, _context);
            throw new flyui.UnexpectedException(_context, e);
        }    
	};
	
};







/**
 * Find D. melanogaster genes by any name (case insensitive) including symbols, 
 * flybase IDs, synonyms.
 * @param {String} anyName any name, symbol or synonym
 */
flyui.genefinder.Controller.prototype.findGenesByAnyName = function( anyName ) {
    var _context = "flyui.genefinder.Controller.prototype.findGenesByAnyName";
    try {
        flyui.info("findGenesByAnyName: "+anyName, _context);
        flyui.debug("pass through to private method", _context);
        this._findGenesByAnyName(anyName, this._findGenesByAnyNameSuccess, this._findGenesByAnyNameFailure);
    } catch (e) {
        flyui.debug("caught "+e.name, ", "+e.message, _context);
        throw new flyui.UnexpectedException(_context, e);
    }    
};






/**
 * Find D. melanogaster genes by any name (case insensitive) including symbols, 
 * flybase IDs, synonyms.
 */
flyui.genefinder.Controller.prototype.findGenesByAnyNameBatch = function( names ) {
    var _context = "flyui.genefinder.Controller.prototype.findGenesByAnyNameBatch";
    try {
        flyui.info("findGenesByAnyNameBatch: "+names, _context);
        flyui.debug("pass through to private method", _context);
        this._findGenesByAnyNameBatch(names, this._findGenesByAnyNameBatchSuccess, this._findGenesByAnyNameFailure); // use same failure callback for now
    } catch (e) {
        flyui.debug("caught "+e.name, ", "+e.message, _context);
        throw new flyui.UnexpectedException(_context, e);
    }    
};






/**
 * @private
 * Implementation of findGenesByAnyName, allowing insertion of custom callbacks 
 * for testing.
 * @param {String} anyName any name, symbol or synonym
 * @param {Function} success callback
 * @param {Function} failure callback
 */
flyui.genefinder.Controller.prototype._findGenesByAnyName = function( anyName, success, failure ) {
    var _context = "flyui.genefinder.Controller.prototype._findGenesByAnyName";
    try {
        flyui.debug("_findGenesByAnyName: "+anyName, _context);
        
        flyui.debug("set state pending", _context);
        this._model.set("STATE", "PENDING");
        
        flyui.debug("set model property query", _context);
        this._model.set("QUERY", anyName);
        
        flyui.debug("kick off request", _context);
        this._service.findGenesByAnyName(anyName, success, failure);

    } catch (e) {
        flyui.debug("caught "+e.name, ", "+e.message, _context);
        throw new flyui.UnexpectedException(_context, e);
    }    
};







/**
 * @private
 * Implementation of findGenesByAnyName, allowing insertion of custom callbacks 
 * for testing.
 * @param {String} anyName any name, symbol or synonym
 * @param {Function} success callback
 * @param {Function} failure callback
 */
flyui.genefinder.Controller.prototype._findGenesByAnyNameBatch = function( names, success, failure ) {
    var _context = "flyui.genefinder.Controller.prototype._findGenesByAnyName";
    try {
        flyui.debug("_findGenesByAnyName: "+names, _context);
        
        flyui.debug("set state pending", _context);
        this._model.set("STATE", "PENDING");
        
        flyui.debug("set model property query", _context);
        this._model.set("QUERY", names);
        
        flyui.debug("kick off request", _context);
        this._service.findGenesByAnyNameBatch(names, success, failure);

    } catch (e) {
        flyui.debug("caught "+e.name, ", "+e.message, _context);
        throw new flyui.UnexpectedException(_context, e);
    }    
};







/**
 * Set the index of the selected result.
 * @param {Number} index the new selection index
 * @throws flyui.genefinder.SelectionOutOfBounds if selection index is not applicable to current results
 */
flyui.genefinder.Controller.prototype.setSelectionIndex = function( index ) {
    var _context = "flyui.genefinder.Controller.prototype.setSelectionIndex";
    var badIndex = false;
    try {
        flyui.debug("setSelectionIndex, index: "+index, _context);
        var results = this._model.get("RESULTS");
        if (results != null) {
            if (index >= 0 && index < results.length) {
                this._model.set("SELECTIONINDEX", index);
    //          flyui.debug("widget: "+this._parent, _context);
                var event = this._parent._geneSelectedEvent;
    //          flyui.debug("event: "+event, _context);
                event.fire(results[index]);
            }
            else {
                badIndex = true;
            }
        }
    } catch (e) {
        flyui.debug("caught "+e.name, ", "+e.message, _context);
        throw new flyui.UnexpectedException(_context, e);
    }   
    
    if (badIndex) {
        throw new flyui.genefinder.SelectionOutOfBounds("index "+index+" cannot apply to results length "+results.length);
    } 
};


/**
 * @class
 * An exception thrown if selection index is out of bounds.
 * @constructor
 * @param {String} message
 */
flyui.genefinder.SelectionOutOfBounds = function( message ) {
	this.name = "flyui.genefinder.SelectionOutOfBounds";
	this.message = message;
}


/** 
 * Create a new renderer instance.
 * @class
 * A default renderer for the GeneFinder Widget.
 */
flyui.genefinder.DefaultRenderer = function() {};

/** 
 * @private 
 * @type Element
 */
flyui.genefinder.DefaultRenderer.prototype._canvas = null;

/**
 * @private 
 * @type Element
 */
flyui.genefinder.DefaultRenderer.prototype._pendingPane = null;

/**
 * @private 
 * @type Element
 */
flyui.genefinder.DefaultRenderer.prototype._resultsSummaryPane = null;

/**
 * @private 
 * @type Element
 */
flyui.genefinder.DefaultRenderer.prototype._resultsPane = null;

/**
 * @private 
 * @type Element
 */
flyui.genefinder.DefaultRenderer.prototype._messagePane = null;

/**
 * @private
 * @type flyui.genefinder.UserEventHandler
 */
flyui.genefinder.DefaultRenderer.prototype._userEventHandler = null;

	
/**
 * Set the DOM element to which this renderer applies and initialise it.
 * @param {Element} canvas
 */
flyui.genefinder.DefaultRenderer.prototype.setCanvas = function( canvas ) {
	this._canvas = canvas;
	this._initCanvas();
};


/**
 * Set the user event handler.
 * @param flyui.genefinder.UserEventHandler handler
 */
flyui.genefinder.DefaultRenderer.prototype.setUserEventHandler = function( handler ) {
	this._userEventHandler = handler;
};


/**
 * @private
 * Initialise the main components of the widget's DOM
 */
flyui.genefinder.DefaultRenderer.prototype._initCanvas = function() {
    var _context = "flyui.genefinder.DefaultRenderer.prototype._initCanvas";
    try {
        
        YAHOO.util.Dom.addClass(this._canvas, "genefinderWidget");
    
        flyui.debug("setup pending pane", _context);
        this._pendingPane = document.createElement("p");
        this._pendingPane.innerHTML = "pending...";
        this._canvas.appendChild(this._pendingPane);
        YAHOO.util.Dom.addClass(this._pendingPane, "pendingPane");
        flyui.mvcutils.hide(this._pendingPane);
    
        flyui.debug("setup results summary pane", _context);
        this._resultsSummaryPane = document.createElement("p");
        this._resultsSummaryPane.innerHTML = "this should never be displayed";
        this._canvas.appendChild(this._resultsSummaryPane);
        YAHOO.util.Dom.addClass(this._resultsSummaryPane, "resultsSummaryPane");
        flyui.mvcutils.hide(this._resultsSummaryPane);
        
        flyui.debug("setup results pane", _context);
        this._resultsPane = document.createElement("div");
        this._canvas.appendChild(this._resultsPane);
        YAHOO.util.Dom.addClass(this._resultsPane, "resultsPane");
        flyui.mvcutils.hide(this._resultsPane);
    
        flyui.debug("message pane", _context);
        this._messagePane = document.createElement("p");
        this._messagePane.innerHTML = "this should never be displayed";
        this._canvas.appendChild(this._messagePane);
        YAHOO.util.Dom.addClass(this._messagePane, "messagePane");
        flyui.mvcutils.hide(this._messagePane); 

    } catch (e) {
        flyui.debug("caught "+e.name, ", "+e.message, _context);
        throw new flyui.UnexpectedException(_context, e);
    }   
};


/**
 * @private
 * Called on widget model state changed.
 * @param {String} from the old state
 * @param {String} to the new state
 */
flyui.genefinder.DefaultRenderer.prototype._onStateChanged = function( from, to ) {
    var _context = "flyui.genefinder.DefaultRenderer.prototype._onStateChanged";
    try {
        if ( to == "PENDING" ) {
            flyui.mvcutils.show(this._pendingPane);
            flyui.mvcutils.hide(this._messagePane);
            flyui.mvcutils.hide(this._resultsSummaryPane);
            flyui.mvcutils.hide(this._resultsPane);
        }
        else if ( to == "READY" ) {
            flyui.mvcutils.hide(this._pendingPane);
            flyui.mvcutils.show(this._messagePane);
            flyui.mvcutils.show(this._resultsSummaryPane);
            flyui.mvcutils.show(this._resultsPane);         
        } 
        else if ( to == "SERVERERROR" || to == "UNEXPECTEDERROR" ) {
            flyui.mvcutils.hide(this._pendingPane);
            flyui.mvcutils.show(this._messagePane);
            flyui.mvcutils.hide(this._resultsSummaryPane);
            flyui.mvcutils.hide(this._resultsPane);         
        } 
        else {
            // this should never happen
            throw {message:"unexpected state: "+to};
        }
        
    } catch (e) {
        flyui.debug("caught "+e.name, ", "+e.message, _context);
        throw new flyui.UnexpectedException(_context, e);
    }   

};


/**
 * @private
 * Called on widget model query changed.
 * @param {String} from the old query
 * @param {String} to the new query
 */
flyui.genefinder.DefaultRenderer.prototype._onQueryChanged = function( from, to ) {
	// temporarily store the query, do nothing else
	this._query = to;
};


/**
 * @private
 * Called on widget model results changed.
 * @param {Array<flyui.flybase.Gene>} from the old results
 * @param {Array<flyui.flybase.Gene>} to the new results
 */
flyui.genefinder.DefaultRenderer.prototype._onResultsChanged = function( from, to ) {
    var _context = "flyui.genefinder.DefaultRenderer.prototype._onResultsChanged";
    try {
        // temporarily store the results
        this._results = to;
        
        // set the results summary
        this._renderResultsSummary(this._query, to.length);
        
        if (to.length > 0) {
            
            // empty the results pane
            this._resultsPane.innerHTML = "";   
    
            // set the content
            var resultsNode = this._renderResults(to);
            flyui.debug("results node content:"+resultsNode.innerHTML, _context);
            this._resultsPane.appendChild(resultsNode); 
            
            // set the message pane content
            this._renderGeneSelectionMessage(null);
    
        }
        else {
            this._resultsPane.innerHTML = "";
            this._messagePane.innerHTML = "";
        }
    } catch (e) {
        flyui.debug("caught "+e.name, ", "+e.message, _context);
        throw new flyui.UnexpectedException(_context, e);
    }   
};


/**
 * @private
 * Called on model selection index changed
 * @param {Number} from the old selection index
 * @param {Number} to the new selection index
 */
flyui.genefinder.DefaultRenderer.prototype._onSelectionIndexChanged = function( from, to ) {
    var _context = "flyui.genefinder.DefaultRenderer.prototype._onSelectionIndexChanged";
    try {
        
        flyui.debug("from:"+from+", to:"+to, _context);
        
        // get the result nodes
        var nodes = this._getResultNodes(); // that._resultsPane.getElementsByTagName("tr");
        
        if (from != null) {
            // remove class
            YAHOO.util.Dom.removeClass(nodes[from+1], "selected");
        }
        
        if (to != null) {
            // add class
            flyui.info("adding selected class to node: "+nodes[to+1]+"debug", _context);
            YAHOO.util.Dom.addClass(nodes[to+1], "selected");
            var gene = this._results[to];
            this._renderGeneSelectionMessage(gene);
        }   
        
    } catch (e) {
        flyui.debug("caught "+e.name, ", "+e.message, _context);
        throw new flyui.UnexpectedException(_context, e);
    }   
};


/**
 * @private
 * Utility function to access result DOM elements.
 * @type Array<Element>
 * @return an array of elements
 */
flyui.genefinder.DefaultRenderer.prototype._getResultNodes = function() {
	return this._resultsPane.getElementsByTagName("tr");
};


/**
 * @private
 * Called on error message changed
 * @param {String} from the old message
 * @param {String} to the new message
 */
flyui.genefinder.DefaultRenderer.prototype._onErrorMessageChanged = function( from, to ) {
	this._messagePane.innerHTML = to;
};


/**
 * @private
 * Main callback function for model changes.
 * @param {String} type the name of the model property changed
 * @param {Array} args the callback args
 * @param {flyui.genefinder.DefaultRenderer} self a self reference, to work around callback issues
 */
flyui.genefinder.DefaultRenderer.prototype._onModelChanged = function(type, args, self) {
    var _context = "flyui.genefinder.DefaultRenderer.prototype._onModelChanged";
    try {
        var handlers = {
            "STATE":"_onStateChanged",
            "QUERY":"_onQueryChanged",
            "RESULTS":"_onResultsChanged",
            "ERRORMESSAGE":"_onErrorMessageChanged",
            "SELECTIONINDEX":"_onSelectionIndexChanged"
        };
        var handler = handlers[type];
        // call the handler
        self[handler](args[0], args[1]);
    } catch (e) {
        flyui.debug("caught "+e.name, ", "+e.message, _context);
        throw new flyui.UnexpectedException(_context, e);
    }   
};


/**
 * Connect this renderer to a model.
 * @param {flyui.mvcutils.GenericModel2} model
 */
flyui.genefinder.DefaultRenderer.prototype.connect = function( model ) {
	var _context = "flyui.genefinder.DefaultRenderer.prototype.connect";
	try {
        model.subscribeAll(this._onModelChanged, this);
    } catch (e) {
        flyui.debug("caught "+e.name, ", "+e.message, _context);
        throw new flyui.UnexpectedException(_context, e);
    }   
};


/**
 * Helper function for building DOM elements containing lists of elements
 * @param {string} outerTag outer tag (e.g. "TR") 
 * @param {string} innerTag inner tag (e.g. "TD") 
 * @param {string*} list of inner HTML values to populate element
 * @return a new DOM element constructed from supplied values
 * @type HTMLElement 
 */
flyui.genefinder.DefaultRenderer.renderDomElementFromList = function(outerTag, innerTag, list) {
    var _context = "flyui.genefinder.DefaultRenderer.renderDomElementFromList";
    try {
        var outerElem = document.createElement(outerTag);
    
        // can we defer this to caller?  tbody.appendChild(headerRow);
        
        flyui.debug("creating outer "+outerTag, _context);
        for (var i=0; i<list.length; i++) {
            var innerElem = document.createElement(innerTag);
            innerElem.innerHTML = list[i];
            outerElem.appendChild(innerElem);
        }   
    
        return outerElem;   
        
    } catch (e) {
        flyui.debug("caught "+e.name, ", "+e.message, _context);
        throw new flyui.UnexpectedException(_context, e);
    }   
};


/**
 * @private
 * Render the results summary pane.
 * @param {String} query the user's query
 * @param {Number} count number of results found
 */
flyui.genefinder.DefaultRenderer.prototype._renderResultsSummary = function( query, count ) {
    var _context = "flyui.genefinder.DefaultRenderer.prototype._renderResultsSummary";
    try {
        
        if (query instanceof Array) {
            flyui.debug("found array query", _context);
            query = query.join(", ");
        }
        var content = "found ";
        content += count;
        content += " matching <em>D. melanogaster</em> gene";
        content += (count == 0 || count > 1) ? "s " : " ";
        content += "from <a href='http://flybase.org'>flybase.org</a> ("+flyui.flybase.provenance+") for query '"+query+"' ...";
        this._resultsSummaryPane.innerHTML = content;
        
    } catch (e) {
        flyui.debug("caught "+e.name, ", "+e.message, _context);
        throw new flyui.UnexpectedException(_context, e);
    }   
};


/**
 * @private
 * Render the results pane.
 * @param {Array<flyui.flybase.Gene>} genes the results of the user's query
 */
flyui.genefinder.DefaultRenderer.prototype._renderResults = function( genes ) {
    var _context = "flyui.genefinder.DefaultRenderer.prototype._renderResults";
    try {
        // set up overall table structure
        var table = document.createElement("table");
        var thead = document.createElement("thead");
        var tbody = document.createElement("tbody");
        table.appendChild(thead);
        table.appendChild(tbody);
    
        // set up header row
        var headers = ["symbol", "full name", "annotation ID", "flybase ID", "user selection"];
        var headerRow = flyui.genefinder.DefaultRenderer.renderDomElementFromList("tr", "th", headers); 
        thead.appendChild(headerRow);
        
        for (var i=0; i<genes.length; i++) {
            flyui.debug("creating result row "+i, _context);
            var cellContents = this._geneToTableCellContents(genes[i]);
            var row = flyui.genefinder.DefaultRenderer.renderDomElementFromList("tr", "td", cellContents);
            tbody.appendChild(row);
            YAHOO.util.Event.addListener(row, "click", this._userEventHandler._onResultClicked, i);
        }
        
        return table;
        
    } catch (e) {
        flyui.debug("caught "+e.name, ", "+e.message, _context);
        throw new flyui.UnexpectedException(_context, e);
    }   
	
};


/**
 * @private
 * Utility function to turn a gene into an array of table cell contents.
 * @param {flyui.flybase.Gene} gene
 */
flyui.genefinder.DefaultRenderer.prototype._geneToTableCellContents = function( gene ) {
    var _context = "flyui.genefinder.DefaultRenderer.prototype._geneToTableCellContents";
    try {
        return [
            gene.symbols.join(" / "),
            gene.fullNames.join(" / "),
            gene.annotationSymbols.join(" / "),
            gene.flybaseID,
            "<span class='selector'>[<a href='javascript:void(0)'>select this gene</a>]</span><span class='isselected'>selected</span>"
        ];
    } catch (e) {
        flyui.debug("caught "+e.name, ", "+e.message, _context);
        throw new flyui.UnexpectedException(_context, e);
    }   
};


/**
 * @private
 * Render a message for the given selection.
 * @param {flyui.flybase.Gene} gene the selected gene (may be null for no selection)
 */
flyui.genefinder.DefaultRenderer.prototype._renderGeneSelectionMessage = function( gene ) {
    var _context = "flyui.genefinder.DefaultRenderer.prototype._renderGeneSelectionMessage";
    try {
        
        if (gene == null) {
            this._messagePane.innerHTML = "selected gene: <strong>please select one of the genes from the list above, or try another query</strong>";
        }
        else {
            this._messagePane.innerHTML = "selected gene: <strong>"+gene.symbols.join(" / ")+"</strong> (FlyBase report: <a href='http://flybase.org/reports/"+gene.flybaseID+".html'>"+gene.flybaseID+"</a>)";
        }  
              
    } catch (e) {
        flyui.debug("caught "+e.name, ", "+e.message, _context);
        throw new flyui.UnexpectedException(_context, e);
    }   
};


/** 
 * Definition of genefinder widget model.
 */
flyui.genefinder.modelDefinition = {

	properties : [ "STATE", "RESULTS", "ERRORMESSAGE", "QUERY", "SELECTIONINDEX" ],
	
	values : {
		"STATE" : [ "READY", "PENDING", "SERVERERROR", "UNEXPECTEDERROR" ]
	},
	
	initialize : function( data ) {
		data["STATE"] = "READY";
		data["RESULTS"] = null;
		data["ERRORMESSAGE"] = null;
		data["QUERY"] = null;
		data["SELECTIONINDEX"] = null;
	}
}