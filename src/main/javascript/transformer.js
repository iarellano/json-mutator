

var print = print || function(value) { console.log(value) };

// var console = console || {
//     log: function() { print(arguments) }
// };

var printJson = function(value) { console.log(JSON.stringify(value, null, 4)) };

var source = {
    firstName: "Isaias",
    familyName: {
        lastName: "Arellano",
        motherName: {
            name: "Delgado",
            name2: "Delgado2"
        }
    },
    secondLastName: "10.5",
    surname: "Delgado"
};

var map = {
    type: "object",
    properties: {
        giveName: "firstName",
        surname: {
            source: ["familyName", "lastName"]
        },
        motherName: {
            source: [
                "familyName", "motherName", "name"
            ]
        },
        lastName: {
            source: "familyName",
            type: "object",
            properties: {
                surname: "lastName"
            }
        },
        newProperty: {
            type: 'object',
            properties: {
                subNewProperty: {
                    type: "object",
                    properties: {
                        IsaiasName: {
                            source: "firstName"
                        },
                        IsaiasLastName: {
                            source: "surname"
                        }
                    }
                }
            }
        },
        newProperty2: {
            type: 'object',
            properties: {
                subNewProperty2: {
                    type: "object",
                    properties: {
                        IsaiasName2: "firstName",
                        IsaiasLastName2: "surname"
                    }
                }
            }
        },
        newProperty2: {
            type: 'object',
            source: ["familyName", "motherName"],
            properties: {
                nestedName: {
                    type: "object",
                    properties: {
                        IsaiasName2: "name",
                        IsaiasName3: "name2",
                        IsaiasName4: {
                            source: "name2"
                        }
                    }
                }
            }
        }
    }
};

var s = {
    firstName: "Isaias",
    familyName: {
        lastName: "Arellano",
        arrayName: ["i", "s", "a", "i", "a", "s"],
        motherName: {
            name: "Delgado",
            name2: "Delgado2"
        }
    },
    secondLastName: "10.5",
    surname: "Delgado",
    ar1: [
        [
            {"ar2:": "name"}
        ]
    ]
};

var m1 = {
    type: "object",
    source: ["familyName", "motherName", "..", "..", "familyName"],
    properties: {
        copyOffamilyName: {
            source: ["..","familyName"]
        },
        fatherName: {
            source: ["..","firstName"]
        },
        mother_name: {
             source: ["motherName", "name", "..", "..", "..", "familyName", "motherName", "name"]//,
            // callback: function(old, n, ma) {
            //     return n ? n.toUpperCase() : 'valor nulo';
            // }
        },
        givenName3: {
            type: 'array',
            source: ["lastName"]//,
            // callback: function(old, n, ma) {
            //     return n ? n.toUpperCase() : 'valor nulo';
            // }
        },
        givenName4: {
            type: 'array',
            source: ["arrayName"],
            callback: function(old, n, ma) {
                return n ? n.join(' - ') : 'valor nulo';
            }
        },
        givenName5_1: {
            type: 'array',
            source: "lastName"
        },
        givenName5_2: {
            type: 'array',
            items: {
                source: "lastName"
            }
        }
    }
};

var m2 = {
    type: "object",
    properties: {
        // array1: {
        //     type: "array",
        //     items: {
        //         "type": "object",
        //         "source": ["familyName"],
        //         "properties": {
        //             "joinedName": "arrayName",
        //             "surname": "lastName"
        //         }
        //     }
        // },
        // array2: {
        //     type: "array",
        //     items: {
        //         "source": ["familyName", "arrayName"]
        //     }
        // }
        // ,
        // array3: {
        //     type: "array",
        //     items: {
        //         "type": "array",
        //         "source": ["familyName", "arrayName"]
        //     }
        // }
        // ,
        // array4: {
        //     type: "array",
        //     source: ["familyName", "motherName", "name"]
        // },
        array5: {
            type: "array",
            source: ["ar1"],
            items: {
                type: "array",
                source: "ar2"
            }
        }
    }
};

// print("--------------------schema1--------------------------------");
// printJson(map)
// print("--------------------schema2--------------------------------");
// printJson(m)
// print("--------------------schema find--------------------------------");

// console.log(JSON.stringify(transform(source, map), null, 4));
console.log(JSON.stringify(transform(s, m2), null, 4));

// printJson(getSourceObject(s, m, []));

function __replace(value, mapping) {
    if (value === null) {
        return value;
    }
    if (mapping.replace) {
        if (typeof value === "string") {
            var replace = mapping.replace;
            if (replace.search) {
                value = value.replace(replace.search, replace.replacer);
            } else if (replace.regex) {
                value = value.replace(new RegExp(replace.regex), replace.replacer);
            } else {
                throw "replace mapping needs either search or regex property to be set. Offending mapping " + JSON.stringify(mapping);
            }
        } else {
            throw "replace can only be applied to string values. Offending mapping " + JSON.stringify(mapping);
        }
    }
    return value;
}

function __callback(sourceValue, value, mapping) {
    if (mapping.callback) {
        return mapping.callback(sourceValue, value, mapping);
    };
    return value;
}

function transform(srcObject, mapping) {
    var pointer = arguments[2] || [srcObject];

    if (typeof mapping === "string") {
        var value = srcObject.hasOwnProperty(mapping) ? srcObject[mapping] : null;
        return __callback(value, value, mapping);
    }

    var type = mapping.type
        ? mapping.type
        : mapping.properties
            ? 'object'
            : mapping.items
                ? 'array'
                : null;

    if (!type || (type != "object" && type != "array")) {
        if ( !Array.isArray(mapping.source) || Array.isArray(mapping.source) && mapping.source.length == 1) {
            var source = Array.isArray(mapping.source) ? mapping.source[0] : mapping.source;
            var sourceValue = srcObject[source] ? srcObject[source] : null;
            var value = type
                ? asType(sourceValue)
                : sourceValue;
            return __callback(sourceValue, __replace(value, mapping), mapping);
        } else if (Array.isArray(mapping.source)) {
            var value = null;
            var source = mapping.source.shift();
            if (source === '..') {
                if (pointer.length > 0) {
                    var pointerItem = pointer.pop();
                    var callback = mapping.callback;
                    delete mapping.callback;
                    value = transform(pointerItem, mapping, pointer);
                    pointer.push(pointerItem);
                    mapping.source.unshift(source);
                    if (callback) {
                        mapping.callback = callback;
                        value = __callback(pointerItem, value, mapping);
                    }
                } else {
                    mapping.source.push(source);
                    throw "Root object reached. Check your usage of parent references '..'. Offending mapping " + JSON.stringify(mapping);
                }
            } else {
                pointer.push(srcObject);
                var callback = mapping.callback;
                delete mapping.callback;
                value = transform(srcObject[source], mapping, pointer);
                pointer.pop();
                mapping.source.unshift(source);
                if (callback) {
                    mapping.callback = callback;
                    value = __callback(pointerItem, value, mapping);
                }
            }
            return value;
        }
    } else if ( type === 'object' ) {
        if (!mapping.properties) {
            throw "mapping with type as 'object' is missing properties definitions. Offending mapping " + JSON.stringify(mapping);
        }
        if (!srcObject) return null;

        var object = {};
        if (!Array.isArray(mapping.source) || !mapping.source || (Array.isArray(mapping.source) && mapping.source.length == 1)) {
            var callback = mapping.callback;
            delete mapping.callback;
            if (!mapping.source) { // No source mapping, it means current object is the source object
                for (var property in mapping.properties) {
                    object[property] = transform(srcObject, mapping.properties[property], pointer);
                }
                mapping.callback = callback;
                object = __callback(srcObject, object, mapping);
            } else if (mapping.source === '..' || mapping.source[0] === '..') {
                var pointerItem = pointer.pop();
                for (var property in mapping.properties) {
                    object[property] = transform(pointerItem, mapping.properties[property], pointer);
                }
                pointer.push(pointerItem);
                mapping.callback = callback;
                object = __callback(pointerItem, object, mapping);
            } else if (Array.isArray(mapping.source) && srcObject[mapping.source[0]] || srcObject[mapping.source]) {
                // pointer.push(srcObject[mapping.source]);
                pointer.push(srcObject);
                for (var property in mapping.properties) {
                    object[property] = transform(srcObject[mapping.source], mapping.properties[property], pointer);
                }
                pointer.pop();
                mapping.callback = callback;
                object = __callback(srcObject, object, mapping);
            } else {
                mapping.callback = callback;
                object = __callback(null, object, mapping);
            }
        } else {

            var callback = mapping.callback;
            delete mapping.callback;

            var source = mapping.source.shift();
            if (source === '..') {
                var pointerItem = pointer.pop();
                object = transform(pointerItem, mapping, pointer)
                mapping.source.unshift(source);
                pointer.push(pointerItem);
                if (callback) {
                    mapping.callback = callback;
                    object = __callback(pointerItem, object, mapping);
                }
            } else {
                pointer.push(srcObject);
                object = transform(srcObject, mapping, pointer);
                mapping.source.unshift(source);
                pointer.pop();
                if (callback) {
                    mapping.callback = callback;
                    object = __callback(srcObject, object, mapping);
                }
            }
        }
        return object;
    } else if ( type === 'array' ) {

        if (!srcObject) return null;

        var callback = mapping.callback;
        delete mapping.callback;

        var array = null;

        if (Array.isArray(mapping.source) && mapping.source.length > 1) {
            if (Array.isArray(srcObject)) {
                for (var i = 0; i < srcObject.length; i++) {
                    pointer.push(srcObject[i]);
                    array.push(transform(srcObject[i], mapping, pointer));
                    pointer.pop();
                }
            } else {
                //@TODO check here if referencing parent node
                var source = mapping.source.shift();
                pointer.push(srcObject);
                array = transform(srcObject[source], mapping, pointer);
                pointer.pop();
                mapping.source.unshift(source);
            }
        } else if (!Array.isArray(mapping.source) || Array.isArray(mapping.source) && mapping.source.length === 1 ) {

            var source = !Array.isArray(mapping.source) ? mapping.source : mapping.source[0];
            if (!Array.isArray(srcObject) && typeof srcObject === 'object') {
                if (mapping.items) {
                    pointer.push(srcObject);
                    var value = transform(srcObject, mapping.items, pointer);
                    pointer.pop();
                    if (Array.isArray(value)) {
                        array = value;
                    } else {
                        array = [value];
                    }
                } else {
                    pointer.push(srcObject);
                    array = Array.isArray(srcObject[source]) ? srcObject[source] : [srcObject[source]];
                }
            } else if (Array.isArray(srcObject)) {
                if (mapping.items) {
                    pointer.push(srcObject);
                    srcObject[srcObject];
                    var value = transform(srcObject[source], mapping.items, pointer);
                    pointer.pop();
                    if (Array.isArray(value)) {
                        array = value;
                    } else {
                        array = [value];
                    }
                } else {
                    pointer.push(srcObject);
                    array = Array.isArray(srcObject[source]) ? srcObject[source] : [srcObject[source]];
                }
            }
        } else if (!mapping.source) {
            array = [];
            if (Array.isArray(srcObject)) {
                if (mapping.items) {
                    for (var i = 0; i < srcObject.length; i++) {
                        array.push(transform(srcObject[i], mapping.items, pointer));
                    }
                } else {
                    array = srcObject;
                }
            } else {  // Array to be created from object
                if (mapping.items) {
                    var value = transform(srcObject, mapping.items, pointer);
                    if (Array.isArray(value)) {
                        array = value;
                    } else {
                        array = [value];
                    }
                }
            }
        } else if (mapping.source && !mapping.items) {
            if (!Array.isArray(mapping.source)) {
                if (!Array.isArray(srcObject)) {
                    pointer.push(srcObject);
                    array = transform(srcObject[source], mapping.items, pointer);
                    pointer.pop();
                }
            }
            var source = !Array.isArray(mapping.source) ? mapping.source : mapping.source[0];
            if (!Array.isArray(srcObject)) {
                if (mapping.items) {

                    array = transform(srcObject[source], mapping.items, pointer)
                } else {

                }
            }



        } else {
        }
        // else if (mapping.source && !Array.isArray(mapping.source) || Array.isArray(mapping.source) && mapping.source.length === 1) {
        //     var source = !Array.isArray(mapping.source) ? mapping.source : mapping.source[0];
        //     if (Array.isArray(srcObject)) {
        //
        //     } else {
        //
        //     }
        // }
        // if (!mapping.items) {
        //     if (!Array.isArray(mapping.source) || Array.isArray(mapping.source) && mapping.source.length === 1) {
        //         if (!mapping.source) {
        //             throw "mapping source is required if no items are defined. Offending mapping " + JSON.stringify(mapping);
        //         }
        //         var source = Array.isArray(mapping.source) ? mapping.source[0] : mapping.source;
        //         if (source === '..') {
        //             if (Array.isArray(srcObject)) {
        //                 array = srcObject;
        //             } else {
        //                 array = [srcObject];
        //             }
        //             if (callback) {
        //                 mapping.callback = callback;
        //                 array = __callback(srcObject[source], array, mapping)
        //             }
        //         } else {
        //             if (Array.isArray(srcObject[source])) {
        //                 array = srcObject[source];
        //             } else {
        //                 array = [srcObject[source]];
        //             }
        //             if (callback) {
        //                 mapping.callback = callback;
        //                 array = __callback(srcObject[source], array, mapping)
        //             }
        //         }
        //     } else if (Array.isArray(mapping.source)) {
        //         var source = mapping.source.shift();
        //         pointer.push(srcObject);
        //         array = transform(srcObject, mapping, pointer);
        //         pointer.pop();
        //         mapping.source.unshift(source);
        //     }
        // } else {
        //     array = [];
        //     var object = {};
        //     if (!mapping.source) {
        //         if (Array.isArray(srcObject)) {
        //             for (var i = 0; i < srcObject.length; i++) {
        //                 array.push(transform(srcObject[i], mapping.items, pointer))
        //             }
        //         } else {
        //             array = transform(srcObject, mapping.items, pointer);
        //         }
        //         if (callback) {
        //             mapping.callback = callback;
        //             array = __callback(srcObject, array, mapping)
        //         }
        //     } else {
        //         var source = mapping.source.shift();
        //         if (source === '..') {
        //             // var pointerItem = pointer.pop();
        //             // array = transform(srcObject, mapping, pointer);
        //         } else {
        //             // pointer.push(srcObject);
        //             array = transform(srcObject, mapping, pointer);
        //
        //             // pointer.pop();
        //             mapping.source.unshift(source);
        //         }
        //         mapping.source.unshift(source);
        //     }
        //     if (Array.isArray(mapping.source)) {
        //
        //     }
        //
        //
        //
        //
        // }
        return array;
    }
}

function asType(value, type) {
    var val = null;
    switch (type) {
        case "string":
            if (value === null) return null;
            if (typeof value === "string") {
                val = value;
            } else if (typeof value === "object" || Array.isArray(value)) {
                throw new Error("Only native values can be converted to string.");
            }
            val = '' + value;
            break;
        case "integer":
            if (value === null) return null;
            if (typeof value === "object" || Array.isArray(value)) {
                throw new Error("Only native values can be converted to integer.");
            }
            val = parseInt(value);
            if (isNaN(val)) {
                throw new Error('Value ' + value + ' cannot be converted to integer.');
            }
            break;
        case "number":
            if (value === null) return null;
            if (typeof value === "object" || Array.isArray(value)) {
                throw new Error("Only native values can be converted to number.");
            }
            val = parseFloat(value);
            if (isNaN(val)) {
                throw new Error('Value ' + value + ' cannot be converted to number.');
            }
            break;
        case "boolean":
            if (value === null) return null;
            switch(value) {
                case true:
                case "true":
                case 1:
                case "1":
                    val = true;
                    break;
                case "false":
                case false:
                case 0:
                case "0":
                    val = false;
                    break;
                default:
                    throw new Error('Only 1, "1", 0, "0", "true", and  "false" can be converted to boolean.');
            }
            break;
        default:
            throw new Error('Unknown data type ' + type + '.');
    }
    return val;
}
