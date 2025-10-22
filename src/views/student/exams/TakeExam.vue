<template>
  <div class="p-6" v-if="paper">
    <div class="bg-white rounded-lg shadow-md p-6 mb-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-semibold text-gray-900">{{ paper.examTitle }}</h1>
          <p class="text-sm text-gray-600 mt-1">记录ID：{{ paper.recordId }} · 时长：{{ paper.durationMinutes }} 分钟 · 总分：{{ paper.totalScore }}</p>
        </div>
        <div class="text-right">
          <div class="text-lg font-mono mb-2">剩余时间：<span :class="timeDanger ? 'text-red-600 font-bold' : 'text-green-600'">{{ remainText }}</span></div>
          <button @click="submit" :disabled="submitting" class="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium disabled:opacity-50">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            提交试卷
          </button>
        </div>
      </div>
    </div>

    <div class="space-y-6">
      <div v-for="(q, idx) in paper.questions" :key="q.questionId" class="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
        <div class="flex items-start justify-between mb-4">
          <h2 class="font-medium text-lg">
            <span class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-green-100 text-green-800 text-sm font-bold mr-2">{{ idx + 1 }}</span>
            {{ q.title }} 
            <span class="text-gray-500 text-sm ml-2">({{ q.type }} · {{ q.score }}分)</span>
          </h2>
          <span class="text-xs text-gray-400">#{{ q.questionId }}</span>
        </div>
        <div class="mt-3 mb-4 whitespace-pre-wrap text-gray-800 bg-gray-50 p-4 rounded">{{ q.content }}</div>

        <div class="mt-4">
          <template v-if="q.type === 'CHOICE'">
            <div class="space-y-2">
              <label v-for="(opt, i) in parseOptions(q.options)" :key="i" class="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                <input type="radio" :name="'q_'+q.questionId" :value="opt.value" v-model="answerMap[q.questionId]" class="w-4 h-4 text-green-600"/>
                <span class="text-gray-700">{{ opt.label }}</span>
              </label>
            </div>
          </template>
          <template v-else-if="q.type === 'FILL_BLANK'">
            <input v-model="answerMap[q.questionId]" type="text" class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent" placeholder="请输入答案，多空用 | 分隔"/>
          </template>
          <template v-else>
            <textarea v-model="answerMap[q.questionId]" class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent" rows="6" placeholder="请输入作答内容"></textarea>
          </template>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="p-6 flex justify-center items-center">
    <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, reactive, ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import studentExamService, { StartExamResponse } from '@/services/studentExamService'

const route = useRoute()
const router = useRouter()
const examId = Number(route.params.examId)

const paper = ref<StartExamResponse | null>(null)
const answerMap = reactive<Record<number, string>>({})
const submitting = ref(false)

const remainSeconds = ref(0)
const timer = ref<number | null>(null)
const remainText = computed(() => {
  const s = remainSeconds.value
  const mm = Math.floor(s / 60)
  const ss = s % 60
  return `${mm.toString().padStart(2,'0')}:${ss.toString().padStart(2,'0')}`
})
const timeDanger = computed(() => remainSeconds.value <= 300)

onMounted(async () => {
  const resp = await studentExamService.startExam(examId)
  paper.value = resp
  resp.questions.forEach(q => { answerMap[q.questionId] = '' })
  
  const now = Date.now()
  const durationMs = (resp.durationMinutes ?? 0) * 60 * 1000
  const startMs = new Date(resp.startTime || now).getTime()
  const endByDuration = startMs + durationMs
  const endByExam = resp.endTime ? new Date(resp.endTime).getTime() : Infinity
  const finalEnd = Math.min(endByDuration, endByExam)
  remainSeconds.value = Math.max(0, Math.floor((finalEnd - now) / 1000))
  
  timer.value = window.setInterval(() => {
    remainSeconds.value = Math.max(0, remainSeconds.value - 1)
    if (remainSeconds.value <= 0) {
      clearTimer()
      submit()
    }
  }, 1000)
})

onBeforeUnmount(() => clearTimer())
function clearTimer() { if (timer.value) { clearInterval(timer.value); timer.value = null } }

function parseOptions(ops?: string) {
  if (!ops) return []
  try {
    const arr = JSON.parse(ops) as string[]
    return arr.map((raw) => {
      const m = raw.match(/^([A-Z])\s*[\.|、]\s*(.*)$/)
      if (m) return { value: m[1], label: m[0] }
      return { value: raw.charAt(0), label: raw }
    })
  } catch {
    return []
  }
}

async function submit() {
  if (!paper.value || submitting.value) return
  submitting.value = true
  try {
    const payload = {
      recordId: paper.value.recordId,
      answers: Object.entries(answerMap).map(([qid, ans]) => ({
        questionId: Number(qid),
        answer: ans ?? '',
      })),
    }
    const resp = await studentExamService.submitExam(examId, payload)
    router.push({ name: 'student-record-detail', params: { recordId: resp.recordId } })
  } finally {
    submitting.value = false
  }
}
</script>
