/**
 * =========================
 * BEM 命名工具（Vue 3 + TS）
 * 优化：自动给 block 补全 z- 前缀，使 createBEM('tree') === createBEM('z-tree')
 * =========================
 *
 * 规则：
 *  - block            => z-tree（传入 'tree' 自动补 z-，传入 'z-tree' 直接使用）
 *  - element          => z-tree__icon
 *  - modifier         => z-tree--primary
 *  - element-modifier => z-tree__icon--large
 *
 * 适用场景：
 *  - Vue 3 组件库
 *  - TS / TSX
 *  - Design System
 */

/**
 * modifier 允许的值类型
 * - true        => 启用该 modifier
 * - string/num  => modifier-name-value
 * - false/null  => 忽略
 */
export type Modifier = string | number | boolean | null | undefined;

/**
 * 多 modifier 集合
 * key   => modifier 名
 * value => modifier 值
 */
export type Modifiers = Record<string, Modifier>;

/** BEM 分隔符 */
const ELEMENT_SEPARATOR = '__'; // 元素分隔符
const MODIFIER_SEPARATOR = '--'; // 修饰符分隔符
const BLOCK_PREFIX = 'z-'; // 统一的 block 前缀

/**
 * 处理 block 名称：自动补全 z- 前缀
 * @param block 原始 block 名称（如 'tree' / 'z-tree'）
 * @returns 补全前缀后的 block 名称（如 'z-tree'）
 */
function normalizeBlock(block: string): string {
  // 如果 block 已包含 z- 前缀，直接返回；否则补全前缀
  return block.startsWith(BLOCK_PREFIX) ? block : `${BLOCK_PREFIX}${block}`;
}

/**
 * 判断 modifier 是否应当生效
 * @param value modifier 的值
 * @returns 布尔值：是否生效
 */
function isTruthy(value: Modifier): boolean {
  return value !== false && value !== null && value !== undefined;
}

/**
 * 将 modifier 转换为最终字符串
 *
 * @example
 * normalizeModifier('primary', true)  => 'primary'
 * normalizeModifier('size', 'large')  => 'size-large'
 * normalizeModifier('disabled', false) => null
 */
function normalizeModifier(name: string, value: Modifier): string | null {
  if (!isTruthy(value)) return null;
  return value === true ? name : `${name}-${value}`;
}

/**
 * BEM 实例的类型定义（宽松泛型，支持任意字符串传参）
 *
 * B => block（自动补 z- 前缀）
 * E => element（元素名）
 * M => modifier（修饰符名）
 */
export type BEM = {
  /** 获取纯 block 类名（如 z-tree） */
  b: () => string;

  /** 获取 block__element 类名（如 z-tree__icon） */
  e: (element?: string) => string;

  /** 获取 block--modifier 类名（如 z-tree--primary） */
  m: (modifier?: string) => string;

  /**
   * 获取 block__element 类名或 block-element__element 类名（无 element 时返回 block）
   */
  be: (element?: string, subElement?: string) => string;

  /** 获取 block--modifier 类名（无 modifier 时返回 block） */
  bm: (modifier?: string) => string;

  /** 获取 block__element--modifier 类名（如 z-tree__icon--large） */
  em: (element: string, modifier: string) => string;

  /** 完整 bem 类名（em 方法的语义别名） */
  bem: (element: string, modifier: string) => string;

  /** 状态类名：is-active / is-disabled（组件库常用） */
  is: (name: string, state?: boolean) => string;

  /** 批量生成 modifier 类名（如 z-tree--primary z-tree--size-large） */
  mods: (mods?: Record<string, Modifier>) => string;
};

/**
 * 创建 BEM 工具实例（核心：自动补全 z- 前缀）
 *
 * @example
 * const bem1 = createBEM('tree')   // 生成 z-tree 相关类名
 * const bem2 = createBEM('z-tree') // 生成 z-tree 相关类名（和 bem1 效果一致）
 * bem1.e('node') === bem2.e('node') // true → z-tree__node
 */
export function createBEM(block: string): BEM {
  // 第一步：标准化 block 名称，自动补 z- 前缀
  const normalizedBlock = normalizeBlock(block);

  /**
   * 获取纯 block 类名
   * @returns 补全前缀的 block 名（如 z-tree）
   */
  const b = () => normalizedBlock;

  /**
   * 生成 block__element 类名
   * @param element 元素名（可选）
   * @returns 带元素的类名，无 element 时返回空字符串
   */
  const e = (element?: string) =>
    element ? `${normalizedBlock}${ELEMENT_SEPARATOR}${element}` : '';

  /**
   * 生成 block--modifier 类名
   * @param modifier 修饰符名（可选）
   * @returns 带修饰符的类名，无 modifier 时返回空字符串
   */
  const m = (modifier?: string) =>
    modifier ? `${normalizedBlock}${MODIFIER_SEPARATOR}${modifier}` : '';

  /**
   * 生成 block__element 类名或 block-element__element 类名
   * @param element 元素名或扩展的block名（可选）
   * @param subElement 子元素名（可选）
   * @returns 带元素的类名，无 element 时返回 block
   */
  const be = (element?: string, subElement?: string) => {
    if (!element) return normalizedBlock;
    if (!subElement) return `${normalizedBlock}${ELEMENT_SEPARATOR}${element}`;
    return `${normalizedBlock}-${element}${ELEMENT_SEPARATOR}${subElement}`;
  };

  /**
   * 生成 block--modifier 类名（无 modifier 时返回 block）
   * @param modifier 修饰符名（可选）
   * @returns 带修饰符的类名或纯 block 名
   */
  const bm = (modifier?: string) =>
    modifier ? `${normalizedBlock}${MODIFIER_SEPARATOR}${modifier}` : normalizedBlock;

  /**
   * 生成完整的 block__element--modifier 类名
   * @param element 元素名
   * @param modifier 修饰符名
   * @returns 完整的 BEM 类名
   */
  const em = (element: string, modifier: string) =>
    `${normalizedBlock}${ELEMENT_SEPARATOR}${element}${MODIFIER_SEPARATOR}${modifier}`;

  /**
   * em 方法的语义别名，生成完整 BEM 类名
   * @param element 元素名
   * @param modifier 修饰符名
   * @returns 完整的 BEM 类名
   */
  const bem = (element: string, modifier: string) => em(element, modifier);

  /**
   * 生成状态类名（非标准 BEM，但组件库常用）
   * @param name 状态名（如 active/disabled）
   * @param state 状态是否生效（默认 true）
   * @returns 状态类名（如 is-active），状态不生效时返回空字符串
   */
  const is = (name: string, state = true) => (state ? `is-${name}` : '');

  /**
   * 批量生成多个 modifier 类名
   * @param mods 修饰符键值对
   * @returns 空格分隔的 modifier 类名，无有效修饰符时返回空字符串
   *
   * @example
   * bem.mods({
   *   primary: true,
   *   size: 'large',
   *   disabled: false,
   * }) => 'z-tree--primary z-tree--size-large'
   */
  const mods = (mods?: Record<string, Modifier>) => {
    if (!mods) return '';

    return (
      Object.entries(mods)
        // 转换每个 modifier 为标准格式
        .map(([key, value]) => normalizeModifier(key, value))
        // 过滤掉无效的 modifier（null/undefined/false）
        .filter((v): v is string => Boolean(v))
        // 拼接为 block--modifier 格式
        .map((m) => `${normalizedBlock}${MODIFIER_SEPARATOR}${m}`)
        // 多个 modifier 用空格分隔
        .join(' ')
    );
  };

  // 返回 BEM 实例，包含所有生成类名的方法
  return {
    b,
    e,
    m,
    be,
    bm,
    em,
    bem,
    is,
    mods,
  };
}
