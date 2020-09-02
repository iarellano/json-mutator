'use strict'

var rewire = require('rewire');
var assert = require('assert');

var app = rewire('../../main/javascript/transformer.js');

var transform = app.__get__('transform');

describe('feature: transform object to another object', function() {

    it('tranform simple object 2', function(done) {
        var source = {
            firstName: "John",
            lastName: "Wick"
        };
        var target = {
                givenName: "John",
                surname: "Wick"
        };
        var map = {
            properties: {
                givenName: "firstName",
                surname: {
                    source: "lastName"
                }
            }
        };
        var transformedObject = transform(source,  map);
        assert.deepEqual(transformedObject, target);
        done();
    });

});