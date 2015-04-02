

# Introduction #

This page documents a plan for creating an open source project that is sustainable as such beyond the initial funding period.  It draws upon advice from OSS-Watch, particularly the page at http://wiki.oss-watch.ac.uk/StartYourProject.

# Identify community #

This project has arisen from previous work that aims to facilitate the publication of research data on the web, so that it can be reviewed, and re-used in the generation of new insights, and to avoid the costs of unnecessary repeated experimentation.  This has involved a combination of biological researchers, classical arts researchers, and semantic web experts.

User community: initially, small research teams, particularly in life-sciences and classical arts;  later, almost anyone who uses a computer to gather, organize and disseminate data.

Developer community: initially, me and maybe some close colleagues; later, semantic web developers, academic software developers, and hopefully more.

# Source code licence #

The MIT licence has been chosen as it is simple and permissive.  I believe sustainability for this project is maximized by lowering the barriers to adoption or adaptation, even if that means some users may "free-ride".  Experience suggests that most will not, or at least not in a way that is harmful to the project.

# Documentation licence #

Documentation is released under the Creative Commons Attribution licence (http://creativecommons.org/licenses/by/2.0/uk/) - this is chosen as being similar in spirit to the MIT licence for code.  The Google Code project page also specifies the Crerative Commons 3.0 BY licence, which conveys the same intent (http://creativecommons.org/licenses/by/3.0/).

# Collaborative decision making #

The project welcomes contributions from anyone who has an interest in its goals, and explicitly aims to encourage participation.  This decision making (or "governance") model aims to indicate to potential contributors the ways in which they may engage with the project.

See:
  * http://wiki.oss-watch.ac.uk/GovernanceModel
  * http://code.google.com/p/shuffl/wiki/Individual_Contributor_License_Agreement

In the style of the examples at http://wiki.oss-watch.ac.uk/ExamplesOfOpenSourceGovernanceModels:

| **Name** | Shuffl |
|:---------|:-------|
| **Description** | Shuffl is an experimental system for small-scale data curation and web-publication  |
| **URI** |  http://code.google.com/p/shuffl/ |
| **Governance Model** | Shuffl presently has a "meritocracy of one" governance model led by Graham Klyne.  Graham is the project manager and currently part-time funded to run this project to November 2009, and thereafter to conduct another project (ADMIRAL) which will contrinue to develop aspects of Shuffl until March 2011.  The project will actively engage with researchers who have indicated support for its goals, and will seek to use their experience to guide the project's early directions. During this initially funded pase user feedback, bug reports, patches and more will be gratefully accepted (and duly acknowledged). <br /><br /> Beyond the initially funded phase, we hope to use the established functionality to draw in a wider community to the recognized meritocracy. |
| **Motivating factors** | Shuffl is initially aimed at small-scale research teams, particularly life-science lab researchers, though we hope it eventually can be used by a far wider community.  As noted, we will engage with these users to guide the choice of functionality developed, wishing to creating a product that **is** useful to someone today than potentially useful to everyone tomorrow. |
| **Links** | http://wiki.oss-watch.ac.uk/MeritocraticGovernanceModel |

# Community tools #

## Tools for communications ##

Intended tools for communication are:
  * the Google code project wiki (http://code.google.com/p/shuffl/w/list)
  * a Google groups mailing list (http://groups.google.com/group/shuffl-discuss)
  * articles tagged 'jiscri' and 'shuffl' in a personal blog (http://signal-and-noise.blogspot.com/)
  * DOAP record: http://shuffl.googlecode.com/svn/trunk/docs/shuffl.doap
  * online demonstrator (runs directly from subversion repository): http://shuffl.googlecode.com/svn/trunk/static/demo/shuffl-demo.xhtml

The mailing list is open for anyone to view, but posts from non-members will be held for moderation. (If spam proves to be a problem, membership may be required for posting messages.)  Membership is subject to moderation.  The aim is to be as open as possible while minimizing the impact of spam messages.

Other tools to be considered in future:
  * Screencasts

## Version management ##

Subversion provided through a Google code project.

## Issue tracking ##

Issue tracking provided buy Google code.

## Project management ##

The key style here is lightweight.  Which is not to say non-existent.  My experience is that 10-15% project time spent on planning is well-spent in ensuring that the remainder of the time is used effectively.

The intended style of development management is based on agile methods, though not using a specific agile methodology.  Initially, the Google Code wiki will be used to collect information about the project roadmap, user stories, task breakdown and sprint plans.  Later, we hope that Shuffl itself will be able to provide some of the development management tooling, in a fashion similar to Mingle.

The management processes and tool usage will be subject to continuous review and re-evaluation.  Getting the job done trumps consistency.  See [Agile ecosystem](#Agile_ecosystem.md) below.

## Contributor licence agreement ##

The individual contributor licence agreement is at http://code.google.com/p/shuffl/wiki/Individual_Contributor_License_Agreement

See also:
  * http://www.oss-watch.ac.uk/resources/cla.xml

# Subversion repository organization #

Top-level branch and tag directories, with sub-projects having separate subdirectories under trunk.  (This facilitates relative file references between sub-projects, which in turn facilitate building or using the software in different environments.)

Within a single Google code project, this organization is pretty much dictated in any case.

# Release management #

(TODO: outline release management process)

See also:
  * http://wiki.oss-watch.ac.uk/Release_Management

# Agile ecosystem #

Notes about the agile-based process used are at http://code.google.com/p/shuffl/wiki/AgileProcess

# Sustainability options #

See:
  * http://wiki.oss-watch.ac.uk/Cost_Of_Open_Source_Development
  * http://www.oss-watch.ac.uk/resources/sustainableopensource.xml

The clear message from the second link above is that the project will need some level of continuing input (if not income) to survive.

The initial Shuffl project has served mainly to demonstrate the strength (and some weaknesses) of the basic Shuffl idea, and to lay a technical foundation for ongoing development.  It has also succeeded in actively engaging one researcher with whom we have been working.  While Shuffl can be used as a toolkit for building specialized applications, it remains a fair way from being a generic data gathering and management platform.

For the near-term, additional Shuffl development will take place through the JISC-funded ADMIRAL project, which has some specific requirements for metadata capture and dataset annotation for which Shuffl should be well-suited.

Effort spent on data visualization tools might be better spent on creating links to other tools (e.g. Wookie widgets) so that Shuffl users can directly access a range of existing visualization tools.

The conduct of Shuffl has bene fully open from the outset.  All technical, managerial and operational decisions will be recorded here, alongside the open source code and documentation.  This should help to ensure that well-motivated newcomers can learn enough about the project to make useful contributions.

## Infrastructure Costs ##

Using Google-hosted services means the project infrastructure's existence is not subject to the vagaries of research project funding.  The persistent fabric of the project will be able to survive funding gaps, as long as Google continues to provide these services for free (and they do appear to have some commercial motivation to do so).

## Support costs ##

The costs of responding to users' and developers' questions.  Being able to do this will always require some degree of resource input.

Provide an environment that allows a community to support themselves - the Google infrastructure helps here.

Support costs for the product produced by the projects initial phase may be reduced by ensuring adequate documentation and support materials are created while the project is funded.

Support costs for the project itself (the ongoing community of users and developers) may be reduced is a suitably modular software architecture is adopted (see below)

## Collaboration and consensus costs ##

These costs may be the hardest to defray:  formal control of a project's direction and integrity needs a committed team or individual, who usually need to have an income from somewhere to support their activity.  If the overhead of governance is low, then a single volunteer may be able to hold down the job, but this would not be a scalable solution.

If the project is wildly successful, then it maybe can come under the wing of one of the established organizations (Apache, etc.) and use their governance structures.

If the project has some commercial appeal, then maybe a company would be prepared to provide cover for this function, possibly in return for access to a skilled individual.

## Development costs ##

All the factors affecting support costs and governance costs apply, but there are some aspects of development costs that can be mitigated though the technical approach to the product:
  * Make as much use of existing open source frameworks and projects as possible, thereby benefiting from their sustainability
  * A framework that can be extended very easily to provide new user benefits is more likely to attract volunteer developer effort, maybe even from user/developers; i.e. the pluggable card implementations and back-end storage interface mean that new functions can be added without requiring changes to the core framework.  The easily-extended nature of jQuery has also proven very useful here.

The bottom line here would appear to be:  try to avoid making expensive and constraining commitments in the software's technical design. (Maybe easier said than done, but worth trying for.)

## Summary thoughts on sustainability ##

[OSS-watch says](http://www.oss-watch.ac.uk/resources/sustainableopensource.xml) that many OS projects fail because they don't plan for success, but it can be hard to understand what success might look like and what form it would take, so cannot comprehensively plan for it.  On the other hand, going through the exercise of preparing this plan, the one thing that I can see doing from the outset is being more conscious of the need to make it as easy as possible for users and developers to join in, through small as well as large contributions, and that this is something that pervades all other aspects of the project, right down to technical design issues. As with so many matters to with planning, it is the process of thinking about a plan that may be more valuable that the resulting plan.

The only party of this analysis that feels at all satisfactory is the infrastructure sustainability.  In the face of all other uncertainties, Google's continuing infrastructure support feels rock-solid.

I can see that the project may be sustainable if it succeeds in just a small way, with low-overhead governance, a self-supporting community and ad-hoc ongoing development.  I can also see how a project would be sustainable through attracting substantial support from further research grants or commercial interests if it is wildly successful.  But the transition from small-scale to large-scale success is hard to plot, so I conclude that part of the plan must be a readiness to be flexible about how the project may develop.

# Collected links #

  * http://osswatch.jiscinvolve.org/2009/06/30/software-sustainability/ - OSS-watch BLOG post that discusses sustainability issues, and also happens to reference this page.
  * http://wiki.oss-watch.ac.uk/StartYourProject - OSS-watch "checklist" for project startup
  * http://www.oss-watch.ac.uk/resources/sustainableopensource.xml
  * http://wiki.oss-watch.ac.uk/Cost_Of_Open_Source_Development
  * http://wiki.oss-watch.ac.uk/Release_Management
  * http://wiki.oss-watch.ac.uk/GovernanceModel
  * http://wiki.oss-watch.ac.uk/ExamplesOfOpenSourceGovernanceModels
  * http://www.oss-watch.ac.uk/resources/cla.xml