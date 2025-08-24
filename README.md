# PromptBuilder - 可视化拖拽式 Prompt 工作流构建器

一个基于 Next.js 和 React Flow 的可视化 Prompt 工作流构建器，支持通过拖拽节点和连线来构建复杂的 AI 提示词。

## 功能特性

### 🎯 核心功能
- **可视化节点编辑**: 支持10种不同类型的节点（角色、上下文、任务、条件分支等）
- **拖拽连线**: 直观的节点连接，支持条件分支和循环
- **实时预览**: 实时编译和预览生成的提示词
- **自动保存**: 浏览器本地自动保存，防止数据丢失
- **导入导出**: 支持 JSON 格式的项目导入导出

### 🎨 节点类型
1. **角色 (Persona)** - 定义AI助手的角色和特征
2. **上下文 (Context)** - 提供背景信息和场景描述
3. **用户输入 (User Input)** - 用户提供的输入内容
4. **系统消息 (System)** - 系统级别的指令和设置
5. **任务 (Task)** - 具体的任务目标和步骤
6. **条件分支 (If/Else)** - 根据条件进行分支处理
7. **循环 (Loop)** - 重复执行的操作
8. **输出格式 (Format)** - 定义输出的格式和风格
9. **结构化输出 (Structured)** - 定义JSON格式的结构化输出
10. **备注 (Note)** - 添加注释和说明

### 🛠️ 技术栈
- **前端框架**: Next.js 15.5.0
- **画布库**: React Flow
- **状态管理**: Zustand
- **UI组件**: TailwindCSS + 自定义组件
- **图标**: Lucide React
- **类型安全**: TypeScript

## 快速开始

### 安装依赖
```bash
npm install
```

### 启动开发服务器
```bash
npm run dev
```

### 构建生产版本
```bash
npm run build
```

## 使用指南

### 1. 创建节点
- 从左侧节点库中选择节点类型
- 点击节点或拖拽到画布中央
- 节点会自动添加到画布中心位置

### 2. 连接节点
- 点击节点的连接点（左侧输入，右侧输出）
- 拖拽到目标节点创建连线
- 支持条件分支的特殊连线

### 3. 编辑节点属性
- 点击节点选中它
- 在右侧属性面板中编辑字段
- 支持文本、多行文本、选择框、列表等输入类型

### 4. 预览和导出
- 底部预览面板实时显示编译结果
- 支持文本和JSON两种预览模式
- 一键复制生成的提示词
- 导出项目为JSON文件

### 5. 快捷键
- `Delete/Backspace`: 删除选中的节点或连线
- `Ctrl/Cmd + Z`: 撤销
- `Ctrl/Cmd + Shift + Z`: 重做

## 项目结构

```
app/
├── components/
│   ├── canvas/          # 画布相关组件
│   │   ├── flow-canvas.tsx
│   │   └── custom-node.tsx
│   ├── panels/          # 面板组件
│   │   ├── node-library.tsx
│   │   ├── properties-panel.tsx
│   │   └── preview-panel.tsx
│   └── ui/              # 通用UI组件
├── lib/
│   ├── store/           # Zustand状态管理
│   ├── compiler/        # Prompt编译器
│   ├── node-definitions.ts
│   └── utils/
├── types/               # TypeScript类型定义
└── prompt-builder/      # PromptBuilder页面
```

## 开发计划

### 已完成 ✅
- [x] 基础画布和节点系统
- [x] 节点库和节点类型实现
- [x] 拖拽、连线、选中功能
- [x] 基础状态管理
- [x] Prompt编译器实现
- [x] 实时预览面板
- [x] 导出功能 (文本/JSON)
- [x] 自动保存功能
- [x] 删除、撤销/重做
- [x] 快捷键支持

### 计划中 🚧
- [ ] AI Fill 功能（后端API）
- [ ] 测试运行功能
- [ ] 云端保存
- [ ] 项目管理
- [ ] 分享链接
- [ ] 版本历史
- [ ] 多人协作
- [ ] 国际化支持

## 贡献

欢迎提交 Issue 和 Pull Request！

## 许可证

MIT License
