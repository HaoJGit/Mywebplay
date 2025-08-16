import { defineStore } from 'pinia'

export const useArticlesStore = defineStore('articles', {
  state: () => ({
    // 分类数据
    categories: [
      { id: '1', name: '前端开发' },
      { id: '2', name: '后端开发' },
      { id: '3', name: '移动开发' },
      { id: '4', name: '数据库' },
      { id: '5', name: '云计算' },
      { id: '6', name: '人工智能' },
      { id: '7', name: '编程技巧' },
      { id: '8', name: '生活随笔' }
    ],
    
    // 文章数据
    articles: [
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
    ]
  }),
  
  getters: {
    // 获取最新文章（按日期排序，取前3篇）
    latestArticles: (state) => {
      return [...state.articles]
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 3)
    },
    
    // 根据分类ID获取分类名称
    getCategoryName: (state) => {
      return (categoryId) => {
        const category = state.categories.find(c => c.id === categoryId)
        return category ? category.name : '未分类'
      }
    }
  },
  
  actions: {
    // 增加文章浏览量
    incrementViews(articleId) {
      const article = this.articles.find(a => a.id === articleId)
      if (article) {
        article.views++
      }
    }
  }
}) 
