<template>
  <div>
    <!-- 页面标题 -->
    <div class="mb-6">
      <nav class="flex" aria-label="Breadcrumb">
        <ol class="flex items-center space-x-4">
          <li>
            <router-link to="/teacher/exams" class="text-gray-400 hover:text-gray-500">
              考试管理
            </router-link>
          </li>
          <li>
            <div class="flex items-center">
              <svg class="flex-shrink-0 h-5 w-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
              </svg>
              <router-link :to="`/teacher/exams/${examId}`" class="ml-4 text-gray-400 hover:text-gray-500">
                {{ exam.title }}
              </router-link>
            </div>
          </li>
          <li>
            <div class="flex items-center">
              <svg class="flex-shrink-0 h-5 w-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
              </svg>
              <span class="ml-4 text-gray-500">统计分析</span>
            </div>
          </li>
        </ol>
      </nav>
      <h1 class="mt-2 text-2xl font-semibold text-gray-900">考试统计分析</h1>
    </div>

    <!-- 统计概览 -->
    <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <svg class="h-6 w-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">参考人数</dt>
                <dd class="text-lg font-medium text-gray-900">{{ statistics.participantCount }}</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <svg class="h-6 w-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">平均分</dt>
                <dd class="text-lg font-medium text-gray-900">{{ statistics.averageScore.toFixed(1) }}</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <svg class="h-6 w-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">及格率</dt>
                <dd class="text-lg font-medium text-gray-900">{{ statistics.passRate.toFixed(1) }}%</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <svg class="h-6 w-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">平均用时</dt>
                <dd class="text-lg font-medium text-gray-900">{{ statistics.averageDuration }} 分钟</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 图表分析 -->
    <div class="grid grid-cols-1 gap-8 lg:grid-cols-2 mb-8">
      <!-- 分数分布 -->
      <div class="bg-white shadow rounded-lg">
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-medium text-gray-900">分数分布</h3>
        </div>
        <div class="p-6">
          <div ref="scoreChartRef" class="h-64"></div>
        </div>
      </div>

      <!-- 题目分析 -->
      <div class="bg-white shadow rounded-lg">
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-medium text-gray-900">题目正确率</h3>
        </div>
        <div class="p-6">
          <div ref="questionChartRef" class="h-64"></div>
        </div>
      </div>
    </div>

    <!-- 详细数据表格 -->
    <div class="bg-white shadow rounded-lg mb-8">
      <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <h3 class="text-lg font-medium text-gray-900">学生成绩详情</h3>
        <button
          @click="exportResults"
          class="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <svg class="-ml-0.5 mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          导出成绩
        </button>
      </div>
      <div class="overflow-hidden">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">排名</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">学生</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">分数</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">用时</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">正确率</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">提交时间</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="(result, index) in sortedResults" :key="result.id">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {{ index + 1 }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div>
                    <div class="text-sm font-medium text-gray-900">{{ result.studentName }}</div>
                    <div class="text-sm text-gray-500">{{ result.studentId }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ result.score }}/{{ exam.totalScore }}</div>
                <div class="text-sm text-gray-500">{{ ((result.score / exam.totalScore) * 100).toFixed(1) }}%</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ result.duration }} 分钟
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ result.correctCount }}/{{ result.totalQuestions }}</div>
                <div class="text-sm text-gray-500">{{ ((result.correctCount / result.totalQuestions) * 100).toFixed(1) }}%</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ formatDateTime(result.submittedAt) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button
                  @click="viewAnswerSheet(result.id)"
                  class="text-blue-600 hover:text-blue-900"
                >
                  查看答卷
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 题目分析详情 -->
    <div class="bg-white shadow rounded-lg">
      <div class="px-6 py-4 border-b border-gray-200">
        <h3 class="text-lg font-medium text-gray-900">题目分析</h3>
      </div>
      <div class="overflow-hidden">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">题号</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">题目类型</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">分值</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">正确率</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">平均得分</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">难度系数</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="question in questionAnalysis" :key="question.id">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {{ question.number }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ getQuestionTypeText(question.type) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ question.score }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="text-sm text-gray-900">{{ question.correctRate.toFixed(1) }}%</div>
                  <div class="ml-2 w-16 bg-gray-200 rounded-full h-2">
                    <div
                      class="bg-blue-600 h-2 rounded-full"
                      :style="{ width: `${question.correctRate}%` }"
                    ></div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ question.averageScore.toFixed(1) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="getDifficultyClass(question.difficulty)" class="inline-flex px-2 py-1 text-xs font-semibold rounded-full">
                  {{ getDifficultyText(question.difficulty) }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import * as echarts from 'echarts'

const route = useRoute()
const examId = route.params.id as string

// 图表引用
const scoreChartRef = ref<HTMLElement>()
const questionChartRef = ref<HTMLElement>()

// 考试信息
const exam = ref({
  id: 1,
  title: '期中考试',
  totalScore: 100,
  passScore: 60
})

// 统计数据
const statistics = ref({
  participantCount: 25,
  averageScore: 78.5,
  passRate: 72.0,
  averageDuration: 95
})

// 学生成绩
const results = ref([
  {
    id: 1,
    studentId: '2024001',
    studentName: '张三',
    score: 95,
    duration: 85,
    correctCount: 18,
    totalQuestions: 20,
    submittedAt: '2024-01-15T10:25:00'
  },
  {
    id: 2,
    studentId: '2024002',
    studentName: '李四',
    score: 82,
    duration: 105,
    correctCount: 16,
    totalQuestions: 20,
    submittedAt: '2024-01-15T10:45:00'
  },
  {
    id: 3,
    studentId: '2024003',
    studentName: '王五',
    score: 68,
    duration: 110,
    correctCount: 13,
    totalQuestions: 20,
    submittedAt: '2024-01-15T10:50:00'
  }
])

// 题目分析
const questionAnalysis = ref([
  {
    id: 1,
    number: 1,
    type: 'single',
    score: 5,
    correctRate: 92.0,
    averageScore: 4.6,
    difficulty: 'easy'
  },
  {
    id: 2,
    number: 2,
    type: 'multiple',
    score: 8,
    correctRate: 68.0,
    averageScore: 5.4,
    difficulty: 'medium'
  },
  {
    id: 3,
    number: 3,
    type: 'essay',
    score: 15,
    correctRate: 45.0,
    averageScore: 8.2,
    difficulty: 'hard'
  }
])

// 按分数排序的成绩
const sortedResults = computed(() => {
  return [...results.value].sort((a, b) => b.score - a.score)
})

// 初始化分数分布图表
const initScoreChart = () => {
  if (!scoreChartRef.value) return
  
  const chart = echarts.init(scoreChartRef.value)
  
  // 计算分数分布
  const scoreRanges = ['0-59', '60-69', '70-79', '80-89', '90-100']
  const distribution = [0, 0, 0, 0, 0]
  
  results.value.forEach(result => {
    const score = result.score
    if (score < 60) distribution[0]++
    else if (score < 70) distribution[1]++
    else if (score < 80) distribution[2]++
    else if (score < 90) distribution[3]++
    else distribution[4]++
  })
  
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    xAxis: {
      type: 'category',
      data: scoreRanges
    },
    yAxis: {
      type: 'value'
    },
    series: [{
      name: '人数',
      type: 'bar',
      data: distribution,
      itemStyle: {
        color: '#3B82F6'
      }
    }]
  }
  
  chart.setOption(option)
}

// 初始化题目正确率图表
const initQuestionChart = () => {
  if (!questionChartRef.value) return
  
  const chart = echarts.init(questionChartRef.value)
  
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    xAxis: {
      type: 'category',
      data: questionAnalysis.value.map(q => `第${q.number}题`)
    },
    yAxis: {
      type: 'value',
      max: 100,
      axisLabel: {
        formatter: '{value}%'
      }
    },
    series: [{
      name: '正确率',
      type: 'bar',
      data: questionAnalysis.value.map(q => q.correctRate),
      itemStyle: {
        color: '#10B981'
      }
    }]
  }
  
  chart.setOption(option)
}

// 题目类型文本
const getQuestionTypeText = (type: string) => {
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

// 格式化日期时间
const formatDateTime = (dateString: string) => {
  return new Date(dateString).toLocaleString('zh-CN')
}

// 查看答卷
const viewAnswerSheet = (resultId: number) => {
  // TODO: 实现查看答卷功能
  console.log('View answer sheet:', resultId)
}

// 导出成绩
const exportResults = () => {
  // TODO: 实现导出成绩功能
  console.log('Export results')
}

// 加载数据
const loadStatistics = async () => {
  try {
    // TODO: 调用API获取统计数据
    console.log('Load statistics:', examId)
  } catch (error) {
    console.error('Failed to load statistics:', error)
  }
}

onMounted(async () => {
  await loadStatistics()
  await nextTick()
  initScoreChart()
  initQuestionChart()
})
</script>
