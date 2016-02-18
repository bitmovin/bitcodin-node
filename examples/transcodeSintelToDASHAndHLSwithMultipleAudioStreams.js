/**
 * Created by mfillafer on 02.07.15.
 */

var Q = require('q'),
    bitcodin = require('bitcodin')('THIS_IS_MY_API_KEY'),
    openMovieUrl = 'http://bitbucketireland.s3.amazonaws.com/Sintel-two-audio-streams-short.mkv',
    createInputPromise, createEncodingProfilePromise;

// Create bitcodin Input
createInputPromise = bitcodin.input.create(openMovieUrl);

// Create bitcodin encoding profile. The ApiAry documentation which explains how such a
// encoding profile should look like can be found at the link below
// http://docs.bitcodinrestapi.apiary.io/#reference/encoding-profiles/create-an-encoding-profile
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
        },
        {
            "defaultStreamId": 1,
            "bitrate": 192000
        }
    ]
};

createEncodingProfilePromise = bitcodin.encodingProfile.create(encodingProfileConfiguration);

// Create a bitcodin job which transcodes the video to DASH and HLS. The ApiAry documentation which explains
// how a job configuration object should look like can be found at the following link below
// http://docs.bitcodinrestapi.apiary.io/#reference/jobs/job/create-a-job

var jobConfiguration = {
    "inputId": -1,
    "encodingProfileId": -1,
    "manifestTypes": ["mpd", "m3u8"],
    "speed": "standard",
    "audioMetaData": [
      {
        "defaultStreamId": 0,
        "language": 'de',
        "label": "Just Sound"
      },
      {
        "defaultStreamId": 1,
        "language": "en",
        "label": "Sound and Voice"
      }
    ]
};

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
