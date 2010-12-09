JPath
=====
*XPath for JSON*

JPath is a simple lightweight Javascript Class which provides an XPath-like querying ability to JSON objects.

Features
--------
* basic node selection
* element index selection
* unlimited, nested predicate selections via inline javascript functions
* 2 methods of querying, chained javascript functions or traditional XPath query string
* root, parent, global node selections
* predicate functions [ last(), position(), count() ]
* boolean operators

Using JPath
-----------
There are two syntactic methods to using JPath - chained method calls or an XPath query.

Chained method calls offers the most control but with a high level of complexity. 
XPath query is a lot easier to use but with the caveat that it's considered beta 
and rather limited as far as Javascript features go.