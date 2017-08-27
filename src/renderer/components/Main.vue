<template>
    <div id="wrapper">
        <nav class="navbar">
            <div class="navbar-brand">
                <a class="navbar-item" href="">movescount-export</a>
            </div>
        </nav>
        <main class="content">
            <ul>
                <move v-for="move in moves" :key="move.MoveId" :move="move"></move>
            </ul>
        </main>
    </div>
</template>

<script>
import MoveListItem from './Main/MoveListItem';
export default {
    name: 'main',
    data() {
        return {
            moves: [{
                MoveId: 1,
                progress: -1,
            }],
        };
    },
    created() {
        this.$electron.ipcRenderer.on('moves', this.log);
    },
    components: {
        move: MoveListItem,
    },
    methods: {
        log(event, moves) {
            this.moves = moves;
        },
    },
};
</script>

<style lang="scss">
.navbar {
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
}
</style>
