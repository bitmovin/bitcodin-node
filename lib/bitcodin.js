/**
 * Created by mfillafer on 22.06.15.
 */

var Q = require('q'),
    rest = require('./rest'),
    API_VERSION = 'v1';

function Bitcodin(key, version) {

    if (!(this instanceof Bitcodin)) {
        return new Bitcodin(key, version);
    }

    if (!key || typeof key !== 'string') {
        throw new Error('No bitcodin API Key given');
    } else {
        this.key = key;
    }

    this.version = API_VERSION;

    if (version) {
        if (!/v\d+/.test(version)) {
            throw new Error('Given bitcodin version is not valid');
        } else {
            this.version = version;
        }
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
                    type: 'url',
                    url: inputConfig
                }
            }

            return rest.post('/input/create', inputConfig);
        },

        analyze: function (inputId) {
            if (isNaN(inputId)) {
                var def = Q.defer();
                def.reject('inputId is no number');
                return def.promise;
            }

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
            if (isNaN(inputId)) {
                var def = Q.defer();
                def.reject('inputId is no number');
                return def.promise;
            }

            return rest.get('/input/' + inputId);
        },

        delete: function (inputId) {
            if (isNaN(inputId)) {
                var def = Q.defer();
                def.reject('inputId is no number');
                return def.promise;
            }

            return rest.delete('/input/' + inputId);
        }
    },

    output: {
        s3: {
            create: function (s3OutputConfig) {
                return rest.post('/output/create', s3OutputConfig);
            }
        },

        gcs: {
            create: function (gcsOutputConfig) {
                return rest.post('/output/create', gcsOutputConfig);
            }
        },

        ftp: {
            create: function (ftpOutputConfig) {
                return rest.post('/output/create', ftpOutputConfig);
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
            if (isNaN(outputId)) {
                var def = Q.defer();
                def.reject('outputId is no number');
                return def.promise;
            }

            return rest.get('/output/' + outputId);
        },

        delete: function (outputId) {
            if (isNaN(outputId)) {
                var def = Q.defer();
                def.reject('outputId is no number');
                return def.promise;
            }

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
            if (isNaN(encodingProfileId)) {
                var def = Q.defer();
                def.reject('encodingProfileId is no number');
                return def.promise;
            }

            return rest.get('/encoding-profile/' + encodingProfileId);
        },

        delete: function (encodingProfileId) {
            if (isNaN(encodingProfileId)) {
                var def = Q.defer();
                def.reject('encodingProfileId is no number');
                return def.promise;
            }

            return rest.delete('/encoding-profile/' + encodingProfileId);
        }
    },

    job: {
        create: function (job) {
            return rest.post('/job/create', job);
        },

        list: function (pageNumber, status) {
            var params = '';
            if (pageNumber !== undefined && !isNaN(pageNumber)) {
                params += '/' + pageNumber;
            }
            if(status !== undefined && ['all', 'finished', 'enqueued', 'inprogress', 'error'].indexOf(status) != -1) {
                params += '/' + status;
            }

            return rest.get('/jobs' + params);
        },

        getDetails: function (jobId) {
            if (isNaN(jobId)) {
                var def = Q.defer();
                def.reject('jobId is no number');
                return def.promise;
            }

            return rest.get('/job/' + jobId);
        },

        getStatus: function (jobId) {
            if (isNaN(jobId)) {
                var def = Q.defer();
                def.reject('jobId is no number');
                return def.promise;
            }

            return rest.get('/job/' + jobId + '/status');
        },

        transfer: {
            create: function (transferJob) {
                return rest.post('/job/transfer', transferJob);
            },

            list: function (jobId) {
                if (isNaN(jobId)) {
                    var def = Q.defer();
                    def.reject('jobId is no number');
                    return def.promise;
                }

                return rest.get('/job/' + jobId + '/transfers');
            }
        }
    },
    livestream: {
        get: function (livestreamId) {
            if (isNaN(livestreamId)) {
                var def = Q.defer();
                def.reject('livestreamId is no number');
                return def.promise;
            }
            return rest.get('/livestream/' + livestreamId);
        },
        create: function (livestream) {
            var def = Q.defer();

            rest.post('/livestream', livestream).then(
                function(response){
                    var poll = function() {
                        setTimeout(function () {
                            rest.get('/livestream/' + response.id).then(
                                function (response) {
                                    if (response.status == 'RUNNING') {
                                        def.resolve(response);
                                    }
                                    else if (response.status == 'ERROR') {
                                        def.reject("Error while creating live stream!");
                                    }
                                    else
                                    {
                                        poll();
                                    }
                                },
                                function (error) {
                                    def.reject(error);
                                }
                            )
                        }, 5000);
                    };
                    poll();
                },
                function(error){
                    def.reject(error);
                }
            );

            return def.promise;
        },
        delete: function (livestreamId) {
            if (isNaN(livestreamId)) {
                var def = Q.defer();
                def.reject('livestreamId is no number!');
                return def.promise;
            }
            return rest.delete('/livestream/' + livestreamId);
        }
    },
    statistic: {
        get: function () {
            return rest.get('/statistics');
        },

        jobs: function (fromDate, toDate) {
            var now = new Date().toISOString().substr(0, 10);
            var def = Q.defer();

            if (fromDate === undefined) {
                fromDate = now;
            } else if (isNaN(Date.parse(fromDate))) {
                def.reject('fromDate is not a date');
                return def.promise;
            }

            if (toDate === undefined) {
                toDate = now;
            } else if (isNaN(Date.parse(toDate))) {
                def.reject('toDate is not a date');
                return def.promise;
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
            return rest.get('/payment/user');
        },

        listDeposits: function (pageNumber) {
            if (pageNumber !== undefined && !isNaN(pageNumber)) {
                pageNumber = '/' + pageNumber
            } else {
                pageNumber = ''
            }

            return rest.get('/payment/deposits' + pageNumber);
        },

        listBills: function (pageNumber) {
            if (pageNumber !== undefined && !isNaN(pageNumber)) {
                pageNumber = '/' + pageNumber
            } else {
                pageNumber = ''
            }

            return rest.get('/payment/bills' + pageNumber);
        }
    }
};

module.exports = Bitcodin;