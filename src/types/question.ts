// 题目类型枚举（与后端保持一致）
export enum QuestionType {
  CHOICE = 'CHOICE', // 选择题（包含单选和多选）
  FILL_BLANK = 'FILL_BLANK', // 填空题
  SHORT_ANSWER = 'SHORT_ANSWER', // 简答题
  PROOF = 'PROOF' // 证明题
}

// 难度等级枚举
export enum DifficultyLevel {
  EASY = 1, // 简单
  MEDIUM = 2, // 中等
  HARD = 3 // 困难
}

// 题目状态枚举
export enum QuestionStatus {
  ACTIVE = 'ACTIVE', // 启用
  INACTIVE = 'INACTIVE' // 禁用
}

// 选项接口
export interface QuestionOption {
  id?: number
  content: string
  isCorrect: boolean
  order: number
}

// 题目基础接口
export interface Question {
  id?: number
  title: string
  content: string
  type: QuestionType
  difficulty: DifficultyLevel
  categoryId: number
  categoryName?: string
  score: number
  correctAnswer: string
  explanation?: string
  options?: QuestionOption[] | string // 支持数组（前端）和字符串（后端）
  status: QuestionStatus
  createdBy?: string
  createdAt?: string
  updatedAt?: string
}

// 题目列表项接口
export interface QuestionListItem {
  id: number
  title: string
  type: QuestionType
  difficulty: DifficultyLevel
  categoryId: number
  categoryName: string
  score: number
  status: QuestionStatus
  createdBy: string
  createdAt: string
}

// 创建题目请求
export interface CreateQuestionRequest {
  title: string
  content: string
  type: QuestionType
  difficulty: DifficultyLevel
  categoryId: number
  score: number
  correctAnswer: string
  explanation?: string
  options?: QuestionOption[] | string // 支持数组和字符串格式
}

// 更新题目请求
export interface UpdateQuestionRequest extends CreateQuestionRequest {
  id: number
}

// 题目查询参数
export interface QuestionQueryParams {
  page?: number
  size?: number
  keyword?: string
  categoryId?: number
  type?: QuestionType
  difficulty?: DifficultyLevel
  status?: QuestionStatus
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

// 批量删除请求
export interface BatchDeleteRequest {
  ids: number[]
}

// 批量更新状态请求
export interface BatchUpdateStatusRequest {
  ids: number[]
  status: QuestionStatus
}

// 批量更新分类请求
export interface BatchUpdateCategoryRequest {
  ids: number[]
  categoryId: number
}

// 分页响应
export interface PageResponse<T> {
  content: T[]
  totalElements: number
  totalPages: number
  size: number
  number: number
  first: boolean
  last: boolean
}

// 题目列表响应
export interface QuestionListResponse extends PageResponse<QuestionListItem> {}

// 题目统计信息
export interface QuestionStatistics {
  totalQuestions: number
  activeQuestions: number
  inactiveQuestions: number
  typeDistribution: {
    [key in QuestionType]: number
  }
  difficultyDistribution: {
    [key in DifficultyLevel]: number
  }
  categoryDistribution: {
    categoryId: number
    categoryName: string
    count: number
  }[]
}

// 随机题目请求
export interface RandomQuestionRequest {
  count: number
  categoryId?: number
  type?: QuestionType
  difficulty?: DifficultyLevel
  excludeIds?: number[]
}

// 搜索建议响应
export interface SearchSuggestion {
  id: number
  title: string
  type: QuestionType
  categoryName: string
}

// 答案验证响应
export interface ValidateAnswerResponse {
  correct: boolean
  score: number
  feedback?: string
}

// 难度分布请求
export interface DifficultyDistributionRequest {
  categoryId: number
  easy: number
  medium: number
  hard: number
}

// 题目使用记录
export interface QuestionUsageHistory {
  id: number
  questionId: number
  userId: number
  userName: string
  usageType: 'EXAM' | 'PRACTICE' | 'HOMEWORK'
  score?: number
  isCorrect?: boolean
  usedAt: string
}

// 组卷配置
export interface PaperConfig {
  title: string
  categoryId?: number
  difficultyDistribution: {
    easy: number
    medium: number
    hard: number
  }
  typeDistribution: {
    [key in QuestionType]: number
  }
  totalScore: number
  duration: number // 考试时长（分钟）
}

// 试卷题目
export interface PaperQuestion {
  question: Question
  order: number
  score: number
}

// 试卷
export interface Paper {
  id?: number
  title: string
  config: PaperConfig
  questions: PaperQuestion[]
  totalScore: number
  createdAt?: string
}

// 题目分类接口
export interface QuestionCategory {
  id: number
  name: string
  parentId?: number
  description?: string
  sortOrder: number
  enabled: boolean
  createdAt: string
  updatedAt: string
  children?: QuestionCategory[]
}

// 创建分类请求
export interface CreateCategoryRequest {
  name: string
  parentId?: number
  description?: string
  sortOrder?: number
  enabled?: boolean
}

// 更新分类请求
export interface UpdateCategoryRequest {
  name?: string
  parentId?: number
  description?: string
  sortOrder?: number
  enabled?: boolean
}

// API响应格式
export interface ApiResponse<T> {
  success: boolean
  message: string
  data?: T
  code?: number
}
