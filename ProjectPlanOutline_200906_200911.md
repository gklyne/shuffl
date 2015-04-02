# Introduction #

  * JISC project proposal: http://shuffl.googlecode.com/files/20090421-shuffl-proposal-no-budget-figures.pdf

# Effort schedule #

Nominally, the Shuffl project funds 60% of my time from mid-June to the end of
November, a total of 73 days of work.  This will run in parallel with the Claros project which funds my time at 20% for the same period.  Under the circumstances, we probably don't want to immediately reduce my Claros
effort, and it would be good to have more time devoted to Shuffl in the later stages of the project.

Thus, this is the effort allocation that is planned for the next few months:

```
June     July        August         September   October     November
15.22.29 06.13.20.27 03.10.17.24.31 07.14.21.28 05.12.19.26 02.09.16.23.30
 C  C  C  C  C  C  C vC vC  C  C  C  C  C  C  C  C  C  C  C  C  C  _  _  _  = 22C
 C  C  C  C  C  C  C vC vC  C  C  C  C  S  S  S  S  S  S  S  S  S  S  S  -  = 13C + 11S
 C  C  C  C  C  C  C vS vS  S  S  S  S  S  S  S  S  S  S  S  S  S  S  S  -  = 7C  + 17S
 C  C  C  S  S  S  S vS vS  S  S  S  S  S  S  S  S  S  S  S  S  S  S  S  -  = 3C  + 21S
 S  S  S  S  S  S  S vS vS  S  S  S  S  S  S  S  S  S  S  S  S  S  S  S  -  =       24S
                                                                            = 45C + 73S

S = Shuffl 73 days, C = Claros 45 days, Total 118 days. 
v = intended vacation
```

# Outline plan from proposal #

Some activities have been added, and the month end dates given make some allowance for the effort schedule.

| Month | Activity | Deliverables |
|:------|:---------|:-------------|
| 1: 31Jul 13days| Initial planning. Project Setup, and further discussion with JISC OSS-Watch about open source tooling, licensing and governance issues. Prototype user interface in Javascript. | Project plan. Publicly hosted source and project tracking facility. Interface prototype that can be shown to users to elicit feedback and further requirements. |
| 2: 28Aug 12days | Develop supporting back-end service, and canvass potential users for feedback on initial interface - identification of a minimum system that target users would actually use for some purpose, however trivial. | Initial front-to-back system. Basic user documentation. A "hit list" of desired features. |
| 3: 2Oct 18days | Enhancements to system; capturing structure in data; basic user authentication and access control. Use of system for project tasks. Seminar/demonstrations to solicit users and feedback. | Updated system. Examples of system in use. Updated feature list. |
| 4: 30Oct 16days | Further enhancements. External linking and data integration. Continued user engagement. | Updated system, more examples of system in use. Updated feature list. Initial community web page describing the system and applications. |
| 5: 27Nov 16days | Create promotional materials (webcast, dissemination, demonstrations, etc.). Establish a long-term home for the demo service. Ensure that users with whom we have engaged are comfortable with what is available as this project winds down. | Public repository contains fully tested software, documentation, promotional materials, deployment instructions, examples, etc., in a state suitable to support ongoing open community development. |

# Sprints #

The project will be run along agile lines, as a series of "sprint"s or iterations, which will aim to achieve the progress outlined above. Each sprint will be planned in greater detail when it starts, adjusting the goals to take account of progress made and user feedback to date.

My goal is 2-week sprints, but the first two are longer as the proportion of time spent will be lower.

| Sprint 1 | 15 Jun - 31 Jul | 13 days | [sprint 1 plan](SprintPlan_1.md) |
|:---------|:----------------|:--------|:---------------------------------|
| Sprint 2 | 2 Aug - 28 Aug  | 12 days including vacation: 6 working days | [sprint 2 plan](SprintPlan_2.md) |
| Sprint 3 | 31 Aug - 11 Sep | 9 days | [sprint 3 plan](SprintPlan_3.md) |
| Sprint 4 | 14 Sep - 2 Oct  | 12 days | [sprint 4 plan](SprintPlan_4.md) |
| Sprint 5 | 5 Oct - 16 Oct  | 8 days | [sprint 5 plan](SprintPlan_5.md) |
| Sprint 6 | 19 Oct - 30 Oct | 8 days | [sprint 6 plan](SprintPlan_6.md) |
| Sprint 7 | 2 Nov - 13 Nov  | 8 days | [sprint 7 plan](SprintPlan_7.md) |
| Sprint 8 | 16 Nov - 27 Nov | 8 days | [sprint 8 plan](SprintPlan_8.md) |

# Reporting checklist #

See: http://code.google.com/p/jiscri/wiki/ProjectDocumentation

| Name | Description | required tags | Done |
|:-----|:------------|:--------------|:-----|
| Project core resources | Key information and links about the project; online form; due within 2 weeks of project start | n/a | 3Jul2009 |
| Project plan | Project plan in supplied template form | n/a |
| Project SWOTing | Undertake a basic SWOT analysis of your project (which is a good thing to repeatedly do with yourself when you have a couple free moments waiting for a bus or train, especially helpful at the end of code sprints). The key is to truly knowing thyself or at least your project. | SWOT, rapidInnovation, progressPosts, JISCRI, JISC, Shuffl | ?? |
| User participation | what is the core user case(s) you think of when developing the app; how has this story changed as you have engaged with the end user e.g. "we often talk about Sam the part time working student we met while at..." | userCase, endUser, rapidInnovation, progressPosts, JISCRI, JISC, Shuffl | ?? |
| Day-to-day work | what software tools or productivity methods do you use and how do you use them? How do they make you more productive and why do you see value in using them? Any and all tools, methodologies or diagrams showing off the way your project is run from an individual perspective are welcome | methodology, implementation, productivity, progressPosts, rapidInnovation, JISCRI, JISC, Shuffl |
| Technical standards | what technologies, frameworks, standards or anything else that makes your life easier (or harder) in your work. For example: what programming language (or framework, IDE, pattern, etc) do you use and why do you love it, e.g. "why I love Object Relational Mapping in Python and Django" or" why I think SWORD is great but could do this...", etc. | techStandards, technicalDevelopment, progressPosts, rapidInnovation, JISCRI, JISC, Shuffl |
| Value Add | What was the more important thing you discovered that brought value to your project, e.g. what was the "wow" moment that made you change your perspective on a specific technology or process. | valueAdd, disruptiveInnovation, progressPosts, rapidInnovation, JISCRI, JISC, Shuffl |
| Small WIN(s) & FAIL(s) | announce small wins for the project, e.g. when you finish a coding sprint or when a user has a 'wow your software is cool' moment. The more of these short "win" posts the better! Also don't forget to post the FAIL(s) as well: telling people where thing went wrong so they don't repeat mistakes is priceless for a thriving community | WIN, progressPosts, rapidInnovation, JISCRI, JISC, Shuffl |
|  | _or_ | FAIL, progressPosts, rapidInnovation, JISCRI, JISC, Shuffl |
|  | _or_ | progressPosts, rapidInnovation, JISCRI, JISC, Shuffl |
| Sprint plans | New and revised plans generated periodically, responding to user requirements and actual prior progress.  Also, meta-issues about project conduct and reporting. | progressPosts, rapidInnovation, JISCRI, JISC, Shuffl, Planning |
| Final Progress Post | (See copy of template below) | progressPosts, rapidInnovation, JISCRI, JISC, finalProgressPost, output, prototype, product, demonstrator, shuffl | 30Nov2009 |

Project announcements blog: http://shuffl-announce.blogspot.com/

An aggregated feed of all JISCRI project comments is available at http://feeds.feedburner.com/DailyNewsFeedJISCRI.

## Final report template ##

  * Title of Primary Project Output: <--! Please use the following title format for this post: "ProjectTag?: One line description of prototyped output"-->
  * Screenshots or diagram of prototype: <!-- Please provide a series of screenshots or diagram that will quickly explain the point and process of your prototype to the end user. Annotation on screenshots welcome. -->
  * Description of Prototype: <--! Please write this description for the end user so they can easily understand what the prototype is about and how to use it, please be brief and to the point (think Argos Catalogue like description). -->
  * Link to working prototype: <!-- This http link should point directly to a working prototype in which the end user can interact, if a working prototype is not available then please provide a screencast or series of screenshots demonstrating end user functionality, this screencast should not exceed 5 minutes. Please note: working prototypes are preferred even if just 'rough and ready', please do not send powerpoints or other non web-based documents, they will not be accepted. This prototype must be maintained for one year after the date of the official project sign-off. -->
  * Link to end user documentation: <!-- Please provide an http link for a page that explains the use of the prototype to the end user, e.g. an "about" page that explains the project and why it is producing the prototype. For example, what end user problem does it solve, what question does the prototype answer, what itch for the community does it scratch? -->
  * Link to code repository or API: <!-- This http link should be to the primary page listing all code libraries for the prototype. This page must be maintained for one year after the official date of the project sign-off. -->
  * Link to technical documentation: <!-- Please provide an http link for a page listing all technical documentation which explains the code listed in the code repository above. -->
  * Date prototype was launched: <!-- Please provide a date for when the last version of the prototype was made available to end users -->
  * Project Team Names, Emails and Organisations: <!-- For example: "David F. Flanders, d.flanders@jisc.ac.uk - Joint Information Systems Committee; etc." -->
  * Project Website: <!-- HTTP link to any additional wiki, blog or site that has applicable documentation -->
  * PIMS entry: <!-- Please provide a link to your projects entry in PIMS, for example: https://pims.jisc.ac.uk/projects/view/1333 (ignore authentication pop-up) -->
  * Table of Content for Project Posts <!-- A final thematic table of contents should be provided here of all the project posts written along with links to each post. Please make this table of contents generic to any readership that might find your project on the Web. -->
  * Required Tags for this Final Progress Post = progressPosts, rapidInnovation, JISCRI, JISC, finalProgressPost, output, prototype, product, demonstrator, <your own unique project tag>, etc.