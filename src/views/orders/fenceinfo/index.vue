<template>
  <div>
    <div class="search-wrap app-container">
      <el-form :inline="true" label-width="90px">
        <el-form-item label="车牌号">
          <el-input v-model="queryParams.licenseNumber" placeholder="搜索车牌号" clearable />
        </el-form-item>
        <el-form-item label="运单号">
          <el-input v-model="queryParams.waybillNo" placeholder="运单号" clearable />
        </el-form-item>
        <el-form-item label="司机姓名">
          <el-input v-model="queryParams.driverName" placeholder="司机姓名" clearable />
        </el-form-item>
        <el-form-item label="截止时间" prop="tin10">
          <el-date-picker
            v-model="tin10"
            size="small"
            style="width: 228px"
            value-format="yyyy-MM-dd"
            type="daterange"
            unlink-panels
            :picker-options="pickerOptions"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
          <el-form-item label="设备号">
            <el-input v-model="queryParams.imei" placeholder="搜索设备号" clearable />
          </el-form-item>
        </el-form-item>
        <el-form-item label="地址类型">
          <el-select v-model="queryParams.addressType" placeholder="----请选择----" clearable>
            <el-option label="装货地" value="load" />
            <el-option label="卸货地" value="unload" />
          </el-select>
        </el-form-item>
        <el-form-item label="订单类型">
          <el-select v-model="queryParams.efficient" placeholder="----请选择----" clearable>
            <el-option label="有效订单" value="true" />
            <el-option label="无效订单" value="false" />
          </el-select>
        </el-form-item>
      </el-form>
      <div class="btn-group">
        <el-button type="primary" @click="doSearch">搜索</el-button>
        <el-button type="default" @click="doReset">重置</el-button>
      </div>
    </div>
    <div class="app-container">
      <el-table
        v-loading="loading"
        :data="list"
        style="width: 100%"
        border
      >
        <el-table-column
          prop="driverName"
          label="司机姓名"
          width="200px"
          align="center"
        />
        <el-table-column
          prop="imei"
          label="设备号"
          width="200px"
          align="center"
        />
        <el-table-column
          prop="licenseNumber"
          label="车牌号"
          width="200px"
          align="center"
        />
        <el-table-column
          prop="collisionTime"
          label="碰撞时间"
          align="center"
        />
        <el-table-column
          prop="addressType"
          label="围栏碰撞类型"
          align="center"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.addressType == 'load' ? '进装货地' : '出卸货地' }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="waybillNo"
          label="运单号"
          align="center"
        >
          <template slot-scope="scope">
            <router-link v-if="scope.row.waybillNo != 0" :to="`/waybill/manages?waybillNo=2201101803527554`">{{ scope.row.waybillNo }}</router-link>
          </template>
        </el-table-column>
        <el-table-column
          prop="msg"
          label="原因"
          align="center"
        />
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
import { getList } from '@/api/order/fenceinfo';
import { pickerOptions } from '@/utils/dateRange';
export default {
  data() {
    return {
      list: [],
      formInline: {
        user: '',
        region: ''
      },
      orderCode: '',
      tin10: [],
      total: 0,
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        driverName: '',
        licenseNumber: '',
        startTime: '',
        endTime: '',
        waybillNo: '',
        addressType: '',
        efficient: '',
        imei: ''

      },
      pickerOptions,
      loading: false
    };
  },
  computed: {
  },
  created() {
    this.orderCode = this.$route.query.orderCode;

    this.getList();
  },
  methods: {
    getList() {
      this.queryParams.startTime = this.tin10 && this.tin10[0] && `${this.tin10[0]} 00:00:00` || '';
      this.queryParams.endTime = this.tin10 && this.tin10[1] && `${this.tin10[1]} 00:00:00` || '';
      this.loading = true;
      getList({
        ...this.queryParams,
        orderCode: this.orderCode
      }).then(res => {
        this.list = res.data.list;
        this.total = res.data.total;
        this.loading = false;
      }).catch(() => {
        this.loading = false;
      });
    },
    doSearch() {
      this.getList();
    },
    doReset() {
      this.queryParams = {
        driverName: '',
        licenseNumber: '',
        startTime: '',
        endTime: '',
        waybillNo: '',
        addressType: '',
        efficient: '',
        imei: ''
      };
      this.tin10 = [];
      this.getList();
    }
  }
};
</script>

<style lang="scss">
.btn-group {
  margin-top: 15px;
}
</style>
