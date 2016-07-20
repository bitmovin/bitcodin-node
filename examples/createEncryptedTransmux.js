
var bitcodin = require('bitcodin')('YOUR_API_KEY'), createTransmuxPromise, transmuxDetails;

//Please see our documentation regarding transmuxing for more details:
//http://docs.bitcodinrestapi.apiary.io/#reference/transmux-*beta*/transmux/create-a-transmux-with-encryption

var transmuxConfiguration = {
    "jobId": 123456,
    "videoRepresentationId": 98765,
    "audioRepresentationIds": [91234],
    "filename": "optional-custom-output-filename-encrypted.mp4",
    "encryptionConfig": {
        "keyAscii": "YOUR_32_CHARACTER_KEY_IN_HEX_FORMAT",  //required
        "kid": "YOUR_32_CHARACTER_KEY_IN_HEX_FORMAT"        //required
    }
};

// Create a Transmux
createTransmuxPromise = bitcodin.transmux.create(transmuxConfiguration);
createTransmuxPromise.then(
    function (transmuxResponse) {
        transmuxDetails = transmuxResponse;
        console.log('Successfully created an encrypted transmuxing');
    },
    function (transmuxDetails) {
        console.log('Error while creating an encrypted transmuxing', transmuxDetails);
    }
);

crateTransmuxPromise = bitcodin.transmux.get(transmuxDetails.id);
createTransmuxPromise.then(
    function (transmuxResponse) {
        console.log('Successfully got encrypted transmuxing details: ', transmuxResponse);
    },
    function (response) {
        console.log('Error while fetching encrypted transmuxing details', response);
    }
);