/**
 * Created by mfillafer on 23.06.15.
 */

var util = require('./util'),
    bitcodin = require('../lib/bitcodin')(util.settings.apiKey);

describe('Input', function () {
    var inputIds = [];

    it('should create an input from a URL string', function () {
        var url = 'http://eu-storage.bitcodin.com/inputs/Sintel.2010.720p.mkv';
        var promise = bitcodin.input.create(url);

        promise.then(function (data) {
            data.should.have.property('inputId');
            inputIds.push(data.inputId);
        });

        return promise.should.eventually.be.fulfilled;
    });

    it('should create an input from a http input config object', function () {
        var httpInputConfig = {
            url: 'http://ftp.nluug.nl/pub/graphics/blender/demo/movies/Sintel.2010.720p.mkv'
        };
        var promise = bitcodin.input.create(httpInputConfig);

        promise.then(function (data) {
            data.should.have.property('inputId');
            inputIds.push(data.inputId);
        });

        return promise.should.eventually.be.fulfilled;
    });

    it('should analyze an input', function () {
        var promise = bitcodin.input.analayze(inputIds[0]);
        return promise.should.eventually.have.property('inputId', inputIds[0]);
    });

    it('should get input details for a given input id', function () {
        var promise = bitcodin.input.get(inputIds[0]);
        return promise.should.eventually.have.property('inputId', inputIds[0]);
    });

    it('should list available inputs', function () {
        return bitcodin.input.list().should.eventually.be.fulfilled;
    });

    it('should list inputs of a given page', function () {
        var page = 2;
        return bitcodin.input.list(page).should.eventually.be.fulfilled;
    });

    it('should delete all created inputs', function () {
        return util.testAll(inputIds, function (inputId) {
            return bitcodin.input.delete(inputId).should.eventually.be.fulfilled;
        });
    });
});