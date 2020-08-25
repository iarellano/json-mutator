var rewire = require('rewire');
var chai = require('chai');
var should = chai.should();

var app = rewire('../../main/javascript/transformer.js');

asType = app.__get__('asType');


describe('feature: transform value to integer', function() {

    it('String "10" should be 10', function(done){
        asType('10', 'integer').should.equal(10);
        done();
    });
    it('String "10.5" should be 10', function(done){
        asType('10.5', 'integer').should.equal(10);
        done();
    });

    it('String "a" cannot be converted to integer', () => {
        (function () {
            try {
                asType('a', 'integer');
            } catch (e) {
                console.log(typeof e);
                throw e;
            }
        }).should.throw(Error, /Value a cannot be converted to integer./);
    });

    it('{} cannot be converted to integer', () => {
        (function () {
            try {
                asType({}, 'integer');
            } catch (e) {
                console.log(typeof e);
                throw e;
            }
        }).should.throw(Error, /Only native values can be converted to integer./);
    });
    it('[] cannot be converted to integer', () => {
        (function () {
            try {
                asType({}, 'integer');
            } catch (e) {
                console.log(typeof e);
                throw e;
            }
        }).should.throw(Error, /Only native values can be converted to integer./);
    });
});