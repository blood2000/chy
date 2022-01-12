<template>
  <div class="pr">
    <div ref="searchBox">
      <el-form v-show="showSearch" ref="queryForm" :model="queryParams" :inline="true" label-width="90px" class="clearfix app-container" @submit.native.prevent>

        <!-- 数据上报 -->
        <el-form-item label="支付批次号" prop="bizNo">
          <el-input
            v-model.trim="queryParams.bizNo"
            placeholder="请输入支付批次号"
            clearable
            size="small"
            style="width: 228px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="发货企业" prop="companyName">
          <el-input
            v-model.trim="queryParams.companyName"
            placeholder="请输入发货企业"
            clearable
            size="small"
            style="width: 228px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="司机" prop="driverName">
          <el-input
            v-model.trim="queryParams.driverName"
            placeholder="请输入司机"
            clearable
            size="small"
            style="width: 228px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="车牌号" prop="licenseNumber">
          <el-input
            v-model.trim="queryParams.licenseNumber"
            placeholder="请输入车牌号"
            clearable
            size="small"
            style="width: 228px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="货源单号" prop="mainOrderNumber">
          <el-input
            v-model.trim="queryParams.mainOrderNumber"
            placeholder="请输入货源单号"
            clearable
            size="small"
            style="width: 228px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="车队名称" prop="teamName">
          <el-input
            v-model.trim="queryParams.teamName"
            placeholder="请输入车队名称"
            clearable
            size="small"
            style="width: 228px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="运输单号" prop="waybillNo">
          <el-input
            v-model.trim="queryParams.waybillNo"
            placeholder="请输入运输单号"
            clearable
            size="small"
            style="width: 228px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>

        <!-- 下拉框 -->
        <el-form-item label="流水上报" prop="billSendStatus">
          <el-select v-model="queryParams.billSendStatus" placeholder="----请选择----" clearable filterable style="width: 228px">
            <el-option
              v-for="(dict,index) in dicts['billSendStatus_option'] || []"
              :key="index"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="司机上报" prop="driverReport">
          <el-select v-model="queryParams.driverReport" placeholder="----请选择----" clearable filterable style="width: 228px">
            <el-option
              v-for="(dict,index) in dicts['driverReport_option'] || []"
              :key="index"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="车辆上报" prop="vehicleReport">
          <el-select v-model="queryParams.vehicleReport" placeholder="----请选择----" clearable filterable style="width: 228px">
            <el-option
              v-for="(dict,index) in dicts['vehicleReport_option'] || []"
              :key="index"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="运单上报" prop="waybillSendStatus">
          <el-select v-model="queryParams.waybillSendStatus" placeholder="----请选择----" clearable filterable style="width: 228px">
            <el-option
              v-for="(dict,index) in dicts['waybillSendStatus_option'] || []"
              :key="index"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            />
          </el-select>
        </el-form-item>

        <!-- 标记状态 -->
        <el-form-item label="标记异常" prop="reportMarkStatus">
          <el-select v-model="queryParams.reportMarkStatus" placeholder="----请选择----" clearable filterable style="width: 228px">
            <el-option
              v-for="(dict,index) in dicts['reportMarkStatus_option'] || []"
              :key="index"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            />
          </el-select>
        </el-form-item>
        <!--  -->
        <el-form-item label="上报状态" prop="isReport">
          <el-select v-model="queryParams.isReport" placeholder="----请选择----" clearable filterable style="width: 228px">
            <el-option
              v-for="(dict,index) in reportStatusOP"
              :key="index"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            />
          </el-select>
        </el-form-item>

        <!-- 时间筛选框 -->
        <el-form-item label="接单日期" prop="receiveTime">
          <el-date-picker
            v-model="receiveTime"
            type="daterange"
            unlink-panels
            :picker-options="pickerOptions"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            style="width: 228px"
            @change="datechoose"
          />
        </el-form-item>

        <!-- 做远程使用的 -->
        <!-- <el-form-item label="货主" prop="tin6" size="small">
        <el-select
          v-model="queryParams.tin6"
          v-el-select-loadmore="loadmore"
          filterable
          clearable
          remote
          reserve-keyword
          placeholder="请输入关键词"
          :remote-method="remoteMethod"
          :loading="loading"
          style="width: 150px"
          @keyup.enter.native="handleQuery"
        >
          <el-option
            v-for="(item, index1) in shipmentList"
            :key="index1"
            :value="item.code"
            :label="item.adminName"
          >
            <div class="ly-flex-pack-justify"><span>{{ item.adminName }}</span><span>{{ item.telphone }}</span></div>
          </el-option>
        </el-select>
      </el-form-item> -->

        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5" class="fr">
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh" type="primary" plain size="mini" @click="resetQuery">重置</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>

    <div class="app-container">
      <el-row :gutter="10" class="mb8">

        <!-- 做切换使用 -->
        <!-- <el-col v-if="false" :span="1.5">
          <el-radio-group v-model="active" size="small" @change="handleClick">
            <el-radio-button label="0">已校验</el-radio-button>
            <el-radio-button label="1">未校验</el-radio-button>
          </el-radio-group>
        </el-col> -->

        <!-- 做批量按钮使用 -->
        <el-col :span="1.5">
          <el-button
            v-hasPermi="['transportation:waybillReport:export']"
            type="warning"
            icon="el-icon-download"
            size="mini"
            :loading="loadingExport"
            @click="handleExport"
          >导出</el-button>
          <el-button
            v-hasPermi="['transportation:waybillReport:batch']"
            :disabled="loading || !ids.length"
            type="info"
            icon="el-icon-s-order"
            size="mini"
            @click="handleReport"
          >批量上报</el-button>
          <el-button
            v-if="false"
            v-hasPermi="['data:report:import']"
            type="info"
            icon="el-icon-upload2"
            size="mini"
            @click="handleImport"
          >批量导入</el-button>
          <el-button
            v-if="false"
            v-hasPermi="['data:report:download']"
            type="primary"
            icon="el-icon-download"
            size="mini"
            @click="handleDownload"
          >下载模板</el-button>
          <el-button
            v-if="false"
            v-hasPermi="['data:report:update']"
            type="success"
            icon="el-icon-s-open"
            size="mini"
            @click="handleUpdate"
          >更新网商打款状态</el-button>
        </el-col>

        <!-- 右边统一位置 -->
        <el-col :span="1.5" class="fr">
          <tablec-cascader v-model="tableColumnsConfig" :lcokey="listApi" />
        </el-col>
        <right-toolbar :show-search.sync="showSearch" @queryTable="getList" />

      </el-row>

      <!-- 表格 -->
      <RefactorTable
        is-show-index
        :loading="loading"
        :data="list"
        :table-columns-config="tableColumnsConfig"
        :row-key="(row)=> row.waybillNo"
        reserve-selection
        :row-class-name="tableRowClassName"
        :selectable="checkboxT"
        @selection-change="handleSelectionChange"
      >
        <!-- row-key="id" -->
        <!-- :tree-props="{children: 'children', hasChildren: 'hasChildren'}" -->
        <!-- @selection-change="handleSelectionChange" -->
        <!-- :height="theight" -->
        <!-- :row-class-name="tableRowClassName" -->
        <!-- 装货地 -->

        <template #isReport="{row}">
          <el-tooltip v-if="row.noReportMsg" class="item" effect="dark" :content="row.noReportMsg" placement="top">
            <span class="g-color-error shou">{{ row.isReport || row.isReport == 0 ? selectDictLabel( reportStatusOP, row.isReport - 0 ): '-' }}</span>
          </el-tooltip>
          <span v-else>{{ row.isReport || row.isReport == 0 ? selectDictLabel( reportStatusOP, row.isReport - 0 ): '-' }}</span>
        </template>

        <template #isAbnormal="{row}">
          <span :class="row.isAbnormal == '1'?'g-color-success':'g-color-error'">{{ selectDictLabel(dicts['isAbnormal_option'], (row.isAbnormal? row.isAbnormal: 0)) }}</span>
        </template>
        <template #reportMarkStatus="{row}">
          <span :class="!row.reportMarkStatus?'g-color-success':'g-color-error'">{{ selectDictLabel(dicts['reportMarkStatus_option'], (row.reportMarkStatus? row.reportMarkStatus: 0)) }}</span>
        </template>

        <template #vehicleReport="{row}">
          <div :class="row.vehicleReport == '0'?'shou':null">
            <span v-if="row.vehicleReport == '0'" class="g-color-error" @click="handlerReport(row, 'vehicleReport', row.vehicleReport == '1')">
              <svg-icon icon-class="not-reported" class-name="mr10" />未上报
            </span>
            <span v-if="row.vehicleReport == '1'" class="g-color-success"><svg-icon icon-class="reported" class-name="mr10" />已上报</span>
            <span v-if="row.vehicleReport == '2'" class="g-color-warning">上报失败</span>
            <span v-if="row.vehicleReport == '3'" class="g-color-warning">上报中</span>
            <span v-if="row.vehicleReport == '4'" class="g-color-warning">数据异常</span>
          </div>
        </template>
        <template #driverReport="{row}">
          <div :class="row.driverReport == '0'?'shou':null">
            <span v-if="row.driverReport == '0'" class="g-color-error" @click="handlerReport(row, 'driverReport', row.driverReport == '1')">
              <svg-icon icon-class="not-reported" class-name="mr10" />未上报
            </span>
            <span v-if="row.driverReport == '1'" class="g-color-success"><svg-icon icon-class="reported" class-name="mr10" />已上报</span>
            <span v-if="row.driverReport == '2'" class="g-color-warning">上报失败</span>
            <span v-if="row.driverReport == '3'" class="g-color-warning">上报中</span>
            <span v-if="row.driverReport == '4'" class="g-color-warning">数据异常</span>
          </div>
        </template>
        <template #waybillSendStatus="{row}">
          <el-tooltip :content="row.waybillErrMsg" :disabled="row.waybillErrMsg?false:true" effect="light">
            <div :class="row.waybillSendStatus == '0'?'shou':null">
              <span v-if="row.waybillSendStatus == '0'" class="g-color-error" @click="handlerReport(row, 'waybillSendStatus', row.waybillSendStatus == '1')">
                <svg-icon icon-class="not-reported" class-name="mr10" />未上报
              </span>
              <span v-if="row.waybillSendStatus == '1'" class="g-color-success"><svg-icon icon-class="reported" class-name="mr10" />已上报</span>
              <span v-if="row.waybillSendStatus == '2'" class="g-color-warning">上报失败</span>
              <span v-if="row.waybillSendStatus == '3'" class="g-color-warning">上报中</span>
              <span v-if="row.waybillSendStatus == '4'" class="g-color-warning">数据异常</span>
            </div>
          </el-tooltip>
        </template>
        <template #loadSendStatus="{row}">
          <el-tooltip :content="row.loadErrMsg" :disabled="row.loadErrMsg?false:true" effect="light">
            <div :class="row.loadSendStatus == '0'?'shou':null">
              <span v-if="row.loadSendStatus == '0'" class="g-color-error" @click="handlerReport(row, 'loadSendStatus', row.loadSendStatus == '1')">
                <svg-icon icon-class="not-reported" class-name="mr10" />未上报
              </span>
              <span v-if="row.loadSendStatus == '1'" class="g-color-success"><svg-icon icon-class="reported" class-name="mr10" />已上报</span>
              <span v-if="row.loadSendStatus == '2'" class="g-color-warning">上报失败</span>
              <span v-if="row.loadSendStatus == '3'" class="g-color-warning">上报中</span>
              <span v-if="row.loadSendStatus == '4'" class="g-color-warning">数据异常</span>
            </div>
          </el-tooltip>
        </template>
        <template #unloadSendStatus="{row}">
          <el-tooltip :content="row.unloadErrMsg" :disabled="row.unloadErrMsg?false:true" effect="light">
            <div :class="row.unloadSendStatus == '0'?'shou':null">

              <span v-if="row.unloadSendStatus == '0'" class="g-color-error" @click="handlerReport(row, 'unloadSendStatus', row.unloadSendStatus == '1')">
                <svg-icon icon-class="not-reported" class-name="mr10" />未上报
              </span>
              <span v-if="row.unloadSendStatus == '1'" class="g-color-success"><svg-icon icon-class="reported" class-name="mr10" />已上报</span>
              <span v-if="row.unloadSendStatus == '2'" class="g-color-warning">上报失败</span>
              <span v-if="row.unloadSendStatus == '3'" class="g-color-warning">上报中</span>
              <span v-if="row.unloadSendStatus == '4'" class="g-color-warning">数据异常</span>
            </div>
          </el-tooltip>

        </template>
        <template #billSendStatus="{row}">
          <el-tooltip :content="row.billErrMsg" :disabled="row.billErrMsg?false:true" effect="light">
            <div :class="row.billSendStatus == '0'?'shou':null">

              <span v-if="row.billSendStatus == '0'" class="g-color-error" @click="handlerReport(row, 'billSendStatus', row.billSendStatus == '1')">
                <svg-icon icon-class="not-reported" class-name="mr10" />未上报
              </span>
              <span v-if="row.billSendStatus == '1'" class="g-color-success"><svg-icon icon-class="reported" class-name="mr10" />已上报</span>
              <span v-if="row.billSendStatus == '2'" class="g-color-warning">上报失败</span>
              <span v-if="row.billSendStatus == '3'" class="g-color-warning">上报中</span>
              <span v-if="row.billSendStatus == '4'" class="g-color-warning">数据异常</span>
            </div>
          </el-tooltip>

        </template>

        <template #waybillStatus="{row}">
          <span v-if="row.waybillStatus == '0'" class="g-color-error">未接单</span>
          <span v-if="row.waybillStatus == '1'" class="g-color-success">已接单</span>
          <span v-if="row.waybillStatus == '2'" class="g-color-success">已装货</span>
          <span v-if="row.waybillStatus == '3'" class="g-color-success">已签收(已卸货)</span>
          <span v-if="row.waybillStatus == '4'" class="g-color-success">已回单</span>
          <span v-if="row.waybillStatus == '5'" class="g-color-success">已核算</span>
          <span v-if="row.waybillStatus == '6'" class="g-color-success">已申请（打款）</span>
          <span v-if="row.waybillStatus == '7'" class="g-color-success">已打款</span>
          <span v-if="row.waybillStatus == '8'" class="g-color-success">已申请开票</span>
          <span v-if="row.waybillStatus == '9'" class="g-color-success">已开票</span>
        </template>

        <template #edit="{row}">
          <!-- 前3个的放这里 -->
          <el-button
            v-hasPermi="['data:report:detail']"
            size="mini"
            type="text"
            @click="handleEdit(row, 'detail')"
          >详情</el-button>



          <el-button
            v-hasPermi="['transportation:waybillReport:mark']"
            size="mini"
            type="text"
            @click="handleEdit(row, 'mark')"
          >{{ !row.reportMarkStatus? '标记异常':'取消异常' }}</el-button>

          <!-- v-hasPermi="['data:report:report']" -->
          <el-button
            v-if="false"
            v-has-permi="['transportation:waybillReport:batch']"
            :disabled="loading"
            size="mini"
            type="text"
            @click="handleEdit(row, 'report')"
          >上报</el-button>

          <el-button
            v-if="false"
            v-hasPermi="['data:report:check']"
            size="mini"
            type="text"
            @click="handleEdit(row, 'check')"
          >查看校验</el-button>



          <!-- 大于3个按钮的使用这个... -->
          <TableDropdown v-if="row.isChild == 2 && user.userCode !== '9b8afa19203c488282b05e04096b0bdd'">
            <el-dropdown-item>
              <el-button
                v-hasPermi="['transportation:waybill:childList']"
                size="mini"
                type="text"
                @click="handleEdit(row, 'seperate')"
              >分单列表</el-button>
            </el-dropdown-item>
          </TableDropdown>
        </template>
      </RefactorTable>

      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getList"
      />
      <!-- :page-sizes="[2,10,20]" -->
    </div>


    <!-- 弹框使用  class类 i-price 是使用图片了 -->
    <!-- 弹框内的组件 -->
    <el-dialog :title="'查看校验结果'" class="i-price" :visible.sync="open" width="70%" :close-on-click-modal="false" append-to-body>
      <check-result v-if="open" :prop-data="openData" @refresh="(bool)=>{open = false; bool && getList()}" />
    </el-dialog>

    <!-- 分单列表 -->
    <child-dialog ref="ChildDialog" :open.sync="childdialog" :title="'子单列表'" @refresh="getList" />
    <!-- 运单详情 对话框 -->
    <detail-dialog ref="DetailDialog" :current-id="currentId" :title="'运输单信息'" :open.sync="open1" :disable="formDisable" @refresh="getList" />
    <!-- 批量导入 对话框 -->
    <import-dialog ref="ImportDialog" :title="'批量导入'" :open.sync="openImport" @refresh="getList" />
  </div>
</template>

<script>
import tableColumnsConfig from './data-index';

import { listApi,
  waybillReport,
  batch,
  reportMark,
  getReportStatus
} from '@/api/data/report';

import { waybillReportDriverReport,
  waybillReportVehicleReport,
  waybillReportWaybillReport,
  waybillReportFinancialReport
} from '@/api/data/shanXiReport';


import CheckResult from './components/CheckResult';
import ChildDialog from '@/views/settlement/components/childDialog';
import DetailDialog from '@/views/waybill/components/detailDialog';
import importDialog from './components/importDialog';
import { pickerOptions } from '@/utils/dateRange';
import { getUserInfo } from '@/utils/auth';

const dictsData1 = [
  { dictLabel: '未上报', dictValue: 0 },
  { dictLabel: '上报成功', dictValue: 1 },
  { dictLabel: '上报失败', dictValue: 2 },
  { dictLabel: '上报中', dictValue: 3 },
  { dictLabel: '数据异常', dictValue: 4 }
];

export default {
  name: 'Report', // 页面缓存需要name
  components: { CheckResult, ChildDialog, DetailDialog, importDialog },
  data() {
    return {
      pickerOptions,
      /* 模板参数必须 */
      loading: false, // 加载
      showSearch: true, // 显示搜索条件
      // active: '0', // 做tab切换

      /* 表格参数 */
      total: 0, // 总条数
      list: [], // 表格数据
      listApi, // 表头存的key
      tableColumnsConfig: [], // 表头动态值
      ids: [],

      /* 筛选参数 */
      queryParams: { // 查询参数
        pageNum: 1,
        pageSize: 10,
        // status: '0',
        financialOption: 3,

        billSendStatus: undefined, //	流水上报 1是 0否
        driverReport: undefined, //	司机是否上报 1是 0否
        // loadSendStatus: undefined, //	装货位置上报 1是 0否
        // unloadSendStatus: undefined, //	卸货位置上报 1是 0否
        vehicleReport: undefined, //	车辆是否上报 1是 0否
        waybillSendStatus: undefined, //	运单是否上报 1是 0否

        bizNo: undefined, //	支付批次号
        companyName: undefined, //	发货企业
        driverName: undefined, //	司机
        licenseNumber: undefined, //	车牌号
        mainOrderNumber: undefined, //	货源单号
        teamName: undefined, //	车队名称
        waybillNo: undefined, //	运输单号
        startReceiveTime: undefined,
        endReceiveTime: undefined,
        reportMarkStatus: undefined,
        isReport: undefined // 是否可以上报0未扫描过1可以自动上报2不可以上报的3.上报扫描时出现了异常4上报中5.上报完成6被客服标记了异常不上报7.上报的时候出现了异常联系管理员

      },
      receiveTime: [],
      /* 字典集合 取名规则 ***_option */

      dicts: {
        driverReport_option: dictsData1,
        vehicleReport_option: dictsData1,
        billSendStatus_option: dictsData1,
        loadSendStatus_option: dictsData1,
        unloadSendStatus_option: dictsData1,
        waybillSendStatus_option: dictsData1,
        isAbnormal_option: [{ dictLabel: '是', dictValue: 1 }, { dictLabel: '否', dictValue: 0 }], // 是否异常
        reportMarkStatus_option: [{ dictLabel: '异常', dictValue: 1 }, { dictLabel: '正常', dictValue: 0 }], // 是否异常
        isChild_option: [{ dictLabel: '超载的主单', dictValue: 2 }, { dictLabel: '是（子单）', dictValue: 1 }, { dictLabel: '不是 （正常单）', dictValue: 0 }], // 是否子单
        // reportTypeList_option: [
        //   { dictLabel: '运单', dictValue: 1 },
        //   { dictLabel: '装货位置', dictValue: 2 },
        //   { dictLabel: '卸货位置', dictValue: 3 },
        //   { dictLabel: '流水', dictValue: 4 }
        // ],

        waybillStatus_option: [ // 运输状态
          { dictLabel: '未接单', dictValue: 0 },
          { dictLabel: '已接单', dictValue: 1 },
          { dictLabel: '已装货', dictValue: 2 },
          { dictLabel: '已签收(已卸货)', dictValue: 3 },
          { dictLabel: '已回单', dictValue: 4 },
          { dictLabel: '已核算', dictValue: 5 },
          { dictLabel: '已申请（打款）', dictValue: 6 },
          { dictLabel: '已打款', dictValue: 7 },
          { dictLabel: '已申请开票', dictValue: 8 },
          { dictLabel: '已开票', dictValue: 9 }
        ]
      },

      /* 弹框参数1- 详情 */
      open1: false,
      currentId: '',
      formDisable: true,
      /* 弹框参数2- 分单列表弹框*/
      childdialog: false, // 分单列表弹框

      /* 弹框参数 */
      open: false, // 打开弹框
      openData: null, // 类型对象

      /* 弹框2- 批量导入 */
      openImport: false,

      addition: -10,
      loadingExport: false,

      /* 其他额外参数 */
      // shipmentList: [], // 远程搜索的时候使用
      // shipmentreq: {
      //   pageNum: 1,
      //   keywords: '',
      //   pageSize: 10
      // }
      user: {},
      /* 字典值 */
      reportStatusOP: []


    };
  },

  // watch: {
  //   // 页面刷新使用
  //   '$route.query.p': {
  //     handler(value, odvalue) {
  //       if (!value) return;
  //       this.queryParams.pageNum = 1;
  //       this.getList();
  //       this.$route.query.p = '';
  //     },
  //     immediate: true
  //   }
  // },


  created() {
    const { user = {}} = getUserInfo() || {};
    this.user = user;
    // 配置表头 listApi-> 请求的接口, null-> 编辑, tableColumnsConfig-> 外部的表头
    this.tableHeaderConfig(this.tableColumnsConfig, listApi, null, tableColumnsConfig);

    // 需要字典的这里请求
    this.getDict();

    this.getList();
  },
  methods: {

    /** 获取首页字典值 */
    getDict() {
      // 要做vuex存储
      // const goodsBigType_option = this.$store.getters.goodsBigType_option;

      // if (!goodsBigType_option) {
      //   this.listByDict({
      //     dictPid: '0',
      //     dictType: 'goodsType'
      //   }).then(res => {
      //     this.goodsTypeOption = res.data;
      //     this.$store.dispatch('orders/store_goodsBigType_option', res.data);
      //   });
      // } else {
      //   this.goodsTypeOption = goodsBigType_option;
      // }

      // ['businessTypes'].forEach(e => {
      //   this.getDicts(e).then(response => {
      //     this.dicts[e] = response.data;
      //   });
      // });

      getReportStatus().then(res => {
        this.reportStatusOP = res.data.map(e => {
          return { dictLabel: e.label, dictValue: e.status };
        });
      });
    },

    /** 列表 */
    async getList() {
      this.loading = true;

      let response = null;
      const params = { ...this.queryParams };
      if (params.licenseNumber) {
        params.licenseNumber = params.licenseNumber.toUpperCase();
      }
      try {
        response = await waybillReport(params);
      } catch (error) {
        // this.$confirm('请求超时,确定刷新页面?', '警告', {
        //   confirmButtonText: '确定',
        //   cancelButtonText: '取消',
        //   type: 'warning'
        // }).then(() => {
        //   this.getList();
        // });
        return;
      }
      this.loading = false;

      this.list = response.rows;

      this.total = response.total - 0;
    },


    /** 模板相关事件 */
    handleClick() {
      this.queryParams.status = this.active;
      this.handleQuery();
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
    datechoose(date) {
      if (date) {
        this.queryParams.startReceiveTime = this.parseTime(date[0], '{y}-{m}-{d}');
        this.queryParams.endReceiveTime = this.parseTime(date[1], '{y}-{m}-{d}');
      } else {
        this.queryParams.startReceiveTime = null;
        this.queryParams.endReceiveTime = null;
      }
    },
    /** 导出作 */
    handleExport() {
      this.loadingExport = true;
      this.download('/transportation/waybillReport/export', {
        ...this.queryParams
      }, `数据上报`).then(res => {
        this.loadingExport = false;
      });
    },
    /** 批量上报 */
    async handleReport() {
      // const arr = [];
      // this.ids.forEach(async row => {
      //   arr.push(this._waybillReport(row));
      // });

      // 6/8 改成一个上报接口
      this.loading = true;
      try {
        const res = await batch(this.ids.map(e => e.waybillReportCode));
        this.loading = false;
        if (res.code === 200) {
          this.msgSuccess(res.msg);
          this.getList();
        }
      } catch (error) {
        this.loading = false;
      }
    },
    /** 批量导入 */
    handleImport() {
      this.openImport = true;
      alert('未接接口');
      // this.title = '司机批量导入';
    },
    /** 下载模板 */
    handleDownload() {
      alert('未接接口');
    },
    /** 更新网商打款状态 */
    handleUpdate() {
      alert('未接接口');
    },


    /** 列表按钮 */
    handleEdit(row, type) {
      switch (type) {
        case 'detail':
          this.$refs.DetailDialog.reset();
          this.open1 = true;
          this.currentId = row.waybillCode;
          this.formDisable = true;
          // this.openData = row;
          break;
        case 'seperate':
          this.childdialog = true;
          this.$refs.ChildDialog.setForm({ wayBillCode: row.waybillCode });
          break;
        case 'report':
          // this._waybillReport(row);
          this.oneWaybillReport(row);
          break;
        case 'check':
          this.open = true;
          this.openData = row;
          break;
        case 'mark':
          if (!row.reportMarkStatus) {
            this.$confirm('确认要标记上报异常?', '警告', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              reportMark(row.waybillCode, 1).then(response => {
                this.getList();
              });
            });
          } else {
            this.$confirm('确认要取消上报异常?', '警告', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              reportMark(row.waybillCode, 0).then(response => {
                this.getList();
              });
            });
          }
          break;
      }
    },

    /* 单次 */
    oneWaybillReport(row) {
      this.ids = [row];

      this.handleReport();
    },

    /* 上报接口 */
    async _waybillReport(row) {
      this.loading = true;
      const { driverReport, vehicleReport, waybillSendStatus, billSendStatus } = row;

      let res_driver;
      let res_vehicle;
      let res_waybill;
      let res_bill;
      let msg;
      try {
        if (driverReport !== 1) {
          res_driver = await waybillReportDriverReport({
            waybillCode: row.waybillCode
          });
          row.driverReport = 3;
          msg = res_driver.msg;
        } else {
          res_driver = true;
        }
      } catch (error) {
        row.driverReport = 2;
      }
      try {
        if (vehicleReport !== 1) {
          res_vehicle = await waybillReportVehicleReport({
            waybillCode: row.waybillCode
          });
          row.vehicleReport = 3;
          msg = res_vehicle.msg;
        } else {
          res_vehicle = true;
        }
      } catch (error) {
        row.vehicleReport = 2;
      }
      try {
        if (waybillSendStatus !== 1) {
          res_waybill = await waybillReportWaybillReport({
            waybillCode: row.waybillCode
          });
          row.waybillSendStatus = 3;
          msg = res_waybill.msg;
        } else {
          res_waybill = true;
        }
      } catch (error) {
        row.waybillSendStatus = 2;
      }
      try {
        if (billSendStatus !== 1) {
          res_bill = await waybillReportFinancialReport({
            waybillCode: row.waybillCode
          });
          row.billSendStatus = 3;
          msg = res_bill.msg;
        } else {
          res_bill = true;
        }
      } catch (error) {
        row.billSendStatus = 2;
      }

      if (
        [res_driver, res_vehicle, res_waybill, res_bill].every(e => e)
      ) {
        this.msgSuccess(msg);
      }
      this.loading = false;
      this.getList();
      // return res_bill;
    },

    handlerReport(row, key, bool) {
      if (bool || row.reportMarkStatus === 1) return;
      this.loading = true;
      switch (key) {
        case 'driverReport':
          if (row[key] !== 1) {
            waybillReportDriverReport({
              waybillCode: row.waybillCode
            }).then(res => {
              this.msgSuccess(res.msg);
              // row[key] = 3;
              // this.loading = false;
              this.getList();
            }).catch(() => {
              // this.msgError('上报失败');
              // row[key] = 2;
              this.loading = false;
            });
          }
          break;
        case 'vehicleReport':
          if (row[key] !== 1) {
            waybillReportVehicleReport({
              waybillCode: row.waybillCode
            }).then(res => {
              this.msgSuccess(res.msg);
              // row[key] = 3;
              // this.loading = false;
              this.getList();
            }).catch(() => {
              // this.msgError('上报失败');
              // row[key] = 2;
              this.loading = false;
            });
          }
          break;
        case 'waybillSendStatus':
          if (row[key] !== 1) {
            waybillReportWaybillReport({
              waybillCode: row.waybillCode
            }).then(res => {
              this.msgSuccess(res.msg);
              // row[key] = 3;
              // this.loading = false;
              this.getList();
            }).catch(() => {
              // this.msgError('上报失败');
              // row[key] = 2;
              this.loading = false;
            });
          }
          break;
        case 'billSendStatus':
          if (row[key] !== 1) {
            waybillReportFinancialReport(row.waybillReportCode).then(res => {
              this.msgSuccess(res.msg);
              // row[key] = 3;
              // this.loading = false;
              this.getList();
            }).catch(() => {
              // this.msgError('上报失败');
              // row[key] = 2;
              // this.loading = false;
            });
          }
          break;
      }
    },


    /* 多选 */
    handleSelectionChange(selecked) {
      // console.log(selecked);
      this.ids = selecked;
    },

    /** 触发远程搜索 */
    // remoteMethod(query) {
    //   if (query !== '') {
    //     this.shipmentreq.pageNum = 1;
    //     this.shipmentreq.keywords = query;
    //     this.shipmentList = [];
    //     this.getTeamList();
    //   } else {
    //     this.shipmentList = [];
    //   }
    // },
    /** 远程搜索列表触底事件 */
    // loadmore() {
    //   if (this.dataOver) return;
    //   this.shipmentreq.pageNum++;
    //   this.getTeamList();
    // },
    /** 请求数据 */
    // getTeamList() {
    //   // 请求数据
    //   // listShipment(this.shipmentreq).then(
    //   //   (res) => {
    //   //     this.dataOver = !res.rows.length;
    //   //     this.shipmentList = this.shipmentList.concat(res.rows);
    //   //     this.loading = false;
    //   //   }
    //   // ).catch(() => {
    //   //   this.loading = false;
    //   // });
    // },


    /** 复制 */
    // handleclone(row) {
    //   // this.$router.push({ name: 'Release', query: { id: row.code, t: '3' }});
    // },
    /** 关闭 */
    // submitRes(res) {
    //   if (res === 'success') {
    //     this.getList();
    //   }

    //   this.tabs = [];
    //   this.orderCode = '';
    //   this.pubilshCode = '';
    //   this.openPriceAdjustment = false;
    // },

    /** 子类的高亮 */
    // tableRowClassName({ row, rowIndex }) {
    //   if (row.children) {
    //     return 'warning-row';
    //   }
    //   if (!row.isShowEdit) {
    //     return 'red-row';
    //   }
    //   return '';
    // },

    /** 生成随机id */
    // genID(length) {
    //   return Number(Math.random().toString().substr(3, length) + Date.now()).toString(36);
    // },
    // 处理上报异常加一个背景颜色
    tableRowClassName({ row, rowIndex }) {
      if (row.reportMarkStatus === 1) {
        return 'tinkai-warning-row ';
      }
      return '';
    },
    checkboxT(row) {
      if (row.reportMarkStatus === 1) {
			  return false;
      } else {
			  return true;
      }
    }


  }
};
</script>

<style>
.el-table .tinkai-warning-row {
  background: #d5d2d2;
}

</style>

