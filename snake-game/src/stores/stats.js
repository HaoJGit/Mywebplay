import { defineStore } from 'pinia'

export const useStatsStore = defineStore('stats', {
  state: () => ({
    // 统计数据
    stats: {
      articles: 25,
      websites: 42,
      views: 15680
    }
  }),
  
  getters: {
    // 获取统计数据
    getStats: (state) => state.stats
  },
  
  actions: {
    // 更新统计数据
    updateStats(newStats) {
      this.stats = { ...this.stats, ...newStats }
    },
    
    // 增加浏览量
    incrementViews() {
      this.stats.views++
    }
  }
}) 
