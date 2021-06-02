<template>
  <!-- 添加调度组对话框 -->
  <el-dialog :title="title" :class="[{'i-add':title==='添加调度组'}]" :visible="visible" width="800px" :close-on-click-modal="false" append-to-body @close="cancel">
    <el-form ref="form" :model="form" :rules="rules" label-width="120px">
      <el-form-item label="调度者姓名" prop="disUserName">
        <el-input v-model="form.disUserName" placeholder="请输入调度者姓名" />
      </el-form-item>
      <el-form-item label="调度者手机" prop="disUserPhone">
        <el-input v-model="form.disUserPhone" placeholder="请输入调度者手机" />
      </el-form-item>
      <el-form-item label="调度组名称" prop="disName">
        <el-input v-model="form.disName" placeholder="请输入调度组名称" />
      </el-form-item>
      <el-form-item label="常用调度组" prop="isOften">
        <el-input v-model="form.isOften" type="number" placeholder="请输入调度组名称" />
      </el-form-item>
      <el-form-item label="不开票打款" prop="isNotInvoice">
        <el-input v-model="form.isNotInvoice" type="number" placeholder="请输入调度者手机" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitForm">确 定</el-button>
      <el-button @click="cancel">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { addInfo } from '@/api/enterprise/group';
// import UploadImage from '@/components/UploadImage/index';

export default {
  components: {
    // UploadImage
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
      // 选中数组
      ids: [],
      // 表单参数
      form: {
      },
      // 表单校验
      rules: {
        disUserName: [
          { required: true, message: '调度者姓名不能为空', trigger: 'blur' }
        ],
        disUserPhone: [
          { required: true, message: '调度者电话不能为空', trigger: 'blur' }
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
          addInfo(this.form).then(response => {
            this.msgSuccess('新增成功');
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
        id: null,
        disName: null,
        disUserName: null,
        disUserPhone: null,
        isNotInvoice: null,
        isOften: null
      };
      this.resetForm('form');
    },
    // 表单赋值
    setForm(data) {
      console.log(data);
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
    line-height: 36px;
  }
</style>
