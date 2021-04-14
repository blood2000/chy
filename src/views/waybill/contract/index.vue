<template>
  <div class="app-container">
    <el-form
      v-show="showSearch"
      ref="queryForm"
      :model="queryParams"
      :inline="true"
      label-width="130px"
    >
      <el-form-item
        label="合同编号"
        prop="contractNo"
      >
        <el-input
          v-model="queryParams.contractNo"
          placeholder="请输入合同编号"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item
        label="司机信息"
        prop="driverInfo"
      >
        <el-input
          v-model="queryParams.driverInfo"
          placeholder="请输入司机信息"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item
        label="司机 / 货主"
        prop="driverOrShipment"
      >
        <el-select
          v-model="queryParams.driverOrShipment"
          placeholder="请选择标合同类型"
          clearable
          filterable
          size="small"
          style="width: 240px"
        >
          <el-option
            v-for="dict in driverOrShipmentOptions"
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
      <el-col :span="1.5" style="float: right;">
        <tablec-cascader v-model="tableColumnsConfig" :lcokey="api" />
      </el-col>
      <right-toolbar
        :show-search.sync="showSearch"
        @queryTable="getList"
      />
    </el-row>

    <RefactorTable :loading="loading" :data="contractList" :table-columns-config="tableColumnsConfig"><!-- @selection-change="handleSelectionChange" -->
      <template #driverOrShipment="{row}">
        <span>{{ selectDictLabel(driverOrShipmentOptions, row.driverOrShipment) }}</span>
      </template>
      <template #isDzqzContract="{row}">
        <span>{{ selectDictLabel(isDzqzContractOptions, row.isDzqzContract) }}</span>
      </template>

      <template #edit="{row}">
        <el-button
          v-hasPermi="['transportation:orderContract:generate']"
          size="mini"
          type="text"
          icon="el-icon-printer"
          @click="handleInfo(row)"
        >打印</el-button>
        <el-button
          v-hasPermi="['transportation:orderContract:generate']"
          size="mini"
          type="text"
          icon="el-icon-magic-stick"
          @click="handleElectron(row)"
        >生成电子章</el-button>
      </template>
    </RefactorTable>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 生成电子合同 -->
    <el-dialog :title="title" :visible.sync="visible" width="1200px" append-to-body>
      <div v-if="visible">
        <driver-contract v-if="driverOrShipment === 0" :obj="dialogData" />
        <shipment-contract v-else :obj="dialogData" />
      </div>
    </el-dialog>

  </div>
</template>

<script>
// import tableColumnsConfig from './config';
import DriverContract from './DriverContract';
import ShipmentContract from './ShipmentContract';

import { listContract, getContractByCode, listContractApi, getContract } from '@/api/waybill/contract';

export default {
  'name': 'Contract',
  components: { DriverContract, ShipmentContract },
  data() {
    return {
      // 弹框 内容
      visible: false,
      title: '',
      dialogData: null, // 弹框数据
      driverOrShipment: 0, // 合同类型 0 司机 1 货主

      tableColumnsConfig: [],
      api: listContractApi,
      // 遮罩层
      'loading': true,
      // 选中数组
      //   'ids': [],
      // 显示搜索条件
      'showSearch': true,
      // 总条数
      'total': 0,
      // 表格数据
      'contractList': [],

      // 查询参数
      'queryParams': {
        'pageNum': 1,
        'pageSize': 10,
        contractNo: undefined,
        driverInfo: undefined,
        driverOrShipment: undefined
      },

      // ne 0 司机 1 货主
      driverOrShipmentOptions: [
        { 'dictLabel': '司机合同', 'dictValue': '0' },
        { 'dictLabel': '货主合同', 'dictValue': '1' }
      ],
      // 是否已经生成电子签章合同 0否 1是，2,正在生成''
      isDzqzContractOptions: [
        { 'dictLabel': '否', 'dictValue': '0' },
        { 'dictLabel': '是', 'dictValue': '1' },
        { 'dictLabel': '正在生成', 'dictValue': '2' }
      ]
    };
  },
  created() {
    this.tableHeaderConfig(this.tableColumnsConfig, listContractApi, {
      prop: 'edit',
      isShow: true,
      label: '操作',
      width: 180,
      fixed: 'right'
    });
    this.getList();
  },
  'methods': {
    /** 查询列表 */
    getList() {
      this.loading = true;
      listContract(this.queryParams).then(response => {
        this.contractList = response.rows;
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
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.code);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 详情按钮操作 */
    handleUpdate(row) {
      this.currentId = row.code;
      this.open = true;
      this.title = '查看运单详情';
      this.formDisable = true;
    },
    /** 标记异常按钮操作 */
    handleMark(row) {
      this.currentId = row.code;
      this.openMarkAbanormal = true;
      this.title = '标记异常';
    },
    /** 分单列表按钮操作 */
    handleSeperate(row) {
      this.currentId = row.code;
      this.openSeperateList = true;
      this.title = '子单列表';
    },
    // /** 删除按钮操作 */
    // handleDelete(row) {
    //   const ids = row.code || this.ids;
    //   this.$confirm('是否确认作废编号为"' + ids + '"的运单?', '警告', {
    //     'confirmButtonText': '确定',
    //     'cancelButtonText': '取消',
    //     'type': 'warning'
    //   }).then(function() {
    //     return delManages(ids);
    //   }).then(() => {
    //     this.getList();
    //     this.msgSuccess('作废成功');
    //   });
    // },
    // /** 备注按钮操作 */
    // handleRemarks(row) {
    //   this.currentId = row.code;
    //   this.openRemark = true;
    //   this.title = '编辑货主运单备注';
    // }
    /* 打印 */
    async handleInfo(row) {
      this.visible = true;
      this.title = '电子合同';
      this.driverOrShipment = row.driverOrShipment;

      const res = await getContractByCode(row.code);
      console.log(res);

      const res1 = {
        'contractNo': 'DADAOCHENG2104061658484980', // 合同编号
        'createTime': '2021-04-12 17:16:39',

        'branchName': '福建大道成物流科技有限公司', // 公司名称
        'branchOrganizationCodeNo': '913713000673687316', // 公司的-统一社会信用代码代码
        'branchArea': '福建省福州市福清市万达 写字楼A2-901', // 公司的地址 网点-住所
        'branchArtificialName': '施联文', // (司机合同则是)甲方 网点-法定代表人
        'branchPhone': '400-8270-535', // 公司的-电话

        // 如果是司机合同 则这些值有的时候是显示空的
        'shipmentCompanyName': '包头市闽鹿飞商贸有限责任公司', // 货主公司名称(货主合同的时候是 甲方)
        'shipmentName': '罗闽春', // 货主名称
        'shipmentPhone': null, // 货主电话
        'shipmentArea': '福建省福州市台江区台江万达',
        'shipmentOrganizationCodeNo': null, // 货主统一社会信用代码代码

        'startAddress': '123', // 出发地
        'endAddress': '214124', // 目的地

        'consignor': '发货人', // 发货人-名称
        'consignorPhone': '18147824577', // 发货人电话
        'consignee': '收货', // 收货人-名称
        'consigneePhone': '18147824577', // 收货人电话

        'driverName': '王敏', // 实际承运人（司机）-名称
        'driverPhone': '15947175530', // 司机电话
        'driverLicense': '150221198012026219', // 驾驶证号码
        'driverIdentificationNumber': '150221198012026219', // 司机的-身份证号
        'licenseNumber': '蒙KH8928', // 车牌号

        'goodsTypeName': null, // 货物小类 -中文名称
        'goodsBigTypeName': '0300', // 货物大类 -中文名称
        'loadWeight': 10, // 装货重量
        'goodsName': '', // 货物描述
        'goodsAmount': 10, // 货物价值 价格
        'driverOrShipment': 0 // 合同类型 0 司机 1 货主  (用这个判断甲方和乙方)
      };

      console.log(res1);



      const obj = {
        'id': 29563,
        'code': 'c836b52f91a04c82b40fa9835b815833',
        'branch_code': '27adb23841d547b8ae6f0c11481b4cfd',
        'branch_name': '福建大道成物流科技有限公司',
        'electronic_signature_stype': 0,
        'order_detail_code': '9a086df8b1a843ca96b7e975b267a4ea',
        'contract_no': 'DADAOCHENG202104121716381452',
        'start_address': '福建省福州市仓山区',
        'end_address': '福建省福州市台江区',
        'amount': 150.00,
        'weight': 50.00,
        'goods_type': '鲜活农产品',
        'mobile': '15859109862',
        'create_code': 'beccf358d5424ccfac3372c488d09da3',
        'contract_path': '',
        'create_time': '2021-04-12 17:16:39',
        'driver_or_shipment': 0,
        'is_dzqz_contract': 0,
        'dzqz_contract_msg': '',
        'name': '小强师傅',
        'urs_driver_name': '小强师傅',
        'driver_user_code': 'beccf358d5424ccfac3372c488d09da3',
        'driver_phone': '15859109862',
        'order_code': '2104121716389884',
        'last_loading_time': '2021-04-13 16:00:24',
        'coal_type_name': '鲜活农产品',
        'goods_total': 0.00,
        'shipper_name': 'lan测试',
        'shipper_phone': '13559169013',
        'shipper_address': '福建省福州市仓山区',
        'consignee_name': '李四',
        'consignee_phone': '13290895602',
        'consignee_address': '福建省福州市台江区',
        'shipment_user_code': '350f832f93aa4286995c56eb5f4b9e4e',
        'shipment_company_code': '00ba6e35dbf2408c8014f1a51867aa8e',
        'shipment_name': '大道成测试货主公司',
        'staff_type': 1,
        'business_license_img_no': '20210412000001',
        'user_role': 'shipment_company',
        'shipment_user_name': 'lan测试',
        'shipment_user_phone': '13559169013',
        'shipment_company_phone': '13559169013',
        'order_status': 3,
        'driver_identification_number': '350123198908263919',
        'shipment_identification_number': '350103198909084236',
        'driver_name': '小强师傅',
        'license_number': '浙B8U39T',
        'identification_number': '350123198908263919',
        'driver_license': '',
        'first': '福建大道成物流科技有限公司',
        'second': '小强师傅',
        'dzqzUserCode': 'beccf358d5424ccfac3372c488d09da3',
        'branchName': '福建大道成物流科技有限公司'
      };

      this.dialogData = res1;
      // row.driverOrShipment


      // getContractByCode(row.id).then(res => {
      //   console.log(res);
      // });
    },

    /** 生成电子章合同 */
    async handleElectron(row) {
      this.$confirm('生成电子签章合同? 大概用时20秒才可生成电子签章合同', '警告', {
        'confirmButtonText': '确定',
        'cancelButtonText': '取消',
        'type': 'warning'
      }).then(function() {
        return getContract(row.code);
      }).then(() => {
        this.getList();
        this.msgSuccess('请求成功');
      });
    }
  }
};
</script>
