/**
 * Created by mfillafer on 22.06.15.
 */

var rest = require('./rest'),
    API_VERSION = 'v1';

function Bitcodin(key, version) {
    if (!key || typeof key !== 'string') {
        throw new Error('No bitcodin API Key given');
    } else {
        this.key = key;
    }

    this.version = API_VERSION;

    if (version && !/v\d+/.test(version)) {
        throw new Error('Given bitcodin version is not valid');
    } else {
        this.version = version;
    }

    rest.addHeaders({
        'bitcodin-api-version': this.version,
        'bitcodin-api-key': this.key
    });
}


Bitcodin.prototype = {

    input: {
        create: function (inputConfig) {
            if (typeof inputConfig === 'string') {
                inputConfig = {
                    type: 'http',
                    url: inputConfig
                }
            }

            return rest.post('/input/create', inputConfig);
        },

        analayze: function (inputId) {
            if (isNaN(inputId))
                throw new Error('inputId is no number');

            return rest.patch('/input/' + inputId + '/analyze');
        },

        list: function (pageNumber) {
            if (pageNumber !== undefined && !isNaN(pageNumber)) {
                pageNumber = '/' + pageNumber
            } else {
                pageNumber = ''
            }

            return rest.get('/inputs' + pageNumber);
        },

        get: function (inputId) {
            if (isNaN(inputId))
                throw new Error('inputId is no number');

            return rest.get('/input/' + inputId);
        },

        delete: function (inputId) {
            if (isNaN(inputId))
                throw new Error('inputId is no number');

            return rest.delete('/input/' + inputId);
        }
    },

    output: {
        s3: {
            create: function (s3OutputConfig) {
                return restClient.post('/input', s3OutputConfig);
            }
        },

        gcs: {
            create: function (gcsOutputConfig) {
                return restClient.post('/input', gcsOutputConfig);
            }
        },

        ftp: {
            create: function (ftpOutputConfig) {
                return restClient.post('/input', ftpOutputConfig);
            }
        },

        list: function (pageNumber) {
            if (pageNumber !== undefined && !isNaN(pageNumber)) {
                pageNumber = '/' + pageNumber
            } else {
                pageNumber = ''
            }

            return rest.get('/outputs' + pageNumber);
        },

        getDetails: function (outputId) {
            if (isNaN(outputId))
                throw new Error('outputId is no number');

            return rest.get('/output/' + outputId);
        },

        delete: function (outputId) {
            if (isNaN(outputId))
                throw new Error('outputId is no number');

            return rest.delete('/output/' + outputId);
        }
    },

    encodingProfile: {
        create: function (encodingProfile) {
            return rest.post('/encoding-profile/create', encodingProfile);
        },

        list: function (pageNumber) {
            if (pageNumber !== undefined && !isNaN(pageNumber)) {
                pageNumber = '/' + pageNumber
            } else {
                pageNumber = ''
            }

            return rest.get('/encoding-profiles' + pageNumber);
        },

        get: function (encodingProfileId) {
            if (isNaN(encodingProfileId))
                throw new Error('encodingProfileId is no number');

            return rest.get('/encoding-profiles/' + encodingProfileId);
        }
    },

    job: {
        create: function (job) {
            return rest.post('/job/create', job);
        },

        list: function (pageNumber) {
            if (pageNumber !== undefined && !isNaN(pageNumber)) {
                pageNumber = '/' + pageNumber
            } else {
                pageNumber = ''
            }

            return rest.get('/jobs' + pageNumber);
        },

        getDetails: function (jobId) {
            if (isNaN(jobId))
                throw new Error('jobId is no number');

            return rest.get('/job/' + jobId);
        },

        getStatus: function (jobId) {
            if (isNaN(jobId))
                throw new Error('jobId is no number');

            return rest.get('/job/' + jobId + '/status');
        },

        transfer: {
            create: function (transferJob) {
                return rest.post('/job/transfer', transferJob);
            },

            list: function (jobId) {
                if (isNaN(jobId))
                    throw new Error('jobId is no number');

                return rest.get('/job/' + jobId + '/transfers');
            },
        }
    },

    statistic: {
        get: function () {
            return rest.get('/statistics');
        },

        jobs: function (fromDate, toDate) {
            var now = new Date().toISOString().substr(0, 10);

            if (fromDate === undefined) {
                fromDate = now;
            } else if (isNaN(Date.parse(fromDate))) {
                throw new Error('fromDate is not a date');
            }

            if (toDate === undefined) {
                toDate = now;
            } else if (isNaN(Date.parse(toDate))) {
                throw new Error('fromDate is not a date');
            }

            return rest.get('/statistics/jobs/' + fromDate + '/' + toDate);
        }
    },

    payment: {
        invoice: {
            updateInfo: function (invoiceInfo) {
                return rest.post('/payment/invoiceinfo', invoiceInfo);
            },

            getInfo: function () {
                return rest.get('/payment/invoiceinfo');
            }
        }
    },

    wallet: {
        get: function () {
            return rest.get('/wallet');
        },

        listDeposits: function (pageNumber) {
            if (pageNumber !== undefined && !isNaN(pageNumber)) {
                pageNumber = '/' + pageNumber
            } else {
                pageNumber = ''
            }

            return rest.get('/wallet/deposits' + pageNumber);
        },

        listBills: function (pageNumber) {
            if (pageNumber !== undefined && !isNaN(pageNumber)) {
                pageNumber = '/' + pageNumber
            } else {
                pageNumber = ''
            }

            return rest.get('/wallet/bills' + pageNumber);
        }
    }
};

module.exports = Bitcodin;