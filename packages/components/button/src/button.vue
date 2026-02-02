<template>
  <div>
    <button
      :class="[
        bem.b(),
        bem.m(type),
        bem.m(size),
        bem.is('round', round),
        bem.is('loading', loading),
        bem.is('disabled', disabled),
      ]"
      :type="nativeType"
      :disabled="disabled || loading"
      @click="emitClick"
      @mousedown="emitMousedown"
    >
      <template v-if="iconPlacement === 'left'">
        <z-icon v-if="loading || slots.icon">
          <LoadingComponents v-if="loading"></LoadingComponents>
          <template v-else-if="slots.icon">
            <component :is="slots.icon"></component>
          </template>
        </z-icon>
      </template>
      <slot></slot>
      <template v-if="iconPlacement === 'right'">
        <z-icon v-if="loading || slots.icon">
          <LoadingComponents v-if="loading"></LoadingComponents>
          <template v-else-if="slots.icon">
            <component :is="slots.icon"></component>
          </template>
        </z-icon>
      </template>
    </button>
  </div>
</template>

<script setup lang="ts">
import { createBEM } from '@vue-nova/utils/bem';
import { buttonEmits, buttonProps } from './button';
import LoadingComponents from '@vue-nova/components/internalIcon/Loading.vue';
import ZIcon from '@vue-nova/components/icon';
import { useSlots } from 'vue';

const bem = createBEM('button');
defineOptions({
  name: 'z-button',
  inheritAttrs: false,
});
const props = defineProps(buttonProps);
const emit = defineEmits(buttonEmits);

const slots = useSlots();

const emitClick = (e: MouseEvent) => {
  emit('click', e);
};

const emitMousedown = (e: MouseEvent) => {
  emit('mousedown', e);
};
</script>

<style scoped></style>
