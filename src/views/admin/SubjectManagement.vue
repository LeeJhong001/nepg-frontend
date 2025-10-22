<template>
  <div>
    <!-- 页面标题和操作按钮 -->
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-2xl font-semibold text-gray-900">科目管理</h1>
        <p class="mt-1 text-sm text-gray-600">管理系统中的所有科目信息</p>
      </div>
      <button
        @click="showCreateModal = true"
        class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
      >
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
        </svg>
        添加科目
      </button>
    </div>

    <!-- 搜索和筛选 -->
    <div class="bg-white rounded-lg shadow p-4 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">搜索</label>
          <input
            v-model="searchKeyword"
            type="text"
            placeholder="搜索科目名称或代码..."
            class="w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">院系</label>
          <select
            v-model="filterDepartment"
            class="w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
          >
            <option value="">全部院系</option>
            <option v-for="dept in departments" :key="dept" :value="dept">{{ dept }}</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">状态</label>
          <select
            v-model="filterStatus"
            class="w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
          >
            <option value="">全部状态</option>
            <option value="true">启用</option>
            <option value="false">禁用</option>
          </select>
        </div>
      </div>
    </div>

    <!-- 科目列表 -->
    <div class="bg-white shadow rounded-lg overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">科目代码</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">科目名称</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">院系</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">学分</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">状态</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">创建时间</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-if="loading">
            <td colspan="7" class="px-6 py-12 text-center text-gray-500">
              <div class="flex justify-center">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
              </div>
            </td>
          </tr>
          <tr v-else-if="filteredSubjects.length === 0">
            <td colspan="7" class="px-6 py-12 text-center text-gray-500">
              暂无科目数据
            </td>
          </tr>
          <tr v-else v-for="subject in filteredSubjects" :key="subject.id" class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              {{ subject.code }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ subject.name }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ subject.department || '-' }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ subject.credits || 0 }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span
                :class="[
                  subject.enabled
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800',
                  'px-2 inline-flex text-xs leading-5 font-semibold rounded-full'
                ]"
              >
                {{ subject.enabled ? '启用' : '禁用' }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ formatDate(subject.createdAt) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <button
                @click="editSubject(subject)"
                class="text-indigo-600 hover:text-indigo-900 mr-3"
              >
                编辑
              </button>
              <button
                @click="toggleSubjectStatus(subject)"
                :class="[
                  subject.enabled ? 'text-yellow-600 hover:text-yellow-900' : 'text-green-600 hover:text-green-900',
                  'mr-3'
                ]"
              >
                {{ subject.enabled ? '禁用' : '启用' }}
              </button>
              <button
                @click="deleteSubject(subject)"
                class="text-red-600 hover:text-red-900"
              >
                删除
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 创建/编辑科目模态框 -->
    <div
      v-if="showCreateModal || showEditModal"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
      @click.self="closeModal"
    >
      <div class="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-medium text-gray-900">
            {{ showCreateModal ? '添加科目' : '编辑科目' }}
          </h3>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <form @submit.prevent="submitForm" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                科目代码 <span class="text-red-500">*</span>
              </label>
              <input
                v-model="formData.code"
                type="text"
                required
                placeholder="例如：CS101"
                class="w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                科目名称 <span class="text-red-500">*</span>
              </label>
              <input
                v-model="formData.name"
                type="text"
                required
                placeholder="例如：Java程序设计"
                class="w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
              />
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">所属院系</label>
              <input
                v-model="formData.department"
                type="text"
                placeholder="例如：计算机科学与技术学院"
                class="w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">学分</label>
              <input
                v-model.number="formData.credits"
                type="number"
                min="0"
                placeholder="例如：4"
                class="w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">科目描述</label>
            <textarea
              v-model="formData.description"
              rows="3"
              placeholder="输入科目描述..."
              class="w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
            ></textarea>
          </div>

          <div class="flex items-center">
            <input
              v-model="formData.enabled"
              type="checkbox"
              id="enabled"
              class="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
            />
            <label for="enabled" class="ml-2 block text-sm text-gray-900">
              启用该科目
            </label>
          </div>

          <div class="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              @click="closeModal"
              class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              取消
            </button>
            <button
              type="submit"
              :disabled="submitting"
              class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
            >
              {{ submitting ? '提交中...' : (showCreateModal ? '创建' : '保存') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { getAllSubjects, type Subject } from '@/services/common/subjectService'
import * as adminSubjectService from '@/services/admin/subjectService'

// 数据状态
const subjects = ref<Subject[]>([])
const loading = ref(false)
const submitting = ref(false)

// 搜索和筛选
const searchKeyword = ref('')
const filterDepartment = ref('')
const filterStatus = ref('')

// 模态框状态
const showCreateModal = ref(false)
const showEditModal = ref(false)
const editingSubject = ref<Subject | null>(null)

// 表单数据
const formData = ref({
  code: '',
  name: '',
  department: '',
  credits: 0,
  description: '',
  enabled: true
})

// 院系列表（从现有数据中提取）
const departments = computed(() => {
  const depts = new Set<string>()
  subjects.value.forEach(s => {
    if (s.department) depts.add(s.department)
  })
  return Array.from(depts).sort()
})

// 筛选后的科目列表
const filteredSubjects = computed(() => {
  return subjects.value.filter(subject => {
    const matchKeyword = !searchKeyword.value ||
      subject.name.toLowerCase().includes(searchKeyword.value.toLowerCase()) ||
      subject.code.toLowerCase().includes(searchKeyword.value.toLowerCase())
    
    const matchDepartment = !filterDepartment.value ||
      subject.department === filterDepartment.value
    
    const matchStatus = filterStatus.value === '' ||
      subject.enabled.toString() === filterStatus.value
    
    return matchKeyword && matchDepartment && matchStatus
  })
})

// 加载科目列表
const loadSubjects = async () => {
  loading.value = true
  try {
    subjects.value = await getAllSubjects()
  } catch (error) {
    console.error('Failed to load subjects:', error)
    alert('加载科目列表失败')
  } finally {
    loading.value = false
  }
}

// 打开编辑模态框
const editSubject = (subject: Subject) => {
  editingSubject.value = subject
  formData.value = {
    code: subject.code,
    name: subject.name,
    department: subject.department || '',
    credits: subject.credits || 0,
    description: subject.description || '',
    enabled: subject.enabled
  }
  showEditModal.value = true
}

// 关闭模态框
const closeModal = () => {
  showCreateModal.value = false
  showEditModal.value = false
  editingSubject.value = null
  formData.value = {
    code: '',
    name: '',
    department: '',
    credits: 0,
    description: '',
    enabled: true
  }
}

// 提交表单
const submitForm = async () => {
  submitting.value = true
  try {
    if (showCreateModal.value) {
      await adminSubjectService.createSubject(formData.value)
      alert('科目创建成功')
    } else if (showEditModal.value && editingSubject.value) {
      await adminSubjectService.updateSubject(editingSubject.value.id, formData.value)
      alert('科目更新成功')
    }
    closeModal()
    await loadSubjects()
  } catch (error: any) {
    console.error('Failed to submit form:', error)
    alert(error.response?.data?.message || '操作失败')
  } finally {
    submitting.value = false
  }
}

// 切换科目状态
const toggleSubjectStatus = async (subject: Subject) => {
  if (!confirm(`确定要${subject.enabled ? '禁用' : '启用'}该科目吗？`)) {
    return
  }
  
  try {
    await adminSubjectService.toggleSubjectStatus(subject.id, !subject.enabled)
    alert('状态更新成功')
    await loadSubjects()
  } catch (error: any) {
    console.error('Failed to toggle status:', error)
    alert(error.response?.data?.message || '状态更新失败')
  }
}

// 删除科目
const deleteSubject = async (subject: Subject) => {
  if (!confirm(`确定要删除科目"${subject.name}"吗？此操作不可恢复！`)) {
    return
  }
  
  try {
    await adminSubjectService.deleteSubject(subject.id)
    alert('科目删除成功')
    await loadSubjects()
  } catch (error: any) {
    console.error('Failed to delete subject:', error)
    alert(error.response?.data?.message || '删除失败')
  }
}

// 格式化日期
const formatDate = (dateString: string) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString('zh-CN')
}

onMounted(() => {
  loadSubjects()
})
</script>
