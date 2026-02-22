# 前端错误处理指南

## 概述

所有前端错误处理都应该显示详细的错误原因，而不是简单的通用错误消息。

## 使用方法

### 1. 导入错误处理工具

```typescript
import { extractErrorMessage, logError } from '@/utils/errorHandler'
```

### 2. 在 catch 块中使用

#### 方式一：使用 logError（推荐）
```typescript
try {
  await someApiCall()
} catch (error) {
  const errorMessage = logError(error, '操作上下文')
  showError(`操作失败: ${errorMessage}`)
}
```

#### 方式二：直接使用 extractErrorMessage
```typescript
try {
  await someApiCall()
} catch (error) {
  const errorMessage = extractErrorMessage(error)
  showError(errorMessage)
}
```

### 3. 错误消息格式

错误处理工具会自动提取：
- 后端返回的详细错误消息（`response.data.message`）
- 错误代码（`response.data.code`）
- 验证错误详情（`response.data.errors`）
- HTTP状态码对应的错误消息

### 4. 示例

**之前的错误处理（不推荐）：**
```typescript
catch (error) {
  showError('操作失败')
}
```

**现在的错误处理（推荐）：**
```typescript
catch (error) {
  const errorMessage = logError(error, '操作名称')
  showError(`操作失败: ${errorMessage}`)
}
```

## 注意事项

1. axios 拦截器已经自动提取错误消息到 `error.message` 和 `error.detailedMessage`
2. 但在 catch 中仍建议使用 `logError` 或 `extractErrorMessage` 以确保一致性
3. 错误消息会包含后端返回的详细原因，例如：
   - "PERMISSION_DENIED: 无权限修改此试卷"
   - "VALIDATION_ERROR: 学科ID不能为空; 分类ID不能为空"

