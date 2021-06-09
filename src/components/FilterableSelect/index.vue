<template>
  <el-select
    v-model="modelData"
    v-el-select-loadmore="loadmore"
    filterable
    remote
    reserve-keyword
    :placeholder="placeholder"
    :remote-method="remoteMethod"
    :loading="loading"

    v-bind="$attrs"
    @keyup.enter.native="$emit('handleQuery')"
    @change="handlerchange"
  >
    <el-option
      v-for="(item, index) in shipmentList"
      :key="index"
      :value="item[showKey.value || 'code']"
      :label="item[showKey.label || 'name']"
    >
      <div class="ly-flex-pack-justify">
        <slot :row="item">
          <span>{{ item[showKey.label|| 'name'] }}</span><span>{{ item[showKey.telphone|| 'telphone'] || '' }}</span>
        </slot>
      </div>
    </el-option>
  </el-select>
</template>

<script>
/**
 *
 *        v-model="queryParams.disUserName"
          placeholder="发货企业/操作人/手机号"
          clearable
          size="small"
          style="width: 228px"
          @keyup.enter.native="handleQuery"
*/
export default {

  props: {
    value: {
      type: [String, Number],
      default: ''
    },
    placeholder: {
      type: String,
      default: ''
    },
    axios: {
      type: Object,
      default: () => { return {}; }
    },
    showKey: {
      type: Object,
      default: () => {
        return {
          value: 'code',
          label: 'name'
        };
      }
    }
  },

  data() {
    return {
      /* 其他额外参数 */
      shipmentList: [], // 远程搜索的时候使用
      shipmentreq: {
        pageNum: 1,
        keywords: '',
        pageSize: 10
      },
      loading: false,
      dataOver: false
    };
  },

  computed: {
    modelData: {
      get() {
        return this.value;
      },
      set(data) {
        this.$emit('input', data);
      }
    }
  },

  methods: {
    /** 远程搜索列表触底事件 */
    loadmore() {
      if (this.dataOver) return;
      this.shipmentreq.pageNum++;
      this.getTeamList();
    },

    /** 触发远程搜索 */
    remoteMethod(query) {
      if (query !== '') {
        this.shipmentreq.pageNum = 1;
        this.shipmentreq.keywords = query;
        this.shipmentList = [];
        this.getTeamList();
      } else {
        this.shipmentList = [];
      }
    },

    /** 请求数据 */
    getTeamList() {
      // 请求数据
      const { queryFn, queryData = {}, key = 'rows' } = this.axios;
      queryFn && queryFn({ ...this.shipmentreq, ...queryData }).then(
        (res) => {
          this.dataOver = !res[key].length;
          this.shipmentList = this.shipmentList.concat(res[key]);
          this.loading = false;
        }
      ).catch(() => {
        this.loading = false;
      });
    },

    /** 选择的 */
    handlerchange(data) {
      const filterData = this.shipmentList.filter(e => e[this.showKey.value] === data);
      this.$emit('selected', filterData[0] || {});
    }
  }
};
</script>

<style>

</style>
