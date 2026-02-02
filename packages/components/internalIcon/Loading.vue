<template>
  <!-- 加载动画 SVG -->
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 1024 1024"
    class="loading"
  >
    <!-- 定义渐变 -->
    <defs>
      <linearGradient
        id="loadingGradient"
        x1="0%"
        y1="0%"
        x2="100%"
        y2="100%"
      >
        <stop
          offset="0%"
          :stop-color="color1"
          stop-opacity="1"
        />
        <stop
          offset="100%"
          :stop-color="color2"
          stop-opacity="0.6"
        />
      </linearGradient>
    </defs>
    <!-- 带缺口的圆环 -->
    <path
      :d="pathData"
      fill="none"
      stroke="url(#loadingGradient)"
      stroke-width="80"
      stroke-linecap="round"
      stroke-dasharray="2000"
      stroke-dashoffset="600"
    />
  </svg>
</template>

<script setup lang="ts">
import { ref } from 'vue';

// 定义带缺口的圆环路径数据
const pathData =
  'M512 160c-194.2 0-352 157.8-352 352s157.8 352 352 352 352-157.8 352-352S706.2 160 512 160z';

// 渐变颜色
const color1 = ref('#1890ff');
const color2 = ref('#722ed1');
</script>

<style scoped>
.loading {
  width: 1rem;
  height: 1rem;
  animation: rotate 1.5s cubic-bezier(0.77, 0, 0.175, 1) infinite;
  transform-origin: center center;
  vertical-align: middle;
}

@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
