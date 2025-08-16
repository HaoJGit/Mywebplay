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
      <div class="articles-grid">
        <el-card 
          v-for="article in filteredArticles" 
          :key="article.id" 
          class="article-card"
          shadow="hover"
          @click="viewArticle(article.id)"
        >
          <div class="article-image">
            <img :src="article.image" :alt="article.title">
            <div class="article-category">{{ article.category }}</div>
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
        </el-card>
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
import { Search, Calendar, User, View, Star } from '@element-plus/icons-vue'

// 定义组件名称
defineOptions({
  name: 'Articles'
})

const router = useRouter()

// 响应式数据
const searchKeyword = ref('')
const selectedCategory = ref('')
const currentPage = ref(1)
const pageSize = ref(12)

// 分类数据
const categories = ref([
  { id: '1', name: '前端开发' },
  { id: '2', name: '后端开发' },
  { id: '3', name: '移动开发' },
  { id: '4', name: '数据库' },
  { id: '5', name: '云计算' },
  { id: '6', name: '人工智能' },
  { id: '7', name: '编程技巧' },
  { id: '8', name: '生活随笔' }
])

// 文章数据
const articles = ref([
  {
    id: 1,
    title: 'Vue.js 3.0 新特性解析',
    excerpt: '深入探讨 Vue.js 3.0 的 Composition API 和其他新功能，帮助开发者更好地理解和使用这个强大的前端框架。',
    image: 'https://via.placeholder.com/400x250/409eff/ffffff?text=Vue.js+3.0',
    date: '2024-01-15',
    author: '张三',
    category: '前端开发',
    categoryId: '1',
    views: 1250,
    likes: 89,
    tags: ['Vue.js', '前端', 'JavaScript']
  },
  {
    id: 2,
    title: '现代 CSS 技巧分享',
    excerpt: '分享一些实用的 CSS 技巧和最佳实践，包括 Grid、Flexbox、动画等现代 CSS 特性的应用。',
    image: 'https://via.placeholder.com/400x250/67c23a/ffffff?text=CSS+Tricks',
    date: '2024-01-10',
    author: '李四',
    category: '前端开发',
    categoryId: '1',
    views: 980,
    likes: 67,
    tags: ['CSS', '前端', '设计']
  },
  {
    id: 3,
    title: 'JavaScript 性能优化指南',
    excerpt: '如何提升 JavaScript 代码的性能和执行效率，包括代码分割、懒加载、内存管理等技巧。',
    image: 'https://via.placeholder.com/400x250/e6a23c/ffffff?text=JavaScript+Performance',
    date: '2024-01-05',
    author: '王五',
    category: '编程技巧',
    categoryId: '7',
    views: 1560,
    likes: 112,
    tags: ['JavaScript', '性能优化', '编程']
  },
  {
    id: 4,
    title: 'Node.js 微服务架构实践',
    excerpt: '使用 Node.js 构建微服务架构的实战经验分享，包括服务拆分、通信、部署等关键环节。',
    image: 'https://via.placeholder.com/400x250/f56c6c/ffffff?text=Node.js+Microservices',
    date: '2024-01-01',
    author: '赵六',
    category: '后端开发',
    categoryId: '2',
    views: 890,
    likes: 45,
    tags: ['Node.js', '微服务', '后端']
  },
  {
    id: 5,
    title: 'React Hooks 深度解析',
    excerpt: '深入理解 React Hooks 的工作原理和使用技巧，帮助开发者更好地管理组件状态和副作用。',
    image: 'https://via.placeholder.com/400x250/909399/ffffff?text=React+Hooks',
    date: '2023-12-28',
    author: '孙七',
    category: '前端开发',
    categoryId: '1',
    views: 1340,
    likes: 78,
    tags: ['React', 'Hooks', '前端']
  },
  {
    id: 6,
    title: 'Docker 容器化部署指南',
    excerpt: '使用 Docker 进行应用容器化部署的完整指南，包括镜像构建、容器运行、编排等内容。',
    image: 'https://via.placeholder.com/400x250/409eff/ffffff?text=Docker+Guide',
    date: '2023-12-25',
    author: '周八',
    category: '云计算',
    categoryId: '5',
    views: 720,
    likes: 56,
    tags: ['Docker', '容器化', '部署']
  }
])

// 计算属性
const filteredArticles = computed(() => {
  let result = articles.value
  
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

.articles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
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

.article-image {
  position: relative;
}

.article-image img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.article-category {
  position: absolute;
  top: 15px;
  left: 15px;
  background-color: rgba(64, 158, 255, 0.9);
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
}

.article-content {
  padding: 20px;
}

.article-title {
  margin: 0 0 15px 0;
  font-size: 1.4rem;
  color: #303133;
  line-height: 1.4;
}

.article-excerpt {
  margin: 0 0 20px 0;
  color: #606266;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.article-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  font-size: 0.9rem;
  color: #909399;
}

.meta-left,
.meta-right {
  display: flex;
  gap: 15px;
}

.meta-left span,
.meta-right span {
  display: flex;
  align-items: center;
  gap: 5px;
}

.article-tags {
  display: flex;
  gap: 8px;
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
  
  .articles-grid {
    grid-template-columns: 1fr;
  }
  
  .page-header h1 {
    font-size: 2rem;
  }
}
</style>
