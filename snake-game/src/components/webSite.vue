<template>
  <div class="website-manager">
    <el-container>
      <!-- 顶部标题栏 -->
      <el-header class="header">
        <div class="header-content">
          <h2>所有网站</h2>
        </div>
      </el-header>

      <el-container>
        <!-- 侧边栏 - 分类列表 -->
        <el-aside width="250px" class="sidebar">
          <div class="category-header">
            <h3>网站分类</h3>
          </div>
          <el-menu
            :default-active="activeCategory"
            class="category-menu"
            @select="handleCategorySelect"
          >
            <el-menu-item index="all">
              <el-icon><Menu /></el-icon>
              <span>全部网站</span>
              <span class="category-count">({{ totalWebsites }})</span>
            </el-menu-item>
            <el-menu-item 
              v-for="category in categories" 
              :key="category.id" 
              :index="category.id"
            >
              <el-icon><Folder /></el-icon>
              <span>{{ category.name }}</span>
              <span class="category-count">({{ category.websiteCount }})</span>
            </el-menu-item>
          </el-menu>
        </el-aside>

        <!-- 主内容区域 - 网站列表 -->
        <el-main class="main-content">
          <div class="websites-header">
            <h3>{{ currentCategoryName }} ({{ filteredWebsites.length }})</h3>
            <div class="search-box">
              <el-input
                v-model="searchKeyword"
                placeholder="搜索网站..."
                clearable
                style="width: 300px"
              >
                <template #prefix>
                  <el-icon><Search /></el-icon>
                </template>
              </el-input>
            </div>
          </div>

          <!-- 网站卡片网格 -->
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
                    :size="48" 
                    v-if="website.icon"
                  >
                    {{ website.name.charAt(0).toUpperCase() }}
                  </el-avatar>
                </div>
                <div class="website-info">
                  <!-- 点击网站名称跳转 -->
                  <h4 class="website-name">
                    <a 
                      :href="website.url" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      @click.stop
                    >
                      {{ website.name }}
                    </a>
                  </h4>
                  <!-- 点击网站URL跳转 -->
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
                      size="small" 
                      @click="openEditWebsiteDialog(website)"
                    >
                      查看
                    </el-button>
                  </div>
                </div>
              </div>
            </el-card>
          </div>

          <!-- 空状态 -->
          <el-empty 
            v-if="filteredWebsites.length === 0" 
            description="暂无网站数据"
            :image-size="100"
          />
        </el-main>
      </el-container>
    </el-container>

    <!-- 查看网站详情对话框 -->
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
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { Menu, Folder, Search } from '@element-plus/icons-vue'

// 定义组件名称
defineOptions({
  name: 'WebSite'
})

// 响应式数据
const activeCategory = ref('all')
const searchKeyword = ref('')
const websiteDialogVisible = ref(false)

// 模拟分类数据
const categories = ref([
  { id: '1', name: '开发工具', websiteCount: 5 },
  { id: '2', name: '设计资源', websiteCount: 3 },
  { id: '3', name: '学习平台', websiteCount: 4 },
  { id: '4', name: '娱乐休闲', websiteCount: 2 }
])

// 模拟网站数据
const websites = ref([
  {
    id: '1',
    name: 'GitHub',
    url: 'https://github.com',
    icon: '',
    description: '全球最大的代码托管平台',
    categoryId: '1'
  },
  {
    id: '2',
    name: 'Stack Overflow',
    url: 'https://stackoverflow.com',
    icon: '',
    description: '程序员问答社区',
    categoryId: '1'
  },
  {
    id: '3',
    name: 'Figma',
    url: 'https://figma.com',
    icon: '',
    description: '在线协作设计工具',
    categoryId: '2'
  },
  {
    id: '4',
    name: 'MDN Web Docs',
    url: 'https://developer.mozilla.org',
    icon: '',
    description: 'Web开发权威文档',
    categoryId: '1'
  },
  {
    id: '5',
    name: 'Coursera',
    url: 'https://coursera.org',
    icon: '',
    description: '在线课程学习平台',
    categoryId: '3'
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
const totalWebsites = computed(() => websites.value.length)

const currentCategoryName = computed(() => {
  if (activeCategory.value === 'all') {
    return '全部网站'
  }
  const category = categories.value.find(c => c.id === activeCategory.value)
  return category ? category.name : '全部网站'
})

const filteredWebsites = computed(() => {
  let result = websites.value
  
  // 根据分类过滤
  if (activeCategory.value !== 'all') {
    result = result.filter(website => website.categoryId === activeCategory.value)
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
const handleCategorySelect = (index) => {
  activeCategory.value = index
}

const getCategoryName = (categoryId) => {
  const category = categories.value.find(c => c.id === categoryId)
  return category ? category.name : '未分类'
}

const getCategoryTagType = (categoryId) => {
  const types = ['primary', 'success', 'warning', 'danger', 'info']
  const index = categories.value.findIndex(c => c.id === categoryId)
  return types[index % types.length]
}

const openEditWebsiteDialog = (website) => {
  Object.assign(websiteForm, { ...website })
  websiteDialogVisible.value = true
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
.website-manager {
  height: 100%;
}

.header {
  background-color: #fff;
  border-bottom: 1px solid #ebeef5;
  padding: 0 20px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
}

.sidebar {
  background-color: #f5f7fa;
  border-right: 1px solid #ebeef5;
  padding: 20px 0;
}

.category-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px 15px;
}

.category-header h3 {
  margin: 0;
}

.category-menu {
  border: none;
}

.category-count {
  margin-left: 5px;
  color: #909399;
  font-size: 12px;
}

.main-content {
  padding: 20px;
  background-color: #f5f5f5;
}

.websites-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.websites-header h3 {
  margin: 0;
}

.websites-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
}

.website-card {
  border-radius: 8px;
  overflow: hidden;
}

.website-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.website-icon {
  margin-bottom: 15px;
}

.website-info {
  flex: 1;
  margin-bottom: 15px;
}

.website-name {
  margin: 0 0 10px 0;
  font-size: 18px;
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
  line-height: 1.5;
}

.website-actions {
  width: 100%;
}

.category-tag {
  margin-bottom: 15px;
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 10px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.el-empty {
  grid-column: 1 / -1;
}
</style>