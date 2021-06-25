<template>
  <!-- 驳回理由对话框 -->
  <el-dialog :title="title" :visible="visible" width="800px" append-to-body :close-on-click-modal="false" @close="cancel">
    <el-form ref="form" :model="form" :rules="rules" label-width="130px">
      <el-form-item label="驳回原因" prop="rebutRemark">
        <el-input v-model="form.rebutRemark" type="textarea" maxlength="50" show-word-limit :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入驳回理由" style="width:90%;" clearable />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitForm">立即提交</el-button>
      <el-button @click="cancel">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>

import { refuseBatchClaim, refuseVerification, refuseApplied } from '@/api/settlement/adjustDregs';
import { refuseBilling } from '@/api/finance/list';


// 数组安循序填了 0:refuseVerification,1:refuseBatchClaim, 2:refuseApplied, 3:refuseBilling
const apis = [refuseVerification, refuseBatchClaim, refuseApplied, refuseBilling];

export default {
  name: 'RejectDialog',
  components: {
    // UploadImage
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    open: Boolean,
    // disable: Boolean
    status: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        rebutRemark: [
          { required: true, message: '驳回原因不能为空', trigger: 'blur' }
        ]
      }
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
    },

    api() {
      return apis[this.status];
    }
  },
  created() {
  },
  methods: {
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          const que = {
            batchNos: this.form.batchNo, //	批次列表不能为空		传数组
            createCode: this.form.createCode,
            remark: this.form.rebutRemark
          };


          this.api && this.api(que).then(response => {
            this.msgSuccess('驳回成功');
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
        batchNo: undefined,
        rebutRemark: undefined,
        createCode: undefined
      };
      this.resetForm('form');
    },
    // 表单赋值
    setForm(arr, createCode) {
      this.form.batchNo = arr.map(e => e.batchNo);
      this.form.createCode = createCode || undefined;
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
