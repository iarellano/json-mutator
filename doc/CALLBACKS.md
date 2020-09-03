# json-mutator
Allows to. transform a json object to a given schema


Given source is:
```javascript
var source = {
    "firstName": "John",
    "familyName": {
        "lastName": "Wick",
        "arrayName": [
            "W",
            "i",
            "c",
            "k"
        ],
        "moviNames": {
            "name1": "John Wick",
            "name2": "John Wick - Chapter 2",
            "name3": "John Wick - Chapter 3 - Parabellum"
        }
    },
    "names": [
        {
            "firstName": "John",
            "lastName": "Wick"
        }
    ]
}
```
We'd like to generate the following object
```json
{
    "firstName": [
        "John"
    ],
    "lastName": [
        "Wick"
    ]
}
```
By using the following specification
```javascript
var spec = {
    "source": "names",
    "properties": {
        "firstName": {
            "type": "array",
            "source": "firstName"
        },
        "lastName": {
            "type": "array",
            "source": "lastName"
        }
    }
};

```
But instead we get
```json
{
    "firstName": [
        [
            "John"
        ]
    ],
    "lastName": [
        [
            "Wick"
        ]
    ]
}
```
Clearly this is not the intended result and trying to get this to work would
require a lot of precious programming time which I do not have for the time being. Therefore
this where <i>callbacks</i> can be of great help. Let's modify the spec by adding a callback.

```javascript
var spec = {
    "source": "names",
    "properties": {
        "firstName": {
            "type": "array",
            "source": "firstName",
            "callback": function(o, n, m) { return n[0]; }
        },
        "lastName": {
            "type": "array",
            "source": "lastName"
            "callback": function(o, n, m) { return n[0]; }
        }
    }
};
```

Of course, why not reduce memory overhead, let's reuse the callback
```javascript
var reduce_array = function(o, n, m) {
    return n[0];    
};

var spec = {
    "source": "names",
    "properties": {
        "firstName": {
            "type": "array",
            "source": "firstName",
            "callback": reduce_array
        },
        "lastName": {
            "type": "array",
            "source": "lastName"
            "callback": reduce_array
        }
    }
};
```
