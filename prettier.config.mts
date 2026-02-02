import type { Config } from 'prettier';

/**
 * Prettier 配置文件（TypeScript 版本）
 * 更详细的配置可参考：https://prettier.io/docs/en/options.html
 */
const config: Config = {
  // 代码行宽度
  printWidth: 100,

  // Tab 宽度
  tabWidth: 2,

  // 使用空格而不是制表符
  useTabs: false,

  // 在语句末尾添加分号
  semi: true,

  // 使用单引号而不是双引号
  singleQuote: true,

  // 在对象和数组中添加尾随逗号
  trailingComma: 'es5',

  // 在箭头函数参数周围添加括号
  arrowParens: 'always',

  // 在对象字面量中的括号之间添加空格
  bracketSpacing: true,

  // HTML、Vue、JSX 中的空格敏感性
  htmlWhitespaceSensitivity: 'css',

  // 使用 LF 作为行尾
  endOfLine: 'lf',

  // 散文换行方式
  proseWrap: 'preserve',

  // 每个属性独占一行
  singleAttributePerLine: true,
};

export default config;
