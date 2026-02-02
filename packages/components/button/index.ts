import _Button from './src/button.vue';
import { withInstall } from '@vue-nova/utils/with-install';

const Button = withInstall(_Button);

export default Button;

// 添加类型可以在模版中被解析
declare module 'vue' {
  export interface GlobalComponents {
    ZButton: typeof Button;
  }
}

export type { ButtonProps, ButtonEmits } from './src/button';
