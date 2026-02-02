<template>
  <div :class="bem.b()">
    <div :class="bem.e('group')">
      <div
        v-if="slots.prepend"
        :class="bem.be('group', 'prepend')"
      >
        <slot name="prepend"></slot>
      </div>

      <div :class="[bem.e('wrapper')]">
        <span
          v-if="slots.prefixIcon"
          :class="bem.e('prefix')"
        >
          <slot name="prefixIcon"></slot>
        </span>
        <input
          ref="inputRef"
          :type="showPassword ? (passwordVisible ? 'text' : 'password') : type"
          v-bind="attrs"
          :class="bem.e('inner')"
          :placeholder="placeholder"
          :disabled="disabled"
          :readonly="readonly"
          @input="handleInput"
          @change="handleChange"
          @blur="handleBlur"
          @focus="handleFocus"
        />
        <span
          v-if="slots.suffixIcon"
          :class="bem.e('suffix')"
        >
          <slot name="suffixIcon"></slot>
        </span>
        <z-icon
          v-if="showPwdVisible"
          @click="handlePasswordVisible"
        >
          <component :is="passwordVisible ? EyeOffOutline : EyeOutline" />
        </z-icon>
        <z-icon
          v-if="showClear"
          @click="clear"
        >
          <CloseCircleOutline />
        </z-icon>
      </div>

      <div
        v-if="slots.append"
        :class="bem.be('group', 'append')"
      >
        <slot name="append"></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { createBEM } from '@vue-nova/utils/bem';
import { inputEmits, inputProps } from './input';
import { computed, nextTick, onMounted, ref, useAttrs, useSlots, watch, inject } from 'vue';
import { EyeOutline, EyeOffOutline, CloseCircleOutline } from '@vicons/ionicons5';
import { FormItemContextKey } from '../../form/src/formItem';

const formItemContext = inject(FormItemContextKey, undefined);

const bem = createBEM('z-input');

defineOptions({
  name: 'z-input',
  inheritAttrs: false,
});

const props = defineProps(inputProps);
const emit = defineEmits(inputEmits);

const slots = useSlots();
const attrs = useAttrs();

// ======================= 响应式处理 =======================
watch(
  () => props.modelValue,
  () => {
    formItemContext?.validate('change');
    setNativeInputValue();
  }
);

const inputRef = ref<HTMLInputElement | null>(null);

const setNativeInputValue = () => {
  const inputEle = inputRef.value;
  if (!inputEle) return;
  inputEle.value = String(props.modelValue);
};

onMounted(() => {
  // 组件加载完成设置一次输入框的值
  setNativeInputValue();
});

// ====================== 处理密码展示隐藏 ======================

const focus = async () => {
  await nextTick();
  inputRef.value?.focus();
};

const passwordVisible = ref(false);
const showPwdVisible = computed(() => {
  return props.modelValue && props.showPassword && !props.disabled && !props.readonly;
});

const handlePasswordVisible = () => {
  passwordVisible.value = !passwordVisible.value;
  focus();
};

// ====================== 处理清空操作 ======================

const showClear = computed(() => {
  return props.modelValue && props.clearable && !props.disabled && !props.readonly;
});

const clear = () => {
  emit('update:modelValue', '');
  emit('input', '');
  emit('clear');
  focus();
};

// ====================== 处理输入事件 ======================

const handleInput = (e: InputEvent) => {
  const value = (e.target as HTMLInputElement).value;
  emit('update:modelValue', value); // 触发事件实现双向绑定
  emit('input', value);
};

const handleChange = (e: Event) => {
  const value = (e.target as HTMLInputElement).value;
  emit('change', value);
};

const handleFocus = (e: FocusEvent) => {
  emit('focus', e);
};

const handleBlur = (e: FocusEvent) => {
  formItemContext?.validate('blur');
  emit('blur', e);
};
</script>

<style scoped></style>
