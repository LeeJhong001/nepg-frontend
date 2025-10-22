<template>
  <div class="p-6">
    <div class="flex items-center justify-between mb-4">
      <h1 class="text-2xl font-semibold">我的考试记录</h1>
      <button class="inline-flex items-center px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700" @click="refresh">刷新</button>
    </div>
    <div v-if="loading" class="text-gray-500">加载中...</div>
    <div v-else>
      <table class="min-w-full bg-white border rounded shadow">
        <thead>
          <tr class="bg-gray-50 text-left">
            <th class="p-3 border-b">记录ID</th>
            <th class="p-3 border-b">考试ID</th>
            <th class="p-3 border-b">分数</th>
            <th class="p-3 border-b">状态</th>
            <th class="p-3 border-b">开始时间</th>
            <th class="p-3 border-b">提交时间</th>
            <th class="p-3 border-b">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="r in records" :key="r.recordId" class="hover:bg-gray-50">
            <td class="p-3 border-b">{{ r.recordId }}</td>
            <td class="p-3 border-b">{{ r.examId }}</td>
            <td class="p-3 border-b">{{ r.score ?? '-' }}</td>
            <td class="p-3 border-b">{{ r.status }}</td>
            <td class="p-3 border-b">{{ format(r.startTime) }}</td>
            <td class="p-3 border-b">{{ format(r.submitTime) }}</td>
            <td class="p-3 border-b">
              <button class="text-blue-600 hover:underline" @click="detail(r.recordId)">详情</button>
            </td>
          </tr>
        </tbody>
      </table>
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

function format(s: string) {
  if (!s) return '-'
  try { return new Date(s).toLocaleString() } catch { return s }
}
</script>

<style scoped>
</style>
