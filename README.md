# OEPG 前端系统

这是一个基于 Vue 3 + TypeScript + Tailwind CSS 的前端项目，提供完整的用户认证系统。

## 功能特性

- 🔐 用户登录/注册系统
- 🛡️ JWT Token 认证
- 🎨 现代化的 UI 设计（Tailwind CSS）
- 📱 响应式设计
- 🔄 状态管理（Pinia）
- 🚀 路由守卫和权限控制
- 🌐 跨域支持

## 用户角色

系统支持三种用户角色：

1. **STUDENT - 学生**
   - 默认角色（注册时自动设置为学生）
   - 适合参加考试的用户
   - 基础权限

2. **TEACHER - 教师**
   - 可以创建和管理考试、试卷
   - 具有教学管理权限
   - 管理学生和考试

3. **ADMIN - 管理员**
   - 系统最高权限
   - 可以管理所有用户、科目、考试等
   - 系统配置和管理

## 技术栈

- **前端框架**: Vue 3
- **开发语言**: TypeScript
- **样式框架**: Tailwind CSS v4
- **状态管理**: Pinia
- **路由**: Vue Router 4
- **HTTP 客户端**: Axios
- **构建工具**: Vite

## 项目结构

```
src/
├── components/          # 公共组件
├── views/              # 页面组件
│   ├── Home.vue        # 首页
│   ├── Login.vue       # 登录页
│   └── Register.vue    # 注册页
├── stores/             # 状态管理
│   └── auth.ts         # 认证状态
├── services/           # 服务层
│   └── authService.ts  # 认证服务
├── types/              # 类型定义
│   └── auth.ts         # 认证相关类型
├── config/             # 配置文件
│   └── index.ts        # 应用配置
├── router/             # 路由配置
│   └── index.ts        # 路由定义
└── style.css           # 全局样式
```

## 快速开始

### 安装依赖

```bash
npm install
```

### 开发环境运行

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

### 预览生产版本

```bash
npm run preview
```

## 环境配置

创建 `.env.local` 文件并配置以下环境变量：

```env
# API配置
VITE_API_BASE_URL=http://localhost:8080/api

# 应用配置
VITE_APP_NAME=OEPG 系统
VITE_APP_VERSION=1.0.0
```

## API 接口

### 认证接口

- `POST /api/auth/login` - 用户登录
- `POST /api/auth/register` - 用户注册
- `GET /api/auth/test` - 测试认证状态

### 请求格式

#### 登录请求

```json
{
  "username": "用户名",
  "password": "密码"
}
```

#### 注册请求

```json
{
  "username": "用户名",
  "email": "邮箱",
  "password": "密码",
  "role": "STUDENT"
}
```

## 跨域配置

前端已配置跨域支持，后端需要在 `AuthController` 中添加 `@CrossOrigin(origins = "*")` 注解。

## 开发指南

### 添加新页面

1. 在 `src/views/` 目录下创建新的 Vue 组件
2. 在 `src/router/index.ts` 中添加路由配置
3. 根据需要添加路由守卫

### 添加新功能

1. 在 `src/services/` 目录下创建相应的服务
2. 在 `src/types/` 目录下定义相关类型
3. 在 `src/stores/` 目录下管理状态

### 样式开发

项目使用 Tailwind CSS v4，可以通过以下方式添加样式：

- 使用 Tailwind 工具类
- 在 `src/style.css` 中添加自定义样式
- 使用 `@apply` 指令组合 Tailwind 类

## 部署

### 构建

```bash
npm run build
```

### 部署到服务器

将 `dist` 目录下的文件部署到 Web 服务器即可。

## 注意事项

1. 确保后端服务运行在正确的端口（默认 8080）
2. 检查 CORS 配置是否正确
3. 确保 JWT Token 的密钥配置一致
4. 生产环境请修改 API 基础 URL
5. 用户注册时默认角色为 STUDENT

## 许可证

MIT License
