<template>
  <div
    @click="handleClick"
    :class="[bem.e('content')]"
  >
    <template v-if="drag">
      <upload-dragger @file-drop="handleDrop">
        <slot></slot>
      </upload-dragger>
    </template>

    <template v-else>
      <slot></slot>
    </template>

    <input
      ref="inputRef"
      type="file"
      :name="name"
      :accept="accept"
      :multiple="multiple"
      @change="handleChange"
    />
  </div>
</template>

<script setup lang="ts">
import { createBEM } from '@vue-nova/utils/bem';
import { getId, UploadRawFile } from './upload';
import { ref } from 'vue';
import { uploadContentProps } from './uploadContent';
import { httpRequest } from './ajax';
import UploadDragger from './uploadDragger.vue';
const bem = createBEM('upload');

defineOptions({
  name: 'z-upload-content',
  inheritAttrs: false,
});

const props = defineProps(uploadContentProps);

const inputRef = ref<HTMLInputElement>();
const xhrMap = new Map<number, XMLHttpRequest>();
const handleClick = () => {
  inputRef.value!.value = '';
  inputRef.value!.click();
};

const upload = (rawFile: UploadRawFile) => {
  inputRef.value!.value = '';
  let result = props.beforeUpload(rawFile);
  if (result === false) return props.onRemove(rawFile);

  const { method, headers, name, action, data } = props;
  const xhr = httpRequest({
    method,
    file: rawFile,
    headers,
    name,
    action,
    data,
    onError: (e) => {
      props.onError(e, rawFile);
    },
    onSuccess: (res: any) => {
      props.onSuccess(res, rawFile);
    },
    onProgress: (e) => {
      props.onProgress(e, rawFile);
    },
  });
  if (rawFile.uid) {
    xhrMap.set(rawFile.uid, xhr);
  }
};

const handleFiles = (files: File[] | FileList) => {
  const fileList = Array.from(files);
  for (const file of fileList) {
    const rawFile = file as UploadRawFile;
    rawFile.uid = getId();
    props.onStart(rawFile);
    if (props.autoUpload) {
      upload(rawFile);
    }
  }
};

const handleChange = (e: Event) => {
  const files = (e.target as HTMLInputElement).files;
  if (!files || files.length === 0) return;
  handleFiles(files);
};

const handleDrop = (files: File[]) => {
  if (!files.length) return;
  handleFiles(files);
};

const submit = (rawFiles: UploadRawFile[]) => {
  if (!rawFiles.length) return;
  for (const rawFile of rawFiles) {
    upload(rawFile);
  }
};

const abort = (rawFiles: UploadRawFile[]) => {
  if (!rawFiles.length) return;
  for (const rawFile of rawFiles) {
    const xhr = rawFile.uid ? xhrMap.get(rawFile.uid) : undefined;
    if (xhr) {
      xhr.abort();
      xhrMap.delete(rawFile.uid);
    }
  }
};

defineExpose({
  submit,
  abort,
});
</script>
