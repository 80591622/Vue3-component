<template>
  <form :class="bem.b()">
    <slot></slot>
  </form>
</template>

<script setup lang="ts">
import { createBEM } from '@vue-nova/utils/bem';
import { FormContextKey, formProps } from './form';
import { provide } from 'vue';

const bem = createBEM('form');
defineOptions({
  name: 'z-form',
});

const props = defineProps(formProps);
const emit = defineEmits();

const context = {
  ...props,
};
provide(FormContextKey, context);
</script>

<style scoped></style>
