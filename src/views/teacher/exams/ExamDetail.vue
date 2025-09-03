<template>
  <div>
    <!-- 页面标题和操作 -->
    <div class="sm:flex sm:items-center sm:justify-between mb-6">
      <div>
        <h1 class="text-2xl font-semibold text-gray-900">{{ exam.title }}</h1>
        <p class="mt-1 text-sm text-gray-600">考试详情</p>
      </div>
      <div class="mt-4 sm:mt-0 sm:ml-16 sm:flex-none flex space-x-3">
        <button
          v-if="exam.status === 'draft'"
          @click="publishExam"
          class="inline-flex items-center justify-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700"
        >
          发布考试
        </button>
        <button
          v-if="exam.status === 'published'"
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
                <dt class="text-sm font-medium text-gray-500">考试类型</dt>
                <dd class="mt-1 text-sm text-gray-900">{{ getTypeText(exam.type) }}</dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500">状态</dt>
                <dd class="mt-1">
                  <span :class="getStatusClass(exam.status)" class="inline-flex px-2 py-1 text-xs font-semibold rounded-full">
                    {{ getStatusText(exam.status) }}
                  </span>
                </dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500">总分</dt>
                <dd class="mt-1 text-sm text-gray-900">{{ exam.totalScore }} 分</dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500">及格分数</dt>
                <dd class="mt-1 text-sm text-gray-900">{{ exam.passScore }} 分</dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500">考试时长</dt>
                <dd class="mt-1 text-sm text-gray-900">{{ exam.duration }} 分钟</dd>
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
                <dd class="text-sm text-gray-900">{{ exam.totalParticipants }}</dd>
              </div>
              <div class="flex justify-between">
                <dt class="text-sm font-medium text-gray-500">已参考人数</dt>
                <dd class="text-sm text-gray-900">{{ exam.submittedCount }}</dd>
              </div>
              <div class="flex justify-between">
                <dt class="text-sm font-medium text-gray-500">参考率</dt>
                <dd class="text-sm text-gray-900">{{ getParticipationRate() }}%</dd>
              </div>
              <div class="flex justify-between">
                <dt class="text-sm font-medium text-gray-500">平均分</dt>
                <dd class="text-sm text-gray-900">{{ exam.averageScore || '--' }}</dd>
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
                <dd class="text-sm text-gray-900">{{ formatDateTime(exam.createdAt) }}</dd>
              </div>
              <div v-if="exam.publishedAt">
                <dt class="text-sm font-medium text-gray-500">发布时间</dt>
                <dd class="text-sm text-gray-900">{{ formatDateTime(exam.publishedAt) }}</dd>
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
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const examId = route.params.id as string

// 考试详情
const exam = ref({
  id: 1,
  title: '期中考试',
  description: '数学期中测试',
  type: 'exam',
  status: 'published',
  totalScore: 100,
  passScore: 60,
  duration: 120,
  startTime: '2024-01-15T09:00:00',
  endTime: '2024-01-15T11:00:00',
  createdAt: '2024-01-10T10:00:00',
  publishedAt: '2024-01-12T14:00:00',
  totalParticipants: 30,
  submittedCount: 25,
  averageScore: 78.5,
  shuffleQuestions: true,
  shuffleOptions: false,
  showScore: true,
  showAnswer: false,
  preventCopy: true,
  fullScreen: false
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
  switch (status) {
    case 'published':
      return 'bg-green-100 text-green-800'
    case 'draft':
      return 'bg-yellow-100 text-yellow-800'
    case 'archived':
      return 'bg-gray-100 text-gray-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const getStatusText = (status: string) => {
  switch (status) {
    case 'published':
      return '已发布'
    case 'draft':
      return '草稿'
    case 'archived':
      return '已归档'
    default:
      return '未知'
  }
}

const getTypeText = (type: string) => {
  switch (type) {
    case 'exam':
      return '正式考试'
    case 'quiz':
      return '随堂测验'
    case 'homework':
      return '课后作业'
    case 'practice':
      return '练习测试'
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
const formatDateTime = (dateString: string) => {
  return new Date(dateString).toLocaleString('zh-CN')
}

// 考试操作
const publishExam = async () => {
  try {
    // TODO: 调用发布API
    console.log('Publish exam:', examId)
  } catch (error) {
    console.error('Failed to publish exam:', error)
  }
}

const archiveExam = async () => {
  try {
    // TODO: 调用归档API
    console.log('Archive exam:', examId)
  } catch (error) {
    console.error('Failed to archive exam:', error)
  }
}

const copyExam = async () => {
  try {
    // TODO: 调用复制API
    console.log('Copy exam:', examId)
  } catch (error) {
    console.error('Failed to copy exam:', error)
  }
}

// 加载数据
const loadExamDetail = async () => {
  try {
    // TODO: 调用API获取考试详情
    console.log('Load exam detail:', examId)
  } catch (error) {
    console.error('Failed to load exam detail:', error)
  }
}

onMounted(() => {
  loadExamDetail()
})
</script>
