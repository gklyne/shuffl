/**
 * @fileoverview
 * This script defines convenience functions for DOM manipulation.
 * @author <a href="http://purl.org/net/aliman">Alistair Miles</a>
 * @version $Revision:538 $ on $Date: 2008-08-27 09:08:41 +0100 (Wed, 27 Aug 2008) $ by $Author: aliman $
 * @requires flyui.util
 * @requires flyui.sparql.Service
 * @requires YAHOO.util.Connect
 * For license terms see http://flyui.googlecode.com
 */

// create a namespace if not already defined
flyui.namespace("flyui.mvcutils");


/** Make an element visible.
 * @param {Element} element the element to make visible
 */
flyui.mvcutils.show = function( element ) {
	YAHOO.util.Dom.removeClass(element, "invisible");
};


/** Make an element invisible.
 * @param {Element} element the element to make invisible
 */
flyui.mvcutils.hide = function( element ) {
	YAHOO.util.Dom.addClass(element, "invisible");
};
