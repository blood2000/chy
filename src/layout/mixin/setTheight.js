import { debounce } from '@/utils';
/**
 * 规定 要有这些类名 (.navbar .fixed-header tbody ref="searchBox")
 * 使用 只要添加下面4个
 * 1. 搜索框外面包一个div "<div ref="searchBox">...</div>"  (用来计算高度的)
 * 2. table表格加上  :height="tbodyHeight"  (tbodyHeight是最终计算出来的值)
 * 3. v-show="showSearch" (可以有)
 * 4. addition: 60 // 默认不填是0 (追加高度)
 * 5. 请求完列表后 调用 this.$_getHeight();
 *
 *
*/

const paddingH = 190; // 其他padding(是以货源管理页面为例)

export default {

  data() {
    return {
      tbodyHeight: 0, // 实际高度(最后赋值)
      $__tHeight: 0, // 正常高度

      $_initListener: null,

      t__hh: 0,
      t__fh: 0,
      t__tbodyDom: null,
      searchBox: null

    };
  },

  watch: {
    showSearch: {
      handler(value, odvalue) {
        this.$_getHeight();
      }
    },
    // 如果有的话~~
    activeName(value) {
      this.$nextTick(() => {
        this.$_getHeight();
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
        this.$_getHeight();
      }, 100);

      window.addEventListener('resize', this.$_initListener);

      this.t__hh = window.document.querySelector('.navbar').offsetHeight;
      this.t__fh = window.document.querySelector('.fixed-header').offsetHeight;
      this.t__tbodyDom = this.$el.querySelector('tbody');
      this.searchBox = this.$refs['searchBox'];
    },

    $_setTheight(showSearch = true, addition = 0) {
      var h = window.innerHeight || document.body.clientHeight;

      var sh = 0;
      if (this.searchBox && showSearch) {
        sh = this.searchBox.offsetHeight;
      }
      var hh = this.t__hh;
      var fh = this.t__fh;
      this.__tHeight = h - (paddingH + sh + hh + fh + addition);
    },
    $_getHeight() {
      this.$nextTick(() => {
        this.$_setTheight(this.showSearch, this.addition);
        const tbodyDom = this.t__tbodyDom;

        const listLength = tbodyDom.childNodes.length - 1;

        const tbodyHeight = tbodyDom.offsetHeight;

        this.tbodyHeight = tbodyHeight > this.__tHeight ? this.__tHeight : tbodyHeight + tbodyHeight / listLength;
      });
    }
  }
};
