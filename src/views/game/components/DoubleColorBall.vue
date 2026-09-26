<script setup lang="ts" name="DoubleColorBall">
import { ref, onMounted, watch } from 'vue'
import axios from 'axios'
const gameNo = ref('1')
const log = ref<any[]>([])
const result = ref<any[]>([])
const before = ref('')
const after = ref('')
// const total = ref(0)
const pageSize = ref(10)
const currentPage = ref(1)
onMounted(() => {
  if (localStorage.getItem('pair-lotto')) {
    log.value = JSON.parse(localStorage.getItem('pair-lotto') as string)
  }
  initData()
})
watch(() => gameNo.value, (val) => {
  gameNo.value = val as string
  if (val === '1') {
    getSsq()
    currentPage.value = 1
    // total.value = 0
    result.value = []
  } else if (val === '2') {
    dlt()
    currentPage.value = 1
    // total.value = 0
    result.value = []
  }
})
const initData = () => {
  getSsq()
}
const getSsq = () => {
   axios({
      method: 'get',
      url: `/api/cwl_admin/front/cwlkj/search/kjxx/findDrawNotice?name=ssq&issueCount=&issueStart=&issueEnd=&dayStart=&dayEnd=&pageNo=${currentPage.value}&pageSize=${pageSize.value}&week=&systemType=PC`
    }).then(res => {
      // total.value = res.data.total
      result.value = result.value.concat(res.data.result.map((item:any) => ({
        ...item,
        redBlue: `${item.red.replace(/,/g,' ')} ${item.blue}`,
        before: item.red.split(','),
        after: item.blue.split(','),
        zjCode: ''
      }))) || []
    })
}
const dlt = () => {
  axios.get(`https://webapi.sporttery.cn/gateway/lottery/getHistoryPageListV1.qry?gameNo=85&provinceId=0&pageSize=${pageSize.value}&isVerify=1&pageNo=${currentPage.value}`).then(res => {
    if (res.data.success) {
      // total.value = res.data.value.total
      result.value = result.value.concat(res.data.value.list.map((item:any) => ({
        ...item,
        code: item.lotteryDrawNum,
        date: item.lotteryDrawTime,
        redBlue: item.lotteryDrawResult,
        before: item.lotteryDrawResult.split(' ').splice(0, 5),
        after: item.lotteryDrawResult.split(' ').splice(5),
        zjCode: ''
      }))) || []
    }
  })
}

const loadMore = () => {
  currentPage.value++
  if (gameNo.value === '1') {
    getSsq()
  } else if (gameNo.value === '2') {
    dlt()
  }
}

const queryNumber = (before: string, after: string) => {
  const beSet = new Set(before.match(/\d{2}/g))
  const afSet = new Set(after.match(/\d{2}/g))

  for (const item of result.value) {
    const zjCodeSet = [];
    
    // 检查 before 数组
    for (const val of item.before) {
      if (beSet.has(val)) zjCodeSet.push(val);
    }
    
    // 检查 after 数组
    for (const val of item.after) {
      if (afSet.has(val)) zjCodeSet.push(`<span style="color: red;">${val}</span>`);
    }
    
    item.zjCode = Array.from(zjCodeSet).join(',');
  }
}
const removeLog = (index: number) => {
  log.value.splice(index, 1)
  localStorage.setItem('pair-lotto', JSON.stringify(log.value))
}
const saveLog = () => {
  log.value.push(before.value + ',' + after.value)
  localStorage.setItem('pair-lotto', JSON.stringify(log.value))
}
</script>
<template>
  <div class="center">
    <el-row class="row-b10">
      <el-col :lg="6" :sm="12" :xs="12">
        <el-input v-model="before" placeholder="请输入前区号" class="input-with-select game_select" />
      </el-col>
      <el-col :lg="6" :sm="12" :xs="12">
        <el-input v-model="after" placeholder="请输入后区号" class="input-with-select game_select" />
      </el-col>
      <el-col :lg="6" :sm="12" :xs="12">
        <el-select
          class="_sel"
          v-model="gameNo"
          placeholder="请选择游戏"
          style="width: 100%"
        >
          <el-option label="双色球" value="1" />
          <el-option label="大乐透" value="2" />
        </el-select>
      </el-col>
      <el-button type="primary" icon="el-icon-search" @click="queryNumber(before, after)" />
    </el-row>
    <!-- 搜索和搜索历史记录 -->
    <el-row>
      <el-col :span="24" class="mb20">
        <ul class="ul">
          <li v-for="(item,index) in log" :key="index" class="li">
            <span>{{ item }}</span>
            <i class="el-icon-circle-close" @click="removeLog(index)"></i>
          </li>
        </ul>
      </el-col>
    </el-row>
    <el-table
      :data="result"
      :header-cell-style="{'text-align': 'center','padding': '5px 0'}"
      :cell-style="{'text-align':'center','padding': '5px 0'}"
      style="width: 100%;border: 1px solid #e3e3e3;">
      <el-table-column
        prop="code"
        label="期号">
      </el-table-column>
      <el-table-column
        label="开奖号码">
        <template #default="scope">
          <div style="color: dodgerblue;cursor: pointer;">{{scope.row.redBlue}}</div>
        </template>
      </el-table-column>
      <el-table-column
        prop="zjCode"
        label="中了"
      >
        <template #default="{row}">
          <div v-html="row.zjCode" />
        </template>
      </el-table-column>
      <el-table-column
        prop="date"
        label="开奖日期"
      ></el-table-column>
    </el-table>
    <div class="page">
      <!-- <el-pagination
        background
        layout="prev, pager, next"
        :total="total">
      </el-pagination> -->
      <div class="load-more" @click="loadMore">加载更多</div>
    </div>
    
  </div>
</template>
<style lang="scss" scoped>
.page{
  text-align: center;
  margin-top: 20px;
  cursor: pointer;
}
</style>