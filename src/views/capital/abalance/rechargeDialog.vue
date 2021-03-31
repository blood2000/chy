<template>
  <el-dialog :title="title" :visible="visible" width="600px" append-to-body @close="cancel">
    <el-form ref="form" :model="form" label-width="100px">
      <el-form-item label="充值金额(元)" prop="name">
        <el-input v-model="form.name" class="width90" placeholder="请输入充值金额(元)" clearable />
      </el-form-item>
      <el-form-item label="备注" prop="name">
        <el-input v-model="form.name" type="textarea" class="width90" placeholder="请输入备注" clearable />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitForm">确 定</el-button>
      <el-button @click="cancel">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
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
      form: {}
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
        this.getBalance();
      }
    }
  },
  methods: {
    /** 查询网商余额 */
    getBalance() {

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
        name: null
      };
      this.resetForm('form');
    },
    // 提交
    submitForm() {

    }
  }
};
</script>

<style scoped>
.width90{
  width: 90%;
}
</style>
