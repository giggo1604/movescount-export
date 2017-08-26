const { session } = require('electron');

const baseURL = 'http://www.movescount.com';
const overviewURL = `${baseURL}/overview`;

function getCookie(url, name) {
    return new Promise((resolve, reject) => {
        session.defaultSession.cookies.get({ url, name }, (err, cookies) => {
            if (err) return reject(err);
            return resolve(cookies);
        });
    });
}

function authenticate(window) {
    const content = window.webContents;
    return new Promise((resolve) => {
        content.on('dom-ready', () => {
            if (content.getURL() === overviewURL) {
                const promises = [
                    content.executeJavaScript('window.suunto.Config'),
                    content.executeJavaScript('window._page._options.config.activityRecordsData'),
                    getCookie(baseURL),
                ];

                Promise.all(promises).then(resolve);
            }
        });

        window.loadURL(overviewURL);
    });
}

module.exports = authenticate;
