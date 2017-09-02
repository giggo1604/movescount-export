import { ipcRenderer } from 'electron'; // eslint-disable-line

const state = {
    moves: [],
};

const getters = {
    moves: state => state.moves,
    downloadedMoves: state => state.moves.filter(m => m.status === 'done').length,
    getMoveById: state => id => state.moves.find(m => m.MoveId === id),
};

const mutations = {
    initMoves(state, moves) {
        state.moves = moves;
    },
    updateMove(state, move) {
        const index = state.moves.findIndex(m => m.MoveId === move.MoveId);
        state.moves.splice(index, 1, move);
    },
};

const actions = {
    initMoves({ commit }) {
        ipcRenderer.on('initMoves', (event, moves) => commit('initMoves', moves));
        ipcRenderer.on('updateMove', (event, move) => commit('updateMove', move));
    },
};

export default {
    state,
    getters,
    mutations,
    actions,
};
