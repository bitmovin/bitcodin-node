var Q = require('q'),
    bitcodin = require('bitcodin')('YOUR API KEY HERE'),
    openMovieUrl = 'http://bitbucketireland.s3.amazonaws.com/Sintel-two-audio-streams-short.mkv',
    createInputPromise, createEncodingProfilePromise;

var inputConfig = {};
inputConfig.type = 'url';
inputConfig.url = openMovieUrl;
inputConfig.skipAnalysis = true;

// Create bitcodin Input
createInputPromise = bitcodin.input.create(inputConfig);

/*
 * The encoding configuration for the resulting video
 */
var encodingProfileConfiguration = {
    "name": "bitcodin Encoding Profile Multiple Audio Streams Test",
    "videoStreamConfigs": [
        {
            "defaultStreamId": 0,
            "bitrate": 512000,
            "profile": "Main",
            "preset": "premium",
            "height": 480,
            "width": 640
        }
    ],
    "audioStreamConfigs": [
        {
            "defaultStreamId": 0,
            "bitrate": 192000
        }
    ]
};

createEncodingProfilePromise = bitcodin.encodingProfile.create(encodingProfileConfiguration);

/*
 Merge channel 1 and 2 from input video to a new stereo channel in the resulting transcoded video
 Input video (http://bitbucketireland.s3.amazonaws.com/Sintel-two-audio-streams-short.mkv) channels:
 0 -> Video stream
 1 -> First audio stream
 2 -> Second audio stream
 */
var mergeAudioChannelConfigs = [{"audioChannels": [1, 2]}];

/*
 * The job configuration, inputId and encodingProfiles are set when the the input and the encodingprofile promises are
 * successfully fullfilled so at this time they can be -1.
 */
var jobConfiguration = {
    "inputId": -1,
    "encodingProfileId": -1,
    "mergeAudioChannelConfigs": mergeAudioChannelConfigs,
    "manifestTypes": ["mpd", "m3u8"],
    "speed": "standard",
    "audioMetaData": [
        {
            "defaultStreamId": 0,
            "language": 'de',
            "label": "New Stereo Stream generated from two mono audio streams"
        }
    ]
};
console.log("Start creating input and encoding profile");
Q.all([createInputPromise, createEncodingProfilePromise])
    .then(
        function (result) {
            console.log('Successfully created input and encoding profile');
            jobConfiguration.inputId = result[0].inputId;
            jobConfiguration.encodingProfileId = result[1].encodingProfileId;

            bitcodin.job.create(jobConfiguration)
                .then(
                    function (newlyCreatedJob) {
                        console.log('Successfully created a new transcoding job:', newlyCreatedJob);
                        console.log('MPD-Url:', newlyCreatedJob.manifestUrls.mpdUrl);
                        console.log('M3U8-Url:', newlyCreatedJob.manifestUrls.m3u8Url);
                    },
                    function (error) {
                        console.log('Error while creating a new transcoding job:', error);
                    }
                );
        },
        function (error) {
            console.log('Error while creating input and/or encoding profile:', error);
        }
    );
