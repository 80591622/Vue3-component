<template>
  <div class="demo-layout">
    <aside class="demo-nav">
      <h1>VueNova 组件库</h1>
      <nav>
        <a
          v-for="item in demoItems"
          :key="item.id"
          :href="`#${item.id}`"
        >
          {{ item.title }}
        </a>
      </nav>
    </aside>
    <main class="demo-content">
      <section
        v-for="item in demoItems"
        :key="item.id"
        :id="item.id"
        class="demo-section"
      >
        <component :is="item.component" />
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import IconDemo from './demos/IconDemo.vue';
import TreeDemo from './demos/TreeDemo.vue';
import ButtonDemo from './demos/ButtonDemo.vue';
import InputDemo from './demos/InputDemo.vue';
import FormDemo from './demos/FormDemo.vue';
import UploadDemo from './demos/UploadDemo.vue';

const demoItems = [
  { id: 'icon', title: 'Icon 图标', component: IconDemo },
  { id: 'tree', title: 'Tree 树形控件', component: TreeDemo },
  { id: 'button', title: 'Button 按钮', component: ButtonDemo },
  { id: 'input', title: 'Input 输入框', component: InputDemo },
  { id: 'form', title: 'Form 表单', component: FormDemo },
  { id: 'upload', title: 'Upload 上传', component: UploadDemo },
];
</script>

<style scoped>
.demo-layout {
  display: grid;
  grid-template-columns: 220px 1fr;
  gap: 24px;
  align-items: start;
}

.demo-nav {
  position: sticky;
  top: 16px;
  align-self: start;
  padding: 12px 10px;
  border-right: 1px solid #e5e7eb;
}

.demo-nav h1 {
  margin: 0 0 12px;
  font-size: 18px;
}

.demo-nav nav {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.demo-nav a {
  color: #374151;
  text-decoration: none;
  font-size: 14px;
}

.demo-nav a:hover {
  color: #111827;
}

.demo-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.demo-section {
  padding-bottom: 16px;
  border-bottom: 1px dashed #e5e7eb;
}

@media (max-width: 900px) {
  .demo-layout {
    grid-template-columns: 1fr;
  }

  .demo-nav {
    position: static;
    border-right: none;
    border-bottom: 1px solid #e5e7eb;
    padding-bottom: 16px;
  }
}
</style>
