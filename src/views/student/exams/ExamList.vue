<template>
  <div class="p-6">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-semibold text-gray-900">可参加的考试</h1>
      <button @click="refresh" class="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
        </svg>
        刷新
      </button>
    </div>

    <div v-if="loading" class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
    </div>

    <div v-else>
      <div v-if="exams.length === 0" class="text-center py-12">
        <svg class="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
        </svg>
        <p class="text-gray-500 text-lg">暂无可参加的考试</p>
      </div>

      <div v-else class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div v-for="exam in exams" :key="exam.examId" class="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-lg transition-shadow overflow-hidden">
          <div class="bg-gradient-to-r from-green-500 to-emerald-600 p-4">
            <h2 class="text-xl font-semibold text-white">{{ exam.title }}</h2>
          </div>
          <div class="p-5 space-y-3">
            <div class="flex items-center text-sm text-gray-600">
              <svg class="w-5 h-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              时长：{{ exam.durationMinutes }} 分钟
            </div>
            <div class="flex items-center text-sm text-gray-600">
              <svg class="w-5 h-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.539 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.196-1.539-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.783-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
              </svg>
              总分：{{ exam.totalScore }}
            </div>
            <div class="flex items-center text-sm text-gray-600">
              <svg class="w-5 h-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
              </svg>
              开始：{{ formatTime(exam.startTime) }}
            </div>
            <div class="flex items-center text-sm text-gray-600">
              <svg class="w-5 h-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
              </svg>
              结束：{{ formatTime(exam.endTime) }}
            </div>
            <button @click="goTake(exam.examId)" class="mt-4 w-full inline-flex justify-center items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
              </svg>
              进入考试
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import studentExamService, { AvailableExam } from '@/services/studentExamService'

const router = useRouter()
const loading = ref(false)
const exams = ref<AvailableExam[]>([])

onMounted(refresh)

async function refresh() {
  loading.value = true
  try {
    exams.value = await studentExamService.getAvailableExams()
  } finally {
    loading.value = false
  }
}

function goTake(examId: number) {
  router.push({ name: 'student-exams-take', params: { examId } })
}

function formatTime(s: string) {
  if (!s) return '-'
  try { return new Date(s).toLocaleString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }) } catch { return s }
}
</script>
