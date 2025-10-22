<template>
  <div class="p-6">
    <!-- 欢迎信息 -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-800">欢迎回来，{{ authStore.user?.realName }}！</h1>
      <p class="text-gray-600">准备好迎接新的挑战了吗？</p>
    </div>

    <!-- 动态统计卡片 -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div class="bg-white p-6 rounded-lg shadow-md flex items-center justify-between">
        <div>
          <p class="text-sm font-medium text-gray-500">可参加的考试</p>
          <p class="text-2xl font-bold text-gray-800">{{ availableExamsCount }}</p>
        </div>
        <div class="bg-green-100 text-green-600 p-3 rounded-full">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path></svg>
        </div>
      </div>
      <div class="bg-white p-6 rounded-lg shadow-md flex items-center justify-between">
        <div>
          <p class="text-sm font-medium text-gray-500">已完成的考试</p>
          <p class="text-2xl font-bold text-gray-800">{{ completedExamsCount }}</p>
        </div>
        <div class="bg-blue-100 text-blue-600 p-3 rounded-full">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        </div>
      </div>
    </div>

    <!-- 快捷功能入口 -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <router-link to="/student/exams" class="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center">
        <div class="bg-green-100 text-green-600 p-4 inline-block rounded-full mb-4">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path></svg>
        </div>
        <h3 class="text-lg font-semibold text-gray-800">在线考试</h3>
        <p class="text-gray-500 mt-1">查看并参加可用的在线考试</p>
      </router-link>

      <router-link to="/student/records" class="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center">
        <div class="bg-blue-100 text-blue-600 p-4 inline-block rounded-full mb-4">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
        </div>
        <h3 class="text-lg font-semibold text-gray-800">我的记录</h3>
        <p class="text-gray-500 mt-1">查看您所有的考试记录和成绩</p>
      </router-link>

      <router-link to="/student/courses" class="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center">
        <div class="bg-purple-100 text-purple-600 p-4 inline-block rounded-full mb-4">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v11.494m-9-5.747h18"></path></svg>
        </div>
        <h3 class="text-lg font-semibold text-gray-800">课程学习</h3>
        <p class="text-gray-500 mt-1">查看和学习已选课程</p>
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuthStore } from '../../stores/auth'
import studentExamService from '@/services/student/examService'

const authStore = useAuthStore()

const availableExamsCount = ref(0)
const completedExamsCount = ref(0)

onMounted(async () => {
  try {
    const availableExams = await studentExamService.getAvailableExams()
    availableExamsCount.value = availableExams.length

    const records = await studentExamService.getMyRecords()
    completedExamsCount.value = records.filter(r => r.status === 'GRADED' || r.status === 'SUBMITTED').length
  } catch (error) {
    console.error("Failed to fetch student dashboard data:", error)
  }
})
</script>
