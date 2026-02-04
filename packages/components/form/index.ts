import _Form from './src/form.vue';
import _FormItem from './src/formItem.vue';
import { withInstall } from '@vue-nova/utils/with-install';

const Form = withInstall(_Form);
const FormItem = withInstall(_FormItem);

export { Form, FormItem };

export type FormInstance = InstanceType<typeof Form>;
// 添加类型可以在模版中被解析
declare module 'vue' {
  export interface GlobalComponents {
    ZForm: typeof Form;
    ZFormItem: typeof FormItem;
  }
}

export type { FormProps } from './src/form';
export type { FormItemProps } from './src/formItem';
