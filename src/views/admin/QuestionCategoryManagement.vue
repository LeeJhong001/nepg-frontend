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
          <!-- 递归渲染分类树 -->
          <div
            v-for="category in filteredCategories"
            :key="category.id"
            class="border border-gray-200 rounded-lg p-4"
          >
            <!-- 递归渲染分类项 -->
            <div class="space-y-2">
              <!-- 分类信息行 -->
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-3">
                  <span class="text-sm font-medium text-gray-900">{{ category.name }}</span>
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
                  <span class="text-xs text-gray-500">层级: 0</span>
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

              <!-- 递归渲染子分类 -->
              <div
                v-if="category.children && category.children.length > 0"
                class="mt-3 ml-6 space-y-2 border-l-2 border-gray-200 pl-4"
              >
                <div v-for="child in category.children" :key="child.id" class="space-y-2">
                  <!-- 子分类信息行 -->
                  <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-3">
                      <span class="text-sm text-gray-700">{{ child.name }}</span>
                      <span v-if="child.description" class="text-sm text-gray-500">
                        {{ child.description }}
                      </span>
                      <span class="text-xs text-gray-400">排序: {{ child.sortOrder }}</span>
                      <span
                        :class="
                          child.enabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        "
                        class="px-2 py-1 text-xs rounded-full"
                      >
                        {{ child.enabled ? '启用' : '禁用' }}
                      </span>
                      <span class="text-xs text-gray-400">
                        {{ child.enabled ? '✓' : '✗' }}
                      </span>
                      <span class="text-xs text-gray-500">层级: 1</span>
                    </div>
                    <div class="flex items-center space-x-2">
                      <button
                        @click="toggleCategoryStatus(child)"
                        :class="
                          child.enabled
                            ? 'text-yellow-600 hover:text-yellow-800'
                            : 'text-green-600 hover:text-green-800'
                        "
                        class="text-sm"
                      >
                        {{ child.enabled ? '禁用' : '启用' }}
                      </button>
                      <button
                        @click="editCategory(child)"
                        class="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        编辑
                      </button>
                      <button
                        @click="deleteCategory(child.id)"
                        class="text-red-600 hover:text-red-800 text-sm"
                      >
                        删除
                      </button>
                    </div>
                  </div>

                  <!-- 递归渲染孙分类 -->
                  <div
                    v-if="child.children && child.children.length > 0"
                    class="mt-3 ml-6 space-y-2 border-l-2 border-gray-200 pl-4"
                  >
                    <div
                      v-for="grandchild in child.children"
                      :key="grandchild.id"
                      class="space-y-2"
                    >
                      <!-- 孙分类信息行 -->
                      <div class="flex items-center justify-between">
                        <div class="flex items-center space-x-3">
                          <span class="text-sm text-gray-600">{{ grandchild.name }}</span>
                          <span v-if="grandchild.description" class="text-sm text-gray-500">
                            {{ grandchild.description }}
                          </span>
                          <span class="text-xs text-gray-400"
                            >排序: {{ grandchild.sortOrder }}</span
                          >
                          <span
                            :class="
                              grandchild.enabled
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            "
                            class="px-2 py-1 text-xs rounded-full"
                          >
                            {{ grandchild.enabled ? '启用' : '禁用' }}
                          </span>
                          <span class="text-xs text-gray-400">
                            {{ grandchild.enabled ? '✓' : '✗' }}
                          </span>
                          <span class="text-xs text-gray-500">层级: 2</span>
                        </div>
                        <div class="flex items-center space-x-2">
                          <button
                            @click="toggleCategoryStatus(grandchild)"
                            :class="
                              grandchild.enabled
                                ? 'text-yellow-600 hover:text-yellow-800'
                                : 'text-green-600 hover:text-green-800'
                            "
                            class="text-sm"
                          >
                            {{ grandchild.enabled ? '禁用' : '启用' }}
                          </button>
                          <button
                            @click="editCategory(grandchild)"
                            class="text-blue-600 hover:text-blue-800 text-sm"
                          >
                            编辑
                          </button>
                          <button
                            @click="deleteCategory(grandchild.id)"
                            class="text-red-600 hover:text-red-800 text-sm"
                          >
                            删除
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
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
import { ref, onMounted, reactive, computed } from 'vue'
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

// 计算属性
const filteredCategories = computed(() => {
  return filterCategoryTree(categories.value, filterEnabled.value)
})

// 筛选结果统计
const filteredCount = computed(() => countAllCategories(filteredCategories.value).total)

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
