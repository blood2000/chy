<template>
  <!-- 2.0运力 -->
  <div>
    <div v-show="showSearch" class="app-container app-container--search">
      <el-form ref="queryForm" :model="queryParams" :inline="true" label-width="68px">
        <el-form-item label="查询日期" prop="receiveTime">
          <!-- 设置只能查2021-07-04之后的数据 -->
          <el-date-picker
            v-model="receiveTime"
            type="daterange"
            unlink-panels
            :picker-options="ownPickerOptions"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            style="width: 250px"
            size="small"
            @change="datechoose"
          />
        </el-form-item>
        <el-form-item label="货主" prop="companyName">
          <el-input
            v-model.trim="queryParams.companyName"
            placeholder="请输入货主企业名称"
            clearable
            size="small"
            style="width: 250px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="团队" prop="marketId">
          <el-select
            v-model="queryParams.marketId"
            clearable
            filterable
            size="small"
            style="width: 250px"
          >
            <el-option
              v-for="dict in MarketOptions"
              :key="dict.marketId"
              :label="dict.market"
              :value="dict.marketId"
            />
          </el-select>
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

    <div class="total_box">
      <div class="count-box blue">
        <p class="label">新增货主：</p>
        <p class="count">{{ capacityCount.addShipment || 0 }}</p>
      </div>
      <div class="count-box blue">
        <p class="label">在跑货主：</p>
        <p class="count">{{ capacityCount.nowShipment || 0 }}</p>
      </div>
      <div class="count-box blue">
        <p class="label">新增司机：</p>
        <p class="count">{{ capacityCount.addDriver || 0 }}</p>
      </div>
      <div v-if="user.userCode !== '9b8afa19203c488282b05e04096b0bdd'" class="count-box blue">
        <p class="label">新增调度者：</p>
        <p class="count">{{ capacityCount.addScheduler || 0 }}</p>
      </div>
      <div class="count-box green">
        <p class="label">总运单数：</p>
        <p class="count">{{ waybillCount.sumWaybillCount || 0 }}</p>
      </div>
      <div class="count-box green">
        <p class="label">接单数：</p>
        <p class="count">{{ waybillCount.sumReceiveCount || 0 }}</p>
      </div>
      <div class="count-box green">
        <p class="label">已装货：</p>
        <p class="count">{{ waybillCount.sumLoadingNum || 0 }}</p>
      </div>
      <div class="count-box green">
        <p class="label">已卸货：</p>
        <p class="count">{{ waybillCount.sumUnloadingNum || 0 }}</p>
      </div>
      <div class="count-box green">
        <p class="label">已核算：</p>
        <p class="count">{{ waybillCount.sumSettledNum || 0 }}</p>
      </div>
      <div class="count-box green">
        <p class="label">已打款：</p>
        <p class="count">{{ waybillCount.sumPaidNum || 0 }}</p>
      </div>
      <div class="count-box green">
        <p class="label">已开票：</p>
        <p class="count">{{ waybillCount.sumInvoicedNum || 0 }}</p>
      </div>
    </div>

    <div class="app-container">
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <!-- v-hasPermi -->
          <el-button
            type="primary"
            icon="el-icon-download"
            size="mini"
            :loading="exportLoading"
            :disabled="infoList.length === 0"
            @click="handleExport"
          >导出</el-button>
        </el-col>
      </el-row>

      <ul class="info-list">
        <!-- 公司v-for -->
        <li v-for="(item, index) in infoList" :key="index" class="info-list-item">
          <h5 class="companyName">
            <img src="../../../../src/assets/images/icon/company.png" alt="">
            <span>{{ item.companyName }}</span>
            <span class="area">（{{ item.marketName }}）</span>
          </h5>
          <el-table highlight-current-row :data="item.shipmentRelatedInfoVoList">
            <el-table-column label="货主" align="left" prop="companyName" min-width="150" />
            <!-- <el-table-column label="团队" align="left" prop="marketName" /> -->
            <el-table-column label="货源单号" align="left" prop="mainOrderNumber" min-width="120" />
            <el-table-column label="总运单数" align="left" prop="waybillCount" />
            <el-table-column label="接单数" align="left" prop="receiveCount" />
            <el-table-column label="已装货" align="left" prop="loadingNum" />
            <el-table-column label="已卸货" align="left" prop="unloadingNum" />
            <el-table-column label="已核算" align="left" prop="settledNum" />
            <el-table-column label="已打款" align="left" prop="paidNum" />
            <el-table-column label="已开票" align="left" prop="invoicedNum" />
          </el-table>
        </li>
      </ul>
      <DataNull v-if="infoList.length === 0" style="margin: 40px 0" />

    </div>
  </div>
</template>

<script>
import { pickerOptions } from '@/utils/dateRange';
import { capacityStatisticsCount, waybillStatisticsCount, getMarket, waybillStatisticsList } from '@/api/data/capacity';
import DataNull from '@/components/DataNull/index';
import { getUserInfo } from '@/utils/auth';

const dTime = '2021-07-04 00:00:00';
export default {
  name: 'Capacity',
  components: {
    DataNull
  },
  data() {
    return {
      ownPickerOptions: {
        ...{
          disabledDate(time) {
            return time.getTime() < new Date(dTime).getTime();
          }
        },
        ...pickerOptions
      },
      loading: true,
      showSearch: true,
      total: 0,
      queryParams: {
        companyName: '',
        marketId: undefined
      },
      timeParams: {
        beginTime: null,
        endTime: null
      },
      receiveTime: [],
      infoList: [],
      capacityCount: {},
      waybillCount: {},
      exportLoading: false,
      MarketOptions: [],
      user: {}
    };
  },
  mounted() {
    this.timeParams.beginTime = this.parseTime(new Date(), '{y}-{m}-{d}');
    this.timeParams.endTime = this.parseTime(new Date(), '{y}-{m}-{d}');
    this.receiveTime = [this.timeParams.beginTime, this.timeParams.endTime];
    this.getList();
    this.getMarketList();
    this.getCapacityCount();
    this.getWaybillCount();
  },
  created() {
    const { user = {}} = getUserInfo() || {};
    this.user = user;
  },
  methods: {
    datechoose(date) {
      if (date) {
        if (date[0].getTime() < new Date(dTime).getTime()) {
          date[0] = new Date(dTime);
        }
        if (date[1].getTime() < new Date(dTime).getTime()) {
          date[1] = new Date(dTime);
        }
        this.timeParams.beginTime = this.parseTime(date[0], '{y}-{m}-{d}');
        this.timeParams.endTime = this.parseTime(date[1], '{y}-{m}-{d}');
      } else {
        this.timeParams.beginTime = null;
        this.timeParams.endTime = null;
      }
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.getList();
      this.getCapacityCount();
      this.getWaybillCount();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm('queryForm');
      this.receiveTime = [];
      this.timeParams.beginTime = null;
      this.timeParams.endTime = null;
      this.handleQuery();
    },
    /** 查询列表 */
    getList() {
      this.loading = true;
      waybillStatisticsList(Object.assign({}, this.queryParams, this.timeParams)).then(response => {
        this.infoList = response.data || [];
        this.capacityCount.nowShipment = this.infoList.length;
        this.loading = false;
      });
    },
    /** 查询运力统计 */
    getCapacityCount() {
      capacityStatisticsCount(Object.assign({}, this.queryParams, this.timeParams)).then(response => {
        this.capacityCount = Object.assign({}, this.capacityCount, response.data);
      });
    },
    /** 查询运单统计 */
    getWaybillCount() {
      waybillStatisticsCount(Object.assign({}, this.queryParams, this.timeParams)).then(response => {
        this.waybillCount = response.data || {};
      });
    },
    /** 导出按钮 */
    handleExport() {
      this.exportLoading = true;
      this.download('/transportation/capacityStatistics/export', Object.assign({}, this.queryParams, this.timeParams), `2.0运力`).then(() => {
        this.exportLoading = false;
      });
    },
    /** 团队信息 */
    getMarketList() {
      getMarket().then((response) => {
        this.MarketOptions = response.data;
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.total_box{
  width: calc(100% - 30px);
  border-radius: 4px;
  margin: 0 15px;
  font-size: 0;
  .count-box{
    display: inline-block;
    width: calc(9.1% - 14px);
    height: 72px;
    position: relative;
    background-color: #fff;
    padding: 10px 0 10px 20px;
    margin-bottom: 15px;
    &:not(:last-child){
      margin-right: 15px;
    }
    >.label{
      font-size: 14px;
      font-family: PingFang SC;
      font-weight: 400;
      line-height: 24px;
      color: #262626;
      white-space:nowrap;
    }
    >.count{
      font-size: 24px;
      font-family: PingFang SC;
      font-weight: bold;
      line-height: 24px;
      color: #262626;
      white-space:nowrap;
    }
    &::before{
      content: '';
      position: absolute;
      left: 0;
      top: 50%;
      margin-top: -20px;
      width: 4px;
      height: 40px;
      border-radius: 0px 4px 4px 0px;
    }
    &.blue{
      &::before{
        background-color: #409EFF;
      }
    }
    &.green{
      &::before{
        background-color: #67C23A;
      }
    }
  }

  >img{
    vertical-align: middle;
    margin-right: 15px;
  }
  >span{
    display: inline-block;
    vertical-align: middle;
    margin-right: 40px;
    line-height: 28px;
  }
}

.info-list{
  .info-list-item{
    &:not(:last-child){
      margin-bottom: 50px;
    }
    &:last-child{
      margin-bottom: 30px;
    }
    .companyName{
      font-size: 18px;
      font-family: PingFang SC;
      font-weight: bold;
      line-height: 24px;
      color: #262626;
      vertical-align: middle;
      margin-bottom: 20px;
      margin-top: 28px;
      >img{
        vertical-align: middle;
        margin-right: 16px;
      }
      >span{
        vertical-align: middle;
        margin-right: 0px;
      }
      >.area{
        font-size: 16px;
        font-weight: normal;
      }
    }
  }
}
</style>
