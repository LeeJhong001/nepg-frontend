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
      throw new Error(error.response?.data?.message || '创建分类失败')
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
      throw new Error(error.response?.data?.message || '更新分类失败')
    }
  }

  /**
   * 删除分类
   */
  static async deleteCategory(id: number): Promise<void> {
    try {
      await api.delete(`/question-categories/${id}`)
    } catch (error: any) {
      throw new Error(error.response?.data?.message || '删除分类失败')
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
      throw new Error(error.response?.data?.message || '获取分类树失败')
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
      throw new Error(error.response?.data?.message || '获取子分类失败')
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
      throw new Error(error.response?.data?.message || '获取顶级分类失败')
    }
  }

  /**
   * 检查分类是否可删除
   */
  static async canDeleteCategory(id: number): Promise<boolean> {
    try {
      const response = await api.get<{ canDelete: boolean }>(
        `/question-categories/${id}/can-delete`,
      )
      return response.data.canDelete
    } catch (error: any) {
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
      throw new Error(error.response?.data?.message || '获取分类详情失败')
    }
  }
}
