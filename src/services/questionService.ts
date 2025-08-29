import api from './authService'
import type {
  Question,
  CreateQuestionRequest,
  UpdateQuestionRequest,
  QuestionQueryParams,
  QuestionListResponse,
} from '../types/question'

export class QuestionService {
  /**
   * 创建题目
   */
  static async createQuestion(data: CreateQuestionRequest): Promise<Question> {
    try {
      const response = await api.post<Question>('/questions', data)
      return response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.message || '创建题目失败')
    }
  }

  /**
   * 更新题目
   */
  static async updateQuestion(id: number, data: UpdateQuestionRequest): Promise<Question> {
    try {
      const response = await api.put<Question>(`/questions/${id}`, data)
      return response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.message || '更新题目失败')
    }
  }

  /**
   * 删除题目
   */
  static async deleteQuestion(id: number): Promise<void> {
    try {
      await api.delete(`/questions/${id}`)
    } catch (error: any) {
      throw new Error(error.response?.data?.message || '删除题目失败')
    }
  }

  /**
   * 批量删除题目
   */
  static async batchDeleteQuestions(ids: number[]): Promise<void> {
    try {
      await api.delete('/questions/batch', { data: ids })
    } catch (error: any) {
      throw new Error(error.response?.data?.message || '批量删除题目失败')
    }
  }

  /**
   * 获取题目详情
   */
  static async getQuestion(id: number): Promise<Question> {
    try {
      const response = await api.get<Question>(`/questions/${id}`)
      return response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.message || '获取题目详情失败')
    }
  }

  /**
   * 分页查询题目
   */
  static async getQuestions(params: QuestionQueryParams): Promise<QuestionListResponse> {
    try {
      const response = await api.get<QuestionListResponse>('/questions', { params })
      return response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.message || '获取题目列表失败')
    }
  }

  /**
   * 根据分类获取题目
   */
  static async getQuestionsByCategory(
    categoryId: number,
    params?: Omit<QuestionQueryParams, 'categoryId'>,
  ): Promise<QuestionListResponse> {
    try {
      const response = await api.get<QuestionListResponse>(`/questions/category/${categoryId}`, {
        params,
      })
      return response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.message || '获取分类题目失败')
    }
  }

  /**
   * 根据创建者获取题目
   */
  static async getQuestionsByCreator(
    createdById: number,
    params?: Omit<QuestionQueryParams, 'createdBy'>,
  ): Promise<QuestionListResponse> {
    try {
      const response = await api.get<QuestionListResponse>(`/questions/creator/${createdById}`, {
        params,
      })
      return response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.message || '获取创建者题目失败')
    }
  }
}
