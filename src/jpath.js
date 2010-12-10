/*
 * JPath 1.0.5 - json equivalent to xpath
 * Copyright (C) 2009  Bryan English <bryan at bluelinecity dot com>
 * Copyright (C) 2010  Steve Bjorg <steveb at mindtouch dot com>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
(function() {
    var root = this;
    
    // jPath definition
    var JPath = root.jPath = root.JPath = function(json, parent) {
        if (!(this instanceof JPath)) {
            return new JPath(json, parent);
        }
        
        /*
         * Property: json
         *   Copy of current json segment to operate on
         */
        this.json = json;
        
        /*
         * Property: parent
         *   Parent json object, null if root.
         */
        this._parent = parent || null;
    };
    
    // private jPath functions
    
    /*
     * Function: _findAllByRegExp
     *   Looks through a list of an object properties using a regular expression
     * Parameters:
     *   re - regular expression, to use to search with
     *   obj - object, the object to search through
     * Returns:
     *   array - resulting properties
     */
    var _findAllByRegExp = function(re, obj) {
        var a = [];
        if (obj instanceof Array) {
            for (var i = 0, length = obj.length, value = obj[0]; i < length; value = obj[++i]) {
                a = a.concat(_findAllByRegExp(re, value));
            }
        } else {
            for (var p in obj) {
                var value = obj[p];
                if (typeof(value) !== 'function' && re.test(p)) {
                    a.push(value);
                }
            }
        }
        return a;
    };
    
    // public jPath methods
    $.extend(JPath.prototype, {
    
        /*
         * Method: $
         *   Performs a find query on the current jpath object.
         * Parameters:
         *   str - mixed, find query to perform. Can consist of a nodename or nodename path or function object or integer.
         * Return:
         *   jpath - Returns the resulting jpath object after performing find query.
         */
        '$': function(str) {
            var result = null;
            var working = this;
            
            // check if there's anything to do
            if (this.json && str !== null) {
            
                // determine how to interpret the parameter
                switch (typeof(str)) {
                case 'function':
                    
                    // use parameter as selection function
                    result = this.f(str).json;
                    break;
                case 'number':
                    
                    // use parameter as index
                    result = this.json[str] || null;
                    break;
                case 'string':
                    
                    // use parameter as path expression
                    var names = str.replace('*', '.*').split('/');
                    
                    // foreach slash delimited node name
                    for (var i = 0, length = names.length, value = names[0]; i < length; value = names[++i]) {
                        var name = new RegExp('^' + value + '$');
                        var isArray = (working.json instanceof Array);
                        var a = [];
                        
                        // foreach working node property
                        for (var p in working.json) {
                            var property = working.json[p];
                            
                            // skip functions
                            if (typeof(property) !== 'function') {
                                if (isArray && (arguments.callee.caller !== this.$$)) {
                                    a = a.concat(_findAllByRegExp(name, property));
                                } else if (name.test(p)) {
                                    a.push(property);
                                }
                            }
                        }
                        working = new JPath((a.length === 0 ? null : (a.length === 1) ? a[0] : a), working);
                    }
                    return working;
                }
            }
            return new JPath(result, this);
        },
        
        /*
         * Method: $$
         *   Performs a global, recursive find query on the current jpath object.
         * Parameters:
         *   str - mixed, find query to perform. Can consist of a nodename or nodename path or function object or integer.
         * Return:
         *   jpath - Returns the resulting jpath object after performing find query.
         */
        '$$': function(str) {
        
            // match all nodes for current scope
            var r = this.$(str).json;
            var arr = [];
            
            // check if match returned an array
            if (r instanceof Array) {
            
                // append array to result
                arr = arr.concat(r);
            } else if (r !== null) {
            
                // add item to result
                arr.push(r);
            }
            
            // enumerate all properties of the current scope
            for (var p in this.json) {
                var property = this.json[p];
                
                // if property is an object, recurse into it
                if (typeof(property) === 'object') {
                
                    // append recursive matches to result
                    arr = arr.concat(new JPath(property, this).$$(str).json);
                }
            }
            return new JPath(arr, this);
        },
        
        /*
         * Method: query (beta)
         *   Performs a find query on the current jpath object using a single string similar to xpath. This method
         *   is currently expirimental.
         * Parameters:
         *   str - string, full xpath-like query to perform on the current object.
         * Return:
         *   mixed - Returns the resulting json value after performing find query.
         */
        query: function(str) {
            var re = {
                " and ": " && ",
                " or ": " || ",
                "([\\#\\*\\@a-z\\_][\\*a-z0-9_\\-]*)(?=(?:\\s|$|\\[|\\]|\\/))": "\$('$1').",
                "\\[([0-9])+\\]": "\$($1).",
                "\\.\\.": "parent().",
                "\/\/": "$",
                "(^|\\[|\\s)\\/": "$1root().",
                "\\/": '',
                "([^\\=\\>\\<\\!])\\=([^\\=])": '$1==$2',
                "\\[": "$(function(j){ with(j){return(",
                "\\]": ");}}).",
                "\\(\\.": '(',
                "(\\.|\\])(?!\\$|\\p)": "$1json",
                "count\\(([^\\)]+)\\)": "count('$1')"
            };
            
            // save quoted strings
            var quotes = /(\'|\")([^\1]*)\1/;
            var saves = [];
            while (quotes.test(str)) {
                saves.push(str.match(quotes)[2]);
                str = str.replace(quotes, '%' + (saves.length - 1) + '%');
            }
            for (var e in re) {
                str = str.replace(new RegExp(e, 'ig'), re[e]);
            }
            return eval('this.' + str.replace(/\%(\d+)\%/g, 'saves[$1]') + ';');
        },
        
        /*
         * Method: f
         *   Performs the equivilant to an xpath predicate eval on the current nodeset.
         * Parameters:
         *   f - function, an iterator function that is executed for every json node and is expected to return a boolean
         *       value which determines if that particular node is selected. Alternativly you can submit a string which will be
         *       inserted into a prepared function.
         * Return:
         *   jpath - Returns the resulting jpath object after performing find query.
         */
        f: function(iterator) {
            var a = [];
            
            // check if iterator is an expression string
            if (typeof(iterator) === 'string') {
            
                // convert iterator into a function
                eval('iterator = function(j){with(j){return(' + iterator + ');}}');
            }
            
            // iterate over all entries
            for (var p in this.json) {
                var j = new JPath(this.json[p], this);
                j.index = p;
                if (iterator(j)) {
                    a.push(this.json[p]);
                }
            }
            return new JPath(a, this);
        },
        
        /*
         * Method: parent
         *   Returns the parent jpath object or itself if its the root node
         * Return:
         *   jpath - Returns the parent jpath object or itself if its the root node
         */
        parent: function() {
            return (this._parent) ? this._parent : this;
        },
        
        /*
         * Method: position
         *   Returns the index position of the current node. Only valid within a function or predicate
         * Return:
         *   int - array index position of this json object.
         */
        position: function() {
            return this.index;
        },
        
        /*
         * Method: last
         *   Returns true if this is the last node in the nodeset. Only valid within a function or predicate
         * Return:
         *   booean - Returns true if this is the last node in the nodeset
         */
        last: function() {
            return this.index === (this._parent.json.length - 1);
        },
        
        /*
         * Method: count
         *   Returns the count of child nodes in the current node
         * Parameters:
         *   string - optional node name to count, defaults to all
         * Return:
         *   booean - Returns number of child nodes found
         */
        count: function(n) {
            var found = this.$(n || '*').json;
            return found ? (found instanceof Array ? found.length : 1) : 0;
        },
        
        /*
         * Method: root
         *   Returns the root jpath object.
         * Return:
         *   jpath - The top level, root jpath object.
         */
        root: function() {
            return this._parent ? this._parent.root() : this;
        },
        
        /*
         * Method: text
         *   Returns the text value of the current node
         * Return:
         *   string - Return text value of the current node
         */
        text: function() {
            var json = this.json;
            while (json !== null) {
                switch (typeof(json)) {
                case 'boolean':
                case 'number':
                    return json.toString();
                case 'string':
                    return json;
                case 'object':
                    if (typeof json.length === 'undefined') {
                        var text = json['#text'];
                        return (typeof text !== 'undefined') ? text : null;
                    } else if (json.length > 0) {
                        json = json[0];
                    } else {
                        return null;
                    }
                    break;
                default:
                    return null;
                }
            }
            return null;
        }
    });
})();
