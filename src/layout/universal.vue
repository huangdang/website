<script setup lang="ts" name="Universal">
import Navigation from '@/components/Navigation.vue';
import Footer from '@/components/Footer.vue';
import { RouterView } from 'vue-router';
const clickTop = (data: { name: string, age: number }) => {
  console.log('clickTop', data)
}

</script>
<template>
  <div class="universal">
    <Navigation @click-top="clickTop" />
    <div class="main">
      <RouterView />
    </div>
    <Footer />
  </div>
</template>
<style lang="scss" scoped>
.universal{
  width: 100%;
  min-height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-image: url('@/assets/images/pattern.png');
  .main{
    // background-image: url('@/assets/images/pattern.png');
    flex: 1;
    max-width: 1400px;
    width: 100%;
    margin: 20px auto;
  }
}
</style>