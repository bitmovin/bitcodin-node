/**
 * Created by lkroepfl on 23.06.15.
 */

var util = require('./util'),
    bitcodin = require('../lib/bitcodin')(util.settings.apiKey);

describe('Transmux', function () {
    var transmuxings = [];

    it('should transmux an encoding to an mp4', function (done) {
        var jobPromise = bitcodin.job.list(0, 'finished');

        jobPromise.then(function (result) {
            var jobDetails = result.jobs[0];
            var videoStreamConfigs = jobDetails.encodingProfiles[0].videoStreamConfigs;
            var audioStreamConfigs = jobDetails.encodingProfiles[0].audioStreamConfigs;
            var transmuxConfiguration = {
                "jobId": jobDetails.jobId
            };

            var audioRepresentationIds = [];
            if(audioStreamConfigs.length > 0) {
                for (var i = 0, len = audioStreamConfigs.length; i < len; i++) {
                    audioRepresentationIds.push(audioStreamConfigs[i].representationId);
                }
                transmuxConfiguration.audioRepresentationIds = audioRepresentationIds;
            }

            if(videoStreamConfigs.length > 0) {
                transmuxConfiguration.videoRepresentationId = videoStreamConfigs[0].representationId;
            }

            var promise = bitcodin.transmux.create(transmuxConfiguration);

            promise.then(function (data) {
                transmuxings.push(data);
                done();
            }, done);
        }, done);
    });

    it('should get a transmuxing for a given id', function () {
        return bitcodin.transmux.get(transmuxings[0].id).should.eventually.be.fulfilled;
    });

});