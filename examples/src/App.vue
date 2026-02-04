<template>
  <h1>VueNova 组件库</h1>
  <z-icon
    :size="30"
    :color="'red'"
  >
    <AddCircleOutline> </AddCircleOutline>
  </z-icon>
  <z-icon
    :size="25"
    :color="'blue'"
  >
    <AccessibilitySharp></AccessibilitySharp>
  </z-icon>
  <z-icon
    :size="40"
    :color="'green'"
  >
    <Albums></Albums>
  </z-icon>

  <h2>格式化数据自定义属性名</h2>
  <z-tree
    :data="treeData"
    label-field="label"
    key-field="key"
    children-field="children"
  >
  </z-tree>

  <h2>展开收缩异步加载</h2>
  <z-tree
    :data="asyncTreeData"
    key-field="key"
    :on-load="handleLoad"
    v-model:selected-keys="value"
    multiple
    selectable
  >
  </z-tree>

  <h2>节点禁用 虚拟滚动列表</h2>
  <z-tree
    :data="virtualTreeData"
    key-field="key"
    :on-load="handleLoad"
    v-model:selected-keys="value"
    multiple
    selectable
  >
    <template #default="{ node }"> {{ node.key }}-{{ node.label }} </template>
  </z-tree>

  <h2>checkbox全选半选</h2>
  <z-tree
    v-model:selected-keys="value"
    :data="checkboxTreeData"
    :on-load="handleLoad"
    selectable
    :show-checkbox="true"
    :default-checked-keys="['c-40']"
  >
    <template #default="{ node }"> {{ node.key }}-{{ node.label }} </template>
  </z-tree>

  <h2>按钮</h2>
  <z-button
    size="medium"
    :round="true"
    type="danger"
    icon-placement="left"
    @click="handleClick"
  >
    <template #icon>
      <z-icon
        :size="25"
        :color="'blue'"
      >
        <AccessibilitySharp></AccessibilitySharp>
      </z-icon>
    </template>
    按钮
  </z-button>

  <h2>输入框</h2>
  {{ username }}
  <z-input
    v-model="username"
    placeholder="请输入密码"
    :show-password="true"
    :clearable="true"
    @focus="handleFocus"
    @blur="handleBlur"
  >
    <template #prepend>哈哈哈</template>
    <template #prefixIcon>
      <z-icon
        :size="25"
        :color="'blue'"
      >
        <AccessibilitySharp></AccessibilitySharp>
      </z-icon>
    </template>
    <!-- <template #suffixIcon>
      <z-icon
        :size="25"
        :color="'blue'"
      >
        <AccessibilitySharp></AccessibilitySharp>
      </z-icon>
    </template> -->
    <template #append>哈哈哈</template>
  </z-input>
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
    >提交</z-button
  >
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { AddCircleOutline, AccessibilitySharp, Albums } from '@vicons/ionicons5';
import type { Key, TreeOption } from '@vue-nova/components/tree/src/tree';
import {
  generateTreeData,
  createLabeledTreeData,
  createDisabledTreeData,
  createAsyncTreeData,
  handleLoad,
} from './mock/treeData';
import type { FormInstance } from '@vue-nova/components/form';

// 为不同的tree组件生成独立的数据，确保数据隔离
// 1. 格式化数据自定义属性名 - 使用独立生成的树数据
const treeData = ref<TreeOption[]>(generateTreeData());

// 2. 展开收缩异步加载 - 使用独立生成的异步树数据
const asyncTreeData = ref<TreeOption[]>(createAsyncTreeData());

// 3. 节点禁用 虚拟滚动列表 - 使用独立生成的树数据
const virtualTreeData = ref<TreeOption[]>(generateTreeData(3, 'v-')); // 使用不同的父键前缀

// 4. checkbox - 使用独立生成的树数据
const checkboxTreeData = ref<TreeOption[]>(generateTreeData(4, 'c-')); // 使用不同的父键前缀

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
// 选中的节点键值
const value = ref<Key[]>([]);

const handleClick = (e: MouseEvent) => {
  console.log(e);
};

const username = ref('');

const handleFocus = (e: FocusEvent) => {
  console.log((e.target as HTMLInputElement).value, 'focus');
};

const handleBlur = (e: FocusEvent) => {
  console.log((e.target as HTMLInputElement).value, 'blur');
};

const state = reactive({
  username: '',
  password: '',
});
</script>

<style scoped></style>
