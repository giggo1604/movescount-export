const state = {
    downloaded: 0,
    moves: [],
};

const mutations = {
    updateMoves(state, moves) {
        state.moves = moves;
        state.downloaded = moves
            .filter(m => m.state === 'done').length;
    },
};

const actions = {
    someAsyncTask({ commit }) {
    // do something async
        commit('updateMoves');
    },
};

export default {
    state,
    mutations,
    actions,
};
