<template>

  <div>
    <el-form ref="queryForm" :model="queryParams" :inline="true" label-width="100px">
      <el-form-item label="调度者手机" prop="disUserPhone">
        <FilterableSelect
          v-model="queryParams.disUserPhone"
          clearable
          style="width:255px"
          placeholder="请输入调度者手机号"
          :axios="{
            queryFn:listAllData,
            queryData:{}
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
        :cb-data-by-keyword="mycbDataByKeyword"
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

export default {

  components: { FilterableSelect },

  data() {
    return {
      listAllData, // 调度者的接口

      // 查询参数
      queryParams: {
        disUserPhone: null
      },

      loading: false,
      userList: [],
      mycbDataByKeyword: undefined
    };
  },

  methods: {
    // 筛选出来的
    handlerDisSelected(data) {
      console.log(data);
      this.userList.push(data);

      console.log(this.userList);
    },

    // 列表选中值
    handleSelectionChange(selection) {
    //   console.log(selection);
      this.$emit('oneSelected', selection);
    }
  }

};
</script>

<style>

</style>
