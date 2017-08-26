import utils from '../utils';

describe('Launch', function () {
    beforeEach(utils.beforeEach);
    afterEach(utils.afterEach);

    it('shows two initial windows', function () {
        return this.app.client.getWindowCount().then(function (count) {
            expect(count).to.equal(2);
        });
    });

    it('shows the proper application title', function () {
        return this.app.client.windowByIndex(0).getTitle()
            .then((title) => {
                expect(title).to.equal('movescount-export');
            });
    });
});
