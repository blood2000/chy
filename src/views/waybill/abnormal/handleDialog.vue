<template>
  <!-- 处理运输异常对话框 -->
  <el-dialog :title="title" :visible="visible" width="800px" append-to-body @close="cancel">
    <el-form ref="form" :model="form" :rules="rules" :disabled="disable" label-width="80px">
      <el-form-item label="运输单号" prop="waybillNo">
        <el-input v-model="form.waybillNo" placeholder="请输入运输单号" readonly />
      </el-form-item>
      <el-form-item label="处理说明" prop="description">
        <el-input v-model="form.description" type="textarea" placeholder="请输入处理说明" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitForm">立即提交</el-button>
      <el-button @click="cancel">取消</el-button>
    </div>

  </el-dialog>
</template>

<script>
import { handleAbnormal } from '@/api/waybill/abnormal';

export default {
  components: {
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
      // 表单参数
      form: {
      },
      // 表单校验
      rules: {
        description: [
          { required: true, message: '异常说明不能为空', trigger: 'blur' }
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
          handleAbnormal(this.form).then(response => {
            this.msgSuccess('处理成功');
            this.close();
            this.$emit('refresh');
          });
        }
      });
    },
    // 取消按钮
    cancel() {
      this.close();
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        code: null,
        isWarning: null,
        description: null,
        waybillNo: null
      };
      this.resetForm('form');
    },
    // 关闭弹窗
    close() {
	  this.$emit('update:open', false);
    },
    // 表单赋值
    setForm(data) {
	    this.form.code = data.code;
      this.form.isWarning = 0;
      this.form.waybillNo = data.waybillNo;
    }
  }
};
</script>

<style scoped>
	.mr3{
	  margin-right: 3%;
	}
	.width90{
	  width: 90% !important;
	}
	.width28{
	  width: 28%;
	}
	.el-input-number ::v-deep.el-input__inner{
	  text-align: left;
	}
  .el-radio{
    line-height: 36px !important;
  }
  .display{
    display: none;
  }
</style>
