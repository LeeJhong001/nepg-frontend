<template>
  <div>
    <!-- 页面标题 -->
    <div class="mb-6">
      <h1 class="text-2xl font-semibold text-gray-900">智能组卷</h1>
      <p class="mt-1 text-sm text-gray-600">根据条件自动生成试卷</p>
    </div>

    <!-- 组卷配置 -->
    <form @submit.prevent="generatePaper" class="space-y-8">
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
              <label class="block text-sm font-medium text-gray-700">总分 *</label>
              <input
                v-model.number="formData.totalScore"
                type="number"
                min="1"
                required
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
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
        </div>
      </div>

      <!-- 题目配置 -->
      <div class="bg-white shadow rounded-lg">
        <div class="px-6 py-4 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-medium text-gray-900">题目配置</h3>
            <button
              type="button"
              @click="addQuestionType"
              class="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <svg class="-ml-0.5 mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              添加题型
            </button>
          </div>
        </div>
        <div class="p-6">
          <div class="space-y-6">
            <div v-for="(config, index) in formData.questionConfigs" :key="index" class="border border-gray-200 rounded-lg p-4">
              <div class="flex items-center justify-between mb-4">
                <h4 class="text-base font-medium text-gray-900">{{ getTypeText(config.type) }}</h4>
                <button
                  v-if="formData.questionConfigs.length > 1"
                  type="button"
                  @click="removeQuestionType(index)"
                  class="text-red-600 hover:text-red-900"
                >
                  <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
              
              <div class="grid grid-cols-1 gap-4 sm:grid-cols-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700">题目类型</label>
                  <select
                    v-model="config.type"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  >
                    <option value="single">单选题</option>
                    <option value="multiple">多选题</option>
                    <option value="judge">判断题</option>
                    <option value="fill">填空题</option>
                    <option value="essay">问答题</option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700">题目数量</label>
                  <input
                    v-model.number="config.count"
                    type="number"
                    min="1"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700">每题分值</label>
                  <input
                    v-model.number="config.scorePerQuestion"
                    type="number"
                    min="1"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700">难度分布</label>
                  <select
                    v-model="config.difficulty"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  >
                    <option value="random">随机</option>
                    <option value="easy">简单</option>
                    <option value="medium">中等</option>
                    <option value="hard">困难</option>
                    <option value="mixed">混合</option>
                  </select>
                </div>
              </div>

              <!-- 分类筛选 - 从已选学科下的分类中选择 -->
              <div class="mt-4">
                <label class="block text-sm font-medium text-gray-700 mb-2">题目分类（从所属学科下选择）</label>
                <div v-if="!formData.subjectId" class="text-sm text-gray-500">请先选择所属学科</div>
                <div v-else-if="loadingCategories" class="text-sm text-gray-500">加载分类中...</div>
                <div v-else-if="getSubjectCategories(formData.subjectId).length === 0" class="text-sm text-gray-500">
                  该学科下暂无分类
                </div>
                <div v-else class="space-y-2 max-h-48 overflow-y-auto border border-gray-200 rounded-md p-3">
                  <label
                    v-for="category in getSubjectCategories(formData.subjectId)"
                    :key="category.id"
                    class="flex items-center space-x-2 hover:bg-gray-50 p-2 rounded cursor-pointer"
                  >
                    <input
                      v-model="config.categoryIds"
                      type="checkbox"
                      :value="category.id"
                      class="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    />
                    <span class="text-sm text-gray-700">{{ category.name }}</span>
                  </label>
                </div>
                <div v-if="config.categoryIds.length > 0" class="mt-2 text-xs text-gray-500">
                  已选择 {{ config.categoryIds.length }} 个分类
                </div>
              </div>

              <!-- 小计显示 -->
              <div class="mt-4 p-3 bg-gray-50 rounded-md">
                <div class="text-sm text-gray-600">
                  <span class="font-medium">小计：</span>
                  {{ config.count }} 题 × {{ config.scorePerQuestion }} 分 = {{ config.count * config.scorePerQuestion }} 分
                </div>
              </div>
            </div>
          </div>

          <!-- 总计显示 -->
          <div class="mt-6 p-4 bg-blue-50 rounded-lg">
            <div class="flex justify-between items-center">
              <div class="text-sm text-blue-700">
                <span class="font-medium">预计总题数：</span>{{ totalQuestions }} 题
              </div>
              <div class="text-sm text-blue-700">
                <span class="font-medium">预计总分：</span>{{ calculatedTotalScore }} 分
              </div>
            </div>
            <div v-if="calculatedTotalScore !== formData.totalScore" class="mt-2 text-sm text-red-600">
              <svg class="inline h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 15.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              预计总分与设定总分不符，请调整题目配置
            </div>
          </div>
        </div>
      </div>

      <!-- 高级选项 -->
      <div class="bg-white shadow rounded-lg">
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-medium text-gray-900">高级选项</h3>
        </div>
        <div class="p-6 space-y-6">
          <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label class="block text-sm font-medium text-gray-700">组卷策略</label>
              <select
                v-model="formData.strategy"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                <option value="random">完全随机</option>
                <option value="balanced">均衡分布</option>
                <option value="progressive">递进式</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">去重策略</label>
              <select
                v-model="formData.duplicateStrategy"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                <option value="strict">严格去重</option>
                <option value="loose">宽松去重</option>
                <option value="none">不去重</option>
              </select>
            </div>
          </div>
          
          <div class="flex items-center">
            <input
              v-model="formData.excludeUsedQuestions"
              type="checkbox"
              class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label class="ml-2 block text-sm text-gray-900">
              排除最近使用过的题目
            </label>
          </div>
        </div>
      </div>

      <!-- 操作按钮 -->
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
          @click="previewGenerate"
          class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          预览生成
        </button>
        <button
          type="submit"
          :disabled="!canGenerate"
          class="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          生成试卷
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { teacherCategoryService, type Category } from '../../../services/teacher/categoryService'
import { teacherExamPaperService } from '../../../services/teacher/examPaperService'
import { useNotification } from '../../../composables/useNotification'
import { extractErrorMessage } from '../../../utils/errorHandler'
import { DEFAULT_CONFIG } from '../../../constants'

const router = useRouter()
const { success: showSuccess, error: showError } = useNotification()

// 默认配置
const DEFAULT_TOTAL_SCORE = 100
const DEFAULT_QUESTION_COUNT = 10
const DEFAULT_SCORE_PER_QUESTION = 5

// 表单数据
const formData = ref({
  title: '',
  description: '',
  subjectId: null as number | null, // 所属学科ID
  categoryId: null as number | null, // 所属分类ID
  totalScore: DEFAULT_TOTAL_SCORE,
  strategy: 'balanced',
  duplicateStrategy: 'strict',
  excludeUsedQuestions: true,
  questionConfigs: [
    {
      type: 'single',
      count: DEFAULT_QUESTION_COUNT,
      scorePerQuestion: DEFAULT_SCORE_PER_QUESTION,
      difficulty: 'mixed',
      categoryIds: [] as number[] // 从已选学科下的分类中选择
    }
  ]
})

// 分类树（保持树形结构）
const categoryTree = ref<Category[]>([])
const loadingCategories = ref(false)

// 计算属性
const totalQuestions = computed(() => {
  return formData.value.questionConfigs.reduce((total, config) => total + config.count, 0)
})

const calculatedTotalScore = computed(() => {
  return formData.value.questionConfigs.reduce((total, config) => total + (config.count * config.scorePerQuestion), 0)
})

const canGenerate = computed(() => {
  const hasValidConfigs = formData.value.questionConfigs.every(config => 
    config.categoryIds.length > 0
  )
  
  return formData.value.title && 
         formData.value.subjectId &&
         formData.value.categoryId &&
         formData.value.totalScore > 0 && 
         formData.value.questionConfigs.length > 0 &&
         hasValidConfigs &&
         calculatedTotalScore.value === formData.value.totalScore
})

// 题目类型文本
const getTypeText = (type: string) => {
  switch (type) {
    case 'single':
      return '单选题'
    case 'multiple':
      return '多选题'
    case 'judge':
      return '判断题'
    case 'fill':
      return '填空题'
    case 'essay':
      return '问答题'
    default:
      return '未知'
  }
}

// 添加题型
const addQuestionType = () => {
  formData.value.questionConfigs.push({
    type: 'single',
    count: Math.floor(DEFAULT_QUESTION_COUNT / 2), // 新题型默认数量为总默认数量的一半
    scorePerQuestion: Math.floor(DEFAULT_SCORE_PER_QUESTION / 2), // 新题型默认分值
    difficulty: 'mixed',
    categoryIds: []
  })
}

// 获取指定学科下的所有分类（包括子分类）
const getSubjectCategories = (subjectId: number): Category[] => {
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
const onSubjectChange = (config: any) => {
  config.categoryIds = []
}

// 移除题型
const removeQuestionType = (index: number) => {
  formData.value.questionConfigs.splice(index, 1)
}

// 题目类型映射（前端类型 -> 后端类型）
const mapQuestionType = (type: string): 'CHOICE' | 'FILL_BLANK' | 'SHORT_ANSWER' | 'PROOF' => {
  switch (type) {
    case 'single':
    case 'multiple':
    case 'judge':
      return 'CHOICE'
    case 'fill':
      return 'FILL_BLANK'
    case 'essay':
      return 'SHORT_ANSWER'
    default:
      return 'CHOICE'
  }
}

// 难度映射
const mapDifficulty = (difficulty: string): 'easy' | 'medium' | 'hard' | 'mixed' | 'random' => {
  switch (difficulty) {
    case 'easy':
      return 'easy'
    case 'medium':
      return 'medium'
    case 'hard':
      return 'hard'
    case 'mixed':
      return 'mixed'
    case 'random':
      return 'random'
    default:
      return 'mixed'
  }
}

// 预览生成
const previewGenerate = async () => {
  try {
    if (!canGenerate.value) {
      showError('请完善试卷配置')
      return
    }

    const requestData = {
      title: formData.value.title,
      description: formData.value.description,
      subjectId: formData.value.subjectId!,
      categoryId: formData.value.categoryId!,
      totalScore: formData.value.totalScore,
      questionConfigs: formData.value.questionConfigs.map(config => ({
        type: mapQuestionType(config.type),
        count: config.count,
        scorePerQuestion: config.scorePerQuestion,
        difficulty: mapDifficulty(config.difficulty),
        categoryIds: config.categoryIds
      })),
      strategy: formData.value.strategy as 'random' | 'balanced' | 'progressive',
      duplicateStrategy: formData.value.duplicateStrategy as 'strict' | 'loose' | 'none',
      excludeUsedQuestions: formData.value.excludeUsedQuestions
    }

    const preview = await teacherExamPaperService.previewGenerate(requestData)
    console.log('Preview result:', preview)
    // 显示预览结果提示
    showSuccess(`预览生成完成：预计 ${preview.totalQuestions} 题，总分 ${preview.totalScore} 分`)
  } catch (error) {
    console.error('Failed to preview generate:', error)
    const errorMessage = extractErrorMessage(error)
    showError(`预览生成失败: ${errorMessage}`)
  }
}

// 生成试卷
const generatePaper = async () => {
  try {
    if (!canGenerate.value) {
      showError('请完善试卷配置')
      return
    }

    const requestData = {
      title: formData.value.title,
      description: formData.value.description,
      subjectId: formData.value.subjectId!,
      categoryId: formData.value.categoryId!,
      totalScore: formData.value.totalScore,
      questionConfigs: formData.value.questionConfigs.map(config => ({
        type: mapQuestionType(config.type),
        count: config.count,
        scorePerQuestion: config.scorePerQuestion,
        difficulty: mapDifficulty(config.difficulty),
        categoryIds: config.categoryIds
      })),
      strategy: formData.value.strategy as 'random' | 'balanced' | 'progressive',
      duplicateStrategy: formData.value.duplicateStrategy as 'strict' | 'loose' | 'none',
      excludeUsedQuestions: formData.value.excludeUsedQuestions
    }

    await teacherExamPaperService.generateExamPaper(requestData)
    showSuccess('试卷生成成功')
    
    // 生成成功后跳转到试卷列表
    router.push('/teacher/exam-papers')
  } catch (error) {
    console.error('Failed to generate paper:', error)
    const errorMessage = extractErrorMessage(error)
    // 对于组卷失败，使用更友好的错误提示
    if (errorMessage.includes('无法找到足够的题目') || errorMessage.includes('未能生成任何题目')) {
      showError('组卷失败', errorMessage)
    } else {
      showError('生成试卷失败', errorMessage)
    }
  }
}

// 加载数据
const loadData = async () => {
  try {
    loadingCategories.value = true
    // 获取启用的分类树（保持树形结构）
    categoryTree.value = await teacherCategoryService.getEnabledCategoryTree()
    console.log('Category tree loaded:', categoryTree.value)
  } catch (error) {
    console.error('Failed to load categories:', error)
    showError('加载分类列表失败')
  } finally {
    loadingCategories.value = false
  }
}

onMounted(() => {
  loadData()
})
</script>
