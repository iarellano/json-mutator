var expect = require('chai').expect;
var sinon = require('sinon');

var fs = require("fs-extra");
var transformer = require('../transformer');

var js = '../transformer.js';

describe('feature: Test fixtures', function() {

    var fixtures = [];
    var names = {};
    fs.readdirSync('./test/fixtures').forEach( file => {
        var input = file.replace(/\.((((source)|(expected))\.json)|(specification\.js))$/, "");
        if (!names[input]) {
            names[input] = true;
            fixtures.push({
                spec: `./fixtures/${input}.specification`,
                input: `./test/fixtures/${input}.source.json`,
                expected: `./test/fixtures/${input}.expected.json`
            });
        }
    });

    fixtures.forEach(({spec, input, expected}) => {
        console.log('----------------');
        console.log(input);
        var specification = require(spec);
        it (`Test fixture ${specification.spec.desc} from specification ./fixtures/${input}.specification`, function() {
            var source = JSON.parse(fs.readFileSync(input));
            var expectedData = JSON.parse(fs.readFileSync(expected));

            var output = transformer.transform(source, specification.spec, {});
            expect(output).to.eql(expectedData);
        });
    });
});