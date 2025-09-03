<template>
  <div class="category-node">
    <div
      :class="[
        'flex items-center justify-between p-3 rounded-lg border',
        category.status === 'active' ? 'border-gray-200 bg-white' : 'border-gray-300 bg-gray-50'
      ]"
      :style="{ marginLeft: `${level * 20}px` }"
    >
      <div class="flex items-center flex-1">
        <!-- 展开/收起按钮 -->
        <button
          v-if="category.children && category.children.length > 0"
          @click="toggleExpanded"
          class="mr-2 p-1 rounded hover:bg-gray-100"
        >
          <svg
            :class="{ 'transform rotate-90': isExpanded }"
            class="h-4 w-4 text-gray-500 transition-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
        <div v-else class="w-6 mr-2"></div>

        <!-- 分类信息 -->
        <div class="flex-1">
          <div class="flex items-center space-x-3">
            <h4 class="text-sm font-medium text-gray-900">{{ category.name }}</h4>
            <span
              :class="[
                'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                category.status === 'active'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-800'
              ]"
            >
              {{ category.status === 'active' ? '启用' : '禁用' }}
            </span>
            <span class="text-xs text-gray-500">排序: {{ category.sort }}</span>
          </div>
          <p v-if="category.description" class="text-sm text-gray-600 mt-1">{{ category.description }}</p>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="flex items-center space-x-2">
        <button
          @click="$emit('move', category, 'up')"
          class="p-1 text-gray-400 hover:text-gray-600"
          title="上移"
        >
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
          </svg>
        </button>
        <button
          @click="$emit('move', category, 'down')"
          class="p-1 text-gray-400 hover:text-gray-600"
          title="下移"
        >
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        <button
          @click="$emit('toggle-status', category)"
          :class="[
            'p-1 hover:text-gray-600',
            category.status === 'active' ? 'text-green-600' : 'text-gray-400'
          ]"
          :title="category.status === 'active' ? '禁用' : '启用'"
        >
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>
        <button
          @click="$emit('edit', category)"
          class="p-1 text-blue-600 hover:text-blue-800"
          title="编辑"
        >
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
        <button
          @click="$emit('delete', category)"
          class="p-1 text-red-600 hover:text-red-800"
          title="删除"
        >
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>

    <!-- 子分类 -->
    <div v-if="isExpanded && category.children && category.children.length > 0" class="mt-2">
      <CategoryTreeNode
        v-for="child in category.children"
        :key="child.id"
        :category="child"
        :level="level + 1"
        @edit="$emit('edit', $event)"
        @delete="$emit('delete', $event)"
        @move="$emit('move', $event, $event)"
        @toggle-status="$emit('toggle-status', $event)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Category {
  id: number
  name: string
  description: string
  parentId: number | null
  sort: number
  status: 'active' | 'inactive'
  children?: Category[]
}

defineProps<{
  category: Category
  level: number
}>()

defineEmits<{
  edit: [category: Category]
  delete: [category: Category]
  move: [category: Category, direction: 'up' | 'down']
  'toggle-status': [category: Category]
}>()

const isExpanded = ref(true)

const toggleExpanded = () => {
  isExpanded.value = !isExpanded.value
}
</script>
