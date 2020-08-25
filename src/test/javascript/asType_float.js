var rewire = require('rewire');
var chai = require('chai');
var should = chai.should();

var app = rewire('../../main/javascript/transformer.js');

asType = app.__get__('asType');


describe('feature: transform value to number', function() {

    it('String "10" should be 10', function(done){
        asType('10', 'number').should.equal(10);
        done();
    });
    it('String "10.5" should be 10', function(done){
        asType('10.5', 'number').should.equal(10.5);
        done();
    });

    it('String "a" cannot be converted to number', (done) => {
        (function () {
            try {
                asType('a', 'number');
            } catch (e) {
                console.log(typeof e);
                throw e;
            }
        }).should.throw(Error, /Value a cannot be converted to number./);
        done();
    });

    it('{} cannot be converted to number', (done) => {
        (function () {
            try {
                asType({}, 'number');
            } catch (e) {
                console.log(typeof e);
                throw e;
            }
        }).should.throw(Error, /Only native values can be converted to number./);
        done();
    });
    it('[] cannot be converted to number', (done) => {
        (function () {
            try {
                asType({}, 'number');
            } catch (e) {
                console.log(typeof e);
                throw e;
            }
        }).should.throw(Error, /Only native values can be converted to number./);
        done();
    });
});