// functions
(function () {
    //function definition (global)
    function greet(name) {
        return 'hello ' + name;
    }

    //anonymous function expression
    var greet = function (name) {
        return 'hello ' + name;
    };

    //named function expression
    //https://kangax.github.io/nfe/
    var aGreet = function greet(name) {
        return 'hello ' + name;
    };

    //passed as argument
    var surround = function (func, name) {
        return '(' + func(name) + ')';
    };

    // returned
    var makeGreet = function () {
        return function (name) {
            return 'hello' + name;
        };
    };
})();

//scope
//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Scope_Cheatsheet
(function () {
    var foo = function () {
        var a = 3, b = 5;
        var bar = function () {
            var b = 7,
                c = 11;
            a += b + c;
            //a: 21, b: 7, c: 11
        };
        //a: 3, b: 5
        bar();
        //a: 21, b: 5
    };
})();

// dynamic scope
(function () {
    function g() {
        print("global");
    }

    function f(cond) {
        if (cond) {
            function g() {
                print("inner");
            }
        }
        g(); // "inner" when cond, "global" when !cond
    }
})();

//hoisting
(function () {
    var foo = 'hi!';
    var bar = function () {
        document.writeln(foo); //undefined
        var foo = 'hello!';
        document.writeln(foo); //hello!
    };
    bar();

    var foo = 'hi!';
    var bar = function () {
        // single var -> the good parts
        var foo;
        document.writeln(foo); //undefined
        foo = 'hello!';
        document.writeln(foo); //hello!
    };
    bar();
})();

// closure
(function () {
    var foo = function (arg) {
        var bar = 'baz';
        return {
            getBar: function () {
                return bar + arg;
            }
        };
    };
    document.writeln(foo('!').getBar());
    //print: baz!
})();

// Objects
(function () {
    var foo = {};
    var bar = {
        name: {
            first: 'Henk',
            last: 'Bakker'
        },
        age: 21,
        active: true,
        twitter: function () {
            var n = this.name;
            return '@' + n.first + n.last;
        },
        tags: ['js', 'web', 'abn']
    };
})();

// Objects
(function () {
    //Object are dynamic
    var person = {};

    //set operations
    person.name = 'henk';
    person['surname'] = 'bakker';

    //get operations
    var n = person.name = 'henk';
    var s = person['surname'] = 'bakker';
    var a = person.age || "not set"; //safe

    //delete operations
    delete person.surname;

    //enumeration
    var prop;
    for (prop in person) {
        document.writeln(prop + ':' + person[prop]);
    } // print: name:henk

    //methods
    person.say = function (word) {
        return word + ' ' + this.name;
    };
    document.writeln('hello');
})();

//prototype
// https://sporto.github.io/blog/2013/02/22/a-plain-english-guide-to-javascript-prototypes/
(function () {
    var name = {
        first: 'henk',
        last: 'bakker'
    };

    var twitter = Object.create(name);
    twitter.account = function () {
        return '@' + this.first + this.last;
    };
    document.writeln(twitter.account());
// print: @henkbakker
})();

// context
(function () {
    //function invocation
    var sum = function (a, b) {
        return a + b;
    };
    //this is bound to the global object
    var value = sum(1, 2);

    //method invocation
    var foo = {
        value: 0,
        increment: function (inc) {
            this.value += inc;
        }
    };
    //this is bound to foo
    foo.increment(2);

    //constructor invocation
    var Foo = function (string) {
        this.bar = string;
    };
    //this is bound to the new object
    var one = new Foo('one');
    var two = new Foo('two');

    //apply invocation
    var foo = {
        value: 0
    };
    var increment = function (inc) {
        this.value += inc;
    };
    //this is bound to the first param
    increment.apply(foo, [1]);
})();

//object creation
(function () {
    var makePerson = function () {
        var settings = {
            say: 'hallo',
            name: 'sir'
        };
        var greeting = function (spec) {
            return spec.say || settings.say + ' ' + spec.name || settings.name;
        };
        return {
            greeting: greeting
        }
    };
    var p = makePerson();
    var result = p.greeting({name: 'henk'});
    //result: hello henk
})();

//object creation
(function () {
    var Person = function (name) {
        this.name = name;
        //bad: redefined for each new object
        this.toString = function () {
            return 'I am ' + this.name;
        }
    };
    //good: defined one time for all objects
    Person.prototype.greeting = function (say) {
        return say + ' ' + this.name;
    };
    var p1 = new Person('henk');
    var p2 = new Person('jan');
    var result1 = p1.greeting('hi');
    var result2 = p2.toString();
    //result1: hi henk
    //result2: I am jan
})();

//object creation
(function () {
    var Person = Object.create(Object.prototype);
    Person.prototype = {
        greeting: function (say) {
            return say + ' ' + this.name;
        }
    };
    var p = Object.create(Person.prototype, {
        name: {
            writeble: true,
            configurable: true,
            value: 'henk'
        }
    });
    var result = p.greeting('hi');
    //result: hi henk
})();

//information hiding
(function () {
    var foo = {
        names: ['one', 'two', 'three'],
        digit_name: function (n) {
            return this.names[n];
        }
    };
    //remove 'three' aka change
    //internal state, very very bad!@!
    foo.names.splice(2, 1);
    document.writeln(foo.digit_name(2));
    //print: undefined
})();

//information hiding
(function () {
    //private but slow
    var digit_name = function (n) {
        var names = ['one', 'two', 'three'];
        return names[n];
    };
    var foo = {
        diget_name: digit_name
    };
    document.writeln(foo.diget_name(2));
    //print: three
})();

//information hiding
(function () {
    //private and fast, thank's to immediate functions and closure
    var digit_name = (function () {
        var names = ['one', 'two', 'thee'];
        return function (n) {
            return names[n];
        };
    })();
    var foo = {
        digit_name: digit_name
    };
    document.writeln(foo.digit_name(2));
    //print: three
})();




