<template>
  <!-- 添加或修改车辆对话框 -->
  <el-dialog :title="title" :visible="visible" width="800px" append-to-body @close="cancel">
    <el-form ref="form" :model="form" :rules="rules" :disabled="disable" label-width="140px">
      <!-- <el-form-item label="编码" prop="code">
		    <el-input v-model="form.code" placeholder="请输入编码" />
		  </el-form-item> -->
      <el-form-item label="名称" prop="licenseNumber">
        <el-input v-model="form.licenseNumber" placeholder="请输入名称" class="width90" clearable />
      </el-form-item>
      <el-form-item label="车主编码" prop="vehicleOwnerCode">
        <el-input v-model="form.vehicleOwnerCode" placeholder="请输入车主编码" class="width90" clearable />
      </el-form-item>
      <el-form-item label="车辆归属类型" prop="vehicleAscriptionType">
        <el-select v-model="form.vehicleAscriptionType" placeholder="请选择车辆归属类型 0.自有 1.加盟" class="width90" clearable>
          <el-option
            v-for="dict in vehicleAscriptionTypeOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="parseInt(dict.dictValue)"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="车牌类型代码" prop="classificationCode">
        <el-input v-model="form.classificationCode" placeholder="请输入车牌类型代码" class="width90" clearable />
      </el-form-item>
      <el-form-item label="车牌颜色代码" prop="vehicleLicenseColorCode">
        <el-input v-model="form.vehicleLicenseColorCode" placeholder="请输入车牌颜色代码" class="width90" clearable />
      </el-form-item>
      <el-form-item label="车身颜色代码" prop="vehicleColorCode">
        <el-input v-model="form.vehicleColorCode" placeholder="请输入车身颜色代码" class="width90" clearable />
      </el-form-item>
      <el-form-item label="车辆类型代码" prop="vehicleTypeCode">
        <el-select v-model="form.vehicleTypeCode" placeholder="请选择车辆类型代码" class="width90" clearable>
          <el-option
            v-for="dict in vehicleTypeOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
        <!-- <el-input v-model="form.vehicleTypeCode" placeholder="请输入车辆类型代码" class="width90" clearable /> -->
      </el-form-item>
      <el-form-item label="车辆能源类型" prop="vehicleEnergyType">
        <el-select v-model="form.vehicleEnergyType" placeholder="请选择车辆能源类型" class="width90" clearable>
          <el-option
            v-for="dict in vehicleEnergyTypeOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="车长代码" prop="vehicleLength">
        <el-select v-model="form.vehicleLength" placeholder="请选择车长代码" class="width90" clearable>
          <el-option
            v-for="dict in vehicleLengthOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
        <!-- <el-input v-model="form.vehicleLength" placeholder="请输入车长代码" class="width90" clearable /> -->
      </el-form-item>
      <el-form-item label="车宽代码" prop="vehicleWidth">
        <el-select v-model="form.vehicleWidth" placeholder="请选择车宽代码" class="width90" clearable>
          <el-option
            v-for="dict in vehicleWidthOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
        <!-- <el-input v-model="form.vehicleWidth" placeholder="请输入车宽代码" class="width90" clearable /> -->
      </el-form-item>
      <el-form-item label="车高代码" prop="vehicleHeight">
        <el-select v-model="form.vehicleHeight" placeholder="请选择车高代码" class="width90" clearable>
          <el-option
            v-for="dict in vehicleHeightOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
        <!-- <el-input v-model="form.vehicleHeight" placeholder="请输入车高代码" class="width90" clearable /> -->
      </el-form-item>
      <el-form-item label="车辆总重量" prop="vehicleTotalWeight">
        <el-select v-model="form.vehicleTotalWeight" placeholder="请选择车辆总重量" class="width90" clearable>
          <el-option
            v-for="dict in vehicleTonnageOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
        <!-- <el-input v-model="form.vehicleLoadWeight" placeholder="请输入车辆可载重量" class="width90" clearable /> -->
      </el-form-item>
      <el-form-item label="车辆可载重量" prop="vehicleLoadWeight">
        <el-select v-model="form.vehicleLoadWeight" placeholder="请选择车辆可载重量" class="width90" clearable>
          <el-option
            v-for="dict in vehicleTonnageOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
        <!-- <el-input v-model="form.vehicleLoadWeight" placeholder="请输入车辆可载重量" class="width90" clearable /> -->
      </el-form-item>
      <el-form-item label="车辆可载平方" prop="vehicleLoadVolume">
        <el-input v-model="form.vehicleLoadVolume" placeholder="请输入车辆可载平方" class="width90" clearable />
      </el-form-item>
      <el-form-item label="车辆可载立方" prop="vehicleRemainingLoadVolume">
        <el-select v-model="form.vehicleRemainingLoadVolume" placeholder="请选择车辆可载立方" class="width90" clearable>
          <el-option
            v-for="dict in vehicleCubeOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
        <!-- <el-input v-model="form.vehicleRemainingLoadVolume" placeholder="请输入车辆可载立方" class="width90" clearable /> -->
      </el-form-item>
      <el-form-item label="车身自重" prop="selfRespect">
        <el-select v-model="form.selfRespect" placeholder="请选择车身自重" class="width90" clearable>
          <el-option
            v-for="dict in vehicleTonnageOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
        <!-- <el-input v-model="form.selfRespect" placeholder="请输入车身自重" class="width90" clearable /> -->
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
        <el-select v-model="form.axesNumber" placeholder="请选择轴数" class="width90" clearable>
          <el-option
            v-for="dict in vehicleZhoushuOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
        <!-- <el-input v-model="form.axesNumber" placeholder="请输入轴数" class="width90" clearable /> -->
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
      <el-form-item label="审核状态">
        <el-radio-group v-model="form.authStatus">
          <el-radio
            v-for="dict in authStatusOptions"
            :key="dict.dictValue"
            :label="parseInt(dict.dictValue)"
          >{{ dict.dictLabel }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="是否冻结" prop="isFreeze">
        <el-select v-model="form.isFreeze" placeholder="请选择是否冻结 0.正常 1.冻结" class="width90" clearable>
          <el-option
            v-for="dict in isFreezeOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="车头正面照">
        <uploadImage v-model="form.vehicleImage" />
      </el-form-item>
      <!-- <el-form-item label="创建人" prop="createCode">
		    <el-input v-model="form.createCode" placeholder="请输入创建人" />
		  </el-form-item> -->
      <!-- <el-form-item label="更新人" prop="updateCode">
		    <el-input v-model="form.updateCode" placeholder="请输入更新人" />
		  </el-form-item>
		  <el-form-item label="是否删除" prop="delFlag">
		    <el-input v-model="form.delFlag" placeholder="请输入是否删除(0正常1删除)" />
		  </el-form-item> -->
      <!-- <el-form-item label="主键" prop="id">
		    <el-input v-model="form.id" placeholder="请输入主键" />
		  </el-form-item> -->
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitForm">确 定</el-button>
      <el-button @click="cancel">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { addInfo, updateInfo } from '@/api/assets/vehicle';
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
  	  // 车长代码字典
  	  vehicleLengthOptions: [],
  	  // 车宽代码字典
  	  vehicleWidthOptions: [],
  	  // 车高代码字典
  	  vehicleHeightOptions: [],
  	  // 轴数字典
  	  vehicleZhoushuOptions: [],
  	  // 立方代码字典
  	  vehicleCubeOptions: [],
  	  // 吨位代码字典
  	  vehicleTonnageOptions: [],
  	  // 车辆类型字典
  	  vehicleTypeOptions: [],
  	  // 车辆归属类型 0.自有 1.加盟字典
  	  vehicleAscriptionTypeOptions: [
  	    { dictLabel: '自有', dictValue: '0' },
  	    { dictLabel: '加盟', dictValue: '1' }
  	  ],
  	  // 车辆能源类型字典
  	  vehicleEnergyTypeOptions: [],
  	  // 审核状态(0.未审核.1审核中2审核未通过3审核通过)字典
  	  authStatusOptions: [
  	    { dictLabel: '未审核', dictValue: '0' },
  	    { dictLabel: '审核中', dictValue: '1' },
  	    { dictLabel: '审核未通过', dictValue: '2' },
  	    { dictLabel: '审核通过', dictValue: '3' }
  	  ],
  	  // 是否冻结(0正常1冻结)字典
  	  isFreezeOptions: [
  	    { dictLabel: '正常', dictValue: '0' },
  	    { dictLabel: '冻结', dictValue: '1' }
  	  ],
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        licenseNumber: [
          { required: true, message: '名称不能为空', trigger: 'blur' }
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
    this.getDicts('energyTypes').then(response => {
      this.vehicleEnergyTypeOptions = response.data;
    });
    this.getDicts('vehicleLength').then(response => {
      this.vehicleLengthOptions = response.data;
    });
    this.getDicts('vehicleWidth').then(response => {
      this.vehicleWidthOptions = response.data;
    });
    this.getDicts('vehicleHeight').then(response => {
      this.vehicleHeightOptions = response.data;
    });
    this.getDicts('vehicleZhoushu').then(response => {
      this.vehicleZhoushuOptions = response.data;
    });
    this.getDicts('vehicleCube').then(response => {
      this.vehicleCubeOptions = response.data;
    });
    this.getDicts('vehicleType').then(response => {
      this.vehicleTypeOptions = response.data;
    });
    this.getDicts('vehicleTonnage').then(response => {
      this.vehicleTonnageOptions = response.data;
    });
  },
  methods: {
    /** 提交按钮 */
    submitForm() {
	  this.$refs['form'].validate(valid => {
	    if (valid) {
	      if (this.form.id != null) {
	        updateInfo(this.form).then(response => {
	          this.msgSuccess('修改成功');
	          this.close();
	          this.$emit('refresh');
	        });
	      } else {
	        addInfo(this.form).then(response => {
	          this.msgSuccess('新增成功');
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
	    id: null,
	    code: null,
	    licenseNumber: null,
	    vehicleOwnerCode: null,
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
    }
  }
};
</script>

<style scoped>
	.mr3{
	  margin-right: 3%;
	}
	.width90{
	  width: 90% !important;
	}
	.width28{
	  width: 28%;
	}
	.el-input-number ::v-deep.el-input__inner{
	  text-align: left;
	}
</style>
