<template>
  <el-table :ref="refName" v-loading="loading" :show-summary="summary" border highlight-current-row :data="data" v-bind="$attrs" @selection-change="handleSelectionChange">
    <el-table-column v-if="!!_events['selection-change']" type="selection" width="55" align="center" fixed :reserve-selection="reserveSelection" />
    <el-table-column v-if="!isShowIndex" label="序号" align="center" type="index" width="50" :fixed="indexfixed" />
    <template v-for="(th, key) in tableColumnsConfig">
      <el-table-column
        v-if="th.isShow && !th.isChild"
        :key="th.prop +''+ key"
        :align="th.align || 'center'"
        :prop="th.prop"
        :label="th.label"
        :min-width="th.width"
        :fixed="th.fixed==='' ? null : th.fixed"
        :show-overflow-tooltip="th.tooltip || false"
        :sortable="th.sortable || false"
      >
        <template slot-scope="scope">
          <slot :name="th.prop" :row="scope.row">{{ scope.row[th.prop] === 0 ? 0 : scope.row[th.prop] || '' }}</slot>
        </template>
      </el-table-column>
    </template>
    <!--三级表头-->
    <el-table-column v-for="(level1Item, index) in morelist" :key="index" align="center" :label="level1Item.label" :prop="level1Item.prop" :min-width="level1Item.width" :fixed="level1Item.fixed==='' ? null : level1Item.fixed">
      <template v-if="level1Item.children">
        <template v-for="(level2Item, indexChild1) in level1Item.children">
          <el-table-column
            v-if="level2Item.isShow"
            :key="index+'-'+indexChild1"
            align="center"
            :label="level2Item.label"
            :prop="level2Item.prop"
            :show-overflow-tooltip="level2Item.tooltip || false"
            :min-width="level2Item.width"
            :fixed="level2Item.fixed==='' ? null : level2Item.fixed"
          >
            <template slot-scope="scope">
              <slot :name="level2Item.prop" :row="scope.row">{{ scope.row[level2Item.prop] === 0 ? 0 : scope.row[level2Item.prop] || '' }}</slot>
              <!-- <span>{{ scope.row[level2Item.prop] === 0 ? 0 : scope.row[level2Item.prop] || '' }}</span> -->
            </template>
            <template v-if="level2Item.children">
              <template v-for="(level3Item, indexChild2) in level2Item.children">
                <el-table-column
                  v-if="level3Item.isShow"
                  :key="index+'-'+indexChild1+'-'+indexChild2"
                  align="center"
                  :show-overflow-tooltip="level3Item.tooltip || false"
                  :label="level3Item.label"
                  :prop="level3Item.prop"
                  :min-width="level3Item.width"
                >
                  <template slot-scope="scope">
                    <slot :name="level3Item.prop" :row="scope.row">{{ scope.row[level3Item.prop] === 0 ? 0 : scope.row[level3Item.prop] || '' }}</slot>
                    <!-- <span>{{ scope.row[level3Item.prop] === 0 ? 0 : scope.row[level3Item.prop] || '' }}</span> -->
                  </template>
                </el-table-column>
              </template>

            </template>
          </el-table-column>
        </template>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
/**
 * 调用示例
 * <refactor-table :loading='loading' :summary='summary' :data='list' :tableColumnsConfig='tableColumnsConfig' @selection-change="handleSelectionChange">
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
  name: 'MoreRefactorTable',
  props: {
    // 合计
    summary: {
      type: Boolean,
      default: false
    },
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
    morelist: {
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
    },

    indexfixed: {
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

<style lang="scss">
	.el-table__empty-block{
    width: 60px !important;
	  text-align: left !important;
    margin-left: 50% !important;
    justify-content: left !important;
	}
  .el-table__empty-text{
    width: auto;
  }
</style>


