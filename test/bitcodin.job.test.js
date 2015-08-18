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

    it('should create a new job with widevine drm configuration', function () {
        var jobConfig = {
            'inputId': 3315,
            'encodingProfileId': 7365,
            'manifestTypes': [
                'mpd',
                'm3u8'
            ],
            'speed': 'standard',
            'drmConfig': {
                system: 'widevine',
                provider: 'widevine_test',
                signingKey: '1ae8ccd0e7985cc0b6203a55855a1034afc252980e970ca90e5202689f947ab9',
                signingIV: 'd58ce954203b7c9a9a9d467f59839249',
                requestUrl: 'http://license.uat.widevine.com/cenc/getcontentkey',
                contentId: '746573745f69645f4639465043304e4f',
                method: 'mpeg_cenc'
            }
        };

      var promise = bitcodin.job.create(jobConfig);

      promise.then(function (data) {
        jobIds.push(data.jobId);
      });

      return promise.should.eventually.be.fulfilled;
    });

    it('should create a new job with playready drm configuration', function () {
        var jobConfig = {
            'inputId': 3315,
            'encodingProfileId': 7365,
            'manifestTypes': [
                'mpd',
                'm3u8'
            ],
            'speed': 'standard',
            'drmConfig': {
                "system": "playready",
                "keySeed": "XVBovsmzhP9gRIZxWfFta3VVRPzVEWmJsazEJ46I",
                "laUrl": "http://playready.directtaps.net/pr/svc/rightsmanager.asmx",
                "method": "mpeg_cenc",
                "kid": "746573745f69645f4639465043304e4f"
            }
        };

        var promise = bitcodin.job.create(jobConfig);

        promise.then(function (data) {
            jobIds.push(data.jobId);
        });

        return promise.should.eventually.be.fulfilled;
    });

    it('should create a new job with widevine and playready (combined) drm configuration', function () {
        var jobConfig = {
            'inputId': 3315,
            'encodingProfileId': 7365,
            'manifestTypes': [
              'mpd',
              'm3u8'
            ],
            'speed': 'standard',
            'drmConfig': {
                "system": "widevine_playready",
                "kid": "eb676abbcb345e96bbcf616630f1a3da",
                "key": "100b6c20940f779a4589152b57d2dacb",
                "laUrl": "http://playready.directtaps.net/pr/svc/rightsmanager.asmx?PlayRight=1&ContentKey=EAtsIJQPd5pFiRUrV9Layw==",
                "method": "mpeg_cenc",
                "pssh": "#CAESEOtnarvLNF6Wu89hZjDxo9oaDXdpZGV2aW5lX3Rlc3QiEGZrajNsamFTZGZhbGtyM2oqAkhEMgA="
            }
        };

        var promise = bitcodin.job.create(jobConfig);

        promise.then(function (data) {
            jobIds.push(data.jobId);
        });

        return promise.should.eventually.be.fulfilled;
    });

    it('should create a new job with hls encryption configuration', function () {
        var jobConfig = {
            'inputId': 3315,
            'encodingProfileId': 7365,
            'manifestTypes': [
                'mpd',
                'm3u8'
            ],
            'speed': 'standard',
            'hlsEncryptionConfig': {
                "method": "SAMPLE-AES",
                "key": "cab5b529ae28d5cc5e3e7bc3fd4a544d",
                "iv": "08eecef4b026deec395234d94218273d"
            }
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