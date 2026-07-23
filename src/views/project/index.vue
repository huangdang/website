<script setup lang="ts" name="index">
import { useRouter } from 'vue-router'
import { ref } from 'vue'

const router = useRouter()
const projects = ref([
  { id: 1, name: 'todolist', description: '一个简单的待办事项列表', link: 'Detail' },
])
const jumpToDetail = (link: string) => {
  console.log(link)
  router.push({ name: link })
}
</script>
<template>
  <div>
    <h2>项目列表</h2>
    <div v-for="project in projects" :key="project?.id">
      <h3>{{ project?.name }}</h3>
      <p>{{ project?.description }}</p>
      <a href="javascript:void(0)" @click="jumpToDetail(project?.link)">查看详情</a>
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