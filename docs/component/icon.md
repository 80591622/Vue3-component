# Icon 图标

图标组件用于显示各种类型的图标，支持自定义大小和颜色。

## 基础用法

最简单的图标使用方式：

```vue
<template>
  <z-icon>★</z-icon>
</template>
```

## 自定义大小

通过 `size` 属性设置图标大小（单位：px）：

```vue
<template>
  <div>
    <z-icon size="16">★</z-icon>
    <z-icon size="24">★</z-icon>
    <z-icon size="32">★</z-icon>
    <z-icon size="48">★</z-icon>
  </div>
</template>
```

## 自定义颜色

通过 `color` 属性设置图标颜色：

```vue
<template>
  <div>
    <z-icon color="red">★</z-icon>
    <z-icon color="green">★</z-icon>
    <z-icon color="blue">★</z-icon>
    <z-icon color="#ff6b6b">★</z-icon>
  </div>
</template>
```

## 大小和颜色组合

同时设置大小和颜色：

```vue
<template>
  <div>
    <z-icon :size="24" color="red">★</z-icon>
    <z-icon :size="32" color="#ffd700">★</z-icon>
    <z-icon :size="40" color="green">★</z-icon>
  </div>
</template>
```

## 常用图标示例

```vue
<template>
  <div class="icon-list">
    <z-icon :size="24" color="#333">♥</z-icon>
    <z-icon :size="24" color="orange">✓</z-icon>
    <z-icon :size="24" color="red">✕</z-icon>
    <z-icon :size="24" color="blue">⚙</z-icon>
    <z-icon :size="24" color="green">✔</z-icon>
  </div>
</template>

<style scoped>
.icon-list {
  display: flex;
  gap: 16px;
  align-items: center;
}
</style>
```

## API

### Props

| 属性 | 说明 | 类型 | 默认值 |
|-----|------|------|--------|
| `color` | 图标颜色 | `string` | `-` |
| `size` | 图标大小（单位：px） | `number \| string` | `-` |

### Slots

| 插槽名 | 说明 |
|-------|------|
| `default` | 图标内容 |

## 使用 Font Icon

如果你想使用字体图标库（如 Font Awesome、Iconfont 等），可以这样使用：

```vue
<template>
  <!-- 使用 Font Awesome -->
  <z-icon :size="24" color="blue" class="fa fa-heart"></z-icon>
  
  <!-- 或使用 Iconfont -->
  <z-icon :size="24" color="red" class="iconfont icon-star"></z-icon>
</template>
```

## 响应式图标

```vue
<template>
  <z-icon :size="iconSize" :color="iconColor">★</z-icon>
</template>

<script setup>
import { ref } from 'vue'

const iconSize = ref(24)
const iconColor = ref('#333')

// 根据条件改变图标
const toggleIcon = () => {
  iconSize.value = iconSize.value === 24 ? 32 : 24
  iconColor.value = iconColor.value === '#333' ? '#ff0000' : '#333'
}
</script>
```
## 使用 @vicons/ionicons5

结合 `@vicons/ionicons5` 图标库使用，可以获得更丰富的图标资源。

### 安装依赖

```bash
pnpm add @vicons/ionicons5
```

### 基础用法

```vue
<template>
  <div class="icon-container">
    <z-icon :size="32" color="#1890ff">
      <HeartOutline />
    </z-icon>
    <z-icon :size="32" color="#52c41a">
      <CheckmarkCircleOutline />
    </z-icon>
    <z-icon :size="32" color="#ff4d4f">
      <CloseCircleOutline />
    </z-icon>
  </div>
</template>

<script setup>
import { HeartOutline, CheckmarkCircleOutline, CloseCircleOutline } from '@vicons/ionicons5'
</script>

<style scoped>
.icon-container {
  display: flex;
  gap: 16px;
  align-items: center;
}
</style>
```

### 常用图标列表

```vue
<template>
  <div class="icons-grid">
    <div class="icon-item">
      <z-icon :size="48" color="#1890ff">
        <HomeOutline />
      </z-icon>
      <p>Home</p>
    </div>
    <div class="icon-item">
      <z-icon :size="48" color="#722ed1">
        <SearchOutline />
      </z-icon>
      <p>Search</p>
    </div>
    <div class="icon-item">
      <z-icon :size="48" color="#fa8c16">
        <SettingsOutline />
      </z-icon>
      <p>Settings</p>
    </div>
    <div class="icon-item">
      <z-icon :size="48" color="#1890ff">
        <PersonOutline />
      </z-icon>
      <p>User</p>
    </div>
    <div class="icon-item">
      <z-icon :size="48" color="#52c41a">
        <CheckmarkDone />
      </z-icon>
      <p>Done</p>
    </div>
    <div class="icon-item">
      <z-icon :size="48" color="#ff4d4f">
        <TrashOutline />
      </z-icon>
      <p>Delete</p>
    </div>
  </div>
</template>

<script setup>
import {
  HomeOutline,
  SearchOutline,
  SettingsOutline,
  PersonOutline,
  CheckmarkDone,
  TrashOutline,
} from '@vicons/ionicons5'
</script>

<style scoped>
.icons-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 24px;
  padding: 20px;
}

.icon-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.icon-item p {
  margin: 0;
  font-size: 12px;
  color: #666;
}
</style>
```

### 动态图标切换

```vue
<template>
  <div>
    <button @click="toggleIcon" class="btn">
      <z-icon :size="24" color="#1890ff">
        <component :is="isLiked ? HeartSharp : HeartOutline" />
      </z-icon>
      {{ isLiked ? '取消收藏' : '收藏' }}
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { HeartOutline, HeartSharp } from '@vicons/ionicons5'

const isLiked = ref(false)

const toggleIcon = () => {
  isLiked.value = !isLiked.value
}
</script>

<style scoped>
.btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border: 1px solid #1890ff;
  border-radius: 4px;
  background: white;
  color: #1890ff;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s;
}

.btn:hover {
  background: #f0f5ff;
}
</style>
```

### 图标按钮组件

```vue
<template>
  <div class="button-group">
    <z-icon-button icon="HomeOutline" color="#1890ff">
      首页
    </z-icon-button>
    <z-icon-button icon="SearchOutline" color="#722ed1">
      搜索
    </z-icon-button>
    <z-icon-button icon="SettingsOutline" color="#fa8c16">
      设置
    </z-icon-button>
  </div>
</template>

<script setup>
import { HomeOutline, SearchOutline, SettingsOutline } from '@vicons/ionicons5'
import { defineComponent, h } from 'vue'

// 可以创建一个辅助组件来简化使用
const ZIconButton = defineComponent({
  props: ['icon', 'color'],
  setup(props, { slots }) {
    const iconComponent = {
      HomeOutline,
      SearchOutline,
      SettingsOutline,
    }[props.icon]

    return () => (
      <button class="icon-btn">
        <z-icon size="20" color={props.color}>
          <iconComponent />
        </z-icon>
        <span>{slots.default?.()}</span>
      </button>
    )
  },
})
</script>

<style scoped>
.button-group {
  display: flex;
  gap: 12px;
}

.icon-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  background: white;
  cursor: pointer;
  transition: all 0.3s;
}

.icon-btn:hover {
  border-color: #1890ff;
  color: #1890ff;
}
</style>
```

### 所有可用的 Ionicons5 图标

@vicons/ionicons5 提供了数百个高质量的图标，包括：

- **常用图标**: HomeOutline, SearchOutline, SettingsOutline, PersonOutline
- **操作图标**: TrashOutline, EditOutline, PrintOutline, ShareSocialOutline
- **状态图标**: CheckmarkCircleOutline, CloseCircleOutline, WarningOutline, InfoCircleOutline
- **媒体图标**: ImageOutline, PlayCircleOutline, VolumeHighOutline
- **通讯图标**: MailOutline, CallOutline, ChatbubbleOutline
- **更多图标**: 详见 [ionicons.com](https://ionicons.com/)

### 图标库对比

| 特性 | @vicons/ionicons5 | 原生Unicode | 字体库 |
|-----|------------------|-----------|--------|
| 图标数量 | 数百个 | 有限 | 取决于库 |
| 设计风格 | 统一现代 | - | 统一 |
| 按需导入 | ✓ | - | ✓ |
| Tree-shaking | ✓ | - | ✓ |
| 易用性 | 很高 | 简单 | 需要CSS |
| 文件大小 | 小 | 小 | 中等 |
