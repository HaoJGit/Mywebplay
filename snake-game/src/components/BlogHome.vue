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
          <div class="articles-list">
            <div 
              v-for="article in latestArticles" 
              :key="article.id" 
              class="article-item"
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
            </div>
          </div>
        </div>

        <!-- 推荐网站 -->
        <div class="featured-websites">
          <h3>推荐网站</h3>
          <div class="websites-list">
            <div 
              v-for="website in featuredWebsites" 
              :key="website.id" 
              class="website-item"
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
            </div>
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
import { useRouter } from 'vue-router'
import { useArticlesStore } from '../stores/articles'
import { useWebsitesStore } from '../stores/websites'
import { useStatsStore } from '../stores/stats'

// 定义组件名称
defineOptions({
  name: 'BlogHome'
})

const router = useRouter()
const articlesStore = useArticlesStore()
const websitesStore = useWebsitesStore()
const statsStore = useStatsStore()

// 从 store 获取数据
const { latestArticles } = articlesStore
const { featuredWebsites } = websitesStore
const { stats } = statsStore

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

.articles-list,
.websites-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.article-item,
.website-item {
  display: flex;
  align-items: center;
  background-color: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  cursor: pointer;
}

.article-item:hover,
.website-item:hover {
  transform: translateY(-5px);
}

.article-image,
.website-icon {
  flex-shrink: 0;
  width: 100px; /* Fixed width for image/icon */
  height: 100px; /* Fixed height for image/icon */
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f0f0f0; /* Placeholder background */
}

.article-image img,
.website-icon .el-avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.article-content,
.website-info {
  padding: 15px 20px;
  flex-grow: 1;
}

.article-content h4,
.website-info h4 {
  margin: 0 0 8px 0;
  font-size: 1.2rem;
  color: #303133;
}

.article-content p,
.website-info p {
  margin: 0 0 15px 0;
  color: #606266;
  line-height: 1.5;
}

.article-meta {
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
  color: #909399;
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
  
  .articles-list,
  .websites-list {
    gap: 15px;
  }

  .article-item,
  .website-item {
    flex-direction: column;
    align-items: flex-start;
  }

  .article-image,
  .website-icon {
    width: 100%;
    height: 150px; /* Adjust height for smaller screens */
  }

  .article-content,
  .website-info {
    padding: 10px 15px;
  }
}
</style>
