<template>
  <label :class="bem.b()">
    <span :class="bem.e('input')">
      <input ref="inputRef" v-model="model" type="checkbox" :disabled="disabled" :value="label"
        @change="handleChange"></input>
    </span>
    <span v-if="$slots.default || label">
      <slot></slot>
      <template v-if="!$slots.default">
        {{ label }}
      </template>

    </span>
  </label>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { checkboxEmits, checkboxProps } from './checkbox';
import { createBEM } from '@vue-nova/utils/bem';

defineOptions({
  name: 'z-checkbox',
});

const bem = createBEM('checkbox');

const props = defineProps(checkboxProps);

const emit = defineEmits(checkboxEmits);

const inputRef = ref<HTMLInputElement>();

const model = computed<any>({
  get(): any {
    return props.modelValue;
  },
  set(val) {
    return emit('update:modelValue', val);
  }
})

function indeterminate(val: boolean) {
  return inputRef.value!.indeterminate = val;
}

function handleChange(e: Event) {
  console.log(inputRef.value!.checked, '====');
  const target = e.target as HTMLInputElement;
  const value = target.checked ? true : false;
  emit('change', value)
}

watch(() => props.indeterminate, indeterminate);

onMounted(() => {
  indeterminate(props.indeterminate);
})
</script>

<style scoped></style>
