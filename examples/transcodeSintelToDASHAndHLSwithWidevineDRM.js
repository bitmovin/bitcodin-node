/**
 * Created by mfillafer on 02.07.15.
 */

var Q = require('q'),
  bitcodin = require('bitcodin')('THIS_IS_MY_API_KEY'),
  openMovieUrl = 'http://eu-storage.bitcodin.com/inputs/Sintel.2010.720p.mkv',
  createInputPromise, createEncodingProfilePromise;

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
  "manifestTypes": ["mpd", "m3u8"],
  "speed": "standard",
  "drmConfig": {
      system: "widevine",
      provider: "widevine_test",
      signingKey: "1ae8ccd0e7985cc0b6203a55855a1034afc252980e970ca90e5202689f947ab9",
      signingIV: "d58ce954203b7c9a9a9d467f59839249",
      requestUrl: "http://license.uat.widevine.com/cenc/getcontentkey",
      contentId: "746573745f69645f4639465043304e4f",
      method: "mpeg_cenc"
    }
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
