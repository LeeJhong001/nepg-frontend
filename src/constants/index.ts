// 路由名称常量
export const ROUTE_NAMES = {
  TEACHER: {
    EXAM_PAPERS: 'teacher-exam-papers',
    EXAM_PAPERS_CREATE: 'teacher-exam-papers-create',
    EXAM_PAPERS_EDIT: 'teacher-exam-papers-edit',
    QUESTIONS: 'teacher-questions',
    QUESTIONS_CREATE: 'teacher-questions-create',
    QUESTIONS_EDIT: 'teacher-questions-edit'
  }
} as const

// 默认配置常量
export const DEFAULT_CONFIG = {
  EXAM_PAPER: {
    DURATION: 120, // 默认考试时长（分钟）
    DIFFICULTY: 'medium' // 默认难度
  }
} as const

