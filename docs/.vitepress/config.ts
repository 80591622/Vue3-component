// .vitepress/config.ts
import type { DefaultTheme } from 'vitepress';
import { defineConfig } from 'vitepress';

// 导航配置（抽离为常量，便于维护）
const nav: DefaultTheme.NavItem[] = [
  {
    text: '指南',
    link: '/guide/installation',
    activeMatch: '/guide/'
  },
  {
    text: '组件',
    link: '/component/icon',
    activeMatch: '/component/'
  }
];

// 侧边栏配置（抽离为常量，便于扩展）
const sidebar: DefaultTheme.Sidebar = {
  '/guide/': [
    {
      text: '指南',
      items: [
        { text: '安装', link: '/guide/installation' },
        { text: '快速开始', link: '/guide/quickStart' }
      ]
    }
  ],
  '/component/': [
    {
      text: '基础组件',
      items: [{ text: 'Icon 图标', link: '/component/icon' }]
    }
  ]
};

// 主题配置（遵循 VitePress 1.x 类型规范）
const themeConfig: DefaultTheme.Config = {
  // 最后更新时间配置（1.x 规范格式）
  lastUpdated: {
    text: '最后更新于'
  },
  // 编辑链接配置
  editLinks: true,
  editLinkText: '编辑此网站',
  // 仓库地址（建议替换为真实的组件库仓库地址）
  repo: 'https://gitee.com/login',
  // 页脚配置
  footer: {
    message: 'Released under the MIT License.',
    copyright: 'Copyright © 2022-present Zi Shui'
  },
  // 导航&侧边栏
  nav,
  sidebar
};

// VitePress 核心配置
export default defineConfig({
  // 站点基础信息
  title: 'Z-UI',
  description: '基于 Vue 3 开发的轻量级组件库',
  // 站点语言（补充最佳实践）
  lang: 'zh-CN',
  // 主题配置
  themeConfig,
  // 构建优化（补充最佳实践）
  build: {
    outDir: '../docs-dist' // 构建输出目录，避免覆盖源码
  },
  // Vite 配置扩展（预留，便于后续添加插件/别名）
  vite: {
    resolve: {
      dedupe: ['vue'] // 避免 Vue 版本冲突
    }
  }
});
