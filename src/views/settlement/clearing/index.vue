
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
      <el-form-item
        label="司机电话"
        prop="driverPhone"
      >
        <el-input
          v-model="queryParams.driverPhone"
          placeholder="请输入司机电话"
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
        label="调度名称"
        prop="driverName"
      >
        <el-input
          v-model="queryParams.driverName"
          placeholder="请输入调度名称"
          clearable
          size="small"
          style="width: 225px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item
        label="调度电话"
        prop="driverPhone"
      >
        <el-input
          v-model="queryParams.driverPhone"
          placeholder="请输入调度电话"
          clearable
          size="small"
          style="width: 225px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item
        label="关联企业"
        prop="driverPhone"
      >
        <el-input
          v-model="queryParams.driverPhone"
          placeholder="请输入运单关联企业"
          clearable
          size="small"
          style="width: 225px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item
        label="货主电话"
        prop="loadInfo"
      >
        <el-input
          v-model="queryParams.loadInfo"
          placeholder="请输入货主电话"
          clearable
          size="small"
          style="width: 225px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item
        label="清分订单号"
        prop="orderClient"
      >
        <el-input
          v-model="queryParams.orderClient"
          placeholder="请输入清分订单号"
          clearable
          size="small"
          style="width: 225px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item
        label="清分批次号"
        prop="orderClient"
      >
        <el-input
          v-model="queryParams.orderClient"
          placeholder="请输入清分批次号"
          clearable
          size="small"
          style="width: 225px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="清分状态" prop="isReturn">
        <el-select
          v-model="queryParams.isReturn"
          placeholder="请选择清分状态"
          filterable
          clearable
          size="small"
          style="width: 225px"
        >
          <el-option
            v-for="dict in isReturnOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
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
          type="info"
          icon="el-icon-upload2"
          size="mini"
          @click="handleExport"
        >导出</el-button>
        <el-button
          type="primary"
          icon="el-icon-document-remove"
          size="mini"
          @click="handleClearing"
        >运单清分</el-button>
        <el-button
          type="success"
          icon="el-icon-refresh-right"
          size="mini"
          @click="handleUpdate"
        >更新清分状态</el-button>
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
      <template #isReturn="{row}">
        <span>{{ selectDictLabel(isReturnOptions, row.isReturn) }}</span>
      </template>
      <!-- <template #isChild="{row}">
        <span>{{ selectDictLabel(isChildOptions, row.isChild) }}</span>
      </template> -->

      <template #edit="{row}">
        <el-button
          size="mini"
          type="text"
          icon="el-icon-document-remove"
          @click="handleTableBtn(row, 1)"
        >运单清分</el-button>
        <el-button
          size="mini"
          type="text"
          icon="el-icon-refresh-right"
          @click="handleTableBtn(row, 2)"
        >更新清分状态</el-button>
        <el-button
          size="mini"
          type="text"
          icon="el-icon-document"
          @click="handleTableBtn(row, 3)"
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

    <!-- 运单详情 对话框 -->
    <detail-dialog ref="DetailDialog" :current-id="currentId" :title="title" :open.sync="open" :disable="formDisable" @refresh="getList" />

  </div>
</template>

<script>
import { adjustList, adjustListApi } from '@/api/settlement/adjust';
// 运单详情弹窗
import DetailDialog from '@/views/waybill/components/detailDialog';


export default {
  'name': 'AdjustList',
  components: { DetailDialog },
  data() {
    return {
      tableColumnsConfig: [],
      api: adjustListApi,
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
    // 导出
    handleExport() {
    },
    // 运单清分
    handleClearing() {
    },
    // 更新清分状态
    handleUpdate() {
    },

    handleTableBtn(row, index) {
      // console.log(row, index);

      this.visible = true;
      switch (index) {
        case 1:
          this.title = '运单清分';
          break;
        case 2:
          this.title = '更新清分状态';
          break;
        case 3:
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
