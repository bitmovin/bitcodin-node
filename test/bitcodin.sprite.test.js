/**
 * Created by lkroepfl on 23.06.15.
 */

var util = require('./util'),
    bitcodin = require('../lib/bitcodin')(util.settings.apiKey);

describe('Sprite', function () {
    var sprites = [];

    it('should create a sprite', function (done) {
        var jobPromise = bitcodin.job.list(0, 'finished');

        jobPromise.then(function (result) {
            var spriteConfiguration = {
                "jobId": result.jobs[0].jobId,
                "height": 240,
                "width": 320,
                "distance": 5,
                "async": true
            };

            var promise = bitcodin.sprite.create(spriteConfiguration);

            promise.then(function (data) {
                sprites.push(data);
                done();
            }, done);
        }, done);
    });

    it('should get a sprite for a given id', function () {
        return bitcodin.sprite.get(sprites[0].id).should.eventually.be.fulfilled;
    });

});
