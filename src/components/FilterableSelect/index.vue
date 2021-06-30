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
 * 调用示例:
 * <FilterableSelect
          v-if="open" <----- 把组件注销(不缓存)
          v-model="form.disUserCode" <----- 双向绑定的数据
          clearable
          style="width:255px"
          placeholder="请输入调度者姓名/手机号"
          :axios="{
            queryFn:listInfo, <----- 请求接口的函数
            queryData:{} <----- 请求的额外参数
          }"
          :show-key="{
            value: 'code', <----- 默认value 的key是 code
            label: 'name', <----- 默认label 的key是 name
            telphone: 'telphone' <----- 下拉多加一个展示数据
          }"
          @selected="(data)=>{form.disUserPhone = data.telphone;form.disUserName = data.name; form.disName = data.teamLeaderName }" <----- 选中对象返回
        >
          <template #default="{row}"> <----- 插槽下拉框数据展示
            <span>{{ row.name }}</span><span>{{ row.telphone }}</span>
          </template>
        </FilterableSelect>
 *
 *
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
    },
    keywords: {
      type: String,
      default: 'keywords'
    },
    isSureKey: { // 必选的key名称
      type: String,
      default: ''
    },
    requerMsg: { // 必选消息, 为空就没有
      type: String,
      default: ''
    }
  },

  data() {
    return {
      /* 其他额外参数 */
      shipmentList: [], // 远程搜索的时候使用
      shipmentreq: {
        pageNum: 1,
        keywords: undefined,
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

  watch: {
    'axios.queryData': {
      handler(val) {
        // 有关联的监听, 清空相关联的下拉值
        if (this.requerMsg && !val[this.isSureKey]) {
          this.shipmentList = []; // 清空下拉框
          this.modelData = ''; // 清空选中项
        }
      },
      deep: true
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
      if (query.trim() !== '') {
        this.shipmentreq.pageNum = 1;
        this.shipmentreq[this.keywords] = query.trim();

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

      if (this.requerMsg && (!this.isSureKey || !this.axios.queryData[this.isSureKey])) {
        this.$message({ type: 'warning', message: this.requerMsg });
        return;
      }


      queryFn && queryFn({ ...this.shipmentreq, ...queryData, [this.keywords]: this.shipmentreq[this.keywords] }).then(
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
