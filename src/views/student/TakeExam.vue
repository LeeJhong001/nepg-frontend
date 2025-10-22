<template>
  <div class="p-6" v-if="paper">
    <div class="flex items-center justify-between mb-4">
      <div>
        <h1 class="text-2xl font-semibold">{{ paper.examTitle }}</h1>
        <p class="text-sm text-gray-600">记录ID：{{ paper.recordId }} · 时长：{{ paper.durationMinutes }} 分钟 · 总分：{{ paper.totalScore }}</p>
      </div>
      <div class="text-right">
        <div class="text-lg font-mono">剩余时间：<span :class="timeDanger ? 'text-red-600' : ''">{{ remainText }}</span></div>
        <button class="mt-2 inline-flex items-center px-3 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700"
                @click="submit" :disabled="submitting">提交试卷</button>
      </div>
    </div>

    <div class="space-y-6">
      <div v-for="(q, idx) in paper.questions" :key="q.questionId" class="bg-white border rounded shadow p-4">
        <div class="flex items-start justify-between">
          <h2 class="font-medium">{{ idx + 1 }}. {{ q.title }} <span class="text-gray-500 text-sm">（{{ q.type }} · {{ q.score }}分）</span></h2>
          <span class="text-xs text-gray-400">#{{ q.questionId }}</span>
        </div>
        <div class="mt-2 whitespace-pre-wrap text-gray-800">{{ q.content }}</div>

        <div class="mt-3">
          <template v-if="q.type === 'CHOICE'">
            <div class="space-y-2">
              <label v-for="(opt, i) in parseOptions(q.options)" :key="i" class="flex items-center space-x-2">
                <input type="radio" :name="'q_'+q.questionId" :value="opt.value" v-model="answerMap[q.questionId]"/>
                <span>{{ opt.label }}</span>
              </label>
            </div>
          </template>
          <template v-else-if="q.type === 'FILL_BLANK'">
            <input v-model="answerMap[q.questionId]" type="text" class="w-full border rounded px-3 py-2" placeholder="请输入答案，多空用 | 分隔"/>
          </template>
          <template v-else>
            <textarea v-model="answerMap[q.questionId]" class="w-full border rounded px-3 py-2" rows="4" placeholder="请输入作答内容"></textarea>
          </template>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="p-6 text-gray-500">加载中...</div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, reactive, ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import studentExamService, { StartExamResponse } from '@/services/student/examService'

const route = useRoute()
const router = useRouter()
const examId = Number(route.params.examId)

const paper = ref<StartExamResponse | null>(null)
const answerMap = reactive<Record<number, string>>({})
const submitting = ref(false)

// 倒计时
const remainSeconds = ref(0)
const timer = ref<number | null>(null)
const remainText = computed(() => {
  const s = remainSeconds.value
  const mm = Math.floor(s / 60)
  const ss = s % 60
  return `${mm.toString().padStart(2,'0')}:${ss.toString().padStart(2,'0')}`
})
const timeDanger = computed(() => remainSeconds.value <= 60)

onMounted(async () => {
  // 开始考试
  const resp = await studentExamService.startExam(examId)
  paper.value = resp
  // 初始化答案结构
  resp.questions.forEach(q => { answerMap[q.questionId] = '' })
  // 计算剩余秒数：以当前时刻和 duration 为准；若提供 endTime 也做保护
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
      // 若无字母前缀，则取前1字为值
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
    // 跳转记录详情
    router.push({ name: 'student-record-detail', params: { recordId: resp.recordId } })
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
</style>
