<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 导航栏 -->
    <nav class="bg-red-600 shadow">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <h1 class="text-xl font-semibold text-white">OEPG 系统 - 管理员面板</h1>
          </div>

          <div class="flex items-center space-x-4">
            <span class="text-red-100">欢迎，{{ authStore.user?.realName }}</span>
            <button
              @click="handleLogout"
              class="bg-red-700 hover:bg-red-800 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              登出
            </button>
          </div>
        </div>
      </div>
    </nav>

    <!-- 主要内容区域 -->
    <div class="flex">
      <!-- 侧边栏 -->
      <div class="w-64 bg-white shadow-lg min-h-screen">
        <div class="p-4">
          <h2 class="text-lg font-semibold text-gray-800 mb-4">管理菜单</h2>
          <nav class="space-y-2">
            <router-link
              to="/admin"
              class="flex items-center px-4 py-2 text-gray-700 rounded-md hover:bg-red-50 hover:text-red-700 transition-colors duration-200"
              :class="{ 'bg-red-100 text-red-700': $route.path === '/admin' }"
            >
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6H8V5z"
                />
              </svg>
              仪表板
            </router-link>

            <router-link
              to="/admin/users"
              class="flex items-center px-4 py-2 text-gray-700 rounded-md hover:bg-red-50 hover:text-red-700 transition-colors duration-200"
              :class="{ 'bg-red-100 text-red-700': $route.path === '/admin/users' }"
            >
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                />
              </svg>
              用户管理
            </router-link>

            <router-link
              to="/admin/projects"
              class="flex items-center px-4 py-2 text-gray-700 rounded-md hover:bg-red-50 hover:text-red-700 transition-colors duration-200"
              :class="{ 'bg-red-100 text-red-700': $route.path === '/admin/projects' }"
            >
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2"
                />
              </svg>
              项目管理
            </router-link>

            <router-link
              to="/admin/question-categories"
              class="flex items-center px-4 py-2 text-gray-700 rounded-md hover:bg-red-50 hover:text-red-700 transition-colors duration-200"
              :class="{ 'bg-red-100 text-red-700': $route.path === '/admin/question-categories' }"
            >
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
              题目分类管理
            </router-link>

            <router-link
              to="/admin/questions"
              class="flex items-center px-4 py-2 text-gray-700 rounded-md hover:bg-red-50 hover:text-red-700 transition-colors duration-200"
              :class="{ 'bg-red-100 text-red-700': $route.path === '/admin/questions' }"
            >
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              题目管理
            </router-link>
          </nav>
        </div>
      </div>

      <!-- 内容区域 -->
      <div class="flex-1 p-6">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '../../stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}
</script>
