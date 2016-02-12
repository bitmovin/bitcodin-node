/**
 * Created by mfillafer on 23.06.15.
 */

var util = require('./util'),
    bitcodin = require('../lib/bitcodin')(util.settings.apiKey);

describe('Input', function () {
    var inputIds = [];

    it('should create an input from a URL string with skipAnalysis set', function () {
        this.timeout(30000);
        var input = {};
        input.skipAnalysis = true;
        input.type = 'url';
        input.url = 'http://bitbucketireland.s3.amazonaws.com/Sintel-original-short.mkv';

        var promise = bitcodin.input.create(input);

        promise.then(function (data) {
            data.should.have.property('inputId');
            inputIds.push(data.inputId);
        }).done();
        return promise.should.eventually.be.fulfilled;
    });

    it('should create an input from a http input config object', function () {
        this.timeout(30000);
        var input = {
            type: 'url',
            url: 'http://bitbucketireland.s3.amazonaws.com/Sintel-original-short.mkv'
        };
        var promise = bitcodin.input.create(input);

        promise.then(function (data) {
            data.should.have.property('inputId');
            inputIds.push(data.inputId);

        }).done();

        return promise.should.eventually.be.fulfilled;
    });

    it('should analyze an input', function () {
        this.timeout(60000);
        var promise = bitcodin.input.analyze(inputIds[0]);
        return promise.should.eventually.have.property('inputId', inputIds[0]);
    });

    it('should not analyze input for a invalid input id', function () {
        return util.testAll([undefined, 'foo'], function(inputId) {
            return bitcodin.input.analyze(inputId).should.eventually.be.rejected;
        });
    });

    it('should get input details for a given input id', function () {
        var promise = bitcodin.input.get(inputIds[0]);
        return promise.should.eventually.have.property('inputId', inputIds[0]);
    });

    it('should not get input details for a invalid input id', function () {
        return util.testAll([undefined, 'foo'], function(inputId) {
            return bitcodin.input.get(inputId).should.eventually.be.rejected;
        });
    });

    it('should list available inputs', function () {
        return bitcodin.input.list().should.eventually.be.fulfilled;
    });

    it('should list inputs of a given page', function () {
        var page = 2;
        return bitcodin.input.list(page).should.eventually.be.fulfilled;
    });

    it('should not delete input for a invalid input id', function () {
        return util.testAll([undefined, 'foo'], function(inputId) {
            return bitcodin.input.delete(inputId).should.eventually.be.rejected;
        });
    });

    it('should delete all created inputs', function () {
        return util.testAll(inputIds, function (inputId) {
            return bitcodin.input.delete(inputId).should.eventually.be.fulfilled;
        });
    });
});