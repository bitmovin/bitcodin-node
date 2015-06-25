/**
 * Created by mfillafer on 23.06.15.
 */

var util = require('./util'),
    bitcodin = require('../lib/bitcodin')(util.settings.apiKey);

describe('Statistic', function () {

    it('should get the output statistics for the current calendar month', function () {
        return bitcodin.statistic.get().should.eventually.be.fulfilled;
    });

    it('should get the job statistics for the given time window', function () {
        var fromDate = '2000-12-24';
        var toDate = '2100-12-24';
        return bitcodin.statistic.jobs(fromDate, toDate).should.eventually.be.fulfilled;
    });
});
