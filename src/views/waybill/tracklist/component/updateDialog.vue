<template>
  <!-- 车辆装货对话框 -->
  <el-dialog :title="title" :visible="visible" width="800px" append-to-body destroy-on-close @close="cancel">
    <el-form ref="form" v-loading="loading" :model="form" :rules="rules" label-width="130px">
      <el-form-item label="装货时间" prop="loadTime">
        <el-date-picker
          v-model="form.loadTime"
          style="width:90%;"
          type="datetime"
          placeholder="选择日期时间"
          :default-value="new Date()"
          disabled
          value-format="yyyy-MM-dd HH:mm:ss"
        />
      </el-form-item>
      <el-form-item :label="'装货数量' + weightLabel" prop="loadWeight">
        <el-input-number v-model="form.loadWeight" placeholder="请输入装货量" :precision="3" controls-position="right" :min="0" style="width:90%;" />
      </el-form-item>
      <el-form-item v-if="waybill.reviewNoNeedUnloadImg === 0" label="装货单据" prop="loadAttachmentCodes">
        <uploadImage v-model="form.loadAttachmentCodes" :limit="9" :fresh="fresh" />
      </el-form-item>
      <el-form-item label="卸货时间" prop="unloadTime">
        <el-date-picker
          v-model="form.unloadTime"
          style="width:90%;"
          type="datetime"
          placeholder="选择日期时间"
          :default-value="new Date()"
          disabled
          value-format="yyyy-MM-dd HH:mm:ss"
        />
      </el-form-item>
      <el-form-item :label="'卸货数量' + weightLabel" prop="unloadWeight">
        <el-input-number v-model="form.unloadWeight" placeholder="请输入卸货数量" :precision="3" controls-position="right" :min="0" style="width:90%;" />
      </el-form-item>
      <el-form-item v-if="waybill.reviewNoNeedUnloadImg === 0" label="卸货凭证" prop="unloadAttachmentCodes">
        <uploadImage v-model="form.unloadAttachmentCodes" :limit="9" :fresh="fresh" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitForm">立即提交</el-button>
      <el-button @click="cancel">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getInfoDetail, updateVoucher } from '@/api/waybill/tracklist';
import UploadImage from '@/components/UploadImage/moreImgArr';

export default {
  name: 'UpdateDialog',
  components: {
    UploadImage
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    open: Boolean,
    disable: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      // 表单参数
      form: {
      },
      // 运单信息
      waybill: {},
      // 表单校验
      rules: {
        loadWeight: [
          { required: true, message: '装货数量不能为空', trigger: 'blur' }
        ],
        loadAttachmentCodes: [
          { required: true, message: '装货单据不能为空', trigger: 'blur' }
        ],
        unloadWeight: [
          { required: true, message: '卸货数量不能为空', trigger: 'blur' }
        ],
        unloadAttachmentCodes: [
          { required: true, message: '卸货单据不能为空', trigger: 'blur' }
        ]
      },
      loading: false,
      // 加载多图
      fresh: false,
      // 装货数量标签
      weightLabel: ''
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
  // watch: {
  //   open(val) {
  //     if (val) {
  //       if (this.disable) {
  //         this.getDetail();
  //       }
  //     }
  //   }
  // },
  created() {
  },
  methods: {
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.waybill.stowageStatus === '2') {
            if (this.form.loadWeight !== 1 || this.form.unloadWeight !== 1) {
              this.msgWarning('车数配载的运单装卸货车数只能为1车！');
            } else {
              this.submitInfo();
            }
          } else {
            if (this.form.loadWeight <= 0 || this.form.unloadWeight <= 0) {
              this.msgWarning('装卸货数量必须大于0！');
            } else if (this.form.loadWeight > 100 || this.form.unloadWeight > 250) {
              this.msgWarning('系统检测到您的装卸货数量过大，请确认后重新仔细填写!');
            } else {
              this.submitInfo();
            }
          }
        }
      });
    },
    // 补装货提交信息，接口调用
    submitInfo() {
      updateVoucher(this.form).then(response => {
        this.msgSuccess('修改凭证成功');
        this.close();
        this.$emit('refresh');
      });
    },
    /** 取消按钮 */
    cancel() {
      this.close();
      this.reset();
      this.fresh = false;
    },
    // 关闭弹窗
    close() {
      this.$emit('update:open', false);
    },
    // 表单重置
    reset() {
      this.form = {
        waybillCode: null,
        goodsCode: null,
        orderCode: null,
        loadTime: null,
        loadWeight: null,
        loadAttachmentCodes: null,
        unloadTime: null,
        unloadWeight: null,
        unloadAttachmentCodes: null
      };
      this.resetForm('form');
    },
    // 获取信息
    setForm(data) {
      this.reset();
      this.loading = true;
      // getLoadInfoDetail(this.waybill.waybillNo, 1).then(response => {
      //   if (response.data.length) {
      //     const info = response.data[0];
      //     this.loadinfo = info;
      //     this.form.loadWeight = info.loadWeight;
      //     this.form.loadTime = info.loadTime;
      //     this.form.loadAttachmentCodes = info.attachmentCode;
      //     this.fresh = true; // 加载多图
      //   }
      // });
      getInfoDetail(data.code).then(res => {
        this.waybill = res.data;
        this.form = {
          ...this.form,
          waybillCode: this.waybill.waybillCode,
          goodsCode: this.waybill.goodsCode,
          orderCode: this.waybill.orderCode,
          loadTime: this.waybill.loadTime,
          loadWeight: this.waybill.loadWeight,
          loadAttachmentCodes: this.waybill.loadAttachmentCodes,
          unloadTime: this.waybill.unloadTime,
          unloadWeight: this.waybill.unloadWeight,
          unloadAttachmentCodes: this.waybill.unloadAttachmentCodes
        };
        this.fresh = true;
        if (this.waybill.stowageStatus === '0') {
          this.weightLabel = '（吨）';
        } else if (this.waybill.stowageStatus === '1') {
          this.weightLabel = '（方）';
        } else if (this.waybill.stowageStatus === '2') {
          this.weightLabel = '（车）';
        } else {
          this.weightLabel = '（吨）';
        }
        this.loading = false;
      });
    }
  }
};
</script>

<style scoped>
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
.el-input-number .el-input__inner{
  text-align: left;
}
</style>
