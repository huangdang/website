<script setup lang="ts" name="todolist">
import { computed, ref } from 'vue'

interface TodoItem {
  id: number
  text: string
  done: boolean
}

type FilterType = 'all' | 'active' | 'completed'

const inputText = ref('')
const filter = ref<FilterType>('all')
const todos = ref<TodoItem[]>([
  { id: 1, text: '4号 中信银行', done: true },
  { id: 2, text: '7号 金条', done: false },
  { id: 3, text: '13号 微粒贷', done: false },
  { id: 4, text: '13号 交通银行惠民贷', done: false },
  { id: 5, text: '14号 借呗', done: false },
  { id: 6, text: '24号 招商银行', done: false },
  { id: 7, text: '30号 金条', done: false }
])

// 过滤后的列表
const filteredTodos = computed(() => {
  switch (filter.value) {
    case 'active':
      return todos.value.filter((item) => !item.done)
    case 'completed':
      return todos.value.filter((item) => item.done)
    default:
      return todos.value
  }
})

// 未完成数量
const activeCount = computed(() => todos.value.filter((item) => !item.done).length)

// 是否全部完成
const allDone = computed({
  get: () => todos.value.length > 0 && activeCount.value === 0,
  set: (val: boolean) => {
    todos.value.forEach((item) => {
      item.done = val
    })
  }
})

// 新增待办
const addTodo = () => {
  const text = inputText.value.trim()
  if (!text) return
  todos.value.unshift({
    id: Date.now(),
    text,
    done: false
  })
  inputText.value = ''
}

// 删除待办
const removeTodo = (id: number) => {
  todos.value = todos.value.filter((item) => item.id !== id)
}

// 清除已完成
const clearCompleted = () => {
  todos.value = todos.value.filter((item) => !item.done)
}
</script>

<template>
  <div class="todolist">
    <h2 class="todolist-title">待办事项</h2>

    <div class="todolist-input">
      <el-input
        v-model="inputText"
        placeholder="添加一个待办事项，回车确认"
        clearable
        @keyup.enter="addTodo"
      />
      <el-button type="primary" @click="addTodo">添加</el-button>
    </div>

    <div class="todolist-toolbar">
      <el-checkbox v-model="allDone" :disabled="todos.length === 0">全选</el-checkbox>
      <el-radio-group v-model="filter" size="small">
        <el-radio-button value="all">全部</el-radio-button>
        <el-radio-button value="active">进行中</el-radio-button>
        <el-radio-button value="completed">已完成</el-radio-button>
      </el-radio-group>
    </div>

    <ul class="todolist-items">
      <li
        v-for="item in filteredTodos"
        :key="item.id"
        class="todolist-item"
        :class="{ 'is-done': item.done }"
      >
        <el-checkbox v-model="item.done" />
        <span class="todolist-item-text">{{ item.text }}</span>
        <el-button
          class="todolist-item-delete"
          type="danger"
          link
          @click="removeTodo(item.id)"
        >
          删除
        </el-button>
      </li>
      <li v-if="filteredTodos.length === 0" class="todolist-empty">暂无待办事项</li>
    </ul>

    <div class="todolist-footer">
      <span>剩余 {{ activeCount }} 项未完成</span>
      <el-button type="info" link @click="clearCompleted">清除已完成</el-button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.todolist {
  max-width: 560px;
  margin: 0 auto;
  padding: 24px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);

  &-title {
    margin: 0 0 16px;
    font-size: 20px;
    color: #333;
    text-align: center;
  }

  &-input {
    display: flex;
    gap: 8px;
    margin-bottom: 16px;
  }

  &-toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;
  }

  &-items {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  &-item {
    display: flex;
    align-items: center;
    padding: 10px 4px;
    border-bottom: 1px solid #f0f0f0;

    &-text {
      flex: 1;
      margin: 0 12px;
      font-size: 15px;
      color: #333;
      word-break: break-all;
    }

    &-delete {
      flex-shrink: 0;
    }

    &.is-done .todolist-item-text {
      color: #bbb;
      text-decoration: line-through;
    }
  }

  &-empty {
    padding: 24px 0;
    color: #999;
    text-align: center;
    list-style: none;
  }

  &-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 16px;
    font-size: 14px;
    color: #666;
  }
}
</style>
