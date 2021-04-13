<template>
  <!-- 开票对话框 -->
  <el-dialog :title="title" :visible="visible" width="800px" append-to-body destroy-on-close @close="cancel">
    <!-- <el-table v-loading="loading" :data="waybilllist" border stripe>
      <el-table-column type="index" label="序号" width="50" />
      <el-table-column width="120" label="运输单号" align="center" prop="waybillNo" />
      <el-table-column width="120" label="商品信息" align="center" prop="goodsName" />
      <el-table-column width="180" label="装货地址" align="center" prop="loadFormattedAddress" />
      <el-table-column width="180" label="卸货地址" align="center" prop="unloadFormattedAddress" />
      <el-table-column width="100" label="装车重量" align="center" prop="loadWeight" />
      <el-table-column width="100" label="卸车重量" align="center" prop="unloadWeight" />
      <el-table-column width="100" label="货物损耗（kg）" align="center" prop="wastage" />
      <el-table-column width="100" label="实收运费" align="center" prop="deliveryFeePractical" />
      <el-table-column width="100" label="纳税金额" align="center" prop="taxPayment" />
      <el-table-column width="100" label="服务费" align="center" prop="serviceFee" />
      <el-table-column width="100" label="服务费税" align="center" prop="serviceTaxFee" />
    </el-table> -->
    <el-form ref="form" :model="form" :rules="rules" label-width="130px">
      <el-form-item label="发票批次号" prop="askForNo">
        <el-input v-model="form.askForNo" disabled placeholder="请输入发票号码" clearable size="small" style="width:90%;" />
      </el-form-item>
      <el-form-item label="发票图片">
        <uploadImage v-model="form.images" />
      </el-form-item>
      <el-form-item label="收票人姓名" prop="receiveName">
        <el-input v-model="form.receiveName" placeholder="请输入收票人姓名" clearable size="small" style="width:90%;" />
      </el-form-item>
      <el-form-item label="收票人电话" prop="receivePhone">
        <el-input v-model="form.receivePhone" placeholder="请输入收票人电话" clearable size="small" style="width:90%;" />
      </el-form-item>
      <el-form-item label="收票地址" prop="receiveAddress">
        <el-input v-model="form.receiveAddress" placeholder="请输入收票地址" clearable size="small" style="width:90%;" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitForm">立即提交</el-button>
      <el-button @click="cancel">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { openInvoice } from '@/api/finance/list';
import UploadImage from '@/components/UploadImage/moreImg';

export default {
  name: 'BillingDialog',
  components: {
    UploadImage
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    open: Boolean
  },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 总条数
      // total: 0,
      // 运单列表
      waybilllist: [],
      // 表单参数
      form: {
        askForNo: null,
        images: null,
        invoiceApplyCode: null,
        receiveAddress: null,
        receiveName: null,
        receivePhone: null
      },
      // 表单校验
      rules: {
        // goodsBigType: [
        //   { required: true, message: '请选择审核结果', trigger: 'blur' }
        // ]
      }
      // fresh: false
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
  created() {
  },
  methods: {
    /** 查询运单列表 */
    // getList() {
    //   this.loading = true;
    //   getApplyWaybill(this.form.invoiceApplyCode).then(response => {
    //     this.waybilllist = response.data;
    //     // this.total = response.total;
    //     this.loading = false;
    //   });
    // },
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          openInvoice(this.form).then(response => {
            this.msgSuccess('开票成功');
            this.close();
            this.$emit('refresh');
          });
        }
      });
    },
    /** 取消按钮 */
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
        askForNo: null,
        images: null,
        invoiceApplyCode: null,
        receiveAddress: null,
        receiveName: null,
        receivePhone: null
      };
      this.resetForm('form');
    },
    // 表单赋值
    setForm(data) {
      this.form = {
        askForNo: data.askForNo,
        images: null,
        invoiceApplyCode: data.code,
        receiveAddress: data.invoiceReceiverAddress,
        receiveName: data.receiver,
        receivePhone: data.receiverPhone
      };
      // this.form.invoiceApplyCode = data.code;
      // this.form.askForNo = data.askForNo;
      console.log(this.form);
      // this.getList();
    }
  }
};
</script>

<style>
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
</style>
