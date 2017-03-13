
var bitcodin = require('bitcodin')('YOUR_API_KEY'), createTransmuxPromise, transmuxDetails;

//Please see our documentation regarding transmuxing for more details:
//http://docs.bitcodinrestapi.apiary.io/#reference/transmux-*beta*/transmux/create-a-transmux

var transmuxConfiguration = {
    "jobId": 123456,                                    //required
    "videoRepresentationId": 98765,                     //required
    "audioRepresentationIds": [91234],                  //required
    "filename": "optional-custom-output-filename.mp4"   //optional
};

// Create a Transmux
createTransmuxPromise = bitcodin.transmux.create(transmuxConfiguration);
createTransmuxPromise.then(
    function (transmuxResponse) {
        transmuxDetails = transmuxResponse;
        console.log('Successfully created a new transmuxing');
    },
    function (transmuxDetails) {
        console.log('Error while creating a new transmuxing', transmuxDetails);
    }
);

createTransmuxPromise = bitcodin.transmux.get(transmuxDetails.id);
createTransmuxPromise.then(
    function (transmuxResponse) {
        console.log('Successfully got transmuxing details: ', transmuxResponse);
    },
    function (response) {
        console.log('Error while fetching transmuxing details', response);
    }
);
