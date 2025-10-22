import { apiClient } from '../api'

export interface Subject {
  id: number
  name: string
  code: string
  description: string
  department: string
  credits: number
  enabled: boolean
  createdAt: string
  updatedAt: string
}

/**
 * 获取所有启用的科目列表
 */
export const getEnabledSubjects = async (): Promise<Subject[]> => {
  const response = await apiClient.get('/api/subjects/enabled')
  return response.data.data
}

/**
 * 获取所有科目列表
 */
export const getAllSubjects = async (): Promise<Subject[]> => {
  const response = await apiClient.get('/api/subjects')
  return response.data.data
}

/**
 * 根据ID获取科目详情
 */
export const getSubjectById = async (id: number): Promise<Subject> => {
  const response = await apiClient.get(`/api/subjects/${id}`)
  return response.data.data
}

export default {
  getEnabledSubjects,
  getAllSubjects,
  getSubjectById
}
