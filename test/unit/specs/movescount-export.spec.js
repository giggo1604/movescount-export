import movescountExport from '../../../src/main/movescount-export';

describe('movescount-exports.js', () => {
    it('should export a function', () => {
        movescountExport.should.be.a('function');
    });

    describe('movesCountExportFactory', () => {
        it('should return a function', () => {
            movescountExport({}).should.be.a('function');
        });
    });
});
