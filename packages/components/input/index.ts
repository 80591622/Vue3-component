import _Input from './src/input.vue';
import { withInstall } from '@vue-nova/utils/with-install';

const Input = withInstall(_Input);

export default Input;

// 添加类型可以在模版中被解析
declare module 'vue' {
  export interface GlobalComponents {
    ZInput: typeof Input;
  }
}

export { inputProps, inputEmits } from './src/input';
