'use strict'

var rewire = require('rewire');

var app = rewire('../../main/javascript/transformer.js');
var asType = app.__get__('asType');

describe('feature: transform value to boolean', function() {

    it('"0" should be false', function(done) {
        asType('0', 'boolean').should.equal(false);
        done();
    });

    it('0 should be false', function(done) {
        asType(0, 'boolean').should.equal(false);
        done();
    });

    it('"false" should be false', function(done) {
        asType('false', 'boolean').should.equal(false);
        done();
    });

    it('false should be false', function(done) {
        asType(false, 'boolean').should.equal(false);
        done();
    });

    it('"1" should be true', function(done) {
        asType('1', 'boolean').should.equal(true);
        done();
    });

    it('"1" should be true', function(done) {
        asType(1, 'boolean').should.equal(true);
        done();
    });

    it('"true" should be true', function(done) {
        asType('true', 'boolean').should.equal(true);
        done();
    });

    it('true should be true', function(done) {
        asType(true, 'boolean').should.equal(true);
        done();
    });

    it('String "a" cannot be transformed to boolean', function(done) {
        (function(){
            asType("a", "boolean");
        }).should.throw(Error, /Only 1, "1", 0, "0", "true", and  "false" can be converted to boolean./);
        done();
    });

});