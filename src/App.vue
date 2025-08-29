<script setup lang="ts">
import { onMounted } from 'vue'
import { useAuthStore } from './stores/auth'
import { useRouter } from 'vue-router'
import { UserRole } from './types/auth'

const authStore = useAuthStore()
const router = useRouter()

// 组件挂载时初始化认证状态
onMounted(async () => {
  await authStore.initialize()

  // 如果已认证且有用户信息，根据角色跳转
  if (authStore.isAuthenticated && authStore.user?.role) {
    const currentPath = router.currentRoute.value.path

    // 如果不在对应的角色页面，则跳转
    if (currentPath === '/') {
      switch (authStore.user.role) {
        case UserRole.ADMIN:
          router.push('/admin')
          break
        case UserRole.TEACHER:
          router.push('/teacher')
          break
        case UserRole.STUDENT:
          router.push('/student')
          break
      }
    }
  }
})
</script>

<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style>
#app {
  font-family:
    'Inter',
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    'Roboto',
    'Oxygen',
    'Ubuntu',
    'Cantarell',
    'Fira Sans',
    'Droid Sans',
    'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* 全局样式 */
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 0;
  background-color: #f9fafb;
}
</style>
