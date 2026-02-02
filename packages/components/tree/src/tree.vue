<template>
  <div :class="bem.b()">
    <z-virtual-list
      :items="flattenTree"
      :remain="8"
      :size="35"
    >
      <template #default="{ node }">
        <z-tree-node
          :key="node.key"
          :node="node"
          :expanded="isExpanded(node)"
          :loading-keys="loadingKeysRef"
          :selected-keys="selectKeysRef"
          :show-checkbox="showCheckbox"
          :checked="isChecked(node)"
          :disabled="isDisabled(node)"
          :indeterminate="isIndeterminate(node)"
          @toggle="toggleExpand"
          @select="handleSelect"
          @check="toggleCheck"
        >
        </z-tree-node>
      </template>
    </z-virtual-list>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, provide, ref, useSlots, watch } from 'vue';
import { TreeNode, TreeOption, treeProps, Key, treeEmits, treeInjectKey } from './tree';
import { createBEM } from '@vue-nova/utils/bem';
import ZVirtualList from '@vue-nova/components/virtual-list';
import ZTreeNode from './treeNode.vue';

const bem = createBEM('tree');

defineOptions({
  name: 'z-tree',
});

const props = defineProps(treeProps);

// 树形数据转换与自定义属性名处理
// 支持用户通过props自定义数据字段名（keyField/labelField/childrenField）

const tree = ref<TreeNode[]>([]);

/**
 * 创建数据访问器配置
 * @param key - 键字段名
 * @param label - 标签字段名
 * @param children - 子节点字段名
 * @returns 包含getKey/getLabel/getChildren方法的访问器对象
 */
const createOptions = (key: string, label: string, children: string) => {
  return {
    // 获取节点键值（使用对象属性访问器支持自定义字段名）
    getKey: (node: TreeOption) => node[key] as string,
    // 获取节点标签（使用对象属性访问器支持自定义字段名）
    getLabel: (node: TreeOption) => node[label] as string,
    // 获取子节点数据（使用对象属性访问器支持自定义字段名）
    getChildren: (node: TreeOption) => node[children] as TreeOption[],
  };
};

// 初始化数据访问器，使用用户配置的自定义字段名
const treeOptions = createOptions(props.keyField, props.labelField, props.childrenField);

/**
 * 将原始树数据转换为组件内部使用的TreeNode数组
 * @param data - 原始树数据
 * @returns 转换后的TreeNode数组
 */
const createTree = (data: TreeOption[], parent: TreeNode | null = null) => {
  // 递归遍历原始数据，转换为统一的TreeNode结构
  const traversal = (data: TreeOption[], parent: TreeNode | null = null) => {
    return data.map((node) => {
      // 使用数据访问器获取子节点数据（支持自定义children字段名）
      const children = treeOptions.getChildren(node) || [];

      const treeNode: TreeNode = {
        // 使用数据访问器获取键值（支持自定义key字段名）
        key: treeOptions.getKey(node),
        // 使用数据访问器获取标签（支持自定义label字段名）
        label: treeOptions.getLabel(node),
        children: [], // 先初始化为空数组
        rawNode: node, // 保存原始节点数据
        level: parent ? parent.level + 1 : 0, // 计算节点层级
        disabled: !!node.disabled,
        // 叶子节点判断逻辑：
        // 1. 优先使用节点自带的isLeaf属性（如果存在）
        // 2. 否则根据子节点数量判断
        // 3. 对于有onLoad属性的节点，即使没有子节点也不是叶子节点（需要异步加载）
        isLeaf: node.isLeaf ?? children.length === 0,
        parentKey: parent?.key,
      };

      // 递归处理子节点，转换为TreeNode[]
      if (children.length > 0) {
        treeNode.children = traversal(children, treeNode);
      }

      return treeNode;
    });
  };

  // 开始递归转换原始数据
  const result: TreeNode[] = traversal(data, parent);
  return result;
};

watch(
  () => props.data,
  (data: TreeOption[]) => {
    tree.value = createTree(data);
  },
  { immediate: true }
);

// 默认展开树形结构  把树形结构拍平  点击实现展开操作
// 展开节点的集合（响应式）
const expandedKeysSet = ref(new Set(props.defaultExpandedKeys));

// 监听defaultExpandedKeys属性变化
watch(
  () => props.defaultExpandedKeys,
  (newKeys) => {
    expandedKeysSet.value = new Set(newKeys);
  },
  { deep: true }
);

// 计算属性：将嵌套的树形节点扁平化为一维数组（仅包含展开的节点）
const flattenTree = computed(() => {
  const flattenNodes: TreeNode[] = []; // 最终扁平化的结果
  const nodes = tree.value || []; // 格式化后的树形节点
  const stack: TreeNode[] = []; // 遍历树的栈（倒序压入根节点，保证顺序）

  // 倒序压入根节点（避免栈弹出时顺序反转）
  for (let i = nodes.length - 1; i >= 0; --i) {
    stack.push(nodes[i]);
  }

  while (stack.length) {
    const node = stack.pop();
    if (!node) continue; // 避免undefined

    // 将当前节点加入扁平化结果
    flattenNodes.push(node);

    // 若当前节点处于展开状态，将其子节点倒序压入栈（保证子节点顺序正确）
    if (expandedKeysSet.value.has(node.key) && node.children.length > 0) {
      for (let i = node.children.length - 1; i >= 0; --i) {
        stack.push(node.children[i]);
      }
    }
  }

  return flattenNodes;
});

const isExpanded = (node: TreeNode): boolean => {
  return expandedKeysSet.value.has(node.key);
};

// 折叠功能
const collapse = (node: TreeNode) => {
  expandedKeysSet.value.delete(node.key);
};

const loadingKeysRef = ref(new Set<Key>());

// 触发加载
const triggerLoading = (node: TreeNode) => {
  // 这个节点需要异步加载
  if (!node.children.length && !node.isLeaf) {
    // 如果没有加载过这个节点 就加载这个节点
    const loadingKeys = loadingKeysRef.value;
    if (!loadingKeys.has(node.key)) {
      loadingKeys.add(node.key);
      const onLoad = props.onLoad;
      if (onLoad) {
        onLoad(node.rawNode).then((children) => {
          // 修改原来的节点
          node.rawNode.children = children;
          // 更新自定义的node
          node.children = createTree(children, node);
          loadingKeys.delete(node.key);
        });
      }
    }
  }
};
// 展开功能
const expand = (node: TreeNode) => {
  expandedKeysSet.value.add(node.key);
  triggerLoading(node);
};

// 切换展开/折叠
const toggleExpand = (node: TreeNode) => {
  const expandKeys = expandedKeysSet.value;
  if (expandKeys.has(node.key)) {
    collapse(node);
  } else {
    expand(node);
  }
};

// 实现选中节点
const emit = defineEmits(treeEmits);
const selectKeysRef = ref<Key[]>([]);

watch(
  () => props.selectedKeys,
  (value) => {
    if (value) {
      selectKeysRef.value = value;
    }
  },
  { immediate: true, deep: true }
);

// 处理节点选中逻辑
const handleSelect = (node: TreeNode) => {
  // 若不可选择，直接返回
  if (!props.selectable) return;

  // 获取当前选中的key集合（转为数组）
  let selectedKeys = [...selectKeysRef.value];

  // 多选逻辑
  if (props.multiple) {
    const keyIndex = selectedKeys.findIndex((key) => key === node.key);
    // 已选中则移除，未选中则添加
    keyIndex > -1 ? selectedKeys.splice(keyIndex, 1) : selectedKeys.push(node.key);
  }
  // 单选逻辑
  else {
    // 已选中则清空，未选中则仅保留当前节点
    selectedKeys = selectedKeys.includes(node.key) ? [] : [node.key];
  }

  // 直接更新内部状态
  selectKeysRef.value = selectedKeys;
  // 触发选中key更新
  emit('update:selectedKeys', selectedKeys);
};

provide(treeInjectKey, {
  slots: useSlots(),
});

const checkedKeysRef = ref(new Set(props.defaultCheckedKeys));

watch(
  () => props.defaultCheckedKeys,
  (value) => {
    checkedKeysRef.value = new Set(value);
  },
  { immediate: true, deep: true }
);

const isChecked = (node: TreeNode) => {
  return checkedKeysRef.value.has(node.key);
};

const isDisabled = (node: TreeNode) => {
  return !!node.disabled;
};

const indeterminateKeysRef = ref<Set<Key>>(new Set());
// 控制节点是否为半选中状态 - 始终返回false（未选状态）
const isIndeterminate = (node: TreeNode) => {
  return indeterminateKeysRef.value.has(node.key);
};

const toggle = (node: TreeNode, checked: boolean) => {
  if (!node) return;
  const checkedKeys = checkedKeysRef.value;

  if (checked) {
    // 若选中，移除半选中状态
    indeterminateKeysRef.value.delete(node.key);
  }
  // 判断当前状态是否为选中
  checkedKeys[checked ? 'add' : 'delete'](node.key);
  const children = node.children || [];
  // 移除条件判断，因为forEach方法会自动处理空数组的情况
  // 若选中，遍历子节点，若子节点可选中，则也选中
  if (children) {
    children.forEach((childNode) => {
      if (!childNode.disabled) {
        toggle(childNode, checked);
      }
    });
  }
};

// 查找节点
const findNode = (key: Key) => {
  return flattenTree.value.find((node) => node.key === key);
};

// 更新选中的Key（自下而上更新父节点选中状态）
const updateCheckedKeys = (node: TreeNode) => {
  // 自下而上的更新
  if (node.parentKey) {
    const parentNode = findNode(node.parentKey);
    if (parentNode) {
      let allChecked = true; // 默认儿子应该全选
      let hasChecked = false; // 默认儿子没有选中

      const nodes = parentNode.children;
      for (const node of nodes) {
        if (checkedKeysRef.value.has(node.key)) {
          hasChecked = true; // 子节点被选中了
        } else if (indeterminateKeysRef.value.has(node.key)) {
          allChecked = false;
          hasChecked = true;
        } else {
          allChecked = false;
        }
      }

      if (allChecked) {
        checkedKeysRef.value.add(parentNode.key);
        indeterminateKeysRef.value.delete(parentNode.key);
      } else if (hasChecked) {
        checkedKeysRef.value.delete(parentNode.key);
        indeterminateKeysRef.value.add(parentNode.key);
      }

      updateCheckedKeys(parentNode);
    }
  }
};

// 切换节点选中状态
const toggleCheck = (node: TreeNode, checked: boolean) => {
  toggle(node, checked);
  updateCheckedKeys(node);
};

// 组件挂载后初始化选中状态
onMounted(() => {
  checkedKeysRef.value.forEach((key: Key) => {
    toggle(findNode(key)!, true);
  });
});
</script>

<style></style>
