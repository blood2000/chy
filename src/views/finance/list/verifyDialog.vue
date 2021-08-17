<template>
  <!-- 审核对话框 -->
  <el-dialog class="i-check" :title="title" :visible="visible" width="800px" append-to-body :close-on-click-modal="false" @close="cancel">
    <div v-loading="loading">
      <el-form ref="form" :model="form" :rules="rules" label-width="130px">
        <el-form-item v-if="form.num" label="审核数量" prop="num">
          <span>{{ form.num }}</span>
        </el-form-item>
        <el-form-item label="审核结果" prop="invoiceStatus">
          <el-select
            v-model="form.invoiceStatus"
            placeholder="请选择审核结果"
            filterable
            clearable
            style="width:90%;"
            size="small"
          >
            <el-option
              v-for="dict in invoiceStatusOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="审核备注" prop="remake">
          <el-input v-model="form.remake" type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入审核备注" style="width:90%;" clearable />
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
import { passCheck } from '@/api/finance/list';

export default {
  name: 'VerifyDialog',
  props: {
    title: {
      type: String,
      default: ''
    },
    open: Boolean,
    disable: Boolean
  },
  data() {
    return {
      loading: false,
      // 审核结果字典
      invoiceStatusOptions: [
        { 'dictLabel': '审核通过', 'dictValue': '4' },
        { 'dictLabel': '审核不通过', 'dictValue': '3' },
        { 'dictLabel': '审核取消', 'dictValue': '2' }
      ],
      // 表单参数
      form: {
        num: null,
        invoiceApplyCode: null,
        invoiceStatus: null,
        remake: null
      },
      // 表单校验
      rules: {
        invoiceStatus: [
          { required: true, message: '请选择审核结果', trigger: 'blur' }
        ],
        remake: [
          { required: true, message: '审核备注不能为空', trigger: 'blur' }
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
          passCheck(this.form).then(response => {
            this.msgSuccess('审核成功');
            this.loading = false;
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
        num: null,
        invoiceApplyCode: null,
        invoiceStatus: null,
        remake: null
      };
      this.resetForm('form');
    },
    // 表单赋值
    setForm(data) {
      this.form.invoiceApplyCode = data;
    },
    // 获取数量
    setNum(data) {
      this.form.num = data;
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
