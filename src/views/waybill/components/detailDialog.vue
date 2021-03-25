<template>
  <el-dialog class="waybill-detail-dialog" :title="title" :visible="visible" width="1200px" append-to-body @close="cancel">
    <el-form ref="form" :model="form" :rules="rules" :disabled="disable" label-width="160px">
      <el-tabs v-model="activeTab">
        <!-- 运单 -->
        <el-tab-pane label="运单" name="1">
          <el-divider content-position="left" class="m40">
            <h5 class="g-title-medium">运单</h5>
          </el-divider>
          <el-form-item label="运输单号" prop="waybillNo">
            <el-input v-model="form.waybillNo" placeholder="" class="input-width" />
          </el-form-item>
          <el-form-item label="运单状态">
            <el-radio-group v-model="form.status">
              <el-radio
                v-for="dict in statusOptions"
                :key="dict.dictValue"
                :label="dict.dictValue"
              >{{ dict.dictLabel }}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="装车重量" prop="loadWeight">
            <el-input v-model="form.loadWeight" placeholder="" class="input-width" />
          </el-form-item>
          <!-- <el-form-item label="货品类别" prop="goodsBigType">
            <el-input v-model="form.goodsBigType" placeholder="" />
          </el-form-item> -->
          <el-form-item label="装货时间" prop="fillTime">
            <el-date-picker
              v-model="form.fillTime"
              class="input-width"
              clearable
              type="date"
              value-format="yyyy-MM-dd"
              placeholder=""
            />
          </el-form-item>
          <el-form-item label="签收时间" prop="signTime">
            <el-date-picker
              v-model="form.signTime"
              class="input-width"
              clearable
              type="date"
              value-format="yyyy-MM-dd"
              placeholder=""
            />
          </el-form-item>
          <el-form-item label="货主备注" prop="shipperRemark">
            <el-input v-model="form.shipperRemark" placeholder="" class="input-width" />
          </el-form-item>
          <el-divider content-position="left" class="m40">
            <h5 class="g-title-medium">地址</h5>
          </el-divider>
          <el-form-item label="装货地址" prop="loadAddress">
            <el-input v-model="form.loadAddress" placeholder="" class="input-width" />
          </el-form-item>
          <el-form-item label="卸货地址" prop="unloadAddress">
            <el-input v-model="form.unloadAddress" placeholder="" class="input-width" />
          </el-form-item>
          <el-divider content-position="left" class="m40">
            <h5 class="g-title-medium">费用</h5>
          </el-divider>
          <el-form-item label="运费单价" prop="freightPrice">
            <el-input v-model="form.freightPrice" placeholder="" class="input-width" />
          </el-form-item>
        </el-tab-pane>
        <!-- 回单 -->
        <el-tab-pane label="回单" name="2">
          <el-divider content-position="left" class="m40">
            <h5 class="g-title-medium">装货单</h5>
          </el-divider>
          <el-form-item label="回单确认状态" prop="isSplit">
            <el-select
              v-model="form.isReturn"
              class="input-width"
              placeholder=""
              clearable
            >
              <el-option
                v-for="dict in isReturnOptions"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="回单确认时间" prop="returnRemarkTime">
            <el-date-picker
              v-model="form.returnRemarkTime"
              class="input-width"
              clearable
              type="date"
              value-format="yyyy-MM-dd"
              placeholder=""
            />
          </el-form-item>
          <el-form-item label="回单确认备注" prop="returnRemark">
            <el-input v-model="form.returnRemark" type="textarea" placeholder="" class="input-width" />
          </el-form-item>
          <el-form-item label="回单照片" prop="receiptImg">
            <img src="" style="width: 200px; height: 200px">
          </el-form-item>
          <el-divider content-position="left" class="m40">
            <h5 class="g-title-medium">卸货单</h5>
          </el-divider>
        </el-tab-pane>
        <!-- 轨迹 -->
        <el-tab-pane label="轨迹" name="3">
          <el-divider content-position="left" class="m40">
            <h5 class="g-title-medium">运单轨迹</h5>
          </el-divider>
        </el-tab-pane>
        <!-- 评价 -->
        <el-tab-pane label="评价" name="4">
          <el-divider content-position="left" class="m40">
            <h5 class="g-title-medium">评价</h5>
          </el-divider>
          <el-row>
            <el-col :span="12">
              司机评价货主
            </el-col>
            <el-col :span="12">
              货主评价司机
            </el-col>
          </el-row>
        </el-tab-pane>
      </el-tabs>

      <!-- <el-row>
        <el-col :span="12">
          <el-form-item label="调度单号" prop="dispatchOrderCode">
            <el-input v-model="form.dispatchOrderCode" placeholder="" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="实际承运人" prop="drvierCode">
            <el-input v-model="form.drvierCode" placeholder="" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="实际承运车辆" prop="vehicleCode">
            <el-input v-model="form.vehicleCode" placeholder="" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="接单时间" prop="receiveTime">
            <el-date-picker
              v-model="form.receiveTime"
              clearable
              type="date"
              value-format="yyyy-MM-dd"
              placeholder=""
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="结算时间" prop="settleTime">
            <el-date-picker
              v-model="form.settleTime"
              clearable
              type="date"
              value-format="yyyy-MM-dd"
              placeholder=""
            />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="与司机结账时间" prop="payTime">
            <el-date-picker
              v-model="form.payTime"
              clearable
              type="date"
              value-format="yyyy-MM-dd"
              placeholder=""
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="标记打款时间" prop="markTime">
            <el-date-picker
              v-model="form.markTime"
              clearable
              type="date"
              value-format="yyyy-MM-dd"
              placeholder=""
            />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="标记打款状态">
            <el-radio-group v-model="form.isMarkStatus">
              <el-radio
                v-for="dict in isMarkStatusOptions"
                :key="dict.dictValue"
                :label="dict.dictValue"
              >{{ dict.dictLabel }}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="月结订单结算状态">
            <el-radio-group v-model="form.monthlySettlementStatus">
              <el-radio
                v-for="dict in monthlySettlementStatusOptions"
                :key="dict.dictValue"
                :label="dict.dictValue"
              >{{ dict.dictLabel }}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="打印时间" prop="prinTime">
            <el-date-picker
              v-model="form.prinTime"
              clearable
              type="date"
              value-format="yyyy-MM-dd"
              placeholder=""
            />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="司机取消订单">
            <el-radio-group v-model="form.cancelStatus">
              <el-radio
                v-for="dict in cancelStatusOptions"
                :key="dict.dictValue"
                :label="dict.dictValue"
              >{{ dict.dictLabel }}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="司机取消理由" prop="driverApplyRemark">
            <el-input v-model="form.driverApplyRemark" type="textarea" placeholder="" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="货主处理司机申请取消备注" prop="shipperDealRemark">
            <el-input v-model="form.shipperDealRemark" type="textarea" placeholder="" />
          </el-form-item>
        </el-col>
      </el-row> -->
    </el-form>
  </el-dialog>
</template>

<script>
import { getDetail } from '@/api/waybill/manages';
export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    open: Boolean,
    currentId: {
      type: String,
      default: null
    },
    disable: Boolean
  },
  data() {
    return {
      activeTab: '1',
      // 是否字典
      isOptions: [
        { dictLabel: '否', dictValue: 0 },
        { dictLabel: '是', dictValue: 1 }
      ],
      // 是否结算字典
      isSettleOptions: [
        { dictLabel: '未结算', dictValue: 0 },
        { dictLabel: '已结算', dictValue: 1 }
      ],
      // 回单确认状态字典
      isReturnOptions: [
        { dictLabel: '未标记回单', dictValue: 0 },
        { dictLabel: '已标记回单', dictValue: 1 }
      ],
      // 支付给司机运费状态字典
      isPayOptions: [
        { dictLabel: '未支付', dictValue: 0 },
        { dictLabel: '已支付字典', dictValue: 1 }
      ],
      // 标记打款状态字典
      isMarkStatusOptions: [
        { dictLabel: '未打款', dictValue: 0 },
        { dictLabel: '已打款', dictValue: 1 },
        { dictLabel: '打款处理中', dictValue: 2 }
      ],
      // 月结订单结算状态字典
      monthlySettlementStatusOptions: [
        { dictLabel: '未结算', dictValue: 0 },
        { dictLabel: '已结算', dictValue: 1 }
      ],
      // 给超载的子单排序用字典
      childSortOptions: [
        { dictLabel: '车辆核载装货重量的子单', dictValue: 1 },
        { dictLabel: '其余重量子单', dictValue: 2 }
      ],
      // 是否删除字典
      isDelOptions: [
        { dictLabel: '正常', dictValue: 0 },
        { dictLabel: '删除', dictValue: 1 }
      ],
      // 运单状态字典
      statusOptions: [
        { dictLabel: '未接单', dictValue: 0 },
        { dictLabel: '已接单', dictValue: 1 },
        { dictLabel: '已签收', dictValue: 2 },
        { dictLabel: '已回单', dictValue: 3 },
        { dictLabel: '已结算', dictValue: 4 },
        { dictLabel: '已打款', dictValue: 5 }
      ],
      // 司机取消订单字典
      cancelStatusOptions: [
        { dictLabel: '正常', dictValue: 0 },
        { dictLabel: '司机撤单申请', dictValue: 1 },
        { dictLabel: '货主同意撤销', dictValue: 2 },
        { dictLabel: '货主拒绝撤销', dictValue: 3 }
      ],
      // 表单参数
      form: {},
      // 表单校验
      rules: {}
    };
  },
  computed: {
    visible: {
      get() {
        return this.open;
      },
      set(v) {
        this.$emit('update:open', v);
      }
    }
  },
  watch: {
    open(val) {
      if (val) {
        this.reset();
        this.getDetail();
      }
    }
  },
  create() {

  },
  methods: {
    // 是否接单字典翻译
    isReceiveFormat(row, column) {
      return this.selectDictLabel(this.isOptions, row.isReceive);
    },
    // 是否装货字典翻译
    isFillFormat(row, column) {
      return this.selectDictLabel(this.isOptions, row.isFill);
    },
    // 是否签收字典翻译
    isSignFormat(row, column) {
      return this.selectDictLabel(this.isOptions, row.isSign);
    },
    // 是否结算字典翻译
    isSettleFormat(row, column) {
      return this.selectDictLabel(this.isSettleOptions, row.isSettle);
    },
    // 回单确认状态字典翻译
    isReturnFormat(row, column) {
      return this.selectDictLabel(this.isReturnOptions, row.isReturn);
    },
    // 支付给司机运费状态字典翻译
    isPayFormat(row, column) {
      return this.selectDictLabel(this.isPayOptions, row.isPay);
    },
    // 标记打款状态字典翻译
    isMarkStatusFormat(row, column) {
      return this.selectDictLabel(this.isMarkStatusOptions, row.isMarkStatus);
    },
    // 运单是否已打印字典翻译
    isPrintOrderFormat(row, column) {
      return this.selectDictLabel(this.isOptions, row.isPrintOrder);
    },
    // 是否批量接单订单字典翻译
    isMultiOrderFormat(row, column) {
      return this.selectDictLabel(this.isOptions, row.isMultiOrder);
    },
    // 是否使用保证金字典翻译
    isCashFormat(row, column) {
      return this.selectDictLabel(this.isOptions, row.isCash);
    },
    // 月结订单结算状态字典翻译
    monthlySettlementStatusFormat(row, column) {
      return this.selectDictLabel(this.monthlySettlementStatusOptions, row.monthlySettlementStatus);
    },
    // 是否子单字典翻译
    isChildFormat(row, column) {
      return this.selectDictLabel(this.isOptions, row.isChild);
    },
    // 给超载的子单排序用字典翻译
    childSortFormat(row, column) {
      return this.selectDictLabel(this.childSortOptions, row.childSort);
    },
    // 是否删除字典翻译
    isDelFormat(row, column) {
      return this.selectDictLabel(this.isDelOptions, row.isDel);
    },
    // 运单状态字典翻译
    statusFormat(row, column) {
      return this.selectDictLabel(this.statusOptions, row.status);
    },
    // 司机取消订单字典翻译
    cancelStatusFormat(row, column) {
      return this.selectDictLabel(this.cancelStatusOptions, row.cancelStatus);
    },
    // 获取运单详情
    getDetail() {
      getDetail(this.currentId).then(response => {
        this.form = response.data;
      });
    },
    // 取消按钮
    cancel() {
      this.close();
      this.reset();
    },
    // 关闭弹窗
    close() {
      this.$emit('update:open', false);
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        code: null,
        orderCode: null,
        goodsCode: null,
        waybillNo: null,
        dispatchOrderCode: null,
        drvierCode: null,
        vehicleCode: null,
        loadWeight: null,
        unloadWeight: null,
        wastage: null,
        isReceive: null,
        receiveTime: null,
        isFill: null,
        fillTime: null,
        isSign: null,
        signTime: null,
        isSettle: null,
        settleTime: null,
        isReturn: null,
        returnRemarkTime: null,
        returnRemark: null,
        isPay: null,
        payTime: null,
        isMarkStatus: '0',
        markTime: null,
        isPrintOrder: null,
        prinTime: null,
        isMultiOrder: null,
        isCash: null,
        cashDeposit: null,
        shipperDeliveryFee: null,
        monthlySettlementStatus: '0',
        isChild: null,
        childSort: null,
        isDel: null,
        status: '0',
        createCode: null,
        createTime: null,
        updateCode: null,
        updateTime: null,
        weight: null,
        cancelStatus: '0',
        driverApplyRemark: null,
        shipperDealRemark: null
      };
      this.resetForm('form');
    }
  }
};
</script>

<style lang="scss">
.waybill-detail-dialog{
  .el-dialog__body{
    padding: 10px 20px 30px !important;
  }
}
</style>
<style lang="scss" scoped>
.mr3{
  margin-right: 3%;
}
.input-width{
  width: 60%;
}
.mb{
  margin-bottom: 22px;
}
.m40{
  margin: 40px 0;
}
</style>>
