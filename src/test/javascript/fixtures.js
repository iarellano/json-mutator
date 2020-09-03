'use strict'

var rewire = require('rewire');
var assert = require('assert');
var yaml = require('js-yaml');
var fs   = require('fs');
var path   = require('path');

var app = rewire('../../main/javascript/transformer.js');

var transform = app.__get__('transform');

var test_dir = path.join(__dirname, "fixtures");

var testPromise = new Promise (function(resolve, reject) {
    var tests_cases = [];
    fs.readdirSync(test_dir).forEach(function(test_file) {
        var yaml_dir  = path.join(test_dir, test_file);
        if (fs.lstatSync(yaml_dir).isDirectory()) {
            fs.readdirSync(yaml_dir).forEach(function(file) {
                var sourceFile = path.join(yaml_dir, file);
                var doc = null;
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

var expandCallbacks = function(spec) {
    if (spec.callback) {
        spec.callback  = new Function("o", "n", "m", spec.callback);
    }
    if (spec.properties) {
        for (var propertyName in spec.properties) {
            var propertyDef = spec.properties[propertyName];
            if (typeof propertyDef !== 'string ') {
                expandCallbacks(propertyDef);
            }
        }
    } else if (spec.items) {
        expandCallbacks(spec.items);
    }
}

describe('Features: Scripted tests', function() {
    before(function () {
        console.log('Let the abuse begin...');
        return testPromise.
        then(function (testSuite) {
            testSuite.forEach(function(featuredCase) {
                describe(featuredCase.feature, function () {
                    featuredCase.steps.forEach(function(step) {
                        it(step.desc, function (done) {
                            var source = step.source || featuredCase.source;
                            expandCallbacks(step.spec);
                            var transformedObject = transform(source,  step.spec);
                            if (step.dump && false) {
                                console.log("----------------------------  SPEC  ----------------------------");
                                console.log(JSON.stringify(step.spec, null, 4))
                                console.log("---------------------------- SOURCE ----------------------------");
                                console.log(JSON.stringify(source, null, 4))
                                console.log("--------------------------- EXPECTED ---------------------------");
                                console.log(JSON.stringify(step.expected, null, 4))
                                console.log("---------------------------- RESULT ----------------------------");
                                console.log(JSON.stringify(transformedObject, null, 4))
                                console.log("---------------------------- DUMPED ----------------------------");
                            }

                            console.log("#### " + step.desc);
                            console.log("Given the source");
                            console.log("```javascript");
                            console.log("var source = " + JSON.stringify(source, null, 4));
                            console.log("```");
                            console.log("and the spec")
                            console.log("```javascript");
                            console.log("var source = " + JSON.stringify(step.spec, null, 4));
                            console.log("```");
                            console.log("Then the resulting object is");
                            console.log("```json");
                            console.log(JSON.stringify(transformedObject, null, 4));
                            console.log("```");

                            if (step.dumpJS) {
                                if (!step.source) step.source = source;
                                console.log("//-----------------------------------------------\n"+
                                    "var spec = " + JSON.stringify(step, null, 4) + ";\n" +
                                    "console.log(JSON.stringify(transform(spec.source, spec.spec), null, 4));\n"+
                                    "//-----------------------------------------------\n");
                            }
                            assert.deepEqual(transformedObject, step.expected);
                            done();
                        });
                    });
                });
            })
        });
    });

    it('This is a required placeholder to allow before() to work', function () {
        console.log('Mocha should not require this hack IMHO');
    });
});