<template>
  <div>
    <!-- 页面标题 -->
    <div class="mb-6">
      <h1 class="text-2xl font-semibold text-gray-900">
        {{ isEdit ? '编辑试卷' : '创建试卷' }}
      </h1>
      <p class="mt-1 text-sm text-gray-600">
        {{ isEdit ? '修改试卷信息和题目' : '创建新的试卷' }}
      </p>
    </div>

    <!-- 表单 -->
    <form @submit.prevent="submitForm" class="space-y-8">
      <!-- 基本信息 -->
      <div class="bg-white shadow rounded-lg">
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-medium text-gray-900">基本信息</h3>
        </div>
        <div class="p-6 space-y-6">
          <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label class="block text-sm font-medium text-gray-700">试卷名称 *</label>
              <input
                v-model="formData.title"
                type="text"
                required
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="请输入试卷名称"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">科目分类</label>
              <select
                v-model="formData.categoryId"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                <option value="">请选择分类</option>
                <option v-for="category in categories" :key="category.id" :value="category.id">
                  {{ category.name }}
                </option>
              </select>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">试卷描述</label>
            <textarea
              v-model="formData.description"
              rows="3"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder="请输入试卷描述"
            ></textarea>
          </div>

          <div class="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div>
              <label class="block text-sm font-medium text-gray-700">难度等级</label>
              <select
                v-model="formData.difficulty"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                <option value="easy">简单</option>
                <option value="medium">中等</option>
                <option value="hard">困难</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">考试时长（分钟）</label>
              <input
                v-model.number="formData.duration"
                type="number"
                min="1"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="建议考试时长"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">总分</label>
              <input
                v-model.number="formData.totalScore"
                type="number"
                min="1"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="自动计算"
                readonly
              />
            </div>
          </div>
        </div>
      </div>

      <!-- 题目管理 -->
      <div class="bg-white shadow rounded-lg">
        <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 class="text-lg font-medium text-gray-900">题目管理</h3>
          <div class="flex space-x-3">
            <button
              type="button"
              @click="showQuestionBank = true"
              class="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <svg class="-ml-0.5 mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              从题库添加
            </button>
            <button
              type="button"
              @click="createNewQuestion"
              class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              <svg class="-ml-0.5 mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              新建题目
            </button>
          </div>
        </div>
        <div class="p-6">
          <div v-if="formData.questions.length === 0" class="text-center py-12">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 class="mt-2 text-sm font-medium text-gray-900">暂无题目</h3>
            <p class="mt-1 text-sm text-gray-500">开始添加题目来组成试卷</p>
          </div>

          <div v-else class="space-y-4">
            <draggable
              v-model="formData.questions"
              item-key="id"
              handle=".drag-handle"
              @end="updateQuestionOrder"
            >
              <template #item="{ element: question, index }">
                <div class="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <div class="flex items-start justify-between">
                    <div class="flex items-start space-x-3 flex-1">
                      <div class="drag-handle cursor-move mt-1">
                        <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                      </div>
                      <div class="flex-1">
                        <div class="flex items-center space-x-2 mb-2">
                          <span class="text-sm font-medium text-gray-900">第 {{ index + 1 }} 题</span>
                          <span :class="getTypeClass(question.type)" class="inline-flex px-2 py-1 text-xs font-semibold rounded-full">
                            {{ getTypeText(question.type) }}
                          </span>
                          <span class="text-sm text-gray-500">{{ question.score }} 分</span>
                        </div>
                        <div class="text-sm text-gray-900 mb-2">{{ question.content }}</div>
                        <div v-if="question.options && question.options.length > 0" class="text-xs text-gray-500">
                          选项: {{ question.options.join(', ') }}
                        </div>
                      </div>
                    </div>
                    <div class="flex items-center space-x-2">
                      <input
                        v-model.number="question.score"
                        type="number"
                        min="1"
                        class="w-16 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                        @input="updateTotalScore"
                      />
                      <button
                        type="button"
                        @click="editQuestion(question)"
                        class="text-blue-600 hover:text-blue-900"
                      >
                        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        @click="removeQuestion(index)"
                        class="text-red-600 hover:text-red-900"
                      >
                        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </template>
            </draggable>
          </div>
        </div>
      </div>

      <!-- 提交按钮 -->
      <div class="flex justify-end space-x-3">
        <button
          type="button"
          @click="$router.go(-1)"
          class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          取消
        </button>
        <button
          type="button"
          @click="previewPaper"
          class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          预览试卷
        </button>
        <button
          type="submit"
          class="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {{ isEdit ? '保存修改' : '创建试卷' }}
        </button>
      </div>
    </form>

    <!-- 题库选择模态框 -->
    <QuestionBankModal
      v-if="showQuestionBank"
      @close="showQuestionBank = false"
      @select="addQuestionsFromBank"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import draggable from 'vuedraggable'
import QuestionBankModal from './QuestionBankModal.vue'
import { getEnabledSubjects, type Subject } from '@/services/common/subjectService'

const route = useRoute()
const router = useRouter()

const isEdit = computed(() => !!route.params.id)
const paperId = computed(() => route.params.id as string)

// 显示题库选择
const showQuestionBank = ref(false)

// 表单数据
const formData = ref({
  title: '',
  description: '',
  categoryId: null as number | null,
  difficulty: 'medium',
  duration: 120,
  totalScore: 0,
  questions: [] as any[]
})

// 科目列表
const categories = ref<Subject[]>([])

// 加载科目列表
const loadSubjects = async () => {
  try {
    categories.value = await getEnabledSubjects()
  } catch (error) {
    console.error('Failed to load subjects:', error)
  }
}

onMounted(() => {
  loadSubjects()
})

// 更新总分
const updateTotalScore = () => {
  formData.value.totalScore = formData.value.questions.reduce((sum, q) => sum + (q.score || 0), 0)
}

// 监听题目变化，自动更新总分
watch(() => formData.value.questions, () => {
  updateTotalScore()
}, { deep: true })

// 题目类型样式和文本
const getTypeClass = (type: string) => {
  switch (type) {
    case 'single':
      return 'bg-blue-100 text-blue-800'
    case 'multiple':
      return 'bg-green-100 text-green-800'
    case 'judge':
      return 'bg-yellow-100 text-yellow-800'
    case 'fill':
      return 'bg-purple-100 text-purple-800'
    case 'essay':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const getTypeText = (type: string) => {
  switch (type) {
    case 'single':
      return '单选'
    case 'multiple':
      return '多选'
    case 'judge':
      return '判断'
    case 'fill':
      return '填空'
    case 'essay':
      return '问答'
    default:
      return '未知'
  }
}

// 从题库添加题目
const addQuestionsFromBank = (questions: any[]) => {
  questions.forEach(question => {
    if (!formData.value.questions.find(q => q.id === question.id)) {
      formData.value.questions.push({
        ...question,
        order: formData.value.questions.length + 1
      })
    }
  })
  showQuestionBank.value = false
}

// 创建新题目
const createNewQuestion = () => {
  router.push('/teacher/questions/create?returnTo=' + encodeURIComponent(route.fullPath))
}

// 编辑题目
const editQuestion = (question: any) => {
  router.push(`/teacher/questions/${question.id}/edit?returnTo=` + encodeURIComponent(route.fullPath))
}

// 移除题目
const removeQuestion = (index: number) => {
  formData.value.questions.splice(index, 1)
}

// 更新题目顺序
const updateQuestionOrder = () => {
  formData.value.questions.forEach((question, index) => {
    question.order = index + 1
  })
}

// 预览试卷
const previewPaper = () => {
  // TODO: 实现试卷预览功能
  console.log('Preview paper:', formData.value)
}

// 提交表单
const submitForm = async () => {
  try {
    if (isEdit.value) {
      // TODO: 调用更新API
      console.log('Update paper:', paperId.value, formData.value)
    } else {
      // TODO: 调用创建API
      console.log('Create paper:', formData.value)
    }
    router.push('/teacher/exam-papers')
  } catch (error) {
    console.error('Failed to submit form:', error)
  }
}

// 加载数据
const loadData = async () => {
  try {
    // TODO: 加载分类列表
    
    if (isEdit.value) {
      // TODO: 加载试卷详情
      console.log('Load paper:', paperId.value)
    }
  } catch (error) {
    console.error('Failed to load data:', error)
  }
}

onMounted(() => {
  loadData()
})
</script>
