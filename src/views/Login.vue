<template>
  <div
    class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8"
  >
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <!-- Logo区域 -->
      <div class="flex justify-center mb-6">
        <div
          class="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center shadow-lg"
        >
          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
        </div>
      </div>

      <h2 class="text-center text-3xl font-bold text-gray-900 mb-2">欢迎回来</h2>
      <p class="text-center text-lg text-gray-600 mb-6">登录您的账户</p>
      <p class="text-center text-sm text-gray-500">
        还没有账户？
        <router-link
          to="/register"
          class="font-semibold text-blue-600 hover:text-blue-500 transition-colors duration-200 underline"
        >
          立即注册
        </router-link>
      </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div
        class="bg-white/80 backdrop-blur-sm py-8 px-6 shadow-xl rounded-2xl border border-white/20"
      >
        <form class="space-y-6" @submit.prevent="handleLogin">
          <!-- 用户名输入 -->
          <div>
            <label for="username" class="block text-sm font-semibold text-gray-700 mb-2">
              用户名
            </label>
            <div class="relative">
              <!-- <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  class="h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div> -->
              <input
                id="username"
                v-model="form.username"
                name="username"
                type="text"
                required
                class="block w-full pl-20 pr-3 py-3 border border-gray-300 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900"
                placeholder="请输入用户名"
              />
            </div>
          </div>

          <!-- 密码输入 -->
          <div>
            <label for="password" class="block text-sm font-semibold text-gray-700 mb-2">
              密码
            </label>
            <div class="relative">
              <!-- <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg
                  class="h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div> -->
              <input
                id="password"
                v-model="form.password"
                name="password"
                type="password"
                required
                class="block w-full pl-20 pr-3 py-3 border border-gray-300 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900"
                placeholder="请输入密码"
              />
            </div>
          </div>

          <!-- 错误消息 -->
          <div v-if="errorMessage" class="bg-red-50 border border-red-200 rounded-xl p-3">
            <div class="flex">
              <svg
                class="h-5 w-5 text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p class="ml-2 text-sm text-red-600">{{ errorMessage }}</p>
            </div>
          </div>

          <!-- 登录按钮 -->
          <div>
            <button
              type="submit"
              :disabled="authStore.loading"
              class="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-lg text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] transition-all duration-200"
            >
              <svg
                v-if="authStore.loading"
                class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              {{ authStore.loading ? '登录中...' : '登录' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import type { LoginRequest } from '../types/auth'

const router = useRouter()
const authStore = useAuthStore()

// 表单数据
const form = reactive<LoginRequest>({
  username: '',
  password: '',
})

// 错误消息
const errorMessage = ref('')

// 处理登录
const handleLogin = async () => {
  try {
    errorMessage.value = ''

    const result = await authStore.login(form)

    if (result.success) {
      // 登录成功，根据角色跳转到对应页面
      const userRole = authStore.user?.role
      if (userRole) {
        switch (userRole) {
          case 'ADMIN':
            router.push('/admin')
            break
          case 'TEACHER':
            router.push('/teacher')
            break
          case 'STUDENT':
            router.push('/student')
            break
          default:
            router.push('/')
        }
      } else {
        router.push('/')
      }
    } else {
      errorMessage.value = result.message
    }
  } catch (error: any) {
    errorMessage.value = error.message || '登录失败，请重试'
  }
}
</script>
