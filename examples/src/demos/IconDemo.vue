<template>
  <h2>图标</h2>
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
</template>

<script setup lang="ts">
import { AddCircleOutline, AccessibilitySharp, Albums } from '@vicons/ionicons5';
</script>

<style scoped></style>
