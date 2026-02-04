<template>
  <h2>上传</h2>
  <div class="upload-demo">
    <z-upload
      action="http://localhost:3001/upload"
      :drag="true"
      :auto-upload="false"
      :on-success="handleSuccess"
      :on-error="handleError"
      :on-progress="handleProgress"
      :on-preview="handlePreview"
    >
      <div>将文件拖到此处，或点击上传</div>
    </z-upload>
  </div>
</template>

<script setup lang="ts">
const handleSuccess = (res: any) => {
  console.log('upload success', res);
};

const handleError = (err: any) => {
  console.log('upload error', err);
};

const handleProgress = (e: ProgressEvent & { percentage: number }) => {
  console.log('upload progress', e.percentage);
};

const handlePreview = (file: any) => {
  console.log('preview', file);
};
</script>

<style scoped>
.upload-demo {
  max-width: 560px;
}
</style>
