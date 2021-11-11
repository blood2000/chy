<template>

  <div>
    <el-form :model="queryParams" :inline="true" label-width="100px">
      <el-form-item label="调度者">
        <FilterableSelect
          key="789"
          v-model="queryParams.disUserPhone"
          clearable
          style="width:255px"
          placeholder="请输入调度者手机号或名字"
          :axios="{
            queryFn:listAllData,
            queryData:{
              authStatus: 3,
              status: 0,
            }
          }"
          keywords="phoneOrName"
          :show-key="{
            value: 'code',
            label: 'disUserName'
          }"
          @selected="(data)=>{ handlerDisSelected(data);}"
        >
          <template #default="{row}">
            <span>{{ row.name }}</span><span>{{ row.telphone }}</span>
          </template>
        </FilterableSelect>
      </el-form-item>
    </el-form>

    <div>
      <RefactorTable
        :loading="loading"
        :data="userList"
        :table-columns-config="[
          {
            'label': '',
            'prop': 'radio',
            'isShow': true,
            'sortNum': 2,
            'width': '50',
            'tooltip': false
          },
          {
            'label': '调度组名称',
            'prop': 'name',
            'isShow': true,
            'sortNum': 2,
            'width': '120',
            'tooltip': true
          },
          {
            'label': '调度者姓名',
            'prop': 'disUserName',
            'isShow': true,
            'sortNum': 2,
            'width': '120',
            'tooltip': true
          },
          {
            'label': '调度者手机',
            'prop': 'disUserPhone',
            'isShow': true,
            'sortNum': 2,
            'width': '120',
            'tooltip': true
          },
        ]"
      >
        <template #radio="{row}">
          <el-radio :label="row"><span v-show="false">{{ row.code }}</span></el-radio>
        </template>
      </RefactorTable>
    </div>
  </div>
</template>

<script>
import FilterableSelect from '@/components/FilterableSelect';
import { listAllData } from '@/api/assets/team';
import { objReduce } from '@/utils/ddc';
import { deepClone } from '@/utils';


export default {

  components: { FilterableSelect },

  props: {
    cboneTselected: {
      type: Array,
      default: () => []
    }
  },

  data() {
    return {
      listAllData, // 调度者的接口

      // 查询参数
      queryParams: {
        disUserPhone: null
      },

      loading: false,
      userList: []
      // mycbDataByKeyword: null // 7/9 chj 添加
    };
  },

  computed: {
    cbDataByKeyword() {
      let obj = {};

      if (this.userList.length) {
        obj = { disUserCode: this.userList.map(e => e.disUserCode || e.code) };
      }
      return obj;
    }
  },

  watch: {
    cboneTselected: {
      handler(arr) {
        this.userList = objReduce(arr, 'code');
      },
      immediate: true,
      deep: true
    }
  },

  methods: {
    // 筛选出来的
    handlerDisSelected(data) {
      // 处理一下去重
      if (JSON.stringify(data) === '{}') return;
      const arr = deepClone(this.userList);
      arr.push(data);
      this.userList = objReduce(arr, 'code');
    },

    // 列表选中值
    handleSelectionChange(selection) {
      this.$emit('oneSelected', selection);
    }
  }

};
</script>

<style>

</style>
