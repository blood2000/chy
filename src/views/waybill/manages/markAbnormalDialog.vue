<template>
  <el-dialog :title="title" :visible="visible" width="500px" append-to-body @close="cancel">
    <el-form ref="form" :model="form" :rules="rules" label-width="80px">
      <el-form-item label="运输单号" prop="waybillNo">
        <el-input v-model="form.waybillNo" readonly />
      </el-form-item>
      <el-form-item label="异常原因" prop="description">
        <el-input v-model="form.description" type="textarea" placeholder="请输入异常原因" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitForm">确 定</el-button>
      <el-button @click="cancel">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { waybillAbnormal } from '@/api/waybill/manages';
export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    open: Boolean,
    currentId: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      // 表单参数
      form: {},
      // 表单校验
      rules: {}
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
  methods: {
    // 获取详情
    // getDetail() {
    //   getDetail(this.currentId).then(response => {
    //     console.log(response);
    //     this.form.waybillNo = response.data.waybillNo;
    //     this.form.description = '';
    //   });
    // },
    // 提交按钮
    submitForm: function() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          waybillAbnormal({
            waybillCode: this.currentId,
            isWarning: 1,
            description: this.form.description
          }).then(response => {
            this.msgSuccess('标记成功');
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
    // 关闭弹窗
    close() {
      this.$emit('update:open', false);
    },
    // 表单重置
    reset() {
      this.form = {
        waybillCode: null,
        waybillNo: null,
        isWarning: null,
        description: null
      };
      this.resetForm('form');
    },
    // 表单赋值
    setForm(data) {
      console.log(data);
      this.form.waybillCode = data.wayBillCode;
      this.form.waybillNo = data.waybillNo;
      this.form.isWarning = data.isWarning;
      console.log(this.form);
    }
  }
};
</script>
