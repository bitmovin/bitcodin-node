var Q = require('q'),
    bitcodin = require('bitcodin')('INSERT YOUR API KEY'),
    createEncodingProfilePromise, createOutputPromise;

/*
    Create an encoding profile for your live stream.
    http://docs.bitcodinrestapi.apiary.io/#reference/encoding-profiles/create-an-encoding-profile
 */
var liveEncodingProfile = {
    "name": "live stream profile",
    "videoStreamConfigs": [
        {
            /* 3 Mbit, 1920x1080, Full HD */
            "defaultStreamId": 0,
            "bitrate": 3000000,
            "profile": "Main",
            "preset": "premium",
            "height": 1080,
            "width": 1920
        },
        {
            /* 1,5 Mbit, 1280x720, 720p */
            "defaultStreamId": 0,
            "bitrate": 1500000,
            "profile": "Main",
            "preset": "premium",
            "height": 720,
            "width": 1280
        },
        {
            /* 1 Mbit, 640x480, 480p */
            "defaultStreamId": 0,
            "bitrate": 1000000,
            "profile": "Main",
            "preset": "premium",
            "height": 480,
            "width": 640
        }
    ],
    "audioStreamConfigs": [
        {
            "defaultStreamId": 0,
            "bitrate": 256000
        }
    ]
};

createEncodingProfilePromise = bitcodin.encodingProfile.create(liveEncodingProfile);

/*
    Create an output where the live stream files should be stored.
    https://jsapi.apiary.io/apis/bitcodinrestapi/reference/outputs/create-output/create-an-s3-output.html
 */
var date = new Date();

var prefix = "livestream" + date.getFullYear() + date.getMonth() + date.getDay() + date.getHours() + date.getMinutes();

var liveStreamOutput = {
    "type": "gcs",
    "name": "Test Output Name",
    "accessKey": "YOUR ACCESS KEY",
    "secretKey": "YOUR SECRET KEY",
    "bucket": "YOUR BUCKET NAME",
    "prefix": prefix,
    "makePublic": true
};

createOutputPromise = bitcodin.output.gcs.create(liveStreamOutput);

Q.all([createEncodingProfilePromise, createOutputPromise])
    .then(
        function (result) {
            console.log('Successfully created output and encoding profile!');
            console.log('Starting live stream...');
            /*
                Create your live stream
             */

            var liveStreamConfig = {
                "label": "test-livestream",
                "streamKey": "stream",
                "timeshift": 120,
                "encodingProfileId": result[0].encodingProfileId,
                "outputId": result[1].outputId
            };

            return bitcodin.livestream.create(liveStreamConfig);
        },
        function (error) {
            console.log('Error while creating output and/or encoding profile:', error);
        }
    )
    .then(
        function(livestream) {
            console.log("Successfully created live stream!");
            console.log(livestream);
            console.log("\n");
            console.log("****************************************************************");
            console.log("INFO: DONT FORGET TO DELETE LIVE STREAM WHEN FINISHED STREAMING!");
            console.log("****************************************************************");
            /*
                Delete live stream when finished streaming
             */
            console.log("Deleting livestream...");
            return bitcodin.livestream.delete(livestream.id)
        },
        function(createError)
        {
            console.log("Error while creating live stream!", createError);
        }
    )
    .then(
        function() {
            console.log("Successfully deleted live stream!");
        },
        function(error) {
            console.log("Error while deleting live stream!", error);
        }
    );



