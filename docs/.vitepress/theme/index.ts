import type { App } from 'vue'; // 导入 App 类型
import DefaultTheme from 'vitepress/theme';
import ZIcon from '@vue-nova/components/icon';
import '@vue-nova/theme-chalk/src/index.scss';

export default {
  ...DefaultTheme,
  // 为 app 添加 App 类型注解
  enhanceApp({ app }: { app: App }) {
    // 推荐用 component 注册组件（更符合组件注册规范）
    app.component('ZIcon', ZIcon);
  }
};
