<template>
    <main>
        <div class="config">
            Found {{moves.length}} {{moves.length > 1 ? 'moves' : 'move'}} / Downloaded {{downloadedMoves}}
            <button class="button is-primary" :disabled="moves.length === 0" @click="startDownload">Start Download</button>
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
            ipcRenderer.send('confirm');
        },
    },
    components: {
        MovesListItem,
    },
};
</script>

<style lang="scss">
main {
    div.config {
        background-color: #fff;
        padding: 32px 16px;
        box-shadow: 0 1px 0 rgba(0,0,0,0.12);
        &> button {
            margin-left: 30px;
            vertical-align: baseline;
        }
    }
    ul {
        list-style-type: none;
        margin: 16px;
    }
}
</style>
