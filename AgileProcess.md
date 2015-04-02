# Introduction #

This page captures the elements opf agile processes used for running this project.  It is subject to continuous review, and this page exists to record the current state of that review process.

The outcomes of sprint reviews should be reflected here.


# Project Management and Administration #

  * Review each iteration, update this document as appropriate

  * Use Google code project for code and the wiki for administrative notes and plans

  * Iterations (sprints): aim for 2 weeks, with a minimum of 10-15 days effort, and allowing some flexibility to accommodate circumstances and other commitments.  Thus, for one person working alone and with other responsibilities, a 2-week sprint duration may be too short.  The sprint timetable for the initial phase to Nov 2009 has been determined at project startup.

  * Allow 10-15% overall effort for sprint planning, review, recoding and routine reporting

  * Aim for daily stand-up with colleagues (who may be working on  other projects)

  * Daily activities recorded in personal calendar and sprint plan; these underpin and supplement daily stand-ups

  * Outline project plan, milestones and sprint schedule recorded in project wiki.

  * Sprint plans recorded in the project wiki, together with progress and review notes.

  * Aim to develop functionality requested by users, but the early stages will develop an initial user interface used to elicit user requirements.  Some project goals (notable publication as linked web data) are not aimed at directly engaged users, but are being adopted serve other stakeholders who are not yet directly engaged.  (This feels anti-agile, and I'm not sure how to square this;  see also sectiomn below on agile modelling.)
    * (Later)  It's easier to follow this ideal when users are actually engaged ion reviewing actual software.  With a real potential user engaged, I find it makes more sense to defer applying effort to publication as linked data.

  * User stories (TODO)

  * Release plan (TODO)


# Community engagement #

  * Open source sustainability plan underlines need to be aware of wider community issues when making technical and other decisions.  (Is this anti-agile?)

  * Meet users, identify current data curation practices, elicit further requirements/desiderata, develop user stories, implement (this needs developing further?).  Later, use running prototype to help elicit requirements.

  * Disemmination plan (TODO)


# Technical #

  * Try to use existing code / libraries where possible.  But allow interim home-grown elements if learning time is likely to a factor.

  * Spike code to understand how to do something

  * To explore user-facing features, it's sometimes easier to implement first, then wrap code in test cases when the desired functionality has been worked out.

  * Test-led development for production code; test cases at unit and interface level (Windmill / selenium)

  * Continuous refactoring; adopt patterns to maximize unit test coverage (e.g. MVC per FlyWeb)


# Agile modelling and development #

In the early stages of a project , it is sometimes necessary to spend some time on high-level design activities activities, and creating technical infrastructure, that of themselves do not directly contribute to a user story.

This essay, [Agile Model Driven Development (AMDD)](http://www.agilemodeling.com/essays/amdd.htm)<sup>1</sup>, suggests that even for agile development it can be appropriate to take some time (but not too much!) to perform "requirements envisioning" and "initial architecture envisioning", to "get a good gut feel what the project is all about" and to "identify an architecture that has a good chance of working".  As always with agile development, the goal is "to get something that is just barely good enough so that your team can get going".

This essay also says "For your architecture a whiteboard sketch overviewing how the system will be built end-to-end is good enough" - it seems to me that the important bit here, very much to be emphasized, is "end-to-end".

It seems that, without really planning it, this approach is broadly what I've been doing in the early stages of shuffl.  In this light, The time I spent evaluating back-ends, even though the first iteration does not call for any persistence, does seem appropriate.  As I near the end of the first iteration, I think I can say that having a view of what the back end may look like does help me to make decisions about how to structure aspects of the user interface, even if those decisions are later overturned.

A difficult area has been poor estimation of effort and tasks. Getting the balance of granularity right for estimating is critical: too coarse a granularity and key elements are overlooked; too fine and the plans made don't reflect the actual development process when code has to be cut. Part of the problem here may be working alone without the benefit of  team discussion and review.  Also helpful has been to use a fine-grained breakdown for estimating, but a coarser-grained units of work for progress recording - this allows details to change as development progresses without having to change the recording structure in mid-sprint.

  1. _Agile Model Driven Development (AMDD)_, by Scott Ambler. http://www.agilemodeling.com/essays/amdd.htm