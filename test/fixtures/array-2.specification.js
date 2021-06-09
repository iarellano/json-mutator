'use strict';

var spec = {
    desc: "Test array of objects",
    type: "array",
    itemName: "Beatle",
    items: {
        type: "object",
        attributes: {
            firstName: "fname",
            lastName: "lname"
        }
    },
    after: (source, spec, target) => {
        return {
            Beatles: target
        };
    },
};

exports.spec = spec;
