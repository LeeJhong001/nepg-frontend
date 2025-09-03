<template>
  <div>
    <!-- 页面标题和操作 -->
    <div class="sm:flex sm:items-center sm:justify-between mb-6">
      <div>
        <h1 class="text-2xl font-semibold text-gray-900">分类管理</h1>
        <p class="mt-1 text-sm text-gray-600">管理题目分类结构</p>
      </div>
      <div class="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
        <button
          @click="showCreateModal = true"
          class="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <svg class="-ml-1 mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          创建分类
        </button>
      </div>
    </div>

    <!-- 搜索和筛选 -->
    <div class="bg-white shadow rounded-lg mb-6">
      <div class="p-6">
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label class="block text-sm font-medium text-gray-700">搜索分类</label>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="搜索分类名称..."
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">状态</label>
            <select
              v-model="statusFilter"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">全部状态</option>
              <option value="active">启用</option>
              <option value="inactive">禁用</option>
            </select>
          </div>
          <div class="flex items-end">
            <button
              @click="resetFilters"
              class="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              重置
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 分类树 -->
    <div class="bg-white shadow rounded-lg overflow-hidden">
      <div class="p-6">
        <div class="space-y-2">
          <CategoryTreeNode
            v-for="category in filteredCategories"
            :key="category.id"
            :category="category"
            :level="0"
            @edit="editCategory"
            @delete="deleteCategory"
            @move="moveCategory"
            @toggle-status="toggleCategoryStatus"
          />
        </div>
      </div>
    </div>

    <!-- 创建/编辑分类模态框 -->
    <div v-if="showCreateModal || showEditModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div class="mt-3">
          <h3 class="text-lg font-medium text-gray-900 mb-4">
            {{ showCreateModal ? '创建分类' : '编辑分类' }}
          </h3>
          <form @submit.prevent="submitForm">
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">分类名称</label>
                <input
                  v-model="formData.name"
                  type="text"
                  required
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">父分类</label>
                <select
                  v-model="formData.parentId"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                >
                  <option value="">无（顶级分类）</option>
                  <option v-for="category in flatCategories" :key="category.id" :value="category.id">
                    {{ '　'.repeat(category.level) }}{{ category.name }}
                  </option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">描述</label>
                <textarea
                  v-model="formData.description"
                  rows="3"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                ></textarea>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">排序</label>
                <input
                  v-model.number="formData.sort"
                  type="number"
                  min="0"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>
              <div class="flex items-center">
                <input
                  v-model="formData.status"
                  type="checkbox"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label class="ml-2 block text-sm text-gray-900">启用状态</label>
              </div>
            </div>
            <div class="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                @click="closeModal"
                class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                取消
              </button>
              <button
                type="submit"
                class="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {{ showCreateModal ? '创建' : '保存' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import CategoryTreeNode from './CategoryTreeNode.vue'

interface Category {
  id: number
  name: string
  description: string
  parentId: number | null
  sort: number
  status: 'active' | 'inactive'
  children?: Category[]
  level?: number
}

// 搜索和筛选
const searchQuery = ref('')
const statusFilter = ref('')

// 模态框状态
const showCreateModal = ref(false)
const showEditModal = ref(false)
const editingCategory = ref<Category | null>(null)

// 表单数据
const formData = ref({
  name: '',
  description: '',
  parentId: null as number | null,
  sort: 0,
  status: true
})

// 分类数据
const categories = ref<Category[]>([
  {
    id: 1,
    name: '数学',
    description: '数学相关题目',
    parentId: null,
    sort: 1,
    status: 'active',
    children: [
      {
        id: 2,
        name: '代数',
        description: '代数题目',
        parentId: 1,
        sort: 1,
        status: 'active',
        children: []
      },
      {
        id: 3,
        name: '几何',
        description: '几何题目',
        parentId: 1,
        sort: 2,
        status: 'active',
        children: []
      }
    ]
  },
  {
    id: 4,
    name: '语文',
    description: '语文相关题目',
    parentId: null,
    sort: 2,
    status: 'active',
    children: [
      {
        id: 5,
        name: '阅读理解',
        description: '阅读理解题目',
        parentId: 4,
        sort: 1,
        status: 'active',
        children: []
      }
    ]
  }
])

// 筛选后的分类
const filteredCategories = computed(() => {
  return filterCategories(categories.value)
})

// 扁平化分类列表（用于父分类选择）
const flatCategories = computed(() => {
  const result: (Category & { level: number })[] = []
  
  const flatten = (cats: Category[], level = 0) => {
    cats.forEach(cat => {
      if (cat.id !== editingCategory.value?.id) { // 编辑时排除自己
        result.push({ ...cat, level })
        if (cat.children && cat.children.length > 0) {
          flatten(cat.children, level + 1)
        }
      }
    })
  }
  
  flatten(categories.value)
  return result
})

// 筛选分类
const filterCategories = (cats: Category[]): Category[] => {
  return cats.filter(cat => {
    const matchSearch = !searchQuery.value || 
      cat.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      cat.description.toLowerCase().includes(searchQuery.value.toLowerCase())
    
    const matchStatus = !statusFilter.value || cat.status === statusFilter.value
    
    if (matchSearch && matchStatus) {
      return true
    }
    
    // 如果子分类匹配，也显示父分类
    if (cat.children && cat.children.length > 0) {
      const filteredChildren = filterCategories(cat.children)
      if (filteredChildren.length > 0) {
        cat.children = filteredChildren
        return true
      }
    }
    
    return false
  })
}

// 重置筛选
const resetFilters = () => {
  searchQuery.value = ''
  statusFilter.value = ''
}

// 关闭模态框
const closeModal = () => {
  showCreateModal.value = false
  showEditModal.value = false
  editingCategory.value = null
  formData.value = {
    name: '',
    description: '',
    parentId: null,
    sort: 0,
    status: true
  }
}

// 提交表单
const submitForm = async () => {
  try {
    if (showCreateModal.value) {
      // TODO: 调用创建API
      console.log('Create category:', formData.value)
    } else {
      // TODO: 调用更新API
      console.log('Update category:', editingCategory.value?.id, formData.value)
    }
    closeModal()
  } catch (error) {
    console.error('Failed to save category:', error)
  }
}

// 编辑分类
const editCategory = (category: Category) => {
  editingCategory.value = category
  formData.value = {
    name: category.name,
    description: category.description,
    parentId: category.parentId,
    sort: category.sort,
    status: category.status === 'active'
  }
  showEditModal.value = true
}

// 删除分类
const deleteCategory = async (category: Category) => {
  if (confirm(`确定要删除分类"${category.name}"吗？`)) {
    try {
      // TODO: 调用删除API
      console.log('Delete category:', category.id)
    } catch (error) {
      console.error('Failed to delete category:', error)
    }
  }
}

// 移动分类
const moveCategory = async (category: Category, direction: 'up' | 'down') => {
  try {
    // TODO: 调用移动API
    console.log('Move category:', category.id, direction)
  } catch (error) {
    console.error('Failed to move category:', error)
  }
}

// 切换分类状态
const toggleCategoryStatus = async (category: Category) => {
  try {
    // TODO: 调用状态切换API
    console.log('Toggle category status:', category.id)
  } catch (error) {
    console.error('Failed to toggle category status:', error)
  }
}

onMounted(() => {
  // TODO: 加载分类树
})
</script>
