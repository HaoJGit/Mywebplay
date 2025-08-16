<template>
  <div class="article-detail-page">
    <div class="container">
      <!-- 返回按鈕 -->
      <div class="back-button">
        <el-button @click="goBack" icon="ArrowLeft">
          返回文章列表
        </el-button>
      </div>

      <!-- 文章內容 -->
      <div v-if="article" class="article-content">
        <!-- 文章標題 -->
        <h1 class="article-title">{{ article.title }}</h1>
        
        <!-- 文章元信息 -->
        <div class="article-meta">
          <div class="meta-left">
            <span class="author">
              <el-icon><User /></el-icon>
              {{ article.author }}
            </span>
            <span class="date">
              <el-icon><Calendar /></el-icon>
              {{ article.date }}
            </span>
            <span class="category">
              <el-icon><Folder /></el-icon>
              {{ article.category }}
            </span>
          </div>
          
          <div class="meta-right">
            <span class="views">
              <el-icon><View /></el-icon>
              {{ article.views }} 次瀏覽
            </span>
            <span class="likes">
              <el-icon><Star /></el-icon>
              {{ article.likes }} 次點讚
            </span>
          </div>
        </div>

        <!-- 文章標籤 -->
        <div class="article-tags">
          <el-tag 
            v-for="tag in article.tags" 
            :key="tag"
            size="large"
            class="tag"
          >
            {{ tag }}
          </el-tag>
        </div>

        <!-- 文章圖片 -->
        <div class="article-image">
          <img :src="article.image" :alt="article.title">
        </div>

        <!-- 文章摘要 -->
        <div class="article-excerpt">
          <p>{{ article.excerpt }}</p>
        </div>

        <!-- 文章正文 -->
        <div class="article-body">
          <h2>文章內容</h2>
          <p>這裡是文章的完整內容。由於我們使用的是示例數據，這裡會顯示一些示例內容來展示文章詳情頁面的佈局。</p>
          
          <h3>Vue.js 3.0 的新特性</h3>
          <p>Vue.js 3.0 帶來了許多令人興奮的新功能，包括：</p>
          <ul>
            <li><strong>Composition API</strong>：提供更好的邏輯復用和組織方式</li>
            <li><strong>更好的 TypeScript 支持</strong>：完整的類型推斷和類型檢查</li>
            <li><strong>更小的包體積</strong>：通過 tree-shaking 優化，減少不必要的代碼</li>
            <li><strong>更好的性能</strong>：重寫的響應式系統和虛擬 DOM</li>
          </ul>

          <h3>實際應用示例</h3>
          <p>以下是一個使用 Composition API 的簡單示例：</p>
          <pre><code>import { ref, computed, onMounted } from 'vue'

export default {
  setup() {
    const count = ref(0)
    const doubleCount = computed(() => count.value * 2)
    
    const increment = () => {
      count.value++
    }
    
    onMounted(() => {
      console.log('組件已掛載')
    })
    
    return {
      count,
      doubleCount,
      increment
    }
  }
}</code></pre>

          <h3>總結</h3>
          <p>Vue.js 3.0 的這些新特性讓開發者能夠構建更強大、更易維護的應用程序。通過學習和掌握這些新功能，我們可以提升開發效率和代碼質量。</p>
        </div>

        <!-- 相關文章推薦 -->
        <div class="related-articles">
          <h3>相關文章推薦</h3>
          <div class="articles-grid">
            <div 
              v-for="relatedArticle in relatedArticles" 
              :key="relatedArticle.id" 
              class="related-article-item"
              @click="goToArticle(relatedArticle.id)"
            >
              <div class="related-article-image">
                <img :src="relatedArticle.image" :alt="relatedArticle.title">
              </div>
              <div class="related-article-content">
                <h4>{{ relatedArticle.title }}</h4>
                <p>{{ relatedArticle.excerpt }}</p>
                <div class="related-article-meta">
                  <span class="date">{{ relatedArticle.date }}</span>
                  <span class="category">{{ relatedArticle.category }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 文章不存在 -->
      <div v-else class="article-not-found">
        <el-empty description="文章不存在或已被刪除">
          <el-button type="primary" @click="goBack">返回文章列表</el-button>
        </el-empty>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { User, Calendar, Folder, View, Star, ArrowLeft } from '@element-plus/icons-vue'
import { useArticlesStore } from '../stores/articles'

// 定义组件名称
defineOptions({
  name: 'ArticleDetail'
})

const route = useRoute()
const router = useRouter()
const articlesStore = useArticlesStore()

// 获取文章ID
const articleId = parseInt(route.params.id)

// 获取文章数据
const article = computed(() => {
  return articlesStore.articles.find(a => a.id === articleId)
})

// 获取相关文章（同分类的其他文章，排除当前文章）
const relatedArticles = computed(() => {
  if (!article.value) return []
  
  return articlesStore.articles
    .filter(a => a.id !== articleId && a.categoryId === article.value.categoryId)
    .slice(0, 3)
})

// 页面挂载时增加浏览量
onMounted(() => {
  if (article.value) {
    articlesStore.incrementViews(articleId)
  }
})

// 方法
const goBack = () => {
  router.push('/articles')
}

const goToArticle = (articleId) => {
  router.push(`/articles/${articleId}`)
}
</script>

<style scoped>
.article-detail-page {
  min-height: 100vh;
  background-color: #f8f9fa;
  padding: 40px 20px;
}

.container {
  max-width: 800px;
  margin: 0 auto;
}

.back-button {
  margin-bottom: 30px;
}

.article-content {
  background-color: #fff;
  border-radius: 12px;
  padding: 40px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.article-title {
  font-size: 2.5rem;
  margin-bottom: 20px;
  color: #303133;
  line-height: 1.3;
}

.article-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid #ebeef5;
  flex-wrap: wrap;
  gap: 15px;
}

.meta-left,
.meta-right {
  display: flex;
  gap: 20px;
  align-items: center;
}

.meta-left span,
.meta-right span {
  display: flex;
  align-items: center;
  gap: 5px;
  color: #606266;
  font-size: 0.9rem;
}

.article-tags {
  margin-bottom: 30px;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.tag {
  margin: 0;
}

.article-image {
  margin-bottom: 30px;
  text-align: center;
}

.article-image img {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.article-excerpt {
  margin-bottom: 30px;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #409eff;
}

.article-excerpt p {
  margin: 0;
  font-size: 1.1rem;
  color: #606266;
  line-height: 1.6;
  font-style: italic;
}

.article-body {
  margin-bottom: 40px;
}

.article-body h2 {
  font-size: 1.8rem;
  margin-bottom: 20px;
  color: #303133;
  border-bottom: 2px solid #409eff;
  padding-bottom: 10px;
}

.article-body h3 {
  font-size: 1.4rem;
  margin: 30px 0 15px 0;
  color: #303133;
}

.article-body p {
  margin-bottom: 15px;
  line-height: 1.8;
  color: #606266;
}

.article-body ul {
  margin-bottom: 20px;
  padding-left: 20px;
}

.article-body li {
  margin-bottom: 8px;
  line-height: 1.6;
  color: #606266;
}

.article-body pre {
  background-color: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  overflow-x: auto;
  margin: 20px 0;
  border: 1px solid #e9ecef;
}

.article-body code {
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
  color: #e83e8c;
}

.related-articles {
  border-top: 1px solid #ebeef5;
  padding-top: 30px;
}

.related-articles h3 {
  font-size: 1.5rem;
  margin-bottom: 20px;
  color: #303133;
}

.articles-grid {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.related-article-item {
  display: flex;
  background-color: #f8f9fa;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.related-article-item:hover {
  transform: translateY(-2px);
}

.related-article-image {
  width: 120px;
  height: 80px;
  overflow: hidden;
}

.related-article-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.related-article-content {
  flex: 1;
  padding: 15px;
}

.related-article-content h4 {
  margin: 0 0 8px 0;
  font-size: 1.1rem;
  color: #303133;
}

.related-article-content p {
  margin: 0 0 10px 0;
  font-size: 0.9rem;
  color: #606266;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.related-article-meta {
  display: flex;
  gap: 15px;
  font-size: 0.8rem;
  color: #909399;
}

.article-not-found {
  text-align: center;
  padding: 60px 20px;
}

@media (max-width: 768px) {
  .article-content {
    padding: 20px;
  }
  
  .article-title {
    font-size: 2rem;
  }
  
  .article-meta {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .meta-left,
  .meta-right {
    gap: 15px;
  }
  
  .related-article-item {
    flex-direction: column;
  }
  
  .related-article-image {
    width: 100%;
    height: 150px;
  }
}
</style> 
