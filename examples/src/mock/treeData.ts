import type { TreeOption } from '@vue-nova/components/tree/src/tree';

// 生成节点标签（纯函数版本）
export function createLabel(level: number): string {
  if (level === 4) return '道生一';
  if (level === 3) return '一生二';
  if (level === 2) return '二生三';
  if (level === 1) return '三生万物';
  return '';
}

// 生成树形数据（纯函数版本，无状态共享）
export function generateTreeData(level = 4, parentKey = ''): TreeOption[] {
  if (!level) return [];
  const arr = new Array(6 - level).fill(0);

  return arr.map((_, idx: number) => {
    const key = parentKey + level + idx;
    return {
      label: createLabel(level), // 显示的内容
      key, // 唯一性标识
      children: generateTreeData(level - 1, key), // 子节点
    };
  });
}

// 创建带标签的树形数据（独立状态）
export function createLabeledTreeData(): TreeOption[] {
  return [
    {
      label: nextLabel(),
      key: 1,
      isLeaf: false, // 这里isLeaf 为false 表示点击的时候动态的加载子节点
    },
    {
      label: nextLabel(),
      key: 2,
      isLeaf: false,
    },
  ];
}

// 生成标签的内部函数（为每个调用创建独立状态）
function nextLabel(currentLabel?: string): string {
  if (!currentLabel) return 'Out of Tao, One is born';
  if (currentLabel === 'Out of Tao, One is born') return 'Out of One, Two';
  if (currentLabel === 'Out of One, Two') return 'Out of Two, Three';
  if (currentLabel === 'Out of Two, Three') {
    return 'Out of Three, the created universe';
  }
  if (currentLabel === 'Out of Three, the created universe') {
    return 'Out of Tao, One is born';
  }
  return '';
}

// 生成包含禁用节点的树形数据（独立数据）
export function createDisabledTreeData(): TreeOption[] {
  return [
    {
      key: '0',
      label: '0',
      children: [
        {
          key: '0-0',
          label: '0-0',
        },
        {
          disabled: true,
          key: '0-1',
          label: '0-1',
          children: [
            {
              label: '0-1-0',
              key: '0-1-0',
            },
            {
              label: '0-1-1',
              key: '0-1-1',
            },
          ],
        },
      ],
    },
  ];
}

// 生成异步加载的树形数据（独立数据）
export function createAsyncTreeData(): TreeOption[] {
  return [
    {
      label: 'Async Node 1',
      key: 'async-1',
      isLeaf: false,
    },
    {
      label: 'Async Node 2',
      key: 'async-2',
      isLeaf: false,
    },
  ];
}

// 异步加载子节点的处理函数
export function handleLoad(node: TreeOption) {
  // 安全获取node.label和node.key，确保它们是字符串类型
  const nodeLabel = node.label?.toString() || '';
  const nodeKey = node.key?.toString() || '';

  // 创建独立的标签生成函数，避免状态共享
  const getNextLabel = (currentLabel?: string): string => {
    if (!currentLabel) return 'Out of Tao, One is born';
    if (currentLabel === 'Out of Tao, One is born') return 'Out of One, Two';
    if (currentLabel === 'Out of One, Two') return 'Out of Two, Three';
    if (currentLabel === 'Out of Two, Three') {
      return 'Out of Three, the created universe';
    }
    if (currentLabel === 'Out of Three, the created universe') {
      return 'Out of Tao, One is born';
    }
    return '';
  };

  return new Promise<TreeOption[]>((resolve) => {
    setTimeout(() => {
      resolve([
        // 这个数据会作为当前展开的node的children属性
        {
          label: getNextLabel(nodeLabel),
          key: `${nodeKey}-${Date.now()}`, // 添加时间戳确保key唯一性
          isLeaf: false,
        },
      ]);
    }, 1000);
  });
}
