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

Usage
-----
	var jpath = new JPath( myjsonobj );
 	var somevalue = jpath.$('book/title').json;  //results in title
		//or
	var somevalue = jpath.query('book/title');   //results in title

Supported XPath-like Syntax:
	/tagname
	//tagname
	tagname
	* wildcard
	[] predicates
	operators ( >=, ==, <= )
	array selection
	.. 	         
	*
	and, or
	nodename[0]
	nodename[last()]
	nodename[position()]
	nodename[last()-1]
	nodename[somenode > 3]/node
	nodename[count() > 3]/node

Compatibility
-------------
* Firefox 2-3
* IE 6-7
* Chrome

Update Log
----------
1.0.1
        Bugfix for zero-based element selection

1.0.2
        Bugfix for IE not handling eval() and returning a function

1.0.3 - Bugfix added support for underscore and dash in query() function
        Bugfix improper use of Array.concat which was flattening arrays
        Added support for single equal sign in query() function
        Added support for count() xpath function
        Added support for and, or boolean expression in predicate blocks
        Added support for global selector $$ and //
        Added support for wildcard (*) selector support
         
1.0.4
        Changed to MIT license
1.0.5
        Added jPath as alias to JPath
        Using $.extend to extend jPath prototype
        Moved initalizing into a function closure
