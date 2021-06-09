'use strict';

var spec = {
    desc: "Transform from one array schema to another",
    type: "array",
    itemCallback: (source, spec, target, itemValue, i) => {
        target[i] = {
            language: itemValue
        };
    },
    after: (source, spec, target) => {
        return {
            programmingLanguages: target
        };
    },
    items: {
        type: "string"
    }

}

exports.spec = spec;