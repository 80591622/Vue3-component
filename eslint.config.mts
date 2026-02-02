import type { Linter } from 'eslint';
import eslint from '@eslint/js';
import pluginVue from 'eslint-plugin-vue';
import pluginTs from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import vueParser from 'vue-eslint-parser';
import globals from 'globals';

/**
 * ESLint Flat Config（ESLint 9.x）
 * 适用于：Monorepo + Vue 3 + TypeScript + 组件库
 */
const config: Linter.FlatConfig[] = [
  /**
   * 1️⃣ 基础运行环境配置
   * - ECMAScript 版本
   * - 全局变量
   * - Vue <script setup> 宏声明
   */
  {
    name: 'base-env',
    languageOptions: {
      ecmaVersion: 2025,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,

        // Vue <script setup> 编译期宏
        defineProps: 'readonly',
        defineEmits: 'readonly',
        defineExpose: 'readonly',
        withDefaults: 'readonly'
      }
    }
  },

  /**
   * 2️⃣ ESLint 官方推荐规则
   * - 基础 JS 语法错误
   * - 不涉及框架和 TS
   */
  eslint.configs.recommended,

  /**
   * 3️⃣ Vue 3 SFC 规则
   * - 只作用于 .vue 文件
   * - 使用 vue-eslint-parser
   * - TS parser 仅作为“嵌套解析器”
   */
  {
    name: 'vue-rules',
    files: ['**/*.vue'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        // 让 <script> / <script setup> 支持 TypeScript
        parser: tsParser,
        sourceType: 'module',
        extraFileExtensions: ['.vue']
      }
    },
    plugins: {
      vue: pluginVue
    },
    rules: {
      /* ===== Vue 3 正确性规则（建议开启） ===== */
      'vue/no-unused-vars': 'error',
      'vue/no-mutating-props': 'error',
      'vue/no-reserved-component-names': 'error',
      'vue/no-side-effects-in-computed-properties': 'error',
      'vue/require-render-return': 'error',

      /* ===== 组件库常见约定 ===== */
      'vue/multi-word-component-names': 'off', // 组件库通常允许单词组件名
      'vue/html-self-closing': 'off',
      'vue/max-attributes-per-line': 'off',

      /* ===== 使用 TS 定义 props，因此关闭 ===== */
      'vue/require-default-prop': 'off',
      'vue/require-prop-types': 'off'
    }
  },

  /**
   * 4️⃣ TypeScript 规则
   * ⚠️ 只作用于 .ts / .tsx
   * ⚠️ 绝对不要包含 .vue（否则会破坏模板解析）
   */
  {
    name: 'typescript-rules',
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsParser
    },
    plugins: {
      '@typescript-eslint': pluginTs
    },
    rules: {
      // 禁用 ESLint 自带规则，使用 TS 版本
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],

      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-empty-interface': 'off'
    }
  },

  /**
   * 5️⃣ 通用项目规则
   * - 与框架无关
   */
  {
    name: 'common-rules',
    rules: {
      'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
      'no-debugger': 'warn'
    }
  },

  /**
   * 6️⃣ 忽略文件
   * - 构建产物
   * - 配置文件
   */
  {
    name: 'ignore-files',
    ignores: ['node_modules/', 'dist/', 'coverage/', '*.config.{js,cjs,mjs,ts,mts}']
  }
];

export default config;
