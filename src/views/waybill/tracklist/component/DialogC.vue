<template>
  <!-- 车辆卸货对话框 -->
  <el-dialog :title="title" :visible="visible" width="800px" append-to-body @close="cancel">
    <el-form ref="form" :model="form" :rules="rules" :disabled="disable" label-width="80px">
      <el-form-item label="卸货时间" prop="loadTime">
        <el-date-picker
          v-model="form.loadTime"
          style="width:90%;"
          type="datetime"
          placeholder="选择日期时间"
          value-format="yyyy-MM-dd HH:mm:ss"
        />
      </el-form-item>
      <el-form-item label="卸货重量" prop="loadWeight">
        <el-input-number v-model="form.loadWeight" placeholder="请输入卸货重量" controls-position="right" :min="0" style="width:90%;" />
      </el-form-item>

      <el-form-item label="卸货单据" prop="picture">
        <uploadImage v-model="form.picture" />
      </el-form-item>

      <el-form-item label="卸货备注" prop="remark">
        <el-input v-model="form.remark" type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入装货备注信息" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitForm">立即提交</el-button>
      <el-button @click="reset">重置</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { unload, getAddress } from '@/api/waybill/tracklist';
import UploadImage from '@/components/UploadImage/index';

export default {
  name: 'DialogC',
  components: {
    UploadImage
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    open: Boolean,
    disable: Boolean,

    initdata: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      // 表单参数
      form: {
      },
      // 表单校验
      rules: {
        tin1: [
          { required: false, message: '网点编码不能为空', trigger: 'blur' }
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
  created() {},
  methods: {
    // 获取地址信息
    getAddress() {
      getAddress(this.initdata.mainOrderNumber).then(response => {
        this.waybillAddressOptions = response;
        console.log(this.waybillAddressOptions);
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.loadTime != null) {
            unload(this.form).then(response => {
              this.msgSuccess('修改成功');
              this.close();
              this.$emit('refresh');
            });
          } else {
            unload(this.form).then(response => {
              this.msgSuccess('车辆卸货成功');
              this.close();
              this.$emit('refresh');
            });
          }
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
        code: null,
        loadTime: null,
        loadWeight: null,
        picture: null,
        remark: null,
        waybillAddress: {}
      };
      this.resetForm('form');
      this.getAddress();
    },
    // 表单赋值
    setForm(data) {
      this.form = data;
    }
  }
};
</script>

<style>
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
