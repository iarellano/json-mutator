'use strict'

var rewire = require('rewire');
var chai = require('chai');
var should = chai.should();

var app = rewire('../../main/javascript/transformer.js');
var asType = app.__get__('asType');

describe('feature: transform value to string', function() {

    it('String "some-string" should be "some-string"', function(done){
        asType('some-string', 'string').should.equal('some-string');
        done();
    });
    it('String "some-string" should be "some-string"', function(done){
        asType('some-string', 'string').should.equal('some-string');
        done();
    });

    it('{} cannot be converted to string', () => {
        (function () {
            try {
                asType({}, 'string');
            } catch (e) {
                console.log(typeof e);
                throw e;
            }
        }).should.throw(Error, /Only native values can be converted to string./);
    });
    it('[] cannot be converted to string', () => {
        (function () {
            try {
                asType({}, 'string');
            } catch (e) {
                console.log(typeof e);
                throw e;
            }
        }).should.throw(Error, /Only native values can be converted to string./);
    });
});