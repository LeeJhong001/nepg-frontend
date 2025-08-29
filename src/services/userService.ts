import api from './authService'
import type {
  UserQueryParams,
  UserPageResponse,
  UserInfoResponse,
  UserListResponse,
  CreateUserRequest,
  UpdateUserRequest,
  ResetPasswordRequest,
  BatchDeleteUsersRequest,
  UserStatistics,
  ApiResponse,
} from '../types/auth'

export class UserService {
  /**
   * 分页查询用户列表
   */
  static async getUserList(params: UserQueryParams): Promise<UserPageResponse> {
    try {
      console.log('请求用户列表，baseURL:', api.defaults.baseURL, '路径: /admin/users')
      console.log('请求参数:', params)
      // 后端成功时直接返回分页数据，不包装在 {success, message, data} 中
      const response = await api.get<UserPageResponse>('/admin/users', { params })
      console.log('用户列表响应:', response.data)
      return response.data
    } catch (error: any) {
      console.error('获取用户列表失败 - 状态码:', error.response?.status)
      console.error('获取用户列表失败 - 响应数据:', error.response?.data)
      console.error('获取用户列表失败 - 错误:', error)
      const message = error.response?.data?.message || error.response?.data || '获取用户列表失败'
      throw new Error(typeof message === 'string' ? message : '获取用户列表失败')
    }
  }

  /**
   * 根据ID获取用户详情
   */
  static async getUserById(id: number): Promise<UserInfoResponse> {
    try {
      // 后端成功时直接返回用户数据，不包装在 {success, message, data} 中
      const response = await api.get<UserInfoResponse>(`/admin/users/${id}`)
      return response.data
    } catch (error: any) {
      const message = error.response?.data?.message || error.response?.data || '获取用户详情失败'
      throw new Error(typeof message === 'string' ? message : '获取用户详情失败')
    }
  }

  /**
   * 创建新用户
   */
  static async createUser(data: CreateUserRequest): Promise<UserInfoResponse> {
    try {
      const response = await api.post<{success: boolean, message: string, data: UserInfoResponse}>('/admin/users', data)
      if (response.data.success) {
        return response.data.data
      } else {
        throw new Error(response.data.message || '创建用户失败')
      }
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message)
      }
      const message = error.response?.data || error.message || '创建用户失败'
      throw new Error(typeof message === 'string' ? message : '创建用户失败')
    }
  }

  /**
   * 更新用户信息
   */
  static async updateUser(id: number, data: UpdateUserRequest): Promise<UserInfoResponse> {
    try {
      const response = await api.put<{success: boolean, message: string, data: UserInfoResponse}>(`/admin/users/${id}`, data)
      if (response.data.success) {
        return response.data.data
      } else {
        throw new Error(response.data.message || '更新用户失败')
      }
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message)
      }
      const message = error.response?.data || error.message || '更新用户失败'
      throw new Error(typeof message === 'string' ? message : '更新用户失败')
    }
  }

  /**
   * 删除用户
   */
  static async deleteUser(id: number): Promise<void> {
    try {
      const response = await api.delete<{success: boolean, message: string}>(`/admin/users/${id}`)
      if (!response.data.success) {
        throw new Error(response.data.message || '删除用户失败')
      }
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message)
      }
      const message = error.response?.data || error.message || '删除用户失败'
      throw new Error(typeof message === 'string' ? message : '删除用户失败')
    }
  }

  /**
   * 批量删除用户
   */
  static async batchDeleteUsers(data: BatchDeleteUsersRequest): Promise<void> {
    try {
      const response = await api.delete<{success: boolean, message: string}>('/admin/users/batch', { data })
      if (!response.data.success) {
        throw new Error(response.data.message || '批量删除用户失败')
      }
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message)
      }
      const message = error.response?.data || error.message || '批量删除用户失败'
      throw new Error(typeof message === 'string' ? message : '批量删除用户失败')
    }
  }

  /**
   * 重置用户密码
   */
  static async resetUserPassword(id: number, data: ResetPasswordRequest): Promise<void> {
    try {
      const response = await api.put<{success: boolean, message: string}>(`/admin/users/${id}/reset-password`, data)
      if (!response.data.success) {
        throw new Error(response.data.message || '重置密码失败')
      }
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message)
      }
      const message = error.response?.data || error.message || '重置密码失败'
      throw new Error(typeof message === 'string' ? message : '重置密码失败')
    }
  }

  /**
   * 切换用户状态（启用/禁用）
   */
  static async toggleUserStatus(id: number): Promise<UserInfoResponse> {
    try {
      const response = await api.put<{success: boolean, message: string, data: UserInfoResponse}>(`/admin/users/${id}/toggle-status`)
      if (response.data.success) {
        return response.data.data
      } else {
        throw new Error(response.data.message || '切换用户状态失败')
      }
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message)
      }
      const message = error.response?.data || error.message || '切换用户状态失败'
      throw new Error(typeof message === 'string' ? message : '切换用户状态失败')
    }
  }

  /**
   * 获取用户统计信息
   */
  static async getUserStatistics(): Promise<UserStatistics> {
    try {
      console.log('请求用户统计，baseURL:', api.defaults.baseURL, '路径: /admin/users/statistics')
      // 后端直接返回统计数据，不包装在 {success, message, data} 中
      const response = await api.get<UserStatistics>('/admin/users/statistics')
      console.log('统计信息响应:', response.data)
      return response.data
    } catch (error: any) {
      console.error('获取用户统计失败 - 状态码:', error.response?.status)
      console.error('获取用户统计失败 - 响应数据:', error.response?.data)
      console.error('获取用户统计失败 - 错误:', error)
      const message = error.response?.data?.message || error.response?.data || '获取用户统计失败'
      throw new Error(typeof message === 'string' ? message : '获取用户统计失败')
    }
  }

  /**
   * 导出用户数据（如果后端支持）
   */
  static async exportUsers(params: UserQueryParams): Promise<Blob> {
    try {
      const response = await api.get('/admin/users/export', {
        params,
        responseType: 'blob',
      })
      return response.data
    } catch (error: any) {
      const message = error.response?.data?.message || error.response?.data || '导出用户数据失败'
      throw new Error(typeof message === 'string' ? message : '导出用户数据失败')
    }
  }

  /**
   * 验证用户名是否可用
   */
  static async checkUsernameAvailable(username: string): Promise<boolean> {
    try {
      const response = await api.get<{ available: boolean }>(`/admin/users/check-username`, {
        params: { username }
      })
      return response.data.available
    } catch (error: any) {
      console.error('检查用户名可用性失败:', error)
      return false
    }
  }

  /**
   * 验证邮箱是否可用
   */
  static async checkEmailAvailable(email: string): Promise<boolean> {
    try {
      const response = await api.get<{ available: boolean }>(`/admin/users/check-email`, {
        params: { email }
      })
      return response.data.available
    } catch (error: any) {
      console.error('检查邮箱可用性失败:', error)
      return false
    }
  }
}
