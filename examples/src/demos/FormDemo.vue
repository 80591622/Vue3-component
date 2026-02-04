<template>
  <h2>表单</h2>
  <z-form
    ref="formRef"
    :model="state"
    :rules="{
      username: {
        min: 6,
        max: 10,
        message: '用户名6-10位',
        trigger: ['change', 'blur'],
      },
    }"
  >
    <z-form-item
      label="请输入用户名"
      prop="username"
      :rules="[{ required: true, message: '请输入用户名', trigger: 'blur' }]"
    >
      <z-input
        placeholder="请输入用户名"
        v-model="state.username"
      ></z-input>
      <template #label> 用户名 </template>
    </z-form-item>

    <z-form-item
      label="请输入密码"
      prop="password"
      :rules="[{ required: true, message: '请输入密码', trigger: 'blur' }]"
    >
      <z-input
        type="password"
        placeholder="请输入密码"
        v-model="state.password"
      ></z-input>
      <template #label> 密码 </template>
    </z-form-item>
  </z-form>
  <z-button
    @click="validate"
    style="margin-top: 10px"
    size="medium"
    type="primary"
    :round="true"
  >
    提交
  </z-button>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import type { FormInstance } from '@vue-nova/components/form';

const formRef = ref<FormInstance>();
const validate = () => {
  formRef.value
    ?.validate()
    .then(() => {
      console.log('验证通过');
    })
    .catch(() => {
      console.log('验证失败');
    });
};

const state = reactive({
  username: '',
  password: '',
});
</script>

<style scoped></style>
