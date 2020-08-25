var rewire = require('rewire');
// var jsonDiff = require('json-diff');
const assert = require('assert');
// const { assert } = require('chai')


var app = rewire('../../main/javascript/transformer.js');

var transform = app.__get__('transform');

describe('feature: transform value to boolean', function() {

    it('tranform simple object', function(done) {
        var source = {
            firstName: "John",
            lastName: "Wick"
        };
        var target = {
            givenName: "John",
            surname: "Wick"
        };
        var map = {
            firstName: "givenName",
            lastName: "surname"
        };
        var transformedObject = transform(source,  map);
        // console.log(jsonDiff.diff(transformedObject, target));
        assert.deepEqual(transformedObject, target);
        done();
    });

});