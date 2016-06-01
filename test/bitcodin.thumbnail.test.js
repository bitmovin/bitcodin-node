/**
 * Created by lkroepfl on 23.06.15.
 */

var util = require('./util'),
    bitcodin = require('../lib/bitcodin')(util.settings.apiKey);

describe('Thumbnail', function () {
    var thumbnails = [];

    it('should create a thumbnail', function (done) {
        var jobPromise = bitcodin.job.list(0, 'finished');

        jobPromise.then(function (result) {
            var thumbnailConfiguration = {
                "jobId": result.jobs[0].jobId,
                "height": 320,
                "position": 50,
                "async": true
            };

            var promise = bitcodin.thumbnail.create(thumbnailConfiguration);

            promise.then(function (data) {
                thumbnails.push(data);
                done();
            }, done);
        }, done);
    });

    it('should get a thumbnail for a given id', function () {
        return bitcodin.thumbnail.get(thumbnails[0].id).should.eventually.be.fulfilled;
    });

});