/**
 * Created by mfillafer on 23.06.15.
 */

require('mocha');
require('chai').use(require("chai-as-promised")).should();

var settings = require('./resources/settings.json'),
    bitcodin = require('../lib/bitcodin')(settings.apiKey);

describe('Bitcodin.Input', function () {
    describe('#create', function () {
        var inputId = 0;

        it('create valid input', function (done) {
            var url = 'http://eu-storage.bitcodin.com/inputs/Sintel.2010.720p.mkv';

            bitcodin.input.create(url).then(function (res) {
                res.should.have.property('inputId');
                inputId = res.inputId;
                done();
            }, function () {
                should.Throw();
                done();
            });
        });

        it('analyze input', function () {
            bitcodin.input.analayze(inputId).should.eventually.have.property('inputType');
        });

        it('delete input', function () {
            return bitcodin.input.delete(inputId).should.eventually.fulfill;
        });
    });
});