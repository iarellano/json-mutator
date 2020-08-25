var source = {
    firstName: "Isaias",
    familyName: {
        lastName: "Arellano"
    },
    secondLastName: "Delgado"
};

var map = {
    firstName: "givenName",
    familyName: {
        name: "names",
        type: "object",
        properties: {
            lastName: "surname"
        }

    },
    secondLastName: {
        name: "motherName"
    }
};

console.log(JSON.stringify(transform(source, map), null, 4));

function transform(srcObject, mappings) {
    var object = {};
    for (var property in mappings) {
        if (srcObject.hasOwnProperty(property)) {
            var  mapping = mappings[property];
            if (typeof mapping === "string") {
                if (mapping.length > 0) {
                    object[mapping] = srcObject[property];
                } else {
                    throw new Error('Target property names should no be empty.')
                }
            } else if (typeof mapping === 'object' && !Array.isArray(mapping) && mapping) {
                if (mapping.name &&  mapping.type !== "object" && mapping.type !== "array") {
                    if (mapping.type) {
                        object[mapping.name] = asType(srcObject[property], mapping.type);
                    } else {
                        object[mapping.name] = srcObject[property];
                    }
                } else if (mapping.type === 'object') {
                    object[mapping.name] = transform(srcObject[property], mapping.properties);
                }
            }
        }
    }
    return object;
}

function asType(value, type) {
    var val = null;
    if (value === null) {
        return value;
    }
    switch (type) {
        case "string":
            if (typeof value === "string") {
                val = value;
            } else if (typeof value === "object" || Array.isArray(value)) {
                throw new Error("Only native values can be converted to string.");
            }
            val = '' + value;
            break;
        case "integer":
            if (typeof value === "object" || Array.isArray(value)) {
                throw new Error("Only native values can be converted to integer.");
            }
            val = parseInt(value);
            if (isNaN(val)) {
                throw new Error('Value ' + value + ' cannot be converted to integer.');
            }
            break;
        case "number":
            if (typeof value === "object" || Array.isArray(value)) {
                throw new Error("Only native values can be converted to number.");
            }
            val = parseFloat(value);
            if (isNaN(val)) {
                throw new Error('Value ' + value + ' cannot be converted to number.');
            }
            break;
        case "boolean":
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