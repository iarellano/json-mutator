'use strict'

const rewire = require('rewire');
const assert = require('assert');
const yaml = require('js-yaml');
const fs   = require('fs');
const path   = require('path');

// var mocha = require('mocha');
var should = require('should');
var sinon = require('sinon');

const app = rewire('../../main/javascript/transformer.js');

var transform = app.__get__('transform');

const test_dir = __dirname;


const testPromise = new Promise (function(resolve, reject) {
    var tests_cases = [];

    fs.readdirSync(test_dir).forEach(function(test_file) {
        var yaml_dir  = path.join(test_dir, test_file);
        if (fs.lstatSync(yaml_dir).isDirectory()) {
            fs.readdirSync(yaml_dir).forEach(function(file) {
                var sourceFile = path.join(yaml_dir, file);
                var doc = null;
                console.log(sourceFile);
                if (file.endsWith(".yaml") || file.endsWith(".yml")) {
                    doc = yaml.safeLoad(fs.readFileSync(sourceFile, 'utf8'));
                } else if (file.endsWith(".json")) {
                    doc = JSON.parse(fs.readFileSync(sourceFile, 'utf8'));
                }
                if (doc) {
                    tests_cases.push(doc);
                }
            });
        }
    });
    resolve(tests_cases);
});


describe('Features: Scripted tests', function() {
    before(function () {
        console.log('Let the abuse begin...');
        return testPromise.
        then(function (testSuite) {
            testSuite.forEach(function(featuredCase) {
                describe(featuredCase.feature, function () {
                    for (var testName in featuredCase.tests) {
                        var test = featuredCase.tests[testName];
                        it(testName, function (done) {
                            var transformedObject = transform(test.source,  test.map);
                            assert.deepEqual(transformedObject, test.expected);
                            done();
                        });
                    }
                });
            })
        });
    });

    it('This is a required placeholder to allow before() to work', function () {
        console.log('Mocha should not require this hack IMHO');
    });
});


//
// describe(doc.feature, function() {
//
//     before(function(done) {
//         console.log('Let the abuse begin...');
//         return function () {
//             describe('here are some dynamic It() tests', function () {
//                 for (var test in doc.tests) {
//                     console.log("- test: " + test);
//                     it(test, function (done) {
//                         console.log("testing");
//                         const transformedObject = transform(doc.tests[test].source, doc.tests[test].map);
//                         assert.deepEqual(transformedObject, doc.tests[test].target);
//                         done();
//                     });
//                 }
//             });
//         }
//     });