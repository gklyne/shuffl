# Introduction #

This page has been created to capture knowledge about techniques for using jQuery

# Event handling #

Two useful pages about working with jQuery events, covering event delegation (handling in a parent DOM element) and cloning events when cloning a DOM element.
  * http://www.learningjquery.com/2008/03/working-with-events-part-1
  * http://www.learningjquery.com/2008/05/working-with-events-part-2

# Relaxing the same-origin restriction #

(This is a FireFox topic rather than jQuery.)

Go into your FF 3.0 config panel (type 'about:config') and set the following property to 'false' by double clicking on it:

> security.fileuri.strict\_origin\_policy

That should allow you to continue to access local files that are 'outside' of the directory structure you loaded from via XHR. Don't know why JSON's not working - might be same issue.

(From: http://jquery-howto.blogspot.com/2008/12/access-to-restricted-uri-denied-code.html)