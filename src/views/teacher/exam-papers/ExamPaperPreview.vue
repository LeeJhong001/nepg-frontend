<template>
  <div>
    <!-- 页面标题和操作 -->
    <div class="sm:flex sm:items-center sm:justify-between mb-6">
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
          <div>
            <dt class="text-sm font-medium text-gray-500">科目分类</dt>
            <dd class="mt-1 text-sm text-gray-900">{{ paper.category }}</dd>
          </div>
          <div>
            <dt class="text-sm font-medium text-gray-500">难度等级</dt>
            <dd class="mt-1">
              <span :class="getDifficultyClass(paper.difficulty)" class="inline-flex px-2 py-1 text-xs font-semibold rounded-full">
                {{ getDifficultyText(paper.difficulty) }}
              </span>
            </dd>
          </div>
          <div>
            <dt class="text-sm font-medium text-gray-500">题目数量</dt>
            <dd class="mt-1 text-sm text-gray-900">{{ paper.questionCount }} 题</dd>
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
            总分：{{ paper.totalScore }} 分　　时间：{{ paper.duration }} 分钟　　题数：{{ paper.questionCount }} 题
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
        <div class="space-y-6">
          <div v-for="(question, index) in paper.questions" :key="question.id" class="border-b border-gray-200 pb-6 last:border-b-0">
            <div class="flex items-start space-x-3">
              <span class="text-sm font-medium text-gray-900 mt-1">{{ index + 1 }}.</span>
              <div class="flex-1">
                <!-- 题目标题 -->
                <div class="flex items-center space-x-2 mb-3">
                  <span :class="getTypeClass(question.type)" class="inline-flex px-2 py-1 text-xs font-semibold rounded-full">
                    {{ getTypeText(question.type) }}
                  </span>
                  <span class="text-sm text-gray-500">({{ question.score }} 分)</span>
                </div>

                <!-- 题目内容 -->
                <div class="text-sm text-gray-900 mb-4" v-html="formatQuestionContent(question.content)"></div>

                <!-- 选择题选项 -->
                <div v-if="question.type === 'single' || question.type === 'multiple'" class="space-y-2">
                  <div v-for="(option, optionIndex) in question.options" :key="optionIndex" class="flex items-center space-x-2">
                    <span class="text-sm text-gray-700">{{ getOptionLabel(optionIndex) }}.</span>
                    <span class="text-sm text-gray-900">{{ option }}</span>
                  </div>
                </div>

                <!-- 判断题 -->
                <div v-if="question.type === 'judge'" class="flex items-center space-x-6">
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
                <div v-if="question.type === 'fill'" class="space-y-3">
                  <div v-for="(blank, blankIndex) in question.blanks || [1]" :key="blankIndex" class="flex items-center space-x-2">
                    <span class="text-sm text-gray-700">{{ blankIndex + 1 }}.</span>
                    <div class="border-b border-gray-400 flex-1 h-6"></div>
                  </div>
                </div>

                <!-- 问答题 -->
                <div v-if="question.type === 'essay'" class="space-y-2">
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

const route = useRoute()
const paperId = route.params.id as string

// 试卷数据
const paper = ref({
  id: 1,
  title: '数学期中试卷',
  description: '涵盖前半学期所有知识点',
  category: '数学',
  difficulty: 'medium',
  questionCount: 20,
  totalScore: 100,
  duration: 120,
  questions: [
    {
      id: 1,
      type: 'single',
      content: '下列哪个选项是正确的数学公式？',
      score: 5,
      options: ['2+2=5', '3×3=9', '4÷2=3', '5-1=3']
    },
    {
      id: 2,
      type: 'multiple',
      content: '请选择所有正确的几何图形性质：',
      score: 8,
      options: ['正方形四边相等', '圆的周长等于直径乘以π', '三角形内角和为180度', '平行四边形对角相等']
    },
    {
      id: 3,
      type: 'judge',
      content: '任何数乘以0都等于0。',
      score: 3
    },
    {
      id: 4,
      type: 'fill',
      content: '一个圆的半径为r，则它的面积为______，周长为______。',
      score: 6,
      blanks: [1, 2]
    },
    {
      id: 5,
      type: 'essay',
      content: '请详细说明勾股定理的证明过程，并举一个实际应用的例子。',
      score: 15
    }
  ]
})

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

// 难度样式和文本
const getDifficultyClass = (difficulty: string) => {
  switch (difficulty) {
    case 'easy':
      return 'bg-green-100 text-green-800'
    case 'medium':
      return 'bg-yellow-100 text-yellow-800'
    case 'hard':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const getDifficultyText = (difficulty: string) => {
  switch (difficulty) {
    case 'easy':
      return '简单'
    case 'medium':
      return '中等'
    case 'hard':
      return '困难'
    default:
      return '未知'
  }
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
    // TODO: 调用API获取试卷详情
    console.log('Load paper:', paperId)
  } catch (error) {
    console.error('Failed to load paper:', error)
  }
}

onMounted(() => {
  loadPaper()
})
</script>
