<template>
  <el-dialog :title="title" :visible="visible" width="800px" append-to-body @close="cancel">
    <el-form ref="form" :model="form" :rules="rules" label-width="180px">
      <el-form-item label="司机/调度" prop="driverRole">
        <el-select
          class="width90"
          v-model="form.driverRole"
          clearable
          size="small"
        >
          <el-option
            v-for="dict in roleOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="联系人姓名" prop="driverName">
        <el-input v-model="form.driverName" placeholder="支持自动识别" size="small" class="width90"/>
      </el-form-item>
      <el-form-item label="联系人电话" prop="driverTelephone">
        <el-input v-model="form.driverTelephone" placeholder="请输入手机号码" size="small" class="width90"/>
      </el-form-item>
      <el-form-item label="密码" prop="driverPassword">
        <el-input v-model="form.driverPassword" placeholder="请输入密码" type="password" size="small" class="width90" />
      </el-form-item>
      <el-form-item label="身份证号" prop="driverIDCard">
        <el-input v-model="form.driverIDCard" placeholder="支持自动识别" size="small" class="width90"/>
      </el-form-item>
      <el-form-item label="从业资格证" prop="driverCertificate">
        <el-input v-model="form.driverCertificate" placeholder="请输入从业资格证" size="small" class="width90"/>
      </el-form-item>
      <el-form-item label="从业资格证到期日期" prop="driverCertificateTime">
        <el-input v-model="form.driverCertificateTime" size="small" class="width90"/>
      </el-form-item>
      <el-form-item label="从业资格证办理省份" prop="driverCertificateProvince">
        <el-select
          v-model="form.driverCertificateProvince"
          clearable
          size="small"
          class="width28 mr3"
        >
          <el-option
            v-for="dict in provinceOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="结算方式" prop="driverSettlementType">
        <el-select
          v-model="form.driverSettlementType"
          clearable
          size="small"
          class="width90"
        >
          <el-option
            v-for="dict in settlementTypeOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="所在区域" prop="driverArea">
        <el-select
          v-model="form.driverProvince"
          clearable
          size="small"
          class="width28 mr3"
        >
          <el-option
            v-for="dict in provinceOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
        <el-select
          v-model="form.driverCity"
          clearable
          size="small"
          class="width28 mr3"
        >
          <el-option
            v-for="dict in cityOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
        <el-select
          v-model="form.driverCounty"
          clearable
          size="small"
          class="width28"
        >
          <el-option
            v-for="dict in countyOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="驾驶证类型" prop="driverLicense">
        <el-input v-model="form.driverLicense" placeholder="请输入驾驶证类型" size="small" class="width90"/>
      </el-form-item>
      <el-form-item label="驾驶证号" prop="driverLicenseNumber">
        <el-input v-model="form.driverLicenseNumber" placeholder="支持自动识别" size="small" class="width90"/>
      </el-form-item>
      <el-form-item label="驾驶证发证机关" prop="driverLicenseUnit">
        <el-input v-model="form.driverLicenseUnit" placeholder="请输入驾驶证发证机关" size="small" class="width90"/>
      </el-form-item>
      <el-form-item label="驾驶证有效期自" prop="validPeriodFrom">
        <el-date-picker clearable size="small" class="width90"
          v-model="form.validPeriodFrom"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择驾驶证有效期自">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="驾驶证有效期至" prop="validPeriodTo">
        <el-date-picker clearable size="small" class="width90"
          v-model="form.validPeriodTo"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择驾驶证有效期至">
        </el-date-picker>
      </el-form-item>

      <el-form-item label="工作单位" prop="driverWorkUnit">
        <el-input v-model="form.driverWorkUnit" placeholder="请输入工作单位" size="small" class="width90"/>
      </el-form-item>
      <el-form-item label="道路运输经营许可证号" prop="driverRoadNumber">
        <el-input v-model="form.driverRoadNumber" placeholder="请输入道路运输经营许可证号" size="small" class="width90"/>
      </el-form-item>
      <el-form-item label="车牌号" prop="driverPlateNumber">
        <el-input v-model="form.driverPlateNumber" placeholder="请输入车牌号" size="small" class="width90"/>
      </el-form-item>
      <el-form-item label="定位来源" prop="driverLocationSource">
        <el-select
          v-model="form.driverLocationSource"
          clearable
          size="small"
          class="width90"
        >
          <el-option
            v-for="dict in locationSourceOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      
      <el-form-item>
        <upload-image></upload-image>
      </el-form-item>



    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitForm">确 定</el-button>
      <el-button @click="cancel">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { addConfig, updateConfig } from "@/api/assets/driver";
import UploadImage from '@/components/UploadImage/index';

export default {
  props: {
    title: String,
    open: Boolean
  },
  components: {
    UploadImage
  },
  data() {
    return {
      // 字典
      roleOptions: [
        {dictLabel: '司机', dictValue: '司机'},
        {dictLabel: '调度', dictValue: '调度'}
      ],
      isOptions: [
        {dictLabel: '是', dictValue: '是'},
        {dictLabel: '否', dictValue:'否'}
      ],
      // 区域字典
      provinceOptions: [],
      cityOptions: [],
      countyOptions: [],
      // 结算方式字典
      settlementTypeOptions: [
        {dictLabel: '次结', dictValue: '次结'},
        {dictLabel: '月结', dictValue:'月结'}
      ],
      // 定位来源字典
      locationSourceOptions: [
        {dictLabel: '中交兴路', dictValue: '中交兴路'},
        {dictLabel: 'APP端', dictValue:'APP端'},
        {dictLabel: 'GPS硬件', dictValue:'GPS硬件'}
      ],


      // 表单参数
      form: {},
      // 表单校验
      rules: {
        shipmentTelephone: [
          { required: true, message: "手机号码不能为空", trigger: "blur" }
        ],
        shipmentName: [
          { required: true, message: "姓名不能为空", trigger: "blur" }
        ],
        shipmentIDCard: [
          { required: true, message: "身份证号不能为空", trigger: "blur" }
        ],
        shipmentArea: [
          { required: true, message: "所在区域不能为空", trigger: "blur" }
        ],
        shipmentAddress: [
          { required: true, message: "详细地址不能为空", trigger: "blur" }
        ],
        shipmentServiceRatio: [
          { required: true, message: "服务费比例不能为空", trigger: "blur" }
        ],
        shipmentTaxTate: [
          { required: true, message: "服务费税率不能为空", trigger: "blur" }
        ],
        shipmentGoZero: [
          { required: true, message: "去零不能为空", trigger: "blur" }
        ],
        shipmentConsume: [
          { required: true, message: "合理路耗不能为空", trigger: "blur" }
        ],
        shipmentCompany: [
          { required: true, message: "公司名称不能为空", trigger: "blur" }
        ],
        shipmentSocialCode: [
          { required: true, message: "统一社会信用代码不能为空", trigger: "blur" }
        ]
      }
    }
  },
  computed: {
    visible: {
      get() {
        return this.open;
      },
      set(v) {
        this.$emit("update:open", v);
      },
    },
  },
  created() {
    
  },
  methods: {
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.configId != undefined) {
            updateConfig(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.close();
              this.$emit('refresh');
            });
          } else {
            addConfig(this.form).then(response => {
              this.msgSuccess("新增成功");
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
      this.$emit("update:open", false);
    },
    // 表单重置
    reset() {
      this.form = {
        configId: undefined,
        shipmentName: undefined,
        configValue: undefined,
        configType: "Y",
        remark: undefined
      };
      this.resetForm("form");
    },
  }
}
</script>

<style scoped>
.mr3{
  margin-right: 3%;
}
.width90{
  width: 90%;
}
.width28{
  width: 28%;
}
</style>