import { saveMoveFactory, fetchMovesFactory } from '../../../src/main/movescount-export';

describe('movescount-exports.js', () => {
    it('should export a saveMoveFactory function', () => {
        saveMoveFactory.should.be.a('function');
    });

    it('should export a fetchMovesFactory function', () => {
        fetchMovesFactory.should.be.a('function');
    });

    describe('saveMoveFactory', () => {
        it('should return a function', () => {
            saveMoveFactory({}).should.be.a('function');
        });
        describe('saveMove', () => {
            const fetch = () => Promise.resolve({
                body: {
                    pipe() {},
                },
            });
            const createWriteStream = () => {};
            const createURL = () => 'export.movescount.com';
            const createCookiesString = () => {};
            const join = () => {};
            const exportURL = 'export.movescount.com';
            const move = { MoveId: 123456 };
            const config = {
                format: 'xml',
                folder: './downloads',
                cookies: {
                    a: 'a',
                    b: 'b',
                },
            };
            it('should call createURL with the right parameters', async () => {
                const createURL = (url, path, { id, format }) => {
                    url.should.equal(exportURL);
                    expect(path).to.be.null; // eslint-disable-line
                    id.should.equal(move.MoveId);
                    format.should.equal(config.format);
                };
                const saveMove = saveMoveFactory(
                    { fetch, createWriteStream, createURL, createCookiesString, join, exportURL },
                );
                await saveMove(move, config);
            });
            it('should call createCookiesString with the right params', async () => {
                const createCookiesString = (cookies) => {
                    cookies.should.be.deep.equal(config.cookies);
                };
                const saveMove = saveMoveFactory(
                    { fetch, createWriteStream, createURL, createCookiesString, join, exportURL },
                );
                await saveMove(move, config);
            });
            it('should call fetch with the right params', async () => {
                const createCookiesString = () => 'foobar';
                const fetch = (url, config) => {
                    url.should.equal(createURL());
                    config.should.deep.equal({ headers: { Cookie: createCookiesString() } });
                    return Promise.resolve({
                        body: {
                            pipe() {},
                        },
                    });
                };
                const saveMove = saveMoveFactory(
                    { fetch, createWriteStream, createURL, createCookiesString, join, exportURL },
                );
                await saveMove(move, config);
            });
            it('should call join with the right params', async () => {
                const join = (a, b) => {
                    a.should.equal('./downloads');
                    b.should.equal('move-123456.xml');
                };
                const saveMove = saveMoveFactory(
                    { fetch, createWriteStream, createURL, createCookiesString, join, exportURL },
                );
                await saveMove(move, config);
            });
            it('should call createWriteStream with the right params', async () => {
                const join = () => 'foo/bar';
                const createWriteStream = (path) => {
                    path.should.equal('foo/bar');
                };
                const saveMove = saveMoveFactory(
                    { fetch, createWriteStream, createURL, createCookiesString, join, exportURL },
                );
                await saveMove(move, config);
            });
            it('should call createWriteStream with the right params', async () => {
                const join = () => 'foo/bar';
                const createWriteStream = (path) => {
                    path.should.equal('foo/bar');
                };
                const saveMove = saveMoveFactory(
                    { fetch, createWriteStream, createURL, createCookiesString, join, exportURL },
                );
                await saveMove(move, config);
            });
            it('should pipe the fetch result to the write stream', async () => {
                const createWriteStream = () => 'writeStream';
                const fetch = () => Promise.resolve({
                    body: {
                        pipe(writeStream) {
                            writeStream.should.equal('writeStream');
                        },
                    },
                });
                const saveMove = saveMoveFactory(
                    { fetch, createWriteStream, createURL, createCookiesString, join, exportURL },
                );
                await saveMove(move, config);
            });
        });
    });

    describe('fetchMovesFactory', () => {
        it('should return a function', () => {
            fetchMovesFactory({}).should.be.a('function');
        });
        describe('fetchMoves', () => {
            const baseURL = 'www.movescount.com';
            const path = 'path/to/moves';
            const userId = 123456;
            const authToken = 'token';
            const startDate = new Date(Date.UTC(2017, 1, 1));
            const endDate = new Date(Date.UTC(2017, 1, 1));

            it('should call fetch with the url formated by createURL', async () => {
                const createdURL = 'foo/bar';
                const createURLMock = () => createdURL;

                const fetchMock = (url) => {
                    url.should.equal(createdURL);
                    return Promise.resolve({
                        json() { return { Moves: [] }; },
                    });
                };

                const fetchMoves =
                    fetchMovesFactory({ fetch: fetchMock, createURL: createURLMock });
                await fetchMoves(baseURL, path, userId, authToken, startDate, endDate);
            });

            it('should pass the authorization token as Authorization header', async () => {
                const fetchMock = (url, config) => {
                    config.headers.Authorization.should.equal(authToken);
                    return Promise.resolve({
                        json() { return { Moves: [] }; },
                    });
                };

                const fetchMoves = fetchMovesFactory({ fetch: fetchMock, createURL: () => {} });
                await fetchMoves(baseURL, path, userId, authToken, startDate, endDate);
            });

            it('should call create url with the right params', async () => {
                const createURLMock = (a, b, c) => {
                    a.should.equal(baseURL);
                    b.should.equal(path);
                    c.userId.should.equal(userId);
                    c.startDateString.should.equal('2017-02-01T00:00:00.000Z');
                    c.endDateString.should.equal('2017-02-01T00:00:00.000Z');
                };

                const fetchMock = () => Promise.resolve({
                    json() { return { Moves: [] }; },
                });


                const fetchMoves =
                    fetchMovesFactory({ fetch: fetchMock, createURL: createURLMock });
                await fetchMoves(baseURL, path, userId, authToken, startDate, endDate);
            });
        });
    });
});
