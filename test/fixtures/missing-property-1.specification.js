'use strict';

var spec = {
    desc: "Test assign missing property",
    type: "object",
    attributes: {
        name: {
            required: false,
            type: "string",
            source: "name",
            default: "isaias",
            after: () => {
                console.log("Helo here 2");
                return 'Isaias';
            }
        }
    }
};

exports.spec = spec;
