$(function() {
    module('jPath');
    
    var library = {
        'name': 'My Library',
        '@open': '2007-17-7',
        'address': {
            'city': 'Springfield',
            'zip': '12345',
            'state': 'MI',
            'street': 'Mockingbird Lane'
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
    
    test('Chained Methods 1', function() {
        var jp = new JPath(library);
        
        //will result in "Springfield"
        var value = jp.$('address').$('city').json;
		
		equal(value, 'Springfield');
    });
    
    test('Chained Methods 2', function() {
        var jp = new JPath(library);
        
        //with simple node selects this can be
        //condensed too
        var value = jp.$('address/city').json;
		
		equal(value, 'Springfield');
    });
    
    test('Chained Methods 3', function() {
        var jp = new JPath(library);
        
        //will grab the "Brief History of time"
        //book object
        var value = jp.$('books').$(1).json;
		
		deepEqual(value, library.books[1]);
    });
    
    test('Chained Methods', function() {
        var jp = new JPath(library);
        
        //will grab all the books/category
        //properties
        var value = jp.$$('category').json;
		
		deepEqual(value, [ 'Childrens', 'Science', 'Fiction' ]);
    });
    
    test('Chained Methods 4', function() {
        var jp = new JPath(library);

        //will grab all book objects that have
        //a property of available > 0
        var value = jp.$('books').$(function(n) {
            return (n.$('available').json);
        }).json;
		
		deepEqual(value, [ library.books[0] ]);
    });
    
    test('Chained Methods 5', function() {
        var jp = new JPath(library);
        
        //this will do the same query but with
        //less code
        var value = jp.$('books').f("$('available').json").json;
		
		deepEqual(value, [ library.books[0] ]);
    });
});
