import { withInstall } from '@vue-nova/utils/with-install';
import _Virtual from './src/virtual';

const Tree = withInstall(_Virtual);

export default Tree;

declare module 'vue' {
  export interface GlobalComponents {
    ZVirtualList: typeof _Virtual;
  }
}
