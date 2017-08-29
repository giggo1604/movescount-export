import fs from 'fs';
import fetch from 'node-fetch';
import moment from 'moment';
import { parallelLimit } from 'async';

const exportBaseURL = 'http://www.movescount.com/move/export?';
const folder = './downloads/';

let moves;
let content;

function updateStatus(id, status) {
    const move = moves.find(m => m.MoveId === id);
    move.status = status;
    content.send('moves', moves);
}

function addProgress(moves) {
    return moves.map((move) => {
        move.status = 'queued';
        move.progress = 0;
        return move;
    });
}

const saveMove = (id, options) => async (cb) => {
    updateStatus(id, 'started');
    const exportURL = `${exportBaseURL}id=${id}&format=tcx`;
    const result = await fetch(exportURL, options);
    await result.body.pipe(fs.createWriteStream(`${folder}move-${id}.tcx`));
    updateStatus(id, 'done');
    cb();
};

async function movescountExport(window, [config, activityRecordsData, cookies]) {
    content = window.webContents;
    const { UserId } = config;
    const { token, activityRecordsBaseUrl: baseUrl } = activityRecordsData;

    const startDateQuery = `startDateString=${moment.utc().subtract(100, 'days').startOf('day').toISOString()}`;
    const endDateQuery = `endDateString=${moment.utc().endOf('day').toISOString()}`;
    const userIdQuery = `userId=${UserId}`;

    const url = `${baseUrl}/moves/getmoves/?${startDateQuery}&${endDateQuery}&${userIdQuery}`;

    const result = await fetch(url, { headers: { Authorization: token } });
    const resultJson = await result.json();

    moves = resultJson.Moves;

    window.webContents.send('moves', addProgress(moves));

    const cookiesString = cookies
        .map(cookie => `${cookie.name}=${cookie.value}`)
        .join('; ');

    const options = {
        headers: {
            Cookie: cookiesString,
        },
    };

    const downloadTasks = moves.map(m => saveMove(m.MoveId, options));

    parallelLimit(downloadTasks, 3);
}

export default movescountExport;
