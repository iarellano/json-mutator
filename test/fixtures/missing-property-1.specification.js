'use strict';

var spec = {
    desc: "Test assign missing property",
    type: "object",
    attributes: {
        name: {
            required: false,
            type: "string",
            source: "name",
            default: null,
            nullable: true,
            after: () => {
                return 'Some Random Name';
            }
        }
    }
};

exports.spec = spec;
