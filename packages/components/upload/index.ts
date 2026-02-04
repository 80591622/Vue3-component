import _Upload from './src/upload.vue';
import { withInstall } from '@vue-nova/utils/with-install';

const Upload = withInstall(_Upload);

export default Upload; // 可以通过 app.use(Tree) 安装，也可以使用import { treeProps } from '...'

// 添加类型可以在模版中被解析
declare module 'vue' {
  export interface GlobalComponents {
    ZUpload: typeof Upload;
  }
}

export * from './src/upload';
