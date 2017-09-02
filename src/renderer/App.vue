<template>
    <div id="app">
        <nav class="navbar">
            <div class="navbar-brand">
                <a class="navbar-item" href="https://github.com/giggo1604/movescount-export" @click="openInBrowser">movescount-export</a>
            </div>
            <router-link class="navbar-item" to="/movesList">MovesList</router-link>
            <router-link class="navbar-item" to="/auth">Auth</router-link>
            <div class="navbar-end">
                <span class="navbar-item">{{ username }}</span>
            </div>
        </nav>
        <router-view></router-view>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
    name: 'movescount-export',
    computed: {
        ...mapGetters(['username']),
    },
    methods: {
        openInBrowser(e) {
            e.preventDefault();
            this.$electron.shell.openExternal(e.target.href);
        },
    },
};
</script>

<style lang="scss">
@import "~bulma/css/bulma.css";

.navbar {
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
}
</style>
