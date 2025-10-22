<template>
  <div class="p-6" v-if="record">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-semibold text-gray-900">考试记录详情 #{{ record.recordId }}</h1>
      <button @click="back" class="inline-flex items-center px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors">
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
        </svg>
        返回
      </button>
    </div>

    <div class="grid gap-6 md:grid-cols-2">
      <div class="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
        <h2 class="font-semibold text-lg mb-4 flex items-center text-gray-900">
          <svg class="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          基本信息
        </h2>
        <dl class="space-y-3">
          <div class="flex justify-between">
            <dt class="text-sm font-medium text-gray-500">记录ID</dt>
            <dd class="text-sm text-gray-900">{{ record.recordId }}</dd>
          </div>
          <div class="flex justify-between">
            <dt class="text-sm font-medium text-gray-500">考试ID</dt>
            <dd class="text-sm text-gray-900">{{ record.examId }}</dd>
          </div>
          <div class="flex justify-between">
            <dt class="text-sm font-medium text-gray-500">试卷ID</dt>
            <dd class="text-sm text-gray-900">{{ record.paperId }}</dd>
          </div>
          <div class="flex justify-between">
            <dt class="text-sm font-medium text-gray-500">状态</dt>
            <dd>
              <span :class="getStatusClass(record.status)" class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full">
                {{ getStatusText(record.status) }}
              </span>
            </dd>
          </div>
        </dl>
      </div>

      <div class="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
        <h2 class="font-semibold text-lg mb-4 flex items-center text-gray-900">
          <svg class="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
          </svg>
          分数与时间
        </h2>
        <dl class="space-y-3">
          <div class="flex justify-between">
            <dt class="text-sm font-medium text-gray-500">得分</dt>
            <dd class="text-sm">
              <span v-if="record.score !== null" class="text-2xl font-bold text-green-600">{{ record.score }}</span>
              <span v-else class="text-gray-400">待评分</span>
            </dd>
          </div>
          <div class="flex justify-between">
            <dt class="text-sm font-medium text-gray-500">开始时间</dt>
            <dd class="text-sm text-gray-900">{{ formatTime(record.startTime) }}</dd>
          </div>
          <div class="flex justify-between">
            <dt class="text-sm font-medium text-gray-500">提交时间</dt>
            <dd class="text-sm text-gray-900">{{ formatTime(record.submitTime) }}</dd>
          </div>
        </dl>
      </div>
    </div>

    <div class="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
      <div class="flex">
        <svg class="w-5 h-5 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        <p class="text-sm text-blue-800">提示：当前版本不展示作答明细与标准答案。教师评阅完成后，可在此查看详细反馈。</p>
      </div>
    </div>
  </div>
  <div v-else class="p-6 flex justify-center items-center">
    <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import studentExamService, { RecordResponse } from '@/services/studentExamService'

const route = useRoute()
const router = useRouter()
const recordId = Number(route.params.recordId)

const record = ref<RecordResponse | null>(null)

onMounted(async () => {
  record.value = await studentExamService.getRecordDetail(recordId)
})

function formatTime(s: string) {
  if (!s) return '-'
  try { return new Date(s).toLocaleString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }) } catch { return s }
}

function back() {
  router.push({ name: 'student-records' })
}

function getStatusText(status: string) {
  const map: Record<string, string> = {
    'ONGOING': '进行中',
    'SUBMITTED': '已提交',
    'GRADED': '已评分',
    'TIMEOUT': '超时'
  }
  return map[status] || status
}

function getStatusClass(status: string) {
  const map: Record<string, string> = {
    'ONGOING': 'bg-blue-100 text-blue-800',
    'SUBMITTED': 'bg-yellow-100 text-yellow-800',
    'GRADED': 'bg-green-100 text-green-800',
    'TIMEOUT': 'bg-red-100 text-red-800'
  }
  return map[status] || 'bg-gray-100 text-gray-800'
}
</script>
