<template>
  <div class="space-y-6">
    <!-- 欢迎横幅 -->
    <div class="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-lg shadow-lg p-8 text-white">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold mb-2">教师工作台</h1>
          <p class="text-blue-100 text-lg">管理您的课程、考试和学生</p>
        </div>
        <div class="hidden md:block">
          <svg class="w-24 h-24 text-blue-200 opacity-50" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"/>
          </svg>
        </div>
      </div>
    </div>

    <!-- 统计卡片 -->
    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <div class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border-l-4 border-blue-500">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600 mb-1">我的考试</p>
            <p class="text-3xl font-bold text-gray-900">
              <span v-if="loading" class="animate-pulse bg-gray-200 h-8 w-12 rounded inline-block"></span>
              <span v-else>{{ stats.examCount }}</span>
            </p>
            <p class="text-xs text-blue-600 mt-2">管理考试 →</p>
          </div>
          <div class="bg-blue-100 rounded-full p-4">
            <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border-l-4 border-green-500">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600 mb-1">试卷数量</p>
            <p class="text-3xl font-bold text-gray-900">
              <span v-if="loading" class="animate-pulse bg-gray-200 h-8 w-12 rounded inline-block"></span>
              <span v-else>{{ stats.paperCount }}</span>
            </p>
            <p class="text-xs text-green-600 mt-2">管理试卷 →</p>
          </div>
          <div class="bg-green-100 rounded-full p-4">
            <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border-l-4 border-yellow-500">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600 mb-1">题目数量</p>
            <p class="text-3xl font-bold text-gray-900">
              <span v-if="loading" class="animate-pulse bg-gray-200 h-8 w-12 rounded inline-block"></span>
              <span v-else>{{ stats.questionCount }}</span>
            </p>
            <p class="text-xs text-yellow-600 mt-2">管理题库 →</p>
          </div>
          <div class="bg-yellow-100 rounded-full p-4">
            <svg class="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border-l-4 border-purple-500">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600 mb-1">参考学生</p>
            <p class="text-3xl font-bold text-gray-900">
              <span v-if="loading" class="animate-pulse bg-gray-200 h-8 w-12 rounded inline-block"></span>
              <span v-else>{{ stats.studentCount }}</span>
            </p>
            <p class="text-xs text-purple-600 mt-2">查看详情 →</p>
          </div>
          <div class="bg-purple-100 rounded-full p-4">
            <svg class="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- 快速操作 -->
    <div>
      <h2 class="text-xl font-bold text-gray-900 mb-4 flex items-center">
        <svg class="w-6 h-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
        </svg>
        快速操作
      </h2>
      <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <button
          @click="$router.push('/teacher/exams/create')"
          class="group bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all transform hover:-translate-y-1"
        >
          <div class="flex flex-col items-center text-center">
            <div class="bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full p-6 mb-4 group-hover:scale-110 transition-transform">
              <svg class="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-2">创建考试</h3>
            <p class="text-gray-600 text-sm">快速创建新的考试</p>
            <div class="mt-4 text-blue-600 font-medium group-hover:text-blue-700">
              立即创建 →
            </div>
          </div>
        </button>

        <button
          @click="$router.push('/teacher/exam-papers/create')"
          class="group bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all transform hover:-translate-y-1"
        >
          <div class="flex flex-col items-center text-center">
            <div class="bg-gradient-to-br from-green-400 to-emerald-500 rounded-full p-6 mb-4 group-hover:scale-110 transition-transform">
              <svg class="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-2">创建试卷</h3>
            <p class="text-gray-600 text-sm">组织试卷内容</p>
            <div class="mt-4 text-green-600 font-medium group-hover:text-green-700">
              立即创建 →
            </div>
          </div>
        </button>

        <button
          @click="$router.push('/teacher/questions/create')"
          class="group bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all transform hover:-translate-y-1"
        >
          <div class="flex flex-col items-center text-center">
            <div class="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full p-6 mb-4 group-hover:scale-110 transition-transform">
              <svg class="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-2">添加题目</h3>
            <p class="text-gray-600 text-sm">创建新的题目</p>
            <div class="mt-4 text-yellow-600 font-medium group-hover:text-yellow-700">
              立即创建 →
            </div>
          </div>
        </button>
      </div>
    </div>

    <!-- 最近活动 -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- 最近考试 -->
      <div class="bg-white shadow rounded-lg">
        <div class="p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-medium text-gray-900">最近考试</h3>
            <router-link to="/teacher/exams" class="text-sm text-blue-600 hover:text-blue-500">查看全部</router-link>
          </div>
          <div v-if="loading" class="space-y-3">
            <div v-for="i in 3" :key="i" class="animate-pulse p-3 bg-gray-50 rounded-lg">
              <div class="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div class="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
          <div v-else-if="recentExams.length > 0" class="space-y-3">
            <div v-for="exam in recentExams" :key="exam.id" class="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div>
                <p class="text-sm font-medium text-gray-900">{{ exam.title }}</p>
                <p class="text-xs text-gray-500">{{ exam.date }}</p>
              </div>
              <span :class="getStatusClass(exam.status)" class="px-2 py-1 text-xs font-medium rounded-full">
                {{ exam.status }}
              </span>
            </div>
          </div>
          <div v-else class="text-center py-6 text-gray-500">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
            <p class="mt-2 text-sm">暂无考试记录</p>
          </div>
        </div>
      </div>

      <!-- 最近试卷 -->
      <div class="bg-white shadow rounded-lg">
        <div class="p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-medium text-gray-900">最近试卷</h3>
            <router-link to="/teacher/exam-papers" class="text-sm text-blue-600 hover:text-blue-500">查看全部</router-link>
          </div>
          <div v-if="loading" class="space-y-3">
            <div v-for="i in 3" :key="i" class="animate-pulse p-3 bg-gray-50 rounded-lg">
              <div class="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div class="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
          <div v-else-if="recentPapers.length > 0" class="space-y-3">
            <div v-for="paper in recentPapers" :key="paper.id" class="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div>
                <p class="text-sm font-medium text-gray-900">{{ paper.title }}</p>
                <p class="text-xs text-gray-500">{{ paper.questionCount }} 道题目</p>
              </div>
              <button
                @click="$router.push(`/teacher/exam-papers/${paper.id}/preview`)"
                class="text-sm text-blue-600 hover:text-blue-500 px-3 py-1 rounded-md hover:bg-blue-50 transition-colors"
              >
                预览
              </button>
            </div>
          </div>
          <div v-else class="text-center py-6 text-gray-500">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p class="mt-2 text-sm">暂无试卷记录</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { teacherQuestionService } from '../../services/teacher/questionService'
import { teacherExamService } from '../../services/teacher/examService'
import { teacherExamPaperService } from '../../services/teacher/examPaperService'
import { useNotification } from '../../composables/useNotification'

const { error: showError } = useNotification()

// 统计数据
const stats = ref({
  examCount: 0,
  paperCount: 0,
  questionCount: 0,
  studentCount: 0
})

// 最近考试
const recentExams = ref([])

// 最近试卷
const recentPapers = ref([])

// 加载状态
const loading = ref(false)

// 获取状态样式
const getStatusClass = (status: string) => {
  switch (status) {
    case '已发布':
      return 'bg-green-100 text-green-800'
    case '草稿':
      return 'bg-yellow-100 text-yellow-800'
    case '已归档':
      return 'bg-gray-100 text-gray-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

// 加载统计数据
const loadStats = async () => {
  try {
    loading.value = true
    console.log('Loading dashboard statistics...')
    
    // 并行加载所有统计数据
    const [questionStats, examStats, paperStats] = await Promise.all([
      teacherQuestionService.getQuestionList({ page: 1, size: 1 }),
      teacherExamService.getExamList({ page: 1, size: 1 }),
      teacherExamPaperService.getExamPaperList({ page: 1, size: 1 })
    ])
    
    stats.value = {
      examCount: examStats.data?.totalItems || 0,
      paperCount: paperStats.data?.totalItems || 0,
      questionCount: questionStats.data?.totalItems || 0,
      studentCount: 0 // TODO: 需要学生统计API
    }
    
    console.log('Dashboard statistics loaded:', stats.value)
  } catch (error) {
    console.error('Failed to load stats:', error)
    showError('加载统计数据失败')
  } finally {
    loading.value = false
  }
}

// 加载最近考试
const loadRecentExams = async () => {
  try {
    const response = await teacherExamService.getExamList({ 
      page: 1, 
      size: 5
    })
    
    recentExams.value = response.data?.items?.map(exam => ({
      id: exam.id,
      title: exam.title,
      date: new Date(exam.createdAt).toLocaleDateString('zh-CN'),
      status: getExamStatusText(exam.status)
    })) || []
    
    console.log('Recent exams loaded:', recentExams.value)
  } catch (error) {
    console.error('Failed to load recent exams:', error)
  }
}

// 加载最近试卷
const loadRecentPapers = async () => {
  try {
    const response = await teacherExamPaperService.getExamPaperList({ 
      page: 1, 
      size: 5 
    })
    
    recentPapers.value = response.data?.items?.map(paper => ({
      id: paper.id,
      title: paper.title,
      questionCount: paper.totalQuestions || 0
    })) || []
    
    console.log('Recent papers loaded:', recentPapers.value)
  } catch (error) {
    console.error('Failed to load recent papers:', error)
  }
}

// 获取考试状态文本
const getExamStatusText = (status: string) => {
  switch (status) {
    case 'PUBLISHED':
      return '已发布'
    case 'DRAFT':
      return '草稿'
    case 'ARCHIVED':
      return '已归档'
    default:
      return status
  }
}

onMounted(async () => {
  await Promise.all([
    loadStats(),
    loadRecentExams(),
    loadRecentPapers()
  ])
})
</script>
