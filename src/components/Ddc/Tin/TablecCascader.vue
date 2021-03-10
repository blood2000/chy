<template>
    <el-cascader
        :value='cInitData'
        :options="cOptions"
        :props="{ multiple: true }"
        collapse-tags
        @change='handleChange'
    ></el-cascader>
</template>

<script>
/**
 * 调用示例:
 * 
 * <TablecCascader :options='options' v-model="tableColumnsConfig"></TablecCascader> 
 * options: 展示所有
 * tableColumnsConfig: 返回选中的值
 **/ 
export default {
    name:'TablecCascader',
    props:{
        /** 下拉框格式:
         *  [{prop: 'infoId',label: '访问编号',},{prop: 'userName',label: '用户名称',}]
         */
        options:{
            type: Array,
            default: function () {
                return []
            }
        },
        /** 初始值格式和下拉框格式一样 */
        value:{
            type: Array,
            default: function () {
                return []
            }
        }
    },

    computed:{
        cOptions(){
            return this.options.map(item=>{
                return {
                    value: item,
                    label: item.label,
                }
            })
        },
        cInitData(){
            return this.value.map(item=>{
                return [item]
            })
        }
    },

    methods:{
        handleChange(value){
            let arr = []
            this.$emit('input', arr.concat(...value))
        }
    }

}
</script>

<style>

</style>