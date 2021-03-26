<template>
  <el-dialog class="waybill-detail-dialog" :title="title" :visible="visible" width="1200px" append-to-body @close="cancel">
    <el-tabs v-model="activeTab">
      <!-- 运单 -->
      <el-tab-pane label="运单" name="1">
        <el-divider content-position="left" class="m40">
          <h5 class="g-title-medium">运单</h5>
        </el-divider>
        <el-row>
          <el-col :span="12">
            <label>运单单号</label>
            {{ form.waybillNo }}
          </el-col>
          <el-col :span="12">
            <label>运单状态</label>
            {{ form.status }}
          </el-col>
          <el-col :span="12">
            <label>装货重量(吨)</label>
            {{ form.loadWeight }}
          </el-col>
          <el-col :span="12">
            <label>货品类别</label>
            {{ form.goodsBigType }}
          </el-col>
          <el-col :span="12">
            <label>装货日期</label>
            {{ form.fillTime }}
          </el-col>
          <el-col :span="12">
            <label>卸货日期</label>
            {{ form.signTime }}
          </el-col>
          <el-col :span="12">
            <label>货主备注</label>
            {{ form.shipperRemark }}
          </el-col>
        </el-row>
        <el-divider content-position="left" class="m40">
          <h5 class="g-title-medium">地址</h5>
        </el-divider>
        <el-row>
          <el-col :span="12">
            <label>装货地址</label>
            {{ form.loadAddress?form.loadAddress.formattedAddress:'' }}
            {{ form.loadAddress?form.loadAddress.contact:'' }}
            {{ form.loadAddress?form.loadAddress.contactPhone:'' }}
          </el-col>
          <el-col :span="12">
            <label>卸货地址</label>
            {{ form.unloadAddress?form.unloadAddress.formattedAddress:'' }}
            {{ form.loadAddress?form.unloadAddress.contact:'' }}
            {{ form.loadAddress?form.unloadAddress.contactPhone:'' }}
          </el-col>
          <el-col :span="12">
            <label>上传装货位置</label>
          </el-col>
          <el-col :span="12">
            <label>上传卸货位置</label>
          </el-col>
        </el-row>
        <el-divider content-position="left" class="m40">
          <h5 class="g-title-medium">费用</h5>
        </el-divider>
        <el-row>
          <el-col :span="12">
            <label>实收现金（元）</label>
            {{ form.balanceVo.deliveryCashFee }}
          </el-col>
          <el-col :span="12">
            <label>应收运费（元）</label>
            {{ form.balanceVo.deliveryFeeDeserved }}
          </el-col>
          <el-col :span="12">
            <label>实收运费（元）</label>
            {{ form.balanceVo.deliveryFeePractical }}
          </el-col>
          <el-col :span="12">
            <label>服务费</label>
            {{ form.balanceVo.serviceFee }}
          </el-col>
          <el-col :span="12">
            <label>服务税费</label>
            {{ form.balanceVo.serviceTaxFee }}
          </el-col>
          <el-col :span="12">
            <label>不含税价</label>
            {{ form.balanceVo.taxFreeFee }}
          </el-col>
          <el-col :span="12">
            <label>纳税金额</label>
            {{ form.balanceVo.taxPayment }}
          </el-col>
        </el-row>
      </el-tab-pane>
      <!-- 回单 -->
      <el-tab-pane label="回单" name="2">
        <el-divider content-position="left" class="m40">
          <h5 class="g-title-medium">装货单</h5>
        </el-divider>
        <el-row>
          <el-col :span="12">
            <label>装货签到时间</label>
            {{ formAttachment.cargoTime }}
          </el-col>
          <el-col :span="12">
            <label>装货重量（吨）</label>
            {{ formAttachment.loadWeight }}
          </el-col>
          <el-col :span="12">
            <label>装货签照片</label>
            <img src="" style="width: 200px; height: 200px">
          </el-col>
        </el-row>
        <el-divider content-position="left" class="m40">
          <h5 class="g-title-medium">卸货单</h5>
        </el-divider>
        <el-row>
          <el-col :span="12">
            <label>卸货签到时间</label>
            {{ formAttachmentUp.cargoTime }}
          </el-col>
          <el-col :span="12">
            <label>卸货重量（吨）</label>
            {{ formAttachmentUp.loadWeight }}
          </el-col>
          <el-col :span="12">
            <label>卸货签照片</label>
            <img src="" style="width: 200px; height: 200px">
          </el-col>
        </el-row>
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
            <label>司机评价货主</label>
            {{ formCommentDriver.content }}
          </el-col>
          <el-col :span="12">
            <label>货主评价司机</label>
            {{ formCommentShipment.content }}
          </el-col>
        </el-row>
      </el-tab-pane>
    </el-tabs>
  </el-dialog>
</template>

<script>
import { getWayBill, getWaybillAttachment, getWaybillComment } from '@/api/waybill/manages';
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
      form: {
        loadAddress: {},
        unloadAddress: {},
        balanceVo: {}
      },
      formAttachment: {},
      formAttachmentUp: {},
      formCommentDriver: {},
      formCommentShipment: {}
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
      // 运单
      getWayBill(this.currentId).then(response => {
        this.form = response.data || {};
      });
      // 回单-装货
      getWaybillAttachment(this.currentId, 1).then(response => {
        this.formAttachment = response.data ? response.data[0] : {};
      });
      // 回单-卸货
      getWaybillAttachment(this.currentId, 2).then(response => {
        this.formAttachmentUp = response.data ? response.data[0] : {};
      });
      // 评价-司机
      getWaybillComment(this.currentId, 1).then(response => {
        this.formCommentDriver = response.data ? response.data[0] : {};
      });
      // 评价-货主
      getWaybillComment(this.currentId, 0).then(response => {
        this.formCommentShipment = response.data ? response.data[0] : {};
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
        loadAddress: {},
        unloadAddress: {},
        balanceVo: {}
      };
      this.formAttachment = {};
      this.formAttachmentUp = {};
      this.formCommentDriver = {};
      this.formCommentShipment = {};
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
