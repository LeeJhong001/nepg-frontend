import { apiClient } from '../api.ts'

export interface ExamPaper {
  id: number
  examId: number
  examTitle: string
  title: string
  description?: string
  totalQuestions: number
  totalScore: number
  difficulty: number
  createdAt: string
  updatedAt: string
}

export interface ExamPaperDetail extends ExamPaper {
  questions: ExamPaperQuestion[]
}

export interface ExamPaperQuestion {
  id: number
  questionId: number
  questionOrder: number
  score: number
  section: string
  question: {
    id: number
    title: string
    content: string
    type: 'CHOICE' | 'FILL_BLANK' | 'SHORT_ANSWER' | 'PROOF'
    options?: string[]
    difficulty: number
  }
}

export interface ExamPaperListParams {
  page?: number
  size?: number
  examId?: number
  keyword?: string
}

export interface ExamPaperListResponse {
  content: ExamPaper[]
  totalElements: number
  totalPages: number
  currentPage: number
  pageSize: number
}

export interface GenerationRule {
  categoryId: number
  questionType: 'CHOICE' | 'FILL_BLANK' | 'SHORT_ANSWER' | 'PROOF'
  difficulty: number
  count: number
  scorePerQuestion: number
}

export interface CreateExamPaperRequest {
  examId: number
  title: string
  description?: string
  generationRules: GenerationRule[]
}

export interface GenerateExamPaperRequest {
  title: string
  description?: string
  totalScore: number
  questionConfigs: {
    type: 'CHOICE' | 'FILL_BLANK' | 'SHORT_ANSWER' | 'PROOF'
    count: number
    scorePerQuestion: number
    difficulty: 'easy' | 'medium' | 'hard' | 'mixed' | 'random'
    categoryIds: number[]
  }[]
  strategy: 'random' | 'balanced' | 'progressive'
  duplicateStrategy: 'strict' | 'loose' | 'none'
  excludeUsedQuestions: boolean
}

// 试卷管理API
export const examPaperService = {
  // 获取试卷列表
  async getExamPapers(params: ExamPaperListParams = {}): Promise<ExamPaperListResponse> {
    const response = await apiClient.get('/api/exam-papers', { params })
    return response.data
  },

  // 获取试卷列表 (别名)
  async getExamPaperList(params: ExamPaperListParams = {}): Promise<{ data: { items: ExamPaper[], totalPages: number, totalItems: number } }> {
    const response = await this.getExamPapers(params)
    return {
      data: {
        items: response.content,
        totalPages: response.totalPages,
        totalItems: response.totalElements
      }
    }
  },

  // 获取试卷详情
  async getExamPaper(id: number): Promise<ExamPaperDetail> {
    const response = await apiClient.get(`/api/exam-papers/${id}`)
    return response.data
  },

  // 创建试卷
  async createExamPaper(data: CreateExamPaperRequest): Promise<ExamPaper> {
    const response = await apiClient.post('/api/exam-papers', data)
    return response.data
  },

  // 更新试卷
  async updateExamPaper(id: number, data: Partial<CreateExamPaperRequest>): Promise<ExamPaper> {
    const response = await apiClient.put(`/api/exam-papers/${id}`, data)
    return response.data
  },

  // 删除试卷
  async deleteExamPaper(id: number): Promise<void> {
    await apiClient.delete(`/api/exam-papers/${id}`)
  },

  // 智能组卷
  async generateExamPaper(data: GenerateExamPaperRequest): Promise<ExamPaper> {
    const response = await apiClient.post('/api/exam-papers/generate', data)
    return response.data
  },

  // 预览组卷结果
  async previewGenerate(data: GenerateExamPaperRequest): Promise<{
    totalQuestions: number
    totalScore: number
    questionDistribution: {
      type: string
      count: number
      score: number
    }[]
    estimatedDifficulty: number
  }> {
    const response = await apiClient.post('/api/exam-papers/preview-generate', data)
    return response.data
  },

  // 复制试卷
  async copyExamPaper(id: number): Promise<ExamPaper> {
    const response = await apiClient.post(`/api/exam-papers/${id}/copy`)
    return response.data
  },

  // 获取试卷题目
  async getExamPaperQuestions(id: number): Promise<ExamPaperQuestion[]> {
    const response = await apiClient.get(`/api/exam-papers/${id}/questions`)
    return response.data
  },

  // 添加题目到试卷
  async addQuestionsToExamPaper(id: number, questionIds: number[]): Promise<void> {
    await apiClient.post(`/api/exam-papers/${id}/questions`, { questionIds })
  },

  // 从试卷移除题目
  async removeQuestionFromExamPaper(id: number, questionId: number): Promise<void> {
    await apiClient.delete(`/api/exam-papers/${id}/questions/${questionId}`)
  },

  // 批量移除题目
  async batchRemoveQuestions(id: number, questionIds: number[]): Promise<void> {
    await apiClient.delete(`/api/exam-papers/${id}/questions/batch`, { data: { questionIds } })
  },

  // 更新题目顺序
  async updateQuestionOrder(id: number, questionOrders: { questionId: number, order: number }[]): Promise<void> {
    await apiClient.put(`/api/exam-papers/${id}/questions/order`, { questionOrders })
  },

  // 更新题目分值
  async updateQuestionScore(id: number, questionId: number, score: number): Promise<void> {
    await apiClient.put(`/api/exam-papers/${id}/questions/${questionId}/score`, { score })
  },

  // 批量更新题目分值
  async batchUpdateQuestionScores(id: number, scoreUpdates: { questionId: number, score: number }[]): Promise<void> {
    await apiClient.put(`/api/exam-papers/${id}/questions/batch/scores`, { scoreUpdates })
  }
}

// 导出别名以保持兼容性
export const teacherExamPaperService = examPaperService
