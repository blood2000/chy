<template>
  <!-- 车辆装货对话框 -->
  <el-dialog :title="title" :visible="visible" width="1200px" append-to-body @close="cancel">
    <div style="height:600px;">
      <el-amap vid="amapDemo" :zoom="zoom" :center="center">
        <el-amap-marker v-for="(marker, index) in markers" :key="index" :position="marker.position" :icon="marker.icon" :label="marker.label" />
      </el-amap>
    </div>
  </el-dialog>
</template>

<script>
import { cancel } from '@/api/waybill/tracklist';
// import UploadImage from '@/components/UploadImage/index';

export default {
  name: 'LocationDialog',
  components: {
    // UploadImage
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    open: Boolean
    // disable: Boolean
  },
  data() {
    return {
      zoom: 16,
      center: [116.478928, 39.997761],
      markers: [{
        icon: 'https://ddcwl.com/static/img/admin/sys/cc.png',
        position: [116.478928, 39.997761],
        label: {
          content: '辽NC2589',
          offset: [-10, -34]
        }
      }, {
        icon: 'https://ddcwl.com/static/img/admin/sys/cc.png',
        position: [119.358274, 26.045704],
        label: {
          content: '闽A88888',
          offset: [-10, -34]
        }
      }],
      // 表单参数
      form: {
        wayBillInCode: null,
        driverApplyRemark: null
      },
      // 表单校验
      rules: {
        driverApplyRemark: [
          { required: true, message: '取消理由不能为空', trigger: 'blur' }
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
  },
  methods: {
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          cancel(this.form).then(response => {
            this.msgSuccess('申请取消运单成功');
            this.close();
            this.$emit('refresh');
          });
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
        wayBillInCode: null,
        driverApplyRemark: null
      };
      this.resetForm('form');
    },
    // 表单赋值
    setForm(data) {
      this.form.wayBillInCode = data.code;
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
.el-rate{
  margin-top: 8px;
}
.amap-icon img{
  max-width: 40px !important;
  max-height: 30px !important;
}
</style>
