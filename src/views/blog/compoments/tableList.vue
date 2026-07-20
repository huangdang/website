<script setup>
const emit = defineEmits({
    click: (data) => {
        return !!(data.name && data.age)
    },
})

const onclicktable = () => {
    emit('click', { name: 'tableList', age: 18 })
}
defineExpose({ onclicktable })
</script>
<template>
    <div @click="onclicktable">tableList</div>
</template>
<style></style>

