<template>
  <div>
    <div v-show="showSearch" class="app-container app-container--search">
      <el-form ref="queryForm" :model="queryParams" :inline="true" label-width="90px">
        <el-form-item label="客户名称" prop="clientName">
          <el-input
            v-model.trim="queryParams.clientName"
            placeholder="请输入客户名称"
            clearable
            size="small"
            style="width: 228px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
          <el-form-item label="所属业务团队" prop="clientName">
            <el-input
              v-model.trim="queryParams.teamName"
              placeholder="请输入团队名称"
              clearable
              size="small"
              style="width: 228px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>

        <el-form-item label="客户等级" prop="userGradeDictValue">
          <el-select
            v-model="queryParams.userGradeDictValue"
            placeholder="请选择运单状态"
            clearable
            filterable
            size="small"
            style="width: 228px"
          >
            <el-option
              v-for="dict in userGrade"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="检索日期"
          prop="receiveTime"
        >
          <el-date-picker
            v-model="receiveTime"
            type="datetimerange"
            unlink-panels
            :picker-options="pickerTimeOptions"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            style="width: 228px"
            :default-time="defaultTime"
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

      </RefactorTable>

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
import { inspectStatisticsListApi,getInspectStatisticsList } from '@/api/waybill/audit';
import { getUserInfo } from '@/utils/auth';
import { pickerTimeOptions } from '@/utils/dateRange';

export default {
  name: 'Manages',
  components: {
    // MultimodeDetail
  },
  data() {
    return {
      defaultTime: ['00:00:00', '23:59:59'], // '00:00:00', '23:59:59'
      pickerTimeOptions,
      receiveTime: [],
      tableColumnsConfig: [],
      api: inspectStatisticsListApi,
      userGrade:[],
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
      // 来源字典
      sourceTypeOptions: [
        { 'dictLabel': 'HZZD', 'dictValue': '1' },
        { 'dictLabel': 'FM', 'dictValue': '2' },
        { 'dictLabel': 'ZZJD', 'dictValue': '3' },
        { 'dictLabel': 'HTZP', 'dictValue': '4' },
        { 'dictLabel': 'WLPZ', 'dictValue': '5' }
      ],
      // 查询参数
      'queryParams': {
        'pageNum': 1,
        'pageSize': 10,
        'clientName': null,
        'endTime': null,
        'startTime': null,
        'teamName': null,
        'userGradeDictValue': null
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
    // 稽核情况字典获取
    this.getDicts('user_grade').then(response => {
      this.userGrade = response.data;
    });
    this.tableHeaderConfig(this.tableColumnsConfig, inspectStatisticsListApi, {
      prop: 'edit',
      isShow: true,
      label: '操作',
      width: 180
      // fixed: 'left'
    });
    this.getList();
  },
  methods: {
    datechoose(date) {
      if (date) {
        this.queryParams.startTime = this.parseTime(date[0], '{y}-{m}-{d}');
        this.queryParams.endTime = this.parseTime(date[1], '{y}-{m}-{d}');
      } else {
        this.queryParams.startTime = null;
        this.queryParams.endTime = null;
      }
    },
    /** 查询列表 */
    getList() {
      this.loading = true;
      const params = { ...this.queryParams };
      getInspectStatisticsList(params.clientName,params.endTime,params.startTime,params.teamName,params.userGradeDictValue,params.pageNum,params.pageSize).then(response => {
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
      this.queryParams.startTime = null;
      this.queryParams.endTime = null;
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
