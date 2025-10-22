<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 导航栏 -->
    <nav class="bg-blue-600 shadow">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <h1 class="text-xl font-semibold text-white">OEPG 系统 - 教师工作台</h1>
          </div>
          <div class="flex items-center space-x-4">
            <span class="text-blue-100">欢迎，{{ authStore.user?.realName }} 老师</span>
            <button
              @click="handleLogout"
              class="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              登出
            </button>
          </div>
        </div>
      </div>
    </nav>

    <!-- 侧边栏和主内容区域 -->
    <div class="flex">
      <!-- 侧边栏 -->
      <div class="w-72 bg-white shadow-sm min-h-screen border-r border-gray-200">
        <nav class="mt-5 px-4">
          <div class="space-y-2">
            <!-- 仪表盘 -->
            <router-link
              to="/teacher"
              exact-active-class="bg-blue-100 text-blue-700"
              class="text-gray-600 hover:bg-gray-50 hover:text-gray-900 group flex items-center px-4 py-3 text-base font-medium rounded-lg transition-colors"
            >
              <svg class="text-gray-400 group-hover:text-gray-500 mr-4 h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              仪表盘
            </router-link>

            <!-- 考试管理 -->
            <router-link
              to="/teacher/exams"
              active-class="bg-blue-100 text-blue-700"
              class="text-gray-600 hover:bg-gray-50 hover:text-gray-900 group flex items-center px-4 py-3 text-base font-medium rounded-lg transition-colors"
            >
              <svg class="text-gray-400 group-hover:text-gray-500 mr-4 h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
              考试管理
            </router-link>

            <!-- 试卷管理 -->
            <router-link
              to="/teacher/exam-papers"
              active-class="bg-blue-100 text-blue-700"
              class="text-gray-600 hover:bg-gray-50 hover:text-gray-900 group flex items-center px-4 py-3 text-base font-medium rounded-lg transition-colors"
            >
              <svg class="text-gray-400 group-hover:text-gray-500 mr-4 h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              试卷管理
            </router-link>

            <!-- 题库管理 -->
            <router-link
              to="/teacher/questions"
              active-class="bg-blue-100 text-blue-700"
              class="text-gray-600 hover:bg-gray-50 hover:text-gray-900 group flex items-center px-4 py-3 text-base font-medium rounded-lg transition-colors"
            >
              <svg class="text-gray-400 group-hover:text-gray-500 mr-4 h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              题库管理
            </router-link>

            <!-- 分类管理 -->
            <router-link
              to="/teacher/categories"
              active-class="bg-blue-100 text-blue-700"
              class="text-gray-600 hover:bg-gray-50 hover:text-gray-900 group flex items-center px-4 py-3 text-base font-medium rounded-lg transition-colors"
            >
              <svg class="text-gray-400 group-hover:text-gray-500 mr-4 h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              分类管理
            </router-link>
          </div>
        </nav>
      </div>

      <!-- 主内容区域 -->
      <div class="flex-1 p-6">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
import { UserRole } from '../../types/auth'
import { onMounted } from 'vue'

const router = useRouter()
const authStore = useAuthStore()

// 检查用户权限
onMounted(() => {
  if (!authStore.isAuthenticated || authStore.user?.role !== UserRole.TEACHER) {
    router.push('/login')
  }
})

// 处理登出
const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}
</script>
