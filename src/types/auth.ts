// 认证相关类型定义

export interface LoginRequest {
  username: string
  password: string
}

export interface RegisterRequest {
  username: string
  password: string
  email: string
  realName: string
  role?: UserRole
}

/**
 * 用户信息响应 DTO
 */
export interface UserInfoResponse {
  id: number
  username: string
  realName: string
  email: string
  phone?: string
  role: UserRole
  roleDisplayName?: string
  status?: string
  statusDisplayName?: string
  createdAt: string
  updatedAt: string
}

/**
 * 认证响应
 */
export interface AuthResponse {
  token: string
  tokenType: string
  expiresIn: number
  message: string
  userInfo?: UserInfoResponse // 后端字段名是userInfo
}

export enum UserRole {
  STUDENT = 'STUDENT',
  TEACHER = 'TEACHER',
  ADMIN = 'ADMIN',
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export interface User {
  id: number
  username: string
  email: string
  realName: string
  phone?: string
  role: UserRole
  roleDisplayName?: string
  status?: string
  statusDisplayName?: string
  createdAt: string
  updatedAt: string
}

export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  loading: boolean
}

// =============== 用户管理相关类型定义 ===============

/**
 * 用户查询参数
 */
export interface UserQueryParams {
  current?: number
  size?: number
  username?: string
  realName?: string
  email?: string
  role?: UserRole
  status?: UserStatus
  sortField?: string
  sortOrder?: 'asc' | 'desc'
}

/**
 * 分页响应格式 (匹配后端 PageResponse)
 */
export interface PageResponse<T> {
  records: T[]
  total: number
  size: number
  current: number
  pages: number
  hasPrevious: boolean
  hasNext: boolean
}

/**
 * 用户列表响应 (匹配后端 UserListResponse)
 */
export interface UserListResponse {
  id: number
  username: string
  realName: string
  email: string
  role: UserRole
  roleDisplayName?: string
  status: UserStatus
  statusDisplayName?: string
  createdAt: string
  updatedAt: string
}

/**
 * 用户分页响应
 */
export type UserPageResponse = PageResponse<UserListResponse>

/**
 * 创建用户请求
 */
export interface CreateUserRequest {
  username: string
  password: string
  realName: string
  email: string
  role: UserRole
}

/**
 * 更新用户请求
 */
export interface UpdateUserRequest {
  username?: string
  password?: string
  realName?: string
  email?: string
  role?: UserRole
  status?: UserStatus
}

/**
 * 重置密码请求
 */
export interface ResetPasswordRequest {
  newPassword: string
}

/**
 * 批量删除用户请求 (匹配后端格式)
 */
export interface BatchDeleteUsersRequest {
  ids: number[]
}

/**
 * 用户统计信息 (匹配后端格式)
 */
export interface UserStatistics {
  totalUsers: number
  // 后端目前只返回总用户数，其他字段可以后续扩展
}

/**
 * API响应格式
 */
export interface ApiResponse<T = any> {
  success: boolean
  message: string
  data?: T
}
