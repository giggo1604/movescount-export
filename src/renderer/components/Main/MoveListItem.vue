<template>
    <li>
        {{ move.MoveId }}, {{move.status}}
    </li>
</template>

<script>
export default {
    props: ['move'],

};
</script>

<style lang="scss" scoped>

</style>
