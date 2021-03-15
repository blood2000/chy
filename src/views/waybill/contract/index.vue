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
          placeholder="请选择标记打款状态"
          clearable
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

    <!-- table -->
    <!-- <el-table v-loading="loading" :data="contractList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" fixed="left" />
      <el-table-column
        label="货源编号"
        align="center"
        prop="orderCode"
      />
      <el-table-column
        label="商品编码"
        align="center"
        prop="goodsCode"
      />
      <el-table-column
        label="运输单号"
        align="center"
        prop="waybillNo"
      />
      <el-table-column
        label="调度单号"
        align="center"
        prop="dispatchOrderCode"
      />
      <el-table-column
        label="实际承运人"
        align="center"
        prop="drvierCode"
      />
      <el-table-column
        label="实际承运车辆"
        align="center"
        prop="vehicleCode"
      />
      <el-table-column
        label="装车重量"
        align="center"
        prop="loadWeight"
      />
      <el-table-column
        label="卸车重量"
        align="center"
        prop="unloadWeight"
      />
      <el-table-column
        label="货物损耗"
        align="center"
        prop="wastage"
      />
      <el-table-column
        label="是否接单"
        align="center"
        prop="isReceive"
        :formatter="isReceiveFormat"
      />
      <el-table-column
        label="接单时间"
        align="center"
        prop="receiveTime"
        width="180"
      >
        <template slot-scope="scope">
          <span>{{ parseTime(new Date(scope.row.receiveTime), '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="是否装货"
        align="center"
        prop="isFill"
        :formatter="isFillFormat"
      />
      <el-table-column
        label="装货时间"
        align="center"
        prop="fillTime"
        width="180"
      >
        <template slot-scope="scope">
          <span>{{ parseTime(new Date(scope.row.fillTime), '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="是否签收"
        align="center"
        prop="isSign"
        :formatter="isSignFormat"
      />
      <el-table-column
        label="签收时间"
        align="center"
        prop="signTime"
        width="180"
      >
        <template slot-scope="scope">
          <span>{{ parseTime(new Date(scope.row.signTime), '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="是否结算"
        align="center"
        prop="isSettle"
        :formatter="isSettleFormat"
      />
      <el-table-column
        label="结算时间"
        align="center"
        prop="settleTime"
        width="180"
      >
        <template slot-scope="scope">
          <span>{{ parseTime(new Date(scope.row.settleTime), '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="回单确认状态"
        align="center"
        prop="isReturn"
        :formatter="isReturnFormat"
      />
      <el-table-column
        label="回单确认时间"
        align="center"
        prop="returnRemarkTime"
        width="180"
      >
        <template slot-scope="scope">
          <span>{{ parseTime(new Date(scope.row.returnRemarkTime), '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="回单确认备注"
        align="center"
        prop="returnRemark"
      />
      <el-table-column
        label="支付给司机运费状态"
        align="center"
        prop="isPay"
        :formatter="isPayFormat"
      />
      <el-table-column
        label="与司机结账时间"
        align="center"
        prop="payTime"
        width="180"
      >
        <template slot-scope="scope">
          <span>{{ parseTime(new Date(scope.row.payTime), '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="标记打款状态"
        align="center"
        prop="isMarkStatus"
        :formatter="isMarkStatusFormat"
      />
      <el-table-column
        label="标记打款时间"
        align="center"
        prop="markTime"
        width="180"
      >
        <template slot-scope="scope">
          <span>{{ parseTime(new Date(scope.row.markTime), '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="运单是否已打印"
        align="center"
        prop="isPrintOrder"
        :formatter="isPrintOrderFormat"
      />
      <el-table-column
        label="打印时间"
        align="center"
        prop="prinTime"
        width="180"
      >
        <template slot-scope="scope">
          <span>{{ parseTime(new Date(scope.row.prinTime), '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="是否批量接单订单"
        align="center"
        prop="isMultiOrder"
        :formatter="isMultiOrderFormat"
      />
      <el-table-column
        label="是否使用保证金"
        align="center"
        prop="isCash"
        :formatter="isCashFormat"
      />
      <el-table-column
        label="保证金"
        align="center"
        prop="cashDeposit"
      />
      <el-table-column
        label="给货主结算的和展示的每车总费"
        align="center"
        prop="shipperDeliveryFee"
      />
      <el-table-column
        label="月结订单结算状态"
        align="center"
        prop="monthlySettlementStatus"
        :formatter="monthlySettlementStatusFormat"
      />
      <el-table-column
        label="是否子单"
        align="center"
        prop="isChild"
        :formatter="isChildFormat"
      />
      <el-table-column
        label="给超载的子单排序用"
        align="center"
        prop="childSort"
        :formatter="childSortFormat"
      />
      <el-table-column
        label="是否删除"
        align="center"
        prop="isDel"
        :formatter="isDelFormat"
      />
      <el-table-column
        label="运单状态"
        align="center"
        prop="status"
        :formatter="statusFormat"
      />
      <el-table-column
        label="创建人"
        align="center"
        prop="createCode"
      />
      <el-table-column
        label="修改人"
        align="center"
        prop="updateCode"
      />
      <el-table-column
        label="货物重量"
        align="center"
        prop="weight"
      />
      <el-table-column
        label="司机取消订单"
        align="center"
        prop="cancelStatus"
        :formatter="cancelStatusFormat"
      />
      <el-table-column
        label="司机取消理由"
        align="center"
        prop="driverApplyRemark"
      />
      <el-table-column
        label="货主处理司机申请取消备注"
        align="center"
        prop="shipperDealRemark"
      />
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
        fixed="right"
        width="240"
      >
        <template slot-scope="scope">
          <el-button
            v-hasPermi="['waybill:manages:detail']"
            size="mini"
            type="text"
            icon="el-icon-document"
            @click="handleUpdate(scope.row)"
          >
            详情
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-lock"
            @click="handleMark(scope.row)"
          >
            标记异常
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-date"
            @click="handleSeperate(scope.row)"
          >
            分单列表
          </el-button>
          <el-button
            v-hasPermi="['waybill:manages:remove']"
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
          >
            作废运单
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit-outline"
            @click="handleRemarks(scope.row)"
          >
            备注
          </el-button>
        </template>
      </el-table-column>
    </el-table> -->
    <RefactorTable :loading="loading" :data="contractList" :table-columns-config="tableColumnsConfig"><!-- @selection-change="handleSelectionChange" -->
      <template #isPay="{row}">
        <span>{{ selectDictLabel(isPayOptions, row.isPay) }}</span>
      </template>

      <template #edit="{row}">
        <el-button
          v-hasPermi="['system:menu:edit']"
          size="mini"
          type="text"
          icon="el-icon-edit"
          @click="handleInfo(row)"
        >打印</el-button>
      </template>
    </RefactorTable>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.page"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 生成电子合同 -->
    <el-dialog :title="title" :visible.sync="visible" width="800px" append-to-body>
      <div>123</div>
    </el-dialog>

  </div>
</template>

<script>
import tableColumnsConfig from './config';

import { listContract, getContract } from '@/api/waybill/contract';

export default {
  'name': 'Contract',
  data() {
    return {
      tableColumnsConfig,
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
        'page': 1,
        'pageSize': 10,
        contractNo: undefined,
        driverInfo: undefined,
        driverOrShipment: undefined
      },
      // 弹框 内容
      visible: false,
      title: '',
      // ne 0 司机 1 货主
      driverOrShipmentOptions: [
        { 'dictLabel': '司机', 'dictValue': '0' },
        { 'dictLabel': '货主', 'dictValue': '1' }
      ],
      // <!-- isPay	支付给司机运费状态 0-未支付 1-已支付 -->
      isPayOptions: [
        { 'dictLabel': '未支付', 'dictValue': '0' },
        { 'dictLabel': '已支付', 'dictValue': '1' }
      ]
    };
  },
  created() {
    this.tableColumnsConfig = this.getLocalStorage(this.$route.name) || this.tableColumnsConfig;
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
      this.queryParams.page = 1;
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
    handleInfo(row) {
      this.visible = true;
      this.title = '电子合同';
      console.log(row.id);

      getContract(row.id).then(res => {
        console.log(res);
      });
    }
  }
};
</script>
