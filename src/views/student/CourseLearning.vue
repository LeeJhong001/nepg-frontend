<template>
  <div class="bg-white shadow rounded-lg p-6">
    <h3 class="text-lg font-medium text-gray-900 mb-4">我的课程</h3>

    <!-- 课程列表 -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
        <div class="flex items-center justify-between mb-3">
          <h4 class="text-lg font-medium text-gray-900">Web开发基础</h4>
          <span
            class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800"
          >
            学习中
          </span>
        </div>
        <p class="text-gray-600 text-sm mb-4">李老师 · 45名学生</p>
        <div class="mb-4">
          <div class="flex items-center justify-between text-sm text-gray-500 mb-2">
            <span>学习进度</span>
            <span>75%</span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-2">
            <div class="bg-green-600 h-2 rounded-full" style="width: 75%"></div>
          </div>
        </div>
        <div class="flex gap-2">
          <button
            class="flex-1 px-3 py-2 bg-green-600 text-white text-sm rounded-md hover:bg-green-700"
          >
            继续学习
          </button>
          <button
            class="px-3 py-2 border border-gray-300 text-gray-700 text-sm rounded-md hover:bg-gray-50"
          >
            查看详情
          </button>
        </div>
      </div>

      <div class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
        <div class="flex items-center justify-between mb-3">
          <h4 class="text-lg font-medium text-gray-900">数据库设计</h4>
          <span
            class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800"
          >
            未开始
          </span>
        </div>
        <p class="text-gray-600 text-sm mb-4">王老师 · 32名学生</p>
        <div class="mb-4">
          <div class="flex items-center justify-between text-sm text-gray-500 mb-2">
            <span>学习进度</span>
            <span>0%</span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-2">
            <div class="bg-green-600 h-2 rounded-full" style="width: 0%"></div>
          </div>
        </div>
        <div class="flex gap-2">
          <button
            class="flex-1 px-3 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
          >
            开始学习
          </button>
          <button
            class="px-3 py-2 border border-gray-300 text-gray-700 text-sm rounded-md hover:bg-gray-50"
          >
            查看详情
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 课程学习逻辑
</script>
