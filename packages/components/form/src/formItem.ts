// form-item 这里用来定义 formItem 中所需要的属性
// prop 校验的输入框对应的表单字段名（与 form 的 model 字段对应）
// label 属性 输入框的标题文本
// rules 表单输入框的校验规则（数组形式，支持多条规则）
// show-message 是否显示错误提示信息：默认true
// change / blur 事件：输入框值变化/失焦时触发（用于触发表单校验）
import type { RuleItem } from 'async-validator';
import { ExtractPropTypes, InjectionKey, PropType } from 'vue';

export type MaybeArray<T> = T | T[];

export interface FormItemRule extends RuleItem {
  trigger?: MaybeArray<string>;
}

export const formItemValidateState = ['success', 'error', ''] as const;
export type FormItemValidateState = (typeof formItemValidateState)[number];

export const formItemProps = {
  prop: String,
  label: String,
  rules: [Object, Array] as PropType<MaybeArray<FormItemRule>>,
  showMessage: {
    type: Boolean,
    default: true,
  },
} as const;

export type FormItemProps = Partial<ExtractPropTypes<typeof formItemProps>>;

export interface FormItemContext extends FormItemProps {
  validate: (trigger: string, callBack?: (isValid: boolean) => void) => Promise<any>;
}

export const FormItemContextKey: InjectionKey<FormItemContext> = Symbol();
