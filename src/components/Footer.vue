<script setup lang="ts" name="footer">
  import { ref } from 'vue'
  import { useRoute } from 'vue-router'
  const route = useRoute()
  const bgColor = ref('#f5f5f5')
  const textColor = ref('#333')
  const aboutMe = () => {}
  const onopen = (url: string) => {
    window.open(url, '_blank') 
  }
</script>
<template>
  <!-- 底部说明 -->
  <div class="bottom" :style="{
    backgroundColor: bgColor,
    color: textColor,
    'backdrop-filter': route.path === '/' ? 'blur(8px)' : 'none',
    'background-color': route.path === '/'? 'transparent' : '#324057'
  }">
    <span class="call-me" @click="aboutMe">联系我</span>
    <span class="call-me" @click="onopen('https://gitee.com/enterprises?invite_code=Z2l0ZWUtODM3Mzg2OA%3D%3D')">码云企业版</span>
    <span class="call-me">&copy;咸淡小站</span>
    <span class="call-me" @click="onopen('https://beian.miit.gov.cn/')">琼ICP备2024025078号</span>
  </div>
</template>
<style lang="scss" scoped>
.bottom{
  height: 56px;
  // background: #f5f5f5;
  margin-top: 20px;
  text-align: center;
  line-height: 56px;
  position: relative;
  z-index: 999;
  color: #fff;
  a,span{
    text-decoration: underline;
    margin-right: 10px;
    display: inline-block;
    &.call-me{
      cursor: pointer;
      color: #fff;
    }
  }
}
</style>