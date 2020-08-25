function transform(srcObject, mappings) {
    var object = {};
    for (var property in mappings) {
        if (srcObject.hasOwnProperty(property)) {
            object[mappings[property]] = srcObject[property];
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
            }
            break;
        case "number":
            break;

    }
    return val;
}