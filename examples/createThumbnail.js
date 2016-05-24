/**
 * Created by lkroepfl on 24.05.16.
 */

var Q = require('q'),
    bitcodin = require('bitcodin')('INSERT YOUR API KEY'),
    openMovieUrl = 'http://eu-storage.bitcodin.com/inputs/Sintel.2010.720p.mkv',
    createInputPromise, createEncodingProfilePromise, createThumbnailPromise;

// Create bitcodin Input
createInputPromise = bitcodin.input.create(openMovieUrl);

// Create bitcodin encoding profile. The ApiAry documentation which explains how such a
// encoding profile should look like can be found at the link below
// http://docs.bitcodinrestapi.apiary.io/#reference/encoding-profiles/create-an-encoding-profile
var encodingProfileConfiguration = {
    "name": "bitcodin Encoding Profile",
    "videoStreamConfigs": [
        {
            "defaultStreamId": 0,
            "bitrate": 4800000,
            "profile": "Main",
            "preset": "premium",
            "height": 1080,
            "width": 1920
        },
        {
            "defaultStreamId": 0,
            "bitrate": 2400000,
            "profile": "Main",
            "preset": "premium",
            "height": 720,
            "width": 1280
        },
        {
            "defaultStreamId": 0,
            "bitrate": 1200000,
            "profile": "Main",
            "preset": "premium",
            "height": 480,
            "width": 854
        }
    ],
    "audioStreamConfigs": [
        {
            "defaultStreamId": 0,
            "bitrate": 256000
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
    "manifestTypes": ["mpd", "m3u8"]
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
                        console.log('Successfully created a new transcoding job');
                        createThumbnailFromJobId(newlyCreatedJob.jobId);
                    },
                    function () {
                        console.log('Error while creating a new transcoding job');
                    }
                );
        },
        function () {
            console.log('Error while creating input and/or encoding profile');
        }
    );

// Create a thumbnail at second 50 with a height of 320px from a given job
// Note: You don't have to create a new job for a thumbnail, you can use finished jobs too.
function createThumbnailFromJobId(jobId) {
    if(isNaN(jobId)) {
        console.log('JobId is not a number.');
        return;
    }

    var thumbnailConfiguration = {
        "jobId": jobId,
        "height": 320,
        "position": 50,
        "async": true //synchronous thumbnail creation is deprecated
    };

    createThumbnailPromise = bitcodin.thumbnail.create(thumbnailConfiguration);

    Q.all([createThumbnailPromise])
        .then(
            function (result) {
                console.log('Successfully created a thumbnail', result);
            },
            function (error) {
                console.log('Error while creating thumbnail:', error);
            }
        );
}