<template>
  <el-form ref="form" :model="form" :rules="rules" label-width="130px">
    <el-row :gutter="20" class="container">
      <el-col :span="6" class="bg">
        <el-form-item label="索票批次号" prop="num">
          <el-input v-model="form.num" disabled placeholder="请输入索票批次号" clearable size="small" style="width:90%;" />
        </el-form-item>
        <el-form-item label="总开具票务数" prop="num">
          <el-input v-model="form.num" disabled placeholder="请输入总开具票务数" clearable size="small" style="width:90%;" />
        </el-form-item>
        <el-form-item label="总运单结算金额" prop="num">
          <el-input v-model="form.num" disabled placeholder="请输入总运单结算金额" clearable size="small" style="width:90%;" />
        </el-form-item>
        <el-form-item label="服务费结算金额" prop="num">
          <el-input v-model="form.num" disabled placeholder="请输入服务费结算金额" clearable size="small" style="width:90%;" />
        </el-form-item>
        <img v-viewer :src="form.attachUrls" class="img-box">
      </el-col>
      <el-col :span="18">
        <dev class="bg">
          hh
        </dev>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
import { getDetail } from '@/api/finance/list';
// import UploadImage from '@/components/UploadImage/index';

export default {
  name: 'Statement',
  components: {
    // UploadImage
  },
  props: {
    id: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      // 审核结果字典
      invoiceStatusOptions: [
        { 'dictLabel': '审核通过', 'dictValue': '4' },
        { 'dictLabel': '审核不通过', 'dictValue': '3' },
        { 'dictLabel': '审核取消', 'dictValue': '2' }
      ],
      // 表单参数
      form: {
        num: null,
        invoiceApplyCode: null,
        invoiceStatus: null,
        remake: null
      },
      // 表单校验
      rules: {
        invoiceStatus: [
          { required: true, message: '请选择审核结果', trigger: 'blur' }
        ],
        remake: [
          { required: true, message: '审核备注不能为空', trigger: 'blur' }
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
    getDetail(this.id).then(response => {
      console.log(response);
    });
  },
  methods: {
    /** 提交按钮 */
    // submitForm() {
    //   this.$refs['form'].validate(valid => {
    //     if (valid) {
    //       passCheck(this.form).then(response => {
    //         this.msgSuccess('审核成功');
    //         this.close();
    //         this.$emit('refresh');
    //       });
    //     }
    //   });
    // },
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
        invoiceApplyCode: null,
        invoiceStatus: null,
        remake: null
      };
      this.resetForm('form');
    },
    // 表单赋值
    setForm(data) {
      // this.form.invoiceApplyCode = data;
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
.bg{
  background: #fff;
  padding: 15px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
.container{
  margin: 0 15px 15px !important;
}
.img-box{
  height: 240px;
  width: 100%;
}
</style>
