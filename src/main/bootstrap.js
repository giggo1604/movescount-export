import fs from 'fs';
import fetch from 'node-fetch';
import moment from 'moment';
import { parallelLimit } from 'async';
import { fetchMovesFactory, saveMoveFactory } from './movescount-export';
import { confirm, updateMoveFactory, createCookiesString, createURL } from './utils';
import authenticate from './authenticate';

export default (webContents) => {
    const exportURL = 'http://www.movescount.com/move/export?';
    const fetchMoves = fetchMovesFactory({ fetch, createURL });
    const updateMove = updateMoveFactory({ webContents });
    const saveMove = saveMoveFactory({ updateMove, fs, fetch, exportURL, createCookiesString });

    authenticate().then(async (result) => {
        const [config, activityRecordsData, cookies] = result;
        const { UserId: userId } = config;
        const { token: authToken, activityRecordsBaseUrl: baseURL } = activityRecordsData;

        webContents.send('config', config);

        const moves = await fetchMoves(
            baseURL,
            userId,
            authToken,
            moment.utc().subtract(100, 'days').startOf('day'),
            moment.utc().endOf('day'),
        );

        moves.forEach((move) => { move.status = 'queued'; });
        webContents.send('initMoves', moves);

        await confirm();

        const folder = './downloads/';
        const format = 'tcx';

        parallelLimit(moves.map(move => async (cb) => {
            updateMove(move, { status: 'started' });
            await saveMove(move, { folder, format, cookies });
            updateMove(move, { status: 'done' });
            cb();
        }), 3);
    });
};
