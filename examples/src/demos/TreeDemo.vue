<template>
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
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { Key, TreeOption } from '@vue-nova/components/tree/src/tree';
import {
  generateTreeData,
  createAsyncTreeData,
  handleLoad,
} from '../mock/treeData';

// 为不同的tree组件生成独立的数据，确保数据隔离
// 1. 格式化数据自定义属性名 - 使用独立生成的树数据
const treeData = ref<TreeOption[]>(generateTreeData());

// 2. 展开收缩异步加载 - 使用独立生成的异步树数据
const asyncTreeData = ref<TreeOption[]>(createAsyncTreeData());

// 3. 节点禁用 虚拟滚动列表 - 使用独立生成的树数据
const virtualTreeData = ref<TreeOption[]>(generateTreeData(3, 'v-')); // 使用不同的父键前缀

// 4. checkbox - 使用独立生成的树数据
const checkboxTreeData = ref<TreeOption[]>(generateTreeData(4, 'c-')); // 使用不同的父键前缀

// 选中的节点键值
const value = ref<Key[]>([]);
</script>

<style scoped></style>
