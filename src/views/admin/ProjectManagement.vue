<template>
  <div class="bg-white shadow rounded-lg p-6">
    <h3 class="text-lg font-medium text-gray-900 mb-4">项目管理</h3>

    <!-- 操作按钮 -->
    <div class="mb-6">
      <button class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 mr-3">
        新建项目
      </button>
      <button class="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700">
        批量操作
      </button>
    </div>

    <!-- 项目列表 -->
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              项目名称
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              负责人
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              状态
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              进度
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              创建时间
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
              <div class="text-sm font-medium text-gray-900">OEPG系统开发</div>
              <div class="text-sm text-gray-500">在线教育平台</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900">李老师</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span
                class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800"
              >
                进行中
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div class="bg-red-600 h-2 rounded-full" style="width: 65%"></div>
              </div>
              <span class="text-sm text-gray-500">65%</span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2024-01-10</td>
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
// 项目管理逻辑
</script>
