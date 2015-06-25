/**
 * Created by mfillafer on 23.06.15.
 */

var util = require('./util'),
    bitcodin = require('../lib/bitcodin')(util.settings.apiKey);

describe('Output', function () {
    var outputIds = [];

    it('should create a S3 output config', function () {
        var promise = bitcodin.output.s3.create(util.settings.s3OutputEUWest);

        promise.then(function (data) {
            data.should.have.property('outputId');
            outputIds.push(data.outputId);
        });

        return promise.should.eventually.be.fulfilled;
    });

    // TODO: create GCS output

    it('should create a FTP output config', function () {
        var promise = bitcodin.output.ftp.create(util.settings.ftpOutput);

        promise.then(function (data) {
            outputIds.push(data.outputId);
        });

        return promise.should.eventually.be.fulfilled;
    });

    it('should list outputs', function () {
        return bitcodin.output.list().should.eventually.be.fulfilled;
    });

    it('should list outputs of a given page', function () {
        var page = 2;
        return bitcodin.output.list(page).should.eventually.be.fulfilled;
    });

    it('should get output details for a given output id', function () {
        return bitcodin.output.getDetails(outputIds[0]).should.eventually.be.fulfilled;
    });

    it('should not get output details for a invalid output id', function () {
        return util.testAll([undefined, 'foo'], function(outputId) {
            return bitcodin.output.getDetails(outputId).should.eventually.be.rejected;
        });
    });

    it('should delete an output for a given output id', function () {
        return util.testAll(outputIds, function(outputId) {
            return bitcodin.output.delete(outputId).should.eventually.be.fulfilled;
        });
    });

    it('should not delete output for a invalid output id', function () {
        return util.testAll([undefined, 'foo'], function(outputId) {
            return bitcodin.output.delete(outputId).should.eventually.be.rejected;
        });
    });
});
