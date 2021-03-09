<template>
    <el-table v-loading="loading" :data="data" @selection-change="handleSelectionChange">
        
    <el-table-column type="selection" width="55" align="center" v-if="!!_events['selection-change']" />
    <template v-for="(th, key) in tableColumnsConfig">
        <el-table-column 
            :key="th.prop +''+ key"
            :align="th.align || 'center'"
            :prop="th.prop"
            :label="th.label"
            :width="th.width"
            :show-overflow-tooltip="th.tooltip || false"
            :formatter="th.formatter"
            >
            <template slot-scope="scope">
                    <slot :name="th.prop" :row='scope.row'>{{ scope.row[th.prop] }}</slot>
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
*/
export default {
        name: 'refactor-table',
        props: {
            /**
             * list  渲染所需数据
             * 如：[{infoId:1,ipaddr:'abc'},{infoId:2,ipaddr:'def'}]
             */
            data: {
                type: Array,
                default: function () {
                    return []
                }
            },

            /** 设置table 加载icon */
            loading: {
                type: Boolean,
                default: false
            },
            
            /**
             * tableColumnsConfig  表头动态配置数据
             * 如： {
                        prop: 'ipaddr',
                        label: '地址',
                        width: 130,
                        tooltip: true  默认false
                        align: 'center' 默认居中
                    }
             */
            tableColumnsConfig: {
                type: Array,
                default: function () {
                    return []
                }
            }
        },
        methods: {
            handleSelectionChange(selection){
                this.$emit('selection-change',selection)
            }
        }
    }
</script>

<style>

</style>