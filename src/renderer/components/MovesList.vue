<template>
    <main>
        <div class="columns config">
            <div class="column">
                <span>Found {{moves.length}} {{moves.length > 1 ? 'moves' : 'move'}} / Downloaded {{downloadedMoves}}</span>
                <button class="button is-primary start-download" :disabled="moves.length === 0" @click="startDownload">Start Download</button>
            </div>
            <div class="column download-formats">
                <span>Format</span>
                <ToggleButton v-for="(format, index) in formats" :key="index" :format="format"></ToggleButton>
            </div>
        </div>
        <div class="columns lists">
            <div class="column">
                <ul>
                    <li class="subtitle is-5">Your Moves</li>
                    <MovesListItem v-for="(move, index) in moves" :key="index" :move="move"></MovesListItem>
                </ul>
            </div>
            <div class="column">
                <ul>
                    <li class="subtitle is-5">Download Tasks</li>
                    <MovesListItem v-for="(move, index) in moves" :key="index" :move="move"></MovesListItem>
                </ul>
            </div>
        </div>
    </main>
</template>

<script>
import { mapGetters } from 'vuex';
import { ipcRenderer } from 'electron'; // eslint-disable-line
import MovesListItem from './MovesList/MovesListItem';
import ToggleButton from './MovesList/ToggleButton';

export default {
    name: 'moveList',
    computed: mapGetters(['moves', 'downloadedMoves', 'formats']),
    methods: {
        startDownload() {
            ipcRenderer.send('confirm');
        },
    },
    components: {
        MovesListItem,
        ToggleButton,
    },
};
</script>

<style lang="scss">
main {
    div.config {
        background-color: #fff;
        padding: 32px 16px;
        box-shadow: 0 1px 0 rgba(0, 0, 0, 0.12);
        * {
            vertical-align: -webkit-baseline-middle;
        }
        .start-download {
            margin-left: 30px;
        }
    }

    .download-formats {
        >button {
            margin-left: 10px;
        }
    }
    div.lists {
        margin: 0;
    }

    ul {
        list-style-type: none;
    }
}
</style>
