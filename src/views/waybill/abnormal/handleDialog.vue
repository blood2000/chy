<template>
  <!-- 处理运输异常对话框 -->
  <el-dialog :title="title" :visible="visible" width="800px" append-to-body @close="cancel">
    <el-form ref="form" :model="form" :rules="rules" :disabled="disable" label-width="80px">
      <el-form-item label="处理原因" prop="reson">
        <el-select
          v-model="form.reson"
          placeholder="请选择处理原因"
          clearable
          filterable
          size="small"
          style="width: 90%"
          @change="handleChange"
        >
          <el-option
            v-for="dict in resonOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item v-if="form.reson === '4'" label="处理说明" prop="description">
        <el-input v-model="form.description" style="width: 90%" type="textarea" placeholder="请输入处理说明" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitForm">立即提交</el-button>
      <el-button @click="cancel">取消</el-button>
    </div>

  </el-dialog>
</template>

<script>
import { batchHandle } from '@/api/waybill/abnormal';

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
      reson: undefined,
      resonOptions: [],
      // 表单校验
      rules: {
        description: [
          { required: true, message: '处理说明不能为空', trigger: 'blur' }
        ],
        reson: [
          { required: true, message: '请选择处理原因', trigger: 'blur' }
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
    this.getDicts('waybill_abnormal_handle').then(response => {
      this.resonOptions = response.data;
    });
  },
  methods: {
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          batchHandle(this.form).then(response => {
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
        codeList: null,
        isWarning: null,
        description: null,
        reson: null
      };
      this.resetForm('form');
    },
    // 关闭弹窗
    close() {
	  this.$emit('update:open', false);
    },
    // 表单赋值
    setForm(data) {
	    this.form.codeList = data;
      this.form.isWarning = 0;
    },
    handleChange(e) {
      if (e && e !== '4') {
        const dict = this.resonOptions.find(res => res.dictValue === e);
        this.form.description = dict.dictLabel;
      } else {
        this.form.description = null;
      }
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
