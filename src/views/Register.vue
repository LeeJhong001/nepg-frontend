<template>
  <div
    class="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8"
  >
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <!-- Logo区域 -->
      <div class="flex justify-center mb-6">
        <div
          class="w-16 h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center shadow-lg"
        >
          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
            />
          </svg>
        </div>
      </div>

      <h2 class="text-center text-3xl font-bold text-gray-900 mb-2">加入我们</h2>
      <p class="text-center text-lg text-gray-600 mb-6">创建您的账户</p>
      <p class="text-center text-sm text-gray-500">
        已有账户？
        <router-link
          to="/login"
          class="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors duration-200 underline"
        >
          立即登录
        </router-link>
      </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div
        class="bg-white/80 backdrop-blur-sm py-8 px-6 shadow-xl rounded-2xl border border-white/20"
      >
        <form class="space-y-6" @submit.prevent="handleRegister">
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
                class="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 text-gray-900"
                placeholder="请输入用户名"
              />
            </div>
          </div>

          <!-- 邮箱输入 -->
          <div>
            <label for="email" class="block text-sm font-semibold text-gray-700 mb-2"> 邮箱 </label>
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
                    d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div> -->
              <input
                id="email"
                v-model="form.email"
                name="email"
                type="email"
                required
                class="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 text-gray-900"
                placeholder="请输入邮箱地址"
              />
            </div>
          </div>

          <!-- 真实姓名输入 -->
          <div>
            <label for="realName" class="block text-sm font-semibold text-gray-700 mb-2">
              真实姓名
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
                id="realName"
                v-model="form.realName"
                name="realName"
                type="text"
                required
                class="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 text-gray-900"
                placeholder="请输入您的真实姓名"
              />
            </div>
          </div>

          <!-- 密码输入 -->
          <div>
            <label for="password" class="block text-sm font-semibold text-gray-700 mb-2">
              密码
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
                class="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 text-gray-900"
                placeholder="请输入密码"
              />
            </div>
          </div>

          <!-- 确认密码输入 -->
          <div>
            <label for="confirmPassword" class="block text-sm font-semibold text-gray-700 mb-2">
              确认密码
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
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div> -->
              <input
                id="confirmPassword"
                v-model="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                class="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 text-gray-900"
                placeholder="请再次输入密码"
              />
            </div>
          </div>

          <!-- 角色选择 -->
          <div>
            <label for="role" class="block text-sm font-semibold text-gray-700 mb-2">
              选择角色
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
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
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <select
                id="role"
                v-model="form.role"
                name="role"
                class="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 text-gray-900 bg-white"
              >
                <option value="STUDENT">🎓 学生 - 参加考试</option>
                <option value="TEACHER">👨‍🏫 教师 - 管理考试</option>
                <option value="ADMIN">⚙️ 管理员 - 系统管理</option>
              </select>
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

          <!-- 注册按钮 -->
          <div>
            <button
              type="submit"
              :disabled="authStore.loading || !isFormValid"
              class="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-lg text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] transition-all duration-200"
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
              {{ authStore.loading ? '注册中...' : '创建账户' }}
            </button>
          </div>
        </form>

        <!-- 注册协议 -->
        <div class="mt-6">
          <div class="text-center">
            <p class="text-xs text-gray-500">
              注册即表示您同意我们的
              <a href="#" class="text-indigo-600 hover:text-indigo-500 font-medium">服务条款</a>
              和
              <a href="#" class="text-indigo-600 hover:text-indigo-500 font-medium">隐私政策</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import type { RegisterRequest } from '../types/auth'
import { UserRole } from '../types/auth'

const router = useRouter()
const authStore = useAuthStore()

// 表单数据
const form = reactive<RegisterRequest>({
  username: '',
  email: '',
  realName: '',
  password: '',
  role: UserRole.STUDENT,
})

// 确认密码
const confirmPassword = ref('')

// 错误消息
const errorMessage = ref('')

// 表单验证
const isFormValid = computed(() => {
  return (
    form.username.trim() !== '' &&
    form.email.trim() !== '' &&
    form.realName.trim() !== '' &&
    form.password.trim() !== '' &&
    confirmPassword.value.trim() !== '' &&
    form.password === confirmPassword.value &&
    form.password.length >= 6
  )
})

// 处理注册
const handleRegister = async () => {
  try {
    errorMessage.value = ''

    // 验证密码
    if (form.password !== confirmPassword.value) {
      errorMessage.value = '两次输入的密码不一致'
      return
    }

    if (form.password.length < 6) {
      errorMessage.value = '密码长度至少6位'
      return
    }

    const result = await authStore.register(form)

    if (result.success) {
      // 注册成功，根据角色跳转到对应页面
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
    errorMessage.value = error.message || '注册失败，请重试'
  }
}
</script>
