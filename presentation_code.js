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
        document.writeln("global");
    }

    function f(cond) {
        if (cond) {
            function g() {
                document.writeln("inner");
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
// http://jibbering.com/faq/notes/closures/
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
        digit_name: digit_name
    };
    document.writeln(foo.digit_name(2));
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


//inheritance pseudo
//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/create
(function () {
    var Car = function (speed) {
        this.speed = speed;
    };
    Car.prototype.accelerates = function (level) {
        this.speed += level;
    };
    //supercar inherit from car
    var Supercar = function (speed, power) {
        this.speed = speed;
        this.power = power;
    };
    Supercar.prototype = Object.create(Car.prototype);
    Supercar.prototype.constructor = Supercar;

    Supercar.prototype.boost = function () {
        this.speed += this.power;
    };
    var s = new Supercar(3, 100);
    s.accelerates(5);
    s.boost();
    document.writeln(s.speed);
    //print: 108
})();

//inheritance proto
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Inheritance_and_the_prototype_chain
(function () {
    var car = {
        speed: 0,
        accelerates: function (level) {
            this.speed += level;
        }
    };
    //supercar inherit from car
    var supercar = Object.create(car);
    supercar.boost = function () {
        this.accelerates(100);
    };
    car.accelerates(2);
    supercar.boost();
    document.writeln(car.speed, ' ', supercar.speed, ' ', supercar.hasOwnProperty('accelerates'));
    //print: 2 102 false
})();

//inheritance copy
(function () {
    var extend = function (parent, child) {
        var i, child = child || {};
        for (i in parent) {
            if (parent.hasOwnProperty(i)) {
                child[i] = parent[i];
            }
        }
        return child;
    };
    var car = {
        speed: 0,
        accelerates: function (level) {
            this.speed += level;
        }
    };
    //supercar inherit(copy) from car
    var supercar = extend(car);
    supercar.boost = function () {
        this.accelerates(100);
    };
    car.accelerates(2);
    supercar.boost();
    document.writeln(car.speed, ' ', supercar.speed, ' ', supercar.hasOwnProperty('accelerates'));
    //print: 2 100 false
})();

//inheritance mixin
(function () {
    var mixin = function () {
        var arg, prop, child = {};
        for (arg = 0; arg < arguments.length; arg += 1) {
            for (prop in arguments[arg]) {
                if (arguments[arg].hasOwnProperty(prop)) {
                    child[prop] = arguments[arg][prop];
                }
            }
        }
        return child;
    };
    var car = {
        speed: 0,
        accelerates: function (level) {
            this.speed += level;
        }
    };
    var person = {name: 'a'};
    //supercar inherit(copy) from car
    var supercar = mixin(car, person);
    supercar.name = 'supercar';
    supercar.accelerates(3);

    document.writeln(car.speed, ' ', supercar.name, ' ', supercar.speed);
    //print: 0 supercar 3
})();

//inheritance functional
(function () {
    var makeCar = function () {
        var that = {};//step 1
        that.speed = 0;//step 3
        that.accelerates = function (level) {
            that.speed += level;
        };
        return that; //step 4
    };
    var makeSuperCar = function () {
        //supercar inherit from car
        var that = makeCar(),//step 1
            boostLevel = 100;// step 2
        that.boost = function () { //step 3
            that.accelerates(boostLevel);
        };
        return that; //step 4
    };
    var c = makeCar();
    var s = makeSuperCar();
    c.accelerates(3);
    s.boost();
    document.writeln(c.speed, ' ', s.speed);
    //print: 3 100
})();

//callback
(function () {
    var point = {
        color: 'green',
        paint: function (area) {
            area.writeln(this.color);
        }
    };
    var doSomething = function (callback) {
        callback(document);
    };
    //underscore way: http://underscorejs.org/docs/underscore.html#section-65
    var capture = function (func, obj) {
        return function () {
            func.apply(obj, arguments);
        };
    };
    doSomething(point.paint());
    doSomething(capture(point.paint(), point));
    //capture the context the ECMAscript 5 way
    doSomething(point.paint.bind(point));
    //print: undefined green green
})();

//iterator
(function () {
    var numbers = [1, 4, 9];
    numbers.forEach(function (x) {
        document.writeln(x);
    });//print: 1 4 9
    numbers.every(function (x) {
        return x % 2 === 0;
    });//result: false
    numbers.some(function () {
        return x % 2 === 0;
    });//result: true
    numbers.map(function (x) {
        return x * x;
    });//result: 1, 16, 81
    numbers.filter(function (x) {
        return x % 2 === 0;
    });//result: 4
    numbers.reduce(function (x, y) {
        return x + y;
    });//result: 14
})();

//iterators
(function () {
    var numbers = [1, 4, 9];
    var result = numbers.map(function (i) {
        return i * 2;
        //result: 2 8 18
    }).filter(function (i) {
        return i % 2 === 0;
        //result: 2 8 18
    }).reduce(function (i, total) {
        return i + total;
        //result: 28
    });
    document.writeln(result);
    //print: 28
})();

//iterator
(function () {
    var numbers = [1, 4, 9];
    var square = function (arr) {
        return arr.map(function (i) {
            return i * 2;
        });
    };
    var even = function (arr) {
        return arr.filter(function (i) {
            return i % 2 === 0;
        });
    };
    var sum = function (arr) {
        return arr.reduce(function (i, total) {
            return i + total;
        });
    };
    var result = sum(even(square((numbers))));
    document.writeln(result);
    //print: 28
})();


