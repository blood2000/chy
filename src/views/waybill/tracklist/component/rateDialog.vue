<template>
  <!-- 车辆装货对话框 -->
  <el-dialog :title="title" :visible="visible" width="800px" append-to-body @close="cancel">
    <el-form ref="form" :model="form" :rules="rules" label-width="130px">
      <el-form-item label="综合评价" prop="score">
        <el-rate v-model="form.score" allow-half />
      </el-form-item>
      <el-form-item label="评价内容" prop="content">
        <el-input v-model="form.content" type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入您的客观评价" style="width:90%;" clearable />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitForm">立即提交</el-button>
      <el-button @click="cancel">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { waybillComment } from '@/api/waybill/tracklist';
// import UploadImage from '@/components/UploadImage/index';

export default {
  name: 'RateDialog',
  components: {
    // UploadImage
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    open: Boolean
    // disable: Boolean
  },
  data() {
    return {
      // 表单参数
      form: {
        waybillCode: null,
        score: null,
        content: null
      },
      // 表单校验
      rules: {
        score: [
          { required: true, message: '请选择评分', trigger: 'blur' }
        ],
        content: [
          { required: true, message: '评价内容不能为空', trigger: 'blur' }
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
          waybillComment(this.form).then(response => {
            this.msgSuccess('发表评论成功');
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
        waybillCode: null,
        score: null,
        content: null
      };
      this.resetForm('form');
    },
    // 表单赋值
    setForm(data) {
      this.form.waybillCode = data.code;
    }
  }
};
</script>

<style scoped>
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
.el-rate{
  margin-top: 8px;
}
</style>
