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

    <!-- 页面标题和统计信息 -->
    <div class="mb-6">
      <div class="flex justify-between items-center">
        <div>
          <h2 class="text-2xl font-bold text-gray-900">用户管理</h2>
          <p class="text-gray-600">管理系统中的所有用户账户</p>
          <div v-if="!loading && users.length > 0 && !usingMockData" class="mt-2">
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
          <div v-else-if="!loading && users.length > 0 && usingMockData" class="mt-2">
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
        <div v-if="statistics" class="text-sm text-gray-600">
          <span class="mr-4">总计: {{ statistics.totalUsers }}</span>
          <span v-if="users.length > 0" class="mr-4">当前页: {{ users.length }}</span>
        </div>
      </div>
    </div>

    <!-- 操作栏 -->
    <div class="bg-white shadow rounded-lg p-6 mb-6">
      <div class="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div class="flex flex-col sm:flex-row gap-4 flex-1">
          <!-- 搜索框 -->
          <div class="flex-1">
            <input
              v-model="searchParams.username"
              type="text"
              placeholder="搜索用户名..."
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              @keyup.enter="loadUsers"
            />
          </div>
          <div class="flex-1">
            <input
              v-model="searchParams.realName"
              type="text"
              placeholder="搜索真实姓名..."
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              @keyup.enter="loadUsers"
            />
          </div>
      <div class="flex-1">
        <input
              v-model="searchParams.email"
          type="text"
              placeholder="搜索邮箱..."
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              @keyup.enter="loadUsers"
        />
      </div>
          
          <!-- 筛选器 -->
      <select
            v-model="searchParams.role"
            class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            @change="loadUsers"
      >
        <option value="">所有角色</option>
        <option value="STUDENT">学生</option>
        <option value="TEACHER">教师</option>
        <option value="ADMIN">管理员</option>
      </select>
          
          <select
            v-model="searchParams.status"
            class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            @change="loadUsers"
          >
            <option value="">所有状态</option>
            <option value="ACTIVE">活跃</option>
            <option value="INACTIVE">禁用</option>
          </select>
        </div>
        
        <!-- 操作按钮 -->
        <div class="flex gap-2">
          <button
            @click="clearSearch"
            class="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
          >
            清除
          </button>
          <button
            @click="loadUsers"
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            搜索
          </button>
          <button
            @click="showCreateModal = true"
            class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            <svg class="w-4 h-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            新建用户
          </button>
          <button
            v-if="selectedUsers.length > 0"
            @click="showBatchDeleteConfirm"
            class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            批量删除 ({{ selectedUsers.length }})
          </button>
        </div>
      </div>
    </div>

    <!-- 用户列表 -->
    <div class="bg-white shadow rounded-lg">
      <div class="p-6">
        <div v-if="loading" class="text-center py-8">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p class="mt-2 text-gray-500">加载中...</p>
        </div>
        
        <div v-else-if="users.length === 0" class="text-center py-8">
          <div class="text-gray-400 mb-2">
            <svg class="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
            </svg>
          </div>
          <p class="text-gray-500 mb-2">暂无用户数据</p>
          <button
            @click="clearSearch"
            class="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
          >
            清除筛选条件
          </button>
        </div>
        
        <div v-else class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
                <th class="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    :checked="isAllSelected"
                    @change="toggleAllSelection"
                    class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" @click="sortBy('username')">
                  用户信息
                  <span v-if="searchParams.sortField === 'username'">
                    {{ searchParams.sortOrder === 'asc' ? '↑' : '↓' }}
                  </span>
            </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" @click="sortBy('role')">
              角色
                  <span v-if="searchParams.sortField === 'role'">
                    {{ searchParams.sortOrder === 'asc' ? '↑' : '↓' }}
                  </span>
            </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" @click="sortBy('status')">
              状态
                  <span v-if="searchParams.sortField === 'status'">
                    {{ searchParams.sortOrder === 'asc' ? '↑' : '↓' }}
                  </span>
            </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" @click="sortBy('createdAt')">
              注册时间
                  <span v-if="searchParams.sortField === 'createdAt'">
                    {{ searchParams.sortOrder === 'asc' ? '↑' : '↓' }}
                  </span>
            </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              操作
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="user in users" :key="user.id" :class="{ 'bg-blue-50': selectedUsers.includes(user.id) }">
                <td class="px-6 py-4 whitespace-nowrap">
                  <input
                    type="checkbox"
                    :checked="selectedUsers.includes(user.id)"
                    @change="toggleUserSelection(user.id)"
                    class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <div class="flex-shrink-0 h-10 w-10">
                      <div class="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <span class="text-gray-600 font-medium">{{ getAvatarText(user.realName) }}</span>
                  </div>
                </div>
                <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900">{{ user.realName }}</div>
                      <div class="text-sm text-gray-500">{{ user.username }}</div>
                      <div class="text-sm text-gray-500">{{ user.email }}</div>
                </div>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="getRoleClass(user.role)" class="inline-flex px-2 py-1 text-xs font-semibold rounded-full">
                    {{ user.roleDisplayName || getRoleDisplayName(user.role) }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="getStatusClass(user.status)" class="inline-flex px-2 py-1 text-xs font-semibold rounded-full">
                    {{ user.statusDisplayName || getStatusDisplayName(user.status) }}
              </span>
            </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDate(user.createdAt) }}
                </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div class="flex space-x-2">
                    <button
                      @click="editUser(user)"
                      class="text-blue-600 hover:text-blue-900"
                      title="编辑"
                    >
                      编辑
                    </button>
                    <button
                      @click="showResetPasswordModal(user)"
                      class="text-yellow-600 hover:text-yellow-900"
                      title="重置密码"
                    >
                      重置密码
                    </button>
                    <button
                      @click="toggleUserStatus(user)"
                      :class="user.status === 'ACTIVE' ? 'text-orange-600 hover:text-orange-900' : 'text-green-600 hover:text-green-900'"
                      :title="user.status === 'ACTIVE' ? '禁用用户' : '启用用户'"
                    >
                      {{ user.status === 'ACTIVE' ? '禁用' : '启用' }}
                    </button>
                    <button
                      @click="deleteUser(user)"
                      class="text-red-600 hover:text-red-900"
                      title="删除"
                    >
                      删除
                    </button>
                  </div>
            </td>
          </tr>
        </tbody>
      </table>
        </div>

        <!-- 分页 -->
        <div v-if="pagination && pagination.total > 0" class="mt-6 flex items-center justify-between">
          <div class="text-sm text-gray-700">
            显示第 {{ (pagination.current - 1) * pagination.size + 1 }} 至 
            {{ Math.min(pagination.current * pagination.size, pagination.total) }} 条，
            共 {{ pagination.total }} 条记录
          </div>
          <div class="flex space-x-2">
            <button
              @click="changePage(pagination.current - 1)"
              :disabled="!pagination.hasPrevious"
              :class="pagination.hasPrevious ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-gray-300 text-gray-500'"
              class="px-3 py-2 rounded-md text-sm"
            >
              上一页
            </button>
            <span class="px-3 py-2 text-sm text-gray-700">
              第 {{ pagination.current }} 页，共 {{ pagination.pages }} 页
            </span>
            <button
              @click="changePage(pagination.current + 1)"
              :disabled="!pagination.hasNext"
              :class="pagination.hasNext ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-gray-300 text-gray-500'"
              class="px-3 py-2 rounded-md text-sm"
            >
              下一页
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 创建/编辑用户模态框 -->
    <div v-if="showCreateModal || showEditModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50" @click="closeUserModal">
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white" @click.stop>
        <div class="mt-3">
          <h3 class="text-lg font-medium text-gray-900 mb-4">
            {{ showEditModal ? '编辑用户' : '新建用户' }}
          </h3>
          <form @submit.prevent="submitUserForm">
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">用户名 *</label>
                <input
                  v-model="userForm.username"
                  type="text"
                  required
                  :disabled="showEditModal"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                  placeholder="请输入用户名"
                />
              </div>

              <div v-if="!showEditModal">
                <label class="block text-sm font-medium text-gray-700 mb-1">密码 *</label>
                <input
                  v-model="userForm.password"
                  type="password"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="请输入密码"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">真实姓名 *</label>
                <input
                  v-model="userForm.realName"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="请输入真实姓名"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">邮箱 *</label>
                <input
                  v-model="userForm.email"
                  type="email"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="请输入邮箱地址"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">角色 *</label>
                <select
                  v-model="userForm.role"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">请选择角色</option>
                  <option value="STUDENT">学生</option>
                  <option value="TEACHER">教师</option>
                  <option value="ADMIN">管理员</option>
                </select>
              </div>

              <div v-if="showEditModal">
                <label class="block text-sm font-medium text-gray-700 mb-1">状态</label>
                <select
                  v-model="userForm.status"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="ACTIVE">激活</option>
                  <option value="INACTIVE">禁用</option>
                </select>
              </div>
            </div>

            <div class="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                @click="closeUserModal"
                class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                取消
              </button>
              <button
                type="submit"
                :disabled="submitting"
                class="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {{ submitting ? '处理中...' : (showEditModal ? '更新' : '创建') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- 重置密码模态框 -->
    <div v-if="showPasswordModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50" @click="closePasswordModal">
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white" @click.stop>
        <div class="mt-3">
          <h3 class="text-lg font-medium text-gray-900 mb-4">重置用户密码</h3>
          <form @submit.prevent="submitPasswordForm">
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">用户</label>
                <p class="text-sm text-gray-600">{{ resetPasswordUser?.realName }} ({{ resetPasswordUser?.username }})</p>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">新密码 *</label>
                <input
                  v-model="passwordForm.newPassword"
                  type="password"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="请输入新密码"
                />
              </div>
            </div>

            <div class="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                @click="closePasswordModal"
                class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                取消
              </button>
              <button
                type="submit"
                :disabled="submitting"
                class="px-4 py-2 bg-yellow-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-yellow-700 disabled:opacity-50"
              >
                {{ submitting ? '处理中...' : '重置密码' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { UserService } from '../../services/userService'
import NotificationContainer from '../../components/NotificationContainer.vue'
import ConfirmDialog from '../../components/ConfirmDialog.vue'
import { useNotification } from '../../composables/useNotification'
import type {
  UserInfoResponse,
  UserListResponse,
  UserQueryParams,
  UserPageResponse,
  CreateUserRequest,
  UpdateUserRequest,
  ResetPasswordRequest,
  UserStatistics,
  UserRole,
  UserStatus,
} from '../../types/auth'

const { success, error, warning } = useNotification()

// 响应式数据
const loading = ref(false)
const submitting = ref(false)
const users = ref<UserListResponse[]>([])
const pagination = ref<UserPageResponse | null>(null)
const statistics = ref<UserStatistics | null>(null)
const selectedUsers = ref<number[]>([])
const usingMockData = ref(false) // 标记是否使用模拟数据

// 模态框状态
const showCreateModal = ref(false)
const showEditModal = ref(false)
const showPasswordModal = ref(false)
const editingUser = ref<UserListResponse | null>(null)
const resetPasswordUser = ref<UserListResponse | null>(null)

// 搜索参数
const searchParams = reactive<UserQueryParams>({
  current: 1,
  size: 10,
  username: '',
  realName: '',
  email: '',
  role: undefined,
  status: undefined,
  sortField: 'createdAt',
  sortOrder: 'desc',
})

// 用户表单
const userForm = reactive<CreateUserRequest & { status?: UserStatus }>({
  username: '',
  password: '',
  realName: '',
  email: '',
  role: 'STUDENT' as UserRole,
  status: 'ACTIVE' as UserStatus,
})

// 密码表单
const passwordForm = reactive<ResetPasswordRequest>({
  newPassword: '',
})

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

// 计算属性
const isAllSelected = computed(() => {
  return users.value.length > 0 && selectedUsers.value.length === users.value.length
})

// 组件挂载
onMounted(() => {
  loadUsers()
  loadStatistics()
})

// 监听分页变化
watch(() => searchParams.current, () => {
  loadUsers()
})

// 模拟用户数据
const getMockUsers = () => {
  return {
    records: [
      {
        id: 1,
        username: 'admin',
        realName: '系统管理员',
        email: 'admin@example.com',
        role: 'ADMIN' as UserRole,
        roleDisplayName: '管理员',
        status: 'ACTIVE' as UserStatus,
        statusDisplayName: '激活',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 2,
        username: 'teacher1',
        realName: '张老师',
        email: 'teacher1@example.com',
        role: 'TEACHER' as UserRole,
        roleDisplayName: '教师',
        status: 'ACTIVE' as UserStatus,
        statusDisplayName: '激活',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 3,
        username: 'student1',
        realName: '李同学',
        email: 'student1@example.com',
        role: 'STUDENT' as UserRole,
        roleDisplayName: '学生',
        status: 'ACTIVE' as UserStatus,
        statusDisplayName: '激活',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 4,
        username: 'student2',
        realName: '王同学',
        email: 'student2@example.com',
        role: 'STUDENT' as UserRole,
        roleDisplayName: '学生',
        status: 'INACTIVE' as UserStatus,
        statusDisplayName: '禁用',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ],
    total: 4,
    size: 10,
    current: 1,
    pages: 1,
    hasPrevious: false,
    hasNext: false,
  }
}

// 加载用户列表
const loadUsers = async () => {
  try {
    loading.value = true
    // 过滤空值参数
    const params = Object.fromEntries(
      Object.entries(searchParams).filter(([, value]) => value !== '' && value !== undefined)
    )
    const response = await UserService.getUserList(params)
    pagination.value = response
    users.value = response.records
    selectedUsers.value = [] // 清空选择
    usingMockData.value = false
  } catch (err: any) {
    console.error('API请求失败，使用模拟数据:', err)
    warning('后端连接失败', '使用模拟数据进行演示')
    // 使用模拟数据作为降级方案
    const mockData = getMockUsers()
    pagination.value = mockData
    users.value = mockData.records
    selectedUsers.value = []
    usingMockData.value = true
  } finally {
    loading.value = false
  }
}

// 加载统计信息
const loadStatistics = async () => {
  try {
    statistics.value = await UserService.getUserStatistics()
  } catch (err: any) {
    console.error('获取统计信息失败，使用模拟数据:', err)
    // 使用模拟统计数据
    statistics.value = {
      totalUsers: 4,
    }
  }
}

// 清除搜索条件
const clearSearch = () => {
  searchParams.username = ''
  searchParams.realName = ''
  searchParams.email = ''
  searchParams.role = undefined
  searchParams.status = undefined
  searchParams.current = 1
  loadUsers()
}

// 排序
const sortBy = (field: string) => {
  if (searchParams.sortField === field) {
    searchParams.sortOrder = searchParams.sortOrder === 'asc' ? 'desc' : 'asc'
  } else {
    searchParams.sortField = field
    searchParams.sortOrder = 'asc'
  }
  loadUsers()
}

// 分页
const changePage = (page: number) => {
  if (page >= 1 && pagination.value && page <= pagination.value.pages) {
    searchParams.current = page
  }
}

// 选择用户
const toggleUserSelection = (userId: number) => {
  const index = selectedUsers.value.indexOf(userId)
  if (index > -1) {
    selectedUsers.value.splice(index, 1)
  } else {
    selectedUsers.value.push(userId)
  }
}

// 全选/取消全选
const toggleAllSelection = () => {
  if (isAllSelected.value) {
    selectedUsers.value = []
  } else {
    selectedUsers.value = users.value.map(user => user.id)
  }
}

// 创建用户
const submitUserForm = async () => {
  try {
    submitting.value = true
    
    if (showEditModal.value && editingUser.value) {
      // 更新用户
      const updateData: UpdateUserRequest = {
        realName: userForm.realName,
        email: userForm.email,
        role: userForm.role,
        status: userForm.status,
      }
      
      await UserService.updateUser(editingUser.value.id, updateData)
      success('更新成功', `用户"${userForm.realName}"已成功更新`)
    } else {
      // 创建用户
      const createData: CreateUserRequest = {
        username: userForm.username,
        password: userForm.password,
        realName: userForm.realName,
        email: userForm.email,
        role: userForm.role,
      }
      
      await UserService.createUser(createData)
      success('创建成功', `用户"${userForm.realName}"已成功创建`)
    }
    
    closeUserModal()
    loadUsers()
    loadStatistics()
  } catch (err: any) {
    error(showEditModal.value ? '更新失败' : '创建失败', err.message)
  } finally {
    submitting.value = false
  }
}

// 编辑用户
const editUser = (user: UserListResponse) => {
  editingUser.value = user
  userForm.username = user.username
  userForm.password = ''
  userForm.realName = user.realName
  userForm.email = user.email
  userForm.role = user.role
  userForm.status = user.status || 'ACTIVE'
  showEditModal.value = true
}

// 删除用户
const deleteUser = (user: UserListResponse) => {
  showConfirmDialog(
    '删除用户',
    `确定要删除用户"${user.realName} (${user.username})"吗？删除后无法恢复。`,
    async () => {
      try {
        await UserService.deleteUser(user.id)
        success('删除成功', `用户"${user.realName}"已成功删除`)
        loadUsers()
        loadStatistics()
      } catch (err: any) {
        error('删除失败', err.message)
      }
    },
    'danger',
    '删除',
    '取消'
  )
}

// 批量删除用户
const showBatchDeleteConfirm = () => {
  showConfirmDialog(
    '批量删除用户',
    `确定要删除选中的 ${selectedUsers.value.length} 个用户吗？删除后无法恢复。`,
    async () => {
      try {
        await UserService.batchDeleteUsers({ ids: selectedUsers.value })
        success('批量删除成功', `已成功删除 ${selectedUsers.value.length} 个用户`)
        selectedUsers.value = []
        loadUsers()
        loadStatistics()
      } catch (err: any) {
        error('批量删除失败', err.message)
      }
    },
    'danger',
    '删除',
    '取消'
  )
}

// 切换用户状态
const toggleUserStatus = (user: UserListResponse) => {
  const action = user.status === 'ACTIVE' ? '禁用' : '启用'
  showConfirmDialog(
    `${action}用户`,
    `确定要${action}用户"${user.realName} (${user.username})"吗？`,
    async () => {
      try {
        await UserService.toggleUserStatus(user.id)
        success(`${action}成功`, `用户"${user.realName}"已${action}`)
        loadUsers()
        loadStatistics()
      } catch (err: any) {
        error(`${action}失败`, err.message)
      }
    },
    'warning',
    action,
    '取消'
  )
}

// 显示重置密码模态框
const showResetPasswordModal = (user: UserListResponse) => {
  resetPasswordUser.value = user
  passwordForm.newPassword = ''
  showPasswordModal.value = true
}

// 重置密码
const submitPasswordForm = async () => {
  if (!resetPasswordUser.value) return
  
  try {
    submitting.value = true
    await UserService.resetUserPassword(resetPasswordUser.value.id, passwordForm)
    success('重置成功', `用户"${resetPasswordUser.value.realName}"的密码已重置`)
    closePasswordModal()
  } catch (err: any) {
    error('重置失败', err.message)
  } finally {
    submitting.value = false
  }
}

// 关闭用户模态框
const closeUserModal = () => {
  showCreateModal.value = false
  showEditModal.value = false
  editingUser.value = null
  resetUserForm()
}

// 关闭密码模态框
const closePasswordModal = () => {
  showPasswordModal.value = false
  resetPasswordUser.value = null
  passwordForm.newPassword = ''
}

// 重置用户表单
const resetUserForm = () => {
  userForm.username = ''
  userForm.password = ''
  userForm.realName = ''
  userForm.email = ''
  userForm.role = 'STUDENT'
  userForm.status = 'ACTIVE'
}

// 工具函数
const getAvatarText = (name: string) => {
  return name ? name.charAt(0).toUpperCase() : '?'
}

const getRoleDisplayName = (role: UserRole) => {
  const roleMap = {
    STUDENT: '学生',
    TEACHER: '教师',
    ADMIN: '管理员',
  }
  return roleMap[role] || role
}

const getStatusDisplayName = (status?: UserStatus | string) => {
  const statusMap = {
    ACTIVE: '激活',
    INACTIVE: '禁用',
  }
  return statusMap[status as keyof typeof statusMap] || status || '未知'
}

const getRoleClass = (role: UserRole) => {
  const classMap = {
    STUDENT: 'bg-blue-100 text-blue-800',
    TEACHER: 'bg-green-100 text-green-800',
    ADMIN: 'bg-purple-100 text-purple-800',
  }
  return classMap[role] || 'bg-gray-100 text-gray-800'
}

const getStatusClass = (status?: UserStatus | string) => {
  const classMap = {
    ACTIVE: 'bg-green-100 text-green-800',
    INACTIVE: 'bg-red-100 text-red-800',
  }
  return classMap[status as keyof typeof classMap] || 'bg-gray-100 text-gray-800'
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
}
</script>
