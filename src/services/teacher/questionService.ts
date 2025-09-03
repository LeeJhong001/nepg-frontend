import { apiClient } from '../api'

export interface Question {
  id: number
  title: string
  content: string
  type: 'CHOICE' | 'FILL_BLANK' | 'SHORT_ANSWER' | 'PROOF'
  difficulty: number
  categoryId: number
  categoryName?: string
  answer: string
  options?: string[]
  score: number
  tags?: string[]
  createdAt: string
  updatedAt: string
}

export interface QuestionListParams {
  page?: number
  size?: number
  categoryId?: number
  type?: string
  difficulty?: number
  keyword?: string
}

export interface QuestionListResponse {
  content: Question[]
  totalElements: number
  totalPages: number
  currentPage: number
  pageSize: number
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
  options?: string[]
  score: number
}

export interface ImportResponse {
  total: number
  success: number
  failed: number
  errors: string[]
}

// 教师端题目管理API
export const teacherQuestionService = {
  // 获取题目列表
  async getQuestions(params: QuestionListParams = {}): Promise<QuestionListResponse> {
    const response = await apiClient.get('/api/teacher/questions', { params })
    return response.data
  },

  // 获取题目详情
  async getQuestion(id: number): Promise<Question> {
    const response = await apiClient.get(`/api/teacher/questions/${id}`)
    return response.data
  },

  // 创建题目
  async createQuestion(data: Omit<Question, 'id' | 'createdAt' | 'updatedAt'>): Promise<Question> {
    const response = await apiClient.post('/api/teacher/questions', data)
    return response.data
  },

  // 更新题目
  async updateQuestion(id: number, data: Partial<Question>): Promise<Question> {
    const response = await apiClient.put(`/api/teacher/questions/${id}`, data)
    return response.data
  },

  // 删除题目
  async deleteQuestion(id: number): Promise<void> {
    await apiClient.delete(`/api/teacher/questions/${id}`)
  },

  // 批量删除题目
  async batchDeleteQuestions(ids: number[]): Promise<void> {
    await apiClient.delete('/api/teacher/questions/batch', { data: { ids } })
  },

  // 批量更新题目难度
  async batchUpdateDifficulty(data: BatchUpdateDifficultyRequest): Promise<void> {
    await apiClient.put('/api/teacher/questions/batch/difficulty', data)
  },

  // 批量导入题目
  async importQuestions(data: ImportQuestionRequest[]): Promise<ImportResponse> {
    const response = await apiClient.post('/api/teacher/questions/import', data)
    return response.data
  },

  // 导出题目
  async exportQuestions(params: {
    categoryId?: number
    type?: string
    difficulty?: number
  } = {}): Promise<Question[]> {
    const response = await apiClient.get('/api/teacher/questions/export', { params })
    return response.data
  },

  // 获取收藏题目
  async getFavoriteQuestions(): Promise<Question[]> {
    const response = await apiClient.get('/api/teacher/questions/favorites')
    return response.data
  },

  // 收藏题目
  async favoriteQuestion(id: number): Promise<void> {
    await apiClient.post(`/api/teacher/questions/${id}/favorite`)
  },

  // 取消收藏题目
  async unfavoriteQuestion(id: number): Promise<void> {
    await apiClient.delete(`/api/teacher/questions/${id}/favorite`)
  },

  // 根据标签获取题目
  async getQuestionsByTag(tag: string): Promise<Question[]> {
    const response = await apiClient.get(`/api/teacher/questions/tags/${tag}`)
    return response.data
  },

  // 复制题目
  async copyQuestion(id: number): Promise<Question> {
    const response = await apiClient.post(`/api/teacher/questions/${id}/copy`)
    return response.data
  }
}
