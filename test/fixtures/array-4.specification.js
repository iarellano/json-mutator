'use strict';

var spec = {
    desc: "Nested arrays",
    type: "array",
    items: {
        type: "array",
        itemCallback: (source, spec, target, itemValue, i) => {
            return itemValue + 3;
        },
        items: {
            type: "int",
        }
    }
};

exports.spec = spec;
