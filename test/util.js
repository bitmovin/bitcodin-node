/**
 * Created by mfillafer on 24.06.15.
 */

require('mocha');
require('chai').use(require("chai-as-promised")).should();

var Q = require('q');

module.exports = {
    'settings': require('./resources/settings.json'),
    'testAll': function (elems, fun) {
        var promises = [];

        for (var i in elems) {
            if(elems.hasOwnProperty(i))
                promises.push(fun(elems[i]));
        }

        return Q.all(promises);
    }
};
