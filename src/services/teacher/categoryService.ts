import { apiClient } from '../api'

export interface Category {
  id: number
  name: string
  description?: string
  parentId?: number
  level: number
  sortOrder: number
  createdAt: string
  children?: Category[]
}

export interface CategoryStatistics {
  categoryId: number
  totalQuestions: number
  easyQuestions: number
  mediumQuestions: number
  hardQuestions: number
  questionTypes: {
    CHOICE: number
    FILL_BLANK: number
    SHORT_ANSWER: number
    PROOF: number
  }
}

export interface CreateCategoryRequest {
  name: string
  description?: string
  parentId?: number
  sortOrder?: number
}

// 题目分类管理API
export const categoryService = {
  // 获取分类列表
  async getCategories(): Promise<Category[]> {
    const response = await apiClient.get('/api/question-categories')
    return response.data
  },

  // 获取分类树结构
  async getCategoryTree(): Promise<Category[]> {
    const response = await apiClient.get('/api/question-categories/tree')
    return response.data
  },

  // 获取顶级分类
  async getTopLevelCategories(): Promise<Category[]> {
    const response = await apiClient.get('/api/question-categories/top-level')
    return response.data
  },

  // 获取分类详情
  async getCategory(id: number): Promise<Category> {
    const response = await apiClient.get(`/api/question-categories/${id}`)
    return response.data
  },

  // 创建分类
  async createCategory(data: CreateCategoryRequest): Promise<Category> {
    const response = await apiClient.post('/api/question-categories', data)
    return response.data
  },

  // 更新分类
  async updateCategory(id: number, data: Partial<CreateCategoryRequest>): Promise<Category> {
    const response = await apiClient.put(`/api/question-categories/${id}`, data)
    return response.data
  },

  // 删除分类
  async deleteCategory(id: number): Promise<void> {
    await apiClient.delete(`/api/question-categories/${id}`)
  },

  // 移动分类
  async moveCategory(id: number, parentId: number | null): Promise<void> {
    await apiClient.put(`/api/question-categories/${id}/move`, { parentId })
  },

  // 批量删除分类
  async batchDeleteCategories(ids: number[]): Promise<void> {
    await apiClient.delete('/api/question-categories/batch', { data: { ids } })
  }
}

// 教师端分类管理API
export const teacherCategoryService = {
  // 获取分类统计信息
  async getCategoryStatistics(id: number): Promise<CategoryStatistics> {
    const response = await apiClient.get(`/api/teacher/categories/${id}/statistics`)
    return response.data
  },

  // 搜索分类
  async searchCategories(keyword: string): Promise<Category[]> {
    const response = await apiClient.get('/api/teacher/categories/search', {
      params: { keyword }
    })
    return response.data
  }
}
