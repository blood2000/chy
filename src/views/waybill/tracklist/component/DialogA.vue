<template>
  <!-- 添加或修改调度者对话框 -->
  <el-dialog :title="title" :visible="visible" width="500px" append-to-body @close="cancel">
    <el-form ref="form" :model="form" :rules="rules" :disabled="disable" label-width="80px">
      <el-form-item label="装货时间" prop="tin1">
        <el-date-picker
          v-model="form.tin1"
          style="width:90%;"
          type="datetime"
          placeholder="选择日期时间"
          value-format="yyyy-MM-dd HH:mm:ss"
        />
      </el-form-item>
      <el-form-item label="转货重量" prop="tin2">
        <el-input-number v-model="form.tin2" placeholder="请输入转货重量" controls-position="right" :min="0" style="width:90%;" />
      </el-form-item>

      <el-form-item label="装货单据" prop="tin3">
        <uploadImage v-model="form.tin3" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitForm">立即提交</el-button>
      <el-button @click="reset">重置</el-button>
    </div>
  </el-dialog>
</template>

<script>
// import { addInfo, updateInfo } from '@/api/assets/team';
import UploadImage from '@/components/UploadImage/index';

export default {
  name: 'DialogA',
  components: {
    UploadImage
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    open: Boolean,
    disable: Boolean,

    initdata: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      // 表单参数
      form: {
        tin1: undefined,
        tin2: undefined,
        tin3: undefined
      },
      // 表单校验
      rules: {
        tin1: [
          { required: false, message: '网点编码不能为空', trigger: 'blur' }
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
  created() {},
  methods: {
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          console.log(this.form);

          // if (this.form.id != null) {
          //   updateInfo(this.form).then(response => {
          //     this.msgSuccess('修改成功');
          //     this.close();
          //     this.$emit('refresh');
          //   });
          // } else {
          //   addInfo(this.form).then(response => {
          //     this.msgSuccess('新增成功');
          //     this.close();
          //     this.$emit('refresh');
          //   });
          // }
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
      this.resetForm('form');
    },
    // 表单赋值
    setForm(data) {
      this.form = data;
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
