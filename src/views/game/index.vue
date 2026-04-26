<script setup lang="ts" name="Game">
import { ref, markRaw } from 'vue';
import type { TabsPaneContext } from 'element-plus';
import SevenStar from './components/SevenStar.vue';
import DoubleColorStar from './components/DoubleColorBall.vue';
import Plw from './components/Plw.vue';
import Calc from './components/Calc.vue';

const activeName = ref<string>('DoubleColorStar')

interface GameType {
  label: string;
  name: string;
  component: any;
}
const gameTypes = ref([
  {
    label:'双色球',
    name: 'DoubleColorStar',
    component: markRaw(DoubleColorStar)
  },
  {
    label: '七星彩',
    name: 'SevenStar',
    component: markRaw(SevenStar)
  },
  {
    label: '排列三/五',
    name: 'Plw',
    component: markRaw(Plw)
  },
  {
    label: '计算',
    name: 'Calc',
    component: markRaw(Calc)
  }
] as const satisfies readonly GameType[])
const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab, event)
}
</script>
<template>
  <div class="game-tabs">
    <el-tabs
      v-model="activeName"
      class="demo-tabs"
      @tab-click="handleClick"
    >
      <el-tab-pane
        v-for="(tab, index) in gameTypes"
        :key="index"
        :label="tab.label"
        :name="tab.name">
        <div class="tab-content">
          <component
            :is="tab.component"
          />
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<style lang="scss" scoped>
.game-tabs{
  width: 100%;
  max-width: 1200px;
  margin: 20px auto 20px;
  padding: 10px 10px 0;
  box-sizing: border-box;
  height: 100%;
}
</style>
<style>
:root {
  --base-font-size: 16px;
}
p {
  /* font-size: clamp(var(--base-font-size), 5vw, var(--base-font-size * 1.25)); */
  padding: 0;
}
</style>