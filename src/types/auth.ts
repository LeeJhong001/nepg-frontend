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
