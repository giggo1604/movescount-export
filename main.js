const { app, BrowserWindow } = require('electron');
const path = require('path');
const url = require('url');

const movescountExport = require('./src/main/movescount-export');
const authenticate = require('./src/main/authenticate');

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({ width: 800, height: 800 });

    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'src/renderer/index.html'),
        protocol: 'file:',
        slashes: true,
    }));

    mainWindow.on('closed', () => {
        mainWindow = null;
    });

    authenticate().then(movescountExport);
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
