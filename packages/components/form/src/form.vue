<template>
  <form :class="bem.b()">
    <slot></slot>
  </form>
</template>

<script setup lang="ts">
import { createBEM } from '@vue-nova/utils/bem';
import { FormContext, FormContextKey, formProps } from './form';
import { provide } from 'vue';
import { FormItemContext } from './formItem';
import { Values } from 'async-validator';

const bem = createBEM('form');
defineOptions({
  name: 'z-form',
});

const props = defineProps(formProps);
const emit = defineEmits();

const fields: FormItemContext[] = []; // 父级收集子集
// form校验在父级中调用所有子集的校检方法
const validate = async (callack?: (valid: boolean, fields?: Values) => void) => {
  let errors: Values = {};
  for (const field of fields) {
    try {
      await field.validate('');
    } catch (error) {
      errors = {
        ...errors,
        ...(error as Values).fields,
      };
    }
  }
  // 没有错误就成功，有错误就失败
  if (Object.keys(errors).length === 0) {
    return callack?.(true);
  } else {
    if (callack) {
      callack?.(false, errors);
    } else {
      return Promise.reject(errors);
    }
  }
};

const addField: FormContext['addField'] = (context) => {
  fields.push(context);
};

const context = {
  ...props,
  addField,
};
provide(FormContextKey, context);

defineExpose({
  validate,
});
</script>

<style scoped></style>
