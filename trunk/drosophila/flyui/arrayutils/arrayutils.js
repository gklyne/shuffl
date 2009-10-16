/**
 * @fileoverview
 * This script defines array utilities.
 * @author <a href="http://purl.org/net/aliman">Alistair Miles</a>
 * @version $Revision:538 $ on $Date: 2008-08-14 10:36:17 +0100 (Thu, 14 Aug 2008) $ by $Author: aliman $
 * TODO license terms
 */


// create a namespace if not already defined
flyui.namespace("flyui.util");


/**
 * @class
 * This class is currently just a trigger to make jsdoc document this module properly.
 * @constructor
 */
flyui.util.ArrayUtils = function() {}


/**
 * Test if an array contains a given object.
 * @param {Array} array 
 * @param {Object} member
 * @return true if member occurs anywhere in array
 * @type boolean
 */
flyui.util.isArrayMember = function( array, member ) {
	for (var i in array) {
		if (array[i] == member) {
			return true;
		}
	}
	return false;
};


/**
 * Append object to an array only if not already a member.
 * @param {Array} array 
 * @param {Object} member
 */
flyui.util.appendIfNotMember = function( array, member ) {
	if (!flyui.util.isArrayMember(array, member)) {
		array[array.length] = member;
	}
};


/**
 * Compare members of two arrays.
 * @param {Array} A
 * @param {Array} B
 * @return true iff all members of A are members of B and vice versa, otherwise false
 * @return boolean
 */
flyui.util.arrayMembersAreEqual = function( A, B ) { // TODO consider better name e.g arraysHaveSameMembers
	for (var i in A) {
		if (!flyui.util.isArrayMember(B, A[i])) {
			return false;
		}
	} 
	for (var i in B) {
		if (!flyui.util.isArrayMember(A, B[i])) {
			return false;
		}
	}
	return true;
};