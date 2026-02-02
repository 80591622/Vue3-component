<!-- Switcher.vue -->
<script setup lang="ts">
import { h } from 'vue'

// 定义渲染函数（替代 template）
const renderSwitcher = () => {
  return h('svg', {
    xmlns: 'http://www.w3.org/2000/svg',
    viewBox: '0 0 24 24',
    width: '24',
    height: '24',
    fill: 'currentColor'
  }, [
    h('path', {
      d: 'M12 8l10 8l-10 8z'
    })
  ])
}
</script>

<!-- 用 render 函数替代 template -->
<template>
  <renderSwitcher />
</template>

<style scoped></style>
