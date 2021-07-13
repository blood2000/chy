<template>
  <!-- 2.0运力 -->
  <div>
    <div v-show="showSearch" class="app-container app-container--search">
      <el-form ref="queryForm" :model="queryParams" :inline="true">
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
            style="width: 300px"
            size="small"
            @change="datechoose"
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

    <div class="app-container total_box">
      <img src="../../../../src/assets/images/icon/total.png" alt="">
      <span>新增货主：{{ capacityCount.addShipment || 0 }}</span>
      <span>新增司机：{{ capacityCount.addDriver || 0 }}</span>
      <span>新增调度者：{{ capacityCount.addScheduler || 0 }}</span>
    </div>

    <div class="app-container">
      <div class="total_bg">
        <img src="../../../../src/assets/images/icon/total.png" alt="">
        <span>总运单数：{{ waybillCount.sumWaybillCount || 0 }}</span>
        <span>已装货：{{ waybillCount.sumLoadingNum || 0 }}</span>
        <span>已卸货：{{ waybillCount.sumUnloadingNum || 0 }}</span>
        <span>已核算：{{ waybillCount.sumSettledNum || 0 }}</span>
        <span>已打款：{{ waybillCount.sumPaidNum || 0 }}</span>
      </div>

      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <!-- v-hasPermi -->
          <el-button
            type="primary"
            icon="el-icon-download"
            size="mini"
            :loading="exportLoading"
            @click="handleExport"
          >导出</el-button>
        </el-col>
        <right-toolbar :show-search.sync="showSearch" @queryTable="getList" />
      </el-row>

      <el-table v-loading="loading" highlight-current-row border :data="infoList">
        <el-table-column label="货主公司名称" align="center" prop="companyName" min-width="180" />
        <el-table-column label="货源单号" align="center" prop="mainOrderNumber" min-width="150" />
        <el-table-column label="总运单数" align="center" prop="waybillCount" sortable />
        <el-table-column label="已装货" align="center" prop="loadingNum" sortable />
        <el-table-column label="已卸货" align="center" prop="unloadingNum" sortable />
        <el-table-column label="已核算" align="center" prop="settledNum" sortable />
        <el-table-column label="已打款" align="center" prop="paidNum" sortable />
        <!-- <template slot-scope="scope">
            <i v-show="scope.row.authStatus === 0" class="g-icon-none mr5" />
            <i v-show="scope.row.authStatus === 1" class="g-icon-deal-blue mr5" />
            <i v-show="scope.row.authStatus === 2" class="el-icon-error g-color-error mr5" />
            <i v-show="scope.row.authStatus === 3" class="el-icon-success g-color-success mr5" />
            <span>{{ selectDictLabel(statusOptions, scope.row.authStatus) }}</span>
          </template> -->
      </el-table>

      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        :page-sizes="[10, 20, 50, 100, 200, 300]"
        @pagination="getList"
      />
    </div>
  </div>
</template>

<script>
import { pickerOptions } from '@/utils/dateRange';
import { capacityStatisticsCount, waybillStatisticsCount, waybillStatisticsList } from '@/api/data/capacity';
const dTime = '2021-07-04 00:00:00';
export default {
  name: 'Capacity',
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
        pageNum: 1,
        pageSize: 10
      },
      timeParams: {
        beginTime: null,
        endTime: null
      },
      receiveTime: [],
      infoList: [],
      capacityCount: {},
      waybillCount: {},
      exportLoading: false
    };
  },
  mounted() {
    this.getList();
    this.getCapacityCount();
    this.getWaybillCount();
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
      this.queryParams.pageNum = 1;
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
      const params = Object.assign({}, this.queryParams, this.timeParams);
      waybillStatisticsList(params).then(response => {
        this.infoList = response.data.list;
        this.total = response.data.total;
        this.loading = false;
      });
    },
    /** 查询运力统计 */
    getCapacityCount() {
      capacityStatisticsCount(this.timeParams).then(response => {
        this.capacityCount = response.data;
      });
    },
    /** 查询运单统计 */
    getWaybillCount() {
      waybillStatisticsCount(this.timeParams).then(response => {
        this.waybillCount = response.data;
      });
    },
    /** 导出按钮 */
    handleExport() {
      this.exportLoading = true;
      const params = Object.assign({}, this.timeParams);
      this.download('/transportation/capacityStatistics/export', params, `2.0运力`).then(() => {
        this.exportLoading = false;
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.total_box, .total_bg{
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
.total_bg{
  background: #F8F9FA;
  border-radius: 4px;
  padding: 10px 20px;
  margin-bottom: 10px;
  overflow: hidden;
}
</style>
