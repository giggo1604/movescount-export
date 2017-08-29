<template>
    <main>
        <div class="config">
            Found {{moves.length}} {{moves.length > 1 ? 'moves' : 'move'}} / Downloaded {{downlodedMoves}}
        </div>
        <ul>
            <move v-for="move in moves" :key="move.MoveId" :move="move"></move>
        </ul>
    </main>
</template>

<script>
import MoveListItem from './Main/MoveListItem';

export default {
    name: 'main',
    data() {
        return {
            downlodedMoves: 0,
            moves: [{
                MoveId: 1,
                status: 'queued',
            },
            {
                MoveId: 12,
                status: 'started',
            },
            {
                MoveId: 123,
                status: 'done',
            }],
        };
    },
    created() {
        this.$electron.ipcRenderer.on('moves', this.updateMoves);
    },
    components: {
        move: MoveListItem,
    },
    methods: {
        updateMoves(event, moves) {
            this.moves = moves;
            this.downlodedMoves = moves
                .filter(m => m.status === 'done')
                .length;
        },
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
