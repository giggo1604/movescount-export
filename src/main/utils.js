import { ipcMain } from 'electron'; // eslint-disable-line
import querystring from 'querystring';
import urlJoin from 'url-join';

const confirm = async () => new Promise(resolve => ipcMain.once('confirm', resolve));

const createURL = (base, path, queries = {}) =>
    urlJoin(base, path, Object.keys(queries).length ? `?${querystring.stringify(queries)}` : '');

const createCookiesString = cookies => cookies.map(c => `${c.name}=${c.value}`).join('; ');

const updateMoveFactory = ({ webContents }) => (move, updatedKeys = {}) => {
    Object.entries(updatedKeys).forEach(([key, value]) => {
        move[key] = value;
    });
    webContents.send('updateMove', move);
};

export {
    confirm,
    createURL,
    createCookiesString,
    updateMoveFactory,
};
