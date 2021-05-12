<template>
  <!-- 交易记录(冻结&付款) -->
  <div>
    <div v-show="showSearch" class="app-container app-container--search">
      <el-form ref="queryForm" :model="queryParams" :inline="true" label-width="80px">
        <el-form-item label="交易日期">
          <el-date-picker
            v-model="queryParams.updateTimeBegin"
            clearable
            type="date"
            size="small"
            value-format="yyyy-MM-dd"
            placeholder="请选择"
            @change="changeDatePicker"
          />
          至
          <el-date-picker
            v-model="queryParams.updateTimeEnd"
            clearable
            type="date"
            size="small"
            value-format="yyyy-MM-dd"
            placeholder="请选择"
            @change="changeDatePicker"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
          <el-button type="primary" plain icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="g-radio-group">
      <el-radio-group v-model="activeName" size="small" @change="handleClick">
        <el-radio-button label="近三月" />
        <el-radio-button label="近半年" />
        <el-radio-button label="近一年" />
      </el-radio-group>
    </div>
    <div class="app-container">
      <el-row :gutter="10" class="mb8">
        <right-toolbar :show-search.sync="showSearch" @queryTable="getList" />
      </el-row>

      <el-tabs v-model="activeTab" @tab-click="handleTabClick">
        <el-tab-pane label="冻结记录" name="dj" />
        <el-tab-pane label="付款记录" name="fk" />
      </el-tabs>
      <el-table v-show="activeTab == 'dj'" v-loading="loading" stripe border :data="dataList">
        <el-table-column label="运单号" align="center" prop="waybillNo" width="150" />
        <el-table-column label="装货地" align="center" prop="unloadAddress" width="150" />
        <el-table-column label="卸货地" align="center" prop="loadAddress" width="150" />
        <el-table-column label="货物大类" align="center" prop="goodsBigType">
          <template slot-scope="scope">
            <span>{{ selectDictLabel(commodityCategoryCodeOptions, scope.row.goodsBigType) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="货物小类" align="center" prop="goodsType">
          <template slot-scope="scope">
            <span>{{ selectDictLabel(commoditySubclassOptions, scope.row.goodsType) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="承运司机" align="center" prop="driverName" />
        <el-table-column label="承运车辆" align="center" prop="licenseNumber" />
        <el-table-column label="所属调度者" align="center" prop="teamName" width="150" />
        <!-- 付款方式：0-现金支付， 1-京东支付 2-交通银行， 3-新生支付，4-工商银行,5-传化支付,6-建行支付,7-环迅-->
        <el-table-column label="交易类型" align="center" prop="payBy">
          <span>冻结</span>
        </el-table-column>
        <el-table-column label="装货重量" align="center" prop="loadWeight" />
        <el-table-column label="卸货重量" align="center" prop="unloadWeight" />
        <el-table-column label="货物损耗(kg)" align="center" prop="wastage" />
        <el-table-column label="货物单价（元）" align="center" prop="goodsPrice" />
        <el-table-column label="成交单价（元）" align="center" prop="freightPriceDriver" />
        <el-table-column label="冻结总额（元）" align="center" prop="freezeMoney" />
        <el-table-column label="操作时间" align="center" prop="updateTime" width="180">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.updateTime) }}</span>
          </template>
        </el-table-column>
      </el-table>


      <el-table v-show="activeTab == 'fk'" v-loading="loading" stripe border :data="dataList">
        <el-table-column label="运单号" align="center" prop="waybillNo" width="150" />
        <el-table-column label="装货地" align="center" prop="unloadAddress" width="150" />
        <el-table-column label="卸货地" align="center" prop="loadAddress" width="150" />
        <el-table-column label="货物大类" align="center" prop="goodsBigType">
          <template slot-scope="scope">
            <span>{{ selectDictLabel(commodityCategoryCodeOptions, scope.row.goodsBigType) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="货物小类" align="center" prop="goodsType">
          <template slot-scope="scope">
            <span>{{ selectDictLabel(commoditySubclassOptions, scope.row.goodsType) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="承运司机" align="center" prop="driverName" />
        <el-table-column label="承运车辆" align="center" prop="licenseNumber" />
        <el-table-column label="所属调度者" align="center" prop="teamName" width="150" />
        <!-- 付款方式：0-现金支付， 1-京东支付 2-交通银行， 3-新生支付，4-工商银行,5-传化支付,6-建行支付,7-环迅-->
        <el-table-column label="交易类型" align="center" prop="payBy">
          <span>付款</span>
        </el-table-column>
        <el-table-column label="装货重量" align="center" prop="loadWeight" />
        <el-table-column label="卸货重量" align="center" prop="unloadWeight" />
        <el-table-column label="货物损耗(kg)" align="center" prop="wastage" />
        <el-table-column label="货物单价（元）" align="center" prop="goodsPrice" />
        <el-table-column label="成交单价（元）" align="center" prop="freightPriceDriver" />
        <el-table-column label="实付金额（元）" align="center" prop="amount">
          <!-- 金额：单位分转为元 -->
          <template slot-scope="scope">
            <span>{{ scope.row.amount ? (scope.row.amount/100).toFixed(2) : scope.row.amount }}</span>
          </template>
        <!-- 付款类型 -->
        </el-table-column>
        <el-table-column label="操作时间" align="center" prop="updateTime" width="180">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.updateTime) }}</span>
          </template>
        </el-table-column>
      </el-table>

      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getList"
      />
    </div>
  </div>
</template>

<script>
import { getUserInfo } from '@/utils/auth';
import { payRecordlist } from '@/api/capital/payrecord';
import { getTimeRange } from '@/utils/timeRange';

export default {
  name: 'TransactionRecord',
  data() {
    return {
      // 选中tab
      activeTab: 'dj', // dj冻结 fk付款
      // 遮罩层
      loading: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 表格数据
      dataList: [],
      // 交易类型字典
      typeOptions: [
        { dictLabel: '全部', dictValue: 0 }
      ],
      // 付款方式：0-现金支付， 1-京东支付 2-交通银行， 3-新生支付，4-工商银行,5-传化支付,6-建行支付,7-环迅
      payByOptions: [
        { dictLabel: '现金支付', dictValue: 0 },
        { dictLabel: '京东支付', dictValue: 1 },
        { dictLabel: '交通银行', dictValue: 2 },
        { dictLabel: '新生支付', dictValue: 3 },
        { dictLabel: '工商银行', dictValue: 4 },
        { dictLabel: '传化支付', dictValue: 5 },
        { dictLabel: '建行支付', dictValue: 6 },
        { dictLabel: '环迅', dictValue: 7 }
      ],
      // 查询参数
      queryParams: {
        usedFreeze: 1,
        pageNum: 1,
        pageSize: 10,
        updateTimeBegin: undefined,
        updateTimeEnd: undefined
      },
      activeName: '近三月',
      updateTimeBegin: undefined,
      updateTimeEnd: undefined,
      // 大类字典类型
      commodityCategory: {
        'dictPid': '0',
        'dictType': 'goodsType'
      },
      commodityCategoryCodeOptions: [],
      // 小类字典类型
      commoditySubclass: {
        'dictPid': '',
        'dictType': 'goodsType'
      },
      commoditySubclassOptions: []
    };
  },
  created() {
    this.changeTimeFormate();
    this.getList();
    this.listByDict(this.commodityCategory).then(response => {
      this.commodityCategoryCodeOptions = response.data;
    });
    this.listByDict(this.commoditySubclass).then(response => {
      this.commoditySubclassOptions = response.data;
    });
  },
  methods: {
    handleTabClick(e) {
      this.activeTab = e.name;
      if (this.activeTab === 'dj') {
        this.queryParams.usedFreeze = 1;
      } else {
        this.queryParams.usedFreeze = 0;
      }
      this.getList();
    },
    /** 查询列表 */
    getList() {
      this.loading = true;
      const { user = {}} = getUserInfo() || {};
      const { userCode } = user;
      payRecordlist(
        Object.assign(
          {},
          this.queryParams,
          { userCode: userCode },
          {
            updateTimeBegin: this.queryParams.updateTimeBegin ? this.queryParams.updateTimeBegin : this.updateTimeBegin,
            updateTimeEnd: this.queryParams.updateTimeEnd ? this.queryParams.updateTimeEnd : this.updateTimeEnd
          }
        )
      ).then(response => {
        this.dataList = response.data.rows;
        this.total = response.data.total;
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
      this.changeTimeFormate();
      this.resetForm('queryForm');
      this.handleQuery();
    },
    handleClick() {
      this.queryParams.pageNum = 1;
      this.changeTimeFormate();
      this.getList();
    },
    changeTimeFormate() {
      if (this.activeName === '') this.activeName = '近三月';
      this.queryParams.updateTimeBegin = undefined;
      this.queryParams.updateTimeEnd = undefined;
      let t = 0;
      if (this.activeName === '近三月') {
        t = 3;
      } else if (this.activeName === '近半年') {
        t = 6;
      } else if (this.activeName === '近一年') {
        t = 12;
      }
      const { start, end } = getTimeRange(t);
      this.updateTimeBegin = start;
      this.updateTimeEnd = end;
    },
    changeDatePicker() {
      this.activeName = '';
      this.updateTimeBegin = undefined;
      this.updateTimeEnd = undefined;
    }
  }
};
</script>
