<template>
  <div class="question-preview">
    <!-- 题目头部信息 -->
    <div class="flex items-center justify-between mb-4 p-4 bg-gray-50 rounded-lg">
      <div class="flex items-center gap-4">
        <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
              :class="getTypeBadgeClass(question.type)">
          {{ questionTypeLabels[question.type] }}
        </span>
        <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
              :class="getDifficultyBadgeClass(question.difficulty)">
          {{ difficultyLabels[question.difficulty] }}
        </span>
        <span class="text-sm text-gray-600">{{ question.score }}分</span>
      </div>
    </div>

    <!-- 题目标题 -->
    <h3 class="text-lg font-semibold text-gray-900 mb-3">{{ question.title }}</h3>

    <!-- 题目内容 -->
    <div class="prose prose-sm max-w-none mb-4">
      <div class="whitespace-pre-wrap text-gray-700">{{ question.content }}</div>
    </div>

    <!-- 选项（单选/多选题） -->
    <div v-if="hasOptions && question.options" class="space-y-2 mb-4">
      <div
        v-for="(option, index) in question.options"
        :key="index"
        class="flex items-center gap-3 p-3 border border-gray-200 rounded-lg"
        :class="{ 'bg-green-50 border-green-200': option.isCorrect }"
      >
        <span class="text-sm font-medium text-gray-600 w-6">{{ String.fromCharCode(65 + index) }}.</span>
        <span class="flex-1 text-gray-800">{{ option.content }}</span>
        <CheckIcon v-if="option.isCorrect" class="w-4 h-4 text-green-600" />
      </div>
    </div>

    <!-- 标准答案（非选择题） -->
    <div v-else-if="question.correctAnswer" class="mb-4">
      <div class="text-sm font-medium text-gray-700 mb-2">标准答案：</div>
      <div class="p-3 bg-green-50 border border-green-200 rounded-lg">
        <div class="whitespace-pre-wrap text-gray-800">{{ question.correctAnswer }}</div>
      </div>
    </div>

    <!-- 答案解析 -->
    <div v-if="question.explanation" class="mb-4">
      <div class="text-sm font-medium text-gray-700 mb-2">答案解析：</div>
      <div class="p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <div class="whitespace-pre-wrap text-gray-700">{{ question.explanation }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { CheckIcon } from '@heroicons/vue/24/solid'
import { QuestionType, DifficultyLevel } from '../../types/question'
import type { Question } from '../../types/question'

interface Props {
  question: Question
}

const props = defineProps<Props>()

// 题型标签
const questionTypeLabels: Record<QuestionType, string> = {
  [QuestionType.CHOICE]: '选择题',
  [QuestionType.FILL_BLANK]: '填空题',
  [QuestionType.SHORT_ANSWER]: '简答题',
  [QuestionType.PROOF]: '证明题'
}

// 难度标签
const difficultyLabels: Record<DifficultyLevel, string> = {
  1: '简单',
  2: '中等',
  3: '困难'
}

// 计算属性
const hasOptions = computed(() => {
  return props.question.type === QuestionType.CHOICE
})

// 方法
const getTypeBadgeClass = (type: QuestionType) => {
  const classes = {
    [QuestionType.CHOICE]: 'bg-blue-100 text-blue-800',
    [QuestionType.FILL_BLANK]: 'bg-green-100 text-green-800',
    [QuestionType.SHORT_ANSWER]: 'bg-yellow-100 text-yellow-800',
    [QuestionType.PROOF]: 'bg-red-100 text-red-800'
  }
  return classes[type]
}

const getDifficultyBadgeClass = (difficulty: DifficultyLevel) => {
  const classes = {
    1: 'bg-green-100 text-green-800',
    2: 'bg-yellow-100 text-yellow-800',
    3: 'bg-red-100 text-red-800'
  }
  return classes[difficulty]
}
</script>

<style scoped>
.question-preview {
  @apply border border-gray-200 rounded-lg p-4;
}

.prose {
  @apply text-gray-700;
}
</style>
