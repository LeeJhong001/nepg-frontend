<template>
  <div>
    <!-- 页面标题 -->
    <div class="mb-6">
      <h1 class="text-2xl font-semibold text-gray-900">
        {{ isEdit ? '编辑题目' : '创建题目' }}
      </h1>
      <p class="mt-1 text-sm text-gray-600">
        {{ isEdit ? '修改题目信息' : '创建新的题目' }}
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
          <div class="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div>
              <label class="block text-sm font-medium text-gray-700">题目类型 *</label>
              <select
                v-model="formData.type"
                required
                @change="onTypeChange"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                <option value="CHOICE">选择题</option>
                <option value="FILL_BLANK">填空题</option>
                <option value="SHORT_ANSWER">简答题</option>
                <option value="PROOF">证明题</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">分类</label>
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
            <div>
              <label class="block text-sm font-medium text-gray-700">难度等级</label>
              <select
                v-model="formData.difficulty"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                <option value="1">简单</option>
                <option value="2">中等</option>
                <option value="3">困难</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label class="block text-sm font-medium text-gray-700">分值 *</label>
              <input
                v-model.number="formData.score"
                type="number"
                min="1"
                required
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">标签</label>
              <input
                v-model="formData.tags"
                type="text"
                placeholder="用逗号分隔多个标签"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- 题目内容 -->
      <div class="bg-white shadow rounded-lg">
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-medium text-gray-900">题目内容</h3>
        </div>
        <div class="p-6 space-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-700">题干 *</label>
            <textarea
              v-model="formData.content"
              rows="4"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder="请输入题目内容"
            ></textarea>
          </div>

          <!-- 选择题选项 -->
          <div v-if="formData.type === 'CHOICE'">
            <label class="block text-sm font-medium text-gray-700 mb-3">选项设置</label>
            <div class="space-y-3">
              <div v-for="(option, index) in formData.options" :key="index" class="flex items-center space-x-3">
                <span class="text-sm font-medium text-gray-500 w-8">{{ getOptionLabel(index) }}.</span>
                <input
                  v-model="formData.options[index]"
                  type="text"
                  class="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  :placeholder="`选项 ${getOptionLabel(index)}`"
                />
                <button
                  v-if="formData.options.length > 2"
                  type="button"
                  @click="removeOption(index)"
                  class="text-red-600 hover:text-red-900"
                >
                  <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
              <button
                v-if="formData.options.length < 8"
                type="button"
                @click="addOption"
                class="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <svg class="-ml-0.5 mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
                添加选项
              </button>
            </div>
          </div>

          <!-- 填空题设置 -->
          <div v-if="formData.type === 'FILL_BLANK'">
            <label class="block text-sm font-medium text-gray-700 mb-3">填空设置</label>
            <div class="space-y-3">
              <div>
                <label class="block text-sm text-gray-600">填空数量</label>
                <input
                  v-model.number="formData.blankCount"
                  type="number"
                  min="1"
                  max="10"
                  class="mt-1 block w-32 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>
              <div class="text-sm text-gray-500">
                提示：在题干中使用 ______ 表示填空位置
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 答案设置 -->
      <div class="bg-white shadow rounded-lg">
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-medium text-gray-900">答案设置</h3>
        </div>
        <div class="p-6 space-y-6">
          <!-- 选择题答案 -->
          <div v-if="formData.type === 'CHOICE'">
            <label class="block text-sm font-medium text-gray-700 mb-3">正确答案</label>
            <div class="space-y-2">
              <div v-for="(option, index) in formData.options" :key="index" class="flex items-center">
                <input
                  v-model="formData.answer"
                  type="radio"
                  :value="getOptionLabel(index)"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <label class="ml-2 block text-sm text-gray-900">
                  {{ getOptionLabel(index) }}. {{ option }}
                </label>
              </div>
            </div>
          </div>

          <!-- 判断题答案 -->
          <div v-if="formData.type === 'judge'">
            <label class="block text-sm font-medium text-gray-700 mb-3">正确答案</label>
            <div class="space-y-2">
              <div class="flex items-center">
                <input
                  v-model="formData.correctAnswer"
                  type="radio"
                  value="true"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <label class="ml-2 block text-sm text-gray-900">正确</label>
              </div>
              <div class="flex items-center">
                <input
                  v-model="formData.correctAnswer"
                  type="radio"
                  value="false"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <label class="ml-2 block text-sm text-gray-900">错误</label>
              </div>
            </div>
          </div>

          <!-- 填空题答案 -->
          <div v-if="formData.type === 'FILL_BLANK'">
            <label class="block text-sm font-medium text-gray-700 mb-3">标准答案</label>
            <div class="space-y-3">
              <div v-for="(blank, index) in formData.blankCount" :key="index" class="flex items-center space-x-3">
                <span class="text-sm font-medium text-gray-500 w-16">第{{ index + 1 }}空：</span>
                <input
                  v-model="formData.fillAnswers[index]"
                  type="text"
                  class="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  :placeholder="`第${index + 1}空的答案`"
                />
              </div>
            </div>
          </div>

          <!-- 简答题答案 -->
          <div v-if="formData.type === 'SHORT_ANSWER'">
            <label class="block text-sm font-medium text-gray-700">参考答案</label>
            <textarea
              v-model="formData.answer"
              rows="6"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder="请输入参考答案"
            ></textarea>
          </div>

          <!-- 证明题答案 -->
          <div v-if="formData.type === 'PROOF'">
            <label class="block text-sm font-medium text-gray-700">参考答案</label>
            <textarea
              v-model="formData.answer"
              rows="6"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder="请输入参考答案"
            ></textarea>
          </div>

          <!-- 答案解析 -->
          <div>
            <label class="block text-sm font-medium text-gray-700">答案解析</label>
            <textarea
              v-model="formData.analysis"
              rows="3"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder="请输入答案解析（可选）"
            ></textarea>
          </div>
        </div>
      </div>

      <!-- 提交按钮 -->
      <div class="flex justify-end space-x-3">
        <button
          type="button"
          @click="goBack"
          class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          取消
        </button>
        <button
          type="button"
          @click="previewQuestion"
          class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          预览题目
        </button>
        <button
          type="submit"
          class="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {{ isEdit ? '保存修改' : '创建题目' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { teacherQuestionService } from '../../../services/teacher/questionService'
import { categoryService } from '../../../services/teacher/categoryService'
import { useNotification } from '../../../composables/useNotification'

const route = useRoute()
const router = useRouter()
const { success: showSuccess, error: showError } = useNotification()

const isEdit = computed(() => !!route.params.id)
const questionId = computed(() => route.params.id as string)

// 表单数据
const formData = ref({
  type: 'CHOICE',
  categoryId: null as number | null,
  difficulty: '2',
  score: 5,
  tags: '',
  content: '',
  options: ['', ''],
  correctAnswer: null as number | string | null,
  correctAnswers: [] as number[],
  blankCount: 1,
  fillAnswers: [''],
  referenceAnswer: '',
  analysis: '',
  title: '',
  answer: ''
})

// 分类列表
const categories = ref([])

// 监听填空数量变化
watch(() => formData.value.blankCount, (newCount) => {
  const currentLength = formData.value.fillAnswers.length
  if (newCount > currentLength) {
    // 增加填空
    for (let i = currentLength; i < newCount; i++) {
      formData.value.fillAnswers.push('')
    }
  } else if (newCount < currentLength) {
    // 减少填空
    formData.value.fillAnswers.splice(newCount)
  }
})

// 根据类型重置表单
const onTypeChange = () => {
  // 重置相关字段
  formData.value.options = []
  formData.value.correctAnswer = null
  formData.value.correctAnswers = []
  formData.value.judgeAnswer = false
  formData.value.blankCount = 1
  formData.value.fillAnswers = ['']
  formData.value.referenceAnswer = ''
  
  // 根据类型设置默认选项
  if (formData.value.type === 'CHOICE') {
    formData.value.options = ['', '', '', '']
  }
}

// 获取选项标签
const getOptionLabel = (index: number) => {
  return String.fromCharCode(65 + index) // A, B, C, D...
}

// 添加选项
const addOption = () => {
  formData.value.options.push('')
}

// 移除选项
const removeOption = (index: number) => {
  formData.value.options.splice(index, 1)
  
  // 调整正确答案
  if (formData.value.type === 'single') {
    if (formData.value.correctAnswer === index) {
      formData.value.correctAnswer = null
    } else if (formData.value.correctAnswer !== null && formData.value.correctAnswer > index) {
      formData.value.correctAnswer = (formData.value.correctAnswer as number) - 1
    }
  } else if (formData.value.type === 'multiple') {
    const newCorrectAnswers = formData.value.correctAnswers
      .filter(answer => answer !== index)
      .map(answer => answer > index ? answer - 1 : answer)
    formData.value.correctAnswers = newCorrectAnswers
  }
}

// 预览题目
const previewQuestion = () => {
  // TODO: 实现题目预览功能
  console.log('Preview question:', formData.value)
}

// 返回上一页
const goBack = () => {
  const returnTo = route.query.returnTo as string
  if (returnTo) {
    router.push(returnTo)
  } else {
    router.push('/teacher/questions')
  }
}

// 提交表单
const submitForm = async () => {
  try {
    const requestData = {
      title: formData.value.title,
      content: formData.value.content,
      type: formData.value.type,
      difficulty: Number(formData.value.difficulty),
      categoryId: formData.value.categoryId ? Number(formData.value.categoryId) : undefined,
      answer: formData.value.answer,
      analysis: formData.value.analysis,
      options: formData.value.type === 'CHOICE' ? 
        JSON.stringify(formData.value.options?.filter(opt => opt.trim()) || []) : 
        undefined,
      score: Number(formData.value.score)
    }
    
    if (isEdit.value && questionId.value) {
      await teacherQuestionService.updateQuestion(Number(questionId.value), requestData)
      showSuccess('题目更新成功')
    } else {
      await teacherQuestionService.createQuestion(requestData)
      showSuccess('题目创建成功')
    }
    goBack()
  } catch (error) {
    console.error('Failed to submit form:', error)
    showError('保存失败：' + (error as Error).message)
  }
}

// 加载数据
const loadData = async () => {
  try {
    // 加载分类列表
    const categoryResponse = await categoryService.getCategories()
    categories.value = categoryResponse.records || []
    
    // 如果是编辑模式，加载题目详情
    if (isEdit.value && questionId.value) {
      const questionResponse = await teacherQuestionService.getQuestionById(Number(questionId.value))
      
      // 填充表单数据
      console.log('Loading question data:', questionResponse)
      
      formData.value = {
        ...formData.value,
        title: questionResponse.title || '',
        content: questionResponse.content || '',
        type: questionResponse.type || 'CHOICE',
        difficulty: questionResponse.difficulty ? questionResponse.difficulty.toString() : '2',
        categoryId: questionResponse.categoryId || null,
        answer: questionResponse.answer || '',
        analysis: questionResponse.analysis || '',
        options: Array.isArray(questionResponse.options) ? questionResponse.options : 
                 (questionResponse.options ? JSON.parse(questionResponse.options) : ['', '', '', '']),
        score: questionResponse.score || 5
      }
      
      console.log('Form data after loading:', formData.value)
    }
  } catch (error) {
    console.error('Failed to load data:', error)
    showError('加载数据失败')
  }
}

onMounted(() => {
  loadData()
})
</script>
