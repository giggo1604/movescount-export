const { session } = require('electron');

const baseURL = 'http://www.movescount.com';
const overviewURL = `${baseURL}/overview`;

function authenticate(window) {
    const content = window.webContents;
    return new Promise((resolve, reject) => {
        content.on('dom-ready', async () => {
            if (content.getURL() === overviewURL) {
                const promises = [
                    content.executeJavaScript('window.suunto.Config'),
                    content.executeJavaScript('window._page._options.config.activityRecordsData'),
                    getCookie(baseURL)
                ];
    
                const result = await Promise.all(promises);
    
                resolve(result);
            }
        });

        window.loadURL(overviewURL);
    });
}

function getCookie(url, name) {
    return new Promise((resolve, reject) => {
        session.defaultSession.cookies.get({url, name}, (err, cookies) => {
            if(!err) return resolve(cookies);
            reject(err);
        });
    });
}

module.exports = authenticate;
