<script setup lang="ts" name="navigation">
  import { ref, onMounted } from 'vue'
  import { useRoute } from 'vue-router'
  const route = useRoute()

  const refNav = ref(null)

  onMounted(() => {
    console.log()
  })
  // watch(() => route.path, (newPath) => {
  //   console.log(newPath)
  //   console.log(refNav.value)
  //   refNav.value?.style
  //   // refNav.value?.style['backdrop-filter'] = newPath === '/' ? 'blur(8px)' : 'none'
  //   // refNav.value?.style.backgroundColor = newPath === '/'? '#324057' : 'transparent'
  // }, { immediate: true })
</script>
<template>
  <div ref="refNav" class="navigation" :style="{
    'backdrop-filter': route.path === '/' ? 'blur(8px)' : 'none',
    'background-color': route.path === '/'? 'transparent' : '#324057'
  }">
    <div class="navigation_cont">
      <span>
        <router-link to="/">
          首页
        </router-link>
      </span>
      <span>
        <router-link to="/game">
          游戏
        </router-link>
      </span>
      <span>
        <router-link to="/project">
          项目
        </router-link>
      </span>
      <span>
        <router-link to="/blog">
          博客
        </router-link>
      </span>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.navigation{
  height: 56px;
  // background: #324057;
  // backdrop-filter: blur(8px);
  position: sticky;
  top: 0;
  left: 0;
  z-index: 999;
  flex: 0 0 56px;
  &_cont{
    height: 100%;
    max-width: 1200px;
    margin: 0 auto;
    width: 100%;
    display: flex;
    align-items: center;
    span{
      margin-right: 25px;
      a{
        color: #fff;
        font-size: 16px;
        &:hover{
          color: #1890ff;
        }
      }
    }
  }
}
</style>