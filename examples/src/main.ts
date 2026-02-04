import { createApp } from 'vue';
import './style.css';
import App from './App.vue';

import Icon from '@vue-nova/components/icon';
import '@vue-nova/theme-chalk/src/index.scss';
import Tree from '@vue-nova/components/tree';
import Checkbox from '@vue-nova/components/checkbox';
import Button from '@vue-nova/components/button';
import Input from '@vue-nova/components/input';
import { Form, FormItem } from '@vue-nova/components/form';
import Upload from '@vue-nova/components/upload';

const plugins = [Icon, Tree, Checkbox, Button, Input, Form, FormItem, Upload];
const app = createApp(App);

// 全局注册组件
plugins.forEach((plugin) => {
  app.use(plugin);
});

app.mount('#app');
