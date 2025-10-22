<template>
  <div class="p-6" v-if="record">
    <div class="flex items-center justify-between mb-4">
      <h1 class="text-2xl font-semibold">考试记录详情 #{{ record.recordId }}</h1>
      <button class="inline-flex items-center px-3 py-2 bg-gray-200 rounded hover:bg-gray-300" @click="back">返回</button>
    </div>

    <div class="grid gap-4 md:grid-cols-2">
      <div class="bg-white border rounded shadow p-4">
        <h2 class="font-medium mb-2">基本信息</h2>
        <p>记录ID：{{ record.recordId }}</p>
        <p>考试ID：{{ record.examId }}</p>
        <p>试卷ID：{{ record.paperId }}</p>
        <p>状态：{{ record.status }}</p>
      </div>
      <div class="bg-white border rounded shadow p-4">
        <h2 class="font-medium mb-2">分数与时间</h2>
        <p>得分：{{ record.score ?? '-' }}</p>
        <p>开始：{{ format(record.startTime) }}</p>
        <p>提交：{{ format(record.submitTime) }}</p>
      </div>
    </div>

    <div class="mt-6 text-sm text-gray-500">提示：当前版本不展示作答明细与标准答案；后续可在教师评阅完成后提供回看功能。</div>
  </div>
  <div v-else class="p-6 text-gray-500">加载中...</div>
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

function format(s: string) {
  if (!s) return '-'
  try { return new Date(s).toLocaleString() } catch { return s }
}

function back() {
  router.push({ name: 'student-records' })
}
</script>

<style scoped>
</style>
