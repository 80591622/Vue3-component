<template>
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
    <template #append>哈哈哈</template>
  </z-input>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { AccessibilitySharp } from '@vicons/ionicons5';

const username = ref('');

const handleFocus = (e: FocusEvent) => {
  console.log((e.target as HTMLInputElement).value, 'focus');
};

const handleBlur = (e: FocusEvent) => {
  console.log((e.target as HTMLInputElement).value, 'blur');
};
</script>

<style scoped></style>
