// 环境配置
export const config = {
  // API基础URL - 使用相对路径，通过Vite代理转发
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || '/api',

  // 应用名称
  appName: 'OEPG 系统',

  // 版本
  version: '1.0.0',

  // 默认超时时间
  timeout: 10000,

  // 是否启用调试模式
  debug: import.meta.env.DEV,
}

// 导出默认配置
export default config
