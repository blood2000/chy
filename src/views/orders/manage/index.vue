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
                  <el-option
                    v-for="dict in statusOptions"
                    :key="dict.dictValue"
                    :label="dict.dictLabel"
                    :value="dict.dictValue"
                  />
                </el-select>
              </el-form-item>


              <el-form-item label="是否拼单" prop="tin9">
                <el-select v-model="queryParams.tin9" placeholder="----请选择----" style="width: 215px">
                  <el-option
                    v-for="dict in isShareTypeOptions"
                    :key="dict.dictValue"
                    :label="dict.dictLabel"
                    :value="dict.dictValue"
                  />
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
                <span>{{ selectDictLabel(billingTypeOptions, row.billingType) }}</span>
              </template>
              <!-- status	状态 0.启用 1.禁用 -->
              <template #status="{row}">
                <span>{{ selectDictLabel(statusOptions, row.status) }}</span>
              </template>
              <!-- importType	是否导入货源 0-正常发布货源，1-货源单导入，2-运输单导入 -->
              <template #importType="{row}">
                <span>{{ selectDictLabel(importTypeOptions, row.importType) }}</span>
              </template>

              <template #isClass="{row}">
                <span>{{ selectDictLabel(isClassOptions, row.isClass) }}</span>
              </template>

              <template #isDel="{row}">
                <span>{{ selectDictLabel(isDelTypeOptions, row.isDel) }}</span>
              </template>

              <template #isDispatch="{row}">
                <span>{{ selectDictLabel(isDispatchTypeOptions, row.isDispatch) }}</span>
              </template>

              <template #isInsure="{row}">
                <span>{{ selectDictLabel(isInsureTypeOptions, row.isInsure) }}</span>
              </template>

              <template #isMonthlyOrder="{row}">
                <span>{{ selectDictLabel(isMonthlyOrderTypeOptions, row.isMonthlyOrder) }}</span>
              </template>

              <template #isPay="{row}">
                <span>{{ selectDictLabel(isPayTypeOptions, row.isPay) }}</span>
              </template>

              <template #isPublic="{row}">
                <span>{{ selectDictLabel(isPublicTypeOptions, row.isPublic) }}</span>
              </template>

              <template #isReturnMoney="{row}">
                <span>{{ selectDictLabel(isReturnMoneyTypeOptions, row.isReturnMoney) }}</span>
              </template>

              <template #isShare="{row}">
                <span>{{ selectDictLabel(isShareTypeOptions, row.isShare) }}</span>
              </template>

              <template #isShipperConfirm="{row}">
                <span>{{ selectDictLabel(isShipperConfirmTypeOptions, row.isShipperConfirm) }}</span>
              </template>

              <template #isSpecified="{row}">
                <span>{{ selectDictLabel(isSpecifiedTypeOptions, row.isSpecified) }}</span>
              </template>

              <template #isSplit="{row}">
                <span>{{ selectDictLabel(isSplitTypeOptions, row.isSplit) }}</span>
              </template>

              <template #isTop="{row}">
                <span>{{ selectDictLabel(isTopTypeOptions, row.isTop) }}</span>
              </template>

              <template #isTrunk="{row}">
                <span>{{ selectDictLabel(isTrunkTypeOptions, row.isTrunk) }}</span>
              </template>

              <template #loadTypeType="{row}">
                <span>{{ selectDictLabel(loadTypeTypeOptions, row.loadTypeType) }}</span>
              </template>

              <template #orderTypeType="{row}">
                <span>{{ selectDictLabel(orderTypeTypeOptions, row.orderTypeType) }}</span>
              </template>

              <template #paymentCodeType="{row}">
                <span>{{ selectDictLabel(paymentCodeTypeOptions, row.paymentCodeType) }}</span>
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
                <el-button
                  v-hasPermi="['system:menu:add']"
                  size="mini"
                  type="text"
                  icon="el-icon-edit-outline"
                  @click="loadAndUnloading(row)"
                >{{ row.status==='0'?'禁用':'启用' }}</el-button>
                <el-button
                  v-hasPermi="['system:menu:remove']"
                  size="mini"
                  type="text"
                  icon="el-icon-s-promotion"
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
      <open-dialog v-if="openDispatch" :dispatch="dispatch" @_ok="(bool)=>{openDispatch = bool; getList()}" />
    </el-dialog>
  </div>
</template>

<script>
import { getOrderInfoList, delOrder, loadAndUnloadingGoods, exportOrder } from '@/api/order/manage';
import OpenDialog from './component/OpenDialog';
import tableColumnsConfig from './data/config-index';


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
      list: [{ id: 1 }],
      // 是否显示弹出层-派送
      openDispatch: false,
      dispatch: null,
      // 类型数据字典
      typeOptions: [],

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
      tableColumnsConfig,
      // 订单状态字典
      statusOptions: [
        { dictLabel: '启用', dictValue: '0' },
        { dictLabel: '禁用', dictValue: '1' }
      ],
      // 发运方式字典
      billingTypeOptions: [
        { dictLabel: '汽运一票制', dictValue: '0' },
        { dictLabel: '对付', dictValue: '1' },
        { dictLabel: '代收代付', dictValue: '2' }
      ],
      // 是否导入货源字典
      importTypeOptions: [
        { dictLabel: '正常发布货源', dictValue: '0' },
        { dictLabel: '货源单导入', dictValue: '1' },
        { dictLabel: '运输单导入', dictValue: '2' }
      ],
      // isClass	是否加入货源码 0否 1是
      isClassOptions: [
        { dictLabel: '否', dictValue: false },
        { dictLabel: '是', dictValue: true }
      ],
      // isDel	是否删除 0.正常 1.删除	boolean
      isDelTypeOptions: [
        { dictLabel: '正常', dictValue: false },
        { dictLabel: '删除', dictValue: true }
      ],
      // isDispatch	是否已受理 0未受理，1已受理	boolean
      isDispatchTypeOptions: [
        { dictLabel: '未受理', dictValue: false },
        { dictLabel: '已受理', dictValue: true }
      ],
      // isInsure	投保类别 0否 1是	boolean
      isInsureTypeOptions: [
        { dictLabel: '否', dictValue: false },
        { dictLabel: '是', dictValue: true }
      ],
      // isMonthlyOrder	是否月结订单 0否 1 是	boolean
      isMonthlyOrderTypeOptions: [
        { dictLabel: '否', dictValue: false },
        { dictLabel: '是', dictValue: true }
      ],
      // isPay	是否已经支付 0 未支付 1 已经支付	boolean
      isPayTypeOptions: [
        { dictLabel: '未支付', dictValue: false },
        { dictLabel: '已经支付', dictValue: true }
      ],
      // isPublic	是否公开货源 0.非公开 1.公开
      isPublicTypeOptions: [
        { dictLabel: '非公开', dictValue: false },
        { dictLabel: '公开', dictValue: true }
      ],
      // isReturnMoney	标记货主是否结算 0 否 1-是	boolean
      isReturnMoneyTypeOptions: [
        { dictLabel: '否', dictValue: false },
        { dictLabel: '是', dictValue: true }
      ],
      // isShare	是否拼单 0-否，1-是	boolean
      isShareTypeOptions: [
        { dictLabel: '否', dictValue: false },
        { dictLabel: '是', dictValue: true }
      ],
      // isShipperConfirm	是否货主确认装货 0否，1是	boolean
      isShipperConfirmTypeOptions: [
        { dictLabel: '否', dictValue: false },
        { dictLabel: '是', dictValue: true }
      ],
      // isSpecified	是否指定接单人 0否 1是	boolean
      isSpecifiedTypeOptions: [
        { dictLabel: '否', dictValue: false },
        { dictLabel: '是', dictValue: true }
      ],
      // isSplit	是否允许拆单 0-不允许，1-允许	boolean
      isSplitTypeOptions: [
        { dictLabel: '不允许', dictValue: false },
        { dictLabel: '允许', dictValue: true }
      ],
      // isTop	是否置顶 0否 1是	boolean
      isTopTypeOptions: [
        { dictLabel: '否', dictValue: false },
        { dictLabel: '是', dictValue: true }
      ],
      // isTrunk	订单类型 0-整车大宗，1-零散多货	boolean
      isTrunkTypeOptions: [
        { dictLabel: '整车大宗', dictValue: '0' },
        { dictLabel: '零散多货', dictValue: '1' }
      ],
      // loadType	装卸类型 1.一装一卸 2.多装一卸 3.一装多卸 4.多装多卸
      loadTypeTypeOptions: [
        { dictLabel: '', dictValue: '0' },
        { dictLabel: '一装一卸', dictValue: '1' },
        { dictLabel: '多装一卸', dictValue: '2' },
        { dictLabel: '一装多卸', dictValue: '3' },
        { dictLabel: '多装多卸', dictValue: '4' }
      ],
      // orderType	运输类型 0-汽运，1-船运	string
      orderTypeTypeOptions: [
        { dictLabel: '汽运', dictValue: '0' },
        { dictLabel: '船运', dictValue: '1' }
      ],
      // paymentCode	支付方式 0-现金，1-打卡，2现金+油卡 (字典表CODE)
      paymentCodeTypeOptions: [
        { dictLabel: '现金', dictValue: '0' },
        { dictLabel: '打卡', dictValue: '1' },
        { dictLabel: '现金+油卡', dictValue: '2' }
      ]

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
    /** 上下架货源 */
    loadAndUnloading(row) {
      const msg = row.status === '1' ? '启用' : '禁用';
      const data = {
        'orderCode': row.code,
        'status': row.status === '0' ? 1 : 0
      };
      this.$confirm('是否确认操作货源编号为"' + row.code + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return loadAndUnloadingGoods(data);
      }).then(() => {
        this.getList();
        this.msgSuccess(msg + '成功');
      });
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
      this.download('/transportation/order/export', {
        ...this.newQueryParams
      }, `order_export.xlsx`);
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
