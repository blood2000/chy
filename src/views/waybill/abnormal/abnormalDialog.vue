<template>
  <!-- 添加或修改运输异常对话框 -->
  <el-dialog :title="title" :visible="visible" width="800px" append-to-body :close-on-click-modal="false" @close="cancel">
    <el-form ref="form" :model="form" :rules="rules" :disabled="disable" label-width="130px">
      <el-form-item label="标记时间" prop="warningTime">
        <el-date-picker
          v-model="form.warningTime"
          clearable
          size="small"
          style="width: 90%"
          type="datetime"
          placeholder="选择标记时间"
        />
      </el-form-item>
      <el-form-item label="异常说明" prop="description">
        <el-input v-model="form.description" style="width: 90%" autosize type="textarea" placeholder="请输入异常说明" />
      </el-form-item>
      <el-form-item v-if="form.isWarning === 0" label="处理时间" prop="updateTime">
        <el-date-picker
          v-model="form.updateTime"
          clearable
          size="small"
          style="width: 90%"
          type="datetime"
          placeholder="选择标记时间"
        />
      </el-form-item>
      <el-form-item v-if="form.isWarning === 0" label="处理说明" prop="operDescription">
        <el-input v-model="form.operDescription" style="width: 90%" autosize type="textarea" placeholder="请输入处理说明" />
      </el-form-item>
    </el-form>

  </el-dialog>
</template>

<script>
// import { updateAbnormal, addAbnormal } from '@/api/waybill/abnormal';

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
        // description: [
        //   { required: true, message: '异常说明不能为空', trigger: 'blur' }
        // ]
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
    // 取消按钮
    cancel() {
      this.close();
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        code: null,
        waybillCode: null,
        isWarning: null,
        warningTime: null,
        isDel: null,
        createCode: null,
        createTime: null,
        updateCode: null,
        updateTime: null,
        description: null,
        operDescription: null
      };
      this.resetForm('form');
    },
    // 关闭弹窗
    close() {
	  this.$emit('update:open', false);
    },
    // 表单赋值
    setForm(data) {
	    this.form = data;
      console.log(this.form);
    }
  }
};
</script>

<style lang="scss" scoped>
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
