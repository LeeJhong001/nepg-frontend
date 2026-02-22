/**
 * 错误处理工具函数
 * 统一处理API错误，提取并显示详细的错误信息
 */

export interface ApiError {
  response?: {
    status: number
    data?: {
      code?: string
      message?: string
      errors?: Record<string, string>
      [key: string]: any
    }
  }
  message?: string
  request?: any
  config?: any
}

/**
 * 从错误对象中提取详细的错误消息
 */
export function extractErrorMessage(error: ApiError | any): string {
  // 如果没有错误对象，返回默认消息
  if (!error) {
    return '发生未知错误，请稍后重试'
  }

  // 处理网络错误（ERR_NETWORK）
  if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
    return '无法连接到服务器，请检查：\n1. 后端服务是否已启动\n2. 网络连接是否正常\n3. 服务器地址是否正确'
  }

  // 如果有响应数据，优先使用响应中的错误信息
  if (error?.response?.data) {
    const data = error.response.data
    const status = error.response.status

    // 1. 优先使用后端返回的详细错误消息
    if (data.message) {
      let message = data.message

      // 对于某些错误代码，去掉代码前缀，只显示消息
      // 因为这些错误消息本身已经足够清晰
      if (data.code && ['INSUFFICIENT_QUESTIONS', 'NO_QUESTIONS_GENERATED', 'INVALID_RULE'].includes(data.code)) {
        // 直接使用消息，不添加错误代码前缀
        return message
      }

      // 如果有错误代码，也显示出来（其他错误类型）
      if (data.code) {
        message = `${data.code}: ${message}`
      }

      // 如果有详细的验证错误信息，追加显示
      if (data.errors && typeof data.errors === 'object') {
        const errorDetails = Object.values(data.errors)
          .filter((msg): msg is string => typeof msg === 'string')
          .join('; ')
        if (errorDetails) {
          message += ` (${errorDetails})`
        }
      }

      return message
    }

    // 2. 根据HTTP状态码返回相应的错误消息
    switch (status) {
      case 400:
        return '请求数据无效，请检查表单填写是否正确'
      case 401:
        return '未授权，请重新登录'
      case 403:
        // 403错误时，尝试从响应中获取详细原因
        if (data.code) {
          return `无权限执行此操作 (${data.code})`
        }
        return '无权限执行此操作'
      case 404:
        return '请求的资源不存在'
      case 422:
        return '请求数据格式错误，请检查输入'
      case 429:
        return '请求过于频繁，请稍后再试'
      case 500:
      case 502:
      case 503:
        return '服务器错误，请稍后重试'
      default:
        return `请求失败 (状态码: ${status})`
    }
  }

  // 3. 如果是网络错误（请求已发出但没有收到响应）
  if (error?.request) {
    return '网络连接失败，请检查网络连接后重试'
  }

  // 4. 使用错误对象的message属性
  if (error?.message) {
    // 如果message中已经包含错误代码前缀，尝试去掉
    const message = error.message
    if (message.includes(': ')) {
      const parts = message.split(': ')
      const code = parts[0]
      const msg = parts.slice(1).join(': ')
      // 对于某些错误代码，只显示消息部分
      if (['INSUFFICIENT_QUESTIONS', 'NO_QUESTIONS_GENERATED', 'INVALID_RULE'].includes(code)) {
        return msg
      }
    }
    return message
  }

  // 5. 默认错误消息
  return '发生未知错误，请稍后重试'
}

/**
 * 记录错误到控制台（用于调试）
 */
export function logError(error: ApiError | any, context?: string) {
  const prefix = context ? `[${context}]` : '[Error]'
  
  console.error(`${prefix} 错误对象:`, error)
  console.error(`${prefix} 错误类型:`, error?.constructor?.name)
  console.error(`${prefix} 错误消息:`, error?.message)
  
  if (error?.response) {
    console.error(`${prefix} HTTP响应错误:`)
    console.error(`  状态码:`, error.response.status)
    console.error(`  状态文本:`, error.response.statusText)
    console.error(`  响应数据:`, error.response.data)
    console.error(`  请求URL:`, error.config?.url)
    console.error(`  请求方法:`, error.config?.method)
    console.error(`  请求数据:`, error.config?.data)
  } else if (error?.request) {
    console.error(`${prefix} 网络请求错误: 请求已发出但没有收到响应`)
    console.error(`  请求配置:`, error.config)
  } else {
    console.error(`${prefix} 其他错误:`, error)
  }
  
  // 提取并显示最终的错误消息
  const errorMessage = extractErrorMessage(error)
  console.error(`${prefix} 最终错误消息:`, errorMessage)
  
  return errorMessage
}

