import _Icon from './src/icon.vue';
import { withInstall } from '@vue-nova/utils/with-install';

const Icon = withInstall(_Icon);

export default Icon; // 可以通过 app.use(Icon) 安装，也可以使用import { iconProps } from '...'

// 添加类型可以在模版中被解析
declare module 'vue' {
  export interface GlobalComponents {
    ZIcon: typeof Icon;
  }
}
