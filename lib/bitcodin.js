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

        createAsync: function(inputConfig) {
            var api = this;

            if (typeof inputConfig === 'string') {
                inputConfig = {
                    type: 'url',
                    url: inputConfig
                }
            }

            return rest.post('/input/createasync', inputConfig).then(
              function(response) {
                  return api.getAsync(response.inputId);
              }
            );
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

        getAsync: function (inputId) {
            var def = Q.defer();

            if (isNaN(inputId)) {
                def.reject('inputId is no number');
                return def.promise;
            }

            (function poll() {
                rest.get('/input/' + inputId + '/asyncstatus').then(
                  function (response) {
                      switch(response.status) {
                          case 'CREATED':
                              def.resolve(response);
                              break;
                          case 'ERROR':
                              def.reject("Error while creating input!");
                              break;
                          default:
                              setTimeout(poll, 5000);
                      }
                  },
                  def.reject
                );
            })();

            return def.promise;
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
        },
        delete: function (jobId){
            if (isNaN(jobId)) {
                var def = Q.defer();
                def.reject('jobId is no number!');
                return def.promise;
            }
            return rest.delete('/job/' + jobId);
        },
        getManifestInfo: function(jobId){
            if (isNaN(jobId)) {
                var def = Q.defer();
                def.reject('jobId is no number!');
                return def.promise;
            }
            return rest.get('/job/' + jobId + '/manifest-info');
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
    /*statistic: {

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

    },*/
    manifest: {
        mpd: {
            vtt: function (jobId, subtitles) {
                if (isNaN(jobId)) {
                    var def = Q.defer();
                    def.reject('jobId is no number');
                    return def.promise;
                }
                if (!subtitles){
                    var def = Q.defer();
                    def.reject('subtitles need to be a url');
                    return def.promise;
                }
                var payload = { jobId: jobId, subtitles: subtitles }
                return rest.post('/manifest/mpd/vtt', payload);
            }
        },
        hls: {
            vtt: function (jobId, subtitles) {
                if (isNaN(jobId)) {
                    var def = Q.defer();
                    def.reject('jobId is no number');
                    return def.promise;
                }
                if (!subtitles){
                    var def = Q.defer();
                    def.reject('you need to provide subtitles array');
                    return def.promise;
                }
                var payload = { jobId: jobId, subtitles: subtitles }
                return rest.post('/manifest/hls/vtt', payload);
            }
        }
    },

    thumbnail : {
        get: function(thumbnailId) {
            return rest.get('/thumbnail/' + thumbnailId);
        },
        create: function(thumbnail) {
            var def = Q.defer();

            rest.post('/thumbnail', thumbnail).then(
                function(response) {
                    (function poll() {
                        rest.get('/thumbnail/' + response.id).then(
                            function (response) {
                                switch(response.state) {
                                    case 'FINISHED':
                                        def.resolve(response);
                                        break;
                                    case 'ERROR':
                                        def.reject("Error while creating thumbnail!");
                                        break;
                                    default:
                                        setTimeout(poll, 5000);
                                }
                            },
                            def.reject
                        );
                    })();
                },
                def.reject
            );

            return def.promise;
        }
    },

    transmux : {
        get: function(transmuxId) {
            return rest.get('/transmux/' + transmuxId);
        },
        create: function(transmux) {
            var def = Q.defer();

            rest.post('/transmux', transmux).then(
                function(response) {
                    (function poll() {
                        rest.get('/transmux/' + response.id).then(
                            function (response) {
                                switch(response.status) {
                                    case 'created':
                                        def.resolve(response);
                                        break;
                                    case 'assigned':
                                        def.resolve(response);
                                        break;
                                    case 'enqueued':
                                        def.resolve(response);
                                        break;
                                    case 'inprogress':
                                        def.resolve(response);
                                        break;
                                    case 'finished':
                                        def.resolve(response);
                                        break;
                                    case 'error':
                                        def.reject("Error while creating transmux!");
                                        break;
                                    default:
                                        def.reject("Unexpected Error while creating transmux!");
                                        break;
                                }
                            },
                            def.reject
                        );
                    })();
                },
                def.reject
            );

            return def.promise;
        }
    }
};

module.exports = Bitcodin;