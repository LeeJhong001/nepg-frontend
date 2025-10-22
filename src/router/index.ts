import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { UserRole } from '../types/auth'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'

import TeacherLayout from '../views/teacher/TeacherLayout.vue'
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
      component: TeacherLayout,
      meta: { requiresAuth: true, requiredRole: UserRole.TEACHER },
      children: [
        {
          path: '',
          name: 'teacher-dashboard',
          component: () => import('../views/teacher/Dashboard.vue'),
        },
        // 考试管理
        {
          path: 'exams',
          name: 'teacher-exams',
          component: () => import('../views/teacher/exams/ExamList.vue'),
        },
        {
          path: 'exams/create',
          name: 'teacher-exams-create',
          component: () => import('../views/teacher/exams/ExamForm.vue'),
        },
        {
          path: 'exams/:id',
          name: 'teacher-exams-detail',
          component: () => import('../views/teacher/exams/ExamDetail.vue'),
        },
        {
          path: 'exams/:id/edit',
          name: 'teacher-exams-edit',
          component: () => import('../views/teacher/exams/ExamForm.vue'),
        },
        {
          path: 'exams/:id/statistics',
          name: 'teacher-exams-statistics',
          component: () => import('../views/teacher/exams/ExamStatistics.vue'),
        },
        // 试卷管理
        {
          path: 'exam-papers',
          name: 'teacher-exam-papers',
          component: () => import('../views/teacher/exam-papers/ExamPaperList.vue'),
        },
        {
          path: 'exam-papers/create',
          name: 'teacher-exam-papers-create',
          component: () => import('../views/teacher/exam-papers/ExamPaperForm.vue'),
        },
        {
          path: 'exam-papers/generate',
          name: 'teacher-exam-papers-generate',
          component: () => import('../views/teacher/exam-papers/ExamPaperGenerate.vue'),
        },
        {
          path: 'exam-papers/:id',
          name: 'teacher-exam-papers-detail',
          component: () => import('../views/teacher/exam-papers/ExamPaperDetail.vue'),
        },
        {
          path: 'exam-papers/:id/edit',
          name: 'teacher-exam-papers-edit',
          component: () => import('../views/teacher/exam-papers/ExamPaperForm.vue'),
        },
        {
          path: 'exam-papers/:id/preview',
          name: 'teacher-exam-papers-preview',
          component: () => import('../views/teacher/exam-papers/ExamPaperPreview.vue'),
        },
        {
          path: 'exam-papers/:id/questions',
          name: 'teacher-exam-papers-questions',
          component: () => import('../views/teacher/exam-papers/ExamPaperQuestions.vue'),
        },
        // 题库管理
        {
          path: 'questions',
          name: 'teacher-questions',
          component: () => import('../views/teacher/questions/QuestionList.vue'),
        },
        {
          path: 'questions/create',
          name: 'teacher-questions-create',
          component: () => import('../views/teacher/questions/QuestionForm.vue'),
        },
        {
          path: 'questions/:id',
          name: 'teacher-questions-detail',
          component: () => import('../views/teacher/questions/QuestionDetail.vue'),
        },
        {
          path: 'questions/:id/edit',
          name: 'teacher-questions-edit',
          component: () => import('../views/teacher/questions/QuestionForm.vue'),
        },
        // 分类管理
        {
          path: 'categories',
          name: 'teacher-categories',
          component: () => import('../views/teacher/categories/CategoryList.vue'),
        },
      ],
    },
    {
      path: '/student',
      name: 'student',
      component: () => import('../views/student/StudentLayout.vue'),
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
        // 学生考试功能
        {
          path: 'exams',
          name: 'student-exams',
          component: () => import('../views/student/ExamsAvailable.vue'),
        },
        {
          path: 'exams/:examId/take',
          name: 'student-exams-take',
          component: () => import('../views/student/TakeExam.vue'),
        },
        {
          path: 'records',
          name: 'student-records',
          component: () => import('../views/student/RecordsList.vue'),
        },
        {
          path: 'records/:recordId',
          name: 'student-record-detail',
          component: () => import('../views/student/RecordDetail.vue'),
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
