import { ipcRenderer } from 'electron'; // eslint-disable-line

const state = {
    config: {},
};

const getters = {
    username: state => state.config.Username,
};

const mutations = {
    initConfig(state, config) {
        state.config = config;
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
