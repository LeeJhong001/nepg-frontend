// 题目分类相关类型定义

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

export interface CreateCategoryRequest {
  name: string
  parentId?: number
  description?: string
  sortOrder?: number
  enabled?: boolean
}

export interface UpdateCategoryRequest {
  name?: string
  parentId?: number
  description?: string
  sortOrder?: number
  enabled?: boolean
}

// 题目相关类型定义

export enum QuestionType {
  SINGLE_CHOICE = 'SINGLE_CHOICE',
  MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
  TRUE_FALSE = 'TRUE_FALSE',
  SHORT_ANSWER = 'SHORT_ANSWER',
  ESSAY = 'ESSAY',
  FILL_BLANK = 'FILL_BLANK',
}

export enum QuestionDifficulty {
  EASY = 1,
  MEDIUM = 2,
  HARD = 3,
  VERY_HARD = 4,
}

export interface Question {
  id: number
  title: string
  content: string
  type: QuestionType
  difficulty: QuestionDifficulty
  categoryId: number
  answer: string
  analysis?: string
  options?: string[]
  score: number
  createdBy: number
  createdAt: string
  updatedAt: string
  category?: QuestionCategory
}

export interface CreateQuestionRequest {
  title: string
  content: string
  type: QuestionType
  difficulty: QuestionDifficulty
  categoryId: number
  answer: string
  analysis?: string
  options?: string[]
  score: number
}

export interface UpdateQuestionRequest {
  title?: string
  content?: string
  type?: QuestionType
  difficulty?: QuestionDifficulty
  categoryId?: number
  answer?: string
  analysis?: string
  options?: string[]
  score?: number
}

export interface QuestionQueryParams {
  page?: number
  size?: number
  categoryId?: number
  type?: QuestionType
  difficulty?: QuestionDifficulty
  keyword?: string
  createdBy?: number
}

export interface QuestionListResponse {
  content: Question[]
  totalElements: number
  totalPages: number
  size: number
  number: number
}
