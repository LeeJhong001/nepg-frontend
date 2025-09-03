import { apiClient } from '../api'

export interface Exam {
  id: number
  title: string
  description?: string
  startTime: string
  endTime: string
  duration: number
  totalScore: number
  status: 'DRAFT' | 'PUBLISHED' | 'ONGOING' | 'FINISHED' | 'CANCELLED'
  subjectId: number
  subjectName?: string
  createdAt: string
  updatedAt: string
}

export interface ExamListParams {
  page?: number
  size?: number
  status?: string
  keyword?: string
}

export interface ExamListResponse {
  content: Exam[]
  totalElements: number
  totalPages: number
  currentPage: number
  pageSize: number
}

export interface CreateExamRequest {
  title: string
  description?: string
  startTime: string
  endTime: string
  duration: number
  totalScore: number
  subjectId: number
}

export interface ExamStatistics {
  examId: number
  totalStudents: number
  submittedCount: number
  averageScore: number
  maxScore: number
  minScore: number
  passRate: number
  scoreDistribution: {
    range: string
    count: number
  }[]
  questionAnalysis: {
    questionId: number
    questionTitle: string
    correctRate: number
    averageScore: number
  }[]
}

// 考试管理API
export const examService = {
  // 获取考试列表
  async getExams(params: ExamListParams = {}): Promise<ExamListResponse> {
    const response = await apiClient.get('/api/teacher/exams', { params })
    return response.data
  },

  // 获取考试详情
  async getExam(id: number): Promise<Exam> {
    const response = await apiClient.get(`/api/teacher/exams/${id}`)
    return response.data
  },

  // 创建考试
  async createExam(data: CreateExamRequest): Promise<Exam> {
    const response = await apiClient.post('/api/teacher/exams', data)
    return response.data
  },

  // 更新考试
  async updateExam(id: number, data: Partial<CreateExamRequest>): Promise<Exam> {
    const response = await apiClient.put(`/api/teacher/exams/${id}`, data)
    return response.data
  },

  // 删除考试
  async deleteExam(id: number): Promise<void> {
    await apiClient.delete(`/api/teacher/exams/${id}`)
  },

  // 发布考试
  async publishExam(id: number): Promise<void> {
    await apiClient.post(`/api/teacher/exams/${id}/publish`)
  },

  // 取消考试
  async cancelExam(id: number): Promise<void> {
    await apiClient.post(`/api/teacher/exams/${id}/cancel`)
  },

  // 归档考试
  async archiveExam(id: number): Promise<void> {
    await apiClient.post(`/api/teacher/exams/${id}/archive`)
  },

  // 复制考试
  async copyExam(id: number): Promise<Exam> {
    const response = await apiClient.post(`/api/teacher/exams/${id}/copy`)
    return response.data
  },

  // 获取考试统计
  async getExamStatistics(id: number): Promise<ExamStatistics> {
    const response = await apiClient.get(`/api/teacher/exams/${id}/statistics`)
    return response.data
  },

  // 批量删除考试
  async batchDeleteExams(ids: number[]): Promise<void> {
    await apiClient.delete('/api/teacher/exams/batch', { data: { ids } })
  },

  // 导出考试成绩
  async exportExamResults(id: number): Promise<Blob> {
    const response = await apiClient.get(`/api/teacher/exams/${id}/export`, {
      responseType: 'blob'
    })
    return response.data
  }
}
