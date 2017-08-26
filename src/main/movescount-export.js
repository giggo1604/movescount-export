import fs from 'fs';
import fetch from 'node-fetch';
import moment from 'moment';

const exportBaseURL = 'http://www.movescount.com/move/export?';
const folder = './downloads/';

function saveMove(id, options) {
    const exportURL = `${exportBaseURL}id=${id}&format=tcx`;
    fetch(exportURL, options).then((res) => {
        res.body.pipe(fs.createWriteStream(`${folder}move-${id}.tcx`));
    });
}

async function movescountExport([config, activityRecordsData, cookies]) {
    const { UserId } = config;
    const { token, activityRecordsBaseUrl: baseUrl } = activityRecordsData;

    const startDateQuery = `startDateString=${moment.utc().subtract(100, 'days').startOf('day').toISOString()}`;
    const endDateQuery = `endDateString=${moment.utc().endOf('day').toISOString()}`;
    const userIdQuery = `userId=${UserId}`;

    const url = `${baseUrl}/moves/getmoves/?${startDateQuery}&${endDateQuery}&${userIdQuery}`;

    const result = await fetch(url, { headers: { Authorization: token } });
    const { Moves: moves } = await result.json();

    const cookiesString = cookies
        .map(cookie => `${cookie.name}=${cookie.value}`)
        .join('; ');

    const options = {
        headers: {
            Cookie: cookiesString,
        },
    };

    moves.map(m => m.MoveId).forEach(id => saveMove(id, options));
}

export default movescountExport;
