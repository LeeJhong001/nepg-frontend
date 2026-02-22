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
    <form @submit.prevent="submitForm" novalidate class="space-y-8">
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
          </div>

          <!-- 学科和分类选择 -->
          <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label class="block text-sm font-medium text-gray-700">所属学科 *</label>
              <select
                v-model="formData.subjectId"
                @change="onSubjectChange"
                required
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                <option :value="null">请选择学科</option>
                <option v-for="subject in categoryTree" :key="subject.id" :value="subject.id">
                  {{ subject.name }}
                </option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">所属分类 *</label>
              <select
                v-model="formData.categoryId"
                :disabled="!formData.subjectId"
                required
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option :value="null">请先选择学科</option>
                <option v-for="category in getSubjectCategories(formData.subjectId)" :key="category.id" :value="category.id">
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
          :disabled="isSubmitting"
          class="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span v-if="isSubmitting">保存中...</span>
          <span v-else>{{ isEdit ? '保存修改' : '创建试卷' }}</span>
        </button>
      </div>
    </form>

    <!-- 题库选择模态框 -->
    <QuestionBankModal
      v-if="showQuestionBank"
      :subject-id="formData.subjectId"
      :category-id="formData.categoryId"
      @close="showQuestionBank = false"
      @select="addQuestionsFromBank"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import draggable from 'vuedraggable'
// @ts-ignore - Vue SFC component
import QuestionBankModal from './QuestionBankModal.vue'
import type { Category } from '../../../services/teacher/categoryService'
import { teacherCategoryService } from '../../../services/teacher/categoryService'
import { teacherExamPaperService } from '../../../services/teacher/examPaperService'
import { useNotification } from '../../../composables/useNotification'
import { ROUTE_NAMES, DEFAULT_CONFIG } from '../../../constants'
import { extractErrorMessage, logError } from '../../../utils/errorHandler'

const route = useRoute()
const router = useRouter()
const { success: showSuccess, error: showError } = useNotification()

const isEdit = computed(() => !!route.params.id)
const paperId = computed(() => route.params.id as string)

// 显示题库选择
const showQuestionBank = ref(false)

// 提交状态
const isSubmitting = ref(false)

// 表单数据
const formData = ref({
  title: '',
  description: '',
  subjectId: null as number | null, // 所属学科ID
  categoryId: null as number | null, // 所属分类ID
  difficulty: DEFAULT_CONFIG.EXAM_PAPER.DIFFICULTY,
  duration: Number(DEFAULT_CONFIG.EXAM_PAPER.DURATION),
  totalScore: 0,
  questions: [] as any[]
})

// 分类树（保持树形结构）
const categoryTree = ref<Category[]>([])
const loadingCategories = ref(false)

// 获取指定学科下的所有分类（包括子分类）
const getSubjectCategories = (subjectId: number | null): Category[] => {
  if (!subjectId) return []
  const subject = categoryTree.value.find(s => s.id === subjectId)
  if (!subject) return []
  
  // 递归获取所有子分类
  const getAllChildren = (category: Category): Category[] => {
    const result: Category[] = []
    if (category.children && category.children.length > 0) {
      category.children.forEach(child => {
        result.push(child)
        result.push(...getAllChildren(child))
      })
    }
    return result
  }
  
  return getAllChildren(subject)
  }

// 学科变更时清空分类选择
const onSubjectChange = () => {
  formData.value.categoryId = null
}

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
      // 确保题目类型正确转换
      const normalizedType = mapQuestionType(question.type || question.questionType)
      
      formData.value.questions.push({
        id: question.id,
        title: question.title,
        content: question.content || question.questionContent,
        type: normalizedType,
        score: question.score || 0,
        options: question.options ? (typeof question.options === 'string' ? JSON.parse(question.options) : question.options) : [],
        order: formData.value.questions.length + 1
      })
    }
  })
  showQuestionBank.value = false
  updateTotalScore()
}

// 创建新题目
const createNewQuestion = () => {
  router.push({
    name: ROUTE_NAMES.TEACHER.QUESTIONS_CREATE,
    query: { returnTo: route.fullPath }
  })
}

// 编辑题目
const editQuestion = (question: any) => {
  router.push({
    name: ROUTE_NAMES.TEACHER.QUESTIONS_EDIT,
    params: { id: question.id },
    query: { returnTo: route.fullPath }
  })
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
  if (isEdit.value) {
    router.push({
      name: 'teacher-exam-papers-preview',
      params: { id: paperId.value }
    })
  } else {
    showError('请先保存试卷后再预览')
  }
}

// 提交表单
const submitForm = async (e?: Event) => {
  // 阻止表单默认提交行为
  if (e) {
    e.preventDefault()
    e.stopPropagation()
  }
  
  console.log('=== 表单提交开始 ===')
  console.log('提交事件:', e)
  console.log('编辑模式:', isEdit.value)
  console.log('当前状态 - isSubmitting:', isSubmitting.value)
  
  // 防止重复提交
  if (isSubmitting.value) {
    console.warn('正在提交中，忽略重复提交')
    return
  }

  // 表单验证
  console.log('开始表单验证...')
  console.log('试卷名称:', formData.value.title)
  console.log('学科ID:', formData.value.subjectId)
  console.log('分类ID:', formData.value.categoryId)
  console.log('考试时长:', formData.value.duration)
  
  if (!formData.value.title || formData.value.title.trim() === '') {
    console.error('验证失败: 试卷名称为空')
    showError('请输入试卷名称')
    return
  }

  if (!formData.value.subjectId || !formData.value.categoryId) {
    console.error('验证失败: 学科或分类未选择')
    showError('请选择所属学科和分类')
    return
  }

  if (!formData.value.duration || formData.value.duration <= 0) {
    console.error('验证失败: 考试时长无效')
    showError('请输入有效的考试时长')
    return
  }

  console.log('表单验证通过，开始提交...')
  isSubmitting.value = true

  try {
    console.log('开始提交表单，编辑模式:', isEdit.value)
    console.log('表单数据:', formData.value)

    // 计算总分（如果没有题目，至少为1以避免后端验证错误）
    const calculatedTotalScore = formData.value.questions.length > 0 
      ? formData.value.questions.reduce((sum, q) => sum + (q.score || 0), 0)
      : (formData.value.totalScore || 1)
    
    // 确保总分为正数（后端@Positive验证要求）
    const finalTotalScore = calculatedTotalScore > 0 ? calculatedTotalScore : 1
    
    const requestData = {
      title: formData.value.title.trim(),
      subjectId: Number(formData.value.subjectId), // 确保是数字类型
      categoryId: Number(formData.value.categoryId), // 确保是数字类型
      duration: Number(formData.value.duration), // 确保是数字类型
      totalScore: Number(finalTotalScore), // 使用计算的总分，确保是正数
      totalQuestions: Number(formData.value.questions.length) // 确保是数字类型
    }
    
    // 验证请求数据
    if (!requestData.title || requestData.title.trim() === '') {
      showError('试卷名称不能为空')
      isSubmitting.value = false
      return
    }
    
    if (!requestData.subjectId || requestData.subjectId <= 0) {
      showError('请选择有效的学科')
      isSubmitting.value = false
      return
    }
    
    if (!requestData.categoryId || requestData.categoryId <= 0) {
      showError('请选择有效的分类')
      isSubmitting.value = false
      return
    }
    
    if (!requestData.duration || requestData.duration <= 0) {
      showError('考试时长必须大于0')
      isSubmitting.value = false
      return
    }
    
    if (!requestData.totalScore || requestData.totalScore <= 0) {
      showError('总分必须大于0')
      isSubmitting.value = false
      return
    }

    console.log('请求数据:', requestData)
    console.log('数据类型检查:', {
      subjectId: typeof requestData.subjectId,
      categoryId: typeof requestData.categoryId,
      duration: typeof requestData.duration
    })

    if (isEdit.value) {
      console.log('=== 编辑模式：更新试卷 ===')
      console.log('试卷ID:', paperId.value)
      console.log('请求URL:', `/api/teacher/exam-papers/${Number(paperId.value)}`)
      console.log('请求方法: PUT')
      console.log('请求数据:', JSON.stringify(requestData, null, 2))
      
      // 先更新试卷基本信息
      try {
        console.log('调用 updateExamPaper API...')
        const result = await teacherExamPaperService.updateExamPaper(Number(paperId.value), requestData)
        console.log('试卷基本信息更新成功，返回结果:', result)
      } catch (error) {
        const errorMessage = logError(error, '更新试卷基本信息')
        throw new Error(errorMessage) // 如果基本信息更新失败，直接抛出错误
      }
      
      // 然后同步题目关联（如果有题目变化）
      try {
        if (formData.value.questions.length > 0) {
          console.log('开始同步题目关联')
          await syncPaperQuestions(Number(paperId.value))
          console.log('题目关联同步成功')
        } else {
          // 如果没有题目，清空所有题目
          console.log('清空所有题目')
          const currentPaper = await teacherExamPaperService.getExamPaper(Number(paperId.value))
          const currentQuestionIds = (currentPaper.questions || []).map((q: any) => q.questionId || q.id).filter((id: any) => id != null)
          for (const questionId of currentQuestionIds) {
            try {
              await teacherExamPaperService.removeQuestionFromExamPaper(Number(paperId.value), questionId)
            } catch (error) {
              console.warn('删除题目失败:', questionId, error)
              // 继续删除其他题目
            }
          }
        }
      } catch (error: any) {
        // 题目同步失败不影响基本信息更新，只显示警告
        const errorMessage = logError(error, '同步题目关联')
        showError(`试卷基本信息已更新，但题目同步失败: ${errorMessage}`)
        // 提前返回，不显示成功消息，也不跳转页面
        isSubmitting.value = false
        return
      }
      
      showSuccess('试卷更新成功')
    } else {
      console.log('创建新试卷')
      const newPaper = await teacherExamPaperService.createExamPaper(requestData as any)
      console.log('试卷创建成功，ID:', newPaper.id)
      
      // 创建试卷后添加题目
      if (formData.value.questions.length > 0) {
        console.log('开始添加题目到试卷')
        await addQuestionsToPaper(newPaper.id)
        console.log('题目添加成功')
      }
      
      showSuccess('试卷创建成功')
    }
    
    // 延迟跳转，让用户看到成功提示
    setTimeout(() => {
      router.push({ name: ROUTE_NAMES.TEACHER.EXAM_PAPERS })
    }, 1000)
  } catch (error: any) {
    // 使用统一的错误处理工具提取详细错误信息
    const errorMessage = logError(error, '提交表单')
    showError(errorMessage)
  } finally {
    console.log('=== 提交流程结束 ===')
    isSubmitting.value = false
  }
}

// 同步试卷题目关联
const syncPaperQuestions = async (paperId: number) => {
  try {
    console.log('同步题目关联，试卷ID:', paperId)
    // 获取当前试卷的题目列表
    const currentPaper = await teacherExamPaperService.getExamPaper(paperId)
    // 后端返回的题目数据结构：questions数组，每个元素有questionId字段
    const currentQuestionIds = (currentPaper.questions || []).map((q: any) => 
      q.questionId || q.id
    ).filter((id: any) => id != null)
    console.log('当前试卷题目ID:', currentQuestionIds)
    
    // 获取表单中的题目ID列表（确保类型一致）
    const formQuestionIds = formData.value.questions
      .map(q => Number(q.id || q.questionId))
      .filter((id: any) => !isNaN(id) && id != null)
    console.log('表单中题目ID:', formQuestionIds)
    
    // 将currentQuestionIds也转换为数字类型以便比较
    const currentQuestionIdsNum = currentQuestionIds.map(id => Number(id))
    
    // 找出需要删除的题目（在数据库中但不在表单中）
    const toDelete = currentQuestionIdsNum.filter(id => !formQuestionIds.includes(id))
    console.log('需要删除的题目:', toDelete)
    for (const questionId of toDelete) {
      try {
        await teacherExamPaperService.removeQuestionFromExamPaper(paperId, questionId)
        console.log('已删除题目:', questionId)
      } catch (error) {
        console.warn('删除题目失败:', questionId, error)
        // 继续处理其他题目
      }
    }
    
    // 找出需要添加的题目（在表单中但不在数据库中）
    const toAdd = formQuestionIds.filter(id => !currentQuestionIdsNum.includes(id))
    console.log('需要添加的题目:', toAdd)
    if (toAdd.length > 0) {
      try {
        await teacherExamPaperService.addQuestionsToExamPaper(paperId, toAdd)
        console.log('已添加题目')
      } catch (error) {
        const errorMessage = logError(error, '添加题目')
        throw new Error(`添加题目失败: ${errorMessage}`)
      }
    }
    
    // 更新题目顺序（后端期望的是题目ID数组，按顺序排列）
    if (formQuestionIds.length > 0) {
      try {
        console.log('更新题目顺序:', formQuestionIds)
        await teacherExamPaperService.updateQuestionOrder(paperId, formQuestionIds)
        console.log('题目顺序更新成功')
      } catch (error) {
        console.warn('更新题目顺序失败:', error)
        // 顺序更新失败不影响整体提交
      }
    }
    
    // 更新题目分值
    for (const question of formData.value.questions) {
      if (question.score && question.score > 0) {
        try {
          await teacherExamPaperService.updateQuestionScore(paperId, question.id, question.score)
          console.log('已更新题目分值:', question.id, question.score)
        } catch (error) {
          console.warn('更新题目分值失败:', question.id, error)
          // 继续处理其他题目
        }
      }
    }
    
    console.log('题目关联同步完成')
  } catch (error) {
    const errorMessage = logError(error, '同步题目关联')
    throw new Error(errorMessage)
  }
}

// 添加题目到试卷
const addQuestionsToPaper = async (paperId: number) => {
  try {
    const questionIds = formData.value.questions.map(q => q.id)
    
    if (questionIds.length > 0) {
      await teacherExamPaperService.addQuestionsToExamPaper(paperId, questionIds)
      
      // 更新题目顺序（按数组顺序）
      await teacherExamPaperService.updateQuestionOrder(paperId, questionIds)
      
      // 更新题目分值
      for (const question of formData.value.questions) {
        if (question.score) {
          await teacherExamPaperService.updateQuestionScore(paperId, question.id, question.score)
        }
      }
    }
  } catch (error) {
    const errorMessage = logError(error, '添加题目到试卷')
    throw new Error(errorMessage)
  }
}

// 加载数据
const loadData = async () => {
  try {
    loadingCategories.value = true
    // 先加载分类树
    categoryTree.value = await teacherCategoryService.getEnabledCategoryTree()
    console.log('分类树加载完成:', categoryTree.value)
    
    if (isEdit.value) {
      // 加载试卷详情（包含题目列表）
      const paper = await teacherExamPaperService.getExamPaper(Number(paperId.value))
      console.log('试卷详情加载完成:', paper)
      console.log('试卷数据:', {
        id: paper.id,
        title: paper.title,
        subjectId: paper.subjectId,
        categoryId: paper.categoryId,
        description: paper.description,
        duration: paper.duration,
        totalScore: paper.totalScore,
        difficulty: paper.difficulty,
        questions: paper.questions?.length || 0
      })
      
      // 设置表单数据
      formData.value.title = paper.title || ''
      formData.value.description = paper.description || ''
      
      // 确保subjectId和categoryId是数字类型，如果不是null
      // 并且验证值是否存在于分类树中
      if (paper.subjectId) {
        const subjectIdNum = Number(paper.subjectId)
        const subjectExists = categoryTree.value.some(s => s.id === subjectIdNum)
        if (subjectExists) {
          formData.value.subjectId = subjectIdNum
        } else {
          console.warn('学科ID不存在于分类树中:', subjectIdNum)
          formData.value.subjectId = null
        }
      } else {
        formData.value.subjectId = null
      }
      
      if (paper.categoryId) {
        const categoryIdNum = Number(paper.categoryId)
        // 检查分类是否存在于所选学科的子分类中
        if (formData.value.subjectId) {
          const availableCategories = getSubjectCategories(formData.value.subjectId)
          const categoryExists = availableCategories.some(c => c.id === categoryIdNum)
          if (categoryExists) {
            formData.value.categoryId = categoryIdNum
          } else {
            console.warn('分类ID不存在于所选学科的子分类中:', categoryIdNum)
            formData.value.categoryId = null
          }
        } else {
          formData.value.categoryId = categoryIdNum
        }
      } else {
        formData.value.categoryId = null
      }
      
      console.log('设置后的表单数据:', {
        subjectId: formData.value.subjectId,
        categoryId: formData.value.categoryId,
        subjectIdType: typeof formData.value.subjectId,
        categoryIdType: typeof formData.value.categoryId
      })
      
      // 设置时长和总分
      formData.value.duration = paper.duration ? Number(paper.duration) : Number(DEFAULT_CONFIG.EXAM_PAPER.DURATION)
      formData.value.totalScore = paper.totalScore ? Number(paper.totalScore) : 0
      
      // 设置难度（如果后端有返回，否则保持默认值）
      // 注意：后端可能没有difficulty字段，所以这里保持默认值
      if (paper.difficulty !== undefined && paper.difficulty !== null) {
        // 如果后端返回的是数字类型（1-3），转换为字符串类型
        const difficultyMap: Record<number, string> = {
          1: 'easy',
          2: 'medium',
          3: 'hard'
        }
        formData.value.difficulty = difficultyMap[Number(paper.difficulty)] || DEFAULT_CONFIG.EXAM_PAPER.DIFFICULTY
      }
      
      // 加载试卷题目列表
      if (paper.questions && paper.questions.length > 0) {
        formData.value.questions = paper.questions.map((q: any) => ({
          id: q.questionId,
          title: q.questionTitle,
          content: q.questionContent,
          type: mapQuestionType(q.questionType),
          score: q.score,
          options: q.options ? (typeof q.options === 'string' ? JSON.parse(q.options) : q.options) : [],
          order: q.sortOrder
        }))
        // 按顺序排序
        formData.value.questions.sort((a, b) => (a.order || 0) - (b.order || 0))
      }
      
      console.log('表单数据加载完成:', formData.value)
    }
  } catch (error) {
    const errorMessage = logError(error, '加载数据')
    showError(`加载数据失败: ${errorMessage}`)
    console.error('加载数据失败:', error)
  } finally {
    loadingCategories.value = false
  }
}

// 将后端题目类型映射到前端类型
const mapQuestionType = (type: string): string => {
  const typeMap: Record<string, string> = {
    'CHOICE': 'single',
    'FILL_BLANK': 'fill',
    'SHORT_ANSWER': 'essay',
    'PROOF': 'essay'
  }
  return typeMap[type] || type.toLowerCase()
}

onMounted(() => {
  loadData()
})
</script>
