import { ipcRenderer } from 'electron'; // eslint-disable-line

const state = {
    config: {
        formats: [
            { name: 'kml', download: true },
            { name: 'gpx', download: true },
            { name: 'xlsx', download: true },
            { name: 'fit', download: true },
            { name: 'tcx', download: true },
        ],
    },
};

const getters = {
    username: state => state.config.Username,
    formats: state => state.config.formats,
};

const mutations = {
    initConfig(state, config) {
        state.config = Object.assign({}, state.config, config);
    },
    toggleFormat(state, { format }) {
        format.download = !format.download;
    },
};

const actions = {
    initConfig({ commit }) {
        ipcRenderer.on('config', (event, config) => commit('initConfig', config));
    },
};

export default {
    state,
    getters,
    mutations,
    actions,
};
