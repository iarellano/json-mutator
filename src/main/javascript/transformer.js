

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

console.log(JSON.stringify(transform(source, map), null, 4));


function transform(srcObject, mapping) {
    var pointer = arguments[2] || [srcObject];
    if (typeof mapping === "string") {
        return srcObject[mapping];
    }
    if (!mapping.type || (mapping.type && mapping.type != 'object' && mapping.type != 'array')) {
        if (typeof mapping.source === 'string' || Array.isArray(mapping.source) && mapping.source.length == 1) {
            var source = Array.isArray(mapping.source) ? mapping.source[0] : mapping.source;
            if (mapping.type) {
                return asType(srcObject[source], mapping.type);
            } else {
                return srcObject[source] ? srcObject[source] : null;
            }
        } if (Array.isArray(mapping.source)) {
            var value = null;
            if (srcObject[mapping.source[0]]) {
                var thisSource = mapping.source.shift();
                pointer.push(srcObject[thisSource]);
                value = transform(srcObject[thisSource], mapping, pointer);
                // @TODO add debug function
                // printJson(value);
                pointer.pop();
                mapping.source.unshift(thisSource);
                return value;
            }
        } else {

        }
    }
    if (mapping.type === 'object') {
        if (!srcObject) return null;
        if (mapping.properties) {
            var object = {};
            if (!Array.isArray(mapping.source)) {
                if (!mapping.source) {
                    var object = {};
                    for (var property in mapping.properties) {
                        // print("111111111111111111" + property + " -> " + mapping.properties[property] + "  ->  " + JSON.stringify(srcObject));
                        object[property] = transform(srcObject, mapping.properties[property], pointer);
                    }
                } else if (srcObject[mapping.source]) {
                    var object = {};
                    pointer.push(srcObject[mapping.source]);
                    for (var property in mapping.properties) {
                        object[property] = transform(srcObject[mapping.source], mapping.properties[property], pointer);
                    }
                    pointer.pop();
                }
            } else {
                var thisSrcObject = srcObject;
                for (var source in mapping.source) {
                    thisSrcObject = thisSrcObject[mapping.source[source]];
                    if (!thisSrcObject) {
                        break;
                    } else {
                        // @TODO do something with the pointer
                    }
                }
                if (thisSrcObject) {
                    for (var property in mapping.properties) {
                        object[property] = transform(thisSrcObject, mapping.properties[property], pointer);
                    }
                }
                // if (mapping.source.length > 1) {
                //
                //     pointer.push(srcObject[source]);
                //     for (var property in mapping.properties) {
                //         object[property] = transform(srcObject[source], mapping, pointer);
                //     }
                //     pointer.pop();
                //     mapping.source.unshift(source);
                // } else {
                //
                // }
            }
            return object;
        } else {
            // @ Throw rule 11
        }
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


function isSimpleType(mapping) {
    return typeof mapping === 'string'
        || !mapping.hasOwnProperty('type')
        || (mapping.type !== 'object' && mapping.type !== 'array')
}

function getSimpleValue(srcObject, mapping) {
    if (typeof mapping === 'string' && srcObject.hasOwnProperty(mapping)) {
        return srcObject[mapping];
    }
    if (!mapping.type) {
        // @TODO Validate mapping.source exists
        return srcObject[mapping.source];
    }
    if (mapping.type !== 'object' && mapping.type !== 'array') {
        if (mapping.source && srcObject.hasOwnProperty(mapping.source)) {
            if (mapping.type) {
                return asType(srcObject[mapping.source], mapping.type);
            }
            srcObject[mapping.source];
        }
    }
}
