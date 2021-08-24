<template>

  <div>
    <el-form ref="queryForm" :model="queryParams" :inline="true" label-width="100px">
      <el-form-item label="调度者" prop="disUserPhone">
        <FilterableSelect
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
            label: 'name'
          }"
          @selected="(data)=>{ handlerDisSelected(data);}"
        >
          <template #default="{row}">
            <span>{{ row.name }}</span><span>{{ row.telphone }}</span>
          </template>
        </FilterableSelect>
      </el-form-item>
      <!-- <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQueryTeam">搜索</el-button>
        <el-button type="primary" plain icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item> -->
    </el-form>

    <div>
      <RefactorTable
        :loading="loading"
        :data="userList"
        :table-columns-config="[
          {
            'label': '调度组名称',
            'prop': 'disName',
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
        :cb-data-by-keyword="cbDataByKeyword"
        @selection-change="handleSelectionChange"
      >
        <!-- <template #isOften="{row}">
          <span>{{ selectDictLabel(isOftenOptions, row.isOften) }}</span>
        </template>
        <template #isNotInvoice="{row}">
          <span>{{ selectDictLabel(isNotInvoiceOptions, row.isNotInvoice) }}</span>
        </template> -->
        <!-- <template #edit="{row}">
          <el-button
            v-hasPermi="['transportation:dispatch:del']"
            size="mini"
            type="text"
            @click="handleDelete(row)"
          >删除</el-button>
        </template> -->
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
