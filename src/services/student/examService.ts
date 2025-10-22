import { apiClient } from '../api'

export interface AvailableExam {
  examId: number
  title: string
  durationMinutes: number
  totalScore: number
  startTime: string
  endTime: string
}

export interface StartExamResponse {
  recordId: number
  examId: number
  paperId: number
  examTitle: string
  durationMinutes: number
  totalScore: number
  startTime: string
  endTime: string
  questions: Array<{
    questionId: number
    title: string
    content: string
    type: 'CHOICE' | 'FILL_BLANK' | 'SHORT_ANSWER' | 'PROOF'
    difficulty: number
    score: number
    sortOrder: number
    options?: string
  }>
}

export interface SubmitAnswerRequest {
  recordId: number
  answers: Array<{
    questionId: number
    answer: string
    timeUsedSeconds?: number
  }>
}

export interface SubmitAnswerResponse {
  recordId: number
  objectiveScore: number
  totalScore: number
  pendingReview: boolean
}

export interface RecordResponse {
  recordId: number
  examId: number
  paperId: number
  score: number
  status: string
  startTime: string
  submitTime: string
}

export const studentExamService = {
  async getAvailableExams() {
    const { data } = await apiClient.get<AvailableExam[]>('/api/student/exams/available')
    return data
  },
  async startExam(examId: number) {
    const { data } = await apiClient.post<StartExamResponse>(`/api/student/exams/${examId}/start`)
    return data
  },
  async submitExam(examId: number, payload: SubmitAnswerRequest) {
    const { data } = await apiClient.post<SubmitAnswerResponse>(`/api/student/exams/${examId}/submit`, payload)
    return data
  },
  async getMyRecords() {
    const { data } = await apiClient.get<RecordResponse[]>('/api/student/records')
    return data
  },
  async getRecordDetail(recordId: number) {
    const { data } = await apiClient.get<RecordResponse>(`/api/student/records/${recordId}`)
    return data
  },
}
export default studentExamService
