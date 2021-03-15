<template>
  <el-dialog :title="title" :visible="visible" width="800px" append-to-body @close="cancel">
    <el-form ref="form" :model="form" :rules="rules" label-width="120px">
      <!-- <el-form-item label="货主编码" prop="shipmentCode">
        <el-input v-model="form.shipmentCode" placeholder="请输入货主编码" class="width90" clearable />
      </el-form-item> -->
      <el-form-item label="货源码名称" prop="cargoCodeName">
        <el-input v-model="form.cargoCodeName" placeholder="请输入货源码名称" class="width90" clearable />
      </el-form-item>
      <!-- <el-form-item label="货源码" prop="cargoCodeQr">
        <el-input v-model="form.cargoCodeQr" placeholder="请输入货源码" class="width90" clearable />
      </el-form-item> -->
      <el-form-item label="货源二维码" prop="">
        <el-button type="primary" @click="generateCode">生成货源码</el-button>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitForm">确 定</el-button>
      <el-button @click="cancel">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { addStockcode, updateStockcode, generateCode } from '@/api/enterprise/stockcode';
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
  create() {

  },
  methods: {
    // 提交按钮
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateStockcode(this.form).then(response => {
              this.msgSuccess('修改成功');
              this.close();
              this.$emit('refresh');
            });
          } else {
            addStockcode(this.form).then(response => {
              this.msgSuccess('新增成功');
              this.close();
              this.$emit('refresh');
            });
          }
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
        id: null,
        code: null,
        shipmentCode: null,
        cargoCodeName: null,
        cargoCodeQr: null,
        delFlag: null,
        createCode: null,
        createTime: null,
        updateCode: null,
        updateTime: null
      };
      this.resetForm('form');
    },
    // 表单赋值
    setForm(data) {
	    this.form = data;
    },
    // 生成货源码
    generateCode() {

    }
  }
};
</script>

<style lang="scss" scoped>
.mr3{
  margin-right: 3%;
}
.mb{
  margin-bottom: 22px;
}
.width90{
  width: 90%;
}
.width28{
  width: 28%;
}
</style>>
