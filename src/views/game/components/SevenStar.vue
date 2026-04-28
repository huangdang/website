<script setup lang="ts" name="SevenStar">
import axios from 'axios'
import { ref, reactive, onMounted } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import type { Action } from 'element-plus'
import {
  Search,
  BellFilled
} from '@element-plus/icons-vue'
const startTerm = ref<string>('') // 开始期号
const endTerm = ref<string>('') // 结束期号
const gameNo = ref<string>('04') // 游戏
const pageSize = ref<number>(10) // 条数
const searchLog = ref([]) // 搜索记录
const searchVal = ref<string>('') // 搜索记录
const totalNum = ref<number>(4) // 总数量
const currentPage = ref(1) // 当前页码
const pageTotal = ref(0) // 总页码
const code = ref([]) // 表格
const columns = ref([]) // 表格列
const randomNumStr = ref<any>([])
interface DomList {
  loading: boolean,
  maxnum: number,
  cur: any,
  arr: any[],
  show: boolean,
  placeholder: string
}
const domlist = reactive<DomList[]>([
  {
    loading: false,
    maxnum: 9,
    cur: null,
    arr: [],
    show: true,
    placeholder: '0~9'
  }, {
    loading: false,
    maxnum: 9,
    cur: null,
    arr: [],
    show: true,
    placeholder: '0~9'
  }, {
    loading: false,
    maxnum: 9,
    cur: null,
    arr: [],
    show: true,
    placeholder: '0~9'
  }, {
    loading: false,
    maxnum: 9,
    cur: null,
    arr: [],
    show: true,
    placeholder: '0~9'
  },
  {
    loading: false,
    maxnum: 9,
    cur: null,
    arr: [],
    show: true,
    placeholder: '0~9'
  }, {
    loading: false,
    maxnum: 9,
    cur: null,
    arr: [],
    show: true,
    placeholder: '0~9'
  }, {
    loading: false,
    maxnum: 14,
    cur: null,
    arr: [],
    show: true,
    placeholder: '0~14'
  }
]) // 随机数
console.log(domlist[0]?.arr, 2222)
const onSum = () => {
  // 随机数字转字符串
  let sumArr = []
  for (let i = 0; i < totalNum.value; i++) {
    sumArr.push(`${domlist[0]?.arr[i]??''}${domlist[1]?.arr[i]??''}${domlist[2]?.arr[i]??''}${domlist[3]?.arr[i]??''}${domlist[4]?.arr[i]??''}${domlist[5]?.arr[i]??''}${domlist[6]?.arr[i]??''}s`)
  }
  randomNumStr.value = sumArr
} // 计算
const onSearch = () => { } // 搜索
const onClear = () => { } // 清空
const onSearchLog = () => { } // 搜索记录

onMounted(() => {
  console.log('mounted')
  getQry('1')
})

// 接口联调
const gameNoType = ref<string>('')
const getQry = (num: string) => {
  console.log(num)
  if (gameNoType.value !== gameNo.value) {
    code.value = []
    gameNoType.value = gameNo.value
  }
  // 'https://webapi.sporttery.cn/gateway/lottery/getHistoryPageListV1.qry?gameNo=04&provinceId=0&pageSize=30&isVerify=1&pageNo=1'
  axios.get(`/api/gateway/lottery/getHistoryPageListV1.qry?gameNo=${gameNo.value}&provinceId=0&pageSize=30&isVerify=1&pageNo=${num}`).then(res => {
    console.log(res.data)
    code.value = code.value.concat(res.data.value.list.map((item: any) => {
      return {
        ...item,
        num: item.lotteryDrawResult.replaceAll(' ','')
      }
    }))
    pageTotal.value = res.data.value.total
  })
}
const queryNum = (val: string) => {
  let isReg = /^\d{5,9}[s]?$/i
  if (code.value.length == 0) {
    ElMessage.error('请选择游戏！')
    return false;
  }
  if (!isReg.test(val)) {
    ElMessage.error('5到9的数字！')
    return false;
  }
  // 缓存本地
  if (!/[s]/ig.test(val)) {
    // console.log('hove S')
    searchLog.value.push(val)
    searchLog.value = [...new Set(searchLog.value)]
    localStorage.setItem('log',JSON.stringify(searchLog.value))
  }
  let inpLen;
  let reg;
  let res;
  console.log(val.substring(0,5).split(''), '##########')
  if (val.length >= 8 ) {
    inpLen = val.substring(0,5).split('')
    inpLen[5] = val[val.length - 3]
    inpLen[6] = val[val.length - 2] + '' + val[val.length - 1]
  } else {
    inpLen = val.split('')
  }
  for (let i = 0; i < code.value.length; i++) {
    code.value[i].num = code.value[i].lotteryDrawResult
    res = code.value[i].num.split(' ')
    allGet(inpLen,res)
    for (let j = 0; j < inpLen.length; j++) {
      if (inpLen[j] == res[j]) {
        reg = new RegExp(inpLen[j])
        res[j] = res[j].replace(reg, `<span style="color: red">${inpLen[j]}</span>`)
      }
    }
    code.value[i].num = res.join('')
  }
}

const allGet = (a, b) => {
  if (a.join('').indexOf(b.join('')) >= 0) {
    ElMessageBox.alert(b.join(''), '恭喜您中头奖了！', {
      confirmButtonText: 'OK',
      callback: (action: Action) => {
        ElMessage({
          type: 'info',
          message: `action: ${action}`,
        })
      }
    });
  }
}

const removeLog = (index: number) => {
  console.log(index)
}
const onRandom = (totalNum: number, dom: any) => {
  console.log(totalNum, dom)
}
const onNext = (e: any, cur: number, key: number) => {
  console.log(e, cur, key)
}
const handleSizeChange = (val: number) => { }
const handleCurrentChange = (val: number) => { }

// 表格查看
const handleView = (row: any) => {
  const newWindow = window.open('about:blank', '_blank')
  // 设置新窗口标题
  newWindow.document.title = '正在跳转...'
  newWindow.document.write('加载中...')
  try {
    // 异步请求返回后填充 URL
    newWindow.location.href = row.drawPdfUrl
    newWindow.focus()
  } catch (error) {
    newWindow.close()
    alert('打开新窗口失败')
  }
}
// 加载更多
const loadMore = () => {
  getQry(String(currentPage.value++))
};
</script>
<template>
  <div class="center">
    <el-row class="row-b10">
      <el-col :lg="6" :sm="12" :xs="12">
        <el-input v-model="startTerm" placeholder="开始期号" />
      </el-col>
      <el-col :lg="6" :sm="12" :xs="12">
        <el-input v-model="endTerm" placeholder="结束期号" />
      </el-col>
      <el-col :lg="6" :sm="12" :xs="12">
        <el-select v-model="gameNo" class="_sel" placeholder="请选择游戏" style="width: 100%">
          <el-option label="七星彩" value="04" />
          <el-option label="排列五" value="350133" />
          <el-option label="大乐透" value="85" />
        </el-select>
      </el-col>
      <el-col :lg="6" :sm="12" :xs="12">
        <el-input
          v-model="pageSize"
          style="max-width: 600px"
          placeholder="请输入数量"
        >
          <template #append>
            <el-button type="primary" :icon="Search" @click="getQry('1')" />
          </template>
        </el-input>
      </el-col>
    </el-row>
    <!-- 搜索和搜索历史记录 -->
    <el-row>
      <el-col :span="24" class="mb20">
        <ul class="ul">
          <li v-for="(item, index) in searchLog" :key="index" class="li">
            <span @click="queryNum(item); searchVal = item">{{ item }}</span>
            <i class="el-icon-circle-close" @click.stop="removeLog(index)"></i>
          </li>
        </ul>
      </el-col>
    </el-row>
    <!-- 随机数 -->
    <el-row>
      <el-col :span="3" v-for="(dom, key) in domlist" :key="key">
        <el-button
          :loading="dom.loading"
          :icon="BellFilled"
          type="primary"
          size="small"
          class="radio0"
          style="width: 100%;padding: 7px 0;"
          @click="onRandom(totalNum, dom)" />
        <input
          type="text"
          v-model="dom.cur"
          ref="int"
          class="radio0 inp"
          :id="'inp' + key"
          :placeholder="dom.placeholder"
          @keydown="onNext($event, dom.cur, key)">
        <div class="col">
          <span v-for="(item, index) in dom.arr" :key="index">{{ item }}</span>
        </div>
      </el-col>
      <el-col :span="3">
        <el-button
          type="danger"
          size="small"
          class="radio0"
          style="width: 100%;padding: 7px 0;"
          @click="onSum">计算</el-button>
        <el-input v-model="totalNum" class="radio0" placeholder="条数" />
      </el-col>
    </el-row>
    <!-- 表格 -->
    <div style="margin-top: 20px;">
      <el-table :data="code" :header-cell-style="{ 'text-align': 'center', 'padding': '5px 0' }"
        :cell-style="{ 'text-align': 'center', 'padding': '5px 0' }" style="width: 100%">
        <el-table-column prop="lotteryDrawNum" label="期号">
        </el-table-column>
        <el-table-column>
          <template #header>
            <el-input v-model="searchVal" size="small" placeholder="输入号码,号码后面加“s”表示不缓存">
              <template #append>
                <el-button size="small" :icon="Search" @click="queryNum(searchVal)" />
              </template>
            </el-input>
          </template>
          <el-table-column label="开奖号码">
            <template #default="scope">
              <div v-html="scope.row.num"></div>
            </template>
          </el-table-column>
          <el-table-column prop="lotteryDrawTime" label="开奖日期">
          </el-table-column>
        </el-table-column>
        <el-table-column prop="drawPdfUrl" label="开奖公告">
          <template #default="scope">
            <div style="color: dodgerblue;cursor: pointer;" @click="handleView(scope.row)">查看</div>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
        :page-sizes="[10, 100, 200, 500, 1000]" :page-size="pageSize" layout="sizes" :total="pageTotal"
        style="text-align: center;margin-top: 15px;" />

      <!-- 加载更多 -->
      <div class="more" @click="loadMore">
        <span>加载更多</span>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.center {
  max-width: 1200px;
  width: 100%;
  margin: 20px auto 0;
}

.col {
  display: flex;
  flex-direction: column;
  text-align: center;
  align-items: center;

  span {
    display: flex;
    // width: 30px;
    // height: 30px;
    border-radius: 15px;
    // background: #f00;
    // margin: 10px 0;
    // line-height: 30px;
    margin-top: 10px;
    color: #f00;
    justify-content: center;
    align-items: center;
  }
}

.el-row {
  justify-content: center;

  .el-col {
    padding: 0 5px;

    &:nth-child(7) {
      span {
        // background: #00f;
        color: #00f;
      }
    }
  }
}

.border-lr {
  padding: 0 5px;
  border-left: 1px solid red;
  border-right: 1px solid red;
  margin-right: 5px;
}

:deep(.radio0) {
  border-radius: 0;

  .el-input__inner {
    border-radius: 0;
    height: 35px;
    line-height: 30px;
    text-align: center;
    padding: 0;
  }

  &.inp {
    .el-input__inner {
      border-top: 0;
      border-right: 0;
      border-left: 0;
      border-bottom: 1px solid rgb(0, 157, 255);
      padding: 0;
      background: transparent;
      width: 100%;
    }
  }

  &.inp {
    border-top: 0;
    border-right: 0;
    border-left: 0;
    border-bottom: 1px solid rgb(0, 157, 255);
    padding: 0;
    background: transparent;
    width: 100%;
    text-align: center;
    height: 35px;
    outline: none;
    font-size: 15px;
  }
}

.ul {
  padding: 0;
  margin: 0;

  .li {
    list-style-type: none;
    display: inline-block;
    margin-right: 12px;
    padding: 10px 0;
    color: #666;
    letter-spacing: .5px;
    font-size: 14px;

    i {
      margin-left: 7px;
      color: #F56C6C;
      cursor: pointer;
      -webkit-tap-highlight-color: transparent
    }

    span {
      cursor: pointer;
      -webkit-tap-highlight-color: transparent
    }
  }
}

:deep(.game_select) {
  .el-input-group__prepend {
    width: 125px;
    padding: 0;

    .el-select {
      margin: -1px;
    }
  }
}
</style>