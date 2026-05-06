<script setup lang="ts" name="index">
</script>
<template>
  <div>
    <h2>日志</h2>
    <div v-for="log in 3" :key="log" class="log-list">
      <div class="log-list-line">
        <span class="tip"></span>
      </div>
      <div class="log-list-content">
        <div class="log-list-date">2023-04-01</div>
        <div class="log-list-info">
          <!-- <span class="tip"></span> -->
          <div class="log-list-info-title">修复七星组件中的类型和逻辑问题</div>
          <div class="log-list-info-content">修复七星组件中的类型和逻辑问题
          移除多余的调试日志输出，优化控制台打印信息，统一请求参数gameNo使用gameNo.value确保一致性，
          定义变量类型，提高代码类型安全性和可读性，
          修正allGet函数参数类型，确保传入字符串数组，
          优化新窗口打开逻辑，避免null异常，添加类型断言，
          修改分页加载逻辑，修正currentPage自增顺序，
          注释掉大乐透选项，避免误选导致问题，
          优化数据映射过程，正确处理替换空格的num字段</div>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.log-list {
  display: flex;
  &-line {
    width: 4px;
    background-color: #324057;
    margin-right: 32px;
    position: relative;
    .tip {
      position: absolute;
      top: 11px;
      left: 4px;
      border: 8px solid transparent;
      border-left-color: #324057;
      width: 0;
      height: 0;
      display: inline-block;
    }
  }
  &-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    position: relative;
    margin: 10px 0 16px;
    .log-list-date {
      font-size: 16px;
      color: #666;
      margin-bottom: 8px;
    }
    .log-list-info {
      display: flex;
      flex-direction: column;
      padding: 15px;
      background: #fff;
      border: 1px solid #324057;
      border-radius: 4px;
      position: relative;
      letter-spacing: 1px;
      .log-list-info-title {
        font-size: 16px;
        font-weight: bold;
        margin-bottom: 8px;
        color: #333;
      }
      .log-list-info-content {
        font-size: 16px;
        color: #666;
        text-indent: 2em;
        line-height: 1.8;
        white-space: pre-wrap;
        text-indent: 2em;
      }
    }
  }
}
</style>