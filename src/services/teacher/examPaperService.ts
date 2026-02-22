import { apiClient } from '../api.ts'
import { DEFAULT_CONFIG } from '../../constants'

export interface ExamPaper {
  id: number
  examId?: number
  examTitle?: string
  subjectId?: number // 所属学科ID
  categoryId?: number // 所属分类ID
  title: string
  description?: string
  totalQuestions: number
  totalScore: number
  duration?: number // 考试时长（分钟）
  difficulty?: number
  createdAt: string
  updatedAt: string
  createdById?: number // 创建者ID
  createdByName?: string // 创建者姓名
  status?: string // 试卷状态
}

export interface ExamPaperDetail extends ExamPaper {
  questions?: ExamPaperQuestion[]
  subjectName?: string // 所属学科名称
  categoryName?: string // 所属分类名称
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
  status?: string // 试卷状态：DRAFT, PUBLISHED, ARCHIVED
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
  examId?: number
  title: string
  description?: string
  subjectId: number // 所属学科ID
  categoryId: number // 所属分类ID
  duration: number // 考试时长（分钟）
  totalScore: number
  totalQuestions?: number
  generationRules?: GenerationRule[]
}

export interface GenerateExamPaperRequest {
  title: string
  description?: string
  subjectId: number // 所属学科ID
  categoryId: number // 所属分类ID
  totalScore: number
  duration?: number // 考试时长（分钟）
  questionConfigs: {
    type: 'CHOICE' | 'FILL_BLANK' | 'SHORT_ANSWER' | 'PROOF'
    count: number
    scorePerQuestion: number
    difficulty: 'easy' | 'medium' | 'hard' | 'mixed' | 'random'
    categoryIds: number[] // 从已选学科下的分类中选择
  }[]
  strategy: 'random' | 'balanced' | 'progressive'
  duplicateStrategy: 'strict' | 'loose' | 'none'
  excludeUsedQuestions: boolean
}

// 试卷管理API
export const examPaperService = {
  // 获取试卷列表
  async getExamPapers(params: ExamPaperListParams = {}): Promise<ExamPaperListResponse> {
    const response = await apiClient.get('/api/teacher/exam-papers', { params })
    // 后端返回的是 MyBatis Plus 格式: { records, total, size, current, pages }
    const data = response.data
    return {
      content: data.records || [],
      totalElements: data.total || 0,
      totalPages: data.pages || 0,
      currentPage: data.current || 1,
      pageSize: data.size || 10
    }
  },

  // 获取试卷列表 (别名)
  async getExamPaperList(params: ExamPaperListParams = {}): Promise<{ data: { items: ExamPaper[], totalPages: number, totalItems: number } }> {
    const response = await this.getExamPapers(params)
    return {
      data: {
        items: response.content || [],
        totalPages: response.totalPages || 0,
        totalItems: response.totalElements || 0
      }
    }
  },

  // 获取试卷详情
  async getExamPaper(id: number): Promise<ExamPaperDetail> {
    const response = await apiClient.get(`/api/teacher/exam-papers/${id}`)
    return response.data
  },

  // 创建试卷
  async createExamPaper(data: CreateExamPaperRequest): Promise<ExamPaper> {
    const response = await apiClient.post('/api/teacher/exam-papers', data)
    return response.data
  },

  // 更新试卷
  async updateExamPaper(id: number, data: Partial<CreateExamPaperRequest>): Promise<ExamPaper> {
    const url = `/api/teacher/exam-papers/${id}`
    console.log('=== updateExamPaper API调用 ===')
    console.log('URL:', url)
    console.log('方法: PUT')
    console.log('数据:', JSON.stringify(data, null, 2))
    console.log('BaseURL:', apiClient.defaults.baseURL)
    
    try {
      const response = await apiClient.put(url, data)
      console.log('API响应成功:', response)
      console.log('响应状态:', response.status)
      console.log('响应数据:', response.data)
      return response.data
    } catch (error: any) {
      console.error('API调用失败:', error)
      console.error('错误详情:', {
        message: error?.message,
        response: error?.response,
        request: error?.request,
        config: error?.config
      })
      throw error
    }
  },

  // 删除试卷
  async deleteExamPaper(id: number): Promise<void> {
    await apiClient.delete(`/api/teacher/exam-papers/${id}`)
  },

  // 智能组卷
  async generateExamPaper(data: GenerateExamPaperRequest): Promise<ExamPaper> {
    // 将GenerateExamPaperRequest转换为后端期望的ExamPaperRequest格式
    const requestData = {
      title: data.title,
      description: data.description,
      subjectId: data.subjectId,
      categoryId: data.categoryId,
      totalScore: data.totalScore,
      duration: data.duration || 120, // 使用请求中的时长，默认为120分钟
      questionRules: data.questionConfigs.map(config => ({
        categoryId: config.categoryIds.length > 0 ? config.categoryIds[0] : null, // 取第一个分类ID
        questionType: config.type,
        difficulty: mapDifficultyToNumber(config.difficulty),
        count: config.count,
        scorePerQuestion: config.scorePerQuestion
      }))
    }
    const response = await apiClient.post('/api/teacher/exam-papers/generate', requestData)
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
    // 将GenerateExamPaperRequest转换为后端期望的ExamPaperRequest格式
    const requestData = {
      title: data.title,
      description: data.description,
      subjectId: data.subjectId,
      categoryId: data.categoryId,
      totalScore: data.totalScore,
      duration: data.duration || DEFAULT_CONFIG.EXAM_PAPER.DURATION,
      questionRules: data.questionConfigs.map(config => ({
        categoryId: config.categoryIds.length > 0 ? config.categoryIds[0] : null,
        questionType: config.type,
        difficulty: mapDifficultyToNumber(config.difficulty),
        count: config.count,
        scorePerQuestion: config.scorePerQuestion
      }))
    }
    const response = await apiClient.post('/api/teacher/exam-papers/preview-generate', requestData)
    return response.data
  },

  // 复制试卷
  async copyExamPaper(id: number): Promise<ExamPaper> {
    const response = await apiClient.post(`/api/teacher/exam-papers/${id}/copy`)
    return response.data
  },

  // 获取试卷题目
  async getExamPaperQuestions(id: number): Promise<ExamPaperQuestion[]> {
    const response = await apiClient.get(`/api/teacher/exam-papers/${id}/questions`)
    return response.data
  },

  // 添加题目到试卷（批量）
  async addQuestionsToExamPaper(id: number, questionIds: number[]): Promise<void> {
    await apiClient.post(`/api/teacher/exam-papers/${id}/questions/batch`, questionIds)
  },

  // 从试卷移除题目
  async removeQuestionFromExamPaper(id: number, questionId: number): Promise<void> {
    await apiClient.delete(`/api/teacher/exam-papers/${id}/questions/${questionId}`)
  },

  // 批量移除题目
  async batchRemoveQuestions(id: number, questionIds: number[]): Promise<void> {
    await apiClient.delete(`/api/teacher/exam-papers/${id}/questions/batch`, { data: { questionIds } })
  },

  // 更新题目顺序
  async updateQuestionOrder(id: number, questionIds: number[]): Promise<void> {
    await apiClient.put(`/api/teacher/exam-papers/${id}/questions/order`, questionIds)
  },

  // 更新题目分值
  async updateQuestionScore(id: number, questionId: number, score: number): Promise<void> {
    await apiClient.put(`/api/teacher/exam-papers/${id}/questions/${questionId}/score`, { score })
  },

  // 批量更新题目分值
  async batchUpdateQuestionScores(id: number, scoreUpdates: { questionId: number, score: number }[]): Promise<void> {
    await apiClient.put(`/api/teacher/exam-papers/${id}/questions/batch/scores`, { scoreUpdates })
  }
}

// 辅助函数：将难度字符串转换为数字
function mapDifficultyToNumber(difficulty: string): number | null {
  switch (difficulty) {
    case 'easy':
      return 1
    case 'medium':
      return 2
    case 'hard':
      return 3
    case 'mixed':
    case 'random':
      return null // 混合或随机难度，后端会处理
    default:
      return null
  }
}

// 导出别名以保持兼容性
export const teacherExamPaperService = examPaperService
