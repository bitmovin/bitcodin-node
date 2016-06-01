/**
 * Created by lkroepfl on 23.06.15.
 */

var util = require('./util'),
    bitcodin = require('../lib/bitcodin')(util.settings.apiKey);

describe('Thumbnail', function () {
    var thumbnails = [];

    it('should create a thumbnail', function () {
        var thumbnailConfiguration = {
            "jobId": 254849,
            "height": 320,
            "position": 50,
            "async": true
        };

        var promise = bitcodin.thumbnail.create(thumbnailConfiguration);

        promise.then(function (data) {
            thumbnails.push(data);
        });

        return promise.should.eventually.be.fulfilled;
    });

    it('should get a thumbnail for a given id', function () {
        return bitcodin.thumbnail.get('141b44e6-61c3-42d7-81d2-65b450c60862').should.eventually.be.fulfilled;
    });

});