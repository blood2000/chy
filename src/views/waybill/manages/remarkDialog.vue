<template>
  <el-dialog :title="title" :visible="visible" width="500px" append-to-body @close="cancel">
    <el-form ref="form" :model="form" :rules="rules" label-width="80px">
      <el-form-item label="货主备注" prop="shipperDealRemark">
        <el-input v-model="form.shipperDealRemark" type="textarea" placeholder="" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitForm">确 定</el-button>
      <el-button @click="cancel">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getDetail } from '@/api/waybill/manages';
export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    open: Boolean,
    currentId: {
      type: Number,
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
  watch: {
    open(val) {
      if (val) {
        this.reset();
        this.getDetail();
      }
    }
  },
  create() {

  },
  methods: {
    // 获取详情
    getDetail() {
      getDetail(this.currentId).then(response => {
        this.form = response.data;
      });
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
        shipperDealRemark: null
      };
      this.resetForm('form');
    }
  }
};
</script>
