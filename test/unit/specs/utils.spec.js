import { createURL, createCookiesString, updateMoveFactory } from '../../../src/main/utils';

describe('utils.js', () => {
    describe('creareURL', () => {
        it('should merge base and path', () => {
            const c = createURL;
            c('http://google.com', 'test/path').should.equal('http://google.com/test/path/');
            c('www.google.com/', 'test/path').should.equal('www.google.com/test/path/');
            c('www.google.com', '/test/path').should.equal('www.google.com/test/path/');
            c('www.google.com', 'test/path/').should.equal('www.google.com/test/path/');
            c('www.google.com/', '/test/path').should.equal('www.google.com/test/path/');
            c('www.google.com', '').should.equal('www.google.com/');
        });
        it('should add a query string passed by an object', () => {
            const c = createURL;
            c('www.google.com', '', {
                a: 'test',
            }).should.equal('www.google.com?a=test');

            c('www.google.com', '', {
                a: 'foo',
                b: 'bar',
            }).should.equal('www.google.com?a=foo&b=bar');

            c('www.google.com', 'test/path', {
                a: 'foo',
                b: 'bar',
            }).should.equal('www.google.com/test/path?a=foo&b=bar');
        });
    });

    describe('createCookiesString', () => {
        it('should merge the cookies Array to a string', () => {
            const cookies = [
                { name: 'foo', value: 'bar' },
                { name: 'test', value: 'this' },
            ];
            createCookiesString(cookies).should.equal('foo=bar; test=this');
        });
    });

    describe('updateMove', () => {
        it('should call webContents.send with the proper updated move', () => {
            const move = { a: 1, b: 3 };
            const updatedKeys = {
                b: 2,
                foo: 'bar',
                test: 'this',
            };
            const webContents = {
                send(_, move) {
                    move.should.deep.equal({
                        a: 1,
                        b: 2,
                        foo: 'bar',
                        test: 'this',
                    });
                },
            };
            const updateMove = updateMoveFactory({ webContents });
            updateMove(move, updatedKeys);
        });
    });
});
