/**
 * Created by mfillafer on 23.06.15.
 */

var util = require('./util'),
    bitcodin = require('../lib/bitcodin')(util.settings.apiKey);

describe('Job', function () {
    var jobIds = [];

    it('should create a new job', function () {
        var jobConfig = {
            'inputId': 3315,
            'encodingProfileId': 7365,
            'manifestTypes': [
                'mpd',
                'm3u8'
            ]
        };

        var promise = bitcodin.job.create(jobConfig);

        promise.then(function (data) {
            jobIds.push(data.jobId);
        });

        return promise.should.eventually.be.fulfilled;
    });

    it('should list jobs', function () {
        return bitcodin.job.list().should.eventually.be.fulfilled;
    });

    it('should list jobs of a given page', function () {
        var page = 2;
        return bitcodin.job.list(page).should.eventually.be.fulfilled;
    });

    it('should get the job details for a given job id', function () {
        return bitcodin.job.getDetails(2874).should.eventually.be.fulfilled;
    });

    it('should not get job details for a invalid id', function () {
        return util.testAll([undefined, 'foo'], function(jobId) {
            return bitcodin.job.getDetails(jobId).should.eventually.be.rejected;
        });
    });

    it('should get the job status for a given job id', function () {
        return bitcodin.job.getStatus(2874).should.eventually.be.fulfilled;
    });

    it('should not get job status for a invalid id', function () {
        return util.testAll([undefined, 'foo'], function(jobId) {
            return bitcodin.job.getStatus(jobId).should.eventually.be.rejected;
        });
    });

    it('should create a new transfer job', function () {
        var transferJobConfig = {
            'jobId': 2874,
            'outputId': 2564
        };

        return bitcodin.job.transfer.create(transferJobConfig).should.eventually.be.fulfilled;
    });

    it('should get the transfer job details for a given id', function () {
        return bitcodin.job.transfer.list(2874).should.eventually.be.fulfilled;
    });

    it('should not list transfer job details for a invalid id', function () {
        return util.testAll([undefined, 'foo'], function(jobId) {
            return bitcodin.job.transfer.list(jobId).should.eventually.be.rejected;
        });
    });
});