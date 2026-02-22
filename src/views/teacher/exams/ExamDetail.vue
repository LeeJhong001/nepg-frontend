<template>
  <div>
    <!-- 加载状态 -->
    <div v-if="loading" class="text-center py-12">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      <p class="mt-2 text-sm text-gray-500">加载中...</p>
    </div>
    
    <!-- 页面内容 -->
    <template v-else>
    <!-- 页面标题和操作 -->
    <div class="sm:flex sm:items-center sm:justify-between mb-6">
      <div>
        <h1 class="text-2xl font-semibold text-gray-900">{{ exam.title }}</h1>
        <p class="mt-1 text-sm text-gray-600">考试详情</p>
      </div>
      <div class="mt-4 sm:mt-0 sm:ml-16 sm:flex-none flex space-x-3">
        <button
          v-if="exam.status === 'DRAFT'"
          @click="publishExam"
          class="inline-flex items-center justify-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700"
        >
          发布考试
        </button>
        <button
          v-if="exam.status === 'PUBLISHED'"
          @click="archiveExam"
          class="inline-flex items-center justify-center rounded-md border border-transparent bg-yellow-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-yellow-700"
        >
          归档考试
        </button>
        <button
          @click="copyExam"
          class="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
        >
          复制考试
        </button>
        <button
          @click="$router.push(`/teacher/exams/${exam.id}/edit`)"
          class="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
        >
          编辑考试
        </button>
      </div>
    </div>

    <!-- 考试信息卡片 -->
    <div class="grid grid-cols-1 gap-6 lg:grid-cols-3 mb-8">
      <!-- 基本信息 -->
      <div class="lg:col-span-2">
        <div class="bg-white shadow rounded-lg">
          <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-medium text-gray-900">基本信息</h3>
          </div>
          <div class="p-6">
            <dl class="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
              <div>
                <dt class="text-sm font-medium text-gray-500">考试名称</dt>
                <dd class="mt-1 text-sm text-gray-900">{{ exam.title }}</dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500">状态</dt>
                <dd class="mt-1">
                  <span :class="getStatusClass(exam.status || 'DRAFT')" class="inline-flex px-2 py-1 text-xs font-semibold rounded-full">
                    {{ getStatusText(exam.status || 'DRAFT') }}
                  </span>
                </dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500">总分</dt>
                <dd class="mt-1 text-sm text-gray-900">{{ exam.totalScore || 0 }} 分</dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500">考试时长</dt>
                <dd class="mt-1 text-sm text-gray-900">{{ exam.duration || 0 }} 分钟</dd>
              </div>
              <div v-if="exam.subjectName">
                <dt class="text-sm font-medium text-gray-500">所属学科</dt>
                <dd class="mt-1 text-sm text-gray-900">{{ exam.subjectName }}</dd>
              </div>
              <div class="sm:col-span-2">
                <dt class="text-sm font-medium text-gray-500">考试描述</dt>
                <dd class="mt-1 text-sm text-gray-900">{{ exam.description || '暂无描述' }}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      <!-- 统计信息 -->
      <div class="space-y-6">
        <div class="bg-white shadow rounded-lg">
          <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-medium text-gray-900">参考统计</h3>
          </div>
          <div class="p-6">
            <dl class="space-y-4">
              <div class="flex justify-between">
                <dt class="text-sm font-medium text-gray-500">应参考人数</dt>
                <dd class="text-sm text-gray-900">{{ exam.totalParticipants || 0 }}</dd>
              </div>
              <div class="flex justify-between">
                <dt class="text-sm font-medium text-gray-500">已参考人数</dt>
                <dd class="text-sm text-gray-900">{{ exam.submittedCount || 0 }}</dd>
              </div>
              <div class="flex justify-between">
                <dt class="text-sm font-medium text-gray-500">参考率</dt>
                <dd class="text-sm text-gray-900">{{ getParticipationRate() }}%</dd>
              </div>
              <div class="flex justify-between">
                <dt class="text-sm font-medium text-gray-500">平均分</dt>
                <dd class="text-sm text-gray-900">{{ exam.averageScore ? exam.averageScore.toFixed(1) : '--' }}</dd>
              </div>
              <div class="flex justify-between">
                <dt class="text-sm font-medium text-gray-500">及格率</dt>
                <dd class="text-sm text-gray-900">{{ getPassRate() }}%</dd>
              </div>
            </dl>
          </div>
        </div>

        <div class="bg-white shadow rounded-lg">
          <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-medium text-gray-900">时间信息</h3>
          </div>
          <div class="p-6">
            <dl class="space-y-4">
              <div>
                <dt class="text-sm font-medium text-gray-500">开始时间</dt>
                <dd class="text-sm text-gray-900">{{ formatDateTime(exam.startTime) }}</dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500">结束时间</dt>
                <dd class="text-sm text-gray-900">{{ formatDateTime(exam.endTime) }}</dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500">创建时间</dt>
                <dd class="text-sm text-gray-900">{{ exam.createdAt ? formatDateTime(exam.createdAt) : '--' }}</dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500">更新时间</dt>
                <dd class="text-sm text-gray-900">{{ exam.updatedAt ? formatDateTime(exam.updatedAt) : '--' }}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>

    <!-- 考试设置 -->
    <div class="bg-white shadow rounded-lg mb-8">
      <div class="px-6 py-4 border-b border-gray-200">
        <h3 class="text-lg font-medium text-gray-900">考试设置</h3>
      </div>
      <div class="p-6">
        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div class="flex items-center">
            <svg :class="exam.shuffleQuestions ? 'text-green-500' : 'text-gray-400'" class="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
            <span class="text-sm text-gray-900">随机打乱题目顺序</span>
          </div>
          <div class="flex items-center">
            <svg :class="exam.shuffleOptions ? 'text-green-500' : 'text-gray-400'" class="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
            <span class="text-sm text-gray-900">随机打乱选项顺序</span>
          </div>
          <div class="flex items-center">
            <svg :class="exam.showScore ? 'text-green-500' : 'text-gray-400'" class="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
            <span class="text-sm text-gray-900">显示分数</span>
          </div>
          <div class="flex items-center">
            <svg :class="exam.showAnswer ? 'text-green-500' : 'text-gray-400'" class="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
            <span class="text-sm text-gray-900">显示答案</span>
          </div>
          <div class="flex items-center">
            <svg :class="exam.preventCopy ? 'text-green-500' : 'text-gray-400'" class="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
            <span class="text-sm text-gray-900">防止复制粘贴</span>
          </div>
          <div class="flex items-center">
            <svg :class="exam.fullScreen ? 'text-green-500' : 'text-gray-400'" class="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
            <span class="text-sm text-gray-900">强制全屏模式</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 参考学生列表 -->
    <div class="bg-white shadow rounded-lg">
      <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <h3 class="text-lg font-medium text-gray-900">参考学生</h3>
        <button
          @click="$router.push(`/teacher/exams/${exam.id}/statistics`)"
          class="text-sm text-blue-600 hover:text-blue-500"
        >
          查看详细统计 →
        </button>
      </div>
      <div class="overflow-hidden">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">学生</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">状态</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">分数</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">用时</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">提交时间</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="participant in participants" :key="participant.id">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div>
                    <div class="text-sm font-medium text-gray-900">{{ participant.studentName }}</div>
                    <div class="text-sm text-gray-500">{{ participant.studentId }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="getParticipantStatusClass(participant.status)" class="inline-flex px-2 py-1 text-xs font-semibold rounded-full">
                  {{ getParticipantStatusText(participant.status) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ participant.score !== null ? `${participant.score}/${exam.totalScore}` : '--' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ participant.duration ? `${participant.duration}分钟` : '--' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ participant.submittedAt ? formatDateTime(participant.submittedAt) : '--' }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { teacherExamService, type Exam } from '../../../services/teacher/examService'
import { useNotification } from '../../../composables/useNotification'

const route = useRoute()
const router = useRouter()
const { success: showSuccess, error: showError } = useNotification()
const examId = route.params.id as string

// 加载状态
const loading = ref(false)

// 考试详情
const exam = ref<Partial<Exam & {
  passScore?: number
  totalParticipants?: number
  submittedCount?: number
  averageScore?: number
  shuffleQuestions?: boolean
  shuffleOptions?: boolean
  showScore?: boolean
  showAnswer?: boolean
  preventCopy?: boolean
  fullScreen?: boolean
}>>({
  id: 0,
  title: '',
  description: '',
  status: 'DRAFT',
  totalScore: 0,
  duration: 0,
  startTime: '',
  endTime: '',
  createdAt: '',
  updatedAt: '',
  subjectId: 0
})

// 参考学生列表
const participants = ref([
  {
    id: 1,
    studentId: '2024001',
    studentName: '张三',
    status: 'submitted',
    score: 85,
    duration: 95,
    submittedAt: '2024-01-15T10:35:00'
  },
  {
    id: 2,
    studentId: '2024002',
    studentName: '李四',
    status: 'submitted',
    score: 72,
    duration: 110,
    submittedAt: '2024-01-15T10:50:00'
  },
  {
    id: 3,
    studentId: '2024003',
    studentName: '王五',
    status: 'not_started',
    score: null,
    duration: null,
    submittedAt: null
  }
])

// 获取参考率
const getParticipationRate = () => {
  if (exam.value.totalParticipants === 0) return 0
  return Math.round((exam.value.submittedCount / exam.value.totalParticipants) * 100)
}

// 获取及格率
const getPassRate = () => {
  if (exam.value.submittedCount === 0) return 0
  const passedCount = participants.value.filter(p => 
    p.score !== null && p.score >= exam.value.passScore
  ).length
  return Math.round((passedCount / exam.value.submittedCount) * 100)
}

// 状态样式和文本
const getStatusClass = (status: string) => {
  const upperStatus = status.toUpperCase()
  switch (upperStatus) {
    case 'PUBLISHED':
      return 'bg-green-100 text-green-800'
    case 'DRAFT':
      return 'bg-yellow-100 text-yellow-800'
    case 'ONGOING':
      return 'bg-blue-100 text-blue-800'
    case 'FINISHED':
      return 'bg-gray-100 text-gray-800'
    case 'CANCELLED':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const getStatusText = (status: string) => {
  const upperStatus = status.toUpperCase()
  switch (upperStatus) {
    case 'PUBLISHED':
      return '已发布'
    case 'DRAFT':
      return '草稿'
    case 'ONGOING':
      return '进行中'
    case 'FINISHED':
      return '已结束'
    case 'CANCELLED':
      return '已取消'
    default:
      return '未知'
  }
}

const getParticipantStatusClass = (status: string) => {
  switch (status) {
    case 'submitted':
      return 'bg-green-100 text-green-800'
    case 'in_progress':
      return 'bg-blue-100 text-blue-800'
    case 'not_started':
      return 'bg-gray-100 text-gray-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const getParticipantStatusText = (status: string) => {
  switch (status) {
    case 'submitted':
      return '已提交'
    case 'in_progress':
      return '进行中'
    case 'not_started':
      return '未开始'
    default:
      return '未知'
  }
}

// 格式化日期时间
const formatDateTime = (dateString: string | undefined) => {
  if (!dateString) return '--'
  try {
    return new Date(dateString).toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  } catch (error) {
    return dateString
  }
}

// 考试操作
const publishExam = async () => {
  try {
    await teacherExamService.publishExam(Number(examId))
    showSuccess('考试发布成功')
    // 重新加载数据
    await loadExamDetail()
  } catch (error) {
    console.error('Failed to publish exam:', error)
    showError('发布考试失败')
  }
}

const archiveExam = async () => {
  try {
    await teacherExamService.archiveExam(Number(examId))
    showSuccess('考试归档成功')
    // 重新加载数据
    await loadExamDetail()
  } catch (error) {
    console.error('Failed to archive exam:', error)
    showError('归档考试失败')
  }
}

const copyExam = async () => {
  try {
    const newExam = await teacherExamService.copyExam(Number(examId))
    showSuccess('考试复制成功')
    // 跳转到新考试编辑页面
    router.push(`/teacher/exams/${newExam.id}/edit`)
  } catch (error) {
    console.error('Failed to copy exam:', error)
    showError('复制考试失败')
  }
}

// 加载数据
const loadExamDetail = async () => {
  try {
    loading.value = true
    
    // 加载考试详情
    const examData = await teacherExamService.getExam(Number(examId))
    
    // 映射数据
    exam.value = {
      ...examData,
      // 默认值处理
      passScore: Math.round((examData.totalScore || 100) * 0.6), // 默认及格分数为总分的60%
      totalParticipants: 0,
      submittedCount: 0,
      averageScore: 0
    }
    
    // 加载统计信息（如果可用）
    try {
      const stats = await teacherExamService.getExamStatistics(Number(examId))
      exam.value.totalParticipants = stats.totalStudents || 0
      exam.value.submittedCount = stats.submittedCount || 0
      exam.value.averageScore = stats.averageScore || 0
    } catch (error) {
      console.warn('Failed to load statistics:', error)
      // 统计信息加载失败不影响基本信息的显示
    }
    
    console.log('考试详情加载成功:', exam.value)
  } catch (error) {
    console.error('Failed to load exam detail:', error)
    showError('加载考试详情失败')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadExamDetail()
})
</script>
