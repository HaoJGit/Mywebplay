<template>
  <div class="articles-page">
    <div class="container">
      <!-- 页面标题 -->
      <div class="page-header">
        <h1>文章列表</h1>
        <p>探索技术、生活和创意的精彩内容</p>
      </div>

      <!-- 搜索和筛选区域 -->
      <div class="filter-section">
        <div class="search-box">
          <el-input
            v-model="searchKeyword"
            placeholder="搜索文章标题或内容..."
            clearable
            style="width: 400px"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
        </div>
        
        <div class="category-filter">
          <el-select
            v-model="selectedCategory"
            placeholder="选择分类"
            clearable
            style="width: 200px"
          >
            <el-option
              v-for="category in categories"
              :key="category.id"
              :label="category.name"
              :value="category.id"
            />
          </el-select>
        </div>
      </div>

      <!-- 文章统计 -->
      <div class="articles-stats">
        <span>共找到 {{ filteredArticles.length }} 篇文章</span>
      </div>

      <!-- 文章列表 -->
      <div class="articles-list">
        <div 
          v-for="article in filteredArticles" 
          :key="article.id" 
          class="article-item"
          @click="viewArticle(article.id)"
        >
          <div class="article-image">
            <img :src="article.image" :alt="article.title">
          </div>
          
          <div class="article-content">
            <h3 class="article-title">{{ article.title }}</h3>
            <p class="article-excerpt">{{ article.excerpt }}</p>
            
            <div class="article-meta">
              <div class="meta-left">
                <span class="date">
                  <el-icon><Calendar /></el-icon>
                  {{ article.date }}
                </span>
                <span class="author">
                  <el-icon><User /></el-icon>
                  {{ article.author }}
                </span>
                <span class="category">
                  <el-icon><Folder /></el-icon>
                  {{ article.category }}
                </span>
              </div>
              
              <div class="meta-right">
                <span class="views">
                  <el-icon><View /></el-icon>
                  {{ article.views }}
                </span>
                <span class="likes">
                  <el-icon><Star /></el-icon>
                  {{ article.likes }}
                </span>
              </div>
            </div>
            
            <div class="article-tags">
              <el-tag 
                v-for="tag in article.tags" 
                :key="tag"
                size="small"
                class="tag"
              >
                {{ tag }}
              </el-tag>
            </div>
          </div>
        </div>
      </div>

      <!-- 分页 -->
      <div class="pagination-wrapper">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[12, 24, 36, 48]"
          :total="filteredArticles.length"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>

      <!-- 空状态 -->
      <el-empty 
        v-if="filteredArticles.length === 0" 
        description="没有找到相关文章"
        :image-size="200"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Search, Calendar, User, View, Star, Folder } from '@element-plus/icons-vue'
import { useArticlesStore } from '../stores/articles'

// 定义组件名称
defineOptions({
  name: 'Articles'
})

const router = useRouter()
const articlesStore = useArticlesStore()

// 响应式数据
const searchKeyword = ref('')
const selectedCategory = ref('')
const currentPage = ref(1)
const pageSize = ref(12)

// 从 store 获取基础数据
const { categories, articles, incrementViews } = articlesStore

// 计算属性 - 过滤文章
const filteredArticles = computed(() => {
  let result = articles
  
  // 根据分类过滤
  if (selectedCategory.value) {
    result = result.filter(article => article.categoryId === selectedCategory.value)
  }
  
  // 根据搜索关键词过滤
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    result = result.filter(article => 
      article.title.toLowerCase().includes(keyword) ||
      article.excerpt.toLowerCase().includes(keyword) ||
      article.tags.some(tag => tag.toLowerCase().includes(keyword))
    )
  }
  
  return result
})

// 方法
const viewArticle = (articleId) => {
  incrementViews(articleId)
  router.push(`/articles/${articleId}`)
}

const handleSizeChange = (val) => {
  pageSize.value = val
  currentPage.value = 1
}

const handleCurrentChange = (val) => {
  currentPage.value = val
}
</script>

<style scoped>
.articles-page {
  min-height: 100vh;
  background-color: #f8f9fa;
  padding: 40px 20px;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  text-align: center;
  margin-bottom: 40px;
}

.page-header h1 {
  font-size: 2.5rem;
  margin-bottom: 10px;
  color: #303133;
}

.page-header p {
  font-size: 1.1rem;
  color: #606266;
}

.filter-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  gap: 20px;
  flex-wrap: wrap;
}

.articles-stats {
  margin-bottom: 30px;
  color: #909399;
  font-size: 0.9rem;
}

.articles-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 40px;
}

.article-item {
  display: flex;
  align-items: center;
  background-color: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  cursor: pointer;
}

.article-item:hover {
  transform: translateY(-5px);
}

.article-image {
  width: 150px;
  height: 100px;
  overflow: hidden;
}

.article-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.article-content {
  flex-grow: 1;
  padding: 15px 20px;
}

.article-title {
  margin: 0 0 8px 0;
  font-size: 1.2rem;
  color: #303133;
  line-height: 1.4;
}

.article-excerpt {
  margin: 0 0 15px 0;
  color: #606266;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.article-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  font-size: 0.8rem;
  color: #909399;
}

.meta-left,
.meta-right {
  display: flex;
  gap: 10px;
}

.meta-left span,
.meta-right span {
  display: flex;
  align-items: center;
  gap: 3px;
}

.article-tags {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.tag {
  margin: 0;
}

.pagination-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 40px;
}

@media (max-width: 768px) {
  .filter-section {
    flex-direction: column;
    align-items: stretch;
  }
  
  .search-box,
  .category-filter {
    width: 100%;
  }
  
  .articles-list {
    grid-template-columns: 1fr;
  }
  
  .page-header h1 {
    font-size: 2rem;
  }
}
</style>
