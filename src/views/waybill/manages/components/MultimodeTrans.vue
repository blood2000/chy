<template>
  <div>
    <div v-show="showSearch" class="app-container app-container--search">
      <el-form ref="queryForm" :model="queryParams" :inline="true" label-width="90px">
        <el-form-item label="负责人" prop="mPrincipal">
          <el-input
            v-model.trim="queryParams.mPrincipal"
            placeholder="请输入负责人姓名"
            clearable
            size="small"
            style="width: 228px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <!-- <el-form-item label="司机电话" prop="driverPhone">
          <el-input
            v-model.trim="queryParams.driverPhone"
            placeholder="请输入电话号码"
            clearable
            size="small"
            style="width: 228px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item> -->
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
        <el-form-item label="主运单号" prop="waybillNo">
          <el-input
            v-model.trim="queryParams.waybillNo"
            placeholder="请输入主运单号"
            clearable
            size="small"
            style="width: 228px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item v-show="!isShipment" label="下单客户" prop="orderClient">
          <el-input
            v-model.trim="queryParams.orderClient"
            placeholder="请输入下单客户"
            clearable
            size="small"
            style="width: 228px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <!-- <el-form-item label="独立核算" prop="status">
          <el-select
            v-model="queryParams.status"
            placeholder="请选择独立核算"
            clearable
            filterable
            size="small"
            style="width: 228px"
          >
            <el-option
              v-for="dict in statusOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="审核状态" prop="isChildList">
          <el-select
            v-model="queryParams.isChildList"
            placeholder="请选择审核状态"
            clearable
            filterable
            size="small"
            style="width: 228px"
          >
            <el-option
              v-for="dict in isChildOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            />
          </el-select>
        </el-form-item> -->
        <el-form-item label="状态" prop="status">
          <el-select
            v-model="queryParams.status"
            placeholder="请选择状态"
            clearable
            filterable
            size="small"
            style="width: 228px"
          >
            <el-option
              v-for="dict in statusOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            />
          </el-select>
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
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5" class="fr">
          <tablec-cascader v-model="tableColumnsConfig" :lcokey="api" />
        </el-col>
        <right-toolbar :show-search.sync="showSearch" @queryTable="getList" />
      </el-row>

      <!-- table -->
      <!-- <el-table v-loading="loading" :data="managesList" highlight-current-row border fit style="width: 100%">
        <el-table-column type="expand">
          <template #default="props">
            <el-scrollbar always>
              <div class="g-aligncenter">
                <div v-for="(item, index) in 10" :key="index" class="child-frame">
                  <div class="child-title">2021-08-09 13:32:15</div>
                  <div class="g-aligncenter child-tag" style="font-size:20px;margin:10px 0;">◆ <div class="child-line" /></div>
                  <div class="child-info">
                    <div class="g-aligncenter g-justifybetween">
                      <div class="child-title">分运单号LU2576917690 水运</div>
                      <div class="child-detail">查看详情</div>
                    </div>
                    <div class="g-aligncenter g-justifybetween" style="margin-top:17px">
                      <div>
                        <div class="child-tag">发生地：</div>
                        <div class="child-title" style="margin-top:5px">东京港</div>
                      </div>
                      <div>
                        <div class="child-tag">物流状态：</div>
                        <div class="child-title" style="margin-top:5px">在途</div>
                      </div>
                      <div>
                        <div class="child-tag">状态灯：</div>
                        <div class="g-color-success" style="margin-top:5px">● {{ selectDictLabel(statusOptions, props.row.status) }}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </el-scrollbar>
          </template>
        </el-table-column>
        <el-table-column label="序号" align="center" type="index" width="50" />
        <el-table-column label="操作" align="center" width="120">
          <template #default="props">
            <el-button
              v-hasPermi="['transportation:waybill:getWayBillByCode']"
              size="mini"
              type="text"
              @click="handleDetail(props.row)"
            >
              详情
            </el-button>
          </template>
        </el-table-column>
        <el-table-column label="主单号" align="center" prop="waybillNo" show-overflow-tooltip min-width="120" />
        <el-table-column label="货主" align="center" prop="orderClient" show-overflow-tooltip min-width="120" />
        <el-table-column label="货物类型" align="center" prop="goodsType" show-overflow-tooltip min-width="120" />
        <el-table-column label="起始地" align="center" prop="loadAddress" show-overflow-tooltip min-width="120" />
        <el-table-column label="目的地" align="center" prop="unloadAddress" show-overflow-tooltip min-width="120" />
        <el-table-column label="装货重量" align="center" prop="loadWeight" show-overflow-tooltip min-width="120" />
        <el-table-column label="卸货重量" align="center" prop="unloadWeight" show-overflow-tooltip min-width="120" />
        <el-table-column label="装货时间" align="center" prop="fillTime" show-overflow-tooltip min-width="120" />
        <el-table-column label="卸货时间" align="center" prop="signTime" show-overflow-tooltip min-width="120" />
        <el-table-column label="主承运人" align="center" prop="driverName" show-overflow-tooltip min-width="120" />
        <el-table-column label="最新状态" align="center" prop="status" show-overflow-tooltip min-width="120">
          <template #default="props">
            <span>{{ selectDictLabel(statusOptions, props.row.status) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态时间" align="center" prop="wayBillUpdateTime" show-overflow-tooltip min-width="120" />
      </el-table> -->
      <!-- @selection-change="handleSelectionChange" -->
      <RefactorTable :loading="loading" :data="managesList" :is-show-expand="true" :table-columns-config="tableColumnsConfig">
        <template #expand="{row}">
          <el-scrollbar always>
            <div class="g-aligncenter">
              <div v-for="(item, index) in row.sonList" :key="index" class="child-frame">
                <div class="child-title">{{ item.updateTime }}</div>
                <div class="g-aligncenter child-tag" style="font-size:20px">◆ <div class="child-line" /></div>
                <div class="child-info">
                  <div class="g-aligncenter g-justifybetween">
                    <div class="child-title">分运单号{{ item.waybillNo }} {{ selectDictLabel(mtransModeOptions, item.mtransMode) }}</div>
                    <div class="child-detail">查看详情</div>
                  </div>
                  <div class="g-aligncenter g-justifybetween" style="margin-top:17px">
                    <div style="max-width: 150px;">
                      <div class="child-tag">装货地：</div>
                      <div class="child-title" style="margin-top:5px;height:44px;">{{ item.loadAddress }}</div>
                    </div>
                    <div style="max-width: 150px;">
                      <div class="child-tag">卸货地：</div>
                      <div class="child-title" style="margin-top:5px;height:44px;">{{ item.unloadAddress }}</div>
                    </div>
                    <div>
                      <div class="child-tag">状态灯：</div>
                      <div class="g-color-success" style="margin-top:5px;height:44px;">● {{ selectDictLabel(statusOptions, item.status) }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </el-scrollbar>
        </template>
        <template #status="{row}">
          <span>{{ selectDictLabel(statusOptions, row.status) }}</span>
        </template>
        <template #stowageStatus="{row}">
          <span>{{ selectDictLabel(stowageStatusOptions, row.stowageStatus) }}</span>
        </template>
        <template #sourceType="{row}">
          <span>{{ selectDictLabel(sourceTypeOptions, row.sourceType) }}</span>
        </template>
        <template #goodsPrice="{row}">
          <span>{{ row.goodsPrice ? floor(row.goodsPrice) + ' 元/' + (selectDictLabel(stowageStatusOptions, row.stowageStatus)) :'-' }}</span>
        </template>
        <template #mileage="{row}">
          <span>{{ floor(row.mileage) }}</span>
        </template>
        <template #freightPrice="{row}">
          <span>{{ row.freightPrice ? floor(row.freightPrice) + ' 元/' + (selectDictLabel(stowageStatusOptions, row.stowageStatus)) :'-' }}</span>
        </template>
        <template #freightPriceDriver="{row}">
          <span>{{ row.freightPriceDriver ? floor(row.freightPriceDriver) + ' 元/' + (selectDictLabel(stowageStatusOptions, row.stowageStatus)) :'-' }}</span>
        </template>
        <template #taxFee="{row}">
          <span>{{ floor(row.taxFee) }}</span>
        </template>
        <template #shipperCopeFee="{row}">
          <span>{{ floor(row.shipperCopeFee) }}</span>
        </template>
        <template #taxFreeFee="{row}">
          <span>{{ floor(row.taxFreeFee) }}</span>
        </template>
        <template #deliveryFeeDeserved="{row}">
          <span>{{ floor(row.deliveryFeeDeserved) }}</span>
        </template>
        <template #taxPayment="{row}">
          <span>{{ floor(row.taxPayment) }}</span>
        </template>
        <template #serviceFee="{row}">
          <span>{{ floor(row.serviceFee) }}</span>
        </template>
        <template #deliveryFeePractical="{row}">
          <span>{{ floor(row.deliveryFeePractical) }}</span>
        </template>
        <template #lossDeductionFee="{row}">
          <span>{{ floor(row.lossDeductionFee) }}</span>
        </template>
        <template #m0Fee="{row}">
          <span>{{ floor(row.m0Fee) }}</span>
        </template>
        <template #driverAddFee="{row}">
          <span>{{ floor(row.driverAddFee) }}</span>
        </template>
        <template #driverReductionFee="{row}">
          <span>{{ floor(row.driverReductionFee) }}</span>
        </template>
        <template #isWarning="{row}">
          <span>{{ selectDictLabel(isWarningOptions, row.isWarning) }}</span>
        </template>
        <template #loadWeight="{row}">
          <span v-if="row.loadWeight">
            <span v-if="row.stowageStatus === '0' || !row.stowageStatus">{{ row.loadWeight }} 吨</span>
            <span v-if="row.stowageStatus === '1'">{{ row.loadWeight }} 方</span>
            <span v-if="row.stowageStatus === '2'">{{ Math.floor(row.loadWeight) }} 车</span>
          </span>
        </template>
        <template #unloadWeight="{row}">
          <span v-if="row.unloadWeight">
            <span v-if="row.stowageStatus === '0' || !row.stowageStatus">{{ row.unloadWeight }} 吨</span>
            <span v-if="row.stowageStatus === '1'">{{ row.unloadWeight }} 方</span>
            <span v-if="row.stowageStatus === '2'">{{ Math.floor(row.unloadWeight) }} 车</span>
          </span>
        </template>
        <template #receiveTime="{row}">
          <span>{{ parseTime(row.receiveTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
        <template #wayBillUpdateTime="{row}">
          <span>{{ parseTime(row.wayBillUpdateTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
        <template #edit="{row}">
          <el-button
            v-hasPermi="['transportation:waybill:getWayBillByCode']"
            size="mini"
            type="text"
            @click="handleDetail(row)"
          >
            详情
          </el-button>
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
    <!-- 详情对话框 -->
    <multimode-detail
      :title="title"
      :open.sync="open"
      :current-id="currentId"
      @refresh="getList"
    />
  </div>
</template>

<script>
import { multiListApi, getMultiList } from '@/api/waybill/manages';
import MultimodeDetail from './MultimodeDetail';
import { getUserInfo } from '@/utils/auth';
import { pickerOptions } from '@/utils/dateRange';

export default {
  name: 'Manages',
  components: {
    MultimodeDetail
  },
  data() {
    return {
      pickerOptions,
      receiveTime: [],
      tableColumnsConfig: [],
      api: multiListApi,
      // 遮罩层
      'loading': true,
      // 选中数组
      'ids': [],
      // 显示搜索条件
      'showSearch': true,
      // 总条数
      'total': 0,
      // 表格数据
      'managesList': [],
      // 弹出层标题
      'title': '',
      // 是否显示弹出层
      'open': false,
      // 是否字典
      'isOptions': [
        { 'dictLabel': '否', 'dictValue': 0 },
        { 'dictLabel': '是', 'dictValue': 1 }
      ],
      // 运单状态字典
      'statusOptions': [
        { 'dictLabel': '未接单', 'dictValue': '0' },
        { 'dictLabel': '已接单', 'dictValue': '1' },
        { 'dictLabel': '已装货', 'dictValue': '2' },
        { 'dictLabel': '已签收', 'dictValue': '3' },
        { 'dictLabel': '已回单', 'dictValue': '4' },
        { 'dictLabel': '已核算', 'dictValue': '5' },
        { 'dictLabel': '申请打款', 'dictValue': '6' },
        { 'dictLabel': '已打款', 'dictValue': '7' },
        // { 'dictLabel': '申请开票', 'dictValue': '8' },
        // { 'dictLabel': '已开票', 'dictValue': '9' },
        // { 'dictLabel': '已作废', 'dictValue': '10' },
        { 'dictLabel': '已核验', 'dictValue': '11' },
        { 'dictLabel': '已完成', 'dictValue': '12' }
      ],
      // 运单状态字典
      'mtransModeOptions': [
        { 'dictLabel': '多式联运', 'dictValue': '100' },
        { 'dictLabel': '公路运输', 'dictValue': '200' },
        { 'dictLabel': '水路运输', 'dictValue': '300' },
        { 'dictLabel': '空运', 'dictValue': '400' },
        { 'dictLabel': '铁路运输', 'dictValue': '500' }
      ],
      // 查询参数
      'queryParams': {
        'pageNum': 1,
        'pageSize': 10,
        'mPrincipal': null,
        'startReceiveTime': null,
        'endReceiveTime': null,
        // 'mainOrderNumber': null,
        'orderClient': null,
        'status': null,
        'waybillNo': null
      },
      // 表单参数
      'form': {},
      // 表单校验
      'rules': {},
      'formDisable': false,
      // 当前选中的运单id
      'currentId': null,
      'currentRow': null,
      loadingExport: false,
      isAdmin: false,
      user: {},
      shipment: {},
      isShipment: false
    };
  },
  created() {
    const { isAdmin = false, isShipment = false, user = {}, shipment = {}} = getUserInfo() || {};
    this.isAdmin = isAdmin;
    this.isShipment = isShipment;
    this.user = user;
    this.shipment = shipment;
    this.tableHeaderConfig(this.tableColumnsConfig, multiListApi, {
      prop: 'edit',
      isShow: true,
      label: '操作',
      width: 180
      // fixed: 'left'
    });
    // this.queryParams.startReceiveTime = this.parseTime(new Date().getTime() - 24 * 60 * 60 * 1000 * 2, '{y}-{m}-{d}');
    // this.queryParams.endReceiveTime = this.parseTime(new Date(), '{y}-{m}-{d}');
    // this.receiveTime = [new Date(new Date().getTime() - 24 * 60 * 60 * 1000 * 2), new Date()];
    this.getList();
  },
  methods: {
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
      const params = { ...this.queryParams };
      if (params.licenseNumber) {
        params.licenseNumber = params.licenseNumber.toUpperCase();
      }
      getMultiList(params).then(response => {
        this.managesList = response.rows;
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
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    // 导出
    handleExport() {
      this.loadingExport = true;
      this.download('/transportation/waybill/manageListExport', { ...this.queryParams }, `运输单管理`).then(res => {
        this.loadingExport = false;
      });
    },
    /** 详情按钮操作 */
    handleDetail(row) {
      this.currentId = row.wayBillCode;
      this.open = true;
      this.title = '主运单信息';
    }
  }
};
</script>

<style  lang="scss" scoped>
::v-deep .el-table__expanded-cell{
  background: #F9FCFF;
}
.child-frame + .child-frame {
  margin-left: 10px;
}
.child-frame{
  width: 460px;
  .child-line{
    margin-left: 9px;
    width: 440px;
    border: 1px dashed #BCC6CF;
  }
  .child-info{
    width: 430px;
    padding: 10px 16px 18px;
    background: #FFFFFF;
    box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.05);
    border-radius: 6px;
    .child-detail{
      font-size: 14px;
      font-family: PingFang SC;
      font-weight: 400;
      line-height: 22px;
      color: #1990FF;
    }
  }
}
.child-tag{
  font-size: 14px;
  font-family: PingFang SC;
  font-weight: 400;
  line-height: 22px;
  color: #BCC6CF;
}
.child-title{
  font-size: 14px;
  font-family: PingFang SC;
  font-weight: bold;
  line-height: 22px;
  color: #7A8DA0;
  overflow: hidden; //超出隐藏
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}
</style>
