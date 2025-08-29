import api from './authService'
import type {
  QuestionCategory,
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from '../types/question'

export class QuestionCategoryService {
  /**
   * 创建分类
   */
  static async createCategory(data: CreateCategoryRequest): Promise<QuestionCategory> {
    try {
      const response = await api.post<QuestionCategory>('/question-categories', data)
      return response.data
    } catch (error: any) {
      const message = error.response?.data?.message || error.response?.data || '创建分类失败'
      throw new Error(typeof message === 'string' ? message : '创建分类失败')
    }
  }

  /**
   * 更新分类
   */
  static async updateCategory(id: number, data: UpdateCategoryRequest): Promise<QuestionCategory> {
    try {
      const response = await api.put<QuestionCategory>(`/question-categories/${id}`, data)
      return response.data
    } catch (error: any) {
      const message = error.response?.data?.message || error.response?.data || '更新分类失败'
      throw new Error(typeof message === 'string' ? message : '更新分类失败')
    }
  }

  /**
   * 删除分类
   */
  static async deleteCategory(id: number): Promise<void> {
    try {
      await api.delete(`/question-categories/${id}`)
    } catch (error: any) {
      const message = error.response?.data?.message || error.response?.data || '删除分类失败'
      throw new Error(typeof message === 'string' ? message : '删除分类失败')
    }
  }

  /**
   * 获取分类树
   */
  static async getCategoryTree(): Promise<QuestionCategory[]> {
    try {
      const response = await api.get<QuestionCategory[]>('/question-categories/tree')
      return response.data
    } catch (error: any) {
      const message = error.response?.data?.message || error.response?.data || '获取分类树失败'
      throw new Error(typeof message === 'string' ? message : '获取分类树失败')
    }
  }

  /**
   * 获取启用的分类树（用于前端显示）
   */
  static async getEnabledCategoryTree(): Promise<QuestionCategory[]> {
    try {
      const response = await api.get<QuestionCategory[]>('/question-categories/tree/enabled')
      return response.data
    } catch (error: any) {
      const message = error.response?.data?.message || error.response?.data || '获取启用分类树失败'
      throw new Error(typeof message === 'string' ? message : '获取启用分类树失败')
    }
  }

  /**
   * 获取子分类
   */
  static async getSubCategories(parentId: number): Promise<QuestionCategory[]> {
    try {
      const response = await api.get<QuestionCategory[]>(`/question-categories/parent/${parentId}`)
      return response.data
    } catch (error: any) {
      const message = error.response?.data?.message || error.response?.data || '获取子分类失败'
      throw new Error(typeof message === 'string' ? message : '获取子分类失败')
    }
  }

  /**
   * 获取顶级分类
   */
  static async getTopLevelCategories(): Promise<QuestionCategory[]> {
    try {
      const response = await api.get<QuestionCategory[]>('/question-categories/top-level')
      return response.data
    } catch (error: any) {
      const message = error.response?.data?.message || error.response?.data || '获取顶级分类失败'
      throw new Error(typeof message === 'string' ? message : '获取顶级分类失败')
    }
  }

  /**
   * 检查分类是否可删除
   */
  static async canDeleteCategory(id: number): Promise<boolean> {
    try {
      const response = await api.get<boolean>(`/question-categories/${id}/can-delete`)
      return response.data
    } catch (error: any) {
      console.error('检查分类是否可删除失败:', error)
      return false
    }
  }

  /**
   * 获取分类详情
   */
  static async getCategory(id: number): Promise<QuestionCategory> {
    try {
      const response = await api.get<QuestionCategory>(`/question-categories/${id}`)
      return response.data
    } catch (error: any) {
      const message = error.response?.data?.message || error.response?.data || '获取分类详情失败'
      throw new Error(typeof message === 'string' ? message : '获取分类详情失败')
    }
  }
}
