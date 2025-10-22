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
      <div class="w-72 bg-white shadow-lg min-h-screen border-r border-gray-200">
        <div class="p-5">
          <h2 class="text-xl font-semibold text-gray-800 mb-6">管理菜单</h2>
          <nav class="space-y-2">
            <router-link
              to="/admin"
              class="flex items-center px-4 py-3 text-base text-gray-700 rounded-lg hover:bg-red-50 hover:text-red-700 transition-colors duration-200"
              :class="{ 'bg-red-100 text-red-700': $route.path === '/admin' }"
            >
              <svg class="w-6 h-6 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              仪表板
            </router-link>

            <router-link
              to="/admin/users"
              class="flex items-center px-4 py-3 text-base text-gray-700 rounded-lg hover:bg-red-50 hover:text-red-700 transition-colors duration-200"
              :class="{ 'bg-red-100 text-red-700': $route.path === '/admin/users' }"
            >
              <svg class="w-6 h-6 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
              用户管理
            </router-link>

            <router-link
              to="/admin/question-categories"
              class="flex items-center px-4 py-3 text-base text-gray-700 rounded-lg hover:bg-red-50 hover:text-red-700 transition-colors duration-200"
              :class="{ 'bg-red-100 text-red-700': $route.path === '/admin/question-categories' }"
            >
              <svg class="w-6 h-6 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                />
              </svg>
              题目分类管理
            </router-link>

            <router-link
              to="/admin/questions"
              class="flex items-center px-4 py-3 text-base text-gray-700 rounded-lg hover:bg-red-50 hover:text-red-700 transition-colors duration-200"
              :class="{ 'bg-red-100 text-red-700': $route.path === '/admin/questions' }"
            >
              <svg class="w-6 h-6 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              题目管理
            </router-link>

            <router-link
              to="/admin/subjects"
              class="flex items-center px-4 py-3 text-base text-gray-700 rounded-lg hover:bg-red-50 hover:text-red-700 transition-colors duration-200"
              :class="{ 'bg-red-100 text-red-700': $route.path === '/admin/subjects' }"
            >
              <svg class="w-6 h-6 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
              科目管理
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
