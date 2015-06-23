/**
 * Created by mfillafer on 23.06.15.
 */

require('mocha');

var should = require('chai').should(),
    settings = require('./resources/settings.json'),
    rest = require('../lib/rest');

describe('REST', function() {
    describe('#get', function() {
        it('should return status code 401', function(done) {
            rest.get('/').then(function() {
                should.Throw();
                done();
            }, function(err) {
                err.should.have.property('status', 401);
                done();
            });
        });

        it('should return status code 404', function(done) {
            rest.addHeader('bitcodin-api-key', settings.apiKey);

            rest.get('/').then(function() {
                should.Throw();
                done();
            }, function(err) {
                err.should.have.property('status').equal(404);
                done();
            });
        });

        it('should list sintel as default input', function(done) {
            rest.addHeader('bitcodin-api-key', settings.apiKey);

            rest.get('/inputs').then(function(res) {
                res.should.have.property('inputs').with.length(1);
                res.inputs[0].url.should.equal('http://eu-storage.bitcodin.com/inputs/Sintel.2010.720p.mkv');
                done();
            }, function() {
                should.Throw();
                done();
            });
        });
    });
});