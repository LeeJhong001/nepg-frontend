import axios from 'axios'
import { useAuthStore } from '../stores/auth'
import { extractErrorMessage } from '../utils/errorHandler'

// 创建 axios 实例
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器 - 添加认证 token
apiClient.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore()
    if (authStore.token) {
      config.headers.Authorization = `Bearer ${authStore.token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器 - 处理认证错误和统一错误格式化
apiClient.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    // 处理401认证错误
    if (error.response?.status === 401) {
      // Token 过期或无效，清除认证状态
      const authStore = useAuthStore()
      authStore.logout()
      // 重定向到登录页
      window.location.href = '/login'
      return Promise.reject(error)
    }

    // 为所有错误添加详细的错误消息
    // 这样在catch中访问error.message就能获取到详细错误信息
    const errorMessage = extractErrorMessage(error)
    // 将详细错误消息添加到error对象上，方便在catch中使用
    error.detailedMessage = errorMessage
    // 同时更新message，确保向后兼容
    if (error.response) {
      // 有响应的情况
      if (!error.message || error.message === 'Request failed with status code ' + error.response.status) {
        error.message = errorMessage
      }
    } else {
      // 没有响应的情况（网络错误等）
      error.message = errorMessage
    }

    return Promise.reject(error)
  }
)

export default apiClient
