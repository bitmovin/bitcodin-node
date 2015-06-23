/**
 * Created by mfillafer on 22.06.15.
 */

var http = require('http'),
    Q = require('q'),
    basePath = '/api',
    options = {
        hostname: 'portal.bitcodin.com',
        port: 80,
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accepted': 'application/json',
            'User-Agent': 'Bitcodin/v1 NodeBindings/' + require('../package').version
        }
    };

module.exports = {

    setHostname: function (hostname) {
        options.hostname = hostname;
    },

    addHeader: function (key, value) {
        options.headers[key] = value;
    },

    addHeaders: function (obj) {
        for (var i in obj) {
            if (obj.hasOwnProperty(i))
                this.addHeader(i, obj[i]);
        }
    },

    get: function (path) {
        return this.request('GET', path);
    },

    post: function (path, data) {
        return this.request('POST', path, JSON.stringify(data));
    },

    delete: function (path) {
        return this.request('DELETE', path);
    },

    patch: function (path) {
        return this.request('PATCH', path);
    },

    request: function (method, path, body) {
        options.method = method;
        options.path = basePath + path;

        var def = Q.defer(),
            response = '',
            req = http.request(options, function (res) {
                res.setEncoding('utf8');
                res.on('data', function (chunk) {
                    response += chunk;
                });

                res.on('end', function () {
                    var json = response ? JSON.parse(response) : undefined;

                    if (res.statusCode >= 200 && res.statusCode < 300) {
                        json ? def.resolve(json) : def.resolve();
                    } else {
                        json ? def.reject(json) : def.reject();
                    }
                });
            });

        req.on('error', function (e) {
            def.reject(e);
        });

        if (body) req.write(body);

        req.end();

        return def.promise;
    }
};
