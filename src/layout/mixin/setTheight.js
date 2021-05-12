import { debounce } from '@/utils';
/**
 * 使用 只要添加下面4个就行了
 * :height="tHeight" 必须, 高度(tab表格设置高)
 * ref="searchBox" 必须有, (获取搜索框的高度)
 * v-show="showSearch" 必须有 (隐藏的时候高度变化)
 * addition: 60 // 默认不填是0 (追加高度)
 *
*/

const headHeight = 286; // 头部的高度 头部 70 + 面包屑30 + 其他padding

export default {

  data() {
    return {
      tHeight: null,
      $_initListener: null
    };
  },

  watch: {
    showSearch: {
      handler(value, odvalue) {
        this.$_setTheight('tHeight', 'searchBox', this.showSearch, this.addition);
      },
      immediate: true
    },
    // 如果有的话~~
    activeName(value) {
      this.$nextTick(() => {
        this.$_setTheight('tHeight', 'searchBox', this.showSearch, this.addition);
      });
    }
  },

  mounted() {
    this.initListener();
  },

  beforeMount() {
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.$_initListener);
    this.$_initListener = null;
  },

  methods: {

    initListener() {
      this.$_initListener = debounce(() => {
        this.$_setTheight('tHeight', 'searchBox', this.showSearch, this.addition);
      }, 100);

      window.addEventListener('resize', this.$_initListener);
    },

    $_setTheight(tHeight, refName, showSearch, addition = 0) {
      console.log(addition);
      var h = window.innerHeight || document.body.clientHeight;
      this.$nextTick(() => {
        let searchBoxheight = 0;
        if (this.$refs[refName]) {
          searchBoxheight = showSearch ? this.$refs[refName].offsetHeight : 0;
        }
        this[tHeight] = h - headHeight - searchBoxheight - addition;
      });
    }
  }
};
