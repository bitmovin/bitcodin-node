/**
 * Created by mfillafer on 23.06.15.
 */

var util = require('./util'),
    bitcodin = require('../lib/bitcodin')(util.settings.apiKey);

describe('EncodingProfile', function () {
    var encodingProfileIds = [];

    it('should create a new encoding profile', function () {
        var encodingProfile = {
            "name": "bitcodin Encoding Profile",
            "videoStreamConfigs": [
                {
                    "defaultStreamId": 0,
                    "bitrate": 1024000,
                    "profile": "Main",
                    "preset": "Standard",
                    "height": 480,
                    "width": 204
                }
            ],
            "audioStreamConfigs": [
                {
                    "defaultStreamId": 0,
                    "bitrate": 256000
                }
            ]
        };

        var promise = bitcodin.encodingProfile.create(encodingProfile);

        promise.then(function (data) {
            encodingProfileIds.push(data.encodingProfileId);
        });

        return promise.should.eventually.be.fulfilled;
    });

    it('should list available encoding profiles', function () {
        return bitcodin.encodingProfile.list().should.eventually.be.fulfilled;
    });

    it('should list available encoding profiles of a given page', function () {
        var page = 2;
        return bitcodin.encodingProfile.list(page).should.eventually.be.fulfilled;
    });

    it('should get the encoding profile for a given id', function () {
        return bitcodin.encodingProfile.get(encodingProfileIds[0]).should.eventually.be.fulfilled;
    });

    it('should not get the encoding profile for a invalid id', function () {
        return util.testAll([undefined, 'foo'], function(encodingProfileId) {
            return bitcodin.encodingProfile.get(encodingProfileId).should.eventually.be.rejected;
        });
    });

    it('should delete all created encodingProfiles', function () {
        return util.testAll(encodingProfileIds, function (encodingProfileId) {
            return bitcodin.encodingProfile.delete(encodingProfileId).should.eventually.be.fulfilled;
        });
    });

    it('should not delete the encoding profile for a invalid id', function () {
        return util.testAll([undefined, 'foo'], function(encodingProfileId) {
            return bitcodin.encodingProfile.delete(encodingProfileId).should.eventually.be.rejected;
        });
    });
});