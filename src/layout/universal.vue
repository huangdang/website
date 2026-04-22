<script setup lang="ts" name="Universal">
import Navigation from '@/components/Navigation.vue';
import Footer from '@/components/Footer.vue';
import { RouterView } from 'vue-router';
</script>
<template>
  <div class="universal">
    <Navigation />
    <div class="main">
      <RouterView />
    </div>
    <Footer />
  </div>
</template>
<style lang="scss" scoped>
.universal{
  width: 100%;
  // height: 100%;
  min-height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  // flex: 1;
  height: 100%;
  .main{
    background-image: url('@/assets/images/pattern.png');
    height: 100%;
  }
}
</style>