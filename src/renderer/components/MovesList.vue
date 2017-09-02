<template>
    <main>
        <div class="config">
            Found {{moves.length}} {{moves.length > 1 ? 'moves' : 'move'}} / Downloaded {{downloadedMoves}}
        </div>
        <ul>
            <MovesListItem v-for="move in moves" :key="move.MoveId" :id="move.MoveId"></MovesListItem>
        </ul>
    </main>
</template>

<script>
import { mapGetters } from 'vuex';
import MovesListItem from './MovesList/MovesListItem';

export default {
    name: 'moveList',
    computed: mapGetters(['moves', 'downloadedMoves']),
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
