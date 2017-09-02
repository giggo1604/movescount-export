import fs from 'fs';
import querystring from 'querystring';
import fetch from 'node-fetch';
import moment from 'moment';
import urlJoin from 'url-join';
import { parallelLimit } from 'async';

const exportBaseURL = 'http://www.movescount.com/move/export?';
const folder = './downloads/';

function addStatus(moves) {
    return moves.map((move) => {
        move.status = 'queued';
        return move;
    });
}

const createURL = (base, path, config) => urlJoin(base, path, `?${querystring.stringify(config)}`);

const updateMoveFactory = ({ webContents }) => (move) => {
    webContents.send('updateMove', move);
};

const saveMoveFactory = ({ updateMove }) => (move, options) => async (cb) => {
    const { MoveId: id } = move;
    move.status = 'started';
    updateMove(move);
    const exportURL = `${exportBaseURL}id=${id}&format=tcx`;
    const result = await fetch(exportURL, options);
    await result.body.pipe(fs.createWriteStream(`${folder}move-${id}.tcx`));
    move.status = 'done';
    updateMove(move);
    cb();
};

const movescountExportFactory = ({ webContents }) => {
    const updateMove = updateMoveFactory({ webContents });
    const saveMove = saveMoveFactory({ updateMove });

    return async (config, activityRecordsData, cookies) => {
        const { UserId: userId } = config;
        const { token, activityRecordsBaseUrl: baseURL } = activityRecordsData;

        const url = createURL(baseURL, 'moves/getmoves', {
            userId,
            startDateString: moment.utc().subtract(100, 'days').startOf('day').toISOString(),
            endDateString: moment.utc().endOf('day').toISOString(),
        });

        const result = await fetch(url, { headers: { Authorization: token } });
        const json = await result.json();
        const moves = json.Moves;

        webContents.send('initMoves', addStatus(moves));

        const cookiesString = cookies
            .map(cookie => `${cookie.name}=${cookie.value}`)
            .join('; ');

        const options = {
            headers: {
                Cookie: cookiesString,
            },
        };

        const downloadTasks = moves.map(m => saveMove(m, options));

        parallelLimit(downloadTasks, 3);
    };
};

export default movescountExportFactory;
