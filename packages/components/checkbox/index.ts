import _Checkbox from './src/checkbox.vue';
import { withInstall } from '@vue-nova/utils/with-install';

const Checkbox = withInstall(_Checkbox);

export default Checkbox;

// 添加类型可以在模版中被解析
declare module 'vue' {
  export interface GlobalComponents {
    ZCheckbox: typeof Checkbox;
  }
}

export * from './src/checkbox';
