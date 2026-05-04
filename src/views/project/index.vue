<script setup lang="ts" name="index">
import { ref } from 'vue'
const projects = ref([
  { id: 1, name: '项目1', description: '这是项目1' },
  { id: 2, name: '项目2', description: '这是项目2' },
  { id: 3, name: '项目3', description: '这是项目3' },
  { id: 4, name: '项目4', description: '这是项目4' }
])
</script>
<template>
  <div>
    <h2>项目列表</h2>
    <div v-for="project in projects" :key="project?.id">
      <h3>{{ project?.name }}</h3>
      <p>{{ project?.description }}</p>
    </div>
  </div>
</template>
<style lang="scss" scoped>
  .project-list {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  .project-list div {
    margin: 16px 0;
  }
  .project-list h3 {
    font-size: 1.2em;
    margin-bottom: 8px;
  }
  .project-list p {
    font-size: 0.9em;
    color: #666;
  }

</style>