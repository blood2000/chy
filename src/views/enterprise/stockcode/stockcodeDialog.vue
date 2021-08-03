<template>
  <el-dialog :title="title" :class="[{'i-add':title==='添加'}]" :visible="visible" width="800px" :close-on-click-modal="false" append-to-body @close="cancel">
    <el-form ref="form" :model="form" :rules="rules" label-width="120px">
      <el-form-item label="货集码名称" prop="cargoCodeName">
        <el-input v-model="form.cargoCodeName" :disabled="form.id !=null" placeholder="请输入货集码名称" class="width50 mr3" clearable />
        <span class="g-color-gray">(货集码名称可自定义,如线路名称等)</span>
      </el-form-item>
      <!-- <el-form-item label="货集二维码" :required="true">
        &lt;!&ndash; 编辑的时候不能修改二维码 &ndash;&gt;
        <template v-if="form.id == null || form.id == undefined || form.id == ''">
         <el-button type="primary" @click="generateCode">生成货集码</el-button>
          <br>
          <img v-if="form.cargoCodeQR" class="cargo-code ml24" :src="form.cargoCodeQR">
        </template>
        <template v-else>
          <img v-if="form.cargoCodeQR" class="cargo-code" :src="form.cargoCodeQR">
        </template>
      </el-form-item>-->
      <el-form-item v-if="form.cargoCodeQR" label="货集二维码">
        <img class="cargo-code" :src="form.cargoCodeQR">
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button v-if="title == '添加'" type="primary" :loading="buttonLoading" @click="submitForm">确 定</el-button>
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
    shipmentCode: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      buttonLoading: false,
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        cargoCodeName: [
          { required: true, message: '货集码名称不能为空', trigger: 'blur' }
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
    // 提交按钮
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.buttonLoading = true;
          const params = {
            cargoCodeName: this.form.cargoCodeName
          };
          if (this.shipmentCode) {
            params.shipmentCode = this.shipmentCode;
          }
          if (this.form.id != null) {
            params.code = this.form.code;
            updateStockcode(params).then(response => {
              this.buttonLoading = false;
              this.msgSuccess('修改成功');
              this.close();
              this.$emit('refresh');
            }).catch(() => {
              this.buttonLoading = false;
            });
          } else {
            // 由后端生成
          /*  if (this.form.cargoCodeQR === '' || this.form.cargoCodeQR === null || this.form.cargoCodeQR === undefined) {
              this.msgWarning('请生成货集二维码');
              this.buttonLoading = false;
              return;
            }*/
            params.cargoCodeQR = this.form.cargoCodeQR;
            addStockcode(params).then(response => {
              this.buttonLoading = false;
              this.msgSuccess('新增成功，请到详情中查看');
              this.close();
              this.$emit('refresh');
            }).catch(() => {
              this.buttonLoading = false;
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
      this.buttonLoading = false;
      this.form = {
        id: null,
        code: null,
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
    // 生成货集码
    generateCode() {
      generateCode({ id: this.form.id }).then(response => {
        this.msgSuccess(response.msg);
        this.form.cargoCodeQR = response.data;
        this.$forceUpdate();
      });
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
.width50{
  width: 50%;
}
.cargo-code{
  width: 200px;
  /*height: 200px;*/
}
.ml24{
  margin-left: -24px;
}
</style>
