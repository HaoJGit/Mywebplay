import { defineStore } from 'pinia'

export const useWebsitesStore = defineStore('websites', {
  state: () => ({
    // 分类数据
    categories: [
      { id: '1', name: '开发工具', websiteCount: 8 },
      { id: '2', name: '设计资源', websiteCount: 5 },
      { id: '3', name: '学习平台', websiteCount: 6 },
      { id: '4', name: '娱乐休闲', websiteCount: 3 },
      { id: '5', name: '新闻资讯', websiteCount: 4 },
      { id: '6', name: '工具服务', websiteCount: 7 }
    ],
    
    // 网站数据
    websites: [
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
    ]
  }),
  
  getters: {
    // 获取推荐网站（取前3个）
    featuredWebsites: (state) => {
      return state.websites.slice(0, 3)
    },
    
    // 根据分类ID获取分类名称
    getCategoryName: (state) => {
      return (categoryId) => {
        const category = state.categories.find(c => c.id === categoryId)
        return category ? category.name : '未分类'
      }
    },
    
    // 根据分类ID获取分类标签类型
    getCategoryTagType: (state) => {
      return (categoryId) => {
        const types = ['primary', 'success', 'warning', 'danger', 'info']
        const index = state.categories.findIndex(c => c.id === categoryId)
        return types[index % types.length]
      }
    },
    
    // 根据文本生成随机颜色
    getRandomColor: () => {
      return (text) => {
        const colors = ['#409eff', '#67c23a', '#e6a23c', '#f56c6c', '#909399', '#9c27b0']
        const index = text.charCodeAt(0) % colors.length
        return colors[index]
      }
    }
  }
}) 
