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
        label="企业名称"
        prop="driverName"
      >
        <el-input
          v-model="queryParams.driverName"
          placeholder="请输入企业名称"
          clearable
          size="small"
          style="width: 230px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item
        label="货源单号"
        prop="driverPhone"
      >
        <el-input
          v-model="queryParams.driverPhone"
          placeholder="请输入货源单号"
          clearable
          size="small"
          style="width: 230px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="货物类型" prop="goodsBigType">
        <el-select
          v-model="queryParams.goodsBigType"
          placeholder="请选择货物类型"
          filterable
          clearable
          style="width: 230px"
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
        label="装货地址"
        prop="driverName"
      >
        <el-input
          v-model="queryParams.driverName"
          placeholder="请输入装货地址"
          clearable
          size="small"
          style="width: 230px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item
        label="收获地址"
        prop="driverPhone"
      >
        <el-input
          v-model="queryParams.driverPhone"
          placeholder="请输入收获地址"
          clearable
          size="small"
          style="width: 230px"
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
          style="width: 230px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item
        label="装货日期"
        prop="createTime"
      >
        <el-date-picker
          v-model="createTime"
          type="date"
          placeholder="请选择装货日期"
          style="width: 230px"
        />
      </el-form-item>
      <el-form-item
        label="卸货日期"
        prop="createTime"
      >
        <el-date-picker
          v-model="createTime"
          type="date"
          placeholder="请选择卸货日期"
          style="width: 230px"
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
          icon="el-icon-document-checked"
          size="mini"
          @click="handleAskfor"
        >批量索票</el-button>
        <el-button
          v-hasPermi="['assets:vehicle:edit']"
          type="info"
          icon="el-icon-upload2"
          size="mini"
          @click="handleExport"
        >导出</el-button>
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
      <template #isChild="{row}">
        <span>{{ selectDictLabel(isChildOptions, row.isChild) }}</span>
      </template>

      <template #edit="{row}">
        <el-button
          size="mini"
          type="text"
          icon="el-icon-document"
          @click="handleTableBtn(row, 1)"
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
    <!-- <reject-dialog ref="RejectDialog" :open.sync="rejectdialog" :title="title" :disable="formDisable" @refresh="getList" /> -->
    <!-- 子单弹窗 -->
    <!-- <child-dialog ref="ChildDialog" :open.sync="childdialog" :title="title" @refresh="getList" /> -->
    <!-- 运单详情 对话框 -->
    <!-- <detail-dialog ref="DetailDialog" :current-id="currentId" :title="title" :open.sync="open" :disable="formDisable" @refresh="getList" /> -->

  </div>
</template>

<script>
import { adjustList, adjustListApi } from '@/api/settlement/adjust';
// 驳回弹窗
// import RejectDialog from '../components/rejectDialog';
// 子单弹窗
// import ChildDialog from '../components/childDialog';
// 运单详情弹窗
// import DetailDialog from '@/views/waybill/components/detailDialog';


export default {
  'name': 'AdjustList',
  components: { },
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
        { 'dictLabel': '正常单', 'dictValue': '0' },
        { 'dictLabel': '子单', 'dictValue': '1' },
        { 'dictLabel': '超载的主单', 'dictValue': '2' }
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
      width: 180,
      fixed: 'right'
    });
    this.getList();
    this.listByDict(this.commodityCategory).then(response => {
      this.commodityCategoryCodeOptions = response.data;
    });
  },
  'methods': {
    datechoose(date) {
      this.queryParams.orderEndTime = this.parseTime(date[0], '{y}-{m}-{d}');
      this.queryParams.orderStartTime = this.parseTime(date[1], '{y}-{m}-{d}');
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
    // 导出
    handleExport() {
    },
    // 批量索票
    handleAskfor() {
    },
    handleTableBtn(row, index) {
      // console.log(row, index);

      this.visible = true;
      switch (index) {
        case 1:
          this.$refs.RejectDialog.reset();
          this.rejectdialog = true;
          this.title = '详情';
          this.$refs.RejectDialog.setForm(row);
          console.log(row);
          break;
        default:
          break;
      }
    }
  }
};
</script>
