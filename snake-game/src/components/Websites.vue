<template>
  <div class="websites-page">
    <div class="container">
      <!-- 页面标题 -->
      <div class="page-header">
        <h1>网站收藏</h1>
        <p>收集和整理的有用网站资源</p>
      </div>

      <!-- 搜索和筛选区域 -->
      <div class="filter-section">
        <div class="search-box">
          <el-input
            v-model="searchKeyword"
            placeholder="搜索网站名称、描述或URL..."
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

      <!-- 网站统计 -->
      <div class="websites-stats">
        <span>共找到 {{ filteredWebsites.length }} 个网站</span>
      </div>

      <!-- 网站列表 -->
      <div class="websites-grid">
        <el-card 
          v-for="website in filteredWebsites" 
          :key="website.id" 
          class="website-card"
          shadow="hover"
        >
          <div class="website-content">
            <div class="website-icon">
              <el-avatar 
                :src="website.icon" 
                :size="60" 
                v-if="website.icon"
              >
                {{ website.name.charAt(0).toUpperCase() }}
              </el-avatar>
              <el-avatar 
                :size="60" 
                v-else
                :style="{ backgroundColor: getRandomColor(website.name) }"
              >
                {{ website.name.charAt(0).toUpperCase() }}
              </el-avatar>
            </div>
            
            <div class="website-info">
              <h3 class="website-name">
                <a 
                  :href="website.url" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  @click.stop
                >
                  {{ website.name }}
                </a>
              </h3>
              <p class="website-url">
                <a 
                  :href="website.url" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  @click.stop
                >
                  {{ website.url }}
                </a>
              </p>
              <p class="website-description">{{ website.description }}</p>
            </div>
            
            <div class="website-actions">
              <el-tag 
                class="category-tag" 
                :type="getCategoryTagType(website.categoryId)"
              >
                {{ getCategoryName(website.categoryId) }}
              </el-tag>
              
              <div class="action-buttons">
                <el-button 
                  type="primary" 
                  size="small" 
                  @click="visitWebsite(website.url)"
                >
                  访问
                </el-button>
                <el-button 
                  size="small" 
                  @click="viewWebsiteDetails(website)"
                >
                  详情
                </el-button>
              </div>
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
          :total="filteredWebsites.length"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>

      <!-- 空状态 -->
      <el-empty 
        v-if="filteredWebsites.length === 0" 
        description="没有找到相关网站"
        :image-size="200"
      />
    </div>

    <!-- 网站详情对话框 -->
    <el-dialog 
      v-model="websiteDialogVisible" 
      title="网站详情"
      width="500px"
    >
      <el-form 
        :model="websiteForm" 
        label-width="80px"
      >
        <el-form-item label="网站名称">
          <el-input v-model="websiteForm.name" readonly>
            <template #append>
              <el-button @click="copyToClipboard(websiteForm.name)">复制</el-button>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="网站地址">
          <el-input v-model="websiteForm.url" readonly>
            <template #append>
              <el-button @click="copyToClipboard(websiteForm.url)">复制</el-button>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="网站描述">
          <el-input 
            v-model="websiteForm.description" 
            type="textarea" 
            readonly
            :rows="3"
          >
            <template #append>
              <el-button v-if="websiteForm.description" @click="copyToClipboard(websiteForm.description)">复制</el-button>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="分类">
          <el-input 
            :value="getCategoryName(websiteForm.categoryId)" 
            readonly
          >
            <template #append>
              <el-button @click="copyToClipboard(getCategoryName(websiteForm.categoryId))">复制</el-button>
            </template>
          </el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="websiteDialogVisible = false">关闭</el-button>
          <el-button type="primary" @click="visitWebsite(websiteForm.url)">访问网站</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { Search } from '@element-plus/icons-vue'

// 定义组件名称
defineOptions({
  name: 'Websites'
})

// 响应式数据
const searchKeyword = ref('')
const selectedCategory = ref('')
const currentPage = ref(1)
const pageSize = ref(12)
const websiteDialogVisible = ref(false)

// 分类数据
const categories = ref([
  { id: '1', name: '开发工具', websiteCount: 8 },
  { id: '2', name: '设计资源', websiteCount: 5 },
  { id: '3', name: '学习平台', websiteCount: 6 },
  { id: '4', name: '娱乐休闲', websiteCount: 3 },
  { id: '5', name: '新闻资讯', websiteCount: 4 },
  { id: '6', name: '工具服务', websiteCount: 7 }
])

// 网站数据
const websites = ref([
  {
    id: '1',
    name: 'GitHub',
    url: 'https://github.com',
    icon: '',
    description: '全球最大的代码托管平台，支持 Git 版本控制，是开发者协作开发的首选平台。',
    categoryId: '1'
  },
  {
    id: '2',
    name: 'Stack Overflow',
    url: 'https://stackoverflow.com',
    icon: '',
    description: '程序员问答社区，汇集了全球开发者的技术问题和解决方案。',
    categoryId: '1'
  },
  {
    id: '3',
    name: 'Figma',
    url: 'https://figma.com',
    icon: '',
    description: '在线协作设计工具，支持实时多人协作，是现代设计团队的必备工具。',
    categoryId: '2'
  },
  {
    id: '4',
    name: 'MDN Web Docs',
    url: 'https://developer.mozilla.org',
    icon: '',
    description: 'Web 开发权威文档，由 Mozilla 维护，内容详实且持续更新。',
    categoryId: '1'
  },
  {
    id: '5',
    name: 'Coursera',
    url: 'https://coursera.org',
    icon: '',
    description: '在线课程学习平台，提供来自顶尖大学和公司的专业课程。',
    categoryId: '3'
  },
  {
    id: '6',
    name: 'Dribbble',
    url: 'https://dribbble.com',
    icon: '',
    description: '设计师作品展示平台，汇集了全球优秀设计师的创意作品。',
    categoryId: '2'
  },
  {
    id: '7',
    name: 'Dev.to',
    url: 'https://dev.to',
    icon: '',
    description: '开发者社区平台，分享技术文章、讨论和学习资源。',
    categoryId: '1'
  },
  {
    id: '8',
    name: 'Unsplash',
    url: 'https://unsplash.com',
    icon: '',
    description: '高质量免费图片资源网站，提供商业用途的免费图片下载。',
    categoryId: '2'
  },
  {
    id: '9',
    name: 'Udemy',
    url: 'https://udemy.com',
    icon: '',
    description: '在线学习平台，提供各种技能培训课程，从技术到生活技能应有尽有。',
    categoryId: '3'
  },
  {
    id: '10',
    name: 'Canva',
    url: 'https://canva.com',
    icon: '',
    description: '在线设计工具，提供丰富的模板和设计元素，适合非专业设计师使用。',
    categoryId: '2'
  }
])

// 表单数据
const websiteForm = reactive({
  name: '',
  url: '',
  icon: '',
  description: '',
  categoryId: ''
})

// 计算属性
const filteredWebsites = computed(() => {
  let result = websites.value
  
  // 根据分类过滤
  if (selectedCategory.value) {
    result = result.filter(website => website.categoryId === selectedCategory.value)
  }
  
  // 根据搜索关键词过滤
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    result = result.filter(website => 
      website.name.toLowerCase().includes(keyword) ||
      website.url.toLowerCase().includes(keyword) ||
      (website.description && website.description.toLowerCase().includes(keyword))
    )
  }
  
  return result
})

// 方法
const getCategoryName = (categoryId) => {
  const category = categories.value.find(c => c.id === categoryId)
  return category ? category.name : '未分类'
}

const getCategoryTagType = (categoryId) => {
  const types = ['primary', 'success', 'warning', 'danger', 'info']
  const index = categories.value.findIndex(c => c.id === categoryId)
  return types[index % types.length]
}

const getRandomColor = (text) => {
  const colors = ['#409eff', '#67c23a', '#e6a23c', '#f56c6c', '#909399', '#9c27b0']
  const index = text.charCodeAt(0) % colors.length
  return colors[index]
}

const viewWebsiteDetails = (website) => {
  Object.assign(websiteForm, { ...website })
  websiteDialogVisible.value = true
}

const visitWebsite = (url) => {
  window.open(url, '_blank')
}

const handleSizeChange = (val) => {
  pageSize.value = val
  currentPage.value = 1
}

const handleCurrentChange = (val) => {
  currentPage.value = val
}

// 复制到剪贴板功能
const copyToClipboard = (text) => {
  if (!text) return
  
  navigator.clipboard.writeText(text).then(() => {
    ElMessage.success('复制成功')
  }).catch(() => {
    ElMessage.error('复制失败')
  })
}
</script>

<style scoped>
.websites-page {
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

.websites-stats {
  margin-bottom: 30px;
  color: #909399;
  font-size: 0.9rem;
}

.websites-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 30px;
  margin-bottom: 40px;
}

.website-card {
  border-radius: 12px;
  overflow: hidden;
  transition: transform 0.3s ease;
}

.website-card:hover {
  transform: translateY(-5px);
}

.website-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 30px 20px;
}

.website-icon {
  margin-bottom: 20px;
}

.website-info {
  flex: 1;
  margin-bottom: 20px;
  width: 100%;
}

.website-name {
  margin: 0 0 15px 0;
  font-size: 1.4rem;
  color: #303133;
}

.website-name a {
  color: #303133;
  text-decoration: none;
  transition: color 0.3s;
}

.website-name a:hover {
  color: #409eff;
}

.website-url {
  margin: 0 0 15px 0;
  font-size: 14px;
  word-break: break-all;
}

.website-url a {
  color: #409eff;
  text-decoration: none;
  transition: color 0.3s;
}

.website-url a:hover {
  color: #66b1ff;
  text-decoration: underline;
}

.website-description {
  margin: 0;
  font-size: 14px;
  color: #606266;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.website-actions {
  width: 100%;
}

.category-tag {
  margin-bottom: 20px;
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 10px;
}

.pagination-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 40px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
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
  
  .websites-grid {
    grid-template-columns: 1fr;
  }
  
  .page-header h1 {
    font-size: 2rem;
  }
  
  .website-content {
    padding: 20px 15px;
  }
}
</style>
