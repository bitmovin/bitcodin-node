# [![bitcodin](http://www.bitcodin.com/wp-content/uploads/2014/10/bitcodin-small.gif)](http://www.bitcodin.com)
[![build status](https://travis-ci.org/bitmovin/bitcodin-node.svg)](https://travis-ci.org/bitmovin/bitcodin-node)
[![Coverage Status](https://coveralls.io/repos/bitmovin/bitcodin-node/badge.svg?branch=master)](https://coveralls.io/r/bitmovin/bitcodin-node?branch=master)

The bitcodin API for NodeJS is a seamless integration with the [bitcodin cloud transcoding system](http://www.bitcodin.com). It enables the generation of MPEG-DASH and HLS content in just some minutes.

# Getting started
First add the npm module to your project `npm install bitcodin --save`. All calls return a promise for success or error case.

![APIKey](http://www.bitcodin.com/wp-content/uploads/2015/06/api_key.png)

An example how you can instantiate the bitcodin API is shown in the following:

```nodejs
var bitcodin = require('bitcodin')('THIS_IS_MY_API_KEY');

bitcodin.input.list()
    .then(function(inputs) {
        console.log('inputs', inputs);
    }, function(err) {
        console.error(err);
    });
```
