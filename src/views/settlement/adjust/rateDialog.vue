<template>
  <!-- 货主评价司机对话框 -->
  <el-dialog :title="title" :visible="visible" width="800px" append-to-body @close="cancel">
    <el-form ref="form" :model="form" :disabled="disable" :rules="rules" label-width="130px">
      <el-form-item label="综合评价：" prop="score">
        <el-rate v-model="form.score" allow-half />
      </el-form-item>
      <el-form-item label="评价内容：" prop="content">
        <span>{{ form.content || '暂无评价内容' }}</span>
        <!-- <el-input v-model="form.content" type="textarea" maxlength="100" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入您的客观评价" style="width:90%;" clearable /> -->
      </el-form-item>
    </el-form>
    <div v-if="!disable" slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitForm">立即提交</el-button>
      <el-button @click="cancel">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { waybillComment, waybillCommentDetail } from '@/api/waybill/tracklist';

export default {
  name: 'RateDialog',
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
        waybillCode: null,
        score: null,
        content: null
      },
      // 表单校验
      rules: {
        // score: [
        //   { required: true, message: '请选择评分', trigger: 'blur' }
        // ],
        // content: [
        //   { required: true, message: '评价内容不能为空', trigger: 'blur' }
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
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          waybillComment(this.form).then(response => {
            this.msgSuccess('发表评价成功');
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
      this.form.waybillCode = data.wayBillCode;
      waybillCommentDetail(0, data.wayBillCode).then(response => {
        console.log(response);
        this.form.score = response.data[0].score;
        this.form.content = response.data[0].content;
      });
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
