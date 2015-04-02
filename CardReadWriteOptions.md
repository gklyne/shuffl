

# Introduction #

Each card is an independently-addressable web resource, and may be referenced from one or more workspaces using an absolute or relative URI reference.  A number of options need to be considered when saving a workspace.

I have adopted the idea that relatively referenced cards should be saved with the workspace; i.e. copied when a new workspace is created. Absolutely-referenced cards should be referenced in-situ, so that changes to the original can propagate to the workspace.

Also, card data may be read from what is effectively read-only storage (e.g. by file: URI references, which are not generally writable from the browser).  In due course, I propose to implement a backend plug-in framework that can deal appropriately with read-only and read-write card storage.

# Feature matrix for saving card data #

This matrix captures the various options that must be allowed, and how various operations are performed.  '-' means don't care, or no operation is required; combinations marked 'X' should not occur.

| | | | | **Card operation by card status** | | |
|:|:|:|:|:----------------------------------|:|:|
| **Workspace operation** | **card rel/abs** | **source RW/RO** |  | **New** | **Changed** | **Unchanged** |
| Create new | rel  | -     |  | Create | Create  | Create |
| Save             | rel   | -    |  | Create | Update | -          |
| Create new | abs | RW |  | X          | Update | -          |
| Save             | abs | RW |  | X          | Update | -          |
| Create new | abs | RO |  | X          | X            | -          |
| Save             | abs | RO |  | X          | X            | -          |

This design assumes that new cards are created with a URI reference relative to the containing workspace.

Currently, there is no option in this design to save a copy of a card loaded from an absolute URI reference from read-only source.

# Card parameter interactions with I/O operations #

Table entries show the state of each parameter following the indicated operation.  "-" indicates no change.

| **Operation**      | **rel/abs** | **shuffl:dataref** | **shuffl:datauri** | **shuffl:datamod** | **shuffl:dataRW** |
|:-------------------|:------------|:-------------------|:-------------------|:-------------------|:------------------|
| Drop new card | rel             | Construct from card Id | undefined | true             | true |
| Read card         | -               | ref                       | As used for GET    | false            | (per source) |
| Save new card  | rel             | POST response | POST response      | false            | true |
| Update card     | -                | -                         | -                              | false            | -     |
| Edit card           | -               | -                          | -                              | true             | -     |

New cards are distinguished by an undefined **shuffl:datauri** value.

Relative/absolute state is determined by examination of the **shuffl:dataref** value.

Card editing operations are not enabled for cards loaded from a read-only source. Use **Save new...** to create an editable copy if relatively referenced.