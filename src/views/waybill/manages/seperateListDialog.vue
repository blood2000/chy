<template>
  <el-dialog :title="title" :visible="visible" width="1300px" append-to-body :modal-append-to-body="false" class="waybill-seperate-list-dialog" @close="cancel">
    <el-table v-loading="loading" highlight-current-row border :data="childList">
      <el-table-column label="序号" align="center" fixed="left" type="index" width="50" />
      <el-table-column label="货源单号" align="center" prop="mainOrderNumber" width="150" />
      <el-table-column label="发货企业" align="center" prop="shipperFactory" width="150" />
      <el-table-column label="下单用户" align="center" prop="orderClient" width="160" />
      <el-table-column label="运输单号" align="center" prop="waybillNo" width="160" />
      <!-- <el-table-column label="运单状态" align="center" prop="status" :formatter="statusFormat" /> -->
      <el-table-column label="承运调度" align="center" prop="teamName" />
      <el-table-column label="承运人" align="center" prop="driverName" />
      <el-table-column label="司机电话" align="center" prop="driverPhone" width="150" />
      <el-table-column label="货物大类" align="center" prop="goodsBigType" />
      <el-table-column label="货物小类" align="center" prop="goodsType" width="150" />
      <el-table-column label="装货数量" align="center" prop="loadWeight">
        <template slot-scope="scope">
          <span v-if="scope.row.stowageStatus === '1'">{{ scope.row.loadWeight || '0.00' }} 方</span>
          <span v-if="scope.row.stowageStatus === '2'">{{ scope.row.loadWeight || '0.00' }} 车</span>
          <span v-if="scope.row.stowageStatus === '0' || !scope.row.stowageStatus">{{ scope.row.loadWeight || '0.00' }} 吨</span>
        </template>
      </el-table-column>
      <el-table-column label="卸货数量" align="center" prop="unloadWeight">
        <template slot-scope="scope">
          <span v-if="scope.row.stowageStatus === '1'">{{ scope.row.unloadWeight || '0.00' }} 方</span>
          <span v-if="scope.row.stowageStatus === '2'">{{ scope.row.unloadWeight || '0.00' }} 车</span>
          <span v-if="scope.row.stowageStatus === '0' || !scope.row.stowageStatus">{{ scope.row.unloadWeight || '0.00' }} 吨</span>
        </template>
      </el-table-column>
      <el-table-column label="数量(车)" align="center" prop="carNum" />
      <el-table-column label="用车类型" align="center" prop="carType" />
      <el-table-column label="货物单价" align="center" prop="goodsPrice" />
      <el-table-column label="运费单价" align="center" prop="freightPrice" />
      <el-table-column label="公里数" align="center" prop="mileage" />
      <el-table-column label="含税价" align="center" prop="taxFee" />
      <el-table-column label="不含税价" align="center" prop="noTaxFee" />
      <el-table-column label="装货地" align="center" prop="loadAddress" width="180" />
      <el-table-column label="卸货地" align="center" prop="unloadAddress" width="180" />
      <el-table-column label="发布货源时间" align="center" prop="orderTime" width="150">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.orderTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="接单时间" align="center" prop="receiveTime" width="150">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.receiveTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="装货截止时间" align="center" prop="lastLoadingTime" width="150">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.lastLoadingTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" fixed="left" width="100">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-document"
            @click="handleDetail(scope.row)"
          >
            详情
          </el-button>
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

    <!-- 详情对话框 -->
    <detail-dialog
      :title="'运输单信息'"
      :open.sync="detailOpen"
      :current-id="detailCurrentId"
      :disable="true"
      @refresh="getList"
    />
  </el-dialog>
</template>

<script>
import { waybillChild } from '@/api/waybill/manages';
import DetailDialog from '../components/detailDialog';

export default {
  components: {
    DetailDialog
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    open: Boolean,
    currentId: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      // 运单状态字典
      statusOptions: [
        { 'dictLabel': '未接单', 'dictValue': '0' },
        { 'dictLabel': '已接单', 'dictValue': '1' },
        { 'dictLabel': '已装货', 'dictValue': '2' },
        { 'dictLabel': '已签收(已卸货)', 'dictValue': '3' },
        { 'dictLabel': '已回单(收单复核)', 'dictValue': '4' },
        { 'dictLabel': '已核算', 'dictValue': '5' },
        { 'dictLabel': '已申请(打款)', 'dictValue': '6' },
        { 'dictLabel': '已打款', 'dictValue': '7' },
        { 'dictLabel': '已申请开票', 'dictValue': '8' },
        { 'dictLabel': '已开票', 'dictValue': '9' }
      ],
      loading: false,
      total: 0,
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        wayBillCode: null
      },
      childList: [],
      // 运单详情弹出层
      detailOpen: false,
      detailCurrentId: undefined
    };
  },
  computed: {
    visible: {
      get() {
        return this.open;
      },
      set(v) {
        this.$emit('update:open', v);
      }
    }
  },
  watch: {
    open(val) {
      if (val) {
        this.queryParams.wayBillCode = this.currentId;
        this.queryParams.pageNum = 1;
        this.getList();
      }
    }
  },
  methods: {
    // 运单状态字典翻译
    statusFormat(row, column) {
      return this.selectDictLabel(this.statusOptions, row.status);
    },
    // 获取子单列表
    getList() {
      this.loading = true;
      waybillChild(this.queryParams).then(response => {
        this.childList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.close();
    },
    // 关闭弹窗
    close() {
      this.$emit('update:open', false);
    },
    // 查看运单详情
    handleDetail(row) {
      this.detailCurrentId = row.wayBillCode;
      this.detailOpen = true;
    }
  }
};
</script>

<style lang="scss">
.waybill-seperate-list-dialog{
  .el-dialog__body{
    min-height: 70vh;
  }
}
</style>
