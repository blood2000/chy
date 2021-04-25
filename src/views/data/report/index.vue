<template>
  <div class="ly-card-box">
    <el-form v-show="showSearch" ref="queryForm" :model="queryParams" :inline="true" label-width="90px" class="clearfix app-container" @submit.native.prevent>

      <!-- 普通input搜索 -->
      <el-form-item label="支付批次号" prop="bizNo">
        <el-input
          v-model="queryParams.bizNo"
          placeholder="请输入支付批次号"
          clearable
          size="small"
          style="width: 150px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="发货企业" prop="companyName">
        <el-input
          v-model="queryParams.companyName"
          placeholder="请输入发货企业"
          clearable
          size="small"
          style="width: 150px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="司机" prop="driverName">
        <el-input
          v-model="queryParams.driverName"
          placeholder="请输入司机"
          clearable
          size="small"
          style="width: 150px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="车牌号" prop="licenseNumber">
        <el-input
          v-model="queryParams.licenseNumber"
          placeholder="请输入车牌号"
          clearable
          size="small"
          style="width: 150px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="货源单号" prop="mainOrderNumber">
        <el-input
          v-model="queryParams.mainOrderNumber"
          placeholder="请输入货源单号"
          clearable
          size="small"
          style="width: 150px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="车队名称" prop="teamName">
        <el-input
          v-model="queryParams.teamName"
          placeholder="请输入车队名称"
          clearable
          size="small"
          style="width: 150px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="运输单号" prop="waybillNo">
        <el-input
          v-model="queryParams.waybillNo"
          placeholder="请输入运输单号"
          clearable
          size="small"
          style="width: 150px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <!-- 下拉框 -->
      <el-form-item label="流水上报" prop="bill">
        <el-select v-model="queryParams.bill" placeholder="----请选择----" clearable filterable style="width: 150px">
          <el-option
            v-for="(dict,index) in dicts['bill_option'] || []"
            :key="index"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="司机上报" prop="driverReport">
        <el-select v-model="queryParams.driverReport" placeholder="----请选择----" clearable filterable style="width: 150px">
          <el-option
            v-for="(dict,index) in dicts['driverReport_option'] || []"
            :key="index"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="装货上报" prop="load">
        <el-select v-model="queryParams.load" placeholder="----请选择----" clearable filterable style="width: 150px">
          <el-option
            v-for="(dict,index) in dicts['load_option'] || []"
            :key="index"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="卸货上报" prop="unload">
        <el-select v-model="queryParams.unload" placeholder="----请选择----" clearable filterable style="width: 150px">
          <el-option
            v-for="(dict,index) in dicts['unload_option'] || []"
            :key="index"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="车辆上报" prop="vehicleReport">
        <el-select v-model="queryParams.vehicleReport" placeholder="----请选择----" clearable filterable style="width: 150px">
          <el-option
            v-for="(dict,index) in dicts['vehicleReport_option'] || []"
            :key="index"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="运单上报" prop="waybill">
        <el-select v-model="queryParams.waybill" placeholder="----请选择----" clearable filterable style="width: 150px">
          <el-option
            v-for="(dict,index) in dicts['waybill_option'] || []"
            :key="index"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>

      <!-- 时间筛选框 -->
      <!-- <el-form-item label="发布时间" prop="tin10">
        <el-date-picker
          v-model="queryParams.tin10"
          size="small"
          style="width: 150px"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        />
      </el-form-item> -->

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
            v-hasPermi="['data:report:export']"
            type="warning"
            icon="el-icon-download"
            size="mini"
            @click="handleExport"
          >导出</el-button>
          <el-button
            v-hasPermi="['data:report:report']"
            type="info"
            icon="el-icon-download"
            size="mini"
            @click="handleReport"
          >批量上报</el-button>
          <el-button
            v-hasPermi="['data:report:import']"
            type="info"
            icon="el-icon-download"
            size="mini"
            @click="handleImport"
          >批量导入</el-button>
          <el-button
            v-hasPermi="['data:report:download']"
            type="primary"
            icon="el-icon-download"
            size="mini"
            @click="handleDownload"
          >下载模板</el-button>
          <el-button
            v-hasPermi="['data:report:update']"
            type="success"
            icon="el-icon-download"
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
      >
        <!-- stripe -->
        <!-- row-key="id" -->
        <!-- :tree-props="{children: 'children', hasChildren: 'hasChildren'}" -->
        <!-- @selection-change="handleSelectionChange" -->
        <!-- :height="theight" -->
        <!-- :row-class-name="tableRowClassName" -->
        <!-- 装货地 -->
        <template #vehicleReport="{row}">
          <span :class="row.vehicleReport == '1'?'g-color-success':'g-color-error'">{{ selectDictLabel(dicts['vehicleReport_option'], (row.vehicleReport? row.vehicleReport: 0)) }}</span>
        </template>
        <template #driverReport="{row}">
          <span :class="row.driverReport == '1'?'g-color-success':'g-color-error'">{{ selectDictLabel(dicts['driverReport_option'], (row.driverReport? row.driverReport: 0)) }}</span>
        </template>
        <template #isAbnormal="{row}">
          <span :class="row.isAbnormal == '1'?'g-color-success':'g-color-error'">{{ selectDictLabel(dicts['isAbnormal_option'], (row.isAbnormal? row.isAbnormal: 0)) }}</span>
        </template>
        <template #waybill="{row}">
          <span :class="row.waybill === 1? 'g-color-success':'g-color-error'">{{ row.waybill === 1?'已上报':'未上报' }}</span>
        </template>
        <template #load="{row}">
          <span :class="row.load === 1? 'g-color-success':'g-color-error'">{{ row.load === 1?'已上报':'未上报' }}</span>
        </template>
        <template #unload="{row}">
          <span :class="row.unload === 1? 'g-color-success':'g-color-error'">{{ row.unload === 1?'已上报':'未上报' }}</span>
        </template>
        <template #bill="{row}">
          <span :class="row.bill === 1? 'g-color-success':'g-color-error'">{{ row.bill === 1?'已上报':'未上报' }}</span>
        </template>

        <template #isChild="{row}">
          <span v-if="row.waybillStatus == '0'" class="g-color-error">{{ selectDictLabel(dicts['isChild_option'], 0) }}</span>
          <span v-if="row.waybillStatus == '1'" class="g-color-success">{{ selectDictLabel(dicts['isChild_option'], 1) }}</span>
          <span v-if="row.waybillStatus == '2'" class="g-color-warning">{{ selectDictLabel(dicts['isChild_option'], 2) }}</span>
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
          <template v-if="true">

            <!-- 前3个的放这里 -->

            <el-button
              v-hasPermi="['data:report:detail']"
              size="mini"
              type="text"
              @click="handleEdit(row, 'detail')"
            >详情</el-button>

            <el-button
              v-hasPermi="['data:report:seperate']"
              size="mini"
              type="text"
              @click="handleEdit(row, 'seperate')"
            >分单列表</el-button>

            <el-button
              v-if="false"
              v-hasPermi="['data:report:report']"
              size="mini"
              type="text"
              @click="handleEdit(row, 'report')"
            >上报</el-button>

            <el-button
              v-else
              v-hasPermi="['data:report:check']"
              size="mini"
              type="text"
              @click="handleEdit(row, 'check')"
            >查看校验</el-button>



            <!-- 大于3个按钮的使用这个... -->
            <TableDropdown v-if="false">
              <el-dropdown-item>
                <el-button
                  v-hasPermi="['consigner-order-delete']"
                  size="mini"
                  type="text"
                  @click="handleDelete(row)"
                >删除</el-button>
              </el-dropdown-item>
            </TableDropdown>
          </template>
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


    <!-- 弹框使用  class类 i-price 是使用图片了 -->
    <el-dialog :title="'查看校验结果'" class="i-price" :visible.sync="open" width="70%" append-to-body>
      <!-- 弹框内的组件 -->
      <!-- <price-adjustment v-if="openPriceAdjustment" :mytabs="tabs" :order-code="orderCode" :pubilsh-code="pubilshCode" @submitRes="submitRes" /> -->
      <check-result />
    </el-dialog>
  </div>
</template>

<script>
import tableColumnsConfig from './data-index';

import { listApi, waybillReport } from '@/api/data/report';

import CheckResult from './components/CheckResult';
export default {
  name: 'Manage', // 页面缓存需要name
  components: { CheckResult },
  data() {
    return {
      /* 模板参数必须 */
      loading: false, // 加载

      showSearch: true, // 显示搜索条件

      open: false, // 打开弹框

      active: '0', // 做tab切换

      /* 表格参数 */
      // theight: undefined, // 列表高度(无)
      total: 10, // 总条数
      list: [{ projectName: 1231313 }], // 表格数据
      listApi, // 表头存的key
      tableColumnsConfig: [], // 表头动态值

      /* 筛选参数 */
      queryParams: { // 查询参数
        pageNum: 1,
        pageSize: 10,
        // status: '0'

        bill: undefined, //	流水上报 1是 0否
        driverReport: undefined, //	司机是否上报 1是 0否
        load: undefined, //	装货位置上报 1是 0否
        unload: undefined, //	卸货位置上报 1是 0否
        vehicleReport: undefined, //	车辆是否上报 1是 0否
        waybill: undefined, //	运单是否上报 1是 0否

        bizNo: undefined, //	支付批次号
        companyName: undefined, //	发货企业
        driverName: undefined, //	司机
        licenseNumber: undefined, //	车牌号
        mainOrderNumber: undefined, //	货源单号
        teamName: undefined, //	车队名称
        waybillNo: undefined //	运输单号
      },

      /* 字典集合 取名规则 ***_option */
      dicts: {
        driverReport_option: [{ dictLabel: '已上报', dictValue: 1 }, { dictLabel: '未上报', dictValue: 0 }],
        vehicleReport_option: [{ dictLabel: '已上报', dictValue: 1 }, { dictLabel: '未上报', dictValue: 0 }],
        bill_option: [{ dictLabel: '已上报', dictValue: 1 }, { dictLabel: '未上报', dictValue: 0 }],
        load_option: [{ dictLabel: '已上报', dictValue: 1 }, { dictLabel: '未上报', dictValue: 0 }],
        unload_option: [{ dictLabel: '已上报', dictValue: 1 }, { dictLabel: '未上报', dictValue: 0 }],
        waybill_option: [{ dictLabel: '已上报', dictValue: 1 }, { dictLabel: '未上报否', dictValue: 0 }],
        isAbnormal_option: [{ dictLabel: '是', dictValue: 1 }, { dictLabel: '否', dictValue: 0 }], // 是否异常
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
      }




      /* 其他额外参数 */
      // shipmentList: [], // 远程搜索的时候使用
      // shipmentreq: {
      //   pageNum: 1,
      //   keywords: '',
      //   pageSize: 10
      // }
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
    // 配置表头 listApi-> 请求的接口, null-> 编辑, tableColumnsConfig-> 外部的表头
    this.tableHeaderConfig(this.tableColumnsConfig, listApi, null, tableColumnsConfig);

    // console.log(this.tableColumnsConfig);

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
    },

    /** 列表 */
    async getList() {
      this.loading = true;

      let response = null;
      try {
        response = await waybillReport(this.queryParams);
      } catch (error) {
        this.$confirm('请求超时,确定刷新页面?', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.getList();
        });
        return;
      }
      this.loading = false;

      this.list = response.rows.map(e => {
        // 追加数据 type 类型 1.运单  2.装货位置 3.卸货位置 4.流水
        // 上报状态  0-待上报，1-上报成功，2-上传失败 (说明: 展示只显示已上报(1)和未上报(0, 2))
        if (e.waybillReportList && e.waybillReportList.length) {
          e.waybillReportList.forEach(ee => {
            ee.type === 1 && (e.waybill = ee.sendStatus);
            ee.type === 2 && (e.load = ee.sendStatus);
            ee.type === 3 && (e.unload = ee.sendStatus);
            ee.type === 4 && (e.bill = ee.sendStatus);
          });
        } else {
          e.waybill = 0;
          e.load = 0;
          e.unload = 0;
          e.bill = 0;
        }

        return e;
      });

      // console.log(this.list);


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
      this.handleQuery();
    },

    /** 导出作 */
    handleExport() {
      this.download('/transportation/order/export', {
        ...this.queryParams
      }, `order_export.xlsx`);
    },
    /** 批量上报 */
    handleReport() {},
    /** 批量导入 */
    handleImport() {},
    /** 下载模板 */
    handleDownload() {},
    /** 更新网商打款状态 */
    handleUpdate() {},


    /** 列表按钮 */
    handleEdit(row, type) {
      switch (type) {
        case 'detail':
          console.log(row);
          this.open = true;

          break;
      }
    }

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


  }
};
</script>

<style scoped lang='scss'>
.ly-card-box{
  position: relative;
  overflow-y: auto;
  height: calc(100vh - 115px);
}
</style>
