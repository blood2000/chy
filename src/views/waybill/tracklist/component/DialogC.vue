<template>
  <!-- 车辆卸货对话框 -->
  <el-dialog :title="title" :visible="visible" width="800px" append-to-body destroy-on-close @close="cancel">
    <el-form ref="form" :model="form" :rules="rules" :disabled="disable" label-width="130px">
      <el-form-item label="卸货时间" prop="unloadTime">
        <el-date-picker
          v-model="form.unloadTime"
          style="width:90%;"
          type="datetime"
          placeholder="选择日期时间"
          :default-value="new Date()"
          value-format="yyyy-MM-dd HH:mm:ss"
        />
      </el-form-item>
      <el-form-item label="卸货重量" prop="unloadWeight">
        <el-input-number v-model="form.unloadWeight" placeholder="请输入卸货过磅重量" controls-position="right" :min="0" style="width:90%;" />
      </el-form-item>
      <el-form-item label="卸货地址" prop="waybillAddress">
        <el-select
          v-model="form.waybillAddress"
          placeholder="请选择车辆卸货地址"
          clearable
          size="small"
          style="width:90%;"
        >
          <el-option
            v-for="dict in waybillAddressOptions"
            :key="dict.code"
            :label="dict.formattedAddress"
            :value="dict.code"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="卸货凭证" prop="picture">
        <uploadImage v-model="form.picture" />
      </el-form-item>
      <el-form-item label="卸货备注" prop="remark">
        <el-input v-model="form.remark" type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入装货备注信息" style="width:90%;" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitForm">立即提交</el-button>
      <el-button @click="reset">重置</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { unload, getAddress, getInfoDetail } from '@/api/waybill/tracklist';
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
    disable: Boolean
  },
  data() {
    return {
      // 地址选择
      waybillAddressOptions: [],
      // 表单参数
      form: {
      },
      // 运单信息
      waybill: {},
      // 表单校验
      rules: {
        unloadTime: [
          { required: true, message: '卸货时间不能为空', trigger: 'blur' }
        ],
        unloadWeight: [
          { required: true, message: '卸货重量不能为空', trigger: 'blur' }
        ]
      },
      // 日期格式
      Hours: '',
      Minutes: '',
      Seconds: '',
      time: ''
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
        // this.reset();
        // this.getAddress();
        this.getDetail();
      }
    }
  },
  created() {
    var Hours = new Date().getHours();
    this.Hours = Hours < 10 ? ('0' + Hours) : Hours;
    var Minutes = new Date().getMinutes();
    this.Minutes = Minutes < 10 ? ('0' + Minutes) : Minutes;
    var Seconds = new Date().getSeconds();
    this.Seconds = Seconds < 10 ? ('0' + Seconds) : Seconds;
    this.time = new Date().toISOString().slice(0, 10) + ' ' + this.Hours + ':' + this.Minutes + ':' + this.Seconds;
  },
  methods: {
    // 获取卸货详情
    getDetail() {
      this.reset();
      getInfoDetail(this.waybill.waybillNo).then(response => {
        console.log(response);
        const info = response.data;
        const info1 = info.filter(item => {
          return item.type === 2;
        });
        const info2 = info1[0];
        console.log(info2);
        if (info2) {
          this.form.unloadWeight = info2.unloadWeight;
          this.form.unloadTime = info2.cargoTime;
          this.form.remark = info2.remark;
          console.log(this.form);
        } else {
          this.reset();
          this.getAddress();
          console.log(this.form);
        }
      });
    },
    // 获取地址信息
    getAddress(data) {
      getAddress(this.waybill.goodsCode).then(response => {
        const address = response.data;
        const address1 = address.filter(item => {
          return item.addressType === 2;
        });
        this.waybillAddressOptions = address1;
        console.log(this.waybillAddressOptions);
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.unloadTime != null) {
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
        code: this.waybill.code,
        unloadTime: this.time,
        unloadWeight: null,
        picture: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100',
        remark: null,
        waybillAddress: {}
      };
      this.waybillAddressOptions = [];
      this.resetForm('form');
    },
    // 表单赋值
    setForm(data) {
      this.waybill = data;
      this.form.code = this.waybill.code;
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
.el-input-number .el-input__inner{
  text-align: left;
}
</style>
