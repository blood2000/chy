
<template>
  <div class="app-container">
    <el-form
      v-show="showSearch"
      ref="queryForm"
      :model="queryParams"
      :inline="true"
      label-width="90px"
    >
      <el-form-item
        label="装货信息"
        prop="loadInfo"
      >
        <el-input
          v-model="queryParams.loadInfo"
          placeholder="请输入装货信息"
          clearable
          size="small"
          style="width: 225px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item
        label="收货信息"
        prop="receivedInfo"
      >
        <el-input
          v-model="queryParams.receivedInfo"
          placeholder="请输入收货信息"
          clearable
          size="small"
          style="width: 225px"
          @keyup.enter.native="handleQuery"
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
          style="width: 225px"
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
          style="width: 225px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="货物类型" prop="goodsBigType">
        <el-select
          v-model="queryParams.goodsBigType"
          placeholder="请选择货物类型"
          filterable
          clearable
          style="width: 225px"
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
        label="支付批次号"
        prop="orderClient"
      >
        <el-input
          v-model="queryParams.orderClient"
          placeholder="请输入支付批次号"
          clearable
          size="small"
          style="width: 225px"
          @keyup.enter.native="handleQuery"
        />
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
          style="width: 225px"
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
          style="width: 225px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item
        label="创建日期"
        prop="createTime"
      >
        <el-date-picker
          v-model="createTime"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          style="width: 225px"
          @change="datechoose"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          type="cyan"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
        >
          搜索
        </el-button>
        <el-button
          icon="el-icon-refresh"
          size="mini"
          @click="resetQuery"
        >
          重置
        </el-button>
      </el-form-item>
    </el-form>

    <el-row
      :gutter="10"
      class="mb8"
    >
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['assets:vehicle:edit']"
          type="success"
          icon="el-icon-wallet"
          size="mini"
          @click="handlePayment"
        >批量打款</el-button>
      </el-col>
      <el-col :span="1.5" class="fr">
        <tablec-cascader v-model="tableColumnsConfig" />
      </el-col>
      <right-toolbar
        :show-search.sync="showSearch"
        @queryTable="getList"
      />
    </el-row>

    <el-row
      :gutter="10"
      class="mb8"
    >
      <el-col :span="3">
        <span>运单数量：1321</span>
      </el-col>
      <el-col :span="3">
        <span>运费金额：1321</span>
      </el-col>
      <el-col :span="3">
        <span>运费税额：1321</span>
      </el-col>
      <el-col :span="3">
        <span>服务费金额：1321</span>
      </el-col>
      <el-col :span="3">
        <span>服务费税额：1321</span>
      </el-col>
    </el-row>

    <RefactorTable :loading="loading" :data="adjustlist" :table-columns-config="tableColumnsConfig" @selection-change="handleSelectionChange">
      <template #goodsBigType="{row}">
        <span>{{ selectDictLabel(commodityCategoryCodeOptions, row.goodsBigType) }}</span>
      </template>
      <template #isReturn="{row}">
        <span>{{ selectDictLabel(isReturnOptions, row.isReturn) }}</span>
      </template>
      <!-- <template #isChild="{row}">
        <span>{{ selectDictLabel(isChildOptions, row.isChild) }}</span>
      </template> -->

      <template #edit="{row}">
        <el-button
          v-hasPermi="['system:menu:edit']"
          size="mini"
          type="text"
          icon="el-icon-document-remove"
          @click="handleTableBtn(row, 1)"
        >驳回</el-button>
        <el-button
          size="mini"
          type="text"
          icon="el-icon-wallet"
          @click="handleTableBtn(row, 2)"
        >网商打款</el-button>
        <el-button
          v-if="row.isChild == '2'"
          size="mini"
          type="text"
          icon="el-icon-document-copy"
          @click="handleTableBtn(row, 3)"
        >分单列表</el-button>
        <el-button
          size="mini"
          type="text"
          icon="el-icon-document"
          @click="handleTableBtn(row, 4)"
        >详情</el-button>
      </template>
    </RefactorTable>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 驳回弹窗 -->
    <reject-dialog ref="RejectDialog" :open.sync="rejectdialog" :title="title" :disable="formDisable" @refresh="getList" />
    <!-- 子单弹窗 -->
    <child-dialog ref="ChildDialog" :open.sync="childdialog" :title="title" @refresh="getList" />
    <!-- 运单详情 对话框 -->
    <detail-dialog ref="DetailDialog" :current-id="currentId" :title="title" :open.sync="open" :disable="formDisable" @refresh="getList" />

  </div>
</template>

<script>
import { adjustList, adjustListApi } from '@/api/settlement/adjust';
// 驳回弹窗
import RejectDialog from '../components/rejectDialog';
// 子单弹窗
import ChildDialog from '../components/childDialog';
// 运单详情弹窗
import DetailDialog from '@/views/waybill/components/detailDialog';


export default {
  'name': 'AdjustList',
  components: { RejectDialog, DetailDialog, ChildDialog },
  data() {
    return {
      tableColumnsConfig: [],
      createTime: '',
      // 遮罩层
      'loading': false,
      // 选中数组
      //   'ids': [],
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
        'orderClient': undefined
      },
      receiveTime: [],
      // 弹框 内容
      visible: false,
      open: false,
      rejectdialog: false,
      childdialog: false,
      title: '',
      dialogWidth: '800px',
      // 当前选中的运单id
      currentId: null,
      // 表单是否禁用
      formDisable: false,
      // 商品类别编码字典
      commodityCategoryCodeOptions: [],
      // 大类字典类型
      commodityCategory: {
        'dictPid': '0',
        'dictType': 'goodsType'
      },
      // 纸质回单字典
      isReturnOptions: [
        { 'dictLabel': '未标记回单', 'dictValue': '0' },
        { 'dictLabel': '已标记回单', 'dictValue': '1' }
      ],
      // 是否子单字典
      isChildOptions: [
        { 'dictLabel': '否', 'dictValue': '0' },
        // { 'dictLabel': '子单', 'dictValue': '1' },
        { 'dictLabel': '是', 'dictValue': '2' }
      ]
    };
  },
  computed: {
  },
  created() {
    this.tableHeaderConfig(this.tableColumnsConfig, adjustListApi, {
      prop: 'edit',
      isShow: true,
      label: '操作',
      width: 275,
      fixed: 'right'
    });
    this.getList();
    this.listByDict(this.commodityCategory).then(response => {
      this.commodityCategoryCodeOptions = response.data;
    });
  },
  'methods': {
    datechoose(date) {
      this.queryParams.orderStartTime = this.parseTime(date[0], '{y}-{m}-{d}');
      this.queryParams.orderEndTime = this.parseTime(date[1], '{y}-{m}-{d}');
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id);
    },
    /** 查询【请填写功能名称】列表 */
    getList() {
      this.loading = true;
      adjustList(this.queryParams).then(response => {
        this.adjustlist = response.rows;
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
      this.handleQuery();
    },
    // 批量打款
    handlePayment() {
    },

    handleTableBtn(row, index) {
      // console.log(row, index);

      this.visible = true;
      switch (index) {
        case 1:
          this.$refs.RejectDialog.reset();
          this.rejectdialog = true;
          this.title = '驳回运输核算单';
          this.$refs.RejectDialog.setForm(row);
          console.log(row);
          break;
        case 2:
          this.title = '网商打款';
          break;
        case 3:
          this.title = '子单列表';
          this.childdialog = true;
          this.$refs.ChildDialog.setForm(row);
          break;
        case 4:
          this.$refs.DetailDialog.reset();
          this.currentId = row.wayBillCode;
          this.open = true;
          this.title = '运输单信息';
          this.formDisable = true;
          break;
        default:
          break;
      }
    }
  }
};
</script>
