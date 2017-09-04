import querystring from 'querystring';
import moment from 'moment';
import urlJoin from 'url-join';
import { ipcMain } from 'electron'; // eslint-disable-line


const exportBaseURL = 'http://www.movescount.com/move/export?';
const folder = './downloads/';

const createURL = (base, path, queries) => urlJoin(base, path, `?${querystring.stringify(queries)}`);

const createCookiesString = cookies => cookies.map(c => `${c.name}=${c.value}`).join(', ');

const startDownload = async () => new Promise(resolve => ipcMain.on('startDownload', resolve));

const updateMoveFactory = ({ webContents }) => (move, updatedKeys = {}) => {
    Object.entries(updatedKeys).forEach(([key, value]) => {
        move[key] = value;
    });
    webContents.send('updateMove', move);
};

const saveMoveFactory = ({ updateMove, fetch, fs }) => (move, cookies) => async (cb) => {
    const { MoveId: id } = move;
    const exportURL = `${exportBaseURL}id=${id}&format=tcx`;
    const cookiesString = createCookiesString(cookies);
    console.log(cookiesString);
    updateMove(move, { status: 'started' });

    const result = await fetch(exportURL, { headers: { Cookie: cookiesString } });
    await result.body.pipe(fs.createWriteStream(`${folder}move-${id}.tcx`));

    updateMove(move, { status: 'done' });

    // the async lib needs a callback because our babel configuration is transpliling
    // async/await syntax; if this is fixed the async lib can handle this without the callback
    cb();
};

const fetchMovesFactory = ({ fetch }) => async (baseURL, userId, token) => {
    const url = createURL(baseURL, 'moves/getmoves', {
        userId,
        startDateString: moment.utc().subtract(100, 'days').startOf('day').toISOString(),
        endDateString: moment.utc().endOf('day').toISOString(),
    });

    const result = await fetch(url, { headers: { Authorization: token } });
    const json = await result.json();
    const moves = json.Moves;

    return moves;
};

export {
    startDownload,
    fetchMovesFactory,
    saveMoveFactory,
    updateMoveFactory,
};
