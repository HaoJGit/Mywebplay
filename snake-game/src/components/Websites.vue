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
      <div class="websites-list">
        <div 
          v-for="website in filteredWebsites" 
          :key="website.id" 
          class="website-item"
        >
          <div class="website-icon">
            <el-avatar 
              :src="website.icon" 
              :size="50" 
              v-if="website.icon"
            >
              {{ website.name.charAt(0).toUpperCase() }}
            </el-avatar>
            <el-avatar 
              :size="50" 
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
import { useWebsitesStore } from '../stores/websites'

// 定义组件名称
defineOptions({
  name: 'Websites'
})

const websitesStore = useWebsitesStore()

// 响应式数据
const searchKeyword = ref('')
const selectedCategory = ref('')
const currentPage = ref(1)
const pageSize = ref(12)
const websiteDialogVisible = ref(false)

// 从 store 获取基础数据
const { categories, websites, getCategoryName, getCategoryTagType, getRandomColor } = websitesStore

// 表单数据
const websiteForm = reactive({
  name: '',
  url: '',
  icon: '',
  description: '',
  categoryId: ''
})

// 计算属性 - 过滤网站
const filteredWebsites = computed(() => {
  let result = websites
  
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

.websites-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 40px;
}

.website-item {
  display: flex;
  align-items: center;
  padding: 20px;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.website-item:hover {
  transform: translateX(10px);
}

.website-icon {
  margin-right: 20px;
}

.website-info {
  flex: 1;
  margin-right: 20px;
}

.website-name {
  margin: 0 0 10px 0;
  font-size: 1.3rem;
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
  margin: 0 0 10px 0;
  font-size: 13px;
  word-break: break-all;
  color: #606266;
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
  font-size: 13px;
  color: #909399;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.website-actions {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 10px;
}

.category-tag {
  font-size: 0.9rem;
}

.action-buttons {
  display: flex;
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
  
  .websites-list {
    gap: 15px;
  }
  
  .website-item {
    padding: 15px;
    flex-direction: column;
    align-items: flex-start;
  }

  .website-icon {
    margin-right: 0;
    margin-bottom: 10px;
  }

  .website-info {
    margin-right: 0;
    width: 100%;
  }

  .website-actions {
    align-items: flex-start;
    width: 100%;
  }

  .page-header h1 {
    font-size: 2rem;
  }
  
  .website-name {
    font-size: 1.2rem;
  }
  
  .website-url {
    font-size: 12px;
  }
  
  .website-description {
    font-size: 12px;
  }
}
</style>
