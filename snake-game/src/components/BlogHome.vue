<template>
  <div class="blog-home">
    <!-- 欢迎区域 -->
    <div class="hero-section">
      <div class="hero-content">
        <h1 class="hero-title">欢迎来到我的博客</h1>
        <p class="hero-subtitle">分享技术、生活和创意的空间</p>
        <div class="hero-actions">
          <el-button type="primary" size="large" @click="goToArticles">
            浏览文章
          </el-button>
          <el-button size="large" @click="goToWebsites">
            查看网站
          </el-button>
        </div>
      </div>
    </div>

    <!-- 特色内容区域 -->
    <div class="featured-section">
      <div class="container">
        <h2 class="section-title">特色内容</h2>
        
        <!-- 最新文章 -->
        <div class="featured-articles">
          <h3>最新文章</h3>
          <div class="articles-grid">
            <el-card 
              v-for="article in latestArticles" 
              :key="article.id" 
              class="article-card"
              shadow="hover"
              @click="goToArticle(article.id)"
            >
              <div class="article-image">
                <img :src="article.image" :alt="article.title">
              </div>
              <div class="article-content">
                <h4>{{ article.title }}</h4>
                <p>{{ article.excerpt }}</p>
                <div class="article-meta">
                  <span class="date">{{ article.date }}</span>
                  <span class="category">{{ article.category }}</span>
                </div>
              </div>
            </el-card>
          </div>
        </div>

        <!-- 推荐网站 -->
        <div class="featured-websites">
          <h3>推荐网站</h3>
          <div class="websites-grid">
            <el-card 
              v-for="website in featuredWebsites" 
              :key="website.id" 
              class="website-card"
              shadow="hover"
            >
              <div class="website-icon">
                <el-avatar :size="48" :src="website.icon">
                  {{ website.name.charAt(0).toUpperCase() }}
                </el-avatar>
              </div>
              <div class="website-info">
                <h4>{{ website.name }}</h4>
                <p>{{ website.description }}</p>
                <el-button 
                  type="primary" 
                  size="small" 
                  @click="visitWebsite(website.url)"
                >
                  访问
                </el-button>
              </div>
            </el-card>
          </div>
        </div>
      </div>
    </div>

    <!-- 统计信息 -->
    <div class="stats-section">
      <div class="container">
        <div class="stats-grid">
          <div class="stat-item">
            <div class="stat-number">{{ stats.articles }}</div>
            <div class="stat-label">文章总数</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">{{ stats.websites }}</div>
            <div class="stat-label">网站收藏</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">{{ stats.views }}</div>
            <div class="stat-label">总浏览量</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

// 定义组件名称
defineOptions({
  name: 'BlogHome'
})

const router = useRouter()

// 最新文章数据
const latestArticles = ref([
  {
    id: 1,
    title: 'Vue.js 3.0 新特性解析',
    excerpt: '深入探讨 Vue.js 3.0 的 Composition API 和其他新功能...',
    image: 'https://via.placeholder.com/300x200/409eff/ffffff?text=Vue.js',
    date: '2024-01-15',
    category: '前端开发'
  },
  {
    id: 2,
    title: '现代 CSS 技巧分享',
    excerpt: '分享一些实用的 CSS 技巧和最佳实践...',
    image: 'https://via.placeholder.com/300x200/67c23a/ffffff?text=CSS',
    date: '2024-01-10',
    category: '前端开发'
  },
  {
    id: 3,
    title: 'JavaScript 性能优化指南',
    excerpt: '如何提升 JavaScript 代码的性能和执行效率...',
    image: 'https://via.placeholder.com/300x200/e6a23c/ffffff?text=JavaScript',
    date: '2024-01-05',
    category: '编程技巧'
  }
])

// 推荐网站数据
const featuredWebsites = ref([
  {
    id: 1,
    name: 'GitHub',
    description: '全球最大的代码托管平台',
    icon: '',
    url: 'https://github.com'
  },
  {
    id: 2,
    name: 'MDN Web Docs',
    description: 'Web 开发权威文档',
    icon: '',
    url: 'https://developer.mozilla.org'
  },
  {
    id: 3,
    name: 'Stack Overflow',
    description: '程序员问答社区',
    icon: '',
    url: 'https://stackoverflow.com'
  }
])

// 统计数据
const stats = ref({
  articles: 25,
  websites: 42,
  views: 15680
})

// 方法
const goToArticles = () => {
  router.push('/articles')
}

const goToWebsites = () => {
  router.push('/websites')
}

const goToArticle = (articleId) => {
  router.push(`/articles/${articleId}`)
}

const visitWebsite = (url) => {
  window.open(url, '_blank')
}
</script>

<style scoped>
.blog-home {
  min-height: 100vh;
}

.hero-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 80px 20px;
  text-align: center;
}

.hero-content {
  max-width: 800px;
  margin: 0 auto;
}

.hero-title {
  font-size: 3rem;
  margin-bottom: 1rem;
  font-weight: 700;
}

.hero-subtitle {
  font-size: 1.5rem;
  margin-bottom: 2rem;
  opacity: 0.9;
}

.hero-actions {
  display: flex;
  gap: 20px;
  justify-content: center;
  flex-wrap: wrap;
}

.featured-section {
  padding: 60px 20px;
  background-color: #f8f9fa;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.section-title {
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 40px;
  color: #303133;
}

.featured-articles,
.featured-websites {
  margin-bottom: 60px;
}

.featured-articles h3,
.featured-websites h3 {
  font-size: 1.8rem;
  margin-bottom: 30px;
  color: #606266;
}

.articles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  margin-bottom: 40px;
}

.article-card {
  cursor: pointer;
  transition: transform 0.3s ease;
  border-radius: 12px;
  overflow: hidden;
}

.article-card:hover {
  transform: translateY(-5px);
}

.article-image img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.article-content {
  padding: 20px;
}

.article-content h4 {
  margin: 0 0 10px 0;
  font-size: 1.3rem;
  color: #303133;
}

.article-content p {
  margin: 0 0 15px 0;
  color: #606266;
  line-height: 1.6;
}

.article-meta {
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
  color: #909399;
}

.websites-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
}

.website-card {
  text-align: center;
  padding: 30px 20px;
  border-radius: 12px;
  transition: transform 0.3s ease;
}

.website-card:hover {
  transform: translateY(-5px);
}

.website-icon {
  margin-bottom: 20px;
}

.website-info h4 {
  margin: 0 0 10px 0;
  font-size: 1.2rem;
  color: #303133;
}

.website-info p {
  margin: 0 0 20px 0;
  color: #606266;
  line-height: 1.5;
}

.stats-section {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
  padding: 60px 20px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 40px;
  text-align: center;
}

.stat-item {
  padding: 20px;
}

.stat-number {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 10px;
}

.stat-label {
  font-size: 1.1rem;
  opacity: 0.9;
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 2rem;
  }
  
  .hero-subtitle {
    font-size: 1.2rem;
  }
  
  .hero-actions {
    flex-direction: column;
    align-items: center;
  }
  
  .articles-grid,
  .websites-grid {
    grid-template-columns: 1fr;
  }
}
</style>
