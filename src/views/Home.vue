<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 导航栏 -->
    <nav class="bg-white shadow">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <h1 class="text-xl font-semibold text-gray-900">OEPG 系统</h1>
          </div>

          <div class="flex items-center space-x-4">
            <span class="text-gray-700">欢迎，{{ authStore.user?.username }}</span>
            <button
              @click="handleLogout"
              class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              登出
            </button>
          </div>
        </div>
      </div>
    </nav>

    <!-- 主要内容 -->
    <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="px-4 py-6 sm:px-0">
        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="px-4 py-5 sm:p-6">
            <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">用户信息</h3>

            <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <dt class="text-sm font-medium text-gray-500">用户名</dt>
                <dd class="mt-1 text-sm text-gray-900">{{ user?.username || '加载中...' }}</dd>
              </div>

              <div>
                <dt class="text-sm font-medium text-gray-500">真实姓名</dt>
                <dd class="mt-1 text-sm text-gray-900">{{ user?.realName || '加载中...' }}</dd>
              </div>

              <div>
                <dt class="text-sm font-medium text-gray-500">邮箱</dt>
                <dd class="mt-1 text-sm text-gray-900">{{ user?.email || '加载中...' }}</dd>
              </div>

              <div>
                <dt class="text-sm font-medium text-gray-500">角色</dt>
                <dd class="mt-1 text-sm text-gray-900">
                  {{ getRoleDisplayName(user?.role) }}
                </dd>
              </div>

              <div>
                <dt class="text-sm font-medium text-gray-500">注册时间</dt>
                <dd class="mt-1 text-sm text-gray-900">
                  {{ formatDate(user?.createdAt) }}
                </dd>
              </div>
            </div>

            <!-- 角色跳转按钮 -->
            <div class="mt-6 pt-6 border-t border-gray-200">
              <h4 class="text-sm font-medium text-gray-700 mb-3">快速导航</h4>
              <div class="flex flex-wrap gap-3">
                <button
                  v-if="user?.role === UserRole.ADMIN"
                  @click="navigateByRole"
                  class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944A11.955 11.955 0 012.944 12A11.955 11.955 0 0112 21.056A11.955 11.955 0 0121.056 12z"
                    />
                  </svg>
                  进入管理员面板
                </button>

                <button
                  v-if="user?.role === UserRole.TEACHER"
                  @click="navigateByRole"
                  class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 5.477 5.754 5 7.5 5s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.523 18.246 19 16.5 19c-1.746 0-3.332-.477-4.5-1.253"
                    />
                  </svg>
                  进入教师工作台
                </button>

                <button
                  v-if="user?.role === UserRole.STUDENT"
                  @click="navigateByRole"
                  class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 14l9-5-9-5-9 5 9 5z"
                    />
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
                    />
                  </svg>
                  进入学习中心
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- 功能卡片 -->
        <div class="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="p-5">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <svg
                    class="h-6 w-6 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">创建项目</dt>
                    <dd class="text-lg font-medium text-gray-900">新建</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="p-5">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <svg
                    class="h-6 w-6 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">项目统计</dt>
                    <dd class="text-lg font-medium text-gray-900">查看</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="p-5">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <svg
                    class="h-6 w-6 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">系统设置</dt>
                    <dd class="text-lg font-medium text-gray-900">配置</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { UserRole } from '../types/auth'
import { onMounted, computed } from 'vue'

const router = useRouter()
const authStore = useAuthStore()

// 计算属性：检查用户是否已认证
const isAuthenticated = computed(() => authStore.isAuthenticated)
const user = computed(() => authStore.user)

// 获取角色显示名称
const getRoleDisplayName = (role?: UserRole) => {
  switch (role) {
    case UserRole.ADMIN:
      return '管理员'
    case UserRole.TEACHER:
      return '教师'
    case UserRole.STUDENT:
      return '学生'
    default:
      return '未知'
  }
}

// 格式化日期
const formatDate = (dateString?: string) => {
  if (!dateString) return '未知'
  try {
    return new Date(dateString).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch (error) {
    return '未知'
  }
}

// 根据角色跳转到不同页面
const navigateByRole = () => {
  if (!user.value?.role) return

  switch (user.value.role) {
    case UserRole.ADMIN:
      router.push('/admin')
      break
    case UserRole.TEACHER:
      router.push('/teacher')
      break
    case UserRole.STUDENT:
      router.push('/student')
      break
  }
}

// 处理登出
const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}

// 组件挂载时检查认证状态
onMounted(async () => {
  if (!isAuthenticated.value) {
    router.push('/login')
    return
  }

  // 如果没有用户信息，尝试重新获取
  if (!user.value) {
    try {
      await authStore.initialize()
    } catch (error) {
      console.error('获取用户信息失败:', error)
      router.push('/login')
    }
  }

  // 如果有用户信息，根据角色自动跳转
  if (user.value?.role) {
    navigateByRole()
  }
})
</script>
