<template>
  <!-- 开票对话框 -->
  <el-dialog :title="title" :visible="visible" width="800px" append-to-body destroy-on-close :close-on-click-modal="false" @close="cancel">
    <el-form ref="form" :model="form" :rules="rules" label-width="130px">
      <el-form-item label="发票批次号" prop="batchNo">
        <el-input v-model="form.batchNo" disabled placeholder="请输入发票号码" clearable size="small" style="width:90%;" />
      </el-form-item>
      <el-form-item label="发票图片">
        <uploadImage v-model="form.images" :fresh="fresh" @uploadStatus="uploadStatus" />
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
      <el-button :loading="uploadimgStatus" type="primary" @click="submitForm">立即提交</el-button>
      <el-button @click="cancel">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { passBilling } from '@/api/finance/askfor';

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
      uploadimgStatus: false,
      // 运单列表
      waybilllist: [],
      // 表单参数
      form: {
        batchNo: null,
        images: null,
        invoiceApplyCode: null,
        receiveAddress: null,
        receiveName: null,
        receivePhone: null
      },
      // 表单校验
      rules: {},
      // 图片回显
      fresh: false
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
  created() {},
  methods: {
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          const que = {
            batchNos: [this.form.batchNo],
            imgCodes: this.form.images
          };
          passBilling(que).then(response => {
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
      this.fresh = false;
      this.$emit('update:open', false);
    },
    // 表单重置
    reset() {
      this.form = {
        batchNo: null,
        images: null,
        invoiceApplyCode: null,
        receiveAddress: null,
        receiveName: null,
        receivePhone: null,
        batchCodes: null
      };
      this.resetForm('form');
    },
    // 触发说明正在上传图片
    uploadStatus(bool, msg) {
      // console.log(bool, msg);
      this.uploadimgStatus = bool;
    },

    // 表单赋值
    setForm(data) {
      this.form = {
        batchNo: data.batchNo,
        images: data.imgCodes,
        invoiceApplyCode: data.code,
        receiveAddress: data.invoiceReceiverAddress,
        receiveName: data.receiver,
        receivePhone: data.receiverPhone
      };
      this.$nextTick(() => {
        this.fresh = !!data.imgCodes;
      });
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
