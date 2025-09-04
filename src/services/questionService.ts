import axios from 'axios'
import type {
  Question,
  QuestionListItem,
  CreateQuestionRequest,
  UpdateQuestionRequest,
  QuestionQueryParams,
  QuestionListResponse,
  QuestionStatistics,
  RandomQuestionRequest,
  SearchSuggestion,
  ValidateAnswerResponse,
  BatchDeleteRequest,
  BatchUpdateStatusRequest,
  BatchUpdateCategoryRequest,
  DifficultyDistributionRequest,
  QuestionUsageHistory,
  QuestionOption,
  ApiResponse
} from '../types/question'
import { QuestionStatus } from '../types/question'
import { config } from '../config'
import { QuestionCategoryService } from './questionCategoryService'

// 创建axios实例
const api = axios.create({
  baseURL: config.apiBaseUrl,
  timeout: config.timeout,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // 启用cookie以接收CSRF token
})

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
api.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    console.error('API Error:', error)
    const message = error.response?.data?.message || error.message || '请求失败'
    return Promise.reject(new Error(message))
  }
)

export class QuestionService {
  // 辅助函数：根据分类ID获取分类名称
  private static async getCategoryName(categoryId: number | null): Promise<string> {
    if (!categoryId) return '未分类'
    
    try {
      const categories = await QuestionCategoryService.getCategoryTree()
      const findCategory = (cats: any[], id: number): any => {
        for (const cat of cats) {
          if (cat.id === id) return cat
          if (cat.children && cat.children.length > 0) {
            const found = findCategory(cat.children, id)
            if (found) return found
          }
        }
        return null
      }
      
      const category = findCategory(categories, categoryId)
      return category ? category.name : '未分类'
    } catch (error) {
      console.error('Failed to get category name:', error)
      return '未分类'
    }
  }

  // 辅助函数：根据用户ID获取用户名称
  private static async getUserName(userId: number | null): Promise<string> {
    if (!userId) return '未知用户'
    
    try {
      // 使用用户服务获取用户信息
      const { UserService } = await import('./userService')
      const user = await UserService.getUserById(userId)
      return user.realName || user.username || '未知用户'
    } catch (error) {
      console.error('Failed to get user name:', error)
      return '未知用户'
    }
  }

  // 获取题目列表
  static async getQuestionList(params: QuestionQueryParams): Promise<QuestionListResponse> {
    try {
      console.log('Fetching question list with params:', params)
      const response = await api.get('/questions', { params }) as any
      console.log('Question list response:', response)
      
      // 转换后端数据格式为前端期望的格式
      const mappedRecords = await Promise.all((response.records || []).map(async (item: any) => {
        const categoryName = item.categoryName || await this.getCategoryName(item.categoryId)
        const createdByName = item.createdByName || await this.getUserName(item.createdById)
        return {
          id: item.id,
          title: item.title,
          type: item.type,
          difficulty: item.difficulty,
          categoryId: item.categoryId,
          categoryName: categoryName,
          score: item.score,
          status: QuestionStatus.ACTIVE, // 后端未返回状态，设置默认值
          createdBy: createdByName,
          createdAt: item.createdAt
        }
      }))
      
      return {
        content: mappedRecords,
        totalElements: response.total || 0,
        totalPages: response.pages || 0,
        size: response.size || 10,
        number: (response.current || 1) - 1, // 后端从1开始，前端从0开始
        first: (response.current || 1) === 1,
        last: (response.current || 1) === (response.pages || 1)
      }
    } catch (error) {
      console.error('Failed to fetch question list:', error)
      throw error
    }
  }

  // 获取题目详情
  static async getQuestionById(id: number): Promise<Question> {
    try {
      console.log('Fetching question by id:', id)
      const response = await api.get(`/questions/${id}`) as any
      console.log('Question detail response:', response)
      
      // 获取分类名称和创建者名称
      const categoryName = response.categoryName || await this.getCategoryName(response.categoryId)
      const createdByName = response.createdByName || await this.getUserName(response.createdById)
      
      // 解析选项字段
      let parsedOptions: QuestionOption[] | undefined = undefined
      if (response.options && typeof response.options === 'string') {
        try {
          const optionsArray = JSON.parse(response.options)
          if (Array.isArray(optionsArray)) {
            parsedOptions = optionsArray.map((option, index) => ({
              content: option,
              isCorrect: response.answer === String.fromCharCode(65 + index), // A, B, C, D...
              order: index + 1
            }))
          }
        } catch (error) {
          console.error('Failed to parse options:', error)
        }
      }
      
      // 转换后端字段名为前端期望的格式
      return {
        id: response.id,
        title: response.title,
        content: response.content,
        type: response.type,
        difficulty: response.difficulty,
        categoryId: response.categoryId,
        categoryName: categoryName,
        score: response.score,
        correctAnswer: response.answer || '', // 后端字段名是answer
        explanation: response.analysis || '', // 后端字段名是analysis
        options: parsedOptions, // 解析后的选项数组
        status: QuestionStatus.ACTIVE, // 默认状态
        createdBy: createdByName,
        createdAt: response.createdAt,
        updatedAt: response.updatedAt
      }
    } catch (error) {
      console.error('Failed to fetch question detail:', error)
      throw error
    }
  }

  // 创建题目
  static async createQuestion(data: CreateQuestionRequest): Promise<Question> {
    try {
      console.log('Creating question:', data)
      
      // 转换前端字段名为后端期望的格式
      const backendData = {
        title: data.title,
        content: data.content,
        type: data.type,
        difficulty: data.difficulty,
        categoryId: data.categoryId,
        score: data.score,
        answer: data.correctAnswer, // 前端correctAnswer → 后端answer
        analysis: data.explanation, // 前端explanation → 后端analysis
        options: data.options
      }
      
      console.log('Backend data being sent:', backendData)
      
      const response = await api.post('/questions', backendData) as any
      console.log('Create question response:', response)
      
      // 获取分类名称
      const categoryName = response.categoryName || await this.getCategoryName(response.categoryId)
      
      // 返回转换后的数据格式
      return {
        id: response.id,
        title: response.title,
        content: response.content,
        type: response.type,
        difficulty: response.difficulty,
        categoryId: response.categoryId,
        categoryName: categoryName,
        score: response.score,
        correctAnswer: response.answer || '',
        explanation: response.analysis || '',
        options: response.options,
        status: QuestionStatus.ACTIVE,
        createdBy: response.createdByName || '未知',
        createdAt: response.createdAt,
        updatedAt: response.updatedAt
      }
    } catch (error) {
      console.error('Failed to create question:', error)
      throw error
    }
  }

  // 更新题目
  static async updateQuestion(id: number, data: UpdateQuestionRequest): Promise<Question> {
    try {
      console.log('Updating question:', id, data)
      
      // 转换前端字段名为后端期望的格式
      const backendData = {
        title: data.title,
        content: data.content,
        type: data.type,
        difficulty: data.difficulty,
        categoryId: data.categoryId,
        score: data.score,
        answer: data.correctAnswer, // 前端correctAnswer → 后端answer
        analysis: data.explanation, // 前端explanation → 后端analysis
        options: data.options
      }
      
      const response = await api.put(`/questions/${id}`, backendData) as any
      console.log('Update question response:', response)
      
      // 获取分类名称
      const categoryName = response.categoryName || await this.getCategoryName(response.categoryId)
      
      // 返回转换后的数据格式
      return {
        id: response.id,
        title: response.title,
        content: response.content,
        type: response.type,
        difficulty: response.difficulty,
        categoryId: response.categoryId,
        categoryName: categoryName,
        score: response.score,
        correctAnswer: response.answer || '',
        explanation: response.analysis || '',
        options: response.options,
        status: QuestionStatus.ACTIVE,
        createdBy: response.createdByName || '未知',
        createdAt: response.createdAt,
        updatedAt: response.updatedAt
      }
    } catch (error) {
      console.error('Failed to update question:', error)
      throw error
    }
  }

  // 删除题目
  static async deleteQuestion(id: number): Promise<void> {
    try {
      console.log('Deleting question:', id)
      await api.delete(`/questions/${id}`)
      console.log('Delete question success')
    } catch (error) {
      console.error('Failed to delete question:', error)
      throw error
    }
  }

  // 复制题目
  static async copyQuestion(id: number): Promise<Question> {
    try {
      console.log('Copying question:', id)
      const response = await api.post(`/questions/${id}/copy`) as any
      console.log('Copy question response:', response)
      return response
    } catch (error) {
      console.error('Failed to copy question:', error)
      throw error
    }
  }

  // 批量删除题目
  static async batchDeleteQuestions(data: BatchDeleteRequest): Promise<void> {
    try {
      console.log('Batch deleting questions:', data)
      await api.delete('/questions/batch', { data })
      console.log('Batch delete questions success')
    } catch (error) {
      console.error('Failed to batch delete questions:', error)
      throw error
    }
  }

  // 批量更新状态
  static async batchUpdateStatus(data: BatchUpdateStatusRequest): Promise<void> {
    try {
      console.log('Batch updating status:', data)
      await api.put('/questions/batch/status', data.ids, {
        params: { enabled: data.status === 'ACTIVE' }
      })
      console.log('Batch update status success')
    } catch (error) {
      console.error('Failed to batch update status:', error)
      throw error
    }
  }

  // 批量更新分类
  static async batchUpdateCategory(data: BatchUpdateCategoryRequest): Promise<void> {
    try {
      console.log('Batch updating category:', data)
      await api.put('/questions/batch/category', data.ids, {
        params: { categoryId: data.categoryId }
      })
      console.log('Batch update category success')
    } catch (error) {
      console.error('Failed to batch update category:', error)
      throw error
    }
  }

  // 随机获取题目
  static async getRandomQuestions(params: RandomQuestionRequest): Promise<Question[]> {
    try {
      console.log('Getting random questions:', params)
      const response = await api.get('/questions/random', { params }) as any
      console.log('Random questions response:', response)
      return response
    } catch (error) {
      console.error('Failed to get random questions:', error)
      throw error
    }
  }

  // 获取统计信息
  static async getStatistics(): Promise<QuestionStatistics> {
    try {
      console.log('Getting question statistics')
      const response = await api.get('/questions/statistics') as any
      console.log('Statistics response:', response)
      return response
    } catch (error) {
      console.error('Failed to get statistics:', error)
      throw error
    }
  }

  // 根据分类ID获取题目
  static async getQuestionsByCategory(categoryId: number): Promise<Question[]> {
    try {
      console.log('Getting questions by category:', categoryId)
      const response = await api.get(`/questions/category/${categoryId}`) as any
      console.log('Questions by category response:', response)
      return response
    } catch (error) {
      console.error('Failed to get questions by category:', error)
      throw error
    }
  }

  // 根据创建者ID获取题目
  static async getQuestionsByCreator(createdById: number): Promise<Question[]> {
    try {
      console.log('Getting questions by creator:', createdById)
      const response = await api.get(`/questions/creator/${createdById}`) as any
      console.log('Questions by creator response:', response)
      return response
    } catch (error) {
      console.error('Failed to get questions by creator:', error)
      throw error
    }
  }

  // 根据难度分布获取题目
  static async getQuestionsByDifficultyDistribution(params: DifficultyDistributionRequest): Promise<Question[]> {
    try {
      console.log('Getting questions by difficulty distribution:', params)
      const response = await api.get('/questions/difficulty-distribution', { params }) as any
      console.log('Questions by difficulty distribution response:', response)
      return response
    } catch (error) {
      console.error('Failed to get questions by difficulty distribution:', error)
      throw error
    }
  }

  // 获取题目使用记录
  static async getQuestionUsageHistory(questionId: number): Promise<QuestionUsageHistory[]> {
    try {
      console.log('Getting question usage history:', questionId)
      const response = await api.get(`/questions/${questionId}/usage-history`) as any
      console.log('Question usage history response:', response)
      return response
    } catch (error) {
      console.error('Failed to get question usage history:', error)
      throw error
    }
  }

  // 获取搜索建议
  static async getSearchSuggestions(keyword: string): Promise<SearchSuggestion[]> {
    try {
      console.log('Getting search suggestions:', keyword)
      const response = await api.get('/questions/search-suggestions', {
        params: { keyword }
      }) as any
      console.log('Search suggestions response:', response)
      return response
    } catch (error) {
      console.error('Failed to get search suggestions:', error)
      throw error
    }
  }

  // 验证答案
  static async validateAnswer(questionId: number, userAnswer: string): Promise<ValidateAnswerResponse> {
    try {
      console.log('Validating answer for question:', questionId, 'answer:', userAnswer)
      const response = await api.post(`/questions/${questionId}/validate`, null, {
        params: { userAnswer }
      }) as any
      console.log('Validate answer response:', response)
      return response
    } catch (error) {
      console.error('Failed to validate answer:', error)
      throw error
    }
  }
}

// 导出默认实例
export default QuestionService
