<template>
  <!-- 审核对话框 -->
  <el-dialog :title="title" :visible="visible" width="800px" append-to-body @close="cancel">
    <el-form ref="form" :model="form" :rules="rules" label-width="130px">
      <el-form-item v-if="disable" label="审核数量" prop="loadInfo">
        <el-input v-model="form.loadInfo" disabled placeholder="请输入审核数量" clearable size="small" style="width:90%;" />
      </el-form-item>
      <el-form-item label="审核结果" prop="goodsBigType">
        <el-select
          v-model="form.goodsBigType"
          placeholder="请选择审核结果"
          filterable
          clearable
          style="width:90%;"
          size="small"
        >
          <el-option
            v-for="dict in auditResultOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="审核备注" prop="driverApplyRemark">
        <el-input v-model="form.driverApplyRemark" type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入审核备注" style="width:90%;" clearable />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitForm">立即提交</el-button>
      <el-button @click="reset">重置</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { reject } from '@/api/waybill/tracklist';
// import UploadImage from '@/components/UploadImage/index';

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
    disable: Boolean
  },
  data() {
    return {
      // 审核结果字典
      auditResultOptions: [
        { 'dictLabel': '审核通过', 'dictValue': '0' },
        { 'dictLabel': '审核不通过', 'dictValue': '1' }
      ],
      // 表单参数
      form: {
        wayBillInCode: null,
        driverApplyRemark: null
      },
      // 表单校验
      rules: {
        goodsBigType: [
          { required: true, message: '请选择审核结果', trigger: 'blur' }
        ],
        driverApplyRemark: [
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
          reject(this.form).then(response => {
            this.msgSuccess('申请取消运单成功');
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
        wayBillInCode: null,
        driverApplyRemark: null
      };
      this.resetForm('form');
    },
    // 表单赋值
    setForm(data) {
      this.form.wayBillInCode = data.code;
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
