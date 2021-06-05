
<template>
  <div>
    <div v-if="false" v-show="showSearch" ref="searchBox" class="app-container app-container--search">
      <el-form
        ref="queryForm"
        :model="queryParams"
        :inline="true"
        label-width="98px"
      >
        <el-form-item
          label="下单用户"
          prop="orderClient"
        >
          <el-input
            v-model="queryParams.orderClient"
            placeholder="发货企业/操作人/手机号"
            clearable
            size="small"
            style="width: 228px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item
          label="发货企业"
          prop="deliveryCompany"
        >
          <el-input
            v-model="queryParams.deliveryCompany"
            placeholder="请输入发货企业"
            clearable
            size="small"
            style="width: 228px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>

        <el-form-item
          label="装货信息"
          prop="loadInfo"
        >
          <el-input
            v-model="queryParams.loadInfo"
            placeholder="装货地/装货电话/发货人"
            clearable
            size="small"
            style="width: 228px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item
          label="卸货信息"
          prop="receivedInfo"
        >
          <el-input
            v-model="queryParams.receivedInfo"
            placeholder="卸货地/卸货电话/卸货人"
            clearable
            size="small"
            style="width: 228px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>

        <el-form-item
          label="调度者姓名"
          prop="teamName"
        >
          <el-input
            v-model="queryParams.teamName"
            placeholder="请输入调度者姓名"
            clearable
            size="small"
            style="width: 228px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>

        <el-form-item
          label="运单核对"
          prop="waybill"
        >
          <el-checkbox v-model="queryParams.waybill" />
        </el-form-item>

        <el-form-item
          label="IC卡核对状态"
          prop="icStatus"
        >
          <el-select
            v-model="queryParams.icStatus"
            placeholder="请选择纸质回单"
            filterable
            clearable
            size="small"
            style="width: 228px"
          >
            <el-option
              v-for="dict in [
                { dictValue: '0',dictLabel:'未核对' },
                { dictValue: '1',dictLabel:'已核对' }
              ]"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            />
          </el-select>
        </el-form-item>

        <el-form-item
          label="批次号"
          prop="criticism"
        >
          <el-input
            v-model="queryParams.criticism"
            placeholder="请输入批次号"
            clearable
            size="small"
            style="width: 228px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>

        <el-form-item label="货物大类" prop="goodsBigType">
          <el-select
            v-model="queryParams.goodsBigType"
            placeholder="请选择货物大类"
            filterable
            clearable
            style="width: 228px"
            size="small"
          >
            <el-option
              v-for="dict in commodityCategoryCodeOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="货源单号"
          prop="mainOrderNumber"
        >
          <el-input
            v-model="queryParams.mainOrderNumber"
            placeholder="请输入货源单号"
            clearable
            size="small"
            style="width: 228px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item
          label="接单日期"
          prop="receiveTime"
        >
          <el-date-picker
            v-model="receiveTime"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            style="width: 228px"
            @change="datechoose"
          />
        </el-form-item>
        <el-form-item
          label="车牌号"
          prop="licenseNumber"
        >
          <el-input
            v-model="queryParams.licenseNumber"
            placeholder="请输入车牌号"
            clearable
            size="small"
            style="width: 228px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item
          label="司机姓名"
          prop="driverName"
        >
          <el-input
            v-model="queryParams.driverName"
            placeholder="请输入司机姓名"
            clearable
            size="small"
            style="width: 228px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item
          label="运输单号"
          prop="waybillNo"
        >
          <el-input
            v-model="queryParams.waybillNo"
            placeholder="请输入运输单号"
            clearable
            size="small"
            style="width: 228px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="纸质回单" prop="isReturn">
          <el-select
            v-model="queryParams.isReturn"
            placeholder="请选择纸质回单"
            filterable
            clearable
            size="small"
            style="width: 228px"
          >
            <el-option
              v-for="dict in isReturnOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="分单" prop="isChild">
          <el-select
            v-model="queryParams.isChild"
            placeholder="请选择分单"
            filterable
            clearable
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
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            icon="el-icon-search"
            size="mini"
            @click="handleQuery"
          >
            搜索
          </el-button>
          <el-button
            type="primary"
            plain
            icon="el-icon-refresh"
            size="mini"
            @click="resetQuery"
          >
            重置
          </el-button>
        </el-form-item>
      </el-form>

    </div>

    <div class="app-container">
      <div>
        <el-row
          v-if="false"
          :gutter="10"
          class="mb8"
        >
          <el-col :span="1.5">
            <el-button
              v-hasPermi="['transportation:waybillBalanceInfo:batchCheck']"
              type="primary"
              icon="el-icon-document-checked"
              size="mini"
              :disabled="multiple"
            >批量核算</el-button>
          </el-col>

          <el-col :span="1.5" class="fr">
            <tablec-cascader v-model="tableColumnsConfig" :lcokey="api" />
          </el-col>
          <right-toolbar
            :show-search.sync="showSearch"
            @queryTable="getList"
          />
        </el-row>
        <RefactorTable :loading="loading" :data="adjustlist" :table-columns-config="tableColumnsConfig" @selection-change="handleSelectionChange">
          <template #goodsBigType="{row}">
            <span>{{ selectDictLabel(commodityCategoryCodeOptions, row.goodsBigType) }}</span>
          </template>
          <template #loadWeight="{row}">
            <span v-if="row.loadWeight">
              <span v-if="row.stowageStatus === '0' || !row.stowageStatus">{{ row.loadWeight }} 吨</span>
              <span v-if="row.stowageStatus === '1'">{{ row.loadWeight }} 立方</span>
              <span v-if="row.stowageStatus === '2'">{{ Math.floor(row.loadWeight) }} 车</span>
            </span>
          </template>
          <template #icStatus="{row}">
            <span v-if="row.icStatus == '0'"><i class="el-icon-error g-color-error mr10" />未核对</span>
            <span v-if="row.icStatus == '1'"><i class="el-icon-success g-color-success mr10" />已核对</span>
          </template>
          <template #unloadWeight="{row}">
            <span v-if="row.unloadWeight">
              <span v-if="row.stowageStatus === '0' || !row.stowageStatus">{{ row.unloadWeight }} 吨</span>
              <span v-if="row.stowageStatus === '1'">{{ row.unloadWeight }} 立方</span>
              <span v-if="row.stowageStatus === '2'">{{ Math.floor(row.unloadWeight) }} 车</span>
            </span>
          </template>
          <template #weight="{row}">
            <span v-if="row.weight">
              <span v-if="row.stowageStatus === '0' || !row.stowageStatus">{{ row.weight }} 吨</span>
              <span v-if="row.stowageStatus === '1'">{{ row.weight }} 立方</span>
              <span v-if="row.stowageStatus === '2'">{{ Math.floor(row.weight) }} 车</span>
            </span>
          </template>
          <template #lastLoadingTime="{row}">
            <span>{{ parseTime(row.lastLoadingTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
          </template>

        </RefactorTable>

        <!-- <pagination
          v-show="total>0"
          :total="total"
          :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize"
          @pagination="getList"
        /> -->
      </div>
    </div>
  </div>
</template>

<script>
import { adjustListApi } from '@/api/settlement/adjust';


export default {
  'name': 'AdjustDregs',
  // mixins: [setTheight],
  props: {
    list: { type: Array, default: () => [] }
  },
  data() {
    return {
      tableColumnsConfig: [],
      // 遮罩层
      'loading': false,
      // 选中数组
      'ids': [],
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      'showSearch': true,
      // 总条数
      'total': 0,
      // 表格数据
      'adjustlist': [],

      // 查询参数
      'queryParams': {
        'pageNum': 1,
        'pageSize': 10,
        'loadInfo': undefined,
        'receivedInfo': undefined,
        'goodsBigType': undefined,
        'mainOrderNumber': undefined,
        'orderEndTime': undefined,
        'orderStartTime': undefined,
        'licenseNumber': undefined,
        'driverName': undefined,
        'waybillNo': undefined,
        'icStatus': undefined,
        'orderClient': undefined,
        'deliveryCompany': undefined,
        'isReturn': undefined,
        'isChild': undefined,
        'status': '4',
        teamName: undefined,
        waybill: false,
        criticism: undefined
      },

      // 大类字典类型
      commodityCategory: {
        'dictPid': '0',
        'dictType': 'goodsType'
      },
      // 纸质回单字典
      isReturnOptions: [
        { 'dictLabel': '未回单', 'dictValue': '0' },
        { 'dictLabel': '已回单', 'dictValue': '1' }
      ],
      // 是否子单字典
      isChildOptions: [
        { 'dictLabel': '否', 'dictValue': '0' },
        // { 'dictLabel': '子单', 'dictValue': '1' },
        { 'dictLabel': '是', 'dictValue': '2' }
      ],
      receiveTime: [],
      commodityCategoryCodeOptions: [],

      addition: 45 // tin添加的(追加高度)

    };
  },
  computed: {
    api() {
      return adjustListApi + '--adjustDregs66';
    }

  },


  created() {
    this.tabColInit();

    this.adjustlist = this.list;

    this.listByDict(this.commodityCategory).then(response => {
      this.commodityCategoryCodeOptions = response.data;
    });
  },
  'methods': {
    datechoose(date) {
      if (date) {
        this.queryParams.orderStartTime = this.parseTime(date[0], '{y}-{m}-{d}');
        this.queryParams.orderEndTime = this.parseTime(date[1], '{y}-{m}-{d}');
      } else {
        this.queryParams.orderStartTime = null;
        this.queryParams.orderEndTime = null;
      }
    },
    /** 表头初始化 */
    tabColInit() {
      !this.tableColumnsConfig.length && this.tableHeaderConfig(
        this.tableColumnsConfig,
        this.api, null,
        [
          {
            prop: 'icStatus',
            isShow: true,
            tooltip: false,
            sortNum: 8,
            label: 'IC卡核对状态',
            width: 120
          }, { // 需要顶替掉的项
            prop: 'huojhzouihfowe',
            isShow: true,
            tooltip: false,
            sortNum: 28,
            label: '货主应付金额',
            width: 120
          }, { // 需要顶替掉的项
            prop: 'isReturn',
            isShow: false,
            tooltip: false,
            sortNum: 0,
            label: '纸质回单状态',
            width: 120
          }
        ]);
    },

    /** 多选框选中数据 */
    handleSelectionChange(selection) {
      this.multiple = !selection.length;
    },

    /** 查询【请填写功能名称】列表 */
    getList(response) {
      this.adjustlist = response.rows;
      this.total = response.total;
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
      this.queryParams.orderStartTime = null;
      this.queryParams.orderEndTime = null;
      this.handleQuery();
    }

  }
};
</script>
