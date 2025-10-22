<template>
  <div class="space-y-6">
    <!-- 欢迎横幅 -->
    <div class="bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg shadow-lg p-8 text-white">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold mb-2">欢迎回来，{{ authStore.user?.realName }}！</h1>
          <p class="text-green-100 text-lg">继续你的学习之旅，挑战新的高度</p>
        </div>
        <div class="hidden md:block">
          <svg class="w-24 h-24 text-green-200 opacity-50" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"/>
          </svg>
        </div>
      </div>
    </div>

    <!-- 统计卡片 -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border-l-4 border-green-500">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600 mb-1">可参加的考试</p>
            <p class="text-3xl font-bold text-gray-900">{{ availableExamsCount }}</p>
            <p class="text-xs text-green-600 mt-2">立即参加 →</p>
          </div>
          <div class="bg-green-100 rounded-full p-4">
            <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/>
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border-l-4 border-blue-500">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600 mb-1">已完成考试</p>
            <p class="text-3xl font-bold text-gray-900">{{ completedExamsCount }}</p>
            <p class="text-xs text-blue-600 mt-2">查看详情 →</p>
          </div>
          <div class="bg-blue-100 rounded-full p-4">
            <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border-l-4 border-purple-500">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600 mb-1">平均分数</p>
            <p class="text-3xl font-bold text-gray-900">{{ averageScore }}</p>
            <p class="text-xs text-purple-600 mt-2">继续努力 →</p>
          </div>
          <div class="bg-purple-100 rounded-full p-4">
            <svg class="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border-l-4 border-amber-500">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600 mb-1">学习时长</p>
            <p class="text-3xl font-bold text-gray-900">{{ studyHours }}<span class="text-lg">h</span></p>
            <p class="text-xs text-amber-600 mt-2">本周统计 →</p>
          </div>
          <div class="bg-amber-100 rounded-full p-4">
            <svg class="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- 快捷功能区 -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <router-link to="/student/exams" class="group bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-all transform hover:-translate-y-1">
        <div class="flex flex-col items-center text-center">
          <div class="bg-gradient-to-br from-green-400 to-emerald-500 rounded-full p-6 mb-4 group-hover:scale-110 transition-transform">
            <svg class="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/>
            </svg>
          </div>
          <h3 class="text-xl font-bold text-gray-900 mb-2">在线考试</h3>
          <p class="text-gray-600 text-sm">参加可用的在线考试，检验学习成果</p>
          <div class="mt-4 text-green-600 font-medium group-hover:text-green-700">
            立即开始 →
          </div>
        </div>
      </router-link>

      <router-link to="/student/records" class="group bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-all transform hover:-translate-y-1">
        <div class="flex flex-col items-center text-center">
          <div class="bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full p-6 mb-4 group-hover:scale-110 transition-transform">
            <svg class="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
          </div>
          <h3 class="text-xl font-bold text-gray-900 mb-2">考试记录</h3>
          <p class="text-gray-600 text-sm">查看所有考试记录和详细成绩</p>
          <div class="mt-4 text-blue-600 font-medium group-hover:text-blue-700">
            查看记录 →
          </div>
        </div>
      </router-link>

      <router-link to="/student/courses" class="group bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-all transform hover:-translate-y-1">
        <div class="flex flex-col items-center text-center">
          <div class="bg-gradient-to-br from-purple-400 to-pink-500 rounded-full p-6 mb-4 group-hover:scale-110 transition-transform">
            <svg class="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
            </svg>
          </div>
          <h3 class="text-xl font-bold text-gray-900 mb-2">课程学习</h3>
          <p class="text-gray-600 text-sm">浏览和学习已选课程内容</p>
          <div class="mt-4 text-purple-600 font-medium group-hover:text-purple-700">
            开始学习 →
          </div>
        </div>
      </router-link>
    </div>

    <!-- 最近活动 -->
    <div class="bg-white rounded-lg shadow-md p-6">
      <h2 class="text-xl font-bold text-gray-900 mb-4 flex items-center">
        <svg class="w-6 h-6 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        最近活动
      </h2>
      <div class="space-y-3">
        <div v-if="recentActivities.length === 0" class="text-center py-8 text-gray-500">
          <svg class="w-16 h-16 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/>
          </svg>
          <p>暂无最近活动</p>
        </div>
        <div v-for="activity in recentActivities" :key="activity.id" class="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
          <div class="flex-shrink-0 w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
            <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <div class="ml-4 flex-1">
            <p class="text-sm font-medium text-gray-900">{{ activity.title }}</p>
            <p class="text-xs text-gray-500">{{ activity.time }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import studentExamService from '@/services/student/examService'

const authStore = useAuthStore()

const availableExamsCount = ref(0)
const completedExamsCount = ref(0)
const averageScore = ref('--')
const studyHours = ref(0)
const recentActivities = ref<Array<{id: number, title: string, time: string}>>([])

onMounted(async () => {
  try {
    const availableExams = await studentExamService.getAvailableExams()
    availableExamsCount.value = availableExams.length

    const records = await studentExamService.getMyRecords()
    const completedRecords = records.filter(r => r.status === 'GRADED' || r.status === 'SUBMITTED')
    completedExamsCount.value = completedRecords.length

    // 计算平均分
    if (completedRecords.length > 0) {
      const totalScore = completedRecords.reduce((sum, r) => sum + (r.score || 0), 0)
      averageScore.value = (totalScore / completedRecords.length).toFixed(1)
    }

    // 模拟学习时长（实际应从后端获取）
    studyHours.value = Math.floor(Math.random() * 50) + 10

  } catch (error) {
    console.error("Failed to fetch student dashboard data:", error)
  }
})
</script>
