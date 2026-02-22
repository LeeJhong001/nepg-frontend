<template>
  <div>
    <!-- 加载状态 -->
    <div v-if="loading" class="text-center py-12">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      <p class="mt-2 text-sm text-gray-500">加载中...</p>
    </div>
    
    <!-- 页面标题和操作 -->
    <div v-else class="sm:flex sm:items-center sm:justify-between mb-6">
      <div>
        <nav class="flex" aria-label="Breadcrumb">
          <ol class="flex items-center space-x-4">
            <li>
              <router-link to="/teacher/exam-papers" class="text-gray-400 hover:text-gray-500">
                试卷管理
              </router-link>
            </li>
            <li>
              <div class="flex items-center">
                <svg class="flex-shrink-0 h-5 w-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                </svg>
                <span class="ml-4 text-gray-500">试卷预览</span>
              </div>
            </li>
          </ol>
        </nav>
        <h1 class="mt-2 text-2xl font-semibold text-gray-900">{{ paper.title }}</h1>
        <p class="mt-1 text-sm text-gray-600">试卷预览</p>
      </div>
      <div class="mt-4 sm:mt-0 sm:ml-16 sm:flex-none flex space-x-3">
        <button
          @click="printPaper"
          class="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
        >
          <svg class="-ml-1 mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          打印试卷
        </button>
        <button
          @click="$router.push(`/teacher/exam-papers/${paper.id}/edit`)"
          class="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
        >
          编辑试卷
        </button>
      </div>
    </div>

    <!-- 试卷信息 -->
    <div class="bg-white shadow rounded-lg mb-8">
      <div class="px-6 py-4 border-b border-gray-200">
        <h3 class="text-lg font-medium text-gray-900">试卷信息</h3>
      </div>
      <div class="p-6">
        <dl class="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-3">
          <div>
            <dt class="text-sm font-medium text-gray-500">试卷名称</dt>
            <dd class="mt-1 text-sm text-gray-900">{{ paper.title }}</dd>
          </div>
          <div v-if="paper.categoryName">
            <dt class="text-sm font-medium text-gray-500">科目分类</dt>
            <dd class="mt-1 text-sm text-gray-900">{{ paper.categoryName }}</dd>
          </div>
          <div v-if="paper.subjectName">
            <dt class="text-sm font-medium text-gray-500">所属学科</dt>
            <dd class="mt-1 text-sm text-gray-900">{{ paper.subjectName }}</dd>
          </div>
          <div>
            <dt class="text-sm font-medium text-gray-500">题目数量</dt>
            <dd class="mt-1 text-sm text-gray-900">{{ paper.questions?.length || 0 }} 题</dd>
          </div>
          <div>
            <dt class="text-sm font-medium text-gray-500">总分</dt>
            <dd class="mt-1 text-sm text-gray-900">{{ paper.totalScore }} 分</dd>
          </div>
          <div>
            <dt class="text-sm font-medium text-gray-500">建议时长</dt>
            <dd class="mt-1 text-sm text-gray-900">{{ paper.duration }} 分钟</dd>
          </div>
          <div class="sm:col-span-3">
            <dt class="text-sm font-medium text-gray-500">试卷描述</dt>
            <dd class="mt-1 text-sm text-gray-900">{{ paper.description || '暂无描述' }}</dd>
          </div>
        </dl>
      </div>
    </div>

    <!-- 试卷内容 -->
    <div class="bg-white shadow rounded-lg" id="paper-content">
      <div class="px-6 py-4 border-b border-gray-200">
        <div class="text-center">
          <h2 class="text-xl font-bold text-gray-900">{{ paper.title }}</h2>
          <p class="mt-2 text-sm text-gray-600">
            总分：{{ paper.totalScore || 0 }} 分　　时间：{{ paper.duration || 0 }} 分钟　　题数：{{ paper.questions?.length || 0 }} 题
          </p>
        </div>
      </div>
      
      <div class="p-6 space-y-8">
        <!-- 考生信息栏 -->
        <div class="border-2 border-dashed border-gray-300 rounded-lg p-4">
          <div class="grid grid-cols-3 gap-4 text-sm">
            <div class="flex items-center">
              <span class="text-gray-500 mr-2">姓名：</span>
              <div class="border-b border-gray-400 flex-1 h-6"></div>
            </div>
            <div class="flex items-center">
              <span class="text-gray-500 mr-2">学号：</span>
              <div class="border-b border-gray-400 flex-1 h-6"></div>
            </div>
            <div class="flex items-center">
              <span class="text-gray-500 mr-2">班级：</span>
              <div class="border-b border-gray-400 flex-1 h-6"></div>
            </div>
          </div>
        </div>

        <!-- 题目列表 -->
        <div v-if="!paper.questions || paper.questions.length === 0" class="text-center py-12">
          <p class="text-gray-500">暂无题目</p>
        </div>
        <div v-else class="space-y-6">
          <div v-for="(question, index) in paper.questions" :key="question.questionId || question.id" class="border-b border-gray-200 pb-6 last:border-b-0">
            <div class="flex items-start space-x-3">
              <span class="text-sm font-medium text-gray-900 mt-1">{{ index + 1 }}.</span>
              <div class="flex-1">
                <!-- 题目标题 -->
                <div class="flex items-center space-x-2 mb-3">
                  <span :class="getTypeClass(question.questionType || question.type)" class="inline-flex px-2 py-1 text-xs font-semibold rounded-full">
                    {{ getTypeText(question.questionType || question.type) }}
                  </span>
                  <span class="text-sm text-gray-500">({{ question.score || 0 }} 分)</span>
                </div>

                <!-- 题目内容 -->
                <div class="text-sm text-gray-900 mb-4" v-html="formatQuestionContent(getQuestionContent(question))"></div>

                <!-- 选择题选项 -->
                <div v-if="isChoiceQuestion(question.questionType || question.type)" class="space-y-2">
                  <div v-for="(option, optionIndex) in getQuestionOptions(question)" :key="optionIndex" class="flex items-center space-x-2">
                    <span class="text-sm text-gray-700">{{ getOptionLabel(optionIndex) }}.</span>
                    <span class="text-sm text-gray-900">{{ option }}</span>
                  </div>
                </div>

                <!-- 判断题 -->
                <div v-if="isJudgeQuestion(question.questionType || question.type)" class="flex items-center space-x-6">
                  <div class="flex items-center space-x-2">
                    <span class="w-4 h-4 border border-gray-400 rounded"></span>
                    <span class="text-sm text-gray-900">正确</span>
                  </div>
                  <div class="flex items-center space-x-2">
                    <span class="w-4 h-4 border border-gray-400 rounded"></span>
                    <span class="text-sm text-gray-900">错误</span>
                  </div>
                </div>

                <!-- 填空题 -->
                <div v-if="isFillQuestion(question.questionType || question.type)" class="space-y-3">
                  <div v-for="(blank, blankIndex) in getBlanksFromContent(getQuestionContent(question))" :key="blankIndex" class="flex items-center space-x-2">
                    <span class="text-sm text-gray-700">{{ blankIndex + 1 }}.</span>
                    <div class="border-b border-gray-400 flex-1 h-6"></div>
                  </div>
                </div>

                <!-- 问答题 -->
                <div v-if="isEssayQuestion(question.questionType || question.type)" class="space-y-2">
                  <div v-for="line in 8" :key="line" class="border-b border-gray-300 h-6"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { teacherExamPaperService, type ExamPaperDetail } from '../../../services/teacher/examPaperService'
import { useNotification } from '../../../composables/useNotification'

const route = useRoute()
const { error: showError } = useNotification()
const paperId = route.params.id as string

// 加载状态
const loading = ref(false)

// 试卷数据
const paper = ref<Partial<ExamPaperDetail & {
  questions?: any[] // 使用any[]以匹配后端返回的实际结构
}>>({
  id: 0,
  title: '',
  description: '',
  totalScore: 0,
  duration: 0,
  questions: []
})

// 题目类型样式和文本
const getTypeClass = (type: string) => {
  const upperType = type.toUpperCase()
  switch (upperType) {
    case 'CHOICE':
    case 'SINGLE':
      return 'bg-blue-100 text-blue-800'
    case 'MULTIPLE':
      return 'bg-green-100 text-green-800'
    case 'JUDGE':
      return 'bg-yellow-100 text-yellow-800'
    case 'FILL_BLANK':
    case 'FILL':
      return 'bg-purple-100 text-purple-800'
    case 'SHORT_ANSWER':
    case 'PROOF':
    case 'ESSAY':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const getTypeText = (type: string) => {
  const upperType = type.toUpperCase()
  switch (upperType) {
    case 'CHOICE':
    case 'SINGLE':
      return '单选题'
    case 'MULTIPLE':
      return '多选题'
    case 'JUDGE':
      return '判断题'
    case 'FILL_BLANK':
    case 'FILL':
      return '填空题'
    case 'SHORT_ANSWER':
    case 'PROOF':
    case 'ESSAY':
      return '问答题'
    default:
      return '未知'
  }
}

// 判断题目类型
const isChoiceQuestion = (type: string) => {
  const upperType = type.toUpperCase()
  return upperType === 'CHOICE' || upperType === 'SINGLE' || upperType === 'MULTIPLE'
}

const isJudgeQuestion = (type: string) => {
  const upperType = type.toUpperCase()
  return upperType === 'JUDGE'
}

const isFillQuestion = (type: string) => {
  const upperType = type.toUpperCase()
  return upperType === 'FILL_BLANK' || upperType === 'FILL'
}

const isEssayQuestion = (type: string) => {
  const upperType = type.toUpperCase()
  return upperType === 'SHORT_ANSWER' || upperType === 'PROOF' || upperType === 'ESSAY'
}

// 获取题目内容
const getQuestionContent = (question: any) => {
  return question.questionContent || question.content || question.questionTitle || ''
}

// 获取题目选项
const getQuestionOptions = (question: any) => {
  if (!question.options) return []
  if (typeof question.options === 'string') {
    try {
      return JSON.parse(question.options)
    } catch {
      return []
    }
  }
  return Array.isArray(question.options) ? question.options : []
}

// 从内容中提取填空题的空格数量
const getBlanksFromContent = (content: string) => {
  const blankMatches = content.match(/______/g)
  return blankMatches ? blankMatches.map((_, i) => i + 1) : [1]
}


// 获取选项标签
const getOptionLabel = (index: number) => {
  return String.fromCharCode(65 + index) // A, B, C, D...
}

// 格式化题目内容
const formatQuestionContent = (content: string) => {
  // 处理填空题的下划线
  return content.replace(/______/g, '<span class="inline-block border-b border-gray-400 w-16 h-5"></span>')
}

// 打印试卷
const printPaper = () => {
  const printContent = document.getElementById('paper-content')
  if (printContent) {
    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>${paper.value.title}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              .question { margin-bottom: 20px; page-break-inside: avoid; }
              .option { margin: 5px 0; }
              .blank-line { border-bottom: 1px solid #000; display: inline-block; width: 100px; height: 20px; margin: 0 5px; }
              .answer-lines { border-bottom: 1px solid #ccc; height: 20px; margin: 5px 0; }
              @media print {
                body { margin: 0; }
                .no-print { display: none; }
              }
            </style>
          </head>
          <body>
            ${printContent.innerHTML}
          </body>
        </html>
      `)
      printWindow.document.close()
      printWindow.print()
    }
  }
}

// 加载试卷数据
const loadPaper = async () => {
  try {
    loading.value = true
    
    // 加载试卷详情（包含题目列表）
    const paperData = await teacherExamPaperService.getExamPaper(Number(paperId))
    
    // 转换题目格式
    const mappedQuestions = (paperData.questions || []).map((q: any) => ({
      questionId: q.questionId,
      id: q.questionId, // 兼容字段
      questionType: q.questionType,
      type: q.questionType, // 兼容字段
      questionContent: q.questionContent || q.questionTitle,
      content: q.questionContent || q.questionTitle, // 兼容字段
      questionTitle: q.questionTitle,
      score: q.score || 0,
      sortOrder: q.sortOrder,
      options: q.options ? (typeof q.options === 'string' ? JSON.parse(q.options) : q.options) : [],
      difficulty: q.difficulty
    })).sort((a: any, b: any) => (a.sortOrder || 0) - (b.sortOrder || 0))
    
    // 映射数据
    paper.value = {
      id: paperData.id,
      title: paperData.title,
      description: paperData.description || '',
      totalScore: paperData.totalScore || 0,
      duration: paperData.duration || 0,
      subjectId: paperData.subjectId,
      categoryId: paperData.categoryId,
      subjectName: paperData.subjectName,
      categoryName: paperData.categoryName,
      questions: mappedQuestions as any
    }
    
    console.log('试卷预览数据加载成功:', paper.value)
  } catch (error) {
    console.error('加载试卷预览失败:', error)
    showError('加载试卷预览失败')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadPaper()
})
</script>
