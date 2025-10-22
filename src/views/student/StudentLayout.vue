<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 导航栏 -->
    <nav class="bg-green-600 shadow">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <h1 class="text-xl font-semibold text-white">OEPG 系统 - 学生学习中心</h1>
          </div>
          <div class="flex items-center space-x-4">
            <span class="text-green-100">欢迎，{{ authStore.user?.realName }} 同学</span>
            <button @click="handleLogout" class="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-md text-sm font-medium">
              登出
            </button>
          </div>
        </div>
      </div>
    </nav>

    <!-- 侧边栏和主内容区域 -->
    <div class="flex">
      <!-- 侧边栏 -->
      <div class="w-64 bg-white shadow-sm min-h-screen">
        <nav class="mt-5 px-2">
          <div class="space-y-1">
            <router-link to="/student" exact-active-class="bg-green-100 text-green-700" class="text-gray-600 hover:bg-gray-50 hover:text-gray-900 group flex items-center px-2 py-2 text-sm font-medium rounded-md">
              <svg class="text-gray-400 group-hover:text-gray-500 mr-3 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6H8V5z" /></svg>
              学习中心
            </router-link>

            <router-link to="/student/exams" active-class="bg-green-100 text-green-700" class="text-gray-600 hover:bg-gray-50 hover:text-gray-900 group flex items-center px-2 py-2 text-sm font-medium rounded-md">
              <svg class="text-gray-400 group-hover:text-gray-500 mr-3 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
              在线考试
            </router-link>

            <router-link to="/student/records" active-class="bg-green-100 text-green-700" class="text-gray-600 hover:bg-gray-50 hover:text-gray-900 group flex items-center px-2 py-2 text-sm font-medium rounded-md">
              <svg class="text-gray-400 group-hover:text-gray-500 mr-3 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              我的记录
            </router-link>

             <router-link to="/student/courses" active-class="bg-green-100 text-green-700" class="text-gray-600 hover:bg-gray-50 hover:text-gray-900 group flex items-center px-2 py-2 text-sm font-medium rounded-md">
                <svg class="text-gray-400 group-hover:text-gray-500 mr-3 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v11.494m-9-5.747h18" /></svg>
                课程学习
            </router-link>
          </div>
        </nav>
      </div>

      <!-- 主内容区域 -->
      <div class="flex-1 overflow-hidden">
        <main class="flex-1 relative overflow-y-auto focus:outline-none">
          <div class="py-6">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              <router-view />
            </div>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}
</script>
