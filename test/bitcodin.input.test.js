/**
 * Created by mfillafer on 23.06.15.
 */

require('mocha');

var should = require('chai').should(),
    settings = require('./resources/settings.json'),
    bitcodin = require('../lib/bitcodin')(settings.apiKey);

describe('Bitcodin.Input', function () {
    describe('#create', function () {
        it('create valid input', function (done) {
            bitcodin.input.create('http://eu-storage.bitcodin.com/inputs/Sintel.2010.720p.mkv')
                .then(function (res) {
                    res.should.have.property('inputId');

                    bitcodin.input.delete(res.inputId);

                    done();
                }, function () {
                    should.Throw();
                    done();
                });
        });
    });
});