const { app, BrowserWindow } = require('electron');

const movescountExport = require('./src/movescount-export');
const authenticate = require('./src/authenticate');

let mainWindow;

async function createWindow() {
    mainWindow = new BrowserWindow({ width: 800, height: 600 });

    const result = await authenticate(mainWindow);
    movescountExport(result);

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
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
