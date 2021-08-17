<template>
  <!-- 开票对话框 -->
  <el-dialog :title="title" :visible="visible" width="800px" append-to-body destroy-on-close :close-on-click-modal="false" @close="cancel">
    <div v-loading="loading">
      <el-form ref="form" :model="form" :rules="rules" label-width="130px">
        <el-form-item label="发票索取记录号" prop="askForNo">
          <el-input v-model="form.askForNo" disabled placeholder="请输入发票索取记录号" clearable size="small" style="width:90%;" />
        </el-form-item>
        <el-form-item label="发票图片">
          <uploadImage v-model="form.images" />
        </el-form-item>
        <el-form-item label="收票人姓名" prop="receiveName">
          <el-input v-model="form.receiveName" placeholder="请输入收票人姓名" clearable size="small" style="width:90%;" />
        </el-form-item>
        <el-form-item label="收票人电话" prop="receivePhone">
          <el-input v-model="form.receivePhone" placeholder="请输入收票人电话" maxlength="11" clearable size="small" style="width:90%;" />
        </el-form-item>
        <el-form-item label="收票地址" prop="receiveAddress">
          <el-input v-model="form.receiveAddress" placeholder="请输入收票地址" maxlength="50" clearable size="small" style="width:90%;" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align: end;">
        <el-button type="primary" @click="submitForm">立即提交</el-button>
        <el-button @click="cancel">取消</el-button>
      </div>
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
      loading: false,
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
  created() {
  },
  methods: {
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.loading = true;
          openInvoice(this.form).then(response => {
            this.loading = false;
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
