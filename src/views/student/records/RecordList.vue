<template>
  <div class="p-6">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-semibold text-gray-900">我的考试记录</h1>
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

    <div v-else class="bg-white rounded-lg shadow-md overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">记录ID</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">考试ID</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">分数</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">状态</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">开始时间</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">提交时间</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="r in records" :key="r.recordId" class="hover:bg-gray-50 transition-colors">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ r.recordId }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ r.examId }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                <span v-if="r.score !== null" class="font-semibold text-green-600">{{ r.score }}</span>
                <span v-else class="text-gray-400">-</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="getStatusClass(r.status)" class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full">
                  {{ getStatusText(r.status) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ formatTime(r.startTime) }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ formatTime(r.submitTime) }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                <button @click="detail(r.recordId)" class="text-green-600 hover:text-green-900 font-medium">查看详情</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-if="records.length === 0" class="text-center py-12">
        <svg class="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
        </svg>
        <p class="text-gray-500 text-lg">暂无考试记录</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import studentExamService, { RecordResponse } from '@/services/studentExamService'

const router = useRouter()
const loading = ref(false)
const records = ref<RecordResponse[]>([])

onMounted(refresh)

async function refresh() {
  loading.value = true
  try {
    records.value = await studentExamService.getMyRecords()
  } finally {
    loading.value = false
  }
}

function detail(recordId: number) {
  router.push({ name: 'student-record-detail', params: { recordId } })
}

function formatTime(s: string) {
  if (!s) return '-'
  try { return new Date(s).toLocaleString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }) } catch { return s }
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
