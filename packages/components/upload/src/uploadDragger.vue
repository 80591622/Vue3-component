<template>
  <div
    :class="[bem.e('dragger'), { 'is-dragover': isDragover }]"
    @dragenter.prevent="handleDragEnter"
    @dragover.prevent="handleDragOver"
    @dragleave.prevent="handleDragLeave"
    @drop.prevent="handleDrop"
  >
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { createBEM } from '@vue-nova/utils/bem';

const bem = createBEM('upload');
const emit = defineEmits<{ (e: 'file-drop', files: File[]): void }>();

const isDragover = ref(false);

const handleDragEnter = () => {
  isDragover.value = true;
};

const handleDragOver = () => {
  isDragover.value = true;
};

const handleDragLeave = () => {
  isDragover.value = false;
};

const handleDrop = (event: DragEvent) => {
  isDragover.value = false;
  const files = Array.from(event.dataTransfer?.files ?? []);
  emit('file-drop', files);
};
</script>

<style scoped></style>
