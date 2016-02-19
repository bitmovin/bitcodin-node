# [![bitcodin](http://www.bitcodin.com/wp-content/uploads/2014/10/bitcodin-small.gif)](http://www.bitcodin.com)
[![build status](https://travis-ci.org/bitmovin/bitcodin-node.svg)](https://travis-ci.org/bitmovin/bitcodin-node)
[![npm version](https://badge.fury.io/js/bitcodin.svg)](http://badge.fury.io/js/bitcodin)
[![Coverage Status](https://coveralls.io/repos/bitmovin/bitcodin-node/badge.svg?branch=master)](https://coveralls.io/r/bitmovin/bitcodin-node?branch=master)

The bitcodin API for NodeJS is a seamless integration with the [bitcodin cloud transcoding system](http://www.bitcodin.com). It enables the generation of MPEG-DASH and HLS content in just some minutes.

# Installation
Change directory to your project folder and install with NPM.

```bash
cd your/project/folder
npm install bitcodin --save
```
 
# Usage

Before you can start using the api you need to **set your API key.**

Your API key can be found in the **settings of your bitcodin user account**, as shown in the figure below.

![APIKey](http://www.bitcodin.com/wp-content/uploads/2015/06/api_key.png)

An example how you can set the bitcodin API is shown in the following:

```javascript
var bitcodin = require('bitcodin')('THIS_IS_MY_API_KEY');
```

Each Api call with the bitcodin object returns a promise, which can be processed like follows:

```javascript
bitcodin.input.list()
    .then(function(inputs) {
        console.log('inputs', inputs);
    }, function(err) {
        console.error(err);
    });
```

# Example
## Creating a new Transcoding Job

This example shows the process of creating a new input and a new encoding profile. 
When the above mentioned objects are created a new transcoding job will be created.

```javascript
var bitcodin = require('bitcodin')('THIS_IS_MY_API_KEY'),
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
            "bitrate": 1024000,
            "profile": "Main",
            "preset": "premium",
            "height": 768,
            "width": 1366
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

Q.all([createInputPromise, createEncodingProfilePromise]).then(
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
```
