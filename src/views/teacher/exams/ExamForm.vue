<template>
  <div>
    <!-- 页面标题 -->
    <div class="mb-6">
      <h1 class="text-2xl font-semibold text-gray-900">
        {{ isEdit ? '编辑考试' : '创建考试' }}
      </h1>
      <p class="mt-1 text-sm text-gray-600">
        {{ isEdit ? '修改考试信息' : '创建新的考试' }}
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
              <label class="block text-sm font-medium text-gray-700">考试名称 *</label>
              <input
                v-model="formData.title"
                type="text"
                required
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="请输入考试名称"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">考试类型</label>
              <select
                v-model="formData.type"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                <option value="exam">正式考试</option>
                <option value="quiz">随堂测验</option>
                <option value="homework">课后作业</option>
                <option value="practice">练习测试</option>
              </select>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">考试描述</label>
            <textarea
              v-model="formData.description"
              rows="3"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder="请输入考试描述"
            ></textarea>
          </div>

          <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label class="block text-sm font-medium text-gray-700">试卷 *</label>
              <select
                v-model="formData.paperId"
                required
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                <option value="">请选择试卷</option>
                <option v-for="paper in papers" :key="paper.id" :value="paper.id">
                  {{ paper.title }} ({{ paper.questionCount }}题)
                </option>
              </select>
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

      <!-- 时间设置 -->
      <div class="bg-white shadow rounded-lg">
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-medium text-gray-900">时间设置</h3>
        </div>
        <div class="p-6 space-y-6">
          <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label class="block text-sm font-medium text-gray-700">开始时间 *</label>
              <input
                v-model="formData.startTime"
                type="datetime-local"
                required
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">结束时间 *</label>
              <input
                v-model="formData.endTime"
                type="datetime-local"
                required
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
          </div>

          <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label class="block text-sm font-medium text-gray-700">考试时长（分钟）</label>
              <input
                v-model.number="formData.duration"
                type="number"
                min="1"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="自动计算"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">提前交卷时间（分钟）</label>
              <input
                v-model.number="formData.earlySubmitTime"
                type="number"
                min="0"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="允许提前交卷的时间"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- 考试设置 -->
      <div class="bg-white shadow rounded-lg">
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-medium text-gray-900">考试设置</h3>
        </div>
        <div class="p-6 space-y-6">
          <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label class="block text-sm font-medium text-gray-700">及格分数</label>
              <input
                v-model.number="formData.passScore"
                type="number"
                min="0"
                :max="formData.totalScore"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">最大参考次数</label>
              <input
                v-model.number="formData.maxAttempts"
                type="number"
                min="1"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="0表示不限制"
              />
            </div>
          </div>

          <div class="space-y-4">
            <div class="flex items-center">
              <input
                v-model="formData.shuffleQuestions"
                type="checkbox"
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label class="ml-2 block text-sm text-gray-900">随机打乱题目顺序</label>
            </div>

            <div class="flex items-center">
              <input
                v-model="formData.shuffleOptions"
                type="checkbox"
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label class="ml-2 block text-sm text-gray-900">随机打乱选项顺序</label>
            </div>

            <div class="flex items-center">
              <input
                v-model="formData.showScore"
                type="checkbox"
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label class="ml-2 block text-sm text-gray-900">考试结束后显示分数</label>
            </div>

            <div class="flex items-center">
              <input
                v-model="formData.showAnswer"
                type="checkbox"
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label class="ml-2 block text-sm text-gray-900">考试结束后显示答案</label>
            </div>

            <div class="flex items-center">
              <input
                v-model="formData.preventCopy"
                type="checkbox"
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label class="ml-2 block text-sm text-gray-900">防止复制粘贴</label>
            </div>

            <div class="flex items-center">
              <input
                v-model="formData.fullScreen"
                type="checkbox"
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label class="ml-2 block text-sm text-gray-900">强制全屏模式</label>
            </div>
          </div>
        </div>
      </div>

      <!-- 参与者设置 -->
      <div class="bg-white shadow rounded-lg">
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-medium text-gray-900">参与者设置</h3>
        </div>
        <div class="p-6 space-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-700">参与方式</label>
            <div class="mt-2 space-y-2">
              <div class="flex items-center">
                <input
                  v-model="formData.participantType"
                  type="radio"
                  value="all"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <label class="ml-2 block text-sm text-gray-900">所有学生</label>
              </div>
              <div class="flex items-center">
                <input
                  v-model="formData.participantType"
                  type="radio"
                  value="class"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <label class="ml-2 block text-sm text-gray-900">指定班级</label>
              </div>
              <div class="flex items-center">
                <input
                  v-model="formData.participantType"
                  type="radio"
                  value="student"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <label class="ml-2 block text-sm text-gray-900">指定学生</label>
              </div>
            </div>
          </div>

          <div v-if="formData.participantType === 'class'">
            <label class="block text-sm font-medium text-gray-700">选择班级</label>
            <div class="mt-2 space-y-2 max-h-40 overflow-y-auto border border-gray-300 rounded-md p-3">
              <div v-for="cls in classes" :key="cls.id" class="flex items-center">
                <input
                  v-model="formData.selectedClasses"
                  type="checkbox"
                  :value="cls.id"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label class="ml-2 block text-sm text-gray-900">{{ cls.name }}</label>
              </div>
            </div>
          </div>

          <div v-if="formData.participantType === 'student'">
            <label class="block text-sm font-medium text-gray-700">选择学生</label>
            <div class="mt-2">
              <input
                v-model="studentSearch"
                type="text"
                placeholder="搜索学生姓名或学号"
                class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm mb-3"
              />
              <div class="space-y-2 max-h-40 overflow-y-auto border border-gray-300 rounded-md p-3">
                <div v-for="student in filteredStudents" :key="student.id" class="flex items-center">
                  <input
                    v-model="formData.selectedStudents"
                    type="checkbox"
                    :value="student.id"
                    class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label class="ml-2 block text-sm text-gray-900">
                    {{ student.name }} ({{ student.studentId }})
                  </label>
                </div>
              </div>
            </div>
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
          @click="saveDraft"
          class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          保存草稿
        </button>
        <button
          type="submit"
          class="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {{ isEdit ? '保存修改' : '创建考试' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const isEdit = computed(() => !!route.params.id)
const examId = computed(() => route.params.id as string)

// 表单数据
const formData = ref({
  title: '',
  description: '',
  type: 'exam',
  paperId: null as number | null,
  totalScore: 0,
  passScore: 60,
  startTime: '',
  endTime: '',
  duration: 0,
  earlySubmitTime: 0,
  maxAttempts: 1,
  shuffleQuestions: false,
  shuffleOptions: false,
  showScore: true,
  showAnswer: false,
  preventCopy: true,
  fullScreen: false,
  participantType: 'all',
  selectedClasses: [] as number[],
  selectedStudents: [] as number[]
})

// 学生搜索
const studentSearch = ref('')

// 试卷列表
const papers = ref([
  { id: 1, title: '数学期中试卷', questionCount: 20, totalScore: 100 },
  { id: 2, title: '语文阅读理解', questionCount: 15, totalScore: 80 },
  { id: 3, title: '英语听力测试', questionCount: 25, totalScore: 120 }
])

// 班级列表
const classes = ref([
  { id: 1, name: '高一(1)班' },
  { id: 2, name: '高一(2)班' },
  { id: 3, name: '高一(3)班' }
])

// 学生列表
const students = ref([
  { id: 1, name: '张三', studentId: '2024001' },
  { id: 2, name: '李四', studentId: '2024002' },
  { id: 3, name: '王五', studentId: '2024003' }
])

// 筛选后的学生
const filteredStudents = computed(() => {
  if (!studentSearch.value) return students.value
  
  return students.value.filter(student =>
    student.name.includes(studentSearch.value) ||
    student.studentId.includes(studentSearch.value)
  )
})

// 监听试卷选择，自动设置总分
watch(() => formData.value.paperId, (paperId) => {
  if (paperId) {
    const paper = papers.value.find(p => p.id === paperId)
    if (paper) {
      formData.value.totalScore = paper.totalScore
    }
  }
})

// 监听时间变化，自动计算时长
watch([() => formData.value.startTime, () => formData.value.endTime], ([start, end]) => {
  if (start && end) {
    const startDate = new Date(start)
    const endDate = new Date(end)
    const duration = Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 60))
    if (duration > 0) {
      formData.value.duration = duration
    }
  }
})

// 保存草稿
const saveDraft = async () => {
  try {
    // TODO: 调用保存草稿API
    console.log('Save draft:', formData.value)
    router.push('/teacher/exams')
  } catch (error) {
    console.error('Failed to save draft:', error)
  }
}

// 提交表单
const submitForm = async () => {
  try {
    if (isEdit.value) {
      // TODO: 调用更新API
      console.log('Update exam:', examId.value, formData.value)
    } else {
      // TODO: 调用创建API
      console.log('Create exam:', formData.value)
    }
    router.push('/teacher/exams')
  } catch (error) {
    console.error('Failed to submit form:', error)
  }
}

// 加载数据
const loadData = async () => {
  try {
    // TODO: 加载试卷、班级、学生列表
    
    if (isEdit.value) {
      // TODO: 加载考试详情
      console.log('Load exam:', examId.value)
    }
  } catch (error) {
    console.error('Failed to load data:', error)
  }
}

onMounted(() => {
  loadData()
})
</script>
