<template>
  <div>
    <el-row>
      <el-col v-if="false" :span="4">
        <el-card class="card-left">
          <div slot="header">
            <div class="left_v" />
            <span>地区列表</span>
          </div>
          <!-- 树形结构 -->
          <el-tree
            :data="data"
            show-checkbox
            node-key="id"
            :default-expanded-keys="[2, 3]"
            :default-checked-keys="[5]"
            :props="{children: 'children',label: 'label'}"
          />
        </el-card>
      </el-col>
      <el-col :span="24">
        <el-card class="card-rigth">
          <div v-if="false" slot="header">
            <div class="left_v" />
            <span>货源管理</span>
          </div>
          <!-- 右边 -->
          <div>
            <el-form v-show="showSearch" ref="queryForm" :model="queryParams" :inline="true" label-width="100px" class="clearfix">
              <el-form-item label="下单客户" prop="tin1">
                <el-input
                  v-model="queryParams.tin1"
                  placeholder="请输入公司名称/客户姓名/手机号"
                  clearable
                  size="small"
                  @keyup.enter.native="handleQuery"
                />
              </el-form-item>

              <el-form-item label="装货信息" prop="tin2">
                <el-input
                  v-model="queryParams.tin2"
                  placeholder="装货地/装货电话/装货人"
                  clearable
                  size="small"
                  @keyup.enter.native="handleQuery"
                />
              </el-form-item>

              <el-form-item label="收货信息" prop="tin3">
                <el-input
                  v-model="queryParams.tin3"
                  placeholder="目的地/收货电话/收货人"
                  clearable
                  size="small"
                  @keyup.enter.native="handleQuery"
                />
              </el-form-item>

              <el-form-item label="货物类型大类" prop="tin4">
                <el-select v-model="queryParams.tin4" placeholder="----请选择----" style="width: 215px">
                  <el-option label="区域一" value="shanghai" />
                  <el-option label="区域二" value="beijing" />
                </el-select>
              </el-form-item>

              <el-form-item label="货物描述" prop="tin5">
                <el-input
                  v-model="queryParams.tin5"
                  placeholder="目的地/收货电话/收货人"
                  clearable
                  size="small"
                  @keyup.enter.native="handleQuery"
                />
              </el-form-item>

              <el-form-item label="货主编码" prop="tin6">
                <el-input
                  v-model="queryParams.tin6"
                  placeholder="目的地/收货电话/收货人"
                  clearable
                  size="small"
                  @keyup.enter.native="handleQuery"
                />
              </el-form-item>

              <el-form-item label="货源单号" prop="tin7">
                <el-input
                  v-model="queryParams.tin7"
                  placeholder="目的地/收货电话/收货人"
                  clearable
                  size="small"
                  @keyup.enter.native="handleQuery"
                />
              </el-form-item>

              <!-- <el-form-item label="司机id" prop="driverId">
                <el-input
                  v-model="queryParams.driverId"
                  placeholder="(司机id)查询自己公司的货源"
                  clearable
                  size="small"
                  @keyup.enter.native="handleQuery"
                />
              </el-form-item> -->

              <el-form-item label="订单状态" prop="tin8">
                <el-select v-model="queryParams.tin8" placeholder="----请选择----" style="width: 215px">
                  <el-option label="区域一" :value="'1'" />
                  <el-option label="区域二" :value="'2'" />
                </el-select>
              </el-form-item>

              <el-form-item label="是否拼单" prop="tin9">
                <el-select v-model="queryParams.tin9" placeholder="----请选择----" style="width: 215px">
                  <el-option label="区域一" :value="'false'" />
                  <el-option label="区域二" :value="'true'" />
                </el-select>
              </el-form-item>

              <el-form-item label="创建时间" prop="tin10">
                <el-date-picker
                  v-model="queryParams.tin10"
                  size="small"
                  style="width: 215px"
                  value-format="yyyy-MM-dd"
                  type="daterange"
                  range-separator="-"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                />
              </el-form-item>


              <el-form-item class="fr">
                <el-button type="cyan" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
              </el-form-item>
            </el-form>

            <el-row :gutter="10" class="mb8">
              <!-- <el-col :span="1.5">
                <el-button
                  v-hasPermi="['system:test:remove']"
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  :disabled="multiple"
                  @click="handleDelete"
                >删除</el-button>
              </el-col> -->
              <el-col :span="1.5">
                <el-button
                  v-hasPermi="['system:test:export']"
                  type="warning"
                  icon="el-icon-download"
                  size="mini"
                  @click="handleExport"
                >导出</el-button>
              </el-col>

              <el-col :span="1.5" style="marginTop:-5px">
                <tablec-cascader v-model="tableColumnsConfig" />
              </el-col>
              <right-toolbar :show-search.sync="showSearch" @queryTable="getList" />
            </el-row>

            <RefactorTable :loading="loading" :data="list" :table-columns-config="tableColumnsConfig"><!-- @selection-change="handleSelectionChange" -->
              <!-- billingType	发运方式 0->汽运一票制，1->对付，2->代收代付 -->
              <template #billingType="{row}">
                <span>{{ selectDictLabel([
                  { dictLabel: '汽运一票制', dictValue: '0' },
                  { dictLabel: '对付', dictValue: '1' },
                  { dictLabel: '代收代付', dictValue: '1' }
                ], row.billingType)
                }}</span>
              </template>
              <!-- status	状态 0.启用 1.禁用 -->
              <template #status="{row}">
                <span>{{ selectDictLabel([
                  { dictLabel: '启用', dictValue: '0' },
                  { dictLabel: '禁用', dictValue: '1' },
                ], row.status)
                }}</span>
              </template>
              <template #accessTime="{row}">
                <span>{{ row.accessTime }}</span>
              </template>
              <template #edit="{row}">
                <el-button
                  v-hasPermi="['system:menu:edit']"
                  size="mini"
                  type="text"
                  icon="el-icon-edit"
                  @click="handleInfo(row)"
                >详情</el-button>
                <!-- <el-button
                  v-hasPermi="['system:menu:add']"
                  size="mini"
                  type="text"
                  icon="el-icon-plus"
                  @click="handleAdd(row)"
                >复制</el-button> -->
                <el-button
                  v-hasPermi="['system:menu:remove']"
                  size="mini"
                  type="text"
                  icon="el-icon-delete"
                  @click="handleDispatch(row)"
                >派单</el-button>

                <el-button
                  v-hasPermi="['system:menu:edit']"
                  size="mini"
                  type="text"
                  icon="el-icon-edit"
                  @click="handleUpdate(row)"
                >编辑</el-button>
                <el-button
                  v-hasPermi="['system:menu:remove']"
                  size="mini"
                  type="text"
                  icon="el-icon-delete"
                  @click="handleDelete(row)"
                >删除</el-button>
                <!-- <el-button
                  v-hasPermi="['system:menu:remove']"
                  size="mini"
                  type="text"
                  icon="el-icon-delete"
                  @click="handleDelete(row)"
                >暂停</el-button> -->
                <!-- <el-button
                  v-hasPermi="['system:menu:remove']"
                  size="mini"
                  type="text"
                  icon="el-icon-delete"
                  @click="handleDelete(row)"
                >调价</el-button> -->
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
        </el-card>
      </el-col>
    </el-row>



    <!-- 派送订单 -->
    <el-dialog :title="title" :visible.sync="openDispatch" width="80%" append-to-body>
      <open-dialog :dispatch="dispatch" @_ok="(bool)=>{openDispatch = bool; getList()}" />
    </el-dialog>
  </div>
</template>

<script>
import { getOrderInfoList, delOrder } from '@/api/order/manage';
import OpenDialog from './component/OpenDialog';

const tableColumnsConfig = [
  {
    prop: 'addressAlias',
    isShow: false,
    label: '地址'
  },
  {
    prop: 'addressAlias1',
    isShow: false,
    label: '地址'
  },
  {
    prop: 'billingType',
    isShow: false,
    label: '发运方式'
  },
  {
    prop: 'branchCode',
    isShow: false,
    label: '机构编码'
  },
  {
    prop: 'cashDeposit',
    isShow: false,
    label: '货主保证金'
  },
  {
    prop: 'classCode',
    isShow: false,
    label: '指定货源（分类）码编号'
  },
  {
    prop: 'code',
    isShow: false,
    label: 'code'
  },
  {
    prop: 'companyName',
    isShow: false,
    label: '公司名称'
  },
  {
    prop: 'createCode',
    isShow: false,
    label: '创建人'
  },
  {
    prop: 'createTime',
    isShow: false,
    label: '创建时间'
  },
  {
    prop: 'effectiveHour',
    isShow: false,
    label: '货源有效时间(小时)'
  },
  {
    prop: 'id',
    isShow: false,
    label: '主键ID'
  },
  {
    prop: 'importType',
    isShow: false,
    label: '是否导入货源'
  },
  {
    prop: 'isClass',
    isShow: false,
    label: '是否加入货源码'
  },
  {
    prop: 'isDel',
    isShow: false,
    label: '是否删除'
  },
  {
    prop: 'isDispatch',
    isShow: false,
    label: '是否已受理'
  },
  {
    prop: 'isInsure',
    isShow: false,
    label: '投保类别'
  },
  {
    prop: 'isMonthlyOrder',
    isShow: false,
    label: '是否月结订单'
  },
  {
    prop: 'isPay',
    isShow: false,
    label: '是否已经支付'
  },
  {
    prop: 'isPublic',
    isShow: false,
    label: '是否公开货源'
  },
  {
    prop: 'isQuote',
    isShow: false,
    label: '是否允许报价'
  },
  {
    prop: 'isReturn',
    isShow: false,
    label: '是否回单确认'
  },
  {
    prop: 'isReturnMoney',
    isShow: false,
    label: '标记货主是否结算'
  },
  {
    prop: 'isShare',
    isShow: false,
    label: '是否拼单'
  },
  {
    prop: 'isShipperConfirm',
    isShow: false,
    label: '是否货主确认装货'
  },
  {
    prop: 'isSpecified',
    isShow: false,
    label: '是否指定接单人'
  },
  {
    prop: 'isSplit',
    isShow: false,
    label: '是否允许拆单'
  },
  {
    prop: 'isTop',
    isShow: false,
    label: '是否置顶'
  },
  {
    prop: 'isTrunk',
    isShow: false,
    label: '订单类型'
  },
  {
    prop: 'loadType',
    isShow: false,
    label: '装卸类型'
  },
  {
    prop: 'loadingTime',
    isShow: false,
    label: '计划装货时间'
  },
  {
    prop: 'mainOrderNumber',
    isShow: true,
    label: '货源单号'
  },
  {
    prop: 'nickName',
    isShow: false,
    label: '昵称'
  },
  {
    prop: 'orderType',
    isShow: false,
    label: '运输类型'
  },
  {
    prop: 'paymentCode',
    isShow: false,
    label: '支付方式'
  },
  {
    prop: 'phonenumber',
    isShow: false,
    label: '手机号码'
  },
  {
    prop: 'projectCode',
    isShow: false,
    label: '项目编码'
  },
  {
    prop: 'pubilshCode',
    isShow: true,
    label: '发布人CODE'
  },
  {
    prop: 'remark',
    isShow: false,
    label: '备注'
  },
  {
    prop: 'shipperFactoryCode',
    isShow: false,
    label: '发货厂家编码'
  },
  {
    prop: 'status',
    isShow: false,
    label: '状态'
  },
  {
    prop: 'updateCode',
    isShow: false,
    label: '修改人'
  },
  {
    prop: 'updateTime',
    isShow: true,
    label: '修改时间'
  },
  {
    prop: 'userName',
    isShow: false,
    label: '账号名称'
  },
  {
    prop: 'edit',
    isShow: true,
    label: '操作',
    width: 180,
    fixed: 'right'
  }
];


export default {
  name: 'Testlog',
  components: { OpenDialog },
  data() {
    return {
      // 树形数据
      data: [],

      // 遮罩层
      loading: false,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 表格数据
      list: [],
      // 是否显示弹出层-派送
      openDispatch: false,
      dispatch: null,
      // 类型数据字典
      typeOptions: [],
      // 类型数据字典
      statusOptions: [],
      // 日期范围
      dateRange: [],
      // 表单参数
      form: {},
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        tin1: '',
        tin2: '',
        tin3: '',
        tin4: '',
        tin5: '',
        tin6: '',
        tin7: '',
        tin8: '',
        tin9: '',
        tin10: []
      },
      // 弹框title
      title: '',
      // 表头动态值
      tableColumnsConfig

    };
  },

  computed: {
    newQueryParams() {
      return {
        addressAndPhoneAndMember: this.queryParams.tin2, //	装货信息	query	false
        beginTime: this.queryParams.tin10[0], //	开始时间	query	false
        companyAndCustomerAndPhone: this.queryParams.tin1, //	下单客户	query	false
        destinationAndPhoneAndMember: this.queryParams.tin3, //	收货信息	query	false
        driverId: undefined, //	(司机id)查询自己公司的货源	query	false
        endTime: this.queryParams.tin10[1], //	结束时间	query	false
        goodsBigType: this.queryParams.tin4, //	货物类型大类	query	false
        goodsName: this.queryParams.tin5, //	货物描述(名称)	query	false
        isShare: this.queryParams.tin9, //	是否拼单	query	false
        mainOrderNumber: this.queryParams.tin7, //	货源单号	query	false
        pubilshCode: this.queryParams.tin6, //	货主编码	query	false
        status: this.queryParams.tin8, //	订单状态（字典表）	query	false
        pageNum: this.queryParams.pageNum, //	pageNum,示例值(1)	query	false
        pageSize: this.queryParams.pageSize //	pageSize,示例值(10)	query	false
      };
    }
  },

  created() {
    this.tableColumnsConfig = this.getLocalStorage(this.$route.name) || this.tableColumnsConfig;
    this.getList();
  },
  methods: {
    /** 查询货源列表 */
    getList() {
      this.loading = true;
      getOrderInfoList(this.newQueryParams).then(response => {
        this.list = response.data.list;
        this.total = response.data.total - 0;
        this.loading = false;
      }).catch(() => {
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
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
    // 多选框选中数据
    // handleSelectionChange(selection) {
    //   this.ids = selection.map(item => item.id);
    //   // console.log(this.ids, '选择了那些东西');
    //   this.single = selection.length !== 1;
    //   this.multiple = !selection.length;
    // },
    /** 新增按钮操作 */
    // handleAdd() {
    //   this.reset();
    //   this.open = true;
    //   this.title = '添加货源';
    // },
    /** 修改按钮操作 */
    handleUpdate(row) {
      // this.reset();
      // const testId = row.testId || this.ids;
      // getTest(testId).then(response => {
      //   this.form = response.data;
      //   this.open = true;
      //   this.title = '修改货源';
      // });
    },
    /** 查看详情操作 */
    handleInfo(row) {
      // this.reset();
      // const testId = row.testId || this.ids;
      // getTest(testId).then(response => {
      //   this.form = response.data;
      //   this.open = true;
      //   this.title = '修改货源';
      // });
    },

    /** 删除按钮操作 */
    handleDelete(row) {
      const testIds = row.code;
      this.$confirm('是否确认删除货源编号为"' + testIds + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return delOrder(testIds);
      }).then(() => {
        this.getList();
        this.msgSuccess('删除成功');
      });
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('system/test/export', {
        ...this.newQueryParams
      }, `system_test.xlsx`);
    },
    /** 派单对话 */
    handleDispatch(row) {
      this.openDispatch = true;
      this.dispatch = row;
    }

  }
};
</script>

<style scoped lang='scss'>
.card-rigth{
  position: relative;
  margin: 0 15px 15px;
  overflow-y: auto;
  height: calc(100vh - 145px);
}
.card-left{
  position: relative;
  margin-left: 15px;
  margin-bottom: 15px;
  height: calc(100vh - 145px);
}
.left_v{
  position: absolute;
  width: 3px;
  height: 20px;
  left: 0;
  top: 14px;
  background-color: #1890ff;
}

.flex_b{
    display: flex;
    justify-content: space-between;
}

</style>
