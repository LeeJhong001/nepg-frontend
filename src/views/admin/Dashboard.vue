<template>
  <div class="space-y-6">
    <!-- 欢迎横幅 -->
    <div class="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-lg shadow-lg p-8 text-white">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold mb-2">管理员控制台</h1>
          <p class="text-blue-100 text-lg">系统管理与数据监控</p>
        </div>
        <div class="hidden md:block">
          <svg class="w-24 h-24 text-blue-200 opacity-50" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd"/>
          </svg>
        </div>
      </div>
    </div>

    <!-- 统计卡片 -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border-l-4 border-blue-500">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600 mb-1">用户总数</p>
            <p class="text-3xl font-bold text-gray-900">{{ stats.totalUsers }}</p>
            <p class="text-xs text-blue-600 mt-2">查看详情 →</p>
          </div>
          <div class="bg-blue-100 rounded-full p-4">
            <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/>
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border-l-4 border-green-500">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600 mb-1">题目总数</p>
            <p class="text-3xl font-bold text-gray-900">{{ stats.totalQuestions }}</p>
            <p class="text-xs text-green-600 mt-2">管理题库 →</p>
          </div>
          <div class="bg-green-100 rounded-full p-4">
            <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border-l-4 border-purple-500">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600 mb-1">分类总数</p>
            <p class="text-3xl font-bold text-gray-900">{{ stats.totalCategories }}</p>
            <p class="text-xs text-purple-600 mt-2">管理分类 →</p>
          </div>
          <div class="bg-purple-100 rounded-full p-4">
            <svg class="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/>
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border-l-4 border-amber-500">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600 mb-1">系统状态</p>
            <p class="text-xl font-bold text-green-600">运行正常</p>
            <p class="text-xs text-amber-600 mt-2">查看日志 →</p>
          </div>
          <div class="bg-amber-100 rounded-full p-4">
            <svg class="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- 快捷管理入口 -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <router-link to="/admin/users" class="group bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-all transform hover:-translate-y-1">
        <div class="flex flex-col items-center text-center">
          <div class="bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full p-6 mb-4 group-hover:scale-110 transition-transform">
            <svg class="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/>
            </svg>
          </div>
          <h3 class="text-xl font-bold text-gray-900 mb-2">用户管理</h3>
          <p class="text-gray-600 text-sm">管理系统用户账号和权限</p>
          <div class="mt-4 text-blue-600 font-medium group-hover:text-blue-700">
            进入管理 →
          </div>
        </div>
      </router-link>

      <router-link to="/admin/questions" class="group bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-all transform hover:-translate-y-1">
        <div class="flex flex-col items-center text-center">
          <div class="bg-gradient-to-br from-green-400 to-emerald-500 rounded-full p-6 mb-4 group-hover:scale-110 transition-transform">
            <svg class="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <h3 class="text-xl font-bold text-gray-900 mb-2">题库管理</h3>
          <p class="text-gray-600 text-sm">管理系统题目和题库内容</p>
          <div class="mt-4 text-green-600 font-medium group-hover:text-green-700">
            进入管理 →
          </div>
        </div>
      </router-link>

      <router-link to="/admin/question-categories" class="group bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-all transform hover:-translate-y-1">
        <div class="flex flex-col items-center text-center">
          <div class="bg-gradient-to-br from-purple-400 to-pink-500 rounded-full p-6 mb-4 group-hover:scale-110 transition-transform">
            <svg class="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/>
            </svg>
          </div>
          <h3 class="text-xl font-bold text-gray-900 mb-2">分类管理</h3>
          <p class="text-gray-600 text-sm">管理题目分类和标签</p>
          <div class="mt-4 text-purple-600 font-medium group-hover:text-purple-700">
            进入管理 →
          </div>
        </div>
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const stats = ref({
  totalUsers: 0,
  totalQuestions: 0,
  totalCategories: 0
})

onMounted(() => {
  // 模拟数据，实际应从后端获取
  stats.value = {
    totalUsers: 156,
    totalQuestions: 342,
    totalCategories: 12
  }
})
</script>
