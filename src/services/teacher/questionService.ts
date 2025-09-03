import { apiClient } from '../api.ts'

export interface Question {
  id: number
  title: string
  content: string
  type: 'CHOICE' | 'FILL_BLANK' | 'SHORT_ANSWER' | 'PROOF'
  difficulty: number
  categoryId: number
  categoryName?: string
  answer: string
  analysis?: string
  options?: string[]
  score: number
  createdAt: string
  updatedAt?: string
  createdBy?: number
  tags?: string[]
}

export interface QuestionResponse extends Question {}

export interface QuestionRequest {
  title: string
  content: string
  type: 'CHOICE' | 'FILL_BLANK' | 'SHORT_ANSWER' | 'PROOF'
  difficulty: number
  categoryId: number
  answer: string
  analysis?: string
  options?: string[]
  score: number
}

export interface QuestionListParams {
  page?: number
  size?: number
  categoryId?: number
  type?: 'CHOICE' | 'FILL_BLANK' | 'SHORT_ANSWER' | 'PROOF'
  difficulty?: number
  keyword?: string
}

export interface QuestionListResponse {
  records: Question[]
  total: number
  size: number
  current: number
  pages: number
}

export interface BatchUpdateDifficultyRequest {
  ids: number[]
  difficulty: number
}

export interface ImportQuestionRequest {
  title: string
  content: string
  type: 'CHOICE' | 'FILL_BLANK' | 'SHORT_ANSWER' | 'PROOF'
  difficulty: number
  categoryId: number
  answer: string
  analysis?: string
  options?: string[]
  score: number
}

export interface ImportResponse {
  total: number
  success: number
  failed: number
  errors: string[]
}

// 教师端题库管理API
export const questionService = {
  // 创建题目
  async createQuestion(data: QuestionRequest): Promise<QuestionResponse> {
    const response = await apiClient.post('/api/teacher/questions', data)
    return response.data
  },

  // 更新题目
  async updateQuestion(id: number, data: QuestionRequest): Promise<QuestionResponse> {
    const response = await apiClient.put(`/api/teacher/questions/${id}`, data)
    return response.data
  },

  // 删除题目
  async deleteQuestion(id: number): Promise<void> {
    await apiClient.delete(`/api/teacher/questions/${id}`)
  },

  // 根据ID获取题目详情
  async getQuestionById(id: number): Promise<QuestionResponse> {
    const response = await apiClient.get(`/api/teacher/questions/${id}`)
    return response.data
  },

  // 分页查询题目
  async getQuestions(params: QuestionListParams = {}): Promise<QuestionListResponse> {
    const response = await apiClient.get('/api/teacher/questions', { params })
    return response.data
  },

  // 获取题目列表 (别名)
  async getQuestionList(params: QuestionListParams = {}): Promise<{ data: { items: Question[], totalPages: number, totalItems: number } }> {
    const response = await this.getQuestions(params)
    return {
      data: {
        items: response.records,
        totalPages: response.pages,
        totalItems: response.total
      }
    }
  },

  // 获取我创建的题目
  async getMyQuestions(): Promise<QuestionResponse[]> {
    const response = await apiClient.get('/api/teacher/questions/my-questions')
    return response.data
  },

  // 根据分类获取题目
  async getQuestionsByCategory(categoryId: number): Promise<QuestionResponse[]> {
    const response = await apiClient.get(`/api/teacher/questions/category/${categoryId}`)
    return response.data
  },

  // 复制题目
  async copyQuestion(id: number): Promise<QuestionResponse> {
    const response = await apiClient.post(`/api/teacher/questions/${id}/copy`)
    return response.data
  },

  // 批量删除题目
  async batchDeleteQuestions(ids: number[]): Promise<void> {
    await apiClient.delete('/api/teacher/questions/batch', { data: ids })
  },

  // 批量更新题目分类
  async batchUpdateQuestionCategory(ids: number[], categoryId: number): Promise<void> {
    await apiClient.put('/api/teacher/questions/batch/category', ids, {
      params: { categoryId }
    })
  },

  // 批量更新题目难度
  async batchUpdateQuestionDifficulty(ids: number[], difficulty: number): Promise<void> {
    await apiClient.put('/api/teacher/questions/batch/difficulty', ids, {
      params: { difficulty }
    })
  },

  // 随机获取题目（用于组卷）
  async getRandomQuestions(count: number = 10, categoryId?: number, type?: 'CHOICE' | 'FILL_BLANK' | 'SHORT_ANSWER' | 'PROOF', difficulty?: number): Promise<QuestionResponse[]> {
    const response = await apiClient.get('/api/teacher/questions/random', {
      params: { count, categoryId, type, difficulty }
    })
    return response.data
  },

  // 根据难度分布获取题目
  async getQuestionsByDifficultyDistribution(categoryId: number, easy: number, medium: number, hard: number): Promise<QuestionResponse[]> {
    const response = await apiClient.get('/api/teacher/questions/difficulty-distribution', {
      params: { categoryId, easy, medium, hard }
    })
    return response.data
  },

  // 获取题目统计信息
  async getQuestionStatistics(): Promise<any> {
    const response = await apiClient.get('/api/teacher/questions/statistics')
    return response.data
  },

  // 搜索建议（自动补全）
  async getSearchSuggestions(keyword: string): Promise<string[]> {
    const response = await apiClient.get('/api/teacher/questions/search-suggestions', {
      params: { keyword }
    })
    return response.data
  },

  // 验证题目答案
  async validateAnswer(id: number, userAnswer: string): Promise<any> {
    const response = await apiClient.post(`/api/teacher/questions/${id}/validate`, null, {
      params: { userAnswer }
    })
    return response.data
  },

  // 获取题目使用记录
  async getQuestionUsageHistory(id: number): Promise<any> {
    const response = await apiClient.get(`/api/teacher/questions/${id}/usage-history`)
    return response.data
  },

  // 导入题目（批量）
  async importQuestions(questions: ImportQuestionRequest[]): Promise<ImportResponse> {
    const response = await apiClient.post('/api/teacher/questions/import', questions)
    return response.data
  },

  // 导出题目
  async exportQuestions(categoryId?: number, type?: 'CHOICE' | 'FILL_BLANK' | 'SHORT_ANSWER' | 'PROOF', difficulty?: number): Promise<QuestionResponse[]> {
    const response = await apiClient.get('/api/teacher/questions/export', {
      params: { categoryId, type, difficulty }
    })
    return response.data
  },

  // 题目收藏/取消收藏
  async toggleQuestionFavorite(id: number): Promise<void> {
    await apiClient.post(`/api/teacher/questions/${id}/favorite`)
  },

  // 获取收藏的题目
  async getFavoriteQuestions(): Promise<QuestionResponse[]> {
    const response = await apiClient.get('/api/teacher/questions/favorites')
    return response.data
  },

  // 题目标签管理
  async updateQuestionTags(id: number, tags: string[]): Promise<void> {
    await apiClient.post(`/api/teacher/questions/${id}/tags`, tags)
  },

  // 根据标签获取题目
  async getQuestionsByTag(tag: string): Promise<QuestionResponse[]> {
    const response = await apiClient.get(`/api/teacher/questions/tags/${tag}`)
    return response.data
  },
}

// 导出别名以保持兼容性
export const teacherQuestionService = questionService
