<template>
    <main>
        <div class="config">
            Found {{moves.length}} {{moves.length > 1 ? 'moves' : 'move'}} / Downloaded {{downloadedMoves}}
            <button class="button is-primary" @click="startDownload">Start</button>
        </div>
        <ul>
            <MovesListItem v-for="move in moves" :key="move.MoveId" :id="move.MoveId"></MovesListItem>
        </ul>
    </main>
</template>

<script>
import { mapGetters } from 'vuex';
import { ipcRenderer } from 'electron'; // eslint-disable-line
import MovesListItem from './MovesList/MovesListItem';

export default {
    name: 'moveList',
    computed: mapGetters(['moves', 'downloadedMoves']),
    methods: {
        startDownload() {
            ipcRenderer.send('startDownload');
        },
    },
    components: {
        MovesListItem,
    },
};
</script>

<style lang="scss">
main {
    .config {
        margin: 16px;
    }
    ul {
        list-style-type: none;
        margin: 16px;
    }
}
</style>
