<template>
  <div>
    <div v-show="showSearch" class="app-container app-container--search">
      <el-form
        ref="queryForm"
        :model="queryParams"
        :inline="true"
        label-width="90px"
      >
        <el-form-item label="发生时间" prop="queryTime">
          <el-date-picker
            v-model="queryTime"
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
        <el-form-item label="付款方" prop="buyerInfo">
          <el-input
            v-model.trim="queryParams.buyerInfo"
            placeholder="请输入付款方"
            clearable
            size="small"
            style="width: 228px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="收款方" prop="sellerInfo">
          <el-input
            v-model.trim="queryParams.sellerInfo"
            placeholder="请输入收款方"
            clearable
            size="small"
            style="width: 228px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="交易备注" prop="dealRemark">
          <el-input
            v-model.trim="queryParams.dealRemark"
            placeholder="请输入交易备注"
            clearable
            size="small"
            style="width: 228px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="交易类型" prop="dealTypeCode">
          <el-select
            v-model="queryParams.dealTypeCode"
            placeholder="请选择交易类型"
            clearable
            filterable
            size="small"
            style="width: 228px"
          >
            <el-option
              v-for="(dict, index) in dealTypeCodeOptions"
              :key="index"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="匹配类型" prop="matching">
          <el-select
            v-model="queryParams.matching"
            placeholder="请选择匹配类型"
            clearable
            filterable
            size="small"
            style="width: 228px"
          >
            <el-option
              v-for="(dict, index) in matchingOptions"
              :key="index"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="业务类型" prop="businessType">
          <el-select
            v-model="queryParams.businessType"
            placeholder="请选择业务类型"
            clearable
            filterable
            size="small"
            style="width: 228px"
          >
            <el-option
              v-for="(dict, index) in businessTypeOptions"
              :key="index"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            />
          </el-select>
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
        <el-form-item>
          <el-button
            type="primary"
            icon="el-icon-search"
            size="mini"
            @click="handleQuery"
          >搜索</el-button>
          <el-button
            type="primary"
            plain
            icon="el-icon-refresh"
            size="mini"
            @click="resetQuery"
          >重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="app-container">
      <!-- v-model="activeNames" @change="handleChange" -->
      <el-collapse style="margin-bottom: 10px">
        <el-collapse-item v-if="fundCount.totalVo" :title="'统计(总条数：' + fundCount.totalVo.allCount + ')'" name="1">
          <el-row :gutter="20">
            <el-col :span="3.2">
              <div class="count-frame g-directioncenter g-justifycenter">
                <div v-if="fundCount.totalVo.allCount">总条数：{{ fundCount.totalVo.allCount }}</div>
                <div v-if="fundCount.totalVo.allAmount">总金额：{{ fundCount.totalVo.allAmount }}</div>
                <div v-if="fundCount.totalVo.matchCount">匹配条数：{{ fundCount.totalVo.matchCount }}</div>
                <div v-if="fundCount.totalVo.matchAmount">匹配金额：{{ fundCount.totalVo.matchAmount }}</div>
                <div v-if="fundCount.totalVo.toMatchCount">待匹配条数：{{ fundCount.totalVo.toMatchCount }}</div>
                <div v-if="fundCount.totalVo.toMatchAmount">待匹配金额：{{ fundCount.totalVo.toMatchAmount }}</div>
                <div v-if="fundCount.totalVo.unMatchRecordCount" class="g-color-error">金额不匹配条数：{{ fundCount.totalVo.unMatchRecordCount }}</div>
                <div v-if="fundCount.totalVo.unMatchRecordAmount" class="g-color-error">金额不匹配金额：{{ fundCount.totalVo.unMatchRecordAmount }}</div>
                <div v-if="fundCount.totalVo.unMatchCount" class="g-color-error">未匹配到记录条数：{{ fundCount.totalVo.unMatchCount }}</div>
                <div v-if="fundCount.totalVo.unMatchAmount" class="g-color-error">未匹配到记录金额：{{ fundCount.totalVo.unMatchAmount }}</div>
              </div>
            </el-col>
            <el-col v-for="(item, index) in fundCount.statisticalList" :key="index" :span="3.2">
              <div class="count-frame g-directioncenter g-justifycenter">
                <div class="text-bold">{{ selectDictLabel(businessTypeOptions, item.businessType) }}</div>
                <div v-if="item.allCount">云资金条数：{{ item.allCount }}</div>
                <div v-if="item.allAmount">云资金金额：{{ item.allAmount }}</div>
                <div v-if="item.toMatchCount">待匹配条数：{{ item.toMatchCount }}</div>
                <div v-if="item.toMatchAmount">待匹配金额：{{ item.toMatchAmount }}</div>
                <div v-if="item.matchCount">匹配条数：{{ item.matchCount }}</div>
                <div v-if="item.matchAmount">匹配金额：{{ item.matchAmount }}</div>
                <div v-if="item.unMatchRecordCount" class="g-color-error">金额不匹配条数：{{ item.unMatchRecordCount }}</div>
                <div v-if="item.unMatchRecordAmount" class="g-color-error">金额不匹配金额：{{ item.unMatchRecordAmount }}</div>
                <div v-if="item.unMatchCount" class="g-color-error">未匹配到记录条数：{{ item.unMatchCount }}</div>
                <div v-if="item.unMatchAmount" class="g-color-error">未匹配到记录金额：{{ item.unMatchAmount }}</div>
              </div>
            </el-col>
          </el-row>
        </el-collapse-item>
      </el-collapse>

      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button
            v-hasPermi="['payment:cloudMoneyParsing:export']"
            type="primary"
            icon="el-icon-download"
            size="mini"
            :loading="loadingExport"
            @click="handleExport"
          >导出</el-button>
        </el-col>
        <el-col :span="1.5" style="float: right">
          <tablec-cascader v-model="tableColumnsConfig" :lcokey="api" />
        </el-col>
        <right-toolbar :show-search.sync="showSearch" @queryTable="getList" />
      </el-row>

      <MoreRefactorTable
        :loading="loading"
        :data="fundList"
        :morelist="morelist"
        :table-columns-config="tableColumnsConfig"
        @sort-change="handleSortChange"
      ><!-- @selection-change="handleSelectionChange" -->
        <template #amount="{row}">
          <span>{{ floor(row.amount) }}</span>
        </template>
        <template #matching="{row}">
          <span>{{ selectDictLabel(matchingOptions, row.matching) }}</span>
        </template>
        <template #overTime="{row}">
          <span>{{ parseTime(row.overTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
        <template #businessType="{row}">
          <span>{{ selectDictLabel(businessTypeOptions, row.businessType) }}</span>
        </template>
        <template #edit="{row}">
          <el-button
            v-if="row.matching !== 1"
            v-hasPermi="['transportation:waybill:getWayBillByCode']"
            size="mini"
            type="text"
            @click="handleMatching(row)"
          >
            匹配
          </el-button>
          <span v-else>暂无</span>
        </template>
      </MoreRefactorTable>

      <pagination
        v-show="total > 0"
        :total="total"
        :page-sizes="[10, 50, 100, 300]"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getList"
      />
    </div>
  </div>
</template>

<script>
import { findListApi, findList, statistical, matching } from '@/api/data/statistics';
// import tableColumnsConfig from './config';
import { pickerOptions } from '@/utils/dateRange';

export default {
  name: 'Platform',
  components: {},
  data() {
    return {
      pickerOptions,
      tableColumnsConfig: [],
      api: findListApi,
      // 遮罩层
      loading: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 云资金记录表格数据
      fundList: [],
      // 云资金记录统计数据
      fundCount: {},
      cont: [],
      queryTime: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        buyerInfo: null,
        sellerInfo: null,
        dealRemark: null,
        startTime: null,
        endTime: null,
        dealTypeCode: null,
        matching: null,
        waybillNo: null,
        mainOrderNumber: null
        // order: null,
        // prop: null
      },
      // 合计
      summary: true,
      loadingExport: false,
      dealTypeCodeOptions: [
        { 'dictLabel': '支付', 'dictValue': '20201' },
        { 'dictLabel': '子账户汇入', 'dictValue': '10102' },
        { 'dictLabel': '提现', 'dictValue': '10210' }
      ],
      matchingOptions: [
        { 'dictLabel': '待匹配', 'dictValue': '0' },
        { 'dictLabel': '匹配', 'dictValue': '1' },
        { 'dictLabel': '记录匹配金额不匹配', 'dictValue': '2' },
        { 'dictLabel': '未匹配到记录', 'dictValue': '3' }
      ],
      businessTypeOptions: [
        { 'dictLabel': '充值', 'dictValue': '1' },
        { 'dictLabel': '提现', 'dictValue': '2' },
        { 'dictLabel': '打款', 'dictValue': '3' },
        { 'dictLabel': '清分', 'dictValue': '4' },
        { 'dictLabel': '平台提现', 'dictValue': '5' },
        { 'dictLabel': '其他', 'dictValue': '99' }
      ],
      morelist: []
    };
  },
  watch: {
    tableColumnsConfig(val) {
      const fundlist = val.filter(item => item.isChild && item.sortNum < 15);
      const chylist = val.filter(item => item.isChild && item.sortNum > 15);
      // console.log(chylist);
      this.morelist = [{
        label: '云资金平台',
        children: fundlist
      }, {
        label: '超好运',
        children: chylist
      }];
    }
  },
  created() {
    this.tableHeaderConfig(this.tableColumnsConfig, findListApi, {
      prop: 'edit',
      isShow: true,
      label: '操作',
      width: 100,
      fixed: 'left'
    });
    this.queryParams.startTime = this.parseTime(new Date(new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-01'), '{y}-{m}-{d} {h}:{i}:{s}');
    this.queryParams.endTime = this.parseTime(new Date(), '{y}-{m}-{d} {h}:{i}:{s}');
    this.queryTime = [new Date(new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-01'), new Date()];
    this.getList();
  },
  methods: {
    // 排序事件
    handleSortChange(val) {
      this.queryParams.order = val.order;
      this.queryParams.prop = val.prop;
      this.getList();
    },
    // 搜索时间选择
    datechoose(date) {
      if (date) {
        this.queryParams.startTime = this.parseTime(date[0], '{y}-{m}-{d}');
        this.queryParams.endTime = this.parseTime(date[1], '{y}-{m}-{d}');
      } else {
        this.queryParams.startTime = null;
        this.queryParams.endTime = null;
      }
    },
    /** 查询云资金记录列表 */
    getList(e) {
      this.loading = true;
      findList(this.queryParams).then((response) => {
        // console.log(response);
        this.fundList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
      statistical(this.queryParams).then((response) => {
        // console.log(response);
        this.fundCount = response.data;
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
      this.queryTime = [];
      this.queryParams.startTime = null;
      this.queryParams.endTime = null;
      this.queryParams.creditBalance = null;
      this.handleQuery();
    },
    // 匹配
    handleMatching(row) {
      matching([row.id]).then(() => {
        this.msgSuccess('匹配成功！');
      });
    },
    // 导出
    handleExport() {
      this.loadingExport = true;
      this.download(
        '/payment/cloudMoneyParsing/export',
        { ...this.queryParams },
        `云资金记录`
      ).then(res => {
        this.loadingExport = false;
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.count-frame{
  height: 275px;
  text-align: center;
  padding: 10px;
  // background: #C4F1D1;
  border-radius: 4px;
  border: 1px solid #ddd;
}
.text-bold{
  font-weight: bold;
}
::v-deep .el-collapse-item__header{
  background: #F8F9FA;
  padding-left: 10px;
}
::v-deep  .el-collapse-item__content{
  padding: 20px;
}
</style>
