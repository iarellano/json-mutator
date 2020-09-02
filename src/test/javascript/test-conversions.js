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


function read_tests() {

}

describe('feature: Scripted tests', function() {
    before(function(done) {
        done();
    });

    it('try', function(done){
        assert(true, true);
        done();
    });
});


fs.readdir(test_dir, function (err, test_files) {

    if (err) {
        return console.log('Unable to scan directory: ' + err);
    }

    test_files.forEach(function (test_file) {

        var yaml_dir  = path.join(test_dir, test_file);
        fs.lstat(yaml_dir, function(err, stats) {
            if (err) {
                return console.log('Unable to scan directory: ' + err);
            }

            if (stats.isDirectory()) {
                fs.readdir(yaml_dir, function(err, files) {

                    if (err) {
                        return console.log('Unable to scan directory: ' + err);
                    }

                    files.forEach(function(file){
                        var sourceFile = path.join(yaml_dir, file);
                        // console.log(sourceFile);
                        // console.log(file);
                        var doc = null;
                        if (file.endsWith(".yaml") || file.endsWith(".yml")) {
                            doc = yaml.safeLoad(fs.readFileSync(sourceFile, 'utf8'));
                        } else if (file.endsWith(".json")) {
                            doc = JSON.parse(fs.readFileSync(sourceFile, 'utf8'));
                        }



                        if (doc) {

                            // console.log('-----------------doc----------------');
                            // console.log("sourceFile: " + sourceFile);
                            // console.log("JSON.stringify: " + JSON.stringify(doc));
                            // console.log("doc" + doc);
                            // console.log('-----------------doc----------------');


                            describe(doc.feature, function() {

                                before(function(done) {
                                        console.log('Let the abuse begin...');
                                        return function () {
                                            describe('here are some dynamic It() tests', function () {
                                                for (var test in doc.tests) {
                                                    console.log("- test: " + test);
                                                    it(test, function (done) {
                                                        console.log("testing");
                                                        const transformedObject = transform(doc.tests[test].source, doc.tests[test].map);
                                                        assert.deepEqual(transformedObject, doc.tests[test].target);
                                                        done();
                                                    });
                                                }
                                            });
                                        }
                                });
                                // for (var test in doc.tests) {
                                //     console.log("- test: " + test);
                                //     it (test, function(done) {
                                //         console.log("testing");
                                //         const transformedObject = transform(doc.tests[test].source,  doc.tests[test].map);
                                //         assert.deepEqual(transformedObject, doc.tests[test].target);
                                //         done();
                                //     });
                                // }

                                it('This is a required placeholder to allow before() to work', function () {
                                    assert.deepEqual(true, false);
                                    console.log('Mocha should not require this hack IMHO');
                                });
                            });
                        }
                    });
                });
            }
        });
    });
});