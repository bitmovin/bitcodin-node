/**
 * Created by mfillafer on 23.06.15.
 */

var util = require('./util'),
    bitcodin = require('../lib/bitcodin')(util.settings.apiKey);

describe('Payment', function () {
    it('should update invoice information', function () {
        var invoiceInfo = {
            'companyName': 'bitmovin GmbH',
            'firstName': 'Stefan',
            'lastName': 'Lederer',
            'address': 'Lakeside B01',
            'addressLineOptional': '',
            'postalCode': 9020,
            'city': 'Klagenfurt',
            'country': 'Austria',
            'vatNumber': 'ATU68021428'
        };

        return bitcodin.payment.invoice.updateInfo(invoiceInfo).should.eventually.be.fulfilled;
    });

    it('should get the invoice information', function () {
        var invoiceInfo = {
            'firstName': 'Stefan',
            'lastName': 'Lederer',
            'address': 'Lakeside B01',
            'postalCode': 9020,
            'city': 'Klagenfurt',
            'country': 'Austria',
            'vatNumber': 'ATU68021428'
        };

        return bitcodin.payment.invoice.getInfo().should.eventually.include(invoiceInfo);
    });

    it('should get the wallet information', function () {
        return bitcodin.wallet.get().should.eventually.be.fulfilled;
    });

    it('should list deposits', function () {
        return bitcodin.wallet.listDeposits().should.eventually.be.fulfilled;
    });

    it('should list deposits of a given page', function () {
        var page = 2;
        return bitcodin.wallet.listDeposits(page).should.eventually.be.fulfilled;
    });

    it('should list bills', function () {
        return bitcodin.wallet.listBills().should.eventually.be.fulfilled;
    });

    it('should list bills of a given page', function () {
        var page = 2;
        return bitcodin.wallet.listBills(page).should.eventually.be.fulfilled;
    });
});