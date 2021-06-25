<template>
  <div>
    <div v-show="showSearch" class="app-container app-container--search">
      <el-form
        ref="queryForm"
        :model="queryParams"
        :inline="true"
        label-width="90px"
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
            style="width: 260px"
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
            style="width: 260px"
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
            style="width: 260px"
          >
            <el-option
              v-for="dict in driverOrShipmentOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="运输单号"
          prop="waybillNo"
        >
          <el-input
            v-model="queryParams.waybillNo"
            placeholder="请输入运输单号"
            clearable
            size="small"
            style="width: 260px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item
          label="接单日期"
          prop="receiveTime"
        >
          <el-date-picker
            v-model="receiveTime"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            style="width: 228px"
            @change="datechoose"
          />
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            icon="el-icon-search"
            size="mini"
            @click="handleQuery"
          >
            搜索
          </el-button>
          <el-button
            type="primary"
            plain
            icon="el-icon-refresh"
            size="mini"
            @click="resetQuery"
          >
            重置
          </el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="app-container">
      <el-row
        :gutter="10"
        class="mb8"
      >
        <el-col :span="1.5">
          <el-button
            type="warning"
            icon="el-icon-magic-stick"
            size="mini"
            :disabled="multiple"
            :loading="loadingSign"
            @click="handleSign"
          >批量生成电子章</el-button>
        </el-col>

        <el-col :span="1.5" style="float: right;">
          <tablec-cascader v-model="tableColumnsConfig" :lcokey="api" />
        </el-col>
        <right-toolbar
          :show-search.sync="showSearch"
          @queryTable="getList"
        />
      </el-row>

      <RefactorTable :loading="loading" :data="contractList" :table-columns-config="tableColumnsConfig" :selectable="checkboxT" @selection-change="handleSelectionChange">
        <template #driverOrShipment="{row}">
          <span>{{ selectDictLabel(driverOrShipmentOptions, row.driverOrShipment) }}</span>
        </template>
        <template #isDzqzContract="{row}">
          <span>{{ selectDictLabel(isDzqzContractOptions, row.isDzqzContract) }}</span>
        </template>
        <template #loadWeight="{row}">
          <span v-if="row.stowageStatus === '1'">{{ row.loadWeight || '0.00' }} 方</span>
          <span v-if="row.stowageStatus === '2'">{{ row.loadWeight || '0.00' }} 车</span>
          <span v-if="row.stowageStatus === '0' || !row.stowageStatus">{{ row.loadWeight || '0.00' }} 吨</span>
        </template>

        <template #edit="{row}">
          <el-button
            v-hasPermi="['transportation:orderContract:generate']"
            size="mini"
            type="text"
            @click="handleInfo(row)"
          >打印</el-button>
          <el-button
            v-if="row.isDzqzContract+'' === '0'"
            v-hasPermi="['transportation:orderContract:generate']"
            size="mini"
            type="text"
            @click="handleElectron(row)"
          >生成电子章</el-button>
        </template>
      </RefactorTable>

      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getList"
      />
    </div>
    <!-- 打印合同 -->
    <el-dialog :title="title" :visible.sync="visible" width="1200px" append-to-body>
      <div v-if="dialogData && visible">
        <driver-contract v-if="driverOrShipment === 0" :obj="dialogData" />
        <shipment-contract v-else :obj="dialogData" />
      </div>
    </el-dialog>
  </div>
</template>

<script>
// import tableColumnsConfig from './config';
import DriverContract from './DriverContract';
import ShipmentContract from './ShipmentContract';

import { listContract, getContractByCode, listContractApi, getShipmentSign, getDriverSign, getContractSign } from '@/api/waybill/contract';

export default {
  'name': 'Contract',
  components: { DriverContract, ShipmentContract },
  data() {
    return {
      // 弹框 内容
      visible: false,
      title: '',
      dialogData: null, // 弹框数据
      driverOrShipment: 0, // 合同类型 0 司机 1 货主

      tableColumnsConfig: [],
      api: listContractApi,
      // 遮罩层
      'loading': true,
      // 选中数组
      ids: [],
      multiple: true,
      // 显示搜索条件
      'showSearch': true,
      // 总条数
      'total': 0,
      // 表格数据
      'contractList': [],
      waybill: {},
      // 查询参数
      'queryParams': {
        'pageNum': 1,
        'pageSize': 10,
        contractNo: undefined,
        driverInfo: undefined,
        driverOrShipment: undefined,
        waybillNo: undefined,
        startReceiveTime: undefined,
        endReceiveTime: undefined
      },
      receiveTime: [],

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
      ],
      loadingSign: false
    };
  },
  created() {
    this.tableHeaderConfig(this.tableColumnsConfig, listContractApi, {
      prop: 'edit',
      isShow: true,
      label: '操作',
      width: 180,
      fixed: 'left'
    });
    this.getList();
  },
  'methods': {
    datechoose(date) {
      if (date) {
        this.queryParams.startReceiveTime = this.parseTime(date[0], '{y}-{m}-{d}');
        this.queryParams.endReceiveTime = this.parseTime(date[1], '{y}-{m}-{d}');
      } else {
        this.queryParams.startReceiveTime = null;
        this.queryParams.endReceiveTime = null;
      }
    },
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
      this.receiveTime = [];
      this.queryParams.startReceiveTime = null;
      this.queryParams.endReceiveTime = null;
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.code);
      this.multiple = !selection.length;
    },
    checkboxT(row) {
      if (row.isDzqzContract === 1) {
			  return false;
      } else {
			  return true;
      }
    },

    /* 打印 */
    async handleInfo(row) {
      if (row.isDzqzContract === 1) {
        // window.open(row.contractPath, '_blank');
      } else {
        this.title = '电子合同';
        this.driverOrShipment = row.driverOrShipment;

        const { data } = await getContractByCode(row.code);

        this.dialogData = { ...data, contractPath: row.contractPath, isDzqzContract: row.isDzqzContract };
        console.log(data);
        this.visible = true;
      }
    },

    /** 生成电子章合同 */
    async handleElectron(row) {
      var that = this;
      that.waybill = (await getContractByCode(row.code)).data;
      that.waybill.createTime = new Date(that.waybill.createTime);
      that.waybill.loadTime = new Date(that.waybill.loadTime);
      console.log(that.waybill);
      if (that.waybill.electronic.idNumber) {
        that.$confirm('生成电子签章合同? 大概用时20秒才可生成电子签章合同', '警告', {
          'confirmButtonText': '确定',
          'cancelButtonText': '取消',
          'type': 'warning'
        }).then(function() {
          if (row.driverOrShipment === 0) {
            return getDriverSign(that.waybill);
          } else {
            return getShipmentSign(that.waybill);
          }
        }).then(() => {
          that.getList();
        }).catch(() => {});
      } else {
        that.msgWarning('货主或司机的身份证号码不能为空！');
      }
    },
    handleSign() {
      this.$confirm('平均每份合同耗时20秒，确认批量生成电子签章合同？', '批量生成电子章', {
        'confirmButtonText': '确定',
        'cancelButtonText': '取消',
        'type': 'warning'
      }).then(() => {
        getContractSign(this.ids).then(res => {
          this.getList();
        });
      }).catch(() => {});
    },
    // 下载电子合同
    handleDownload(row) {
      window.open(row.contractPath);
    }
  }
};
</script>
