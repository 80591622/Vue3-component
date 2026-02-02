// 组件相关属性和ts类型定义

import { ExtractPublicPropTypes, PropType } from 'vue';

export const iconProps = {
  color: String,
  size: [Number, String] as PropType<number | string>
} as const;

export type IconProps = ExtractPublicPropTypes<typeof iconProps>;
