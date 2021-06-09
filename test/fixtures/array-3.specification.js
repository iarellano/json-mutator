'use strict';

var spec = {
    desc: "Test item transformation",
    type: "array",
    items: {
        type: "int"
    },
    itemCallback: (source, spec, target, itemValue, i) => {
        return itemValue + 1;
    }
}

exports.spec = spec;
