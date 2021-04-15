<template>
  <!-- 添加或修改运输异常对话框 -->
  <el-dialog :title="title" :visible="visible" width="800px" append-to-body @close="cancel">
    <el-form ref="form" :model="form" :rules="rules" :disabled="disable" label-width="80px">
      <!-- <el-form-item label="运单编号" prop="waybillCode">
          <el-input v-model="form.waybillCode" placeholder="请输入运单编号" />
        </el-form-item> -->
      <!-- <el-form-item label="标记时间" prop="warningTime">
          <el-date-picker clearable size="small" style="width: 200px"
            v-model="form.warningTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择标记时间">
          </el-date-picker>
        </el-form-item> -->
      <!-- <el-form-item label="创建人" prop="createCode">
          <el-input v-model="form.createCode" placeholder="请输入创建人" />
        </el-form-item>
        <el-form-item label="修改人" prop="updateCode">
          <el-input v-model="form.updateCode" placeholder="请输入修改人" />
        </el-form-item> -->
      <el-form-item label="异常说明" prop="description">
        <el-input v-model="form.description" placeholder="请输入异常说明" />
      </el-form-item>
    </el-form>
    <div :class=" disable === true ?'display':''">
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </div>

  </el-dialog>
</template>

<script>
import { updateAbnormal, addAbnormal } from '@/api/waybill/abnormal';

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
          if (this.form.waybillCode != null) {
            updateAbnormal(this.form).then(response => {
              this.msgSuccess('修改成功');
              this.close();
              this.getList();
            });
          } else {
            addAbnormal(this.form).then(response => {
              this.msgSuccess('新增成功');
              this.close();
              this.getList();
            });
          }
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
        waybillCode: null,
        isWarning: null,
        warningTime: null,
        isDel: null,
        createCode: null,
        createTime: null,
        updateCode: null,
        updateTime: null,
        description: null
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
