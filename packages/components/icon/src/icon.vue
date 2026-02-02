<template>
  <i :class="bem.b()" :style="style">
    <slot></slot>
  </i>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { createBEM } from '@vue-nova/utils/bem';
import { iconProps } from './icon';

const bem = createBEM('z-icon');

defineOptions({
  name: 'z-icon',
});

const props = defineProps(iconProps);

const style = computed(() => {
  if (!props.size && !props.color) return {};
  return {
    ...(props.size ? { "font-size": props.size + "px" } : {}),
    ...(props.color ? { color: props.color } : {}),
  };
})
</script>
