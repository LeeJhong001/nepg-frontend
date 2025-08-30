import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { UserRole } from '../types/auth'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'

import Teacher from '../views/teacher/index.vue'
import Student from '../views/student/index.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      meta: { requiresAuth: true },
      beforeEnter: (to, from, next) => {
        const authStore = useAuthStore()
        if (authStore.isAuthenticated && authStore.user?.role) {
          // 根据角色重定向到对应页面
          switch (authStore.user.role) {
            case UserRole.ADMIN:
              next('/admin')
              break
            case UserRole.TEACHER:
              next('/teacher')
              break
            case UserRole.STUDENT:
              next('/student')
              break
            default:
              next()
          }
        } else {
          next()
        }
      },
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: { requiresAuth: false },
    },
    {
      path: '/register',
      name: 'register',
      component: Register,
      meta: { requiresAuth: false },
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('../views/admin/AdminLayout.vue'),
      meta: { requiresAuth: true, requiredRole: UserRole.ADMIN },
      children: [
        {
          path: '',
          name: 'admin-dashboard',
          component: () => import('../views/admin/index.vue'),
        },
        {
          path: 'users',
          name: 'admin-users',
          component: () => import('../views/admin/UserManagement.vue'),
        },
        {
          path: 'question-categories',
          name: 'admin-question-categories',
          component: () => import('../views/admin/QuestionCategoryManagement.vue'),
        },
        {
          path: 'questions',
          name: 'admin-questions',
          component: () => import('../views/admin/QuestionManagement.vue'),
        },
        {
          path: 'questions/create',
          name: 'admin-questions-create',
          component: () => import('../views/admin/QuestionForm.vue'),
        },
        {
          path: 'questions/:id/edit',
          name: 'admin-questions-edit',
          component: () => import('../views/admin/QuestionForm.vue'),
        },
        {
          path: 'questions/:id',
          name: 'admin-questions-detail',
          component: () => import('../views/admin/QuestionDetail.vue'),
        },
      ],
    },
    {
      path: '/teacher',
      name: 'teacher',
      component: Teacher,
      meta: { requiresAuth: true, requiredRole: UserRole.TEACHER },
      children: [
        {
          path: '',
          name: 'teacher-dashboard',
          component: () => import('../views/teacher/index.vue'),
        },
        {
          path: 'courses',
          name: 'teacher-courses',
          component: () => import('../views/teacher/CourseManagement.vue'),
        },
      ],
    },
    {
      path: '/student',
      name: 'student',
      component: Student,
      meta: { requiresAuth: true, requiredRole: UserRole.STUDENT },
      children: [
        {
          path: '',
          name: 'student-dashboard',
          component: () => import('../views/student/index.vue'),
        },
        {
          path: 'courses',
          name: 'student-courses',
          component: () => import('../views/student/CourseLearning.vue'),
        },
      ],
    },
  ],
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  // 检查路由是否需要认证
  if (to.meta.requiresAuth) {
    // 需要认证，检查是否已登录
    if (authStore.isAuthenticated) {
      // 检查角色权限
      if (to.meta.requiredRole) {
        const userRole = authStore.user?.role
        if (userRole !== to.meta.requiredRole) {
          next('/')
          return
        }
      }
      next()
    } else {
      // 未登录，重定向到登录页
      next('/login')
    }
  } else {
    // 不需要认证的页面
    if (to.path === '/login' || to.path === '/register') {
      // 如果已登录，重定向到首页
      if (authStore.isAuthenticated) {
        next('/')
      } else {
        next()
      }
    } else {
      next()
    }
  }
})

export default router
