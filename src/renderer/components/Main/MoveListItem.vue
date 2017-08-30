<template>
    <li class="columns">
        <span class="column is-narrow">{{ move.MoveId }}</span>
        <span class="column">
            <span class="tag" :class="{
                'is-light': move.status === 'queued',
                'is-warning': move.status === 'started',
                'is-success': move.status === 'done'
            }"
            >
                <div v-if="move.status === 'started'" class="spinner" style="position: relative"></div>
                <span v-else >{{move.status}}</span>
            </span>
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
        &:spinner {
            position: relative;
        }
    }

    @keyframes spinner {
        to {transform: rotate(360deg);}
    }
    
    .spinner:before {
        content: '';
        box-sizing: border-box;
        position: absolute;
        top: calc(50% + 2px);
        left: calc(50% + 2px);
        width: 16px;
        height: 16px;
        margin-top: -10px;
        margin-left: -10px;
        border-radius: 50%;
        border: 2px solid #ccc;
        border-top-color: #333;
        animation: spinner .6s linear infinite;
    }
</style>
