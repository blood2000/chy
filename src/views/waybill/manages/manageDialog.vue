<template>
	<el-dialog :title="title" :visible="visible" width="800px" append-to-body @close="cancel">
		<el-form ref="form" :model="form" :rules="rules" label-width="140px">
			<el-form-item label="货源编号" prop="orderCode">
				<el-input v-model="form.orderCode" placeholder="请输入货源编号" />
			</el-form-item>
			<el-form-item label="商品编码" prop="goodsCode">
				<el-input v-model="form.goodsCode" placeholder="请输入商品编码" />
			</el-form-item>
			<el-form-item label="运输单号" prop="waybillNo">
				<el-input v-model="form.waybillNo" placeholder="请输入运输单号" />
			</el-form-item>
			<el-form-item label="调度单号" prop="dispatchOrderCode">
				<el-input v-model="form.dispatchOrderCode" placeholder="请输入调度单号" />
			</el-form-item>
			<el-form-item label="实际承运人" prop="drvierCode">
				<el-input v-model="form.drvierCode" placeholder="请输入实际承运人CODE" />
			</el-form-item>
			<el-form-item label="实际承运车辆" prop="vehicleCode">
				<el-input v-model="form.vehicleCode" placeholder="请输入实际承运车辆CODE" />
			</el-form-item>
			<el-form-item label="接单时间" prop="receiveTime">
				<el-date-picker clearable size="small" style="width: 200px"
					v-model="form.receiveTime"
					type="date"
					value-format="yyyy-MM-dd"
					placeholder="选择接单时间">
				</el-date-picker>
			</el-form-item>
			<el-form-item label="装货时间" prop="fillTime">
				<el-date-picker clearable size="small" style="width: 200px"
					v-model="form.fillTime"
					type="date"
					value-format="yyyy-MM-dd"
					placeholder="选择装货时间">
				</el-date-picker>
			</el-form-item>
			<el-form-item label="签收时间" prop="signTime">
				<el-date-picker clearable size="small" style="width: 200px"
					v-model="form.signTime"
					type="date"
					value-format="yyyy-MM-dd"
					placeholder="选择签收时间">
				</el-date-picker>
			</el-form-item>
			<el-form-item label="结算时间" prop="settleTime">
				<el-date-picker clearable size="small" style="width: 200px"
					v-model="form.settleTime"
					type="date"
					value-format="yyyy-MM-dd"
					placeholder="选择结算时间">
				</el-date-picker>
			</el-form-item>
			<el-form-item label="回单确认时间" prop="returnRemarkTime">
				<el-date-picker clearable size="small" style="width: 200px"
					v-model="form.returnRemarkTime"
					type="date"
					value-format="yyyy-MM-dd"
					placeholder="选择回单确认时间">
				</el-date-picker>
			</el-form-item>
			<el-form-item label="回单确认备注" prop="returnRemark">
				<el-input v-model="form.returnRemark" type="textarea" placeholder="请输入内容" />
			</el-form-item>
			<el-form-item label="与司机结账时间" prop="payTime">
				<el-date-picker clearable size="small" style="width: 200px"
					v-model="form.payTime"
					type="date"
					value-format="yyyy-MM-dd"
					placeholder="选择与司机结账时间">
				</el-date-picker>
			</el-form-item>
			<el-form-item label="标记打款状态">
				<el-radio-group v-model="form.isMarkStatus">
					<el-radio
						v-for="dict in isMarkStatusOptions"
						:key="dict.dictValue"
						:label="dict.dictValue"
					>{{dict.dictLabel}}</el-radio>
				</el-radio-group>
			</el-form-item>
			<el-form-item label="标记打款时间" prop="markTime">
				<el-date-picker clearable size="small" style="width: 200px"
					v-model="form.markTime"
					type="date"
					value-format="yyyy-MM-dd"
					placeholder="选择标记打款时间">
				</el-date-picker>
			</el-form-item>
			<el-form-item label="打印时间" prop="prinTime">
				<el-date-picker clearable size="small" style="width: 200px"
					v-model="form.prinTime"
					type="date"
					value-format="yyyy-MM-dd"
					placeholder="选择打印时间">
				</el-date-picker>
			</el-form-item>
			<el-form-item label="月结订单结算状态">
				<el-radio-group v-model="form.monthlySettlementStatus">
					<el-radio
						v-for="dict in monthlySettlementStatusOptions"
						:key="dict.dictValue"
						:label="dict.dictValue"
					>{{dict.dictLabel}}</el-radio>
				</el-radio-group>
			</el-form-item>
			<el-form-item label="运单状态">
				<el-radio-group v-model="form.status">
					<el-radio
						v-for="dict in statusOptions"
						:key="dict.dictValue"
						:label="dict.dictValue"
					>{{dict.dictLabel}}</el-radio>
				</el-radio-group>
			</el-form-item>
			<el-form-item label="创建人" prop="createCode">
				<el-input v-model="form.createCode" placeholder="请输入创建人" />
			</el-form-item>
			<el-form-item label="修改人" prop="updateCode">
				<el-input v-model="form.updateCode" placeholder="请输入修改人" />
			</el-form-item>
			<el-form-item label="司机取消订单">
				<el-radio-group v-model="form.cancelStatus">
					<el-radio
						v-for="dict in cancelStatusOptions"
						:key="dict.dictValue"
						:label="dict.dictValue"
					>{{dict.dictLabel}}</el-radio>
				</el-radio-group>
			</el-form-item>
			<el-form-item label="司机取消理由" prop="driverApplyRemark">
				<el-input v-model="form.driverApplyRemark" type="textarea" placeholder="请输入内容" />
			</el-form-item>
			<el-form-item label="货主处理司机申请取消备注" prop="shipperDealRemark">
				<el-input v-model="form.shipperDealRemark" type="textarea" placeholder="请输入内容" />
			</el-form-item>
		</el-form>
	</el-dialog>
</template>

<script>
export default {
	props: {
    title: String,
    open: Boolean,
    disable: Boolean
  },
	data() {
		return {
			// 是否字典
			isOptions: [
				{dictLabel: '否', dictValue: 0},
				{dictLabel: '是', dictValue: 1}
			],
      // 是否结算字典
      isSettleOptions: [
				{dictLabel: '未结算', dictValue: 0},
				{dictLabel: '已结算', dictValue: 1}
			],
      // 回单确认状态字典
      isReturnOptions: [
				{dictLabel: '未标记回单', dictValue: 0},
				{dictLabel: '已标记回单', dictValue: 1}
			],
      // 支付给司机运费状态字典
      isPayOptions: [
				{dictLabel: '未支付', dictValue: 0},
				{dictLabel: '已支付字典', dictValue: 1}
			],
      // 标记打款状态字典
      isMarkStatusOptions: [
				{dictLabel: '未打款', dictValue: 0},
				{dictLabel: '已打款', dictValue: 1},
				{dictLabel: '打款处理中', dictValue: 2}
			],
      // 月结订单结算状态字典
      monthlySettlementStatusOptions: [
				{dictLabel: '未结算', dictValue: 0},
				{dictLabel: '已结算', dictValue: 1}
			],
      // 给超载的子单排序用字典
      childSortOptions: [
				{dictLabel: '车辆核载装货重量的子单', dictValue: 1},
				{dictLabel: '其余重量子单', dictValue: 2}
			],
      // 是否删除字典
      isDelOptions: [
				{dictLabel: '正常', dictValue: 0},
				{dictLabel: '删除', dictValue: 1}
			],
      // 运单状态字典
      statusOptions: [
				{dictLabel: '未接单', dictValue: 0},
				{dictLabel: '已接单', dictValue: 1},
				{dictLabel: '已签收', dictValue: 2},
				{dictLabel: '已回单', dictValue: 3},
				{dictLabel: '已结算', dictValue: 4},
				{dictLabel: '已打款', dictValue: 5}
			],
      // 司机取消订单字典
      cancelStatusOptions: [
				{dictLabel: '正常', dictValue: 0},
				{dictLabel: '司机撤单申请', dictValue: 1},
				{dictLabel: '货主同意撤销', dictValue: 2},
				{dictLabel: '货主拒绝撤销', dictValue: 3}
			],
			// 表单参数
      form: {},
      // 表单校验
      rules: {}
		}
	},
	computed: {
    visible: {
      get() {
        return this.open;
      },
      set(v) {
        this.$emit("update:open", v);
      },
    },
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
		/** 取消按钮 */
    cancel() {
      this.close();
      this.reset();
    },
		// 关闭弹窗
    close() {
      this.$emit("update:open", false);
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
        isMarkStatus: "0",
        markTime: null,
        isPrintOrder: null,
        prinTime: null,
        isMultiOrder: null,
        isCash: null,
        cashDeposit: null,
        shipperDeliveryFee: null,
        monthlySettlementStatus: "0",
        isChild: null,
        childSort: null,
        isDel: null,
        status: "0",
        createCode: null,
        createTime: null,
        updateCode: null,
        updateTime: null,
        weight: null,
        cancelStatus: "0",
        driverApplyRemark: null,
        shipperDealRemark: null
      };
      this.resetForm("form");
    },
	}
}
</script>

<style lang="scss" scoped>
.mr3{
  margin-right: 3%;
}
.mb{
  margin-bottom: 22px;
}
.width90{
  width: 90%;
}
.width28{
  width: 28%;
}
</style>>