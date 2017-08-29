<template>
    <li class="columns">
        <span class="column is-2">{{ move.MoveId }}</span>
        <span class="column">
            <span class="tag" :class="{
                'is-light': move.status === 'queued',
                'is-warning': move.status === 'started',
                'is-success': move.status === 'done'
            }">{{move.status}}</span>
        </span>
    </li>
</template>

<script>
export default {
    props: ['move'],
};
</script>

<style lang="scss" scoped>
    .columns:not(:last-child) {
        margin: 0;
    };
    li {
        margin: 0;
        border-bottom: 1px solid #e7e7e7;
        &:first-of-type {
            border-top: 1px solid #e7e7e7;
        }
    }
    span.tag {
        width: 60px;
    }
</style>
