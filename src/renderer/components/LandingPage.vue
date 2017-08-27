<template>
    <div id="wrapper">
        <h1 class="main-header">movescount-export</h1>
        <main>
            <ul>
                <li v-for="move in moves">
                    {{ move.MoveId }}
                </li>
            </ul>
        </main>
    </div>
</template>

<script>
export default {
    name: 'landing-page',
    data() {
        return { moves: [5] };
    },
    created() {
        this.$electron.ipcRenderer.on('moves', this.log);
    },
    methods: {
        log(event, moves) {
            console.log(moves);
            this.moves = moves;
        },
    },
};
</script>

<style land="scss">

</style>
