<script setup lang="ts" name="todolist">
import { computed, nextTick, ref } from 'vue'

interface TodoItem {
  id: number
  text: string
  done: boolean
}

type FilterType = 'all' | 'active' | 'completed'

const inputText = ref('')
const filter = ref<FilterType>('all')
const todos = ref<TodoItem[]>([
  { id: 1, text: '4号 中信银行 1999.41', done: false },
  { id: 2, text: '7号 金条 821.98 + 43.26', done: false },
  { id: 3, text: '10号 小鹏汽车 2974.31', done: false },
  { id: 4, text: '13号 微粒贷 1280.94', done: false },
  { id: 5, text: '13号 交通银行惠民贷 367.41 + 369.19 + 1752.71', done: false },
  { id: 6, text: '14号 借呗 7640.74', done: false },
  { id: 7, text: '24号 招商银行 5437.91 + 1723.06', done: false },
  { id: 8, text: '30号 金条 1396.25 + 13202', done: false }
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

// 正在编辑的待办 id 及其临时文本
const editingId = ref<number | null>(null)
const editingText = ref('')
const editInputRef = ref<HTMLInputElement>()

// 开始编辑（仅未完成事项可编辑）
const startEdit = (item: TodoItem) => {
  if (item.done) return
  editingId.value = item.id
  editingText.value = item.text
  nextTick(() => {
    editInputRef.value?.focus()
  })
}

// 保存编辑
const saveEdit = (item: TodoItem) => {
  if (editingId.value !== item.id) return
  const text = editingText.value.trim()
  if (text) {
    item.text = text
    editingId.value = null
  } else {
    // 内容为空则删除该待办
    removeTodo(item.id)
    editingId.value = null
  }
}

// 取消编辑
const cancelEdit = () => {
  editingId.value = null
  editingText.value = ''
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
        <template v-if="editingId === item.id">
          <el-input
            ref="editInputRef"
            v-model="editingText"
            class="todolist-item-input"
            size="small"
            @keyup.enter="saveEdit(item)"
            @keyup.esc="cancelEdit"
            @blur="saveEdit(item)"
          />
          <el-button type="primary" link @click="saveEdit(item)">保存</el-button>
          <el-button type="info" link @click="cancelEdit">取消</el-button>
        </template>
        <template v-else>
          <span
            class="todolist-item-text"
            :class="{ 'is-editable': !item.done }"
            @dblclick="startEdit(item)"
          >{{ item.text }}</span>
          <el-button
            v-if="!item.done"
            class="todolist-item-edit"
            type="primary"
            link
            @click="startEdit(item)"
          >
            编辑
          </el-button>
          <el-button
            class="todolist-item-delete"
            type="danger"
            link
            @click="removeTodo(item.id)"
          >
            删除
          </el-button>
        </template>
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

      &.is-editable {
        cursor: text;
      }
    }

    &-input {
      flex: 1;
      margin: 0 12px;
      font-size: 15px;
      color: #333;
    }

    &-edit,
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
