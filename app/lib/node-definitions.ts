import { NodeDefinition } from '../types';

export const NODE_DEFINITIONS: Record<string, NodeDefinition> = {
  persona: {
    type: 'persona',
    label: '角色',
    description: '定义AI助手的角色和特征',
    icon: 'User',
    color: 'bg-blue-500',
    fields: [
      {
        key: 'name',
        label: '角色名称',
        type: 'text',
        placeholder: '例如：Senior Copywriter',
        required: true,
        compile: true
      },
      {
        key: 'goals',
        label: '目标',
        type: 'list',
        placeholder: '输入目标，按回车添加',
        required: true,
        compile: true
      },
      {
        key: 'tone',
        label: '语调',
        type: 'select',
        options: ['professional', 'friendly', 'casual', 'formal', 'creative'],
        required: true,
        compile: true
      },
      {
        key: 'constraints',
        label: '约束条件',
        type: 'textarea',
        placeholder: '可选的约束条件...',
        required: false,
        compile: true
      }
    ],
    template: 'You are {{name}}. Goals: {{goals}}. Tone: {{tone}}. {{constraints}}'
  },

  context: {
    type: 'context',
    label: '上下文',
    description: '提供背景信息和场景描述',
    icon: 'FileText',
    color: 'bg-green-500',
    fields: [
      {
        key: 'background',
        label: '背景信息',
        type: 'textarea',
        placeholder: '详细描述背景情况...',
        required: true,
        compile: true
      },
      {
        key: 'audience',
        label: '目标受众',
        type: 'text',
        placeholder: '例如：B2B客户、学生等',
        required: false,
        compile: true
      },
      {
        key: 'references',
        label: '参考资料',
        type: 'list',
        placeholder: '输入参考资料链接或说明',
        required: false,
        compile: true
      }
    ],
    template: 'Context: {{background}} Audience: {{audience}} {{references}}'
  },

  userInput: {
    type: 'userInput',
    label: '用户输入',
    description: '用户提供的输入内容',
    icon: 'MessageSquare',
    color: 'bg-purple-500',
    fields: [
      {
        key: 'prompt',
        label: '用户提示',
        type: 'textarea',
        placeholder: '用户的具体需求或问题...',
        required: true,
        compile: true
      }
    ],
    template: 'User Input: {{prompt}}'
  },

  system: {
    type: 'system',
    label: '系统消息',
    description: '系统级别的指令和设置',
    icon: 'Settings',
    color: 'bg-orange-500',
    fields: [
      {
        key: 'content',
        label: '系统内容',
        type: 'textarea',
        placeholder: '系统指令或设置...',
        required: true,
        compile: true
      }
    ],
    template: '[System] {{content}}'
  },

  task: {
    type: 'task',
    label: '任务',
    description: '具体的任务目标和步骤',
    icon: 'Target',
    color: 'bg-red-500',
    fields: [
      {
        key: 'objective',
        label: '任务目标',
        type: 'text',
        placeholder: '一句话描述任务目标',
        required: true,
        compile: true
      },
      {
        key: 'steps',
        label: '执行步骤',
        type: 'list',
        placeholder: '输入执行步骤，按回车添加',
        required: true,
        compile: true
      }
    ],
    template: 'Task: {{objective}} Steps: {{steps}}'
  },

  ifElse: {
    type: 'ifElse',
    label: '条件分支',
    description: '根据条件进行分支处理',
    icon: 'GitBranch',
    color: 'bg-yellow-500',
    fields: [
      {
        key: 'conditionExpr',
        label: '条件表达式',
        type: 'text',
        placeholder: '例如：用户类型 == "VIP"',
        required: true,
        compile: true
      }
    ],
    template: 'IF({{conditionExpr}}):\n  <branch-if>\nELSE:\n  <branch-else>'
  },

  loop: {
    type: 'loop',
    label: '循环',
    description: '重复执行的操作',
    icon: 'Repeat',
    color: 'bg-indigo-500',
    fields: [
      {
        key: 'times',
        label: '循环次数',
        type: 'text',
        placeholder: '例如：3 或 "until success"',
        required: true,
        compile: true
      }
    ],
    template: 'LOOP({{times}}):\n  <body>'
  },

  format: {
    type: 'format',
    label: '输出格式',
    description: '定义输出的格式和风格',
    icon: 'Type',
    color: 'bg-pink-500',
    fields: [
      {
        key: 'style',
        label: '输出风格',
        type: 'select',
        options: ['plain', 'markdown', 'bullets', 'essay', 'code'],
        required: true,
        compile: true
      },
      {
        key: 'length',
        label: '输出长度',
        type: 'select',
        options: ['tight', 'medium', 'detailed'],
        required: true,
        compile: true
      }
    ],
    template: 'Output as {{style}}, length {{length}}'
  },

  structured: {
    type: 'structured',
    label: '结构化输出',
    description: '定义JSON格式的结构化输出',
    icon: 'Database',
    color: 'bg-teal-500',
    fields: [
      {
        key: 'schema',
        label: 'JSON Schema',
        type: 'textarea',
        placeholder: '定义JSON结构...',
        required: true,
        compile: true
      }
    ],
    template: 'Return ONLY valid JSON matching schema: {{schema}}'
  },

  note: {
    type: 'note',
    label: '备注',
    description: '添加注释和说明',
    icon: 'StickyNote',
    color: 'bg-gray-500',
    fields: [
      {
        key: 'text',
        label: '备注内容',
        type: 'textarea',
        placeholder: '添加备注或说明...',
        required: true,
        compile: false
      }
    ],
    template: ''
  }
};
