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
            v-model.trim="queryParams.contractNo"
            placeholder="请输入合同编号"
            clearable
            size="small"
            style="width: 250px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item
          label="司机信息"
          prop="driverInfo"
        >
          <el-input
            v-model.trim="queryParams.driverInfo"
            placeholder="请输入司机信息"
            clearable
            size="small"
            style="width: 250px"
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
            style="width: 250px"
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
          label="电子合同"
          prop="isDzqzContract"
        >
          <el-select
            v-model="queryParams.isDzqzContract"
            placeholder="请选择是否电子合同"
            clearable
            filterable
            size="small"
            style="width: 250px"
          >
            <el-option
              v-for="dict in isDzqzContractOptions"
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
            v-model.trim="queryParams.waybillNo"
            placeholder="请输入运输单号"
            clearable
            size="small"
            style="width: 250px"
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
            unlink-panels
            :picker-options="pickerOptions"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            style="width: 250px"
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
            :disabled="multiple || isDzqzContract!==0"
            :loading="loadingSign"
            @click="handleSign"
          >批量生成电子章</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="warning"
            icon="el-icon-magic-stick"
            size="mini"
            :disabled="multiple || isDzqzContract!==1"
            :loading="downloadLoadin"
            @click="downloadElectronic"
          >批量下载电子章合同</el-button>
        </el-col>

        <el-col :span="1.5" style="float: right;">
          <tablec-cascader v-model="tableColumnsConfig" :lcokey="api" />
        </el-col>
        <right-toolbar
          :show-search.sync="showSearch"
          @queryTable="getList"
        />
      </el-row>

      <RefactorTable :loading="loading" :data="contractList" :table-columns-config="tableColumnsConfig" @selection-change="handleSelectionChange">
        <template #driverOrShipment="{row}">
          <span>{{ selectDictLabel(driverOrShipmentOptions, row.driverOrShipment) }}</span>
        </template>
        <template #isDzqzContract="{row}">
          <span>{{ selectDictLabel(isDzqzContractOptions, row.isDzqzContract) }}</span>
        </template>
        <template #goodsAmount="{row}">
          <span>{{ floor(row.goodsAmount) }}</span>
        </template>
        <template #loadWeight="{row}">
          <span v-if="row.stowageStatus === '1'">{{ fixed(row.loadWeight) || '0.000' }} 方</span>
          <span v-if="row.stowageStatus === '2'">{{ floor(row.loadWeight, 0) || '0' }} 车</span>
          <span v-if="row.stowageStatus === '0' || !row.stowageStatus">{{ fixed(row.loadWeight) || '0.000' }} 吨</span>
        </template>

        <template #edit="{row}">
          <el-button
            v-hasPermi="['transportation:orderContract:generate']"
            size="mini"
            type="text"
            @click="handleInfo(row)"
          >打印</el-button>
          <el-button
            v-if="row.isDzqzContract+'' !== '1'"
            size="mini"
            type="text"
            @click="handleElectron(row)"
          >生成电子章</el-button>
          <el-button
            v-if="row.isDzqzContract+'' === '3'"
            size="mini"
            type="text"
            @click="handleMessage(row)"
          >失败原因</el-button>
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
        <template v-if="financialOption === 3">
          <ShanxiDriverContract v-if="driverOrShipment === 0" :obj="dialogData" />
          <ShanxiShipmentContract v-else :obj="dialogData" />
        </template>
        <template v-else>
          <driver-contract v-if="driverOrShipment === 0" :obj="dialogData" />
          <shipment-contract v-else :obj="dialogData" />
        </template>
      </div>
    </el-dialog>
    <!-- 预览pdf -->
    <pdf-look ref="PdfLook" :open.sync="pdfdialog" :title="title" :src="pdfsrc" />
  </div>
</template>

<script>
import { handleBatchDownload } from '../../../libs/batchCompression';
// import tableColumnsConfig from './config';
import DriverContract from './DriverContract';
import ShipmentContract from './ShipmentContract';
import ShanxiDriverContract from './ShanxiDriverContract';
import ShanxiShipmentContract from './ShanxiShipmentContract';

import { listContract, getContractByCode, listContractApi, getShipmentSign, getDriverSign, getContractSign } from '@/api/waybill/contract';
import { pickerOptions } from '@/utils/dateRange';
import PdfLook from '@/views/system/media/pdfLook.vue';
export default {
  'name': 'Contract',
  components: { DriverContract, ShipmentContract, PdfLook, ShanxiDriverContract, ShanxiShipmentContract },
  data() {
    return {
      pickerOptions,
      // 弹框 内容
      visible: false,
      title: '',
      dialogData: null, // 弹框数据
      financialOption: 3, // 主体类型 （1：网商，2：民生 3.山西网商）3是山西，其他就是大道成的
      driverOrShipment: 0, // 合同类型 0 司机 1 货主
      pdfdialog: false,
      pdfsrc: '',
      tableColumnsConfig: [],
      api: listContractApi,
      // 遮罩层
      'loading': true,
      // 选中数组
      ids: [],
      selectedList: [], // 选中的完整数据
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
        endReceiveTime: undefined,
        isDzqzContract: undefined
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
        { 'dictLabel': '生成失败', 'dictValue': '3' }
      ],
      loadingSign: false,
      downloadLoadin: false
    };
  },

  computed: {
    // 判断批量是打印, 还是 下载
    isDzqzContract() {
      let dzqzStatus = 0;

      const arr1 = [];
      const arr2 = [];

      if (this.selectedList && this.selectedList.length > 0) {
        this.selectedList.forEach(e => {
          if (e.isDzqzContract === 0 || e.isDzqzContract === 2) {
            arr1.push(true);
          } else if (e.isDzqzContract === 1) {
            arr2.push(true);
          }
        });

        if (arr1.length === this.selectedList.length) {
          dzqzStatus = 0;
        }
        if (arr2.length === this.selectedList.length) {
          dzqzStatus = 1;
        }
      }

      return dzqzStatus;
    }
  },

  created() {
    this.tableHeaderConfig(this.tableColumnsConfig, listContractApi, {
      prop: 'edit',
      isShow: true,
      label: '操作',
      width: 180,
      fixed: 'left'
    });
    this.queryParams.startReceiveTime = this.parseTime(new Date().getTime() - 24 * 60 * 60 * 1000 * 2, '{y}-{m}-{d}');
    this.queryParams.endReceiveTime = this.parseTime(new Date(), '{y}-{m}-{d}');
    this.receiveTime = [new Date(new Date().getTime() - 24 * 60 * 60 * 1000 * 2), new Date()];
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
      this.selectedList = selection;
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
      // if (row.isDzqzContract === 1) {
      //   this.pdfdialog = true;
      //   this.title = '电子合同';
      //   if (row.contractPath.startsWith('https://css-backup')) {
      //     const str = (row.contractPath.split('.com'))[1];
      //     this.pdfsrc = `/pdf${str}`;
      //   } else {
      //     this.pdfsrc = row.mediaUrl;
      //   }
      // } else {
      //   this.title = '电子合同';
      //   this.driverOrShipment = row.driverOrShipment;

      //   const { data } = await getContractByCode(row.code);

      //   this.dialogData = { ...data, contractPath: row.contractPath, isDzqzContract: row.isDzqzContract };
      //   console.log(data);
      //   this.visible = true;
      // }
      this.title = '电子合同';
      this.driverOrShipment = row.driverOrShipment;

      const { data } = await getContractByCode(row.code);

      this.dialogData = { ...data, contractPath: row.contractPath, isDzqzContract: row.isDzqzContract, sealPath: row.sealPath };
      console.log(this.dialogData);
      console.log(this.driverOrShipment);
      this.visible = true;
    },

    /** 生成电子章合同 */
    async handleElectron(row) {
      var that = this;
      that.waybill = (await getContractByCode(row.code)).data;
      that.waybill.financialOption = row.financialOption;

      // that.waybill.createTime = new Date(that.waybill.createTime);
      // that.waybill.loadTime = new Date(that.waybill.loadTime);
      console.log(that.waybill);
      if (!that.waybill.electronic.idNumber) {
        that.msgWarning('货主或司机的身份证号码不能为空！');
      } else if (!that.waybill.electronic.userCode) {
        that.msgWarning('货主或司机的编码不能为空！');
      } else if (!that.waybill.electronic.name) {
        that.msgWarning('货主或司机的名称不能为空！');
      } else if (!that.waybill.electronic.phone) {
        that.msgWarning('货主或司机的电话号码不能为空！');
      } else {
        that.$confirm('生成电子签章合同? 大概用时20秒才可生成电子签章合同', '警告', {
          'confirmButtonText': '确定',
          'cancelButtonText': '取消',
          'type': 'warning'
        }).then(function() {
          that.loading = true;
          if (row.driverOrShipment === 0) {
            return getDriverSign(that.waybill).catch(() => { that.loading = false; });
          } else {
            if (!that.waybill.electronic.shipmentId) {
              that.msgWarning('货主编码不能为空！');
            } else if (!that.waybill.shipmentCompanyName) {
              that.msgWarning('货主公司名称不能为空！');
            } else if (!that.waybill.shipmentOrganizationCodeNo) {
              that.msgWarning('货主公司统一信用代码不能为空！');
            } else {
              return getShipmentSign(that.waybill).catch(() => { that.loading = false; });
            }
          }
        }).then(() => {
          that.getList();
        }).catch(() => {});
      }
    },
    handleMessage(row) {
      this.$confirm(row.contractFailMessage, '生成电子签章失败原因', {
        'confirmButtonText': '确定',
        'type': 'warning'
      });
    },
    // 批量签章
    handleSign() {
      const listSign = this.selectedList;

      const arr = listSign.filter(e => e.isDzqzContract === 1);

      if (arr.length) {
        this.msgWarning('请确保,选中的都是未生成过的成电子签章的合同');
        return;
      }


      this.$confirm('平均每份合同耗时20秒，确认批量生成电子签章合同？', '批量生成电子章', {
        'confirmButtonText': '确定',
        'cancelButtonText': '取消',
        'type': 'warning'
      }).then(() => {
        getContractSign(this.selectedList.map(e => (e.code + ';' + e.financialOption))).then(res => {
          this.getList();
        });
      }).catch(() => {});
    },
    // 下载电子合同
    handleDownload(row) {
      window.open(row.contractPath);
    },

    // 批量下载
    downloadElectronic() {
      const arrData = this.selectedList;

      // 正式上直接请求??

      // let batchUrl = [];

      // if (process.env.NODE_ENV === 'production') {
      //   batchUrl = arrData.filter(e => e.contractPath).map(e => e.contractPath);
      // } else {
      //   batchUrl = arrData.filter(e => e.contractPath).map(e => {
      //     const str = (e.contractPath.split('.com'))[1];
      //     return `/pdf${str}`;
      //   });
      // }

      const batchUrl = arrData.filter(e => e.contractPath).map(e => {
        const str = (e.contractPath.split('.com'))[1];
        return `/pdf${str}`;
      });

      if (batchUrl.length) {
        this.downloadLoadin = true;
        handleBatchDownload(batchUrl, undefined, () => {
          // console.log('下载完成');
          this.downloadLoadin = false;
        }, () => {
          this.downloadLoadin = false;
        });
      } else {
        this.msgWarning('请确保,选中的都是已生成过的成电子签章的合同');
      }
    }


  }
};
</script>
