<template>
  <div class="app-container">
    <el-form
      v-show="showSearch"
      ref="queryForm"
      :model="queryParams"
      :inline="true"
      label-width="130px"
    >
      <el-form-item
        label="合同编号"
        prop="contractNo"
      >
        <el-input
          v-model="queryParams.contractNo"
          placeholder="请输入合同编号"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item
        label="司机信息"
        prop="driverInfo"
      >
        <el-input
          v-model="queryParams.driverInfo"
          placeholder="请输入司机信息"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item
        label="司机 / 货主"
        prop="driverOrShipment"
      >
        <el-select
          v-model="queryParams.driverOrShipment"
          placeholder="请选择标合同类型"
          clearable
          filterable
          size="small"
          style="width: 240px"
        >
          <el-option
            v-for="dict in driverOrShipmentOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>


      <el-form-item>
        <el-button
          type="cyan"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
        >
          搜索
        </el-button>
        <el-button
          icon="el-icon-refresh"
          size="mini"
          @click="resetQuery"
        >
          重置
        </el-button>
      </el-form-item>
    </el-form>

    <el-row
      :gutter="10"
      class="mb8"
    >
      <el-col :span="1.5" style="float: right;">
        <tablec-cascader v-model="tableColumnsConfig" :lcokey="api" />
      </el-col>
      <right-toolbar
        :show-search.sync="showSearch"
        @queryTable="getList"
      />
    </el-row>

    <RefactorTable :loading="loading" :data="contractList" :table-columns-config="tableColumnsConfig"><!-- @selection-change="handleSelectionChange" -->
      <template #driverOrShipment="{row}">
        <span>{{ selectDictLabel(driverOrShipmentOptions, row.driverOrShipment) }}</span>
      </template>
      <template #isDzqzContract="{row}">
        <span>{{ selectDictLabel(isDzqzContractOptions, row.isDzqzContract) }}</span>
      </template>

      <template #edit="{row}">
        <el-button
          v-hasPermi="['transportation:orderContract:generate']"
          size="mini"
          type="text"
          icon="el-icon-printer"
          @click="handleInfo(row)"
        >打印</el-button>
      </template>
    </RefactorTable>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 生成电子合同 -->
    <el-dialog :title="title" :visible.sync="visible" width="800px" append-to-body>
      <div>123</div>
    </el-dialog>

  </div>
</template>

<script>
// import tableColumnsConfig from './config';

import { listContract, getContract, listContractApi } from '@/api/waybill/contract';

export default {
  'name': 'Contract',
  data() {
    return {
      tableColumnsConfig: [],
      api: listContractApi,
      // 遮罩层
      'loading': true,
      // 选中数组
      //   'ids': [],
      // 显示搜索条件
      'showSearch': true,
      // 总条数
      'total': 0,
      // 表格数据
      'contractList': [],

      // 查询参数
      'queryParams': {
        'pageNum': 1,
        'pageSize': 10,
        contractNo: undefined,
        driverInfo: undefined,
        driverOrShipment: undefined
      },
      // 弹框 内容
      visible: false,
      title: '',
      // ne 0 司机 1 货主
      driverOrShipmentOptions: [
        { 'dictLabel': '司机合同', 'dictValue': '0' },
        { 'dictLabel': '货主合同', 'dictValue': '1' }
      ],
      // 是否已经生成电子签章合同 0否 1是，2,正在生成''
      isDzqzContractOptions: [
        { 'dictLabel': '否', 'dictValue': '0' },
        { 'dictLabel': '是', 'dictValue': '1' },
        { 'dictLabel': '正在生成', 'dictValue': '2' }
      ]
    };
  },
  created() {
    this.tableHeaderConfig(this.tableColumnsConfig, listContractApi, {
      prop: 'edit',
      isShow: true,
      label: '操作',
      width: 180,
      fixed: 'right'
    });
    this.getList();
  },
  'methods': {
    /** 查询列表 */
    getList() {
      this.loading = true;
      listContract(this.queryParams).then(response => {
        this.contractList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },

    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm('queryForm');
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.code);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 详情按钮操作 */
    handleUpdate(row) {
      this.currentId = row.code;
      this.open = true;
      this.title = '查看运单详情';
      this.formDisable = true;
    },
    /** 标记异常按钮操作 */
    handleMark(row) {
      this.currentId = row.code;
      this.openMarkAbanormal = true;
      this.title = '标记异常';
    },
    /** 分单列表按钮操作 */
    handleSeperate(row) {
      this.currentId = row.code;
      this.openSeperateList = true;
      this.title = '子单列表';
    },
    // /** 删除按钮操作 */
    // handleDelete(row) {
    //   const ids = row.code || this.ids;
    //   this.$confirm('是否确认作废编号为"' + ids + '"的运单?', '警告', {
    //     'confirmButtonText': '确定',
    //     'cancelButtonText': '取消',
    //     'type': 'warning'
    //   }).then(function() {
    //     return delManages(ids);
    //   }).then(() => {
    //     this.getList();
    //     this.msgSuccess('作废成功');
    //   });
    // },
    // /** 备注按钮操作 */
    // handleRemarks(row) {
    //   this.currentId = row.code;
    //   this.openRemark = true;
    //   this.title = '编辑货主运单备注';
    // }
    /* 打印 */
    handleInfo(row) {
      this.visible = true;
      this.title = '电子合同';
      console.log(row.id);

      getContract(row.id).then(res => {
        console.log(res);
      });
    }
  }
};
</script>
