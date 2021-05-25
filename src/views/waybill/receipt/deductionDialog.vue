<template>
  <el-dialog :title="title" :visible="visible" width="500px" append-to-body :modal-append-to-body="false" @close="cancel">
    <el-form ref="form" :model="form" :rules="rules" label-width="80px">
      <el-form-item label="押金" prop="money">
        <el-input v-model="form.money" placeholder="请输入扣押金金额" class="width90" clearable />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitForm">确 定</el-button>
      <el-button @click="cancel">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
// import { getDetail } from '@/api/waybill/manages';
export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    currentId: {
      type: String,
      default: ''
    },
    open: Boolean
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
  watch: {
    open(val) {
      if (val) {
        this.reset();
        this.getDetail();
      }
    }
  },
  methods: {
    // 获取详情
    getDetail() {
      console.log('未用');
    },
    // 提交按钮
    submitForm: function() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.msgSuccess('修改成功');
          this.close();
          this.$emit('refresh');
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
        money: null
      };
      this.resetForm('form');
    }
  }
};
</script>
