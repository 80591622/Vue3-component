import { createBEM } from '@vue-nova/utils/bem';
import { computed, defineComponent, onMounted, PropType, reactive, ref, watch } from 'vue';

// 虚拟列表项的数据接口
interface VirtualListItem {
  [key: string]: any;
}

// 虚拟列表组件的属性接口
interface VirtualListProps {
  size: number; // 每项的高度（像素）
  remain: number; // 可见区域显示的项数
  items: VirtualListItem[]; // 完整的列表数据
}

/**
 * 虚拟滚动列表组件
 * 实现原理：只渲染可见区域及其前后缓冲区的列表项，通过偏移量控制显示内容
 */
export default defineComponent<VirtualListProps>({
  name: 'ZVirtualList',
  props: {
    size: {
      type: Number,
      default: 35, // 默认每项高度35px
    },
    remain: {
      type: Number,
      default: 8, // 默认可见区域显示8项
    },
    items: {
      type: Array as PropType<VirtualListItem[]>,
      default: () => [], // 默认空数组
    },
  },
  setup(props, { slots }) {
    const bem = createBEM('virtual-list'); // BEM命名空间
    const wrapperRef = ref<HTMLElement>(); // 可视区域容器引用
    const barRef = ref<HTMLElement>(); // 滚动条占位容器引用

    // 状态管理：跟踪当前可见区域的起始和结束索引
    const state = reactive({
      start: 0, // 当前可见区域的起始索引
      end: props.remain, // 当前可见区域的结束索引
    });

    // 计算属性：前缓冲区大小
    // 确保向前滚动时有足够的预渲染项，避免白屏
    const prev = computed(() => {
      return Math.min(state.start, props.remain); // 前缓冲区大小不超过可见区域项数
    });

    // 计算属性：后缓冲区大小
    // 确保向后滚动时有足够的预渲染项，避免白屏
    const next = computed(() => {
      return Math.max(props.remain, props.items.length - state.end); // 后缓冲区至少为可见区域项数
    });

    // 计算属性：当前需要渲染的列表数据（包括前后缓冲区）
    const visibleData = computed(() => {
      // 从完整数据中截取需要渲染的部分
      // 起始索引：当前可见区域起始索引 - 前缓冲区大小
      // 结束索引：当前可见区域结束索引 + 后缓冲区大小
      return props.items.slice(state.start - prev.value, state.end + next.value);
    });

    // 滚动列表的偏移量（用于控制实际渲染列表的位置）
    const offsets = ref(0);

    /**
     * 滚动事件处理函数
     * 核心逻辑：根据滚动位置计算当前可见区域的起始和结束索引，并更新偏移量
     */
    const handleScroll = () => {
      const scrollTop = wrapperRef.value!.scrollTop; // 获取当前滚动距离

      // 计算当前可见区域的起始索引（滚动距离 / 每项高度）
      state.start = Math.floor(scrollTop / props.size);

      // 计算当前可见区域的结束索引（起始索引 + 可见区域项数）
      state.end = state.start + props.remain;

      // 更新滚动列表的偏移量，使渲染的列表项正确对齐到可视区域
      offsets.value = state.start * props.size - prev.value * props.size;
    };

    /**
     * 初始化容器高度和滚动条高度
     */
    const initWrapper = () => {
      // 设置可视区域容器的高度（可见区域项数 * 每项高度）
      wrapperRef.value!.style.height = `${props.size * props.remain}px`;

      // 设置滚动条占位容器的高度（完整数据项数 * 每项高度）
      // 这个占位容器用于模拟真实列表的滚动效果
      barRef.value!.style.height = `${props.items.length * props.size}px`;
    };

    // 监听items数据变化，重新初始化容器
    watch(
      () => props.items,
      () => {
        initWrapper();
      }
    );

    // 组件挂载后初始化容器
    onMounted(() => {
      initWrapper();
    });

    // 渲染虚拟滚动列表
    return () => (
      <div
        class={bem.b()} // 外层容器
        ref={wrapperRef} // 可视区域容器引用
        onScroll={handleScroll} // 滚动事件监听
      >
        {/* 滚动条占位容器，用于模拟真实列表的滚动高度 */}
        <div
          class={bem.e('scroll-bar')}
          ref={barRef}
        ></div>

        {/* 实际渲染的列表容器，通过transform控制偏移量 */}
        <div
          class={bem.e('scroll-list')}
          style={{ transform: `translate3d(0,${offsets.value}px,0)` }} // 偏移量控制
        >
          {/* 渲染当前可见区域及其前后缓冲区的列表项 */}
          {visibleData.value?.map((node, idx) => slots.default?.({ node }))}
        </div>
      </div>
    );
  },
});
