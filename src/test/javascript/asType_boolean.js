var rewire = require('rewire');
var chai = require('chai');
var should = chai.should();

var app = rewire('../../main/javascript/transformer.js');

asType = app.__get__('asType');

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

});