<template>
  <div>
    <!-- 通知容器 -->
    <NotificationContainer />
    
    <!-- 确认对话框 -->
    <ConfirmDialog
      :show="confirmDialog.show"
      :type="confirmDialog.type"
      :title="confirmDialog.title"
      :message="confirmDialog.message"
      :confirm-text="confirmDialog.confirmText"
      :cancel-text="confirmDialog.cancelText"
      @confirm="confirmDialog.onConfirm"
      @cancel="confirmDialog.onCancel"
    />
    
    <div class="mb-6">
      <h2 class="text-2xl font-bold text-gray-900">题目分类管理</h2>
      <p class="text-gray-600">管理系统中的所有题目分类</p>
      <div v-if="!loading && categories.length > 0" class="mt-2">
        <span
          class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
        >
          <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path
              fill-rule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clip-rule="evenodd"
            />
          </svg>
          数据加载成功
        </span>
      </div>
      <div v-else-if="!loading && categories.length === 0" class="mt-2">
        <span
          class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"
        >
          <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path
              fill-rule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clip-rule="evenodd"
            />
          </svg>
          使用模拟数据
        </span>
      </div>
    </div>

    <!-- 操作按钮和筛选 -->
    <div class="mb-6 flex justify-between items-center">
      <div class="flex items-center space-x-4">
        <button
          @click="showCreateModal = true"
          class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
        >
          <svg class="w-4 h-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 4v16m8-8H4"
            />
          </svg>
          新建分类
        </button>

        <!-- 筛选选项 -->
        <div class="flex items-center space-x-2">
          <label class="text-sm text-gray-700">显示:</label>
          <select
            v-model="filterEnabled"
            class="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">所有分类</option>
            <option value="enabled">仅启用</option>
            <option value="disabled">仅禁用</option>
          </select>
        </div>
      </div>

      <!-- 统计信息 -->
      <div class="text-sm text-gray-600">
        <span class="mr-4">总计: {{ totalCategories }}</span>
        <span class="mr-4">启用: {{ enabledCount }}</span>
        <span>禁用: {{ disabledCount }}</span>
      </div>
    </div>

    <!-- 分类树 -->
    <div class="bg-white shadow rounded-lg">
      <div class="p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-medium text-gray-900">分类树</h3>
          <div class="text-sm text-gray-600">
            <span v-if="filterEnabled !== 'all'">
              筛选结果：{{ filteredCount }} 个分类
              <button
                @click="filterEnabled = 'all'"
                class="ml-2 text-blue-600 hover:text-blue-800 underline"
              >
                清除筛选
              </button>
            </span>
          </div>
        </div>
        <div v-if="loading" class="text-center py-8">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p class="mt-2 text-gray-500">加载中...</p>
        </div>
        <div v-else-if="filteredCount === 0" class="text-center py-8">
          <div class="text-gray-400 mb-2">
            <svg class="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.562M15 6.3a9 9 0 00-6 0M6 6.3a9 9 0 016 0"
              ></path>
            </svg>
          </div>
          <p class="text-gray-500 mb-2">
            {{
              filterEnabled === 'enabled'
                ? '没有启用的分类'
                : filterEnabled === 'disabled'
                  ? '没有禁用的分类'
                  : '暂无分类'
            }}
          </p>
          <p class="text-sm text-gray-400">
            当前筛选条件：{{
              filterEnabled === 'enabled'
                ? '仅启用'
                : filterEnabled === 'disabled'
                  ? '仅禁用'
                  : '所有分类'
            }}
          </p>
          <button
            @click="filterEnabled = 'all'"
            class="mt-3 px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
          >
            查看所有分类
          </button>
        </div>
        <div v-else class="space-y-2">
          <!-- 分页信息 -->
          <div class="flex justify-between items-center mb-4">
            <div class="text-sm text-gray-700">
              <span v-if="totalElements > 0">
                显示第 {{ (currentPage - 1) * pageSize + 1 }} - {{ Math.min(currentPage * pageSize, totalElements) }} 条，
                共 {{ totalElements }} 条记录
              </span>
              <span v-else>
                暂无数据
              </span>
            </div>
            
            <!-- 每页条数选择 -->
            <div class="flex items-center space-x-2">
              <span class="text-sm text-gray-700">每页</span>
              <select
                v-model="pageSize"
                @change="handlePageSizeChange"
                class="px-2 py-1 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
              </select>
              <span class="text-sm text-gray-700">条</span>
            </div>
          </div>

          <!-- 分页后的分类列表 -->
          <div
            v-for="category in paginatedCategories"
            :key="category.id"
            class="border border-gray-200 rounded-lg p-4"
          >
            <!-- 递归渲染分类项 -->
            <div class="space-y-2">
              <!-- 分类信息行 -->
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-3">
                  <span class="text-sm font-medium text-gray-900" :style="{ marginLeft: category.level * 20 + 'px' }">
                    {{ category.displayName }}
                  </span>
                  <span v-if="category.description" class="text-sm text-gray-500">
                    {{ category.description }}
                  </span>
                  <span class="text-xs text-gray-400">排序: {{ category.sortOrder }}</span>
                  <span
                    :class="
                      category.enabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    "
                    class="px-2 py-1 text-xs rounded-full"
                  >
                    {{ category.enabled ? '启用' : '禁用' }}
                  </span>
                  <span class="text-xs text-gray-400">
                    {{ category.enabled ? '✓' : '✗' }}
                  </span>
                  <span class="text-xs text-gray-500">层级: {{ category.level }}</span>
                </div>
                <div class="flex items-center space-x-2">
                  <button
                    @click="toggleCategoryStatus(category)"
                    :class="
                      category.enabled
                        ? 'text-yellow-600 hover:text-yellow-800'
                        : 'text-green-600 hover:text-green-800'
                    "
                    class="text-sm"
                  >
                    {{ category.enabled ? '禁用' : '启用' }}
                  </button>
                  <button
                    @click="editCategory(category)"
                    class="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    编辑
                  </button>
                  <button
                    @click="deleteCategory(category.id)"
                    class="text-red-600 hover:text-red-800 text-sm"
                  >
                    删除
                  </button>
                </div>
              </div>


            </div>
          </div>

          <!-- 分页控件 -->
          <div v-if="totalPages > 0" class="flex justify-center mt-6">
            <nav class="flex items-center space-x-2">
              <!-- 首页 -->
              <button
                @click="handlePageChange(1)"
                :disabled="currentPage === 1"
                class="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                title="首页"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                </svg>
              </button>
              
              <!-- 上一页 -->
              <button
                @click="handlePageChange(currentPage - 1)"
                :disabled="currentPage === 1"
                class="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                title="上一页"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <!-- 页码 -->
              <div class="flex items-center space-x-1">
                <template v-for="page in getVisiblePages()" :key="page">
                  <button
                    v-if="page !== '...'"
                    @click="handlePageChange(page)"
                    :class="[
                      'px-3 py-2 text-sm border rounded-md transition-colors',
                      page === currentPage
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    ]"
                  >
                    {{ page }}
                  </button>
                  <span v-else class="px-2 text-gray-500">...</span>
                </template>
              </div>
              
              <!-- 下一页 -->
              <button
                @click="handlePageChange(currentPage + 1)"
                :disabled="currentPage === totalPages"
                class="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                title="下一页"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
              
              <!-- 末页 -->
              <button
                @click="handlePageChange(totalPages)"
                :disabled="currentPage === totalPages"
                class="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                title="末页"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5l7 7-7 7" />
                </svg>
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>

    <!-- 创建/编辑分类模态框 -->
    <div
      v-if="showCreateModal || showEditModal"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
      @click="closeModal"
    >
      <div
        class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white"
        @click.stop
      >
        <div class="mt-3">
          <h3 class="text-lg font-medium text-gray-900 mb-4">
            {{ showEditModal ? '编辑分类' : '新建分类' }}
          </h3>
          <form @submit.prevent="submitForm">
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">分类名称</label>
                <input
                  v-model="form.name"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="请输入分类名称"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">父分类</label>
                <select
                  v-model="form.parentId"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option :value="undefined">无父分类（顶级分类）</option>
                  <optgroup label="顶级分类">
                    <option v-for="cat in topLevelCategories" :key="cat.id" :value="cat.id">
                      {{ cat.name }}
                    </option>
                  </optgroup>
                  <optgroup label="子分类">
                    <option v-for="cat in allSubCategories" :key="cat.id" :value="cat.id">
                      {{ getCategoryPath(cat) }}
                    </option>
                  </optgroup>
                </select>
                <p class="mt-1 text-xs text-gray-500">
                  选择父分类可以创建子分类，不选择则创建顶级分类
                </p>
                <div v-if="form.parentId" class="mt-2 p-2 bg-blue-50 rounded-md">
                  <p class="text-xs text-blue-700">
                    <span class="font-medium">当前选择:</span>
                    {{ getSelectedParentInfo() }}
                  </p>
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">描述</label>
                <textarea
                  v-model="form.description"
                  rows="3"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="请输入分类描述"
                ></textarea>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">排序</label>
                <input
                  v-model.number="form.sortOrder"
                  type="number"
                  min="0"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0"
                />
              </div>

              <div class="flex items-center">
                <input
                  v-model="form.enabled"
                  type="checkbox"
                  id="enabled"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label for="enabled" class="ml-2 block text-sm text-gray-900">启用</label>
              </div>
            </div>

            <div class="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                @click="closeModal"
                class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                取消
              </button>
              <button
                type="submit"
                class="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700"
              >
                {{ showEditModal ? '更新' : '创建' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, computed, watch } from 'vue'
import { QuestionCategoryService } from '../../services/questionCategoryService'
import NotificationContainer from '../../components/NotificationContainer.vue'
import ConfirmDialog from '../../components/ConfirmDialog.vue'
import { useNotification } from '../../composables/useNotification'
import type {
  QuestionCategory,
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from '../../types/question'

const { success, error, warning } = useNotification()

const loading = ref(false)
const categories = ref<QuestionCategory[]>([])
const topLevelCategories = ref<QuestionCategory[]>([])
const showCreateModal = ref(false)
const showEditModal = ref(false)
const editingCategory = ref<QuestionCategory | null>(null)
const filterEnabled = ref<'all' | 'enabled' | 'disabled'>('all')

// 分页相关变量
const currentPage = ref(1)
const pageSize = ref(10)
const totalPages = ref(0)
const totalElements = ref(0)

// 确认对话框状态
const confirmDialog = reactive({
  show: false,
  type: 'info' as 'info' | 'warning' | 'danger',
  title: '',
  message: '',
  confirmText: '确认',
  cancelText: '取消',
  onConfirm: () => {},
  onCancel: () => {
    confirmDialog.show = false
  },
})

// 显示确认对话框的辅助函数
const showConfirmDialog = (
  title: string,
  message: string,
  onConfirm: () => void,
  type: 'info' | 'warning' | 'danger' = 'info',
  confirmText = '确认',
  cancelText = '取消'
) => {
  confirmDialog.title = title
  confirmDialog.message = message
  confirmDialog.type = type
  confirmDialog.confirmText = confirmText
  confirmDialog.cancelText = cancelText
  confirmDialog.onConfirm = () => {
    confirmDialog.show = false
    onConfirm()
  }
  confirmDialog.show = true
}

const form = reactive<CreateCategoryRequest>({
  name: '',
  parentId: undefined,
  description: '',
  sortOrder: 0,
  enabled: true,
})

// 递归筛选分类树的函数
const filterCategoryTree = (categories: QuestionCategory[], filter: 'all' | 'enabled' | 'disabled'): QuestionCategory[] => {
  if (filter === 'all') {
    return categories
  }

  const filterRecursive = (cats: QuestionCategory[]): QuestionCategory[] => {
    const result: QuestionCategory[] = []
    
    for (const cat of cats) {
      const shouldInclude = filter === 'enabled' ? cat.enabled : !cat.enabled
      
      if (shouldInclude) {
        // 如果当前分类符合条件，添加它（包括所有子分类）
        result.push({
          ...cat,
          children: cat.children || []
        })
      } else if (cat.children && cat.children.length > 0) {
        // 如果当前分类不符合条件，但有子分类，递归检查子分类
        const filteredChildren = filterRecursive(cat.children)
        if (filteredChildren.length > 0) {
          // 如果有符合条件的子分类，保留当前分类但只显示符合条件的子分类
          result.push({
            ...cat,
            children: filteredChildren
          })
        }
      }
    }
    
    return result
  }

  return filterRecursive(categories)
}

// 将树形分类展平为列表的函数
const flattenCategories = (categories: QuestionCategory[], level: number = 0): Array<QuestionCategory & { displayName: string; level: number }> => {
  const result: Array<QuestionCategory & { displayName: string; level: number }> = []
  
  for (const category of categories) {
    // 添加缩进表示层级关系
    const indent = '　'.repeat(level) // 使用全角空格作为缩进
    const prefix = level > 0 ? '└ ' : ''
    const displayName = indent + prefix + category.name
    
    result.push({
      ...category,
      displayName,
      level
    })
    
    // 递归处理子分类
    if (category.children && category.children.length > 0) {
      result.push(...flattenCategories(category.children, level + 1))
    }
  }
  
  return result
}

// 计算属性
const filteredCategories = computed(() => {
  return filterCategoryTree(categories.value, filterEnabled.value)
})

// 展平后的分类列表
const flattenedCategories = computed(() => {
  return flattenCategories(filteredCategories.value)
})

// 分页后的分类列表
const paginatedCategories = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return flattenedCategories.value.slice(start, end)
})

// 筛选结果统计
const filteredCount = computed(() => countAllCategories(filteredCategories.value).total)

// 更新分页信息
const updatePagination = () => {
  totalElements.value = flattenedCategories.value.length
  totalPages.value = Math.ceil(totalElements.value / pageSize.value)
  
  // 确保当前页不超出范围
  if (currentPage.value > totalPages.value && totalPages.value > 0) {
    currentPage.value = totalPages.value
  }
}

// 递归统计所有分类的函数
const countAllCategories = (categories: QuestionCategory[]): { total: number; enabled: number; disabled: number } => {
  let total = 0
  let enabled = 0
  let disabled = 0

  const countRecursive = (cats: QuestionCategory[]) => {
    for (const cat of cats) {
      total++
      if (cat.enabled) {
        enabled++
      } else {
        disabled++
      }
      
      if (cat.children && cat.children.length > 0) {
        countRecursive(cat.children)
      }
    }
  }

  countRecursive(categories)
  return { total, enabled, disabled }
}

const totalCategories = computed(() => countAllCategories(categories.value).total)
const enabledCount = computed(() => countAllCategories(categories.value).enabled)
const disabledCount = computed(() => countAllCategories(categories.value).disabled)

// 分页处理函数
const handlePageChange = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

const handlePageSizeChange = () => {
  currentPage.value = 1 // 重置到第一页
}

// 获取可见的页码
const getVisiblePages = () => {
  const pages: (number | string)[] = []
  const total = totalPages.value
  const current = currentPage.value
  
  if (total <= 7) {
    // 如果总页数小于等于7，显示所有页码
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    // 如果总页数大于7，显示部分页码
    if (current <= 4) {
      // 当前页在前4页
      for (let i = 1; i <= 5; i++) {
        pages.push(i)
      }
      pages.push('...')
      pages.push(total)
    } else if (current >= total - 3) {
      // 当前页在后4页
      pages.push(1)
      pages.push('...')
      for (let i = total - 4; i <= total; i++) {
        pages.push(i)
      }
    } else {
      // 当前页在中间
      pages.push(1)
      pages.push('...')
      for (let i = current - 1; i <= current + 1; i++) {
        pages.push(i)
      }
      pages.push('...')
      pages.push(total)
    }
  }
  
  return pages
}

// 监听筛选条件变化，重置页码
watch(filterEnabled, () => {
  currentPage.value = 1
})

// 监听展平后的分类列表变化，更新分页信息
watch(flattenedCategories, () => {
  updatePagination()
}, { immediate: true })

// 获取所有子分类（用于父分类选择）
const allSubCategories = computed(() => {
  const subCategories: QuestionCategory[] = []

  const extractSubCategories = (cats: QuestionCategory[]) => {
    cats.forEach((cat) => {
      if (cat.children && cat.children.length > 0) {
        cat.children.forEach((child) => {
          subCategories.push(child)
          if (child.children && child.children.length > 0) {
            extractSubCategories(child.children)
          }
        })
      }
    })
  }

  extractSubCategories(categories.value)
  return subCategories
})

// 获取分类的完整路径
const getCategoryPath = (category: QuestionCategory) => {
  const findPath = (
    cats: QuestionCategory[],
    targetId: number,
    path: string[] = [],
  ): string[] | null => {
    for (const cat of cats) {
      const currentPath = [...path, cat.name]
      if (cat.id === targetId) {
        return currentPath
      }
      if (cat.children && cat.children.length > 0) {
        const result = findPath(cat.children, targetId, currentPath)
        if (result) return result
      }
    }
    return null
  }

  const path = findPath(categories.value, category.id)
  return path ? path.join(' → ') : category.name
}

// 获取选中的父分类信息
const getSelectedParentInfo = () => {
  if (!form.parentId) return ''

  const findCategory = (cats: QuestionCategory[], targetId: number): QuestionCategory | null => {
    for (const cat of cats) {
      if (cat.id === targetId) return cat
      if (cat.children && cat.children.length > 0) {
        const result = findCategory(cat.children, targetId)
        if (result) return result
      }
    }
    return null
  }

  const selectedCategory = findCategory(categories.value, form.parentId)
  if (selectedCategory) {
    const path = getCategoryPath(selectedCategory)
    const level = path.split(' → ').length - 1
    return `${path} (层级 ${level})`
  }

  return '未知分类'
}

onMounted(() => {
  loadCategories()
  loadTopLevelCategories()
})

const loadCategories = async () => {
  try {
    loading.value = true
    categories.value = await QuestionCategoryService.getCategoryTree()
  } catch (error: any) {
    console.error('加载分类失败:', error)
    // 如果获取分类树失败，尝试获取顶级分类作为降级方案
    try {
      console.log('尝试获取顶级分类作为降级方案...')
      const topCategories = await QuestionCategoryService.getTopLevelCategories()
      categories.value = topCategories.map((cat) => ({ ...cat, children: [] }))
      console.log('使用顶级分类作为降级方案成功')
    } catch (fallbackError: any) {
      console.error('降级方案也失败:', fallbackError)
      categories.value = []
      warning('无法加载分类数据', '使用模拟数据进行演示')
      // 使用模拟数据作为最后的降级方案
      categories.value = [
        {
          id: 1,
          name: '数学',
          description: '数学相关题目',
          sortOrder: 1,
          enabled: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          children: [
            {
              id: 2,
              name: '高等数学',
              description: '高等数学题目',
              sortOrder: 1,
              enabled: true,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              children: [
                {
                  id: 3,
                  name: '微积分',
                  description: '微积分题目',
                  sortOrder: 1,
                  enabled: true,
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
                  children: [],
                },
              ],
            },
            {
              id: 4,
              name: '线性代数',
              description: '线性代数题目',
              sortOrder: 2,
              enabled: false, // 禁用的分类
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              children: [],
            },
          ],
        },
        {
          id: 5,
          name: '物理',
          description: '物理相关题目',
          sortOrder: 2,
          enabled: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          children: [],
        },
        {
          id: 6,
          name: '化学',
          description: '化学相关题目',
          sortOrder: 3,
          enabled: false, // 禁用的分类
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          children: [],
        },
      ]
    }
  } finally {
    loading.value = false
  }
}

const loadTopLevelCategories = async () => {
  try {
    topLevelCategories.value = await QuestionCategoryService.getTopLevelCategories()
  } catch (error: any) {
    console.error('加载顶级分类失败:', error)
    // 如果API失败，使用模拟数据
    topLevelCategories.value = [
      {
        id: 1,
        name: '数学',
        description: '数学相关题目',
        sortOrder: 1,
        enabled: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 5,
        name: '物理',
        description: '物理相关题目',
        sortOrder: 2,
        enabled: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 6,
        name: '化学',
        description: '化学相关题目',
        sortOrder: 3,
        enabled: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ]
  }
}

const editCategory = (category: QuestionCategory) => {
  editingCategory.value = category
  form.name = category.name
  form.parentId = category.parentId || undefined
  form.description = category.description || ''
  form.sortOrder = category.sortOrder
  form.enabled = category.enabled
  showEditModal.value = true
}

const toggleCategoryStatus = (category: QuestionCategory) => {
  const action = category.enabled ? '禁用' : '启用'
  showConfirmDialog(
    `${action}分类`,
    `确定要${action}分类"${category.name}"吗？`,
    async () => {
      try {
        const updateData: UpdateCategoryRequest = {
          name: category.name,
          parentId: category.parentId,
          description: category.description || '',
          sortOrder: category.sortOrder,
          enabled: !category.enabled,
        }

        await QuestionCategoryService.updateCategory(category.id, updateData)
        success(`${action}成功`, `分类"${category.name}"已${action}`)
        loadCategories() // 重新加载数据
      } catch (error: any) {
        error(`操作失败`, error.message)
      }
    },
    'warning',
    action,
    '取消'
  )
}

const deleteCategory = (id: number) => {
  showConfirmDialog(
    '删除分类',
    '确定要删除这个分类吗？删除后无法恢复。',
    async () => {
      try {
        const canDelete = await QuestionCategoryService.canDeleteCategory(id)
        if (!canDelete) {
          warning('无法删除', '该分类下有题目，无法删除')
          return
        }

        await QuestionCategoryService.deleteCategory(id)
        success('删除成功', '分类已成功删除')
        loadCategories()
      } catch (error: any) {
        error('删除失败', error.message)
      }
    },
    'danger',
    '删除',
    '取消'
  )
}

const submitForm = async () => {
  try {
    if (showEditModal.value && editingCategory.value) {
      await QuestionCategoryService.updateCategory(editingCategory.value.id, form)
      success('更新成功', `分类"${form.name}"已成功更新`)
    } else {
      await QuestionCategoryService.createCategory(form)
      success('创建成功', `分类"${form.name}"已成功创建`)
    }

    closeModal()
    // 重新加载分类和顶级分类，确保新创建的分类可以作为父分类
    await loadCategories()
    await loadTopLevelCategories()
  } catch (error: any) {
    error(showEditModal.value ? '更新失败' : '创建失败', error.message)
  }
}

const closeModal = () => {
  showCreateModal.value = false
  showEditModal.value = false
  editingCategory.value = null
  resetForm()
}

const resetForm = () => {
  form.name = ''
  form.parentId = undefined
  form.description = ''
  form.sortOrder = 0
  form.enabled = true
}
</script>

<style scoped>
/* 分页样式 */
.pagination-info {
  @apply text-sm text-gray-700;
}

.pagination-controls {
  @apply flex items-center space-x-2;
}

.page-button {
  @apply px-3 py-2 text-sm border border-gray-300 rounded-md transition-colors;
}

.page-button:hover:not(:disabled) {
  @apply bg-gray-50;
}

.page-button:disabled {
  @apply opacity-50 cursor-not-allowed;
}

.page-button.active {
  @apply bg-blue-600 text-white border-blue-600;
}

.page-size-selector {
  @apply flex items-center space-x-2;
}

/* 分类层级缩进 */
.category-level-0 {
  margin-left: 0;
}

.category-level-1 {
  margin-left: 20px;
}

.category-level-2 {
  margin-left: 40px;
}

.category-level-3 {
  margin-left: 60px;
}
</style>
