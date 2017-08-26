const fs = require('fs');
const fetch = require('node-fetch');

const exportBaseURL = 'http://www.movescount.com/move/export?';
const folder = './downloads/';

async function movescountExport([config, activityRecordsData, cookies]) {
    const {UserId} = config;
    const {token, activityRecordsBaseUrl: baseUrl} = activityRecordsData;

    const startDateQuery = 'startDateString=2017-07-27T00:00:00.000Z';
    const endDateQuery= 'endDateString=2017-08-25T23:59:59.999Z';
    const userIdQuery = `userId=${UserId}`

    const url = `${baseUrl}/moves/getmoves/?${startDateQuery}&${endDateQuery}&${userIdQuery}`;

    const result = await fetch(url, { headers: { Authorization: token } });
    const {Moves: moves} = await result.json();

    cookies = cookies
        .map(cookie => `${cookie.name}=${cookie.value}`)
        .join('; ');

    const options = {
        headers: {
            Cookie: cookies
        }
    };

    moves.map(m => m.MoveId).forEach(id => saveMove(id, options));
}

function saveMove(id, options) {
    const exportURL = `${exportBaseURL}id=${id}&format=tcx`;
    fetch(exportURL, options).then(res => {
        res.body.pipe(fs.createWriteStream(`${folder}move-${id}.tcx`));
    });
}

module.exports = movescountExport;
