<template>
  <div class="p-6">
    <h1 class="text-2xl font-semibold mb-4">可参加的考试</h1>
    <div v-if="loading" class="text-gray-500">加载中...</div>
    <div v-else>
      <div v-if="exams.length === 0" class="text-gray-500">暂无可参加的考试</div>
      <div v-else class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div v-for="exam in exams" :key="exam.examId" class="border rounded p-4 bg-white shadow">
          <h2 class="text-lg font-medium">{{ exam.title }}</h2>
          <p class="text-sm text-gray-600 mt-1">时长：{{ exam.durationMinutes }} 分钟 · 总分：{{ exam.totalScore }}</p>
          <p class="text-sm text-gray-500 mt-1">开始：{{ format(exam.startTime) }}</p>
          <p class="text-sm text-gray-500">结束：{{ format(exam.endTime) }}</p>
          <button class="mt-3 inline-flex items-center px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  @click="goTake(exam.examId)">进入考试</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import studentExamService, { AvailableExam } from '@/services/student/examService'

const router = useRouter()
const loading = ref(false)
const exams = ref<AvailableExam[]>([])

onMounted(async () => {
  loading.value = true
  try {
    exams.value = await studentExamService.getAvailableExams()
  } finally {
    loading.value = false
  }
})

function goTake(examId: number) {
  router.push({ name: 'student-exams-take', params: { examId } })
}

function format(s: string) {
  if (!s) return '-'
  try { return new Date(s).toLocaleString() } catch { return s }
}
</script>

<style scoped>
</style>
