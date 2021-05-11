<template>
  <!-- 车辆卸货对话框 -->
  <el-dialog :title="title" :visible="visible" width="800px" append-to-body destroy-on-close @close="cancel">
    <el-form ref="form" :model="form" :rules="disable ? rules: rule" label-width="130px">
      <el-form-item label="卸货时间" prop="unloadTime">
        <el-date-picker
          v-model="form.unloadTime"
          style="width:90%;"
          type="datetime"
          placeholder="选择日期时间"
          :default-value="new Date()"
          value-format="yyyy-MM-dd HH:mm:ss"
          @change="unloadTimeChoose"
        />
      </el-form-item>
      <el-form-item :label="weightLabel" prop="unloadWeight">
        <el-input-number v-model="form.unloadWeight" placeholder="请输入卸货数量" controls-position="right" style="width:90%;" />
      </el-form-item>
      <!-- <el-form-item label="卸货地址" prop="waybillAddress">
        <el-select
          v-model="form.waybillAddress"
          placeholder="请选择车辆卸货地址"
          clearable
          filterable
          size="small"
          style="width:90%;"
          :disabled="disable"
        >
          <el-option
            v-for="dict in waybillAddressOptions"
            :key="dict.code"
            :label="dict.formattedAddress"
            :value="dict.code"
          />
        </el-select>
      </el-form-item> -->
      <el-form-item label="卸货凭证" prop="attachmentCode">
        <uploadImage v-model="form.attachmentCode" />
      </el-form-item>
      <el-form-item label="卸货备注" prop="remark">
        <el-input v-model="form.remark" type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入装货备注信息" style="width:90%;" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitForm">立即提交</el-button>
      <el-button @click="cancel">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { unload, getInfoDetail, unloadCredentials } from '@/api/waybill/tracklist';
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
      // 卸货信息
      unloadinfo: {},
      // 表单校验
      rules: {
        unloadTime: [
          { required: true, message: '卸货时间不能为空', trigger: 'blur' }
        ],
        unloadWeight: [
          { required: true, message: '卸货重量不能为空', trigger: 'blur' }
        ],
        attachmentCode: [
          { required: true, message: '卸货单据不能为空', trigger: 'blur' }
        ]
      },
      rule: {
        unloadTime: [
          { required: true, message: '卸货时间不能为空', trigger: 'blur' }
        ]
      },
      // 日期格式
      time: '',
      fresh: false,
      // 卸车数量标签
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
  watch: {
    open(val) {
      if (val) {
        // this.reset();
        // this.getAddress();
        if (this.disable) {
          this.getDetail();
        }
      }
    }
  },
  created() {
  },
  methods: {
    unloadTimeChoose(e) {
      // var currentDateLong = new Date(currentdate.replace(new RegExp("-","gm"),"/")).getTime() // 格式化时间为long型
      const unloadtime = new Date(e);
      const loadtime = new Date(this.waybill.fillTime);
      const unloadtimeLong = new Date(e.replace(new RegExp('-', 'gm'), '/')).getTime();
      const loadtimeLong = new Date(this.waybill.fillTime.replace(new RegExp('-', 'gm'), '/')).getTime();
      const timeDifference = (unloadtimeLong - loadtimeLong) / (60 * 1000);
      // console.log(timeDifference);
      if (unloadtime <= loadtime) {
        this.$message({ type: 'warning', message: '卸货时间必须大于装货时间：' + this.waybill.fillTime });
        this.form.unloadTime = null;
      } else if (timeDifference < 5) {
        this.$message({ type: 'warning', message: '装卸货间隔时间过短，请重新选择卸货时间！' });
        this.form.unloadTime = null;
      } else if (unloadtime > new Date()) {
        this.$message({ type: 'warning', message: '卸货时间必须早于或等于当前时间！' });
        this.form.unloadTime = null;
      }
    },
    // 获取卸货详情
    getDetail() {
      this.reset();
      getInfoDetail(this.waybill.waybillNo, 2).then(response => {
        console.log(response);
        if (response.data.length) {
          const info = response.data[0];
          this.unloadinfo = info;
          console.log(info);
          this.form.unloadWeight = info.unloadWeight;
          this.form.unloadTime = info.unloadTime;
          this.form.remark = info.remark;
          // this.form.waybillAddress = info.waybillAddressList[0].orderAddressCode;
          this.form.attachmentCode = info.attachmentCode;
          this.fresh = true;
        } else {
          this.form.unloadTime = this.waybill.signTime;
          this.form.unloadWeight = this.waybill.loadWeight;
        }
      });
    },
    // 获取地址信息
    // getAddress() {
    //   getAddress(this.waybill.goodsCode).then(response => {
    //     const address = response.data;
    //     const address1 = address.filter(item => {
    //       return item.addressType === 2;
    //     });
    //     this.waybillAddressOptions = address1;
    //     console.log(this.waybillAddressOptions);
    //   });
    // },
    /** 提交按钮 */
    submitForm() {
      this.unloadTimeChoose(this.form.unloadTime);
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.disable) {
            if (this.waybill.stowageStatus === '2') {
              if (this.form.unloadWeight !== 1) {
                this.msgWarning('车数配载的运单卸货车数只能为1车！');
              } else {
                this.submitInfo();
              }
            } else {
              if (this.form.unloadWeight <= 0) {
                this.msgWarning('卸货重量或立方数必须大于0！');
              } else {
                this.submitInfo();
              }
            }
          } else {
            if (!this.form.attachmentCode && this.form.unloadWeight > 0) {
              this.$confirm('未上传卸货凭证，所填卸货数量无效，是否确定继续提交？', '提示', {
                confirmButtonText: '确定',
                cancerButtonText: '取消',
                type: 'warning'
              }).then(() => {
                unload(this.form).then(response => {
                  this.msgSuccess('车辆卸货成功');
                  this.close();
                  this.$emit('refresh');
                });
              });
            } else {
              unload(this.form).then(response => {
                this.msgSuccess('车辆卸货成功');
                this.close();
                this.$emit('refresh');
              });
            }
          }
        }
      });
    },
    // 提交信息，接口调用
    submitInfo() {
      unloadCredentials(this.form).then(response => {
        this.msgSuccess('补卸货凭证成功');
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
        code: this.waybill.code,
        unloadTime: this.parseTime(new Date(), '{y}-{m}-{d} {h}:{i}:{s}'),
        unloadWeight: null,
        attachmentCode: null,
        remark: null
        // waybillAddress: null
      };
      // this.waybillAddressOptions = [];
      this.resetForm('form');
    },
    // 表单赋值
    setForm(data) {
      this.waybill = data;
      this.form = {
        ...this.form,
        code: this.waybill.code,
        unloadWeight: data.loadWeight - 0
      };
      if (this.waybill.stowageStatus === '0') {
        this.weightLabel = '卸货重量（吨）';
      } else if (this.waybill.stowageStatus === '1') {
        this.weightLabel = '卸货立方数';
      } else if (this.waybill.stowageStatus === '2') {
        this.weightLabel = '卸货车数';
        this.form.loadWeight = 1;
      } else {
        this.weightLabel = '卸货重量（吨）';
      }
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
