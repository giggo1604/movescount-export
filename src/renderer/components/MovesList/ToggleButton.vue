<template>
    <button class="button is-small download-format"
        @click="toggle({ format })"
        :class="{'is-outlined': !format.download, 'is-info': format.download}">
        {{ format.name }}
    </button>
</template>

<script>
import { mapMutations } from 'vuex';

export default {
    props: ['format'],
    methods: mapMutations({
        toggle: 'toggleFormat',
    }),
};
</script>
