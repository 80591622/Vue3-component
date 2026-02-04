<template>
  <div :class="bem.b()">
    <UploadContent
      ref="contentRef"
      v-bind="uploadContentProps"
    >
      <slot></slot>
      <template v-if="!$slots.default">
        <div :class="bem.e('trigger')">
          <z-icon>
            <CloudUploadOutline />
          </z-icon>
          <div :class="bem.e('text')">将文件拖到此处，或<em>点击上传</em></div>
        </div>
      </template>
    </UploadContent>

    <ul
      v-if="uploadFiles.length"
      :class="bem.e('list')"
    >
      <li
        v-for="file in uploadFiles"
        :key="file.uid"
        :class="bem.e('item')"
      >
        <div :class="bem.e('thumb')">
          <img
            v-if="isImage(file)"
            :src="file.url"
            :alt="file.name"
          />
          <video
            v-else-if="isVideo(file)"
            :src="file.url"
            muted
          ></video>
          <z-icon v-else>
            <DocumentOutline />
          </z-icon>
        </div>
        <div :class="bem.e('info')">
          <div :class="bem.e('name')">{{ file.name }}</div>
          <div :class="bem.e('meta')">{{ formatSize(file.size) }}</div>
          <div
            v-if="typeof file.percentage === 'number'"
            :class="bem.e('progress')"
          >
            <span :style="{ width: `${file.percentage}%` }"></span>
          </div>
        </div>
        <div :class="bem.e('actions')">
          <button
            type="button"
            :class="bem.e('preview')"
            @click="handlePreview(file)"
          >
            预览
          </button>
          <button
            v-if="file.status === 'start'"
            type="button"
            :class="bem.e('upload-one')"
            @click="handleUploadOne(file)"
          >
            上传
          </button>
          <button
            v-else-if="file.status === 'uploading'"
            type="button"
            :class="bem.e('cancel')"
            @click="handleCancel(file)"
          >
            取消
          </button>
          <button
            v-else-if="file.status === 'error'"
            type="button"
            :class="bem.e('retry')"
            @click="handleRetry(file)"
          >
            重试
          </button>
          <button
            type="button"
            :class="[bem.e('remove'), { 'is-disabled': file.status === 'uploading' }]"
            :disabled="file.status === 'uploading'"
            @click="handleRemove(file)"
          >
            删除
          </button>
        </div>
      </li>
    </ul>

    <div
      v-if="!props.autoUpload && uploadFiles.length"
      :class="bem.e('footer')"
    >
      <button
        type="button"
        :class="bem.e('submit')"
        @click="handleSubmit"
      >
        开始上传
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { CloudUploadOutline, DocumentOutline } from '@vicons/ionicons5';
import { createBEM } from '@vue-nova/utils/bem';
import { UploadFile, UploadFiles, uploadProps, UploadRawFile } from './upload';
import UploadContent from './uploadContent.vue';
import { UploadContentProps } from './uploadContent';
defineOptions({
  name: 'z-upload',
});

const props = defineProps(uploadProps);
const emit = defineEmits<{
  (e: 'update:file-list', files: UploadFiles): void;
}>();
const bem = createBEM('upload');
const contentRef = ref<InstanceType<typeof UploadContent> | null>(null);

const uploadFiles = ref<UploadFiles>(props.fileList);

watch(uploadFiles, (newVal) => {
  emit('update:file-list', newVal);
});

const findFile = (rawFile: UploadRawFile) => {
  return uploadFiles.value.find((file) => file.uid === rawFile.uid);
};

const handlePreview = (file: UploadFile) => {
  if (file.url) {
    window.open(file.url, '_blank');
  }
  props.onPreview(file);
};

const handleUploadOne = (file: UploadFile) => {
  if (!file.raw || !contentRef.value) return;
  contentRef.value.submit([file.raw as UploadRawFile]);
};

const handleCancel = (file: UploadFile) => {
  if (!file.raw || !contentRef.value) return;
  contentRef.value.abort([file.raw as UploadRawFile]);
  file.status = 'cancel';
};

const handleRetry = (file: UploadFile) => {
  if (!file.raw || !contentRef.value) return;
  file.status = 'start';
  contentRef.value.submit([file.raw as UploadRawFile]);
};

const handleRemove = async (file: UploadFile) => {
  const r = await props.beforeRemove(file, uploadFiles.value);
  if (r === false) return;
  const list = uploadFiles.value;
  const index = list.indexOf(file);
  if (index >= 0) {
    list.splice(index, 1);
    uploadFiles.value = [...list];
    props.onRemove(file, uploadFiles.value);
  }
};

const isImage = (file: UploadFile) => {
  const type = file.raw?.type || '';
  return type.startsWith('image/');
};

const isVideo = (file: UploadFile) => {
  const type = file.raw?.type || '';
  return type.startsWith('video/');
};

const formatSize = (size?: number) => {
  if (!size && size !== 0) return '';
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  if (size < 1024 * 1024 * 1024) return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  return `${(size / (1024 * 1024 * 1024)).toFixed(1)} GB`;
};

const handleSubmit = () => {
  if (!contentRef.value) return;
  const readyFiles = uploadFiles.value.filter((file) => file.raw && file.status === 'start');
  contentRef.value.submit(readyFiles.map((file) => file.raw as UploadRawFile));
};
const uploadContentProps = computed<UploadContentProps>(() => ({
  ...props,
  onStart: (rawFile) => {
    const uploadFile: UploadFile = {
      uid: rawFile.uid,
      name: rawFile.name,
      percentage: 0,
      raw: rawFile,
      size: rawFile.size,
      status: 'start',
    };
    uploadFile.url = URL.createObjectURL(rawFile);
    uploadFiles.value = [...uploadFiles.value, uploadFile];
    props.onChange(uploadFile);
  },
  onProgress: (e, rawFile) => {
    const uploadFile = findFile(rawFile)!;
    uploadFile.status = 'uploading';
    uploadFile.percentage = e.percentage;
    props.onProgress(e, uploadFile, uploadFiles.value);
  },
  onRemove: async (rawFile) => {
    const uploadFile = findFile(rawFile)!;
    const r = await props.beforeRemove(uploadFile, uploadFiles.value);
    if (r !== false) {
      const fileList = uploadFiles.value;
      fileList.splice(fileList.indexOf(uploadFile), 1);
      props.onRemove(uploadFile, uploadFiles.value);
    }
  },
  onError: (err, rawFile) => {
    const uploadFile = findFile(rawFile)!;
    uploadFile.status = 'error';
    const fileList = uploadFiles.value;
    fileList.splice(fileList.indexOf(uploadFile), 1);
    props.onError(err, uploadFile, fileList);
  },
  onSuccess: (res, rawFile) => {
    const uploadFile = findFile(rawFile)!;
    uploadFile.status = 'success';
    props.onSuccess(res, uploadFile, uploadFiles.value);
  },
}));
</script>
