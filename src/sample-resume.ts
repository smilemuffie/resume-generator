import type { ResumeDoc } from './types';

// 默认示例简历（首次进入、localStorage 为空时使用）
// zh 与 en 字段一一对应，互为翻译
export const sampleDoc: ResumeDoc = {
  zh: {
    basics: {
      name: '张三',
      label: '前端工程师',
      gender: '男',
      birthDate: '1995-08',
      email: 'zhangsan@example.com',
      phone: '138-0000-0000',
      website: 'https://zhangsan.dev',
      summary: '5 年前端经验，熟练 TypeScript / React / Vite，专注中台架构与工程化提效。',
      highlights: [
        '主导中台前端架构与组件体系建设，沉淀 30+ 通用组件',
        '推动构建体系升级，平均构建速度提升 40%，首屏体积减少 60%',
        '跨团队协作，牵头工程化规范落地，覆盖 20+ 前端项目'
      ],
      location: { city: '上海', region: '中国' },
      profiles: [{ network: 'GitHub', url: 'https://github.com/zhangsan' }]
    },
    work: [
      {
        company: '某科技公司',
        position: '高级前端工程师',
        startDate: '2022-01',
        endDate: '至今',
        summary: '负责中台前端架构与组件体系建设。',
        highlights: ['重构构建系统，构建提速 40%', '搭建组件库，覆盖 30+ 业务页面'],
        stack: ['React', 'TypeScript', 'Vite', 'Node.js']
      },
      {
        company: '某创业公司',
        position: '前端工程师',
        startDate: '2020-07',
        endDate: '2021-12',
        summary: '负责核心产品 Web 端开发。',
        highlights: ['主导性能优化，首屏时间从 3.2s 降至 1.4s'],
        stack: ['Vue', 'JavaScript', 'Webpack']
      }
    ],
    education: [
      {
        institution: '某大学',
        area: '计算机科学与技术',
        studyType: '本科',
        startDate: '2016-09',
        endDate: '2020-06',
        score: '3.8/4.0'
      }
    ],
    skills: [
      { name: '前端', level: '', keywords: ['React', 'Vue', 'Vite', 'TypeScript', 'JavaScript'] },
      { name: '后端', level: '', keywords: ['Node.js', 'Express', 'Python', 'MySQL'] }
    ],
    projects: [
      {
        name: '简历生成器',
        description: '基于 JSON 的简历工具，支持多模板与 PDF 导出。',
        url: 'https://github.com/zhangsan/resume-ge',
        startDate: '2024-01',
        endDate: '2024-06',
        highlights: ['实现多语言编辑与 localStorage 持久化', '支持三套模板与主题色切换'],
        roles: ['前端负责人', '架构设计']
      },
      {
        name: '组件库 Pro',
        description: '面向中台业务的通用 React 组件库，覆盖 30+ 业务场景。',
        url: 'https://github.com/zhangsan/ui-pro',
        startDate: '2022-09',
        endDate: '2023-05',
        highlights: ['按需加载，首屏体积减少 60%', '文档站点与可视化 Playground'],
        roles: ['核心开发']
      }
    ],
    awards: [{ title: '年度最佳员工', date: '2023-12', awarder: '某科技公司', summary: '表彰年度突出贡献与团队协作' }],
    certificates: [
      {
        name: 'PMP 项目管理专业人士认证',
        issuer: 'PMI',
        date: '2023-06',
        url: 'https://www.pmi.org/certification',
        summary: '项目管理方向'
      }
    ],
    languages: [
      { language: '中文', fluency: '母语' },
      { language: '英语', fluency: '流利' }
    ],
    interests: ['开源', 'Vite 插件', '工具链', '阅读', '长跑']
  },
  en: {
    basics: {
      name: 'Zhang San',
      label: 'Frontend Engineer',
      gender: 'Male',
      birthDate: '1995-08',
      email: 'zhangsan@example.com',
      phone: '+86 138-0000-0000',
      website: 'https://zhangsan.dev',
      summary: '5 years of frontend experience, proficient in TypeScript / React / Vite, focused on mid-platform architecture and tooling efficiency.',
      highlights: [
        'Led mid-platform frontend architecture and component system, shipped 30+ reusable components',
        'Upgraded build pipeline, gaining 40% faster builds and 60% smaller first-screen bundle',
        'Drove engineering-wide tooling standards across 20+ frontend projects'
      ],
      location: { city: 'Shanghai', region: 'China' },
      profiles: [{ network: 'GitHub', url: 'https://github.com/zhangsan' }]
    },
    work: [
      {
        company: 'Some Tech Co.',
        position: 'Senior Frontend Engineer',
        startDate: '2022-01',
        endDate: 'Present',
        summary: 'Lead mid-platform frontend architecture and component system.',
        highlights: ['Refactored build system, 40% faster builds', 'Built component library covering 30+ pages'],
        stack: ['React', 'TypeScript', 'Vite', 'Node.js']
      },
      {
        company: 'Some Startup',
        position: 'Frontend Engineer',
        startDate: '2020-07',
        endDate: '2021-12',
        summary: 'Developed the core product web client.',
        highlights: ['Led performance optimization, cutting first paint from 3.2s to 1.4s'],
        stack: ['Vue', 'JavaScript', 'Webpack']
      }
    ],
    education: [
      {
        institution: 'Some University',
        area: 'Computer Science',
        studyType: 'B.Sc.',
        startDate: '2016-09',
        endDate: '2020-06',
        score: '3.8/4.0'
      }
    ],
    skills: [
      { name: 'Frontend', level: '', keywords: ['React', 'Vue', 'Vite', 'TypeScript', 'JavaScript'] },
      { name: 'Backend', level: '', keywords: ['Node.js', 'Express', 'Python', 'MySQL'] }
    ],
    projects: [
      {
        name: 'Resume Generator',
        description: 'A JSON-based resume tool with multiple templates and PDF export.',
        url: 'https://github.com/zhangsan/resume-ge',
        startDate: '2024-01',
        endDate: '2024-06',
        highlights: ['Multilingual editing with localStorage persistence', 'Three templates with theme color switching'],
        roles: ['Frontend Lead', 'Architecture']
      },
      {
        name: 'UI Pro',
        description: 'A general-purpose React component library for mid-platform business, covering 30+ scenarios.',
        url: 'https://github.com/zhangsan/ui-pro',
        startDate: '2022-09',
        endDate: '2023-05',
        highlights: ['On-demand loading, 60% smaller first-screen bundle', 'Docs site with visual Playground'],
        roles: ['Core Developer']
      }
    ],
    awards: [{ title: 'Employee of the Year', date: '2023-12', awarder: 'Some Tech Co.', summary: 'Recognized for outstanding contribution and teamwork' }],
    certificates: [
      {
        name: 'PMP Certification',
        issuer: 'PMI',
        date: '2023-06',
        url: 'https://www.pmi.org/certification',
        summary: 'Project Management'
      }
    ],
    languages: [
      { language: 'Chinese', fluency: 'Native' },
      { language: 'English', fluency: 'Fluent' }
    ],
    interests: ['Open Source', 'Vite Plugins', 'Tooling', 'Reading', 'Running']
  }
};
