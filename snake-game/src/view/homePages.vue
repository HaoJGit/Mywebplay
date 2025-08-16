<template>
  <div class="home-page">
    <!-- 顶部导航栏 -->
    <el-header class="header">
      <el-menu
        :default-active="activeIndex"
        class="navbar"
        mode="horizontal"
        @select="handleSelect"
      >
        <el-menu-item index="/">博客主页</el-menu-item>
        <el-menu-item index="/articles">文章</el-menu-item>
        <el-menu-item index="/websites">网站</el-menu-item>
      </el-menu>
    </el-header>

    <!-- 主要内容区域 -->
    <el-main class="main-content">
      <router-view></router-view>
    </el-main>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { defineOptions } from 'vue'

// 导出组件名称
defineOptions({
  name: 'HomePages'
})

// 获取路由相关信息
const route = useRoute()
const router = useRouter()


// 定义响应式数据
const activeIndex = ref(route.path)

// 监听路由变化，同步更新激活的菜单项
watch(
  () => route.path,
  (newPath) => {
    activeIndex.value = newPath
  }
)

// 处理菜单选择事件
const handleSelect = (key) => {
  router.push(key)
  activeIndex.value = key
  console.log('选中菜单项:', key)
}
</script>

<style scoped>
.home-page {
  min-height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  margin: 0;
  padding: 0;
}

.header {
  padding: 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  background-color: #fff;
  margin: 0;
}

.navbar {
  display: flex;
  justify-content: center;
  border-bottom: none;
}

.main-content {
  flex: 1;
  padding: 0;
  background-color: transparent;
  margin: 0;
}

.content-wrapper {
  text-align: center;
  max-width: 800px;
  padding: 2rem;
}

.content-wrapper h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: #303133;
}

.content-wrapper p {
  font-size: 1.2rem;
  margin-bottom: 2rem;
  color: #606266;
}
</style>