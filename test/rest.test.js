/**
 * Created by mfillafer on 23.06.15.
 */

var util = require('./util'),
    rest = require('../lib/rest');

describe('REST', function () {
    it('should return status code 401', function () {
        var err = {"message": "Given bitcodin-api-key is not authorized!", "status": 401};
        return rest.get('/').should.eventually.be.rejectedWith(err);
    });

    it('should return status code 404', function () {
        rest.addHeader('bitcodin-api-key', util.settings.apiKey);

        var err = {"message": "unknown api-request-url", "status": 404};
        return rest.get('/').should.eventually.be.rejectedWith(err);
    });

    it('should list sintel as default input', function () {
        rest.addHeader('bitcodin-api-key', util.settings.apiKey);

        return rest.get('/inputs').should.eventually.have.property('inputs');
    });

    it('should set the hostname', function() {
        rest.setHostname('localhost');
    });
});