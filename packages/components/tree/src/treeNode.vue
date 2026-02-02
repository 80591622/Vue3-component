<template>
  <div :class="[bem.b(), bem.is('selected', isSelected), bem.is('disabled', node.disabled)]">
    <div
      :class="bem.e('content')"
      :style="{ paddingLeft: `${node.level * 16}px` }"
    >
      <span
        :class="[
          bem.e('expand-icon'),
          bem.is('leaf', node.isLeaf),
          { expanded: expanded && !node.isLeaf },
        ]"
        @click="handleExpand"
      >
        <z-icon size="25">
          <Switcher v-if="!isLoading" />
          <Loading v-else />
        </z-icon>
      </span>
      <z-checkbox
        v-if="showCheckbox"
        :model-value="checked"
        :disabled="disabled"
        :indeterminate="indeterminate"
        @change="handleCheckChange"
      ></z-checkbox>
      <span
        @click="handleSelect"
        :class="bem.e('label')"
      >
        <ZTreeNodeContent :node="node"></ZTreeNodeContent>
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import ZIcon from '@vue-nova/components/icon';
import Switcher from '@vue-nova/components/internalIcon/Switcher.vue';
import { createBEM } from '@vue-nova/utils/bem';
import { treeNodeEmits, treeNodeProps } from './tree';
import Loading from '@vue-nova/components/internalIcon/Loading.vue';
import { computed } from 'vue';
import ZTreeNodeContent from './tree-node-content';
import ZCheckbox from '@vue-nova/components/checkbox';

const bem = createBEM('tree-node');

const props = defineProps(treeNodeProps);

const emit = defineEmits(treeNodeEmits);

const handleExpand = () => {
  emit('toggle', props.node);
};

const isLoading = computed(() => {
  return props.loadingKeys.has(props.node.key);
});

const isSelected = computed(() => {
  return props.selectedKeys.includes(props.node.key);
});

const handleSelect = () => {
  if (props.node.disabled) return;
  emit('select', props.node);
};

const handleCheckChange = (val: boolean) => {
  emit('check', props.node, val);
};
</script>
