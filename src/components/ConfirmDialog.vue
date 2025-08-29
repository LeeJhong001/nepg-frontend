<template>
  <div
    v-if="show"
    class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
    @click="onCancel"
  >
    <div
      class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white"
      @click.stop
    >
      <div class="mt-3 text-center">
        <div
          class="mx-auto flex items-center justify-center h-12 w-12 rounded-full"
          :class="typeClasses.bg"
        >
          <svg
            class="h-6 w-6"
            :class="typeClasses.icon"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              v-if="type === 'danger'"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.963-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z"
            />
            <path
              v-else-if="type === 'warning'"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.963-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z"
            />
            <path
              v-else
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h3 class="text-lg leading-6 font-medium text-gray-900 mt-4">{{ title }}</h3>
        <div class="mt-2 px-7 py-3">
          <p class="text-sm text-gray-500">{{ message }}</p>
        </div>
        <div class="items-center px-4 py-3">
          <div class="flex space-x-3 justify-center">
            <button
              @click="onCancel"
              class="px-4 py-2 bg-gray-500 text-white text-base font-medium rounded-md shadow-sm hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300"
            >
              {{ cancelText }}
            </button>
            <button
              @click="onConfirm"
              class="px-4 py-2 text-white text-base font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2"
              :class="typeClasses.button"
            >
              {{ confirmText }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

// 组件名称
defineOptions({
  name: 'ConfirmDialog'
})

interface Props {
  show: boolean
  type?: 'info' | 'warning' | 'danger'
  title: string
  message: string
  confirmText?: string
  cancelText?: string
}

const props = withDefaults(defineProps<Props>(), {
  type: 'info',
  confirmText: '确认',
  cancelText: '取消',
})

const emit = defineEmits<{
  confirm: []
  cancel: []
}>()

const typeClasses = computed(() => {
  switch (props.type) {
    case 'danger':
      return {
        bg: 'bg-red-100',
        icon: 'text-red-600',
        button: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
      }
    case 'warning':
      return {
        bg: 'bg-yellow-100',
        icon: 'text-yellow-600',
        button: 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500',
      }
    default:
      return {
        bg: 'bg-blue-100',
        icon: 'text-blue-600',
        button: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
      }
  }
})

const onConfirm = () => {
  emit('confirm')
}

const onCancel = () => {
  emit('cancel')
}
</script>
