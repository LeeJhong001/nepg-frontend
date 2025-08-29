<template>
  <div class="bg-white shadow rounded-lg p-6">
    <h3 class="text-lg font-medium text-gray-900 mb-4">课程管理</h3>

    <!-- 操作按钮 -->
    <div class="mb-6">
      <button class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 mr-3">
        新建课程
      </button>
      <button class="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700">
        导入课程
      </button>
    </div>

    <!-- 课程列表 -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
        <div class="flex items-center justify-between mb-3">
          <h4 class="text-lg font-medium text-gray-900">Web开发基础</h4>
          <span
            class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800"
          >
            进行中
          </span>
        </div>
        <p class="text-gray-600 text-sm mb-4">学习HTML、CSS、JavaScript基础知识</p>
        <div class="flex items-center justify-between text-sm text-gray-500">
          <span>学生: 45人</span>
          <span>进度: 75%</span>
        </div>
        <div class="mt-3 flex gap-2">
          <button class="text-blue-600 hover:text-blue-800 text-sm">编辑</button>
          <button class="text-blue-600 hover:text-blue-800 text-sm">查看</button>
        </div>
      </div>

      <div class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
        <div class="flex items-center justify-between mb-3">
          <h4 class="text-lg font-medium text-gray-900">数据库设计</h4>
          <span
            class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800"
          >
            准备中
          </span>
        </div>
        <p class="text-gray-600 text-sm mb-4">数据库原理与设计实践</p>
        <div class="flex items-center justify-between text-sm text-gray-500">
          <span>学生: 32人</span>
          <span>进度: 20%</span>
        </div>
        <div class="mt-3 flex gap-2">
          <button class="text-blue-600 hover:text-blue-800 text-sm">编辑</button>
          <button class="text-blue-600 hover:text-blue-800 text-sm">查看</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 课程管理逻辑
</script>
