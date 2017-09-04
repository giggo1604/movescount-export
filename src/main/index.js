import { app, BrowserWindow } from 'electron'; // eslint-disable-line
import fs from 'fs';
import fetch from 'node-fetch';
import { parallelLimit } from 'async';
import { fetchMovesFactory, saveMoveFactory, updateMoveFactory, startDownload } from './movescount-export';

import authenticate from './authenticate';

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\'); // eslint-disable-line
}

let mainWindow;
const winURL = process.env.NODE_ENV === 'development'
    ? 'http://localhost:9080'
    : `file://${__dirname}/index.html`;


function bootstrap(webContents) {
    const fetchMoves = fetchMovesFactory({ fetch });
    const updateMove = updateMoveFactory({ webContents });
    const saveMove = saveMoveFactory({ updateMove, fs, fetch });

    authenticate().then(async (result) => {
        const [config, activityRecordsData, cookies] = result;
        const { UserId: userId } = config;
        const { token, activityRecordsBaseUrl: baseURL } = activityRecordsData;

        webContents.send('config', config);

        const moves = await fetchMoves(
            baseURL,
            userId,
            token,
        );

        moves.forEach((move) => { move.status = 'queued'; });
        webContents.send('initMoves', moves);

        await startDownload();

        parallelLimit(moves.map(m => saveMove(m, cookies)), 3);
    });
}

function createWindow() {
    /**
     * Initial window options
     */
    mainWindow = new BrowserWindow({
        width: 1920,
        height: 1080,
        useContentSize: true,
    });

    mainWindow.loadURL(winURL);

    mainWindow.on('closed', () => {
        mainWindow = null;
    });

    bootstrap(mainWindow.webContents);
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    }
});

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
*/
