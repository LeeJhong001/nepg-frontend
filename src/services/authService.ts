import axios from 'axios'
import type { AxiosInstance, AxiosResponse } from 'axios'
import type { LoginRequest, RegisterRequest, AuthResponse, User } from '../types/auth'
import { config } from '../config'

// 创建axios实例
const api: AxiosInstance = axios.create({
  baseURL: config.apiBaseUrl,
  timeout: config.timeout,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 请求拦截器 - 添加token到请求头
api.interceptors.request.use(
  (config) => {
    console.log('=== 发送请求 ===')
    console.log('请求URL:', config.url)
    console.log('请求方法:', config.method)
    console.log('请求头:', config.headers)
    console.log('请求数据:', config.data)
    console.log('=== 请求结束 ===')

    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    console.error('请求拦截器错误:', error)
    return Promise.reject(error)
  },
)

// 响应拦截器 - 处理token过期等错误
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      // token过期，清除本地存储并跳转到登录页
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  },
)

export class AuthService {
  /**
   * 用户登录
   */
  static async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      console.log('发送登录请求:', credentials)
      console.log('请求URL:', `${config.apiBaseUrl}/auth/login`)

      const response = await api.post<AuthResponse>('/auth/login', credentials)
      console.log('登录响应:', response.data)
      return response.data
    } catch (error: any) {
      console.error('=== 登录错误详细信息 ===')
      console.error('错误类型:', error.constructor.name)
      console.error('错误消息:', error.message)
      console.error('错误状态码:', error.response?.status)
      console.error('错误状态文本:', error.response?.statusText)
      console.error('错误响应头:', error.response?.headers)
      console.error('错误响应数据:', error.response?.data)
      console.error('请求配置:', error.config)
      console.error('请求URL:', error.config?.url)
      console.error('请求方法:', error.config?.method)
      console.error('请求数据:', error.config?.data)
      console.error('完整错误对象:', JSON.stringify(error, null, 2))
      console.error('=== 错误信息结束 ===')

      // 尝试获取更详细的错误信息
      let errorMessage = '登录失败'
      if (error.response?.data) {
        if (typeof error.response.data === 'string') {
          errorMessage = error.response.data
        } else if (error.response.data.message) {
          errorMessage = error.response.data.message
        } else if (error.response.data.error) {
          errorMessage = error.response.data.error
        } else if (error.response.data.detail) {
          errorMessage = error.response.data.detail
        }
      }

      // 如果没有具体错误信息，添加状态码
      if (errorMessage === '登录失败' && error.response?.status) {
        errorMessage = `登录失败 (HTTP ${error.response.status})`
      }

      throw new Error(errorMessage)
    }
  }

  /**
   * 用户注册
   */
  static async register(userData: RegisterRequest): Promise<AuthResponse> {
    try {
      console.log('发送注册请求:', userData)
      console.log('请求URL:', `${config.apiBaseUrl}/auth/register`)

      const response = await api.post<AuthResponse>('/auth/register', userData)
      console.log('注册响应:', response.data)
      return response.data
    } catch (error: any) {
      console.error('注册错误详情:', error)
      console.error('错误响应:', error.response?.data)
      throw new Error(error.response?.data?.message || '注册失败')
    }
  }

  /**
   * 获取用户信息
   */
  static async getUserInfo(): Promise<User> {
    try {
      // 从localStorage获取用户信息
      const userStr = localStorage.getItem('user')
      if (userStr) {
        return JSON.parse(userStr)
      }

      throw new Error('未找到用户信息')
    } catch (error: any) {
      throw new Error('获取用户信息失败')
    }
  }

  /**
   * 登出
   */
  static logout(): void {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  /**
   * 检查是否已认证
   */
  static isAuthenticated(): boolean {
    return !!localStorage.getItem('token')
  }

  /**
   * 获取当前token
   */
  static getToken(): string | null {
    return localStorage.getItem('token')
  }

  /**
   * 获取当前用户
   */
  static getCurrentUser(): User | null {
    const userStr = localStorage.getItem('user')
    return userStr ? JSON.parse(userStr) : null
  }
}

export default api
