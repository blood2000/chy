<template>
  <!-- 添加司机投诉货主对话框 -->
  <el-dialog :title="title" :visible="visible" width="800px" append-to-body destroy-on-close @close="cancel">
    <el-form ref="form" :model="form" :rules="rules" label-width="130px">
      <el-form-item label="运输单号" prop="wayBillNo">
        <el-input v-model="form.wayBillNo" class="width90" disabled />
      </el-form-item>
      <!-- 多图框 -->
      <el-form-item label="照片" prop="attachmentCodes">
        <uploadImage v-model="form.attachmentCodes" />
      </el-form-item>
      <el-form-item label="投诉说明" prop="description">
        <el-input
          v-model="form.description"
          class="width90"
          type="textarea"
          :rows="2"
          placeholder="请输入投诉说明内容"
        />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitForm">立即提交</el-button>
      <el-button @click="cancel">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { addComplaint } from '@/api/waybill/tracklist';
import UploadImage from '@/components/UploadImage/moreImg';

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
    open: Boolean
  },
  data() {
    return {
      // 表单参数
      form: {
      },
      // 表单校验
      rules: {
        description: [
          { required: true, message: '请输入投诉说明内容', trigger: 'blur' }
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
          addComplaint(this.form).then(response => {
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
        description: null,
        attachmentCodes: null,
        wayBillCode: null,
        wayBillNo: null
      };
      this.resetForm('form');
    },
    // 表单赋值
    setForm(data) {
      this.waybill = data;
      this.form.wayBillCode = this.waybill.code;
      this.form.wayBillNo = this.waybill.waybillNo;
      console.log(this.form);
    }

    // 图片上传成功会掉
    // handleUploadSuccess() {
    // }
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
</style>

