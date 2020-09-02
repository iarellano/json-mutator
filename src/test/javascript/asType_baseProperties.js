'use strict'

var rewire = require('rewire');
var assert = require('assert');

var app = rewire('../../main/javascript/transformer.js');

var transform = app.__get__('transform');

describe('feature: transform simple object with simple mapping', function() {

    it('tranform simple object 1', function(done) {
        var source = {
            firstName: "John",
            lastName: "Wick"
        };
        var target = {
            givenName: "John",
            surname: "Wick"
        };
        var map = {
            type: "object",
            properties: {
                givenName: "firstName",
                surname: "lastName"
            }
        };
        var transformedObject = transform(source,  map);
        // console.log(jsonDiff.diff(transformedObject, target));
        assert.deepEqual(transformedObject, target);
        done();
    });

});