import { apiClient } from '../api.ts'

export interface Category {
  id: number
  name: string
  description?: string
  parentId?: number
  level?: number
  sortOrder: number
  enabled: boolean
  createdAt: string
  updatedAt?: string
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
  enabled?: boolean
}

export interface UpdateCategoryRequest extends CreateCategoryRequest {}

// 教师端分类管理API
export const categoryService = {
  // 创建分类
  async createCategory(data: CreateCategoryRequest): Promise<Category> {
    const response = await apiClient.post('/api/teacher/categories', data)
    return response.data
  },

  // 更新分类
  async updateCategory(id: number, data: UpdateCategoryRequest): Promise<Category> {
    const response = await apiClient.put(`/api/teacher/categories/${id}`, data)
    return response.data
  },

  // 删除分类
  async deleteCategory(id: number): Promise<void> {
    await apiClient.delete(`/api/teacher/categories/${id}`)
  },

  // 根据ID获取分类详情
  async getCategoryById(id: number): Promise<Category> {
    const response = await apiClient.get(`/api/teacher/categories/${id}`)
    return response.data
  },

  // 获取分类树（用于教师管理界面）
  async getCategoryTree(): Promise<Category[]> {
    const response = await apiClient.get('/api/teacher/categories/tree')
    return response.data
  },

  // 获取启用的分类树（用于题目分类选择）
  async getEnabledCategoryTree(): Promise<Category[]> {
    const response = await apiClient.get('/api/teacher/categories/tree/enabled')
    return response.data
  },

  // 获取顶级分类
  async getTopLevelCategories(): Promise<Category[]> {
    const response = await apiClient.get('/api/teacher/categories/top-level')
    return response.data
  },

  // 根据父分类获取子分类
  async getCategoriesByParent(parentId: number): Promise<Category[]> {
    const response = await apiClient.get(`/api/teacher/categories/parent/${parentId}`)
    return response.data
  },

  // 检查分类是否可以删除
  async canDeleteCategory(id: number): Promise<boolean> {
    const response = await apiClient.get(`/api/teacher/categories/${id}/can-delete`)
    return response.data
  },

  // 批量启用/禁用分类
  async batchUpdateCategoryStatus(ids: number[], enabled: boolean): Promise<void> {
    await apiClient.put('/api/teacher/categories/batch/status', ids, {
      params: { enabled }
    })
  },

  // 移动分类到新的父分类下
  async moveCategory(id: number, newParentId?: number): Promise<Category> {
    const response = await apiClient.put(`/api/teacher/categories/${id}/move`, {}, {
      params: { newParentId }
    })
    return response.data
  },

  // 批量更新分类排序
  async batchUpdateCategorySort(sortMap: Record<number, number>): Promise<void> {
    await apiClient.put('/api/teacher/categories/batch/sort', sortMap)
  },

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
  },

  // 获取分类列表（兼容性方法）
  async getCategories(): Promise<Category[]> {
    return this.getCategoryTree()
  }
}

// 导出别名以保持兼容性
export const teacherCategoryService = categoryService
