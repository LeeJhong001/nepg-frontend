<template>
  <div>
    <!-- 页面标题 -->
    <div class="mb-6">
      <h1 class="text-2xl font-semibold text-gray-900">仪表盘</h1>
      <p class="mt-1 text-sm text-gray-600">欢迎回来，查看您的教学概况</p>
    </div>

    <!-- 统计卡片 -->
    <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <svg class="h-6 w-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">我的考试</dt>
                <dd class="text-lg font-medium text-gray-900">{{ stats.examCount }}</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <svg class="h-6 w-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">试卷数量</dt>
                <dd class="text-lg font-medium text-gray-900">{{ stats.paperCount }}</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <svg class="h-6 w-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">题目数量</dt>
                <dd class="text-lg font-medium text-gray-900">{{ stats.questionCount }}</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <svg class="h-6 w-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">参考学生</dt>
                <dd class="text-lg font-medium text-gray-900">{{ stats.studentCount }}</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 快速操作 -->
    <div class="mb-8">
      <h2 class="text-lg font-medium text-gray-900 mb-4">快速操作</h2>
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <button
          @click="$router.push('/teacher/exams/create')"
          class="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-500 rounded-lg shadow hover:shadow-md transition-shadow"
        >
          <div>
            <span class="rounded-lg inline-flex p-3 bg-blue-50 text-blue-600 ring-4 ring-white">
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
            </span>
          </div>
          <div class="mt-4">
            <h3 class="text-lg font-medium text-gray-900">创建考试</h3>
            <p class="mt-2 text-sm text-gray-500">快速创建新的考试</p>
          </div>
        </button>

        <button
          @click="$router.push('/teacher/exam-papers/create')"
          class="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-green-500 rounded-lg shadow hover:shadow-md transition-shadow"
        >
          <div>
            <span class="rounded-lg inline-flex p-3 bg-green-50 text-green-600 ring-4 ring-white">
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </span>
          </div>
          <div class="mt-4">
            <h3 class="text-lg font-medium text-gray-900">创建试卷</h3>
            <p class="mt-2 text-sm text-gray-500">组织试卷内容</p>
          </div>
        </button>

        <button
          @click="$router.push('/teacher/questions/create')"
          class="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-yellow-500 rounded-lg shadow hover:shadow-md transition-shadow"
        >
          <div>
            <span class="rounded-lg inline-flex p-3 bg-yellow-50 text-yellow-600 ring-4 ring-white">
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </span>
          </div>
          <div class="mt-4">
            <h3 class="text-lg font-medium text-gray-900">添加题目</h3>
            <p class="mt-2 text-sm text-gray-500">创建新的题目</p>
          </div>
        </button>

        <button
          @click="$router.push('/teacher/categories/create')"
          class="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-purple-500 rounded-lg shadow hover:shadow-md transition-shadow"
        >
          <div>
            <span class="rounded-lg inline-flex p-3 bg-purple-50 text-purple-600 ring-4 ring-white">
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14-4H3m16 8H5m14 4H3" />
              </svg>
            </span>
          </div>
          <div class="mt-4">
            <h3 class="text-lg font-medium text-gray-900">管理分类</h3>
            <p class="mt-2 text-sm text-gray-500">组织题目分类</p>
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
          <div class="space-y-3">
            <div v-for="exam in recentExams" :key="exam.id" class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p class="text-sm font-medium text-gray-900">{{ exam.title }}</p>
                <p class="text-xs text-gray-500">{{ exam.date }}</p>
              </div>
              <span :class="getStatusClass(exam.status)" class="px-2 py-1 text-xs font-medium rounded-full">
                {{ exam.status }}
              </span>
            </div>
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
          <div class="space-y-3">
            <div v-for="paper in recentPapers" :key="paper.id" class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p class="text-sm font-medium text-gray-900">{{ paper.title }}</p>
                <p class="text-xs text-gray-500">{{ paper.questionCount }} 道题目</p>
              </div>
              <button
                @click="$router.push(`/teacher/exam-papers/${paper.id}/preview`)"
                class="text-sm text-blue-600 hover:text-blue-500"
              >
                预览
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

// 统计数据
const stats = ref({
  examCount: 0,
  paperCount: 0,
  questionCount: 0,
  studentCount: 0
})

// 最近考试
const recentExams = ref([
  { id: 1, title: '期中考试', date: '2024-01-15', status: '已发布' },
  { id: 2, title: '单元测试', date: '2024-01-10', status: '草稿' },
  { id: 3, title: '期末考试', date: '2024-01-05', status: '已归档' }
])

// 最近试卷
const recentPapers = ref([
  { id: 1, title: '数学期中试卷', questionCount: 20 },
  { id: 2, title: '语文阅读理解', questionCount: 15 },
  { id: 3, title: '英语听力测试', questionCount: 25 }
])

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
    // TODO: 调用API获取统计数据
    stats.value = {
      examCount: 8,
      paperCount: 15,
      questionCount: 120,
      studentCount: 156
    }
  } catch (error) {
    console.error('Failed to load stats:', error)
  }
}

onMounted(() => {
  loadStats()
})
</script>
