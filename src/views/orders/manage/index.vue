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
              <el-form-item v-show="!isShipment" label="下单客户" prop="tin1">
                <el-input
                  v-model="queryParams.tin1"
                  placeholder="请输入下单客户"
                  clearable
                  size="small"
                  @keyup.enter.native="handleQuery"
                />
              </el-form-item>

              <el-form-item label="装货信息" prop="tin2">
                <el-input
                  v-model="queryParams.tin2"
                  placeholder="请输入装货信息"
                  clearable
                  size="small"
                  @keyup.enter.native="handleQuery"
                />
              </el-form-item>

              <el-form-item label="收货信息" prop="tin3">
                <el-input
                  v-model="queryParams.tin3"
                  placeholder="请输入收货信息"
                  clearable
                  size="small"
                  @keyup.enter.native="handleQuery"
                />
              </el-form-item>

              <el-form-item label="货物类型大类" prop="tin4">
                <el-select v-model="queryParams.tin4" placeholder="----请选择----" style="width: 215px" clearable filterable>
                  <!-- goodsTypeOption -->
                  <el-option
                    v-for="dict in goodsTypeOption"
                    :key="dict.dictValue"
                    :label="dict.dictLabel"
                    :value="dict.dictValue"
                  />
                </el-select>
              </el-form-item>

              <el-form-item label="货物描述" prop="tin5">
                <el-input
                  v-model="queryParams.tin5"
                  placeholder="请输入货物描述"
                  clearable
                  size="small"
                  @keyup.enter.native="handleQuery"
                />
              </el-form-item>

              <el-form-item v-show="!isShipment" label="货主" prop="tin6">
                <el-select v-model="queryParams.tin6" filterable clearable placeholder="请选择货主">
                  <el-option
                    v-for="item in shipmentList"
                    :key="item.code"
                    :label="item.adminName + ' ' +(item.companyName || '')"
                    :value="item.code"
                  />
                </el-select>
              <!--  <el-input
                  v-model="queryParams.tin6"
                  placeholder="请输入货主编码"
                  clearable
                  size="small"
                  @keyup.enter.native="handleQuery"
                />-->
              </el-form-item>

              <el-form-item label="货源单号" prop="tin7">
                <el-input
                  v-model="queryParams.tin7"
                  placeholder="请输入货源单号"
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

              <el-form-item label="货源状态" prop="tin8">
                <el-select v-model="queryParams.tin8" placeholder="----请选择----" style="width: 215px" clearable filterable>
                  <el-option
                    v-for="dict in statusOptions"
                    :key="dict.dictValue"
                    :label="dict.dictLabel"
                    :value="dict.dictValue"
                  />
                </el-select>
              </el-form-item>


              <!-- <el-form-item label="是否拼单" prop="tin9">
                <el-select v-model="queryParams.tin9" placeholder="----请选择----" style="width: 215px">
                  <el-option
                    v-for="dict in isShareTypeOptions"
                    :key="dict.dictValue"
                    :label="dict.dictLabel"
                    :value="dict.dictValue"
                  />
                </el-select>
              </el-form-item> -->

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

              <el-col :span="1.5" class="fr">
                <tablec-cascader v-model="tableColumnsConfig" :lcokey="listManagesApi" />
              </el-col>
              <right-toolbar :show-search.sync="showSearch" @queryTable="getList" />
            </el-row>

            <!-- default-expand-all -->
            <RefactorTable
              is-show-index
              :loading="loading"
              :data="list"
              row-key="id"
              stripe
              :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
              :table-columns-config="tableColumnsConfig"
            ><!-- @selection-change="handleSelectionChange" -->
              <template #landAddress="{row}">
                <span>{{ row.landAddress }}</span>
              </template>
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
                <template v-if="row.isShowEdit">
                  <el-button
                    v-hasPermi="['system:menu:edit']"
                    size="mini"
                    type="text"
                    icon="el-icon-document"
                    @click="handleInfo(row)"
                  >详情</el-button>

                  <el-button
                    v-if="row.status+''==='0'"
                    v-hasPermi="['system:menu:remove']"
                    size="mini"
                    type="text"
                    icon="el-icon-s-promotion"
                    @click="handleDispatch(row)"
                  >指派</el-button>

                  <el-button
                    v-if="row.status+''==='0'"
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
                  <el-button
                    v-hasPermi="['system:menu:remove']"
                    size="mini"
                    type="text"
                    icon="el-icon-close"
                    :style="{color: row.status+''==='0'?'red': ''}"
                    @click="handleClose(row)"
                  >{{ row.status+''==='0'?'禁用':'启用' }}</el-button>
                  <el-button
                    v-if="row.status+''==='0'"
                    v-hasPermi="['system:menu:remove']"
                    size="mini"
                    type="text"
                    icon="el-icon-bank-card"
                    @click="handleReadjustPrices(row)"
                  >调价</el-button>
                  <el-button
                    v-if="false"
                    v-hasPermi="['system:menu:remove']"
                    size="mini"
                    type="text"
                    icon="el-icon-document"
                    @click="handleShenhe(row)"
                  >审核</el-button>
                  <el-button
                    v-if="false && row.status+''==='0'"
                    v-hasPermi="['system:menu:remove']"
                    size="mini"
                    type="text"
                    icon="el-icon-document"
                    @click="handleclone(row)"
                  >复制</el-button>
                </template>
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
      <open-dialog v-if="openDispatch" :dispatch="dispatch" @_ok="(bool)=>{openDispatch = false;bool ==='success' && getList()}" />
    </el-dialog>

    <!-- 价格调整 -->
    <el-dialog :title="'费用调价'" :visible.sync="openPriceAdjustment" width="900px" append-to-body>
      <price-adjustment v-if="openPriceAdjustment" :mytabs="tabs" :order-code="orderCode" :pubilsh-code="pubilshCode" @submitRes="submitRes" />
    </el-dialog>
  </div>
</template>

<script>
import { listManagesApi, getOrderInfoList, delOrder, loadAndUnloadingGoods, exportOrder } from '@/api/order/manage';
import { getOrderByCode } from '@/api/order/release';
import { listShipment } from '@/api/assets/shipment';
import { getUserInfo } from '@/utils/auth';
import OpenDialog from './component/OpenDialog';
import tableColumnsConfig from './data/config-index';


import PriceAdjustment from './component/PriceAdjustment';

export default {
  name: 'Testlog',
  components: { OpenDialog, PriceAdjustment },
  data() {
    return {
      listManagesApi, // 表头存的key
      pubilshCode: '', // 当前货主code
      // 测试数据上

      openPriceAdjustment: false,
      tabs: [],
      orderCode: '',
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
      tableColumnsConfig: [],
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
      ],

      goodsTypeOption: [],
      isShipment: false,
      shipmentList: [] // 货主列表
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
        goodsType: this.queryParams.tin4, //	货物类型大类	query	false
        goodsName: this.queryParams.tin5, //	货物描述(名称)	query	false
        isShare: this.queryParams.tin9, //	是否拼单	query	false
        mainOrderNumber: this.queryParams.tin7, //	货源单号	query	false
        pubilshCode: this.queryParams.tin6, //	货主编码	query	false
        status: this.queryParams.tin8, //	订单状态（字典表）	query	false
        pageNum: this.queryParams.pageNum, //	pageNum,示例值(1)	query	false
        pageSize: this.queryParams.pageSize //	pageSize,示例值(10)	query	false
      };
    }

    // loading	装货信息电话联系人等	query	false

    // projectCode	项目code	query	false

    // receiving	收货信息电话联系人等	query	false

    // remark	备注	query	false

  },

  created() {
    const { isShipment = false, user = {}, shipment = {}} = getUserInfo() || {};
    this.isShipment = isShipment;
    // 要配置好才能用
    this.tableHeaderConfig(this.tableColumnsConfig, listManagesApi, {
      prop: 'edit',
      isShow: true,
      label: '操作',
      width: 180,
      fixed: 'right'
    }, tableColumnsConfig);
    this.getDict();
    this.getList();
    this.listShipment();
  },
  methods: {
    listShipment() {
      listShipment().then(response => {
        this.shipmentList = response.rows;
      });
    },
    /** 获取首页字典值 */
    getDict() {
      this.listByDict({
        dictPid: '0',
        dictType: 'goodsType'
      }).then(res => {
        this.goodsTypeOption = res.data;
      });
    },
    /** 查询货源列表 */
    getList() {
      this.loading = true;
      getOrderInfoList(this.newQueryParams).then(response => {
        this.list = this.handlerList(response.data.list);
        this.total = response.data.total - 0;
        this.loading = false;
      }).catch(() => {
        this.loading = false;
      });
    },

    // 基本格式(即表头定义)
    baseData(e) {
      return {
        ...e,
        'id': this.genID(5),
        'remark': e.remark,
        'code': e.code, // 编号
        'companyName': e.companyName, // 企业名称
        'goodsTypeName': e.goodsTypeName, // 货物类型名称
        'addressName1': e.addressName1, // 装货地
        'addressName2': e.addressName2, // 卸货地
        'goodsPrice': e.goodsPrice, // 货源价格
        'shipmentPrice': e.shipmentPrice, // 运输单价
        'transactionPrice': e.transactionPrice, // 成交单价
        'unitPrice': e.unitPrice, // 承运单价
        'mainOrderNumber': e.mainOrderNumber, // 货源单号
        'source': e
        // 'branchCode': e.branchCode,
        // 'mainOrderNumber': e.mainOrderNumber,
        // 'shipperFactoryCode': e.shipperFactoryCode,
        // 'projectCode': e.projectCode,
        // 'status': e.status,
        // 'createCode': e.createCode,
        // 'createTime': e.createTime,
        // 'updateCode': e.updateCode,
        // 'updateTime': e.updateTime,
        // 'isSpecified': e.isSpecified,
        // 'pubilshCode': e.pubilshCode,
        // 'classCode': e.classCode,
        // 'isPublic': e.isPublic,
        // 'loadType': e.loadType,
        // 'businessType': e.businessType,
        // 'isDel': e.isDel
      };
    },

    // 处理返回的列表
    handlerList(lists) {
      return lists.map(e => {
        // 先判断几个商品

        e = e.redisOrderInfoListVoList[0];
        const mgoods = [];
        e.redisOrderFreightInfoVoList.forEach((redis, index) => {
          // 获取商品信息到这里获取

          e.redisOrderGoodsVoList.forEach(goods => {
            if (goods.code === redis.goodsCode) {
              e.goodsPrice = goods.goodsPrice;
              e.goodsTypeName = goods.goodsTypeName;
            }
          });

          // 对应的
          redis.redisOrderAddressInfoVoList.forEach(address => {
            const addresCodes = address.addressCode.split(':');
            // 地址信息的到这里获取
            e.redisAddressList.forEach(addr => {
              // 装货地
              if (addr.code === addresCodes[0]) {
                e.addressName1 = addr.addressName;
              // 卸货地
              } else if (addr.code === addresCodes[1]) {
                e.addressName2 = addr.addressName;
              }
            });

            // 具体规则到这里获取
            address.redisOrderFreightVoList.forEach(freight => {
              // 运输单价
              if (freight.ruleItemCode === '17') {
                e.shipmentPrice = freight.ruleValue;
              }
              // 成交单价
              if (freight.ruleItemCode === '20') {
                e.transactionPrice = freight.ruleValue;
                e.unitPrice = freight.ruleValue;
              }
            });

            mgoods.push({
              ...this.baseData(e)
            });
          });
        });
        mgoods[0].isShowEdit = true; // 用来控制显示编辑内容(子就不用了)


        return {
          ...mgoods.shift(),
          children: mgoods.length ? mgoods : null
        };
      });
    },

    // 生成随机id
    genID(length) {
      return Number(Math.random().toString().substr(3, length) + Date.now()).toString(36);
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
      // console.log(row);

      this.$router.push({ name: 'Release', query: { id: row.code, t: '1' }});
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
      this.$router.push({ name: 'Release', query: { id: row.code, t: '0' }});
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
      const msg = row.status === '1' ? '上架' : '下架';
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
      // 操作删除按钮，判断货单是否产生运单。
      const waybill = true;

      let msg = '';
      if (waybill) {
        msg = '该货源单下，暂无产生运单，确认是否删除';
      } else {
        msg = `该货源单下，已产生??条运单，确认是否删除`;
      }

      // 1、无，选择提示“该货源单下，暂无产生运单，确认是否删除”；
      // 2、有，选择提示“该货源单下，已产生10条运单，确认是否删除”；

      this.$confirm(msg, '警告', {
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
    /** 关闭按钮操作 */
    handleClose(row) {
      // const testIds = row.code;
      // 操作关闭按钮，规则：货单状态改为【下架】并且无法新建运单，且原运单状态不变。

      // 选择提示“是否确认关闭该货源单，关闭后无法司机无法再继续接单。但运输中的运单则继续进行”；

      const msg = '是否确认关闭该货源单，关闭后无法司机无法再继续接单。但运输中的运单则继续进行';

      // const msg = row.status === '1' ? '上架' : '下架';
      const data = {
        'orderCode': row.code,
        'status': row.status + '' === '1' ? '0' : '1'
      };
      this.$confirm(msg, '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        // 关闭接口
        // console.log('关闭');
        return loadAndUnloadingGoods(data);
      }).then(() => {
        this.getList();
        this.msgSuccess(row.status + '' === '0' ? '禁用成功' : '启用成功');
      });
    },
    /** 调价操作 */
    async handleReadjustPrices(row) {
      console.log(row);

      const data = {
        'redisOrderInfoVo': {
          'code': '077acc62236f438eab5e93f88a6c1e88',
          'branchCode': null,
          'mainOrderNumber': '2104061658561871',
          'shipperFactoryCode': null,
          'projectCode': '',
          'isReturn': null,
          'isReturnMoney': 0,
          'loadingTime': null,
          'isPay': 0,
          'paymentCode': null,
          'isTop': 0,
          'isTrunk': 0,
          'isShare': 0,
          'isShipperConfirm': 0,
          'isInsure': null,
          'effectiveHour': null,
          'cashDeposit': null,
          'goodsPrice': null,
          'billingType': null,
          'importType': '0',
          'orderType': null,
          'isDel': 0,
          'status': 0,
          'createCode': 'ca8b3f3528a34365b41ad4cdb2074f67',
          'createTime': '2021-04-06 16:58:56.567',
          'updateCode': null,
          'updateTime': null,
          'isSpecified': 0,
          'remark': '13123',
          'pubilshCode': '80ceee84f9d34ed69a8467b2970f1c2b',
          'classCode': null,
          'isPublic': 1,
          'loadType': '1',
          'businessType': null
        },
        'redisOrderClassGoodsVoList': [
          {
            'code': 'f4107022c7c543919684d026a59d5321',
            'classCode': '',
            'orderCode': '077acc62236f438eab5e93f88a6c1e88',
            'createCode': '80ceee84f9d34ed69a8467b2970f1c2b',
            'createTime': '2021-04-06 16:58:56.58',
            'updateCode': null,
            'updateTime': null,
            'isDel': 0
          }
        ],
        'redisOrderGoodsVoList': [
          {
            'code': '9e29282dac9f4e67b29ed4ca80a0533c',
            'orderCode': '077acc62236f438eab5e93f88a6c1e88',
            'goodsBigType': '0100',
            'totalType': null,
            'goodsType': '010001',
            'goodsName': '煤炭',
            'goodsUnit': null,
            'weight': null,
            'perWeight': null,
            'shipmentPrice': null,
            'goodsPrice': 1000,
            'vehicleType': '',
            'vehicleLength': '',
            'priceWastage': null,
            'isOneselfLoad': null,
            'isModifyFinish': null,
            'isOneselfUnload': null,
            'balanceRuleCode': null,
            'vehicleMaxWeight': 110000,
            'number': 0,
            'businessType': null,
            'isDel': null,
            'stowageStatus': '0'
          }
        ],
        'redisOrderSpecifiedVoList': [],
        'redisAddressList': [
          {
            'id': null,
            'code': 'a0d5b7286f3948ea93a5fd10f4c14324',
            'orderCode': '077acc62236f438eab5e93f88a6c1e88',
            'addressType': '1',
            'country': '中国',
            'province': '福建省',
            'city': '福州市',
            'cityCode': '3501',
            'district': '台江区',
            'street': null,
            'districtCode': '350103',
            'location': [
              '119.358265',
              '26.045794'
            ],
            'localtionOld': '(119.358265,26.045794)',
            'detail': '120',
            'contact': '小红',
            'contactPhone': '18650451524',
            'addressAlias': '富',
            'provinceCode': '35',
            'addressName': '富邦总部大楼',
            'redisOrderFreightVoList': null,
            'orderFreightVo': null,
            'isDel': 0
          },
          {
            'id': null,
            'code': 'e9127cf979a94b1e946a413a5d6b9bd3',
            'orderCode': '077acc62236f438eab5e93f88a6c1e88',
            'addressType': '2',
            'country': '中国',
            'province': '天津市',
            'city': '天津市',
            'cityCode': '1201',
            'district': '滨海新区',
            'street': null,
            'districtCode': '120116',
            'location': [
              '117.818263',
              '39.000665'
            ],
            'localtionOld': '(117.818263,39.000665)',
            'detail': null,
            'contact': '1213',
            'contactPhone': '18588888888',
            'addressAlias': null,
            'provinceCode': '12',
            'addressName': '富俊发超市',
            'redisOrderFreightVoList': null,
            'orderFreightVo': null,
            'isDel': 0
          }
        ],
        'redisOrderFreightInfoVoList': [
          {
            'goodsCode': '9e29282dac9f4e67b29ed4ca80a0533c',
            'redisOrderAddressInfoVoList': [
              {
                'addressCode': 'a0d5b7286f3948ea93a5fd10f4c14324:e9127cf979a94b1e946a413a5d6b9bd3',
                'redisOrderFreightVoList': [
                  {
                    'code': 'e6f8af83c7e54e6d923fa589b4069ca7',
                    'orderCode': '077acc62236f438eab5e93f88a6c1e88',
                    'orderGoodsCode': '9e29282dac9f4e67b29ed4ca80a0533c',
                    'ruleDetailShipmentCode': null,
                    'ruleItemCode': '17',
                    'ruleValue': '200',
                    'type': null,
                    'createCode': '80ceee84f9d34ed69a8467b2970f1c2b',
                    'createTime': '2021-04-06 16:58:56.709',
                    'updateCode': null,
                    'updateTime': null,
                    'isDel': 0,
                    'orderAddressCode': 'a0d5b7286f3948ea93a5fd10f4c14324',
                    'addressUnloadingCode': 'e9127cf979a94b1e946a413a5d6b9bd3',
                    'ruleCode': '1'
                  },
                  {
                    'code': 'f4ea59fb37ef458c8f700eb08f33d125',
                    'orderCode': '077acc62236f438eab5e93f88a6c1e88',
                    'orderGoodsCode': '9e29282dac9f4e67b29ed4ca80a0533c',
                    'ruleDetailShipmentCode': '6fb20504191e4e9e8a5a4cd7b5a791db',
                    'ruleItemCode': '18',
                    'ruleValue': '1',
                    'type': 2,
                    'createCode': '80ceee84f9d34ed69a8467b2970f1c2b',
                    'createTime': '2021-04-06 16:58:56.72',
                    'updateCode': null,
                    'updateTime': null,
                    'isDel': 0,
                    'orderAddressCode': 'a0d5b7286f3948ea93a5fd10f4c14324',
                    'addressUnloadingCode': 'e9127cf979a94b1e946a413a5d6b9bd3',
                    'ruleCode': '1'
                  },
                  {
                    'code': '97d997d0498f4039ada2020e07a24d65',
                    'orderCode': '077acc62236f438eab5e93f88a6c1e88',
                    'orderGoodsCode': '9e29282dac9f4e67b29ed4ca80a0533c',
                    'ruleDetailShipmentCode': 'bdb85178c91046279a72f4d6cd9c8b8c',
                    'ruleItemCode': '2',
                    'ruleValue': '[-300,300]',
                    'type': null,
                    'createCode': '80ceee84f9d34ed69a8467b2970f1c2b',
                    'createTime': '2021-04-06 16:58:56.736',
                    'updateCode': null,
                    'updateTime': null,
                    'isDel': 0,
                    'orderAddressCode': 'a0d5b7286f3948ea93a5fd10f4c14324',
                    'addressUnloadingCode': 'e9127cf979a94b1e946a413a5d6b9bd3',
                    'ruleCode': '1'
                  }
                ],
                'orderFreightVo': {
                  'lossList': [
                    {
                      'id': 2422,
                      'code': '97d997d0498f4039ada2020e07a24d65',
                      'orderCode': '077acc62236f438eab5e93f88a6c1e88',
                      'orderGoodsCode': '9e29282dac9f4e67b29ed4ca80a0533c',
                      'ruleItemCode': '2',
                      'orderAddressCode': 'a0d5b7286f3948ea93a5fd10f4c14324',
                      'ruleValue': '[-300,300]',
                      'type': null,
                      'cnName': '路耗 容忍值',
                      'enName': 'LOSS_TOLERANCE',
                      'showType': 2,
                      'dictCode': null,
                      'ruleType': 1,
                      'dictLabel': null,
                      'unit': null,
                      'ruleCode': '1'
                    }
                  ],
                  'detailList': [
                    {
                      'id': 2421,
                      'code': 'f4ea59fb37ef458c8f700eb08f33d125',
                      'orderCode': '077acc62236f438eab5e93f88a6c1e88',
                      'orderGoodsCode': '9e29282dac9f4e67b29ed4ca80a0533c',
                      'ruleItemCode': '18',
                      'orderAddressCode': 'a0d5b7286f3948ea93a5fd10f4c14324',
                      'ruleValue': '1',
                      'type': '2',
                      'cnName': '抹零规则',
                      'enName': 'M0',
                      'showType': 3,
                      'dictCode': 'M0',
                      'ruleType': 0,
                      'dictLabel': null,
                      'unit': null,
                      'ruleCode': '1'
                    },
                    {
                      'id': 2420,
                      'code': 'e6f8af83c7e54e6d923fa589b4069ca7',
                      'orderCode': '077acc62236f438eab5e93f88a6c1e88',
                      'orderGoodsCode': '9e29282dac9f4e67b29ed4ca80a0533c',
                      'ruleItemCode': '17',
                      'orderAddressCode': 'a0d5b7286f3948ea93a5fd10f4c14324',
                      'ruleValue': '200',
                      'type': null,
                      'cnName': '运费单价',
                      'enName': 'FREIGHT_COST',
                      'showType': 1,
                      'dictCode': null,
                      'ruleType': 2,
                      'dictLabel': null,
                      'unit': null,
                      'ruleCode': '1'
                    }
                  ]
                },
                'ruleCode': '1'
              }
            ]
          }
        ]
      };

      // 2 包装成需要的数据

      // 2-1 如何获取 商品的名称??
      // 2-2 如何获取 地址a到b
      const { redisOrderFreightInfoVoList, redisOrderGoodsVoList, redisAddressList, redisOrderInfoVo } = row.source;
      const tabs = redisOrderFreightInfoVoList.map((e, index) => {
        redisOrderGoodsVoList.forEach(ee => {
          if (ee.code === e.goodsCode) {
            e.goodsCode = ee.code;
            e.goodsType = ee.goodsType;
            e.goodsTypeName = ee.goodsTypeName;
            e.goodsPrice = ee.goodsPrice;
          }
        });

        const redis = e.redisOrderAddressInfoVoList.map(eee => {
          const tin_names = [];
          const addresscodes = eee.addressCode.split(':');


          redisAddressList.forEach(address => {
            if (address.code === addresscodes[0]) {
              tin_names.unshift(address.addressName);
            }
            if (address.code === addresscodes[1]) {
              tin_names.push(address.addressName);
            }
          });

          return {
            addressIdentification: eee.addressCode,
            tin_name: tin_names.join('--'), // 地址a到b 显示
            ruleCode: eee.ruleCode, // 下拉规则的的值(会改)
            // ruleDictValue: '1', // 计算规则的值
            orderFreightVo: eee.orderFreightVo // 细则
          };
        });

        // console.log(redis, '规格处理----');
        return {
          dictLabel: e.goodsTypeName, // 展示tab
          activeName: index + '', // 切换tab
          goodsPrice: e.goodsPrice, // 商品价格??
          goodsType: e.goodsType, // 商品divtValue
          goodsCode: e.goodsCode,
          redis,
          // [{ // 地址1 对应的其他的规则
          //   tin_name: 'A--B', // 地址a到b 显示
          //   ruleCode: '1', // 下拉规则的的值(会改)
          //   ruleDictValue: '1', // 计算规则的值
          //   orderFreightVo: { // 显示具体规则的值
          //     'lossList': [
          //     ],
          //     'detailList': [
          //     ]
          //   }}],
          newRedis: [] // 这个是封装返回的时候使用
        };
      });

      console.log(tabs, '封装好的tab');
      // 3 传入组件
      this.tabs = tabs;
      this.pubilshCode = redisOrderInfoVo ? redisOrderInfoVo.pubilshCode : row.source.pubilshCode;

      this.orderCode = row.code;


      // 打开调价框
      this.openPriceAdjustment = true;
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('/transportation/order/export', {
        ...this.newQueryParams
      }, `order_export.xlsx`);
    },
    /** 派单对话 */
    handleDispatch(row) {
      this.title = '派单';
      this.openDispatch = true;
      this.dispatch = row;
    },
    /** 审核 */
    handleShenhe(row) {
      this.openDispatch = true;
      this.dispatch = row;
    },
    /** 复制 */
    handleclone(row) {
      // this.openDispatch = true;
      // this.dispatch = row;
      console.log('这个是复制啥?? ', row);
    },
    /** 关闭 */
    submitRes(res) {
      if (res === 'success') {
        this.getList();
      }

      this.tabs = [];
      this.orderCode = '';
      this.pubilshCode = '';
      this.openPriceAdjustment = false;
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
