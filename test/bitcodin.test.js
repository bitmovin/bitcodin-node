/**
 * Created by mfillafer on 23.06.15.
 */

var expect = require('chai').expect,
    util = require('./util'),
    bitcodin = require('../lib/bitcodin')(util.settings.apiKey);

describe('Bitcodin', function () {

    it('should get an error for having not api key', function () {
        expect(function() {
            require('../lib/bitcodin')();
        }).to.throw(Error);
    });

    it('should get an error for having a wrong version key', function () {
        expect(function() {
            require('../lib/bitcodin')(util.settings.apiKey, 'wrong')
        }).to.throw(Error);
    });

/*    it('should get the job statistics for the given time window', function () {
        var fromDate = '2000-12-24';
        var toDate = '2100-12-24';
        return bitcodin.statistic.jobs(fromDate, toDate).should.eventually.be.fulfilled;
    });

    it('should fail to get job statistics for wrong from Date', function () {
        var fromDate = '2000-13-24';
        var toDate = '2100-12-24';
        return bitcodin.statistic.jobs(fromDate, toDate).should.eventually.be.rejected;
    });

    it('should fail to get job statistics for missing from Date', function () {
        return bitcodin.statistic.jobs().should.eventually.be.fulfilled;
    });

    it('should fail to get job statistics for wrong to Date', function () {
        var fromDate = '2000-12-24';
        var toDate = '2100-13-24';
        return bitcodin.statistic.jobs(fromDate, toDate).should.eventually.be.rejected;
    });

    it('should fail to get job statistics for missing to Date', function () {
        var fromDate = '2000-12-24';
        return bitcodin.statistic.jobs(fromDate).should.eventually.be.fulfilled;
    });
*/
});
