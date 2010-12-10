$(function() {
    module('jPath');
    
    var library = {
        'name': 'My Library',
        '@open': '2007-17-7',
        'address': {
            'city': 'Springfield',
            'zip': '12345',
            'state': 'MI',
            'street': {
				'@primary': 'true',
				'#text': 'Mockingbird Lane'
			}
        },
        'books': [{
            'title': 'Harry Potter',
            'isbn': '1234-1234',
            'category': 'Childrens',
            'available': '3',
            'chapters': ['Chapter 1', 'Chapter 2']
        }, {
            'title': 'Brief History of time',
            'isbn': '1234-ABCD',
            'category': 'Science',
            'chapters': ['1', '2']
        }, {
            'title': 'Lord of the Rings',
            'isbn': '1234-PPPP',
            'category': 'Fiction',
            'chapters': ['Section 1', 'Section 2']
        }],
        'categories': [{
            'name': 'Childrens',
            'description': 'Childrens books'
        }, {
            'name': 'Science',
            'description': 'Books about science'
        }, {
            'name': 'Fiction',
            'description': 'Fiction books'
        }]
    };
    
    test("jp.$('address').$('city').json", function() {
        var jp = jPath(library);
        
        // will result in 'Springfield'
        var value = jp.$('address').$('city').json;
        
        equal(value, 'Springfield');
    });
    
    test("jp.$('address/city').json", function() {
        var jp = jPath(library);
        
        // with simple node selects this can be condensed too
        var value = jp.$('address/city').json;
        
        equal(value, 'Springfield');
    });
    
    test("jp.$('books').$(1).json", function() {
        var jp = jPath(library);
        
        // will grab the 'Brief History of time' book object
        var value = jp.$('books').$(1).json;
        
        deepEqual(value, library.books[1]);
    });
    
    test("jp.$$('category').json", function() {
        var jp = jPath(library);
        
        // will grab all the books/category properties
        var value = jp.$$('category').json;
        
        deepEqual(value, ['Childrens', 'Science', 'Fiction']);
    });
    
    test("jp.$('books').$(function(n) {return n.$('available').json;}).json", function() {
        var jp = jPath(library);
        
        // will grab all book objects that have a property of available > 0
        var value = jp.$('books').$(function(n) {
            return n.$('available').json;
        }).json;
        
        deepEqual(value, [library.books[0]]);
    });
    
    test("jp.$('books').f(\"$('available').json\").json", function() {
        var jp = jPath(library);
        
        // this will do the same query but with less code
        var value = jp.$('books').f("$('available').json").json;
        
        deepEqual(value, [library.books[0]]);
    });
    
    test("jp.$('name').text()", function() {
        var jp = jPath(library);
        
        // this will do the same query but with less code
        var value = jp.$('name').text();
        
        equal(value, 'My Library');
    });
    
    test("jp.$('address/city').text()", function() {
        var jp = jPath(library);
        
        // this will do the same query but with less code
        var value = jp.$('address/city').text();
        
        equal(value, 'Springfield');
    });
    
    test("jp.$('address/street').text()", function() {
        var jp = jPath(library);
        
        // this will do the same query but with less code
        var value = jp.$('address/street').text();
        
        equal(value, 'Mockingbird Lane');
    });
});
