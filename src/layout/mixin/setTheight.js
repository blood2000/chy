import { debounce } from '@/utils';
/**
 * 使用 只要添加下面4个就行了
 * :height="list.length>=10 ? tHeight : 'auto'" 必须, 有值就则高度(tab表格设置高)
 * ref="searchBox" 必须有, (获取搜索框的高度)
 * v-show="showSearch" 必须有 (隐藏的时候高度变化)
 * addition: 60 // 默认不填是0 (追加高度)
 *
*/

const paddingH = 190; // 其他padding

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
      var h = window.innerHeight || document.body.clientHeight;


      this.$nextTick(() => {
        if (this.$refs[refName]) {
          var sh = showSearch ? this.$refs[refName].offsetHeight : 0;
          var hh = window.document.querySelector('.navbar').offsetHeight;
          var fh = window.document.querySelector('.fixed-header').offsetHeight;
          this[tHeight] = h - (paddingH + sh + hh + fh + addition);
          console.log(this[tHeight]);
        }
      });
    }
  }
};
