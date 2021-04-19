<template>
  <!-- 添加或修改车辆对话框 -->
  <el-dialog :title="title" :visible="visible" width="800px" append-to-body :close-on-click-modal="disable" @close="cancel">
    <el-form ref="form" :model="form" :rules="rules" :disabled="disable" label-width="140px">
      <el-form-item label="车牌号" prop="licenseNumber">
        <el-input v-model="form.licenseNumber" placeholder="请输入车牌号" class="width90" clearable />
      </el-form-item>
      <!-- <el-form-item label="车主编码" prop="vehicleOwnerCode">
        <el-input v-model="form.vehicleOwnerCode" placeholder="请输入车主编码" class="width90" clearable />
      </el-form-item> -->
      <el-form-item label="车辆归属类型" prop="vehicleAscriptionType">
        <el-select v-model="form.vehicleAscriptionType" placeholder="请选择车辆归属类型" class="width90" clearable filterable>
          <el-option
            v-for="dict in vehicleAscriptionTypeOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="parseInt(dict.dictValue)"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="车牌类型" prop="classificationCode">
        <el-select v-model="form.classificationCode" placeholder="请选择车牌类型" class="width90" clearable filterable>
          <el-option
            v-for="dict in licensePlateTypeOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="车牌颜色" prop="vehicleLicenseColorCode">
        <el-select v-model="form.vehicleLicenseColorCode" placeholder="请选择车牌颜色" class="width90" clearable filterable>
          <el-option
            v-for="dict in licenseColorOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="车身颜色" prop="vehicleColorCode">
        <el-select v-model="form.vehicleColorCode" placeholder="请选择车身颜色" class="width90" clearable filterable>
          <el-option
            v-for="dict in carBodyColorOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="车辆类型" prop="vehicleTypeCode">
        <el-select v-model="form.vehicleTypeCode" placeholder="请选择车辆类型" class="width90" clearable filterable>
          <el-option
            v-for="dict in vehicleTypeOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="车辆能源类型" prop="vehicleEnergyType">
        <el-select v-model="form.vehicleEnergyType" placeholder="请选择车辆能源类型" class="width90" clearable filterable>
          <el-option
            v-for="dict in energyTypesOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="车长" prop="vehicleLength">
        <el-select v-model="form.vehicleLength" placeholder="请选择车长" class="width90" clearable filterable>
          <el-option
            v-for="dict in vehicleLengthOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="车宽" prop="vehicleWidth">
        <el-select v-model="form.vehicleWidth" placeholder="请选择车宽" class="width90" clearable filterable>
          <el-option
            v-for="dict in vehicleWidthOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="车高" prop="vehicleHeight">
        <el-select v-model="form.vehicleHeight" placeholder="请选择车高" class="width90" clearable filterable>
          <el-option
            v-for="dict in vehicleHeightOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="车辆总重量" prop="vehicleTotalWeight">
        <el-input v-model="form.vehicleTotalWeight" placeholder="请输入车辆总重量" class="width90" clearable />
      </el-form-item>
      <el-form-item label="车辆可载重量" prop="vehicleLoadWeight">
        <el-input v-model="form.vehicleLoadWeight" placeholder="请输入车辆可载重量" class="width90" clearable />
      </el-form-item>
      <el-form-item label="车辆可载平方" prop="vehicleLoadVolume">
        <el-input v-model="form.vehicleLoadVolume" placeholder="请输入车辆可载平方" class="width90" clearable />
      </el-form-item>
      <el-form-item label="车辆可载立方" prop="vehicleRemainingLoadVolume">
        <el-input v-model="form.vehicleRemainingLoadVolume" placeholder="请输入车辆可载立方" class="width90" clearable />
      </el-form-item>
      <el-form-item label="车身自重" prop="selfRespect">
        <el-input v-model="form.selfRespect" placeholder="请输入车身自重" class="width90" clearable />
      </el-form-item>
      <el-form-item label="车架号" prop="chassisNumber">
        <el-input v-model="form.chassisNumber" placeholder="请输入车架号" class="width90" clearable />
      </el-form-item>
      <el-form-item label="发动机号" prop="engineNumber">
        <el-input v-model="form.engineNumber" placeholder="请输入发动机号" class="width90" clearable />
      </el-form-item>
      <el-form-item label="底盘号" prop="vehicleChassisNumber">
        <el-input v-model="form.vehicleChassisNumber" placeholder="请输入底盘号" class="width90" clearable />
      </el-form-item>
      <el-form-item label="功率" prop="vehiclePower">
        <el-input v-model="form.vehiclePower" placeholder="请输入功率" class="width90" clearable />
      </el-form-item>
      <el-form-item label="轴数" prop="axesNumber">
        <el-select v-model="form.axesNumber" placeholder="请选择轴数" class="width90" clearable filterable>
          <el-option
            v-for="dict in axisTypeOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="年审时间" prop="annualVerificationDate">
        <el-date-picker
          v-model="form.annualVerificationDate"
          clearable
          size="small"
          class="width90"
          placeholder="请选择年审时间"
          type="date"
          value-format="yyyy-MM-dd"
        />
      </el-form-item>
      <el-form-item label="运输介子" prop="transportMeson">
        <el-input v-model="form.transportMeson" placeholder="请输入运输介子" class="width90" clearable />
      </el-form-item>
      <el-form-item label="是否冻结" prop="isFreeze">
        <el-select v-model="form.isFreeze" placeholder="请选择是否冻结" class="width90" clearable filterable>
          <el-option
            v-for="dict in isFreezeOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="车头正面照">
        <upload-image v-model="form.vehicleImage" :disabled="disable" />
      </el-form-item>
    </el-form>
    <div v-if="title === '新增' || title === '编辑'" slot="footer" class="dialog-footer">
      <el-button type="primary" :loading="buttonLoading" @click="submitForm">确 定</el-button>
      <el-button @click="cancel">取 消</el-button>
    </div>
    <div v-if="title === '审核'" slot="footer" class="dialog-footer">
      <el-button type="primary" @click="reviewForm(3)">审核通过</el-button>
      <el-button type="danger" @click="reviewForm(2)">审核不通过</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { addInfo, updateInfo, authRead, examine } from '@/api/assets/vehicle';
import UploadImage from '@/components/UploadImage/index';

export default {
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
      buttonLoading: false,
      // 车牌类型字典
      licensePlateTypeOptions: [],
      // 车牌颜色字典
      licenseColorOptions: [],
      // 车身颜色字典
      carBodyColorOptions: [],
      // 车辆类型字典
  	  vehicleTypeOptions: [],
      // 能源类型字典
  	  energyTypesOptions: [],
  	  // 车长字典
  	  vehicleLengthOptions: [],
  	  // 车宽字典
  	  vehicleWidthOptions: [],
  	  // 车高字典
  	  vehicleHeightOptions: [],
  	  // 轴数字典
  	  axisTypeOptions: [],
  	  // 车辆归属类型字典
  	  vehicleAscriptionTypeOptions: [
  	    { dictLabel: '自有', dictValue: 0 },
  	    { dictLabel: '加盟', dictValue: 1 }
  	  ],
  	  // 是否冻结字典
  	  isFreezeOptions: [
  	    { dictLabel: '正常', dictValue: 0 },
  	    { dictLabel: '冻结', dictValue: 1 }
  	  ],
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        licenseNumber: [
          { required: true, message: '车牌号不能为空', trigger: 'blur' }
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
    this.getDictsList();
  },
  methods: {
    /** 查询字典 */
    getDictsList() {
      // 车牌类型
      this.getDicts('licensePlateType').then(response => {
        this.licensePlateTypeOptions = response.data;
      });
      // 车牌颜色
      this.getDicts('licenseColor').then(response => {
        this.licenseColorOptions = response.data;
      });
      // 车身颜色
      this.getDicts('CarBodyColor').then(response => {
        this.carBodyColorOptions = response.data;
      });
      // 车辆类型
      this.getDicts('vehicleType').then(response => {
        this.vehicleTypeOptions = response.data;
      });
      // 能源类型
      this.getDicts('energyTypes').then(response => {
        this.energyTypesOptions = response.data;
      });
      // 车长
      this.getDicts('vehicleLength').then(response => {
        this.vehicleLengthOptions = response.data;
      });
      // 车宽
      this.getDicts('vehicleWidth').then(response => {
        this.vehicleWidthOptions = response.data;
      });
      // 车高
      this.getDicts('vehicleHeight').then(response => {
        this.vehicleHeightOptions = response.data;
      });
      // 轴数
      this.getDicts('axis_type').then(response => {
        this.axisTypeOptions = response.data;
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.buttonLoading = true;
          if (this.form.id) {
            updateInfo(this.form).then(response => {
              this.buttonLoading = false;
              this.msgSuccess('修改成功');
              this.close();
              this.$emit('refresh');
            }).catch(() => {
              this.buttonLoading = false;
            });
          } else {
            addInfo(this.form).then(response => {
              this.buttonLoading = false;
              this.msgSuccess('新增成功');
              this.close();
              this.$emit('refresh');
            }).catch(() => {
              this.buttonLoading = false;
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
      this.buttonLoading = false;
      this.form = {
        id: null,
        code: null,
        licenseNumber: null,
        // vehicleOwnerCode: null,
        vehicleAscriptionType: null,
        classificationCode: null,
        vehicleLicenseColorCode: null,
        vehicleColorCode: null,
        vehicleTypeCode: null,
        vehicleEnergyType: null,
        vehicleLength: null,
        vehicleWidth: null,
        vehicleHeight: null,
        vehicleTotalWeight: null,
        vehicleLoadWeight: null,
        vehicleLoadVolume: null,
        vehicleRemainingLoadVolume: null,
        selfRespect: null,
        chassisNumber: null,
        engineNumber: null,
        vehicleChassisNumber: null,
        vehiclePower: null,
        axesNumber: null,
        annualVerificationDate: null,
        transportMeson: null,
        authStatus: 0,
        isFreeze: null,
        createCode: null,
        createTime: null,
        updateCode: null,
        updateTime: null,
        delFlag: null
      };
      this.resetForm('form');
    },
    // 表单赋值
    setForm(data) {
	    this.form = data;
    },
    // 已读
    authRead() {
      authRead({
        authStatus: 1,
        code: this.form.code
      }).then(response => {
        this.$emit('refresh');
      });
    },
    /** 审核通过/未通过按钮 */
    reviewForm(key) {
      examine({
        authStatus: key,
        code: this.form.code
      }).then(response => {
        this.msgSuccess('操作成功');
        this.close();
        this.$emit('refresh');
      });
    }
  }
};
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
	.el-input-number ::v-deep.el-input__inner{
	  text-align: left;
	}
</style>
