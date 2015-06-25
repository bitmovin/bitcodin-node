/**
 * Created by mfillafer on 24.06.15.
 */

require('mocha');

var chai = require('chai').use(require("chai-as-promised")),
    Q = require('q');

chai.should();

module.exports = {
    'expect': chai.expect,
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
