import _Tree from './src/tree.vue';
import { withInstall } from '@vue-nova/utils/with-install';

const Tree = withInstall(_Tree);

export default Tree; // 可以通过 app.use(Tree) 安装，也可以使用import { treeProps } from '...'

// 添加类型可以在模版中被解析
declare module 'vue' {
  export interface GlobalComponents {
    ZTree: typeof Tree;
  }
}

export * from './src/tree';
