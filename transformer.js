/**
Copyright 2020 isaias.arellano.delgado@gmail.com

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

'use strict';

function isObject(spec) {
    return spec.type === "object" || spec.attributes != null;
}

function isArray(spec) {
    return spec.type === "array" || spec.items != null;
}

function hasCallback(functionToCheck) {
    return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';
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
                    throw 'Null value not allowed for array item "' + sourcePath + spec.source + '".';
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
            if (hasCallback(spec.before)) {
                spec.before(source, spec, target, attribute);
            }

            if (source[spec.source] === undefined || source[spec.source] === null) {
                var required = spec.required !== undefined ? spec.required : options.defaultRequired;
                if (source[spec.source] === undefined && required === true) {
                    if (spec.default) {
                        target[attribute] = spec.default;
                    } else {
                        throw 'Missing required property "' + sourcePath + spec.source + '".';
                    }
                }
                var allowNull = spec.nullable !== undefined ? spec.nullable : options.allowNulls;
                if (source[spec.source] === null && allowNull === false) {
                    throw 'Null value not allowed for property "' + sourcePath + spec.source + '".';
                } else {
                    target[attribute] = null;
                }
            } else {
                if (typeof source[spec.source] !== "object" || Array.isArray(source[spec.source])) {
                    throw 'Value of property "' + sourcePath + spec.source + '"is expected to be an object.'
                }
                copyAttributes(spec.attributes, source[spec.source], target[attribute], sourcePath + spec.source + '.', schemaPath + attribute + '.', options);
                if (spec.additionalAttributes) {
                    for (var additionalAttribute in spec.additionalAttributes) {
                        target[additionalAttribute] = spec.additionalAttributes[additionalAttribute];
                    }
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
            target[attribute] = [];
            if (hasCallback(spec.before)) {
                spec.before(source, spec, target, attribute);
            }

            if (source[spec.source] === undefined || source[spec.source] === null) {
                var required = spec.required !== undefined ? spec.required : options.defaultRequired;
                if (source[spec.source] === undefined && required === true) {
                    if (spec.default) {
                        target[attribute] = spec.default;
                    } else {
                        throw 'Missing required property "' + sourcePath + spec.source + '".';
                    }
                }
                var allowNull = spec.nullable !== undefined ? spec.nullable : options.allowNulls;
                if (source[spec.source] === null && allowNull === false) {
                    throw 'Null value not allowed for property "' + sourcePath + spec.source + '".';
                } else {
                    target[attribute] = null;
                }
            } else {
                // Validate that source[spec.source] has a value and work with required or default value
                if (!Array.isArray(source[spec.source])) {
                    throw 'Array expected for property "' + sourcePath + spec.source + '".';
                }
                copyItems(spec, source[spec.source], target[attribute], sourcePath + spec.source + '.', '', options);
            }
            if (hasCallback(spec.after)) {
                var result = spec.after(source, spec, target, attribute);
                if (result !== undefined) {
                    target[attribute] = result;
                }
            }
        }
        else {

            var required = spec.required !== undefined ? spec.required : options.defaultRequired;
            if (source[spec.source] === undefined && required === true) {
                if (spec.default) {
                    target[attribute] = spec.default;
                } else {
                    throw 'Missing required property "' + sourcePath + spec.source + '".';
                }
            }

            if (target[attribute] === undefined && source[spec.source] !== undefined) {
                target[attribute] = source[spec.source];
            }

            var allowNull = spec.nullable !== undefined ? spec.nullable : options.allowNulls;
            if (source[spec.source] === null && allowNull === false) {
                throw 'Null value not allowed for property "' + sourcePath + spec.source + '".';
            }

            if (target[attribute] !== undefined && spec.type && options.enforceTypes === true) {
                validateNativeType(spec.type, target[attribute], sourcePath + spec.source, schemaPath, schemaPath + attribute);
            }
            if (hasCallback(spec.after)) {
                var result = spec.after(source, spec, target, attribute);
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

    if (!spec) {
        throw 'spec null or undefined'
    }

    var result;
    if (isObject(spec)) {
        result = {};
        if (hasCallback(spec.before)) {
            spec.before(source, spec, result);
        }
        if (typeof source !== "object" || Array.isArray(source)) {
            throw 'Root value is expected to be an object.'
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

if (typeof module !== 'undefined' && module.exports != null) {
    exports.transform = transform;
}
