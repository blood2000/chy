<template>
  <el-form ref="form" :model="form" label-width="130px">
    <el-row :gutter="30" class="container">
      <el-col :span="6" class="bg" style="height: 100%">
        <el-form-item label="索票批次号" prop="askForNo">
          <el-input v-model="form.askForNo" disabled placeholder="暂无" clearable size="small" style="width:90%;" />
        </el-form-item>
        <el-form-item label="总开具票务数" prop="invoiceCount">
          <el-input v-model="form.invoiceCount" disabled placeholder="暂无" clearable size="small" style="width:90%;" />
        </el-form-item>
        <el-form-item label="总运单结算金额" prop="totalDeliveryFeeDeserved">
          <el-input v-model="form.totalDeliveryFeeDeserved" disabled :precision="2" placeholder="暂无" clearable size="small" style="width:90%;" />
        </el-form-item>
        <el-form-item label="服务费结算金额" prop="totalServiceFee">
          <el-input v-model="form.totalServiceFee" disabled :precision="2" placeholder="暂无" clearable size="small" style="width:90%;" />
        </el-form-item>
        <!-- <img v-viewer :src="form.invoiceInfoGroupVos[0].invoiceImg" class="img-box"> -->
        <img v-for="(img, index) in form.invoiceImgUrl" :key="index" v-viewer :src="img" class="img-box">
        <el-row :gutter="10">
          <el-col :span="1.5">
            <el-button
              v-if="hasFreightInvoice && !hasServiceInvoice"
              type="primary"
              icon="el-icon-download"
              size="mini"
              @click="handleExportFreight"
            >导出运费明细</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              v-if="hasServiceInvoice"
              type="primary"
              icon="el-icon-download"
              size="mini"
              @click="handleExportService"
            >导出服务费明细</el-button>
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="18">
        <el-row :gutter="10" class="bg" style="margin: 0 !important">
          <el-col :span="8">
            <el-form-item label="托运方：" prop="invoiceTitle" style="margin-bottom: 0">
              <span>{{ form.invoiceTitle }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="承运方：" prop="companyName" style="margin-bottom: 0">
              <span>{{ companyName }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="结算时间:" prop="invoiceApplyTime" style="margin-bottom: 0">
              <span>{{ parseTime(form.invoiceApplyTime, '{y}-{m}-{d}') }}</span>
            </el-form-item>
          </el-col>
        </el-row>

        <div class="bg-info">
          <div class="header">开票信息</div>
          <div style="margin-top: 20px">
            <el-row :gutter="10">
              <el-col :span="8">
                <el-form-item label="纳税人识别号" prop="taxRegistration">
                  <el-input v-model="form.shipmentInvoiceInfoVo.taxRegistration" disabled placeholder="暂无" clearable size="small" style="width: 230px" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="注册地址" prop="registrationAddrtion">
                  <el-input v-model="form.shipmentInvoiceInfoVo.registrationAddrtion" disabled placeholder="暂无" clearable size="small" style="width: 230px" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="注册电话" prop="registrationTelphone">
                  <el-input v-model="form.shipmentInvoiceInfoVo.registrationTelphone" disabled placeholder="暂无" clearable size="small" style="width: 230px" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="10">
              <el-col :span="8">
                <el-form-item label="开户行" prop="openBankName">
                  <el-input v-model="form.shipmentInvoiceInfoVo.openBankName" disabled placeholder="暂无" clearable size="small" style="width: 230px" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="账号" prop="openBankNumber">
                  <el-input v-model="form.shipmentInvoiceInfoVo.openBankNumber" disabled placeholder="暂无" clearable size="small" style="width: 230px" />
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </div>

        <div class="bg-info">
          <div class="header">结算信息</div>
          <div style="padding:20px">
            <el-table v-loading="loading" highlight-current-row :data="invoicelist" border>
              <el-table-column label="装货地" width="120" align="center" prop="invoiceInfoStatisticsVo.loadFormattedAddress" show-overflow-tooltip />
              <el-table-column label="卸货地" width="120" align="center" prop="invoiceInfoStatisticsVo.unloadFormattedAddress" show-overflow-tooltip />
              <el-table-column width="120" label="货物大类" align="center" prop="invoiceInfoStatisticsVo.goodsBigTypeName" show-overflow-tooltip />
              <el-table-column width="120" label="装货车数" align="center" prop="invoiceInfoStatisticsVo.wayBillCount" />
              <el-table-column width="100" label="装车数量" align="center">
                <template #default="scope">
                  <span v-show="scope.row.invoiceInfoStatisticsVo.stowageStatus === '0'">
                    {{ fixed(scope.row.invoiceInfoStatisticsVo.loadWeight) }}(吨)
                  </span>
                  <span v-show="scope.row.invoiceInfoStatisticsVo.stowageStatus === '1'">
                    {{ fixed(scope.row.invoiceInfoStatisticsVo.loadWeight) }}(方)
                  </span>
                  <span v-show="scope.row.invoiceInfoStatisticsVo.stowageStatus === '2'">
                    {{ Math.floor(scope.row.invoiceInfoStatisticsVo.loadWeight) }}(车)
                  </span>
                </template>
              </el-table-column>
              <el-table-column width="120" label="结算数量" align="center">
                <template #default="scope">
                  <span v-show="scope.row.invoiceInfoStatisticsVo.stowageStatus === '0'">
                    {{ fixed(scope.row.invoiceInfoStatisticsVo.unloadWeight) }}(吨)
                  </span>
                  <span v-show="scope.row.invoiceInfoStatisticsVo.stowageStatus === '1'">
                    {{ fixed(scope.row.invoiceInfoStatisticsVo.unloadWeight) }}(方)
                  </span>
                  <span v-show="scope.row.invoiceInfoStatisticsVo.stowageStatus === '2'">
                    {{ Math.floor(scope.row.invoiceInfoStatisticsVo.unloadWeight) }}(车)
                  </span>
                </template>
              </el-table-column>
              <el-table-column width="120" label="发票类型" align="center" prop="invoiceType" :formatter="invoiceTypeFormatter" />
              <el-table-column width="120" label="开票金额" align="center" prop="amount">
                <template #default="scope">
                  <span>{{ floor(scope.row.amount) }}</span>
                </template>
              </el-table-column>
              <el-table-column width="150" label="司机实收金额" align="center" prop="invoiceInfoStatisticsVo.totalDeliveryCashFee">
                <template #default="scope">
                  <span>{{ floor(scope.row.invoiceInfoStatisticsVo.totalDeliveryCashFee) }}</span>
                </template>
              </el-table-column>
              <el-table-column width="120" label="服务费金额" align="center" prop="invoiceInfoStatisticsVo.totalServiceFee">
                <template #default="scope">
                  <span>{{ floor(scope.row.invoiceInfoStatisticsVo.totalServiceFee) }}</span>
                </template>
              </el-table-column>
              <el-table-column width="120" label="留存运费" align="center" prop="invoiceInfoStatisticsVo.totalTaxPayment">
                <template #default="scope">
                  <span>{{ floor(scope.row.invoiceInfoStatisticsVo.totalTaxPayment) }}</span>
                </template>
              </el-table-column>
              <el-table-column width="120" label="货主实付金额" align="center" prop="invoiceInfoStatisticsVo.totalShipperRealPay">
                <template #default="scope">
                  <span>{{ floor(scope.row.invoiceInfoStatisticsVo.totalShipperRealPay) }}</span>
                </template>
              </el-table-column>
              <el-table-column fixed="left" label="运单明细" align="center" width="100">
                <template #default="scope">
                  <el-button type="text" size="small" icon="el-icon-document-checked" @click="handleClick(scope.row)">详情</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>

      </el-col>
    </el-row>
    <!-- 运单详情 对话框 -->
    <waybill-dialog ref="WaybillDialog" :currentid="currentId" :title="title" :open.sync="open" />
  </el-form>
</template>

<script>
import { getDetail, countByShipmentCode } from '@/api/finance/list';
// 运单详情弹窗
import WaybillDialog from './waybillDialog';

export default {
  name: 'Statement',
  components: {
    WaybillDialog
  },
  data() {
    return {
      // 遮罩层
      loading: false,
      // 弹框 内容
      visible: false,
      open: false,
      title: '',
      // 当前选中的运单id
      currentId: null,
      // 表单参数
      form: {
        invoiceImgUrl: [],
        invoiceInfoGroupVos: [],
        shipmentInvoiceInfoVo: {}
      },
      // 结算列表
      invoicelist: [],
      id: '',
      // 配载方式字典
      stowageStatusOptions: [
        { dictLabel: '吨数配载', dictValue: '0' },
        { dictLabel: '方数配载', dictValue: '1' },
        { dictLabel: '车数配载', dictValue: '1' }
      ],
      // 发票类型字典
      invoiceTypeOptions: [
        { dictLabel: '运费发票', dictValue: '1' },
        { dictLabel: '服务费发票', dictValue: '2' }
      ],
      hasFreightInvoice: true,
      hasServiceInvoice: true,
      companyName: ''
    };
  },
  computed: {
    idCode() {
      return this.$route.query.code;
    }
  },
  watch: {
    idCode(val) {
      if (val) {
        this.getDetail(val);
      }
    }
  },
  created() {
    this.getDetail(this.idCode);
  },
  methods: {
    // 配载方式字典翻译
    stowageStatusFormatter(row, column) {
      console.log(row);
      return this.selectDictLabel(this.stowageStatusOptions, row.invoiceInfoStatisticsVo.stowageStatus);
    },
    // 发票类型字典翻译
    invoiceTypeFormatter(row, column) {
      return this.selectDictLabel(this.invoiceTypeOptions, row.invoiceType);
    },
    // 获取内容信息
    getDetail(val) {
      this.loading = true;
      const that = this;
      getDetail(val).then(response => {
        that.form = response.data;
        console.log(that.form);
        that.invoicelist = [];
        Object.keys(response.data.invoiceGroup).forEach(function(key) {
          that.invoicelist = that.invoicelist.concat(response.data.invoiceGroup[key]);
        });
        // 判断是否有运费发票
        const freightInvoice = that.invoicelist.filter(item => item.invoiceType === '1');
        console.log(freightInvoice);
        if (freightInvoice.length === 0) {
          that.hasFreightInvoice = false;
        } else {
          that.hasFreightInvoice = true;
        }
        console.log(that.hasFreightInvoice);
        // 判断是否有服务费发票
        const serviceInvoice = that.invoicelist.filter(item => item.invoiceType === '2');
        console.log(serviceInvoice);
        if (serviceInvoice.length === 0) {
          that.hasServiceInvoice = false;
        } else {
          that.hasServiceInvoice = true;
        }
        console.log(this.form.shipmentCode);
        countByShipmentCode({ shipmentCode: this.form.shipmentCode }).then(res => {
          that.companyName = res.data;
          // console.log(companyName);
        });
        // console.log(that.hasFreightInvoice);
        // console.log(that.hasServiceInvoice);
        // console.log(that.invoicelist);
        that.loading = false;
      });
    },
    // 关闭弹窗
    close() {
      this.$emit('update:open', false);
    },
    // 导出运费明细
    handleExportFreight() {
      this.download('/transportation/invoiceApply/export', { applyCode: this.form.code, type: 1 }, `运费明细`);
    },
    // 导出服务费明细
    handleExportService() {
      this.download('/transportation/invoiceApply/export2', { applyCode: this.form.code, type: 2 }, `服务费明细(两票制)`);
    },
    // 查看发票里的运单
    handleClick(row) {
      console.log(row);
      this.currentId = row.code;
      this.open = true;
      this.title = '运单明细';
    }
  }
};
</script>

<style lang="scss" scoped>
.mr3 {
  margin-right: 3%;
}
.width90 {
  width: 90%;
}
.width28 {
  width: 28%;
}
.el-input-number ::v-deep.el-input__inner {
  text-align: left;
}
.bg{
  background: #fff;
  padding: 15px;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
.bg-info{
  margin-top:15px;
  background: #fff;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  border-radius: 4px;
}
.container{
  margin: 0 15px 15px !important;
}
.img-box{
  height: 240px;
  width: 100%;
  object-fit: contain;
}
.header {
  padding: 10px 20px;
  position: relative;
  font-weight: 700;
  border-bottom: 0.5px solid #dcdfe6;
  &::before {
    content: "";
    position: absolute;
    width: 2px;
    height: 20px;
    left: 10px;
    // top: 1px;
    background-color: #1890ff;
  }
}
</style>
