<template>
  <div>
    <!-- <el-form ref="queryForm" :model="queryParams" :inline="true" label-width="100px" class="clearfix">
      <el-form-item label="转货地址" prop="testName">
        <el-input
          v-model="queryParams.testName"
          placeholder="请输入公司名称/客户姓名/手机号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item label="转货电话" prop="testName1">
        <el-input
          v-model="queryParams.testName1"
          placeholder="装货地/装货电话/装货人"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item label="发货人" prop="testName2">
        <el-input
          v-model="queryParams.testName2"
          placeholder="目的地/收货电话/收货人"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>


      <el-form-item class="fr">
        <el-button type="cyan" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>

      </el-form-item>
    </el-form> -->

    <!-- <div class="mb8">
      <tablec-cascader v-model="tableColumnsConfig" :options="options" />
    </div> -->
    <el-tabs v-model="activeName" type="card" @tab-click="getList()">
      <el-tab-pane label="司机" name="listDriver" />
      <el-tab-pane label="调度" name="listInfo" />
    </el-tabs>

    <RefactorTable :loading="loading" :data="list" :table-columns-config="tableColumnsConfig" @selection-change="handleSelectionChange">
      <template #edit="{row}">
        <el-button
          size="mini"
          type="text"
          icon="el-icon-edit"
          @click="handleUpdate(row)"
        >选择</el-button>
      </template>
    </RefactorTable>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <div>
      <el-button type="cyan" :disabled="!(ids.length>0)" icon="el-icon-search" size="mini" @click="_ok(true)">确定</el-button>
      <el-button icon="el-icon-refresh" size="mini" @click="_ok(false)">取消</el-button>
    </div>
  </div>
</template>

<script>

import { listDriver } from '@/api/assets/driver';
import { listInfo } from '@/api/assets/team';
import { dispatchOrder } from '@/api/order/manage';

// import { listShipment, getShipment, delShipment } from '@/api/assets/shipment';

const apiFn = {
  listDriver, listInfo
};

const tableColumnsConfig_listDriver = [
  {
    prop: 'driverType',
    isShow: true,
    label: '司机类别'
    // width: 180,
    // fixed: 'right'
  },
  {
    prop: 'provinceCodedit',
    isShow: false,
    label: '省'
    // width: 180,
    // fixed: 'right'
  },
  {
    prop: 'cityCodedit',
    isShow: false,
    label: '市'
    // width: 180,
    // fixed: 'right'
  },
  {
    prop: 'countyCodedit',
    isShow: false,
    label: '县'
    // width: 180,
    // fixed: 'right'
  },
  {
    prop: 'namet',
    isShow: false,
    label: '名字'
    // width: 180,
    // fixed: 'right'
  },
  {
    prop: 'telphonet',
    isShow: false,
    label: '手机'
    // width: 180,
    // fixed: 'right'
  },
  {
    prop: 'fixedPhonet',
    isShow: false,
    label: '固话'
    // width: 180,
    // fixed: 'right'
  },
  {
    prop: 'workCompany',
    isShow: false,
    label: '工作单位'
    // width: 180,
    // fixed: 'right'
  },
  {
    prop: 'driverCity',
    isShow: false,
    label: '司机城市名称'
    // width: 180,
    // fixed: 'right'
  },
  {
    prop: 'homeAddresst',
    isShow: false,
    label: '地址'
    // width: 180,
    // fixed: 'right'
  },
  {
    prop: 'identificationNumber',
    isShow: true,
    label: '身份证号'
    // width: 180,
    // fixed: 'right'
  },
  {
    prop: 'driverLicense',
    isShow: false,
    label: '驾驶证'
    // width: 180,
    // fixed: 'right'
  },
  {
    prop: 'validPeriodFrom',
    isShow: false,
    label: '驾驶证有效期自'
    // width: 180,
    // fixed: 'right'
  },
  {
    prop: 'validPeriodTo',
    isShow: false,
    label: '驾驶证有效期至'
    // width: 180,
    // fixed: 'right'
  },
  {
    prop: 'driverLicenseType',
    isShow: false,
    label: '驾驶证类型'
    // width: 180,
    // fixed: 'right'
  },
  {
    prop: 'workLicense',
    isShow: false,
    label: '上岗证'
    // width: 180,
    // fixed: 'right'
  },
  {
    prop: 'workLicenseDueDate',
    isShow: false,
    label: '从业资格证到期日期'
    // width: 180,
    // fixed: 'right'
  },
  {
    prop: 'businessLicenseImgNo',
    isShow: false,
    label: '营业执照号'
    // width: 180,
    // fixed: 'right'
  },
  {
    prop: 'isReportPerson',
    isShow: false,
    label: '是否上传人员信用信息'
    // width: 180,
    // fixed: 'right'
  },
  {
    prop: 'issuingOrganizations',
    isShow: false,
    label: '驾驶证发证机关'
    // width: 180,
    // fixed: 'right'
  },
  {
    prop: 'isReportEnterprise',
    isShow: false,
    label: '是否上传企业'
    // width: 180,
    // fixed: 'right'
  },
  {
    prop: 'workLicenseProvinceName',
    isShow: false,
    label: '从业资格证办理省份名称'
    // width: 180,
    // fixed: 'right'
  },
  {
    prop: 'authStatus',
    isShow: false,
    label: '审核状态'
    // width: 180,
    // fixed: 'right'
  },
  {
    prop: 'isFreeze',
    isShow: false,
    label: '是否冻结'
    // width: 180,
    // fixed: 'right'
  },
  {
    prop: 'createCode',
    isShow: false,
    label: '创建人'
    // width: 180,
    // fixed: 'right'
  },
  {
    prop: 'updateCode',
    isShow: false,
    label: '修改人'
    // width: 180,
    // fixed: 'right'
  },
  {
    prop: 'createTime',
    isShow: false,
    label: '创建时间'
    // width: 180,
    // fixed: 'right'
  },
  {
    prop: 'edit',
    isShow: false,
    label: '操作',
    width: 180,
    fixed: 'right'
  }
];

const tableColumnsConfig_listInfo = [
  {
    prop: 'branchCode',
    isShow: true,
    label: '网点编码'
    // width: 180,
    // fixed: 'right'
  },
  {
    prop: 'name',
    isShow: true,
    label: '调度者名称'
    // width: 180,
    // fixed: 'right'
  },
  {
    prop: 'teamLeader',
    isShow: true,
    label: '管理者名称'
    // width: 180,
    // fixed: 'right'
  },
  {
    prop: 'isDel',
    isShow: true,
    label: '是否删除'
    // width: 180,
    // fixed: 'right'
  },
  {
    prop: 'status',
    isShow: true,
    label: '状态'
    // width: 180,
    // fixed: 'right'
  },
  {
    prop: 'createCode',
    isShow: false,
    label: '创建人'
    // width: 180,
    // fixed: 'right'
  },
  {
    prop: 'updateCode',
    isShow: false,
    label: '修改人'
    // width: 180,
    // fixed: 'right'
  },
  {
    prop: 'businessLicenseImg',
    isShow: false,
    label: '营业执照'
    // width: 180,
    // fixed: 'right'
  },
  {
    prop: 'transportPermitImage',
    isShow: false,
    label: '道路运输经营许可证照'
    // width: 180,
    // fixed: 'right'
  },
  {
    prop: 'identificationImage',
    isShow: false,
    label: '身份证正面照片'
    // width: 180,
    // fixed: 'right'
  },
  {
    prop: 'identificationBackImage',
    isShow: false,
    label: '身份证国徽面'
    // width: 180,
    // fixed: 'right'
  },
  {
    prop: 'edit',
    isShow: false,
    label: '操作',
    width: 180,
    fixed: 'right'
  }
];


export default {
  name: 'OpenDialog',

  props: {
    dispatch: {
      type: Object,
      required: true
    }
  },

  data() {
    return {
      // tab
      activeName: 'listDriver',
      // 遮罩层
      loading: false,
      // 多选
      ids: [],
      // 总条数
      total_listDriver: 0,
      total_listInfo: 0,
      // 查询参数
      // 表格数据
      list_listDriver: [],
      queryParams_listDriver: {
        pageNum: 1,
        pageSize: 10
      },
      list_listInfo: [],
      queryParams_listInfo: {
        pageNum: 1,
        pageSize: 10
      },
      // 表头动态值
      tableColumnsConfig_listDriver,
      tableColumnsConfig_listInfo
    };
  },
  computed: {
    list() {
      return this['list_' + this.activeName];
    },
    queryParams() {
      return this['queryParams_' + this.activeName];
    },
    tableColumnsConfig() {
      return this['tableColumnsConfig_' + this.activeName];
    },
    total() {
      return this['total_' + this.activeName];
    }
  },
  created() {
    this.getList();
  },

  methods: {
    /** 查询【请填写功能名称】列表 */
    getList() {
      this.loading = true;

      apiFn[this.activeName](this.queryParams).then(response => {
        this['list_' + this.activeName] = response.rows;
        this['total_' + this.activeName] = response.total;
        this.loading = false;
      }).catch(() => {
        this.loading = false;
      });
    },
    /** 搜索按钮操作 */
    handleQuery() {
      // this.queryParams.pageNum = 1;
    },
    /** 重置按钮操作 */
    resetQuery() {
      // this.resetForm('queryForm');
      // this.handleQuery();
    },

    handleUpdate() {

    },

    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.code);
    },

    _ok(bool) {
      if (bool) {
        const orderSpecifiedList = this.ids.map(e => {
          if (this.activeName === 'listDriver') {
            return {
              'driverInfoCode': e,
              'teamInfoCode': '',
              'userType': 2
            };
          } else {
            return {
              'driverInfoCode': '',
              'teamInfoCode': e,
              'userType': 1
            };
          }
        });

        const data = {
          'oderCode': this.dispatch.code,
          orderSpecifiedList
        };


        dispatchOrder(data).then(res => {
          console.log(res);
          this.msgSuccess('派发成功!');
          this.$emit('_ok', false);
        });
      } else {
        this.$emit('_ok', false);
      }
    }


  }
};
</script>

<style>

</style>
