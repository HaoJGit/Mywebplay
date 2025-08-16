<template>
  <div id="app">
    <homePages />
  </div>
</template>

<script setup>
import homePages from './view/homePages.vue'

// 定义组件名称
defineOptions({
  name: 'App'
})
</script>

<style>
#app {
  text-align: center;
  margin-top: 50px;
}
</style>