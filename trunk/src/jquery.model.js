/**
 * @fileoverview
 *  jQuery plugin to provide model and listener capabilities.
 *  
 * @author Graham Klyne
 * @version $Id$
 */

/**
 * The 'model' method gets or sets a model value and,. when setting a value, 
 * triggers any listeners.  Note that this method follows the style of jQuery's
 * .data method, and access the same values.
 * 
 * @param name      is a string that names a data value to be associated with 
 *                  this element, in the same way as jQuery(...).data.
 * @param value     is a value to be assigned to the model value, or
 *                  undefined if no value is to be assigned.
 * @return          the indicated model value from the first selected element
 *                  that was current just before calling this function, or
 *                  undefined.
 */
jQuery.fn.model = function (name, value)
{
    //log.debug("jQuery.model "+name+", "+value);
    //var config = {'foo': 'bar'};
    //if (settings) $.extend(config, settings);
    var retval = undefined;
    this.each(function()
    {
        var j = jQuery(this);
        var oldval = j.data(name);
        if (retval === undefined) {retval = oldval;};
        if (value !== undefined)
        {
            j.data(name, value);
            j.trigger(
                j.modelEvent(name), 
                {name:name, oldval:oldval, newval:value});
        };
    });
    return retval;
};

/**
 * Bind a model-change listener to a particular model value in all selected
 * elements.
 */
jQuery.fn.modelBind = function (name, fn)
{
    this.each(function()
    {
        var j = jQuery(this);
        j.bind(j.modelEvent(name), fn);
    });
};

/**
 * Unbind a model-change listener from particular model value in all selected
 * elements.
 */
jQuery.fn.modelUnbind = function (name, fn)
{
    this.each(function()
    {
        var j = jQuery(this);
        j.unbind(j.modelEvent(name), fn);
    });
};

/**
 * Helper method returns model event name for the first element in the
 * current jQuery onject and supplied model value name.
 */
jQuery.fn.modelEvent = function (name)
{
    return "model_"+this.data("")+"_"+name;
};

// End.
