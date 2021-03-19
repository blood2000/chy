
<template>
  <div class="app-container">
    <el-form
      v-show="showSearch"
      ref="queryForm"
      :model="queryParams"
      :inline="true"
      label-width="80px"
    >
      <el-form-item
        label="下单客户"
        prop="orderClient"
      >
        <el-input
          v-model="queryParams.orderClient"
          placeholder="请输入下单客户"
          clearable
          size="small"
          style="width: 240px"
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
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item
        label="装货信息"
        prop="loadInfo"
      >
        <el-input
          v-model="queryParams.loadInfo"
          placeholder="请输入装货信息"
          clearable
          size="small"
          style="width: 240px"
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
          style="width: 240px"
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
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item
        label="接单日期"
        prop="receiveTime"
      >
        <el-date-picker
          v-model="queryParams.orderStartTime"
          size="small"
          style="width: 113px"
          value-format="yyyy-MM-dd"
          type="date"
          placeholder="开始日期"
          :clearable="false"
        />
        -
        <el-date-picker
          v-model="queryParams.orderEndTime"
          size="small"
          style="width: 113px"
          value-format="yyyy-MM-dd"
          type="date"
          placeholder="结束日期"
          :clearable="false"
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
          style="width: 240px"
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
          style="width: 240px"
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
          style="width: 240px"
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
          style="width: 240px"
          @keyup.enter.native="handleQuery"
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
      <!-- <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
        >批量删除</el-button>
      </el-col> -->
      <el-col :span="1.5" style="marginTop:-5px">
        <tablec-cascader v-model="tableColumnsConfig" />
      </el-col>
      <right-toolbar
        :show-search.sync="showSearch"
        @queryTable="getList"
      />
    </el-row>

    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="待运输" name="1" />
      <el-tab-pane label="运输中" name="2" />
      <el-tab-pane label="已卸货" name="3" />
    </el-tabs>

    <RefactorTable :loading="loading" :data="tracklist" :table-columns-config="tableColumnsConfig"><!-- @selection-change="handleSelectionChange" -->
      <!-- <template #isPay="{row}">
                    <span>{{ selectDictLabel(isPayOptions, row.isPay) }}</span>
                </template> -->

      <template #edit="{row}">
        <el-button
          v-if="activeName == '1'"
          v-hasPermi="['system:menu:edit']"
          size="mini"
          type="text"
          icon="el-icon-truck"
          @click="handleTableBtn(row, 1)"
        >车辆装货</el-button>
        <el-button
          v-if="activeName == '2'"
          v-hasPermi="['system:menu:edit']"
          size="mini"
          type="text"
          icon="el-icon-takeaway-box"
          @click="handleTableBtn(row, 2)"
        >车辆卸货</el-button>
        <el-button
          v-if="activeName == '1'"
          v-hasPermi="['system:menu:edit']"
          size="mini"
          type="text"
          icon="el-icon-circle-close"
          @click="handleTableBtn(row, 3)"
        >取消订单</el-button>
        <el-button
          v-if="activeName != '1'"
          v-hasPermi="['system:menu:edit']"
          size="mini"
          type="text"
          icon="el-icon-notebook-1"
          @click="handleTableBtn(row, 4)"
        >补装货凭证</el-button>
        <el-button
          v-if="activeName == '3'"
          v-hasPermi="['system:menu:edit']"
          size="mini"
          type="text"
          icon="el-icon-notebook-2"
          @click="handleTableBtn(row, 5)"
        >补卸货凭证</el-button>
        <el-button
          v-if="activeName != '1'"
          v-hasPermi="['system:menu:edit']"
          size="mini"
          type="text"
          icon="el-icon-aim"
          @click="handleTableBtn(row, 6)"
        >车辆跟踪</el-button>
        <el-button
          v-hasPermi="['system:menu:edit']"
          size="mini"
          type="text"
          icon="el-icon-location-outline"
          @click="handleTableBtn(row, 7)"
        >定位</el-button>
        <el-button
          v-hasPermi="['system:menu:edit']"
          size="mini"
          type="text"
          icon="el-icon-edit-outline"
          @click="handleTableBtn(row, 8)"
        >投诉</el-button>
        <el-button
          v-if="activeName == '3'"
          v-hasPermi="['system:menu:edit']"
          size="mini"
          type="text"
          icon="el-icon-chat-dot-square"
          @click="handleTableBtn(row, 9)"
        >评价</el-button>
      </template>
    </RefactorTable>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.page"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />




    <!-- 车辆装货 / 补装货凭证 -->
    <dialog-a ref="DialogA" :open.sync="dialoga" :title="titlea" :initdata="dialogadata" @refresh="getList" />
    <!-- 车辆卸货 / 补卸货凭证 -->
    <dialog-c ref="DialogC" :open.sync="dialogc" :title="titlec" :initdata="dialogcdata" @refresh="getList" />
    <!-- 投诉 -->
    <dialog-b ref="DialogB" :open.sync="dialogb" :title="titleb" :initdata="dialogbdata" @refresh="getList" />


    <!-- <el-dialog :title="title" :visible.sync="visible" :width="dialogWidth" append-to-body>
      <div>{{ activeName }}</div>
    </el-dialog> -->

  </div>
</template>

<script>
import tableColumnsConfig from './data/tracklist-index';
import { trackList } from '@/api/waybill/tracklist';
import DialogA from './component/DialogA';
import DialogB from './component/DialogB';
import DialogC from './component/DialogC';

export default {
  'name': 'Tracklist',
  components: { DialogA, DialogB, DialogC },
  data() {
    return {
      tableColumnsConfig,
      activeName: '1',

      // 遮罩层
      'loading': false,
      // 选中数组
      //   'ids': [],
      // 显示搜索条件
      'showSearch': true,
      // 总条数
      'total': 0,
      // 表格数据
      'tracklist': [],

      // 查询参数
      'queryParams': {
        'page': 1,
        'pageSize': 10,
        'orderClient': undefined,
        'deliveryCompany': undefined,
        'loadInfo': undefined,
        'receivedInfo': undefined,
        'mainOrderNumber': undefined,
        'orderEndTime': undefined,
        'orderStartTime': undefined,
        'licenseNumber': undefined,
        'driverName': undefined,
        'driverPhone': undefined,
        'waybillNo': undefined,
        'status': this.activeName
      },
      // 弹框 内容
      visible: false,

      dialoga: false,
      dialogadata: {},
      dialogb: false,
      dialogbdata: {},
      dialogc: false,
      dialogcdata: {},
      titlea: '',
      titleb: '',
      titlec: '',
      title: '',

      dialogWidth: '800px'
      // ne 0 司机 1 货主
    //   driverOrShipmentOptions: [
    //     { 'dictLabel': '司机', 'dictValue': '0' },
    //     { 'dictLabel': '货主', 'dictValue': '1' }
    //   ],
    //   // <!-- isPay	支付给司机运费状态 0-未支付 1-已支付 -->
    //   isPayOptions: [
    //     { 'dictLabel': '未支付', 'dictValue': '0' },
    //     { 'dictLabel': '已支付', 'dictValue': '1' }
    //   ]
    };
  },
  computed: {
    lcokey() {
      return this.$route.name + this.activeName;
    }
  },
  created() {
    // this['tableColumnsConfig' + this.activeName] = this.getLocalStorage(this.lcokey) || this.tableColumnsConfig;
    this.tableColumnsConfig = this.getLocalStorage(this.$route.name) || this.tableColumnsConfig;
    this.getList();
  },
  'methods': {
    /** handleClick */
    handleClick(tab) {
      // this['tableColumnsConfig' + this.activeName] = this.getLocalStorage(this.lcokey) || this.tableColumnsConfig;
      // this.queryParams.status = tab.name;
      this.queryParams.page = 1;
      this.getList();
    },

    /** 查询【请填写功能名称】列表 */
    getList() {
      this.loading = true;
      trackList(this.queryParams).then(response => {
        this.tracklist = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.page = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm('queryForm');
      this.handleQuery();
    },
    /** 修改按钮操作 */
    // handleUpdate(row) {
    //   this.$refs.VehicleDialog.reset();
    //   const id = row.id || this.ids;
    //   getInfo(id).then((response) => {
    //     this.$refs.VehicleDialog.setForm(response.data);
    //     this.open = true;
    //     this.title = '修改车辆';
    //     this.formDisable = false;
    //   });
    // },

    handleTableBtn(row, index) {
      console.log(row, index);

      this.visible = true;
      switch (index) {
        case 1:
          this.$refs.DialogA.reset();
          // const id = row.code;
          this.dialoga = true;
          this.titlea = '车辆装货';
          this.$refs.DialogA.setForm(row);
          break;
        case 2:
          this.$refs.DialogC.reset();
          this.dialogc = true;
          this.titlec = '车辆卸货';
          this.dialogcdata = { ...row, myType: 2 };
          break;
        case 3:
          this.titlea = '取消运单';
          break;
        case 4:
          this.dialoga = true;
          this.titlea = '补装货凭证';
          this.dialogadata = { ...row, myType: 3 };
          break;
        case 5:
          this.dialogc = true;
          this.titlec = '补卸货凭证';
          this.dialogcdata = { ...row, myType: 4 };
          break;
        case 6:
          this.title = '定位';
          break;
        case 7:
          this.title = '车辆跟踪';
          break;
        case 8:
          this.dialogb = true;
          this.titleb = '投诉';
          this.dialogbdata = { ...row, myType: 5 };
          break;
        case 9:
          this.dialogb = true;
          this.dialogbdata = { ...row, myType: 6 };
          console.log(this.dialogbdata);
          this.titleb = '评价';
          break;
        default:
          break;
      }
    }
  }
};
</script>
