<template>
  <el-dialog :title="title" :visible="visible" width="500px" append-to-body :modal-append-to-body="false" @close="cancel">
    <el-form ref="form" :model="form" :rules="rules" label-width="80px">
      <el-form-item label="作废原因" prop="reson">
        <el-select
          v-model="form.reson"
          placeholder="请选择作废原因"
          clearable
          filterable
          size="small"
          style="width: 90%"
          @change="handleChange"
        >
          <el-option
            v-for="dict in resonOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item v-if="form.reson === '2'" label="原因描述" prop="cancelReason">
        <el-input v-model="form.cancelReason" style="width: 90%" type="textarea" placeholder="请输入原因描述" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitForm">确 定</el-button>
      <el-button @click="cancel">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { waybillInvalid } from '@/api/waybill/manages';
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
      reson: undefined,
      resonOptions: [],
      // 表单校验
      rules: {
        cancelReason: [
          { required: true, message: '原因描述不能为空', trigger: 'blur' }
        ],
        reson: [
          { required: true, message: '请选择异常原因', trigger: 'blur' }
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
    this.getDicts('waybill_void_remark').then(response => {
      this.resonOptions = response.data;
    });
  },
  methods: {
    // 提交按钮
    submitForm: function() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          waybillInvalid(this.form.waybillCode, this.form.cancelReason).then(response => {
            this.msgSuccess('作废运单成功');
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
        cancelReason: null
      };
      this.resetForm('form');
    },
    // 表单赋值
    setForm(data) {
      this.form.waybillCode = data;
    },
    handleChange(e) {
      if (e && e !== '2') {
        const dict = this.resonOptions.find(res => res.dictValue === e);
        this.form.cancelReason = dict.dictLabel;
      } else {
        this.form.cancelReason = null;
      }
    }
  }
};
</script>
