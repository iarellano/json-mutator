var expect = require('chai').expect;
'use strict';

function isObject(spec) {
    return spec.type == "object" || spec.attributes != null;
}

function isArray(spec) {
    return spec.type == "array" || spec.items != null;
}

function hasCallback(functionToCheck) {
    return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';
}

function copyItems (spec, source, target, sourcePath, schemaPath, options) {
    for (var i = 0; i < source.length; i++) {
        var itemValue;

        if (spec.items.type === "array") {
            itemValue = [];
            copyItems(spec.items, source[i], itemValue, sourcePath + '[' + i + ']', schemaPath, options);
        } else if (spec.items.type === "object") {
            itemValue = {};
            copyAttributes(spec.items.attributes, source[i], itemValue, sourcePath + '[' + i + ']', schemaPath, options)
        }
        else {
            itemValue = source[i];
            var allowNull = spec.nullable || options.allowNulls;
            if (source[spec.source] === null && allowNull === false) {
                if (spec.default) {
                    itemValue = spec.default;
                } else {
                    throw 'Null value not allowed for property "' + sourcePath + spec.source + '".';
                }
            }
            if (itemValue !== null && spec.items.type && options.enforceTypes === true) {
                validateNativeType(spec.items.type, itemValue, sourcePath + '[' + i + ']', schemaPath + '[' + i + ']');
            }
        }

        if (spec.itemName) {
            var item = {};
            item[spec.itemName] = itemValue;
            target.push(item);
        } else {
            target.push(itemValue);
        }
        if (hasCallback(spec.itemCallback)) {
            var result = spec.itemCallback(source, spec, target, itemValue, i);
            if (result !== undefined) {
                target[i] = result;
            }
        }
    }
}


function validateNativeType(type, value, sourcePath, schemaPath) {
    switch (type) {
        case "integer":
        case "int":
            if (!Number.isInteger(value)) {
                throw 'Integer value expected for property "' + sourcePath + '".';
            }
            break;
        case 'float':
        case 'number':
            if (isNaN(value)) {
                throw 'Numeric value expected for property "' + sourcePath + '". Found ' + value;
            }
            break;
        case 'bool':
        case  'boolean':
            if (value !== true && value !== false) {
                throw 'Boolean value expected for property "' + sourcePath + '".';
            }
            break;
        case 'string':
            if (typeof value !== 'string') {
                throw 'String value expected for property "' + sourcePath + '"';
            }
            break;
        default:
            throw 'Invalid schema type for property "' + schemaPath + '". Found ' + type;
    }
}

function copyAttributes (attributes, source, target, sourcePath, schemaPath, options) {
    for (var attribute in attributes) {

        var spec = attributes[attribute];

        if (typeof spec == "string") {
            if (source[spec] === undefined && options.defaultRequired === true) {
                throw 'Missing source property "' + sourcePath + spec + '".';
            }
            if (source[spec] !== undefined) {
                target[attribute] = source[spec];
            }
            continue;
        }

        if (isObject(spec)) {
            target[attribute] = {};
            if (typeof source[spec.source] !== "object" || Array.isArray(source[spec.source])) {
                throw 'Value of property "' + sourcePath + spec.source + '"is expected to be an object.'
            }
            if (hasCallback(spec.before)) {
                spec.before(source, spec, target, attribute);
            }
            copyAttributes(spec.attributes, source[spec.source], target[attribute], sourcePath + spec.source + '.', schemaPath + attribute + '.', options);
            if (spec.additionalAttributes) {
                for (var additionalAttribute in spec.additionalAttributes) {
                    target[additionalAttribute] = spec.additionalAttributes[additionalAttribute];
                }
            }
            if (hasCallback(spec.after)) {
                var result = spec.after(source, spec, target, attribute);
                if (result !== undefined) {
                    target[attribute] = result;
                }
            }
        }

        else if (isArray(spec)) {
            if (hasCallback(spec.before)) {
                spec.before(source, spec, target, attribute);
            }
            if (!Array.isArray(source[spec.source])) {
                throw 'Array expected for property "' + sourcePath + spec.source + '".';
            }
            target[attribute] = [];
            copyItems(spec, source[spec.source], target[attribute], sourcePath + spec.source + '.', '', options);
            if (hasCallback(spec.after)) {
                spec.after(source, spec, target, attribute);
                if (result !== undefined) {
                    target[attribute] = result;
                }
            }
        }

        else {

            var required = spec.required || options.defaultRequired;
            if (source[spec.source] === undefined && required === true) {
                if (spec.default) {
                    target[attribute] = spec.default;
                } else {
                    throw 'Missing required property "' + sourcePath + spec.source + '".';
                }
            }

            var allowNull = spec.nullable || options.allowNulls;
            if (source[spec.source] === null && allowNull === false) {
                if (spec.default) {
                    target[attribute] = spec.default;
                } else {
                    throw 'Null value not allowed for property "' + sourcePath + spec.source + '".';
                }
            }

            if (target[attribute] === undefined && source[spec.source] !== undefined) {
                target[attribute] = source[spec.source];
            }


            if (target[attribute] !== undefined && spec.type && options.enforceTypes === true) {
                validateNativeType(spec.type, target[attribute], sourcePath + spec.source, schemaPath, schemaPath + attribute);
            }
            if (hasCallback(spec.after)) {
                spec.after(source, spec, target, attribute);
                if (result !== undefined) {
                    target[attribute] = result;
                }
            }
        }
    }

}

var transform = function (source, spec, options) {

    var defaultOptions = {
        defaultMissing: null,
        allowNulls: true,
        defaultRequired: true,
        enforceTypes: true
    };

    var options = options || {};

    if (options.allowNulls && typeof options.allowNulls !== 'boolean') {
        throw 'allowNulls\'s value must be boolean.';
    }

    if (options.defaultRequired && typeof options.defaultRequired !== 'boolean') {
        throw 'defaultRequired\'s value must be boolean.';
    }

    if (options.enforceTypes && typeof options.enforceTypes !== 'boolean') {
        throw 'defaultRequired\'s value must be boolean.';
    }

    for (var option in defaultOptions) {
        if (options[option] === undefined) {
            options[option] = defaultOptions[option];
        }
    }

    var result;
    if (isObject(spec)) {
        result = {};
        if (typeof source !== "object" || Array.isArray(source)) {
            throw 'Root value is expected to be an object.'
        }
        if (hasCallback(spec.before)) {
            spec.before(source, spec, target, attribute);
        }
        copyAttributes(spec.attributes, source, result, '', '', options);
        if (spec.additionalAttributes) {
            for (var additionalAttribute in spec.additionalAttributes) {
                result[additionalAttribute] = spec.additionalAttributes[additionalAttribute];
            }
        }
        if (hasCallback(spec.after)) {
            var res = spec.after(source, spec, result);
            if (res !== undefined) {
                result = res;
            }
        }
    }
    if (isArray(spec)) {
        result = [];
        if (hasCallback(spec.before)) {
            spec.before(source, spec, result);
        }
        if (!Array.isArray(source)) {
            throw 'Root value is expected to be an Array.';
        }

        copyItems(spec, source, result, '', '', options);
        if (hasCallback(spec.after)) {
            var res = spec.after(source, spec, result);
            if (res !== undefined) {
                result = res;
            }
        }
    }
    return result;
};

var source = {
    "pointsInfo": {
        "pointsQty": 0,
        "ivaTax": 0
    },
    "creditCardInfo": {
        "creditCardId": "string",
        "amount": 0,
        "installments": 0,
        "ivaTax": null,
        "comsumptionTax": 0,
        "taxBase": 0,
        "tip": 0,
        "locationInfo":{
            "terminalId": "1",
            "storeCode": "1",
            "storeName": "1",
            "countryCode": "1",
            "stateCode": "1",
            "cityCode": "1",
            "cityName": "1"
        },
        index: [
            0,1,2,3,4,5
        ]
    },
    index: [
        0,1,2,3
    ],
    complexArray: [
        {
            'firstName': 'Isaias',
            'lastName': 'Arellano'
        },
        {
            'firstName': 'Melissa',
            'lastName': 'Martin'
        }
    ]
};




var options = {
    allowNulls: false,
    defaultRequired: true,
    enforceTypes: true
};

var data = transform(source, spec, options);

console.log(JSON.stringify(data, null, 4));