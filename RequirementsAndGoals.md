# Introduction #

This page lists project technical goals.

See also: UserStories


# Back-end requirements #

Required:
  * simple REST interface
  * saved data available as RDF using simple HTTP request
  * off-the-shelf (no new code required)
  * arbitrary binary object storage and web access (images, etc.)
  * available for local **or** service deployment

Desired:
  * easy integration with University SSO
  * standard, replaceable API

# User interface #

  * easy for users
  * minimal imposed structure
  * permit users to develop their own structures
  * grouping and linking of cards - manually, visually, by query
  * allow same raw data to be used in multiple workspaces

# Notes from a discussion with Nathan Pike and David #

## Granularity of data ##

On the importance of granularity of information units.

The question asked is "why cards?"

Currently, on the web, we have two ways of presenting data:  as files or
documents, which tend to be very coarse-grained (e.g. a whole set of samples in
a spreadsheet, as opposed to a single sample);  or as triples which are very
fine-grained.  Thinking about our discussion, I am beginning to see that much of
my current thinking in this area is drawing me to a notion  of "frames" or
"objects" as a useful unit of data.  I see this in my work with classical art
data I am working with, where we naturally talk of art objects, people, places.

But I think the significance here is not primarily technical - we can devise
technical means to delve inside files to locate individual entries - such as
rows in a spreadsheet - but social/perceptual:  when presented with a file of
data, there is (I hypothesize) a tendency to consider that the file must be
processed as a single dataset rather than a collection of individual and
separable data.  At a more practical level, picking data elements from a file
increases the activation energy required to access those data.  So part of my
hypothesis is that by making individual data elements (maybe experimental
samples) as the natural unit of retrieval (coupled with mechanisms to facilitate
aggregated handling), the content can be more accessible and more easily
examined.

It may be that this is less relevant to scientific experimentation than I had
supposed.  After all, I understand that one is supposed to do experimental
design and choose statistical analyses before one starts to gather data.
But I can't help being a little sceptical about such an ideal.  With Helen
White-Cooper's work on Drosphila gene _in situs_, there was a phase of
the project which involved choosing genes to image for a variety of
reasons which did not really admit advance codification;  was this
really an exceptional situation?

## Parts and wholes in software systems (granularity again) ##

Another view is the role of system
components in providing tools for researchers.  Many of the most successful
software systems have been "generative" (to use a phrase by Jonathan Zittrain),
in that they provide an open-ended and flexible capability that can be used in
diverse ways for diverse purposes.  But it is often in the nature of such
systems that they are not complete:  their core function is not, of itself,
compelling for an end-user - rather it is the composition of such pieces that
creates compelling end-user value.

To my mind, this creates a tension when designing a system, to keep the right
balance between generative, open-ended capability that can grow and evolve
with its users, versus providing some immediate value for some user to ensure
the concepts are properly grounded and do indeed add genuine value.
I thought I had found such a balance with Shuffl, but from our discussion it
seems that there may still be some work to do to make this so for science
researchers.  Specifically, it would help me to understand aspects of data
acquisition and handling that you would like to undertake, but cannot do
as easily as you would like with spreadsheet programs.