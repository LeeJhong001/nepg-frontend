import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User, LoginRequest, RegisterRequest } from '../types/auth'
import { UserRole } from '../types/auth'
import { AuthService } from '../services/authService'

export const useAuthStore = defineStore('auth', () => {
  // 状态
  const user = ref<User | null>(null)
  const token = ref<string | null>(null)
  const loading = ref(false)

  // 计算属性
  const isAuthenticated = computed(() => !!token.value)

  // 初始化 - 从localStorage恢复状态
  const initialize = () => {
    const savedToken = AuthService.getToken()
    const savedUser = AuthService.getCurrentUser()

    if (savedToken && savedUser) {
      token.value = savedToken
      user.value = savedUser
    }
  }

  // 登录
  const login = async (credentials: LoginRequest) => {
    try {
      loading.value = true
      const response = await AuthService.login(credentials)

      if (response.token) {
        token.value = response.token
        localStorage.setItem('token', response.token)

        // 登录成功后，使用后端返回的用户信息
        if (!response.userInfo) {
          throw new Error('后端未返回用户信息，请检查后端配置')
        }

        const userInfo = response.userInfo

        user.value = userInfo
        localStorage.setItem('user', JSON.stringify(userInfo))

        return { success: true, message: response.message }
      } else {
        return { success: false, message: response.message }
      }
    } catch (error: any) {
      return { success: false, message: error.message }
    } finally {
      loading.value = false
    }
  }

  // 注册
  const register = async (userData: RegisterRequest) => {
    try {
      loading.value = true
      const response = await AuthService.register(userData)

      if (response.token) {
        token.value = response.token
        localStorage.setItem('token', response.token)

        // 注册成功后，使用后端返回的用户信息
        if (!response.userInfo) {
          throw new Error('后端未返回用户信息，请检查后端配置')
        }

        const userInfo = response.userInfo

        user.value = userInfo
        localStorage.setItem('user', JSON.stringify(userInfo))

        return { success: true, message: response.message }
      } else {
        return { success: false, message: response.message }
      }
    } catch (error: any) {
      return { success: false, message: error.message }
    } finally {
      loading.value = false
    }
  }

  // 登出
  const logout = () => {
    AuthService.logout()
    user.value = null
    token.value = null
  }

  // 清除错误状态
  const clearError = () => {
    // 可以添加错误状态管理
  }

  return {
    // 状态
    user,
    token,
    loading,

    // 计算属性
    isAuthenticated,

    // 方法
    initialize,
    login,
    register,
    logout,
    clearError,
  }
})
