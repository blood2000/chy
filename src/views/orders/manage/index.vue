<template>
  <div>

    <el-form v-show="showSearch" ref="queryForm" :model="queryParams" :inline="true" label-width="90px" class="app-container" @submit.native.prevent>
      <el-form-item v-show="!isShipment" label="下单客户" prop="tin1">
        <el-input
          v-model="queryParams.tin1"
          placeholder="企业名称/客户姓名/手机号"
          clearable
          size="small"
          style="width: 228px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item label="装货信息" prop="tin2">
        <el-input
          v-model="queryParams.tin2"
          placeholder="装货地/装货电话/装货人"
          clearable
          size="small"
          style="width: 228px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item label="卸货信息" prop="tin3">
        <el-input
          v-model="queryParams.tin3"
          placeholder="卸货地/卸货电话/卸货人"
          clearable
          size="small"
          style="width: 228px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item label="货物类型" prop="tin4">
        <el-select v-model="queryParams.tin4" placeholder="----请选择----" clearable filterable style="width: 228px">
          <el-option
            v-for="(dict,index) in goodsTypeOption"
            :key="index"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>

      <el-form-item v-if="false" label="货物描述" prop="tin5">
        <el-input
          v-model="queryParams.tin5"
          placeholder="请输入货物描述"
          clearable
          size="small"
          style="width: 228px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>



      <el-form-item label="货源单号" prop="tin7">
        <el-input
          v-model="queryParams.tin7"
          placeholder="请输入货源单号"
          clearable
          size="small"
          style="width: 228px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item v-if="false" label="货源状态" prop="tin8">
        <el-select v-model="queryParams.tin8" placeholder="----请选择----" style="width: 228px" clearable filterable>
          <el-option
            v-for="(dict,index) in statusOptions"
            :key="index"
            :label="dict.dictLabel"
            :value="dict.dictValue"
            @keyup.enter.native="handleQuery"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="发布方式" prop="tin11">
        <el-select v-model="queryParams.tin11" placeholder="----请选择----" style="width: 228px" clearable filterable>
          <el-option
            v-for="(dict,index) in isPublicTypeOptions"
            :key="index"
            :label="dict.dictLabel"
            :value="dict.dictValue"
            @keyup.enter.native="handleQuery"
          />
        </el-select>
      </el-form-item>

      <el-form-item v-show="(queryParams.tin8+'') ==='1'" label="下架状态" prop="isManual">
        <el-select v-model="queryParams.isManual" placeholder="----请选择----" clearable filterable style="width: 228px">
          <el-option
            v-for="(dict,index) in dicts['isManual_option']"
            :key="index"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="发布时间" prop="tin10">
        <el-date-picker
          v-model="queryParams.tin10"
          size="small"
          style="width: 228px"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        />
      </el-form-item>

      <!-- 做远程的 -->
      <el-form-item v-show="!isShipment" label="货主" prop="tin6" size="small">
        <el-select
          v-model="queryParams.tin6"
          v-el-select-loadmore="loadmore"
          filterable
          clearable
          remote
          reserve-keyword
          placeholder="请输入关键词"
          :remote-method="remoteMethod"
          :loading="loading"
          style="width: 228px"
          @keyup.enter.native="handleQuery"
        >
          <el-option
            v-for="(item, index1) in shipmentList"
            :key="index1"
            :value="item.code"
            :label="item.adminName"
          >
            <div class="ly-flex-pack-justify"><span>{{ item.adminName }}</span><span>{{ item.telphone }}</span></div>
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" type="primary" plain size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>

    </el-form>

    <div class="app-container">

      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-radio-group v-model="activeName" size="small" @change="handleClick">
            <el-radio-button label="0">已发布</el-radio-button>
            <el-radio-button label="1">已关闭</el-radio-button>
          </el-radio-group>
        </el-col>

        <el-col :span="1.5">
          <el-button
            v-if="false"
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
        <!-- <el-col v-show="showSearch" :span="1.5" class="fr mr20">
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
          <el-button type="primary" plain icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
        </el-col> -->
      </el-row>


      <RefactorTable
        is-show-index
        :height="theight"
        :loading="loading"
        :data="list"
        row-key="id"
        stripe
        :row-class-name="tableRowClassName"
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
        :table-columns-config="tableColumnsConfig"
      ><!-- @selection-change="handleSelectionChange" -->
        <!-- 装货地 -->
        <template #addressName1="{row}">
          <span>{{ row.addressAlias1 || row.addressName1 }}</span>
        </template>

        <template #contact1="{row}">
          <span>{{ `${row.contact1 || '-'} [${row.contactPhone1 || '-'}]` }}</span>
        </template>

        <!-- 装货地 -->
        <template #addressName2="{row}">
          <span>{{ row.addressAlias2 || row.addressName2 }}</span>
        </template>

        <template #contact2="{row}">
          <span>{{ `${row.contact2 || '-'} [${row.contactPhone2 || '-'}]` }}</span>
        </template>

        <template #landAddress="{row}">
          <span>{{ row.landAddress }}</span>
        </template>

        <template #goodsPrice="{row}">
          <span>{{ row.goodsPrice + ' 元/' + (selectDictLabel(stowageStatusOptions, row.stowageStatus)) }}</span>
        </template>
        <template #shipmentPrice="{row}">
          <span>{{ row.shipmentPrice + ' 元/' + (selectDictLabel(stowageStatusOptions, row.stowageStatus)) }}</span>
        </template>
        <template #transactionPrice="{row}">
          <span>{{ row.transactionPrice + ' 元/' + (selectDictLabel(stowageStatusOptions, row.stowageStatus)) }}</span>
        </template>

        <template #status="{row}">
          <span>{{ selectDictLabel(statusOptions, (row.status +'')) }}</span>
        </template>

        <template #isClass="{row}">
          <span>{{ selectDictLabel(isClassOptions, row.isClass) }}</span>
        </template>

        <template #businessType="{row}">
          <span>{{ selectDictLabel(dicts['businessTypes'], row.businessType) }}</span>
        </template>
        <!-- 已抢单量 -->
        <template #number_remainingNumber="{row}">
          <span>{{ (row.number - 0) - (row.remainingNumber - 0) }}</span>
        </template>
        <!-- 可抢单量 -->
        <template #remainingNumber="{row}">
          <span>{{ row.remainingNumber || '不限' }}</span>
        </template>
        <!-- 重量/体积/车 -->
        <template #tin_weight="{row}">
          <span v-if="row.stowageStatus == 0">{{ row.remainingWeight? (row.remainingWeight - 0) + ' 吨':'不限' }}</span>
          <span v-if="row.stowageStatus == 1">{{ row.remainingWeight?(row.remainingWeight - 0) + ' 立方' :'不限' }}</span>
          <span v-if="row.stowageStatus == 2">{{ row.number? (row.number - 0) + ' 车' : '不限' }}</span>
        </template>

        <template #stowageStatus="{row}">
          <span>{{ selectDictLabel(stowageStatusOptions, row.stowageStatus) }}</span>
        </template>

        <template #isPublic="{row}">
          <span :class="row.isPublic===0?'g-color-warning':'g-color-blue'">{{ selectDictLabel(isPublicTypeOptions, row.isPublic) }}</span>
        </template>

        <template #isSpecified="{row}">
          <span v-if="row.isSpecified === 0" class="g-color-error">否</span>
          <span v-if="row.isSpecified === 1">{{ row.specified }}</span>
        </template>

        <template #loadType="{row}">
          <span>{{ selectDictLabel(loadTypeOptions, row.loadType) }}</span>
        </template>

        <template #accessTime="{row}">
          <span>{{ row.accessTime }}</span>
        </template>
        <template #edit="{row}">
          <template v-if="row.isShowEdit">
            <el-button
              size="mini"
              type="text"
              @click="handleInfo(row)"
            >详情</el-button>

            <!-- v-hasPermi="['transportation:order:pubilsh']" -->
            <el-button
              v-if="row.status+''==='0'"
              v-hasPermi="['transportation:order:modify']"
              size="mini"
              type="text"
              @click="handleUpdate(row)"
            >编辑</el-button>

            <el-button
              v-hasPermi="['transportation:order:loadAndUnloadingGoods']"
              size="mini"
              type="text"
              :class="row.status+''==='0'?'g-color-error': null"
              @click="handleClose(row)"
            >{{ row.status+''==='0'?'禁用':'启用' }}</el-button>

            <TableDropdown v-if="!row.haveWaybill || row.status+''==='0'">
              <el-dropdown-item>
                <el-button
                  v-if="!row.haveWaybill"
                  v-hasPermi="['transportation:order:delete']"
                  size="mini"
                  type="text"
                  @click="handleDelete(row)"
                >删除</el-button>
              </el-dropdown-item>

              <el-dropdown-item>
                <el-button
                  v-if="row.status+''==='0'"
                  v-hasPermi="['transportation:order:adjustPrice']"
                  size="mini"
                  type="text"
                  @click="handleReadjustPrices(row)"
                >调价</el-button>
              </el-dropdown-item>

              <el-dropdown-item>
                <el-button
                  v-if="false"
                  size="mini"
                  type="text"
                  @click="handleShenhe(row)"
                >审核</el-button>
              </el-dropdown-item>

              <el-dropdown-item>
                <el-button
                  v-if="row.status+''==='0'"
                  size="mini"
                  type="text"
                  @click="handleclone(row)"
                >复制</el-button>
              </el-dropdown-item>
            </TableDropdown>



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

    <!-- 派送订单 -->
    <el-dialog :close-on-click-modal="false"  :title="title" :visible.sync="openDispatch" width="80%" append-to-body>
      <open-dialog v-if="openDispatch" :dispatch="dispatch" @_ok="(bool)=>{openDispatch = false;bool ==='success' && getList()}" />
    </el-dialog>

    <!-- 价格调整 -->
    <el-dialog  :close-on-click-modal="false" :title="'费用调价'" class="i-price" :visible.sync="openPriceAdjustment" width="900px" append-to-body>
      <price-adjustment v-if="openPriceAdjustment" :mytabs="tabs" :order-code="orderCode" :pubilsh-code="pubilshCode" @submitRes="submitRes" />
    </el-dialog>
  </div>
</template>

<script>
import { listManagesApi, getOrderInfoList, delOrder, loadAndUnloadingGoods } from '@/api/order/manage';
import { listShipment } from '@/api/assets/shipment';
import { getUserInfo } from '@/utils/auth';
import OpenDialog from './component/OpenDialog';
import tableColumnsConfig from './data/config-index';


import PriceAdjustment from './component/PriceAdjustment';

export default {
  name: 'Manage',
  components: { OpenDialog, PriceAdjustment },
  data() {
    return {
      theight: null, // 高度

      activeName: '0', // 做tab切换
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
        tin8: '0',
        tin11: '',
        isManual: '',
        tin9: '',
        tin10: []
      },
      // 弹框title
      title: '',
      // 表头动态值
      tableColumnsConfig: [],
      // 订单状态字典 	状态 0.启用 1.禁用
      statusOptions: [
        { dictLabel: '启用', dictValue: '0' },
        { dictLabel: '禁用', dictValue: '1' }
      ],
      stowageStatusOptions: [
        { dictLabel: '吨', dictValue: 0 },
        { dictLabel: '立方', dictValue: 1 },
        { dictLabel: '车', dictValue: 2 }
      ],
      // 发运方式字典
      // billingTypeOptions: [
      //   { dictLabel: '汽运一票制', dictValue: '0' },
      //   { dictLabel: '对付', dictValue: '1' },
      //   { dictLabel: '代收代付', dictValue: '2' }
      // ],
      // 是否导入货源字典
      // importTypeOptions: [
      //   { dictLabel: '正常发布货源', dictValue: '0' },
      //   { dictLabel: '货源单导入', dictValue: '1' },
      //   { dictLabel: '运输单导入', dictValue: '2' }
      // ],
      // isClass	是否加入货集码
      isClassOptions: [
        { dictLabel: '否', dictValue: 0 },
        { dictLabel: '是', dictValue: 1 }
      ],
      // isDel	是否删除 0.正常 1.删除	boolean
      // isDelTypeOptions: [
      //   { dictLabel: '正常', dictValue: 0 },
      //   { dictLabel: '删除', dictValue: 1 }
      // ],
      // isDispatch	是否已受理 0未受理，1已受理	boolean
      // isDispatchTypeOptions: [
      //   { dictLabel: '未受理', dictValue: false },
      //   { dictLabel: '已受理', dictValue: true }
      // ],
      // isInsure	投保类别 0否 1是	boolean
      // isInsureTypeOptions: [
      //   { dictLabel: '否', dictValue: false },
      //   { dictLabel: '是', dictValue: true }
      // ],
      // isMonthlyOrder	是否月结订单 0否 1 是	boolean
      // isMonthlyOrderTypeOptions: [
      //   { dictLabel: '否', dictValue: false },
      //   { dictLabel: '是', dictValue: true }
      // ],
      // isPay	是否已经支付 0 未支付 1 已经支付	boolean
      // isPayTypeOptions: [
      //   { dictLabel: '未支付', dictValue: false },
      //   { dictLabel: '已经支付', dictValue: true }
      // ],
      // isPublic	是否公开货源 0.非公开 1.公开
      isPublicTypeOptions: [
        { dictLabel: '非公开', dictValue: 0 },
        { dictLabel: '公开', dictValue: 1 }
      ],
      // isReturnMoney	标记货主是否结算 0 否 1-是	boolean
      // isReturnMoneyTypeOptions: [
      //   { dictLabel: '否', dictValue: false },
      //   { dictLabel: '是', dictValue: true }
      // ],
      // isShare	是否拼单 0-否，1-是	boolean
      // isShareTypeOptions: [
      //   { dictLabel: '否', dictValue: false },
      //   { dictLabel: '是', dictValue: true }
      // ],
      // isShipperConfirm	是否货主确认装货 0否，1是	boolean
      // isShipperConfirmTypeOptions: [
      //   { dictLabel: '否', dictValue: false },
      //   { dictLabel: '是', dictValue: true }
      // ],
      // isSpecified	是否指定接单人 0否 1是	boolean
      isSpecifiedTypeOptions: [
        { dictLabel: '否', dictValue: 0 },
        { dictLabel: '是', dictValue: 1 }
      ],
      // isSplit	是否允许拆单 0-不允许，1-允许	boolean
      // isSplitTypeOptions: [
      //   { dictLabel: '不允许', dictValue: false },
      //   { dictLabel: '允许', dictValue: true }
      // ],
      // isTop	是否置顶 0否 1是	boolean
      // isTopTypeOptions: [
      //   { dictLabel: '否', dictValue: false },
      //   { dictLabel: '是', dictValue: true }
      // ],
      // isTrunk	订单类型 0-整车大宗，1-零散多货	boolean
      // isTrunkTypeOptions: [
      //   { dictLabel: '整车大宗', dictValue: '0' },
      //   { dictLabel: '零散多货', dictValue: '1' }
      // ],
      // loadType	装卸类型 1.一装一卸 2.多装一卸 3.一装多卸 4.多装多卸
      loadTypeOptions: [
        { dictLabel: '', dictValue: '0' },
        { dictLabel: '一装一卸', dictValue: '1' },
        { dictLabel: '多装一卸', dictValue: '2' },
        { dictLabel: '一装多卸', dictValue: '3' }
        // { dictLabel: '多装多卸', dictValue: '4' }
      ],

      // orderType	运输类型 0-汽运，1-船运	string
      // orderTypeTypeOptions: [
      //   { dictLabel: '汽运', dictValue: '0' },
      //   { dictLabel: '船运', dictValue: '1' }
      // ],
      // paymentCode	支付方式 0-现金，1-打卡，2现金+油卡 (字典表CODE)
      // paymentCodeTypeOptions: [
      //   { dictLabel: '现金', dictValue: '0' },
      //   { dictLabel: '打卡', dictValue: '1' },
      //   { dictLabel: '现金+油卡', dictValue: '2' }
      // ],

      goodsTypeOption: [],
      isShipment: false,

      dicts: {
        isManual_option: [{ dictLabel: '自动', dictValue: 2 }, { dictLabel: '手动', dictValue: 1 }]
      }, // 字典集合
      shipmentList: [], // 货主列表
      shipmentreq: {
        pageNum: 1,
        keywords: '',
        pageSize: 10
      }
    };
  },

  computed: {
    newQueryParams() {
      return {
        beginTime: this.queryParams.tin10[0], //	开始时间	query	false
        endTime: this.queryParams.tin10[1], //	结束时间	query	false
        companyAndCustomerAndPhone: this.queryParams.tin1, //	下单客户	query	false
        goodsName: this.queryParams.tin5, //	货物描述(名称)	query	false
        goodsBigType: this.queryParams.tin4 ? [this.queryParams.tin4] : undefined, //	货物类型大类	query	false
        goodsType: undefined, // 小类
        isPublic: this.queryParams.tin11, //	发布状态	query	false
        landInfo: this.queryParams.tin3, //	收货信息	query	false
        loadInfo: this.queryParams.tin2, //	装货信息	query	false
        driverId: undefined, //	(司机id)查询自己公司的货源	query	false
        isShare: this.queryParams.tin9, //	是否拼单	query	false
        mainOrderNumber: this.queryParams.tin7, //	货源单号	query	false

        pubilshCode: this.queryParams.tin6, //	货主编码	query	false

        status: this.queryParams.tin8, //	订单状态（字典表）	query	false
        isManual: this.queryParams.isManual, // 下架状态

        pageNum: this.queryParams.pageNum, //	pageNum,示例值(1)	query	false
        pageSize: this.queryParams.pageSize //	pageSize,示例值(10)	query	false
      };
    }


    // loading	装货信息电话联系人等	query	false

    // projectCode	项目code	query	false

    // receiving	收货信息电话联系人等	query	false

    // remark	备注	query	false

  },

  watch: {
    '$route.query.p': {
      handler(value, odvalue) {
        if (!value) return;
        this.queryParams.pageNum = 1;
        this.getList();
        this.$route.query.p = '';
      },
      immediate: true
    }
  },


  created() {
    const { isAdmin = true, shipment = {}} = getUserInfo() || {};


    // 判断当前是什么角色登入的 true 是运营
    this.isShipment = !isAdmin;
    this.isShipment && (this.queryParams.tin6 = shipment.info.code);
    // 要配置好才能用
    this.tableHeaderConfig(this.tableColumnsConfig, listManagesApi, null, tableColumnsConfig);
    this.getDict();
    this.getList();
    // this.listShipment();
  },
  methods: {
    // tab切换
    handleClick() {
      // console.log(this.activeName);
      this.queryParams.tin8 = this.activeName;
      if (this.activeName === '0') {
        this.queryParams.isManual = undefined;
      }
      this.handleQuery();
    },

    // 触发远程搜索
    remoteMethod(query) {
      if (query !== '') {
        this.shipmentreq.pageNum = 1;
        this.shipmentreq.keywords = query;
        this.shipmentList = [];
        this.getTeamList();
      } else {
        this.shipmentList = [];
      }
    },
    // 远程搜索列表触底事件
    loadmore() {
      if (this.dataOver) return;
      this.shipmentreq.pageNum++;
      this.getTeamList();
    },
    getTeamList() {
      // 获取代理用户表
      listShipment(this.shipmentreq).then(
        (res) => {
          this.dataOver = !res.rows.length;
          this.shipmentList = this.shipmentList.concat(res.rows);
          this.loading = false;
        }
      ).catch(() => {
        this.loading = false;
      });
    },

    /** 获取首页字典值 */
    getDict() {
      const goodsBigType_option = this.$store.getters.goodsBigType_option;

      if (!goodsBigType_option) {
        this.listByDict({
          dictPid: '0',
          dictType: 'goodsType'
        }).then(res => {
          this.goodsTypeOption = res.data;
          this.$store.dispatch('orders/store_goodsBigType_option', res.data);
        });
      } else {
        this.goodsTypeOption = goodsBigType_option;
      }

      ['businessTypes'].forEach(e => {
        this.getDicts(e).then(response => {
          this.dicts[e] = response.data;
        });
      });
    },
    /** 查询货源列表 */
    getList() {
      this.loading = true;
      getOrderInfoList(this.newQueryParams).then(response => {
        this.total = response.data.total - 0;
        this.handlerList(response.data.list);
      });
    },

    // 基本格式(即表头定义)
    baseData(e) {
      return {
        ...e,
        'id': this.genID(5), // 标识用,防止重复
        'source': e // 调价时候用
      };
    },

    // 处理返回的列表
    handlerList(lists) {
      this.list = lists.map(e => {
        // 先判断几个商品
        e = e.redisOrderInfoListVoList[0];

        // 调度者
        e.redisOrderSpecifiedVoList.forEach(specified => {
          // 只考虑互斥
          if (specified.userType === 1) {
            e.specified = `调度者：${e.redisOrderSpecifiedVoList.length} 人`;
          } else {
            e.specified = `司机：${e.redisOrderSpecifiedVoList.length} 人`;
          }
        });

        // 货集码
        e.redisOrderClassGoodsVoList.forEach(orderClass => {
          e.cargoCodeQr = orderClass.cargoCodeQr || '-';
        });

        const mgoods = [];
        if (!e.redisOrderFreightInfoVoList.length) {
          e.goodsPrice = '';
          e.goodsTypeName = '';
          e.goodsBigTypeName = '';
          e.addressName1 = '';
          e.addressName2 = '';
          e.shipmentPrice = '';
          e.transactionPrice = '';
          // e.unitPrice = '';
          e.businessType = '';
          e.contact2 = '';
          e.contactPhone2 = '';
          e.specified = ''; // 调度者或司机几人
          mgoods.push({
            ...this.baseData(e)
          });
        }
        e.redisOrderFreightInfoVoList.length && e.redisOrderFreightInfoVoList.forEach((redis, index) => {
          // 获取商品信息到这里获取

          e.redisOrderGoodsVoList.forEach(goods => {
            if (goods.code === redis.goodsCode) {
              e.goodsPrice = goods.goodsPrice;
              e.goodsTypeName = goods.goodsTypeName;
              e.goodsBigTypeName = goods.goodsBigTypeName;
              e.businessType = goods.businessType;

              e = {
                ...e,
                ...goods
              };
            }
          });
          // 对应的
          redis.redisOrderAddressInfoVoList.forEach(address => {
            const addresCodes = address.addressCode.split(':');
            // 地址信息的到这里获取
            e.redisAddressList.forEach(addr => {
              // 装货地

              if (addr.code === addresCodes[0] || addr.code === addresCodes[1]) {
                if (addr.addressType === '3') {
                  e.addressName1 = '自装';
                  e.addressAlias1 = '自装';
                  e.contact1 = '-';
                  e.contactPhone1 = '-';
                } else if (addr.addressType === '1') {
                  e.addressName1 = addr.formattedAddress;
                  e.addressAlias1 = addr.addressAlias;
                  // 装货人
                  e.contact1 = addr.contact;
                  e.contactPhone1 = addr.contactPhone;
                } else if (addr.addressType === '2') {
                  e.addressName2 = addr.formattedAddress;
                  e.addressAlias2 = addr.addressAlias;

                  // 卸货人
                  e.contact2 = addr.contact;
                  e.contactPhone2 = addr.contactPhone;
                } else if (addr.addressType === '4') {
                  e.addressName2 = '自卸';
                  e.addressAlias2 = '自卸';

                  e.contact2 = '-';
                  e.contactPhone2 = '-';
                }
              // 卸货地
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
                // e.unitPrice = freight.ruleValue;
              }
            });

            // 货集码地址
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
      // console.log(this.list, '最后封装好的列表数据');
      this.theight = null;
      this.loading = false;
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
      this.$router.push({ name: 'Release', query: { id: row.orderCode, t: '1' }});
    },
    /** 查看详情操作 */
    handleInfo(row) {
      this.$router.push({ name: 'Release', query: { id: row.orderCode, t: '0' }});
    },
    /** 上下架货源 */
    loadAndUnloading(row) {
      const msg = row.status === '1' ? '上架' : '下架';
      const data = {
        'orderCode': row.orderCode,
        'status': row.status === '0' ? 1 : 0
      };
      this.$confirm('是否确认操作货源编号为"' + row.orderCode + '"的数据项?', '警告', {
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
      const testIds = row.orderCode;
      // 操作删除按钮，判断货单是否产生运单。
      const waybill = row.haveWaybill - 0 === 0;

      let msg = '';
      if (waybill) {
        msg = '该货源单下，暂无产生运单，确认是否删除';
      } else {
        msg = `该货源单下，已产生运单，确认是否删除`;
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
      const msg = row.status + '' === '0'
        ? '是否确认关闭该货源单，关闭后无法司机无法再继续接单。但运输中的运单则继续进行'
        : '是否确认启用该货源单';

      const data = {
        'orderCode': row.orderCode,
        'status': row.status + '' === '1' ? '0' : '1'
      };
      this.$confirm(msg, '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        // 关闭接口
        return loadAndUnloadingGoods(data);
      }).then(() => {
        this.getList();
        this.msgSuccess(row.status + '' === '0' ? '禁用成功' : '启用成功');
      });
    },
    /** 调价操作 */
    async handleReadjustPrices(row) {
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

        console.log(e.redisOrderAddressInfoVoList);


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

        return {
          dictLabel: e.goodsTypeName, // 展示tab
          activeName: index + '', // 切换tab
          goodsPrice: e.goodsPrice, // 商品价格??
          goodsType: e.goodsType, // 商品divtValue
          goodsCode: e.goodsCode,
          redis,
          newRedis: [] // 这个是封装返回的时候使用
        };
      });

      // 3 传入组件
      this.tabs = tabs;
      this.pubilshCode = redisOrderInfoVo ? redisOrderInfoVo.pubilshCode : row.source.pubilshCode;

      this.orderCode = row.orderCode;

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
      this.$router.push({ name: 'Release', query: { id: row.orderCode, t: '3' }});
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
    },

    // 有子类的高亮
    tableRowClassName({ row, rowIndex }) {
      if (row.children) {
        return 'warning-row';
      }
      if (!row.isShowEdit) {
        return 'red-row';
      }
      return '';
    }
  }
};
</script>

<style>

.el-table .warning-row,.el-table--striped .el-table__body tr.el-table__row--striped.warning-row td {
    background: oldlace;
  }

.el-table .red-row,.el-table--striped .el-table__body tr.el-table__row--striped.red-row td {
  background: #e1f3d8;
}

</style>
