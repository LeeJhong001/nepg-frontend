<template>
  <div class="question-management">
    <!-- 统计信息卡片 -->
    <div class="stats-grid mb-6">
      <div class="stat-card">
        <div class="stat-icon bg-blue-100 text-blue-600">
          <DocumentTextIcon class="w-6 h-6" />
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ statistics?.totalQuestions || 0 }}</div>
          <div class="stat-label">题目总数</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon bg-green-100 text-green-600">
          <CheckCircleIcon class="w-6 h-6" />
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ statistics?.activeQuestions || 0 }}</div>
          <div class="stat-label">启用题目</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon bg-yellow-100 text-yellow-600">
          <ExclamationTriangleIcon class="w-6 h-6" />
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ statistics?.inactiveQuestions || 0 }}</div>
          <div class="stat-label">禁用题目</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon bg-purple-100 text-purple-600">
          <ChartBarIcon class="w-6 h-6" />
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ Object.keys(statistics?.typeDistribution || {}).length }}</div>
          <div class="stat-label">题目类型</div>
        </div>
      </div>
    </div>

    <!-- 搜索和筛选工具栏 -->
    <div class="toolbar bg-white rounded-lg shadow-sm p-4 mb-6">
      <div class="flex flex-wrap gap-4 items-center">
        <!-- 搜索框 -->
        <div class="flex-1 min-w-64">
          <input
            v-model="searchKeyword"
            type="text"
            placeholder="搜索题目标题或内容..."
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            @input="handleSearch"
          />
        </div>

        <!-- 分类筛选 -->
        <select
          v-model="filters.categoryId"
          class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          style="font-family: 'Courier New', monospace; font-size: 14px;"
          @change="handleFilter"
        >
          <option value="">全部分类</option>
          <option v-for="category in categories" :key="category.id" :value="category.id">
            {{ category.displayName }}
          </option>
        </select>

        <!-- 题型筛选 -->
        <select
          v-model="filters.type"
          class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          @change="handleFilter"
        >
          <option value="">全部题型</option>
          <option v-for="(label, type) in questionTypeLabels" :key="type" :value="type">
            {{ label }}
          </option>
        </select>

        <!-- 难度筛选 -->
        <select
          v-model="filters.difficulty"
          class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          @change="handleFilter"
        >
          <option value="">全部难度</option>
          <option v-for="(label, level) in difficultyLabels" :key="level" :value="level">
            {{ label }}
          </option>
        </select>

        <!-- 状态筛选 -->
        <select
          v-model="filters.status"
          class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          @change="handleFilter"
        >
          <option value="">全部状态</option>
          <option value="ACTIVE">启用</option>
          <option value="INACTIVE">禁用</option>
        </select>

        <!-- 操作按钮 -->
        <div class="flex gap-2">
          <button
            @click="handleRefresh"
            class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <ArrowPathIcon class="w-4 h-4" />
          </button>
          <button
            @click="handleCreate"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <PlusIcon class="w-4 h-4" />
            新建题目
          </button>
        </div>
      </div>
    </div>

    <!-- 批量操作工具栏 -->
    <div v-if="(selectedQuestions?.length || 0) > 0" class="batch-toolbar bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
      <div class="flex items-center justify-between">
        <div class="text-blue-700">
          已选择 <span class="font-semibold">{{ selectedQuestions?.length || 0 }}</span> 个题目
        </div>
        <div class="flex gap-2">
          <button
            @click="handleBatchDelete"
            class="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors"
          >
            批量删除
          </button>
          <button
            @click="showBatchStatusDialog = true"
            class="px-3 py-1 bg-yellow-600 text-white rounded text-sm hover:bg-yellow-700 transition-colors"
          >
            批量启用/禁用
          </button>
          <button
            @click="showBatchCategoryDialog = true"
            class="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors"
          >
            批量移动分类
          </button>
        </div>
      </div>
    </div>

    <!-- 题目列表表格 -->
    <div class="bg-white rounded-lg shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-4 py-3 text-left">
                <input
                  type="checkbox"
                  :checked="isAllSelected"
                  @change="handleSelectAll"
                  class="rounded border-gray-300"
                />
              </th>
              <th class="px-4 py-3 text-left font-medium text-gray-900">题目标题</th>
              <th class="px-4 py-3 text-left font-medium text-gray-900">题型</th>
              <th class="px-4 py-3 text-left font-medium text-gray-900">难度</th>
              <th class="px-4 py-3 text-left font-medium text-gray-900">分类</th>
              <th class="px-4 py-3 text-left font-medium text-gray-900">分值</th>
              <th class="px-4 py-3 text-left font-medium text-gray-900">状态</th>
              <th class="px-4 py-3 text-left font-medium text-gray-900">创建者</th>
              <th class="px-4 py-3 text-left font-medium text-gray-900">创建时间</th>
              <th class="px-4 py-3 text-left font-medium text-gray-900">操作</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-for="question in questions" :key="question.id" class="hover:bg-gray-50">
              <td class="px-4 py-3">
                <input
                  type="checkbox"
                  :checked="selectedQuestions.includes(question.id)"
                  @change="handleSelectQuestion(question.id)"
                  class="rounded border-gray-300"
                />
              </td>
              <td class="px-4 py-3">
                <div class="max-w-xs truncate" :title="question.title">
                  {{ question.title }}
                </div>
              </td>
              <td class="px-4 py-3">
                <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                      :class="getTypeBadgeClass(question.type)">
                  {{ questionTypeLabels[question.type] }}
                </span>
              </td>
              <td class="px-4 py-3">
                <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                      :class="getDifficultyBadgeClass(question.difficulty)">
                  {{ difficultyLabels[question.difficulty] }}
                </span>
              </td>
              <td class="px-4 py-3 text-sm text-gray-600">{{ question.categoryName }}</td>
              <td class="px-4 py-3 text-sm text-gray-600">{{ question.score }}分</td>
              <td class="px-4 py-3">
                <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                      :class="question.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
                  {{ question.status === 'ACTIVE' ? '启用' : '禁用' }}
                </span>
              </td>
              <td class="px-4 py-3 text-sm text-gray-600">{{ question.createdBy }}</td>
              <td class="px-4 py-3 text-sm text-gray-600">{{ formatDate(question.createdAt) }}</td>
              <td class="px-4 py-3">
                <div class="flex gap-2">
                  <button
                    @click="handleView(question.id)"
                    class="text-blue-600 hover:text-blue-800 transition-colors"
                    title="查看"
                  >
                    <EyeIcon class="w-4 h-4" />
                  </button>
                  <button
                    @click="handleEdit(question.id)"
                    class="text-green-600 hover:text-green-800 transition-colors"
                    title="编辑"
                  >
                    <PencilIcon class="w-4 h-4" />
                  </button>
                  <button
                    @click="handleCopy(question.id)"
                    class="text-purple-600 hover:text-purple-800 transition-colors"
                    title="复制"
                  >
                    <DocumentDuplicateIcon class="w-4 h-4" />
                  </button>
                  <button
                    @click="handleViewUsageHistory(question.id)"
                    class="text-indigo-600 hover:text-indigo-800 transition-colors"
                    title="使用记录"
                  >
                    <ClockIcon class="w-4 h-4" />
                  </button>
                  <button
                    @click="handleDelete(question.id)"
                    class="text-red-600 hover:text-red-800 transition-colors"
                    title="删除"
                  >
                    <TrashIcon class="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 空状态 -->
      <div v-if="(questions?.length || 0) === 0 && !loading" class="text-center py-12">
        <DocumentTextIcon class="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p class="text-gray-500">暂无题目数据</p>
      </div>

      <!-- 加载状态 -->
      <div v-if="loading" class="text-center py-12">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p class="text-gray-500 mt-2">加载中...</p>
      </div>
    </div>

    <!-- 分页 -->
    <div class="flex justify-between items-center mt-6 bg-white rounded-lg shadow-sm p-4">
      <!-- 分页信息 -->
      <div class="text-sm text-gray-700">
        <span v-if="totalElements > 0">
          显示第 {{ (currentPage - 1) * pageSize + 1 }} - {{ Math.min(currentPage * pageSize, totalElements) }} 条，
          共 {{ totalElements }} 条记录
        </span>
        <span v-else>
          暂无数据
        </span>
      </div>
      
      <!-- 分页控件 -->
      <div v-if="totalPages > 0" class="flex items-center space-x-2">
        <!-- 首页 -->
        <button
          @click="handlePageChange(1)"
          :disabled="currentPage === 1"
          class="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          title="首页"
        >
          <ChevronDoubleLeftIcon class="w-4 h-4" />
        </button>
        
        <!-- 上一页 -->
        <button
          @click="handlePageChange(currentPage - 1)"
          :disabled="currentPage === 1"
          class="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          title="上一页"
        >
          <ChevronLeftIcon class="w-4 h-4" />
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
          <ChevronRightIcon class="w-4 h-4" />
        </button>
        
        <!-- 末页 -->
        <button
          @click="handlePageChange(totalPages)"
          :disabled="currentPage === totalPages"
          class="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          title="末页"
        >
          <ChevronDoubleRightIcon class="w-4 h-4" />
        </button>
      </div>
      
              <!-- 每页条数选择 -->
        <div class="flex items-center space-x-2">
          <span class="text-sm text-gray-700">每页</span>
          <select
            v-model="pageSize"
            @change="handlePageSizeChange"
            class="px-2 py-1 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
          <span class="text-sm text-gray-700">条</span>
          
          <!-- 快速跳转 -->
          <span class="text-sm text-gray-700 ml-4">跳转到</span>
          <input
            v-model.number="jumpToPage"
            type="number"
            min="1"
            :max="totalPages"
            class="w-16 px-2 py-1 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            @keyup.enter="handleJumpToPage"
            placeholder="页码"
          />
          <span class="text-sm text-gray-700">页</span>
          <button
            @click="handleJumpToPage"
            class="px-2 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            跳转
          </button>
        </div>
    </div>

    <!-- 通知容器 -->
    <NotificationContainer />

    <!-- 确认对话框 -->
    <ConfirmDialog
      v-model:show="showConfirmDialog"
      :title="confirmDialogTitle"
      :message="confirmDialogMessage"
      :type="confirmDialogType"
      @confirm="handleConfirm"
    />

    <!-- 批量状态更新对话框 -->
    <div v-if="showBatchStatusDialog" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-96">
        <h3 class="text-lg font-semibold mb-4">批量更新状态</h3>
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">选择状态</label>
          <select v-model="batchStatus" class="w-full px-3 py-2 border border-gray-300 rounded-md">
            <option value="ACTIVE">启用</option>
            <option value="INACTIVE">禁用</option>
          </select>
        </div>
        <div class="flex justify-end gap-2">
          <button
            @click="showBatchStatusDialog = false"
            class="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            取消
          </button>
          <button
            @click="handleBatchStatusUpdate"
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            确定
          </button>
        </div>
      </div>
    </div>

    <!-- 批量分类更新对话框 -->
    <div v-if="showBatchCategoryDialog" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-96">
        <h3 class="text-lg font-semibold mb-4">批量移动分类</h3>
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">选择分类</label>
                     <select v-model="batchCategoryId" class="w-full px-3 py-2 border border-gray-300 rounded-md" style="font-family: 'Courier New', monospace; font-size: 14px;">
             <option value="">请选择分类</option>
             <option v-for="category in categories" :key="category.id" :value="category.id">
               {{ category.displayName }}
             </option>
           </select>
        </div>
        <div class="flex justify-end gap-2">
          <button
            @click="showBatchCategoryDialog = false"
            class="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            取消
          </button>
          <button
            @click="handleBatchCategoryUpdate"
            :disabled="!batchCategoryId"
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            确定
          </button>
        </div>
      </div>
    </div>

    <!-- 随机题目对话框 -->
    <div v-if="showRandomDialog" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-96">
        <h3 class="text-lg font-semibold mb-4">获取随机题目</h3>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">题目数量</label>
            <input
              v-model.number="randomConfig.count"
              type="number"
              min="1"
              max="50"
              class="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">分类（可选）</label>
                         <select v-model="randomConfig.categoryId" class="w-full px-3 py-2 border border-gray-300 rounded-md" style="font-family: 'Courier New', monospace; font-size: 14px;">
               <option value="">全部分类</option>
               <option v-for="category in categories" :key="category.id" :value="category.id">
                 {{ category.displayName }}
               </option>
             </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">题型（可选）</label>
            <select v-model="randomConfig.type" class="w-full px-3 py-2 border border-gray-300 rounded-md">
              <option value="">全部题型</option>
              <option v-for="(label, type) in questionTypeLabels" :key="type" :value="type">
                {{ label }}
              </option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">难度（可选）</label>
            <select v-model="randomConfig.difficulty" class="w-full px-3 py-2 border border-gray-300 rounded-md">
              <option value="">全部难度</option>
              <option v-for="(label, level) in difficultyLabels" :key="level" :value="level">
                {{ label }}
              </option>
            </select>
          </div>
        </div>
        <div class="flex justify-end gap-2 mt-6">
          <button
            @click="showRandomDialog = false"
            class="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            取消
          </button>
          <button
            @click="handleGetRandomQuestions"
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            获取
          </button>
        </div>
      </div>
    </div>

    <!-- 使用记录对话框 -->
    <div v-if="showUsageHistoryDialog" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-4/5 max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
        <!-- 对话框头部 -->
        <div class="flex items-center justify-between mb-6">
          <div>
            <h3 class="text-lg font-semibold text-gray-900">题目使用记录</h3>
            <p class="text-sm text-gray-600 mt-1">{{ selectedQuestionTitle }}</p>
          </div>
          <button
            @click="showUsageHistoryDialog = false"
            class="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <!-- 加载状态 -->
        <div v-if="usageHistoryLoading" class="flex items-center justify-center py-12">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span class="ml-3 text-gray-600">加载使用记录中...</span>
        </div>

        <!-- 使用记录内容 -->
        <div v-else class="flex-1 overflow-hidden">
          <!-- 统计概览 -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div class="bg-blue-50 rounded-lg p-4">
              <div class="flex items-center">
                <div class="p-2 bg-blue-100 rounded-lg">
                  <DocumentTextIcon class="w-5 h-5 text-blue-600" />
                </div>
                <div class="ml-3">
                  <p class="text-sm font-medium text-blue-900">总使用次数</p>
                  <p class="text-lg font-semibold text-blue-600">{{ usageHistoryData.length }}</p>
                </div>
              </div>
            </div>
            <div class="bg-green-50 rounded-lg p-4">
              <div class="flex items-center">
                <div class="p-2 bg-green-100 rounded-lg">
                  <CheckCircleIcon class="w-5 h-5 text-green-600" />
                </div>
                <div class="ml-3">
                  <p class="text-sm font-medium text-green-900">考试使用</p>
                  <p class="text-lg font-semibold text-green-600">{{ usageHistoryData.filter(h => h.usageType === 'EXAM').length }}</p>
                </div>
              </div>
            </div>
            <div class="bg-yellow-50 rounded-lg p-4">
              <div class="flex items-center">
                <div class="p-2 bg-yellow-100 rounded-lg">
                  <ClockIcon class="w-5 h-5 text-yellow-600" />
                </div>
                <div class="ml-3">
                  <p class="text-sm font-medium text-yellow-900">练习使用</p>
                  <p class="text-lg font-semibold text-yellow-600">{{ usageHistoryData.filter(h => h.usageType === 'PRACTICE').length }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- 详细记录列表 -->
          <div class="bg-gray-50 rounded-lg p-4 flex-1 overflow-hidden">
            <h4 class="text-md font-medium text-gray-900 mb-4">详细使用记录</h4>
            <div class="overflow-y-auto max-h-80">
              <div v-if="usageHistoryData.length > 0" class="space-y-3">
                <div
                  v-for="record in usageHistoryData"
                  :key="record.id"
                  class="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-sm transition-shadow"
                >
                  <div class="flex items-center justify-between">
                    <div class="flex-1">
                      <div class="flex items-center space-x-3">
                        <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                              :class="record.usageType === 'EXAM' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'">
                          {{ record.usageType === 'EXAM' ? '考试' : '练习' }}
                        </span>
                        <h5 class="text-sm font-medium text-gray-900">{{ record.userName || '未知用户' }}</h5>
                      </div>
                      <div class="mt-2 text-sm text-gray-600">
                        <div class="flex items-center space-x-4">
                          <span>使用时间: {{ formatDate(record.usedAt) }}</span>
                          <span v-if="record.score !== undefined">得分: {{ record.score }}分</span>
                          <span v-if="record.isCorrect !== undefined" 
                                :class="record.isCorrect ? 'text-green-600' : 'text-red-600'">
                            {{ record.isCorrect ? '✓ 正确' : '✗ 错误' }}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div v-else class="text-center py-8">
                <ClockIcon class="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p class="text-gray-500">暂无使用记录</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 对话框底部 -->
        <div class="flex justify-end mt-6 pt-4 border-t border-gray-200">
          <button
            @click="showUsageHistoryDialog = false"
            class="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import {
  DocumentTextIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ChartBarIcon,
  PlusIcon,
  ArrowPathIcon,
  EyeIcon,
  PencilIcon,
  DocumentDuplicateIcon,
  TrashIcon,
  ClockIcon,
  SparklesIcon,
  ArrowUpTrayIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon
} from '@heroicons/vue/24/outline'
import {
  QuestionType,
  DifficultyLevel,
  QuestionStatus
} from '../../types/question'
import type {
  QuestionListItem,
  QuestionQueryParams,
  QuestionListResponse,
  QuestionStatistics
} from '../../types/question'
import { QuestionService } from '../../services/questionService'
import { QuestionCategoryService } from '../../services/questionCategoryService'
import type { QuestionCategory } from '../../types/question'
import { useNotification } from '../../composables/useNotification'
import NotificationContainer from '../../components/NotificationContainer.vue'
import ConfirmDialog from '../../components/ConfirmDialog.vue'

// 路由
const router = useRouter()

// 通知系统
const { success, error, warning } = useNotification()

// 响应式数据
const questions = ref<QuestionListItem[]>([])
const categories = ref<Array<QuestionCategory & { displayName: string }>>([])
const statistics = ref<QuestionStatistics>({
  totalQuestions: 0,
  activeQuestions: 0,
  inactiveQuestions: 0,
  typeDistribution: {} as any,
  difficultyDistribution: {} as any,
  categoryDistribution: []
})

// 分页数据
const currentPage = ref(1)
const pageSize = ref(10)
const totalPages = ref(0)
const totalElements = ref(0)
const jumpToPage = ref<number>()

// 搜索和筛选
const searchKeyword = ref('')
const filters = reactive<QuestionQueryParams>({
  categoryId: undefined,
  type: undefined,
  difficulty: undefined,
  status: undefined
})

// 确保filters对象正确初始化
console.log('Initialized filters:', filters)

// 选择状态
const selectedQuestions = ref<number[]>([])

// 加载状态
const loading = ref(false)

// 对话框状态
const showConfirmDialog = ref(false)
const confirmDialogTitle = ref('')
const confirmDialogMessage = ref('')
const confirmDialogType = ref<'info' | 'warning' | 'danger'>('info')
const confirmCallback = ref<(() => void) | null>(null)

const showBatchStatusDialog = ref(false)
const showBatchCategoryDialog = ref(false)
const showRandomDialog = ref(false)
const showUsageHistoryDialog = ref(false)
const batchStatus = ref<QuestionStatus>('ACTIVE')
const batchCategoryId = ref<number>()
const usageHistoryData = ref<QuestionUsageHistory[]>([])
const usageHistoryLoading = ref(false)
const selectedQuestionTitle = ref('')

// 随机题目配置
const randomConfig = reactive({
  count: 10,
  categoryId: undefined as number | undefined,
  type: undefined as QuestionType | undefined,
  difficulty: undefined as DifficultyLevel | undefined
})

// 计算属性
const isAllSelected = computed(() => {
  return (questions.value?.length || 0) > 0 && (selectedQuestions.value?.length || 0) === (questions.value?.length || 0)
})

// 导入枚举用于模板
const QType = QuestionType
const DLevel = DifficultyLevel  
const QStatus = QuestionStatus

// 题型标签
const questionTypeLabels: Record<QuestionType, string> = {
  [QuestionType.CHOICE]: '选择题',
  [QuestionType.FILL_BLANK]: '填空题',
  [QuestionType.SHORT_ANSWER]: '简答题',
  [QuestionType.PROOF]: '证明题'
}

// 难度标签
const difficultyLabels: Record<DifficultyLevel, string> = {
  [DifficultyLevel.EASY]: '简单',
  [DifficultyLevel.MEDIUM]: '中等',
  [DifficultyLevel.HARD]: '困难'
}



// 将树形分类展平成列表，添加层级显示
const flattenCategories = (categories: QuestionCategory[], level: number = 0): Array<QuestionCategory & { displayName: string }> => {
  const result: Array<QuestionCategory & { displayName: string }> = []
  
  for (const category of categories) {
    if (category.enabled) {
      // 添加缩进表示层级关系
      const indent = '　'.repeat(level) // 使用全角空格作为缩进
      const prefix = level > 0 ? '└ ' : ''
      const displayName = indent + prefix + category.name
      
      result.push({
        ...category,
        displayName
      })
      
      // 递归处理子分类
      if (category.children && category.children.length > 0) {
        result.push(...flattenCategories(category.children, level + 1))
      }
    }
  }
  
  return result
}

const loadCategories = async () => {
  try {
    console.log('Loading categories...')
    const response = await QuestionCategoryService.getCategoryTree()
    console.log('Category tree response:', response)
    // 将树形结构展平为列表
    categories.value = flattenCategories(response)
    console.log('Flattened categories:', categories.value)
  } catch (err: any) {
    console.error('Failed to load categories:', err)
    error('加载分类失败: ' + err.message)
    // 使用模拟数据
    categories.value = flattenCategories(getMockCategories())
  }
}

const loadStatistics = async () => {
  try {
    // 获取所有题目数据来计算统计信息
    const allQuestionsResponse = await QuestionService.getQuestionList({
      page: 1,
      size: 1000, // 获取足够多的数据来计算统计
      keyword: '',
      categoryId: undefined,
      type: undefined,
      difficulty: undefined,
      status: undefined
    })
    
    const allQuestions = allQuestionsResponse.content || []
    
    // 计算统计信息
    const totalQuestions = allQuestions.length
    const activeQuestions = allQuestions.filter(q => q.status === 'ACTIVE').length
    const inactiveQuestions = totalQuestions - activeQuestions
    
    // 计算题型分布
    const typeDistribution: Record<string, number> = {}
    allQuestions.forEach(q => {
      typeDistribution[q.type] = (typeDistribution[q.type] || 0) + 1
    })
    
    // 计算难度分布
    const difficultyDistribution: Record<number, number> = {}
    allQuestions.forEach(q => {
      difficultyDistribution[q.difficulty] = (difficultyDistribution[q.difficulty] || 0) + 1
    })
    
    // 计算分类分布
    const categoryDistribution: Array<{categoryId: number, categoryName: string, count: number}> = []
    const categoryCount: Record<number, {name: string, count: number}> = {}
    allQuestions.forEach(q => {
      if (q.categoryId) {
        if (!categoryCount[q.categoryId]) {
          categoryCount[q.categoryId] = { name: q.categoryName || '未分类', count: 0 }
        }
        categoryCount[q.categoryId].count++
      }
    })
    
    Object.entries(categoryCount).forEach(([categoryId, data]) => {
      categoryDistribution.push({
        categoryId: Number(categoryId),
        categoryName: data.name,
        count: data.count
      })
    })
    
    statistics.value = {
      totalQuestions,
      activeQuestions,
      inactiveQuestions,
      typeDistribution,
      difficultyDistribution,
      categoryDistribution
    }
  } catch (err: any) {
    error('加载统计信息失败: ' + err.message)
    // 使用模拟数据
    statistics.value = getMockStatistics()
  }
}

const handleSearch = () => {
  currentPage.value = 1
  jumpToPage.value = undefined // 清空跳转页码
  loadQuestions()
}

const handleFilter = () => {
  currentPage.value = 1
  jumpToPage.value = undefined // 清空跳转页码
  loadQuestions()
}

const handleRefresh = () => {
  loadQuestions()
  loadStatistics()
}

// 在题目列表更新后重新计算统计信息
const loadQuestions = async () => {
  try {
    loading.value = true
    
    console.log('Loading questions with filters:', filters)
    
    // 确保filters对象存在且属性正确
    const params: QuestionQueryParams = {
      page: currentPage.value,
      size: pageSize.value,
      keyword: searchKeyword.value || undefined,
      categoryId: filters.categoryId || undefined,
      type: filters.type || undefined,
      difficulty: filters.difficulty || undefined,
      status: filters.status || undefined
    }
    
    console.log('Question list params:', params)
    const response = await QuestionService.getQuestionList(params)
    console.log('Question list response:', response)
    
    questions.value = response.content || []
    totalPages.value = response.totalPages || 0
    totalElements.value = response.totalElements || 0
    
    // 更新统计信息
    await loadStatistics()
  } catch (err: any) {
    console.error('Failed to load questions:', err)
    error('加载题目列表失败: ' + err.message)
    // 使用模拟数据
    questions.value = getMockQuestions()
    totalPages.value = 1
    totalElements.value = questions.value.length
  } finally {
    loading.value = false
  }
}

const handlePageChange = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    loadQuestions()
  }
}

const handlePageSizeChange = () => {
  currentPage.value = 1 // 重置到第一页
  loadQuestions()
}

const handleJumpToPage = () => {
  if (jumpToPage.value && jumpToPage.value >= 1 && jumpToPage.value <= totalPages.value) {
    currentPage.value = jumpToPage.value
    loadQuestions()
    jumpToPage.value = undefined // 清空输入框
  } else {
    error('请输入有效的页码')
  }
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

const handleSelectAll = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.checked) {
    selectedQuestions.value = questions.value.map(q => q.id)
  } else {
    selectedQuestions.value = []
  }
}

const handleSelectQuestion = (questionId: number) => {
  const index = selectedQuestions.value.indexOf(questionId)
  if (index > -1) {
    selectedQuestions.value.splice(index, 1)
  } else {
    selectedQuestions.value.push(questionId)
  }
}

const handleView = (id: number) => {
  router.push(`/admin/questions/${id}`)
}

const handleCreate = () => {
  router.push('/admin/questions/create')
}

const handleEdit = (id: number) => {
  router.push(`/admin/questions/${id}/edit`)
}

const handleCopy = async (id: number) => {
  try {
    await QuestionService.copyQuestion(id)
    success('题目复制成功')
    loadQuestions()
  } catch (err: any) {
    error('复制题目失败: ' + err.message)
  }
}

const handleDelete = (id: number) => {
  confirmDialogTitle.value = '确认删除'
  confirmDialogMessage.value = '确定要删除这个题目吗？此操作不可恢复。'
  confirmDialogType.value = 'danger'
  confirmCallback.value = () => deleteQuestion(id)
  showConfirmDialog.value = true
}

const deleteQuestion = async (id: number) => {
  try {
    await QuestionService.deleteQuestion(id)
    success('题目删除成功')
    loadQuestions()
    loadStatistics()
  } catch (err: any) {
    error('删除题目失败: ' + err.message)
  }
}

const handleBatchDelete = () => {
  confirmDialogTitle.value = '确认批量删除'
  confirmDialogMessage.value = `确定要删除选中的 ${selectedQuestions.value.length} 个题目吗？此操作不可恢复。`
  confirmDialogType.value = 'danger'
  confirmCallback.value = () => batchDeleteQuestions()
  showConfirmDialog.value = true
}

const batchDeleteQuestions = async () => {
  try {
    await QuestionService.batchDeleteQuestions({ ids: selectedQuestions.value })
    success('批量删除成功')
    selectedQuestions.value = []
    loadQuestions()
    loadStatistics()
  } catch (err: any) {
    error('批量删除失败: ' + err.message)
  }
}

const handleBatchStatusUpdate = async () => {
  try {
    await QuestionService.batchUpdateStatus({
      ids: selectedQuestions.value,
      status: batchStatus.value
    })
    success('批量更新状态成功')
    selectedQuestions.value = []
    showBatchStatusDialog.value = false
    loadQuestions()
    loadStatistics()
  } catch (err: any) {
    error('批量更新状态失败: ' + err.message)
  }
}

const handleBatchCategoryUpdate = async () => {
  if (!batchCategoryId.value) return
  
  try {
    await QuestionService.batchUpdateCategory({
      ids: selectedQuestions.value,
      categoryId: batchCategoryId.value
    })
    success('批量移动分类成功')
    selectedQuestions.value = []
    showBatchCategoryDialog.value = false
    batchCategoryId.value = undefined
    loadQuestions()
  } catch (err: any) {
    error('批量移动分类失败: ' + err.message)
  }
}

const handleConfirm = () => {
  if (confirmCallback.value) {
    confirmCallback.value()
  }
  showConfirmDialog.value = false
}

const getTypeBadgeClass = (type: QuestionType) => {
  const classes = {
    [QuestionType.CHOICE]: 'bg-blue-100 text-blue-800',
    [QuestionType.FILL_BLANK]: 'bg-green-100 text-green-800',
    [QuestionType.SHORT_ANSWER]: 'bg-yellow-100 text-yellow-800',
    [QuestionType.PROOF]: 'bg-red-100 text-red-800'
  }
  return classes[type]
}

const getDifficultyBadgeClass = (difficulty: DifficultyLevel) => {
  const classes = {
    [DifficultyLevel.EASY]: 'bg-green-100 text-green-800',
    [DifficultyLevel.MEDIUM]: 'bg-yellow-100 text-yellow-800',
    [DifficultyLevel.HARD]: 'bg-red-100 text-red-800'
  }
  return classes[difficulty]
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('zh-CN')
}

const handleViewUsageHistory = async (questionId: number) => {
  try {
    // 找到对应的题目标题
    const question = questions.value.find(q => q.id === questionId)
    selectedQuestionTitle.value = question?.title || `题目 ID: ${questionId}`
    
    // 显示对话框并开始加载
    showUsageHistoryDialog.value = true
    usageHistoryLoading.value = true
    usageHistoryData.value = []
    
    // 获取使用记录数据
    const history = await QuestionService.getQuestionUsageHistory(questionId)
    usageHistoryData.value = history || []
    
    success('使用记录加载成功')
  } catch (err: any) {
    error('获取使用记录失败: ' + err.message)
    // 即使出错也要显示对话框，但显示空状态
    usageHistoryData.value = []
  } finally {
    usageHistoryLoading.value = false
  }
}

const handleRandomQuestions = () => {
  showRandomDialog.value = true
}

const handleGetRandomQuestions = async () => {
  try {
    const randomQuestions = await QuestionService.getRandomQuestions(randomConfig)
    console.log('Random questions:', randomQuestions)
    success(`成功获取 ${randomQuestions.length} 个随机题目`)
    showRandomDialog.value = false
    // 可以在这里显示随机题目列表或进行其他操作
  } catch (err: any) {
    error('获取随机题目失败: ' + err.message)
  }
}

const handleImportQuestions = () => {
  // TODO: 打开导入题目对话框
  console.log('Import questions feature')
  success('导入题目功能暂未实现UI')
}

// 模拟数据
const getMockQuestions = (): QuestionListItem[] => {
  return [
    {
      id: 1,
      title: '什么是Vue.js？',
      type: QuestionType.CHOICE,
      difficulty: DifficultyLevel.EASY,
      categoryId: 1,
      categoryName: '前端开发',
      score: 5,
      status: QuestionStatus.ACTIVE,
      createdBy: 'admin',
      createdAt: '2024-01-15T10:00:00Z'
    },
    {
      id: 2,
      title: '解释Vue.js的响应式原理',
      type: QuestionType.SHORT_ANSWER,
      difficulty: DifficultyLevel.MEDIUM,
      categoryId: 1,
      categoryName: '前端开发',
      score: 10,
      status: QuestionStatus.ACTIVE,
      createdBy: 'teacher1',
      createdAt: '2024-01-16T14:30:00Z'
    }
  ]
}

const getMockCategories = (): QuestionCategory[] => {
  return [
    { id: 1, name: '前端开发', parentId: undefined, description: '前端相关题目', sortOrder: 1, enabled: true, createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
    { id: 2, name: '后端开发', parentId: undefined, description: '后端相关题目', sortOrder: 2, enabled: true, createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' }
  ]
}

const getMockStatistics = (): QuestionStatistics => {
  return {
    totalQuestions: 150,
    activeQuestions: 140,
    inactiveQuestions: 10,
    typeDistribution: {
      [QuestionType.CHOICE]: 80,
      [QuestionType.FILL_BLANK]: 20,
      [QuestionType.SHORT_ANSWER]: 30,
      [QuestionType.PROOF]: 20
    },
    difficultyDistribution: {
      [DifficultyLevel.EASY]: 60,
      [DifficultyLevel.MEDIUM]: 70,
      [DifficultyLevel.HARD]: 20
    },
    categoryDistribution: [
      { categoryId: 1, categoryName: '前端开发', count: 80 },
      { categoryId: 2, categoryName: '后端开发', count: 70 }
    ]
  }
}

// 监听器
watch([currentPage, pageSize], () => {
  loadQuestions()
})

// 生命周期
onMounted(() => {
  loadQuestions()
  loadCategories()
  loadStatistics()
})
</script>

<style scoped>
.question-management {
  @apply p-6;
}

.stats-grid {
  @apply grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6;
}

.stat-card {
  @apply bg-white rounded-lg shadow-sm p-6 flex items-center space-x-4;
}

.stat-icon {
  @apply p-3 rounded-lg;
}

.stat-content {
  @apply flex-1;
}

.stat-value {
  @apply text-2xl font-bold text-gray-900;
}

.stat-label {
  @apply text-sm text-gray-600;
}

.toolbar {
  @apply border border-gray-200;
}

.batch-toolbar {
  @apply border-l-4 border-blue-400;
}

/* 表格样式 */
table {
  @apply min-w-full divide-y divide-gray-200;
}

th {
  @apply text-xs font-medium text-gray-500 uppercase tracking-wider;
}

td {
  @apply whitespace-nowrap;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .toolbar .flex {
    @apply flex-col space-y-4;
  }
  
  .toolbar .flex > div {
    @apply w-full;
  }
}

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

.jump-to-page {
  @apply flex items-center space-x-2;
}
</style>
