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

              <!-- 分类筛选 -->
              <div class="mt-4">
                <label class="block text-sm font-medium text-gray-700 mb-2">题目分类</label>
                <div class="flex flex-wrap gap-2">
                  <label v-for="category in categories" :key="category.id" class="inline-flex items-center">
                    <input
                      v-model="config.categoryIds"
                      type="checkbox"
                      :value="category.id"
                      class="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    />
                    <span class="ml-2 text-sm text-gray-700">{{ category.name }}</span>
                  </label>
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

const router = useRouter()

// 表单数据
const formData = ref({
  title: '',
  description: '',
  totalScore: 100,
  strategy: 'balanced',
  duplicateStrategy: 'strict',
  excludeUsedQuestions: true,
  questionConfigs: [
    {
      type: 'single',
      count: 10,
      scorePerQuestion: 5,
      difficulty: 'mixed',
      categoryIds: [] as number[]
    }
  ]
})

// 分类列表
const categories = ref([
  { id: 1, name: '数学' },
  { id: 2, name: '语文' },
  { id: 3, name: '英语' },
  { id: 4, name: '物理' },
  { id: 5, name: '化学' }
])

// 计算属性
const totalQuestions = computed(() => {
  return formData.value.questionConfigs.reduce((total, config) => total + config.count, 0)
})

const calculatedTotalScore = computed(() => {
  return formData.value.questionConfigs.reduce((total, config) => total + (config.count * config.scorePerQuestion), 0)
})

const canGenerate = computed(() => {
  return formData.value.title && 
         formData.value.totalScore > 0 && 
         formData.value.questionConfigs.length > 0 &&
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
    count: 5,
    scorePerQuestion: 2,
    difficulty: 'mixed',
    categoryIds: []
  })
}

// 移除题型
const removeQuestionType = (index: number) => {
  formData.value.questionConfigs.splice(index, 1)
}

// 预览生成
const previewGenerate = async () => {
  try {
    // TODO: 调用预览API
    console.log('Preview generate:', formData.value)
  } catch (error) {
    console.error('Failed to preview generate:', error)
  }
}

// 生成试卷
const generatePaper = async () => {
  try {
    // TODO: 调用生成API
    console.log('Generate paper:', formData.value)
    
    // 生成成功后跳转到试卷列表
    router.push('/teacher/exam-papers')
  } catch (error) {
    console.error('Failed to generate paper:', error)
  }
}

// 加载数据
const loadData = async () => {
  try {
    // TODO: 加载分类列表
    console.log('Load categories')
  } catch (error) {
    console.error('Failed to load data:', error)
  }
}

onMounted(() => {
  loadData()
})
</script>
