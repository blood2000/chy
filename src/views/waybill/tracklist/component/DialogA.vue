<template>
  <!-- 车辆装货对话框 -->
  <el-dialog :title="title" :visible="visible" width="800px" append-to-body destroy-on-close @close="cancel">
    <el-form ref="form" :model="form" :rules="rules" label-width="130px">
      <el-form-item label="装货时间" prop="loadTime">
        <el-date-picker
          v-model="form.loadTime"
          style="width:90%;"
          type="datetime"
          placeholder="选择日期时间"
          :default-value="new Date()"
          :disabled="disable"
          value-format="yyyy-MM-dd HH:mm:ss"
        />
      </el-form-item>
      <el-form-item label="装货重量" prop="loadWeight">
        <el-input-number v-model="form.loadWeight" placeholder="请输入装货过磅重量" :disabled="disable" controls-position="right" :min="0" style="width:90%;" />
      </el-form-item>
      <!-- <el-form-item label="装货地址" prop="loadAddress">
        <el-select
          v-model="form.loadAddress"
          placeholder="请选择车辆装货地址"
          clearable
          filterable
          size="small"
          style="width:90%;"
          :disabled="disable"
        >
          <el-option
            v-for="dict in loadAddressOptions"
            :key="dict.code"
            :label="dict.formattedAddress"
            :value="dict.code"
          />
        </el-select>
      </el-form-item> -->
      <el-form-item label="卸货地址" prop="unloadAddressCode">
        <el-select
          v-model="form.unloadAddressCode"
          placeholder="请选择车辆卸货地址"
          clearable
          filterable
          size="small"
          style="width:90%;"
          :disabled="disable"
        >
          <el-option
            v-for="dict in unloadAddressOptions"
            :key="dict.code"
            :label="dict.formattedAddress"
            :value="dict.code"
          />
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="实际承运车辆" prop="vehicleCode">
        <el-select
          v-model="form.vehicleCode"
          placeholder="请选择实际承运车辆"
          clearable
          filterable
          size="small"
          style="width:90%;"
          :disabled="disable"
        >
          <el-option
            v-for="dict in vehicleCodeOptions"
            :key="dict.code"
            :label="dict.licenseNumber"
            :value="dict.code"
          />
        </el-select>
      </el-form-item> -->
      <el-form-item label="装货单据" prop="attachmentCode">
        <uploadImage v-model="form.attachmentCode" />
      </el-form-item>
      <el-form-item label="装货备注" prop="remark">
        <el-input v-model="form.remark" type="textarea" :autosize="{ minRows: 2, maxRows: 4}" :disabled="disable" placeholder="请输入装货备注信息" style="width:90%;" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitForm">立即提交</el-button>
      <el-button @click="reset">重置</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { load, getAddress, getInfoDetail, loadCredentials } from '@/api/waybill/tracklist';
import UploadImage from '@/components/UploadImage/index';

export default {
  name: 'DialogA',
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
      // 装货地址选择
      // loadAddressOptions: [],
      // 卸货地址选择
      unloadAddressOptions: [],
      // 实际承运车辆
      // vehicleCodeOptions: [],
      // 表单参数
      form: {
      },
      // 运单信息
      waybill: {},
      // 装货信息
      loadinfo: {},
      // 表单校验
      rules: {
        loadTime: [
          { required: true, message: '装货时间不能为空', trigger: 'blur' }
        ],
        loadWeight: [
          { required: true, message: '装货重量不能为空', trigger: 'blur' }
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
        this.getAddress();
        // this.getVehicle();
        if (this.disable) {
          this.getDetail();
        } else {
          this.reset();
        }
      }
    }
  },
  created() {
  },
  methods: {
    // 获取装货详情
    getDetail() {
      this.reset();
      getInfoDetail(this.waybill.waybillNo).then(response => {
        console.log(response);
        const info = response.data[0];
        this.loadinfo = info;
        console.log(this.loadinfo);
        this.form.loadWeight = info.loadWeight;
        this.form.remark = info.remark;
        this.form.loadTime = info.cargoTime;
        // this.form.loadAddress = info.waybillAddressList[0].code;
        this.form.unloadAddressCode = info.waybillAddressList[1].code;
        this.form.attachmentCode = info.attachmentCode;
        // this.form.vehicleCode = info.vehicleCode;
      });
    },
    // 获取地址信息
    getAddress() {
      // console.log(data);
      getAddress(this.waybill.goodsCode).then(response => {
        const address = response.data;
        // const address1 = address.filter(item => {
        //   return item.addressType === 1;
        // });
        // this.loadAddressOptions = address1;
        const address2 = address.filter(item => {
          return item.addressType === 2;
        });
        this.unloadAddressOptions = address2;
      });
    },
    // 获取车辆列表
    // getVehicle() {
    //   getVehicle({ driverCode: this.waybill.driverCode }).then(response => {
    //     this.vehicleCodeOptions = response.rows;
    //     console.log(this.vehicleCodeOptions);
    //   });
    // },
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.disable) {
            loadCredentials(this.form).then(response => {
              this.msgSuccess('补装货凭证成功');
              this.close();
              this.$emit('refresh');
            });
          } else {
            load(this.form).then(response => {
              this.msgSuccess('车辆装货成功');
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
      this.unloadAddressOptions = [];
    },
    // 表单重置
    reset() {
      this.form = {
        code: this.waybill.code,
        loadTime: this.parseTime(new Date(), '{y}-{m}-{d} {h}:{i}:{s}'),
        loadWeight: null,
        attachmentCode: null,
        // 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
        // oneself: false,
        remark: null,
        // vehicleCode: null,
        // loadAddress: null,
        unloadAddressCode: null
      };
      // this.waybillAddressOptions = [];
      this.resetForm('form');
    },
    // 获取信息
    setForm(data) {
      this.waybill = data;
      this.form.code = this.waybill.code;
      // console.log(this.waybill);
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
