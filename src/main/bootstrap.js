import { createWriteStream } from 'fs';
import { join } from 'path';
import fetch from 'node-fetch';
import moment from 'moment';
import { fetchMovesFactory, saveMoveFactory } from './movescount-export';
import { confirm, updateMoveFactory, createCookiesString, createURL } from './utils';
import downloadSchedulerFactory from './download-scheduler';
import authenticate from './authenticate';

async function bootstrap(webContents) {
    const exportURL = 'http://www.movescount.com/move/export';
    const fetchMovesPath = 'moves/getmoves';
    const format = 'tcx';

    const fetchMoves = fetchMovesFactory({ fetch, createURL });
    const updateMove = updateMoveFactory({ webContents });
    const saveMove = saveMoveFactory(
        { fetch, createWriteStream, createURL, createCookiesString, join, exportURL },
    );

    const [config, activityRecordsData, cookies] = await authenticate();
    const { UserId: userId } = config;
    const { token: authToken, activityRecordsBaseUrl: baseURL } = activityRecordsData;

    webContents.send('config', config);

    const moves = await fetchMoves(
        baseURL,
        fetchMovesPath,
        userId,
        authToken,
        moment.utc().subtract(10, 'years').startOf('day'),
        moment.utc().endOf('day'),
    );

    moves.forEach((move) => {
        move.status = 'queued';
    });

    webContents.send('initMoves', moves);

    const downloadScheduler = downloadSchedulerFactory({
        saveMove,
        updateMove,
        cookies,
        folder: './downloads/',
        limit: 3,
    });

    await confirm();

    downloadScheduler.push(moves.map(move => ({ move, format })));
}

export default bootstrap;
