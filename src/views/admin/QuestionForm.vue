<template>
  <div class="question-form">
    <!-- 页面头部 -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">
          {{ isEdit ? '编辑题目' : '新建题目' }}
        </h1>
        <p class="text-gray-600">{{ isEdit ? '修改题目信息' : '添加新的题目到题库中' }}</p>
      </div>
      <button
        @click="handleBack"
        class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
      >
        <ArrowLeftIcon class="w-4 h-4 inline mr-2" />
        返回
      </button>
    </div>

    <!-- 表单 -->
    <form @submit.prevent="handleSubmit" class="space-y-6">
      <!-- 基本信息 -->
      <div class="bg-white rounded-lg shadow-sm p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">基本信息</h2>
        
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- 题目标题 -->
          <div class="lg:col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              题目标题 <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.title"
              type="text"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="请输入题目标题"
            />
          </div>

          <!-- 题型选择 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              题目类型 <span class="text-red-500">*</span>
            </label>
            <select
              v-model="form.type"
              required
              @change="handleTypeChange"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">请选择题目类型</option>
              <option value="CHOICE">选择题</option>
              <option value="FILL_BLANK">填空题</option>
              <option value="SHORT_ANSWER">简答题</option>
              <option value="PROOF">证明题</option>
            </select>
          </div>

          <!-- 难度等级 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              难度等级 <span class="text-red-500">*</span>
            </label>
            <select
              v-model.number="form.difficulty"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">请选择难度等级</option>
              <option value="1">简单</option>
              <option value="2">中等</option>
              <option value="3">困难</option>
            </select>
          </div>

          <!-- 题目分类 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              题目分类 <span class="text-red-500">*</span>
            </label>
            <select
              v-model.number="form.categoryId"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              style="font-family: 'Courier New', monospace; font-size: 14px;"
            >
              <option value="">请选择分类</option>
              <option v-for="category in categories" :key="category.id" :value="category.id">
                {{ category.displayName }}
              </option>
            </select>
          </div>

          <!-- 题目分值 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              题目分值 <span class="text-red-500">*</span>
            </label>
            <input
              v-model.number="form.score"
              type="number"
              min="1"
              max="100"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="请输入分值"
            />
          </div>
        </div>
      </div>

      <!-- 题目内容 -->
      <div class="bg-white rounded-lg shadow-sm p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">题目内容</h2>
        
        <div class="space-y-4">
          <!-- 题目描述 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              题目内容 <span class="text-red-500">*</span>
            </label>
            <textarea
              v-model="form.content"
              required
              rows="4"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="请输入题目内容"
            />
          </div>

          <!-- 选项设置 (单选/多选题) -->
          <div v-if="needOptions" class="space-y-4">
            <div class="flex items-center justify-between">
              <label class="block text-sm font-medium text-gray-700">
                选项设置 <span class="text-red-500">*</span>
              </label>
              <button
                type="button"
                @click="addOption"
                class="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
              >
                <PlusIcon class="w-4 h-4 inline mr-1" />
                添加选项
              </button>
            </div>

            <div class="space-y-2">
              <div
                v-for="(option, index) in form.options"
                :key="index"
                class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
              >
                <span class="text-sm font-medium text-gray-500 w-8">{{ String.fromCharCode(65 + index) }}</span>
                <input
                  v-model="option.content"
                  type="text"
                  required
                  class="flex-1 px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  :placeholder="`选项 ${String.fromCharCode(65 + index)}`"
                />
                <label class="flex items-center">
                  <input
                    v-model="option.isCorrect"
                    type="checkbox"
                    class="mr-2 text-blue-600"
                  />
                  <span class="text-sm text-gray-600">正确答案</span>
                </label>
                <button
                  v-if="form.options && form.options.length > 2"
                  type="button"
                  @click="removeOption(index)"
                  class="text-red-600 hover:text-red-800 transition-colors"
                >
                  <TrashIcon class="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <!-- 标准答案 (填空题/简答题/证明题) -->
          <div v-else>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              标准答案 <span class="text-red-500">*</span>
            </label>
            <textarea
              v-model="form.correctAnswer"
              required
              :rows="form.type === QType.PROOF || form.type === QType.SHORT_ANSWER ? 6 : 2"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              :placeholder="getAnswerPlaceholder()"
            />
          </div>

          <!-- 答案解析 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              答案解析（可选）
            </label>
            <textarea
              v-model="form.explanation"
              rows="3"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="请输入答案解析，帮助学生理解..."
            />
          </div>
        </div>
      </div>

      <!-- 预览区域 -->
      <div v-if="showPreview" class="bg-white rounded-lg shadow-sm p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">题目预览</h2>
        <QuestionPreview :question="previewData" />
      </div>

      <!-- 操作按钮 -->
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <label class="flex items-center">
            <input
              v-model="showPreview"
              type="checkbox"
              class="mr-2 text-blue-600"
            />
            <span class="text-sm text-gray-600">显示预览</span>
          </label>
        </div>
        
        <div class="flex gap-3">
          <button
            type="button"
            @click="handleBack"
            class="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            取消
          </button>
          <button
            type="button"
            @click="handleSaveDraft"
            class="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            保存草稿
          </button>
          <button
            type="submit"
            :disabled="!isFormValid || loading"
            class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="loading">
              <svg class="animate-spin -ml-1 mr-3 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              提交中...
            </span>
            <span v-else>{{ isEdit ? '更新题目' : '创建题目' }}</span>
          </button>
        </div>
      </div>
    </form>

    <!-- 通知容器 -->
    <NotificationContainer />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import {
  ArrowLeftIcon,
  PlusIcon,
  TrashIcon
} from '@heroicons/vue/24/outline'
import type {
  Question,
  QuestionType,
  DifficultyLevel,
  QuestionOption,
  CreateQuestionRequest,
  UpdateQuestionRequest
} from '../../types/question'
import { QuestionService } from '../../services/questionService'
import { QuestionCategoryService } from '../../services/questionCategoryService'
import type { QuestionCategory } from '../../types/question'
import { useNotification } from '../../composables/useNotification'
import NotificationContainer from '../../components/NotificationContainer.vue'
import QuestionPreview from './QuestionPreview.vue'

// 路由
const router = useRouter()
const route = useRoute()

// 通知系统
const { success, error, warning } = useNotification()

// 获取题目ID（编辑模式）
const questionId = computed(() => {
  const id = route.params.id
  return id ? Number(id) : null
})

const isEdit = computed(() => !!questionId.value)

// 响应式数据
const loading = ref(false)
const categories = ref<Array<QuestionCategory & { displayName: string }>>([])
const showPreview = ref(false)

// 暴露给模板使用 - 创建枚举常量
const QType = {
  CHOICE: 'CHOICE' as const,
  FILL_BLANK: 'FILL_BLANK' as const,
  SHORT_ANSWER: 'SHORT_ANSWER' as const,
  PROOF: 'PROOF' as const
}

// 表单数据
const form = reactive<CreateQuestionRequest & { id?: number }>({
  title: '',
  content: '',
  type: '' as any,
  difficulty: undefined as any,
  categoryId: undefined as any,
  score: 5,
  correctAnswer: '',
  explanation: '',
  options: []
})

// 注：现在使用统一的选择题类型，正确答案直接在options中标记

// 题型标签
const questionTypeLabels: Record<QuestionType, string> = {
  CHOICE: '选择题',
  FILL_BLANK: '填空题',
  SHORT_ANSWER: '简答题',
  PROOF: '证明题'
}

// 难度标签
const difficultyLabels: Record<DifficultyLevel, string> = {
  1: '简单',
  2: '中等',
  3: '困难'
}

// 计算属性
const needOptions = computed(() => {
  return form.type === QType.CHOICE
})

const isFormValid = computed(() => {
  // 验证分类ID是否为有效数字
  const categoryIdValid = form.categoryId && !isNaN(Number(form.categoryId))
  const basicValid = form.title && form.type && form.difficulty && categoryIdValid && form.score > 0 && form.content

  if (needOptions.value) {
    const hasOptions = form.options && form.options.length >= 2
    // 对于选择题，需要至少有一个正确答案
    const hasCorrectAnswer = form.options?.some(opt => opt.isCorrect)
    return basicValid && hasOptions && hasCorrectAnswer
  }

  return basicValid && form.correctAnswer
})

const previewData = computed((): Question => {
  return {
    ...form,
    id: questionId.value || undefined,
    status: 'ACTIVE' as any
  } as Question
})

// 将树形分类展平成列表，添加层级显示
const flattenCategories = (categories: QuestionCategory[], level: number = 0): Array<QuestionCategory & { displayName: string }> => {
  const result: Array<QuestionCategory & { displayName: string }> = []
  
  for (const category of categories) {
    if (category.enabled) {
      // 添加缩进表示层级关系
      const indent = '　'.repeat(level) // 使用全角空格作为缩进
      const prefix = level > 0 ? '└ ' : ''
      const displayName = indent + prefix + category.name
      
      result.push({
        ...category,
        displayName
      })
      
      // 递归处理子分类
      if (category.children && category.children.length > 0) {
        result.push(...flattenCategories(category.children, level + 1))
      }
    }
  }
  
  return result
}

// 方法
const loadCategories = async () => {
  try {
    const response = await QuestionCategoryService.getCategoryTree()
    // 将树形结构展平为列表
    categories.value = flattenCategories(response)
  } catch (err: any) {
    error('加载分类失败: ' + err.message)
    // 使用模拟数据
    const mockData = [
      { id: 1, name: '数学', parentId: undefined, description: '数学相关题目', sortOrder: 1, enabled: true, createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z',
        children: [
          { id: 3, name: '高等数学', parentId: 1, description: '高等数学题目', sortOrder: 1, enabled: true, createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z', children: [] },
          { id: 4, name: '线性代数', parentId: 1, description: '线性代数题目', sortOrder: 2, enabled: true, createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z', children: [] }
        ]
      },
      { id: 2, name: '物理', parentId: undefined, description: '物理相关题目', sortOrder: 2, enabled: true, createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z',
        children: [
          { id: 5, name: '力学', parentId: 2, description: '力学题目', sortOrder: 1, enabled: true, createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z', children: [] }
        ]
      }
    ]
    categories.value = flattenCategories(mockData)
  }
}

const loadQuestion = async () => {
  if (!questionId.value) return

  try {
    loading.value = true
    const question = await QuestionService.getQuestionById(questionId.value)
    
    // 处理选项数据 - 后端返回的是JSON字符串，需要解析为数组
    let parsedOptions: any[] = []
    if (question.options && typeof question.options === 'string') {
      try {
        parsedOptions = JSON.parse(question.options)
      } catch (e) {
        console.error('解析题目选项失败:', e)
        parsedOptions = []
      }
    } else if (Array.isArray(question.options)) {
      parsedOptions = [...question.options]
    }

    // 填充表单数据
    Object.assign(form, {
      title: question.title,
      content: question.content,
      type: question.type,
      difficulty: question.difficulty,
      categoryId: question.categoryId,
      score: question.score,
      correctAnswer: question.correctAnswer,
      explanation: question.explanation,
      options: parsedOptions
    })
  } catch (err: any) {
    error('加载题目失败: ' + err.message)
    router.back()
  } finally {
    loading.value = false
  }
}

const handleTypeChange = () => {
  // 重置选项相关数据
  form.options = []
  form.correctAnswer = ''

  // 为选择题创建默认选项
  if (needOptions.value) {
    addOption()
    addOption()
  }
}

const addOption = () => {
  if (!form.options) {
    form.options = []
  }
  if (form.options.length < 6) { // 最多6个选项
    form.options.push({
      content: '',
      isCorrect: false,
      order: form.options.length
    })
  }
}

const removeOption = (index: number) => {
  if (form.options && form.options.length > 2) {
    form.options.splice(index, 1)
    // 重新设置order
    form.options.forEach((opt, i) => {
      opt.order = i
    })
    // 选项删除后无需特殊处理，正确答案状态保留在剩余选项中
  }
}

const getAnswerPlaceholder = () => {
  switch (form.type) {
    case QType.FILL_BLANK:
      return '请输入标准答案，多个答案用分号分隔'
    case QType.SHORT_ANSWER:
      return '请输入简答题的标准答案'
    case QType.PROOF:
      return '请输入证明题的标准答案和证明步骤'
    default:
      return '请输入标准答案'
  }
}

const handleSubmit = async () => {
  if (!isFormValid.value) {
    warning('请完善表单信息')
    return
  }

  try {
    loading.value = true

    // 确保数字类型字段正确
    form.difficulty = Number(form.difficulty) as DifficultyLevel
    form.score = Number(form.score)
    
    // 验证分类ID
    const categoryId = Number(form.categoryId)
    if (!categoryId || isNaN(categoryId)) {
      error('请选择有效的题目分类')
      return
    }
    form.categoryId = categoryId

    // 准备发送给后端的数据
    const submitData = { ...form }
    console.log('Form data before submission:', submitData)
    
    // 处理选择题的正确答案和选项
    if (needOptions.value && form.options) {
      // 生成正确答案字符串（A,B,C等）
      const correctOptions = form.options
        .map((opt, index) => opt.isCorrect ? String.fromCharCode(65 + index) : null)
        .filter(Boolean)
      submitData.correctAnswer = correctOptions.join(',')
      
      // 将选项数组转换为JSON字符串
      submitData.options = JSON.stringify(form.options)
    } else {
      // 非选择题删除options字段或设为null
      submitData.options = undefined
    }

    if (isEdit.value && questionId.value) {
      await QuestionService.updateQuestion(questionId.value, submitData as UpdateQuestionRequest)
      success('题目更新成功')
    } else {
      await QuestionService.createQuestion(submitData as CreateQuestionRequest)
      success('题目创建成功')
    }

    router.push('/admin/questions')
  } catch (err: any) {
    error(`${isEdit.value ? '更新' : '创建'}题目失败: ${err.message}`)
  } finally {
    loading.value = false
  }
}

const handleSaveDraft = () => {
  // TODO: 实现保存草稿功能
  success('保存草稿功能暂未实现')
}

const handleBack = () => {
  router.back()
}

// 监听器（选择题类型变更时重置选项）
watch(() => form.type, (newType, oldType) => {
  if (oldType && newType !== oldType) {
    handleTypeChange()
  }
})

// 生命周期
onMounted(() => {
  loadCategories()
  if (isEdit.value) {
    loadQuestion()
  }
})
</script>

<style scoped>
.question-form {
  @apply max-w-4xl mx-auto p-6;
}

/* 表单样式 */
input:focus,
select:focus,
textarea:focus {
  @apply outline-none;
}

/* 选项列表样式 */
.option-item {
  @apply transition-all duration-200;
}

.option-item:hover {
  @apply bg-gray-100;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .question-form {
    @apply p-4;
  }
  
  .grid {
    @apply grid-cols-1;
  }
}
</style>
