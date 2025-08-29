<template>
  <div class="bg-white shadow rounded-lg p-6">
    <h3 class="text-lg font-medium text-gray-900 mb-4">用户管理</h3>

    <!-- 搜索和过滤 -->
    <div class="mb-6 flex flex-col sm:flex-row gap-4">
      <div class="flex-1">
        <input
          type="text"
          placeholder="搜索用户..."
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
        />
      </div>
      <select
        class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
      >
        <option value="">所有角色</option>
        <option value="STUDENT">学生</option>
        <option value="TEACHER">教师</option>
        <option value="ADMIN">管理员</option>
      </select>
      <button class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">搜索</button>
    </div>

    <!-- 用户列表 -->
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              用户
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              角色
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              状态
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              注册时间
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              操作
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <div class="flex-shrink-0 h-10 w-10">
                  <div class="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                    <span class="text-red-600 font-medium">张</span>
                  </div>
                </div>
                <div class="ml-4">
                  <div class="text-sm font-medium text-gray-900">张三</div>
                  <div class="text-sm text-gray-500">zhangsan@example.com</div>
                </div>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span
                class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800"
              >
                学生
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span
                class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800"
              >
                活跃
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2024-01-15</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <button class="text-red-600 hover:text-red-900 mr-3">编辑</button>
              <button class="text-red-600 hover:text-red-900">删除</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
// 用户管理逻辑
</script>
