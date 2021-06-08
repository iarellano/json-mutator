'use strict'

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
        if (spec.items) {
            itemValue = {};
            copyAttributes(spec.items, source[i], itemValue, sourcePath + '[' + i + ']', schemaPath, options)
        } else {
            itemValue = source[i];
        }
        if (spec.itemName) {
            var item = {};
            item[spec.itemName] = itemValue;
            target.push(item);
        } else {
            target.push(itemValue);
        }
        if (hasCallback(spec.itemCallback)) {
            spec.itemCallback(source, spec, target, itemValue, i);
        }
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
                spec.after(source, spec, target, attribute);
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
                switch (spec.type) {
                    case "integer":
                    case "int":
                        if (!Number.isInteger(target[attribute])) {
                            throw 'Integer value expected for property "' + sourcePath + spec.source + '".';
                        }
                        break;
                    case 'float':
                    case 'number':
                        if (isNaN(target[attribute])) {
                            throw 'Numeric value expected for property "' + sourcePath + spec.source + '". Found ' + target[attribute];
                        }
                        break;
                    case 'bool':
                    case  'boolean':
                        if (target[attribute] !== true && target[attribute] !== false) {
                            throw 'Boolean value expected for property "' + sourcePath + spec.source + '".';
                        }
                        break;
                    case 'string':
                        if (typeof target[attribute] !== 'string') {
                            throw 'String value expected for property "' + sourcePath + spec.source + '"';
                        }
                        break;
                    default:
                        throw 'Invalid schema type for property "' + schemaPath + attribute + '".';
                }
            }
            if (hasCallback(spec.after)) {
                spec.after(source, spec, target, attribute);
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
            spec.after(source, spec, target, attribute);
        }
    }
    if (isArray(spec)) {
        result = [];
        if (hasCallback(spec.before)) {
            spec.before(source, spec, target, attribute);
        }
        if (!Array.isArray(source[spec.source])) {
            throw 'Array expected for property "' + sourcePath + spec.source + '".';
        }
        copyItems(spec, source, result, '', '', options);
        if (hasCallback(spec.after)) {
            spec.after(source, spec, target, attribute);
        }

    }
    return result;
};

module.exports = {
    transform: transform
};