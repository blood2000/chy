<template>
  <el-table :ref="refName" v-loading="loading" border stripe :data="data" v-bind="$attrs" @selection-change="handleSelectionChange">
    <el-table-column v-if="!!_events['selection-change']" type="selection" width="55" align="center" fixed :reserve-selection="reserveSelection" />
    <el-table-column v-if="!isShowIndex" label="序号" align="center" type="index" min-width="5%" />
    <template v-for="(th, key) in tableColumnsConfig">
      <el-table-column
        v-if="th.isShow"
        :key="th.prop +''+ key"
        :align="th.align || 'center'"
        :prop="th.prop"
        :label="th.label"
        :min-width="th.width"
        :fixed="th.fixed==='' ? null : th.fixed"
        :show-overflow-tooltip="th.tooltip || false"
        :sortable="th.sortable || false"
      >
        <!-- :formatter="th.formatter" -->
        <template slot-scope="scope">
          <slot :name="th.prop" :row="scope.row">{{ scope.row[th.prop] || '' }}</slot>
        </template>
      </el-table-column>
    </template>
  </el-table>
</template>

<script>
/**
 * 调用示例
 * <refactor-table :loading='loading' :data='list' :tableColumnsConfig='tableColumnsConfig' @selection-change="handleSelectionChange">
 *    对一些特殊的进一步处理
      <template #status="{row}">
          <span>{{statusFormat(row)}}</span>
      </template>
      <template #accessTime="{row}">
          <span>{{ parseTime(row.accessTime) }}</span>
      </template>
    </refactor-table>

    // element-ui中的table可分页多选功能-记住上一页勾选数据
    <refactor-table :loading='loading' :data='list' :tableColumnsConfig='tableColumnsConfig' :row-key="(row)=> row.id" reserve-selection @selection-change="handleSelectionChange">
*/
export default {
  name: 'RefactorTable',
  props: {
    isShowIndex: {
      type: Boolean,
      default: false
    },
    /**
     * list  渲染所需数据
     * 如：[{infoId:1,ipaddr:'abc'},{infoId:2,ipaddr:'def'}]
     */
    data: {
      type: Array,
      default: function() {
        return [];
      }
    },
    /** 设置table 加载icon */
    loading: {
      type: Boolean,
      default: false
    },
    /**
     * tableColumnsConfig  表头动态配置数据
     * 如：{
          prop: 'ipaddr',
          label: '地址',
          width: 130,
          tooltip: true  默认false
          align: 'center' 默认居中
          fixed:'right' 固定
        }
     */
    tableColumnsConfig: {
      type: Array,
      default: function() {
        return [];
      }
    },
    refName: {
      type: String,
      default: 'multipleTable'
    },
    cbData: {
      type: Array,
      default: null
    },
    reserveSelection: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      multipleSelection: [],
      time: null
    };
  },
  watch: {
    cbData: {
      handler(value) {
        if (!value) return;

        this.m2ToggleSelection(value);
      },
      immediate: true
    }
  },
  beforeDestroy() {
    clearTimeout(this.time);
  },
  methods: {
    handleSelectionChange(selection) {
      this.$emit('selection-change', selection);
    },
    m2ToggleSelection(rows) {
      if (rows) {
        this.$nextTick(() => {
          this.time = setTimeout(() => {
            rows.forEach(row => {
              this.$refs[this.refName].toggleRowSelection(this.data[row], true);
            });
          }, 100);
        });
      } else {
        this.$refs[this.refName].clearSelection();
      }
    }
  }
};
</script>
