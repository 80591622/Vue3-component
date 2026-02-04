<template>
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
</template>

<script setup lang="ts">
import { AccessibilitySharp } from '@vicons/ionicons5';

const handleClick = (e: MouseEvent) => {
  console.log(e);
};
</script>

<style scoped></style>
