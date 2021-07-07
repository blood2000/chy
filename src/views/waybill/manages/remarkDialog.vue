<template>
  <el-dialog :title="title" :visible="visible" width="500px" append-to-body :modal-append-to-body="false" @close="cancel">
    <el-form ref="form" :model="form" :rules="rules" label-width="80px">
      <el-form-item label="运单备注" prop="shipperRemark">
        <el-input v-model="form.shipperRemark" type="textarea" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitForm">确 定</el-button>
      <el-button @click="cancel">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { waybillRemark } from '@/api/waybill/manages';
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
      rules: {
        shipperRemark: [
          { required: true, message: '货主备注不能为空', trigger: 'blur' }
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
  methods: {
    // 获取详情
    // getDetail() {
    //   getDetail(this.currentId).then(response => {
    //     this.form.shipperRemark = response.data.shipperRemark;
    //     this.form.wayBillInCode = this.currentId;
    //   });
    // },
    // 提交按钮
    submitForm: function() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          waybillRemark(this.form).then(response => {
            this.msgSuccess('保存成功');
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
        shipperRemark: null,
        wayBillInCode: null
      };
      this.resetForm('form');
    },
    // 表单赋值
    setForm(data) {
      this.form.wayBillInCode = data.wayBillCode;
      this.form.shipperRemark = data.shipperRemark;
    }
  }
};
</script>
