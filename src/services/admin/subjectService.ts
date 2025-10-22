import { apiClient } from '../api'
import type { Subject } from '../common/subjectService'

export interface CreateSubjectRequest {
  name: string
  code: string
  description?: string
  department?: string
  credits?: number
  enabled?: boolean
}

export interface UpdateSubjectRequest {
  name?: string
  code?: string
  description?: string
  department?: string
  credits?: number
  enabled?: boolean
}

/**
 * 管理员 - 创建科目
 */
export const createSubject = async (data: CreateSubjectRequest): Promise<Subject> => {
  const response = await apiClient.post('/api/admin/subjects', data)
  return response.data.data
}

/**
 * 管理员 - 更新科目
 */
export const updateSubject = async (id: number, data: UpdateSubjectRequest): Promise<Subject> => {
  const response = await apiClient.put(`/api/admin/subjects/${id}`, data)
  return response.data.data
}

/**
 * 管理员 - 删除科目
 */
export const deleteSubject = async (id: number): Promise<void> => {
  await apiClient.delete(`/api/admin/subjects/${id}`)
}

/**
 * 管理员 - 启用/禁用科目
 */
export const toggleSubjectStatus = async (id: number, enabled: boolean): Promise<void> => {
  await apiClient.patch(`/api/admin/subjects/${id}/status`, { enabled })
}

export default {
  createSubject,
  updateSubject,
  deleteSubject,
  toggleSubjectStatus
}
