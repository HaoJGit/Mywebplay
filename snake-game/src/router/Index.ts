import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import BlogHome from '../components/BlogHome.vue'
import Articles from '../components/Articles.vue'
import ArticleDetail from '../components/ArticleDetail.vue'
import Websites from '../components/Websites.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'BlogHome',
    component: BlogHome,
    meta: {
      title: '博客主页'
    }
  },
  {
    path: '/articles',
    name: 'Articles',
    component: Articles,
    meta: {
      title: '文章列表'
    }
  },
  {
    path: '/articles/:id',
    name: 'ArticleDetail',
    component: ArticleDetail,
    meta: {
      title: '文章详情'
    }
  },
  {
    path: '/websites',
    name: 'Websites',
    component: Websites,
    meta: {
      title: '网站收藏'
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫 - 设置页面标题
router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title as string
  }
  next()
})

export default router