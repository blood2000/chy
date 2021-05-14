<template>
  <!-- 添加或修改车辆对话框 -->
  <el-dialog :class="[{'i-add':title==='新增'||title==='添加车辆'},{'i-check':title==='审核'}]" :title="title" :visible="visible" width="800px" append-to-body :close-on-click-modal="disable" @close="cancel">
    <el-form ref="form" :model="form" :rules="rules" :disabled="disable" label-width="140px">
      <!-- 车辆信息 -->
      <el-form-item label="车牌号" prop="licenseNumber">
        <el-select
          v-if="(teamCode || driverCode) && title!=='详情' && addVehicleType === 1"
          v-model="form.licenseNumber"
          v-el-select-loadmore="loadmore"
          filterable
          clearable
          remote
          reserve-keyword
          placeholder="通过车牌号码进行查询"
          class="width70"
          :remote-method="vehicleRemoteMethod"
          :loading="vehicleLoading"
          @change="vehicleChange"
        >
          <el-option
            v-for="item in vehicleOptions"
            :key="item.code"
            :label="item.licenseNumber"
            :value="item.code"
          />
        </el-select>
        <el-input v-if="addVehicleType === 0" v-model="form.licenseNumber" placeholder="请输入车牌号" :class="(teamCode || driverCode) && title!=='详情' ? 'width70' : 'width90'" clearable />
        <el-button v-if="(teamCode || driverCode) && title!=='详情'" type="text" style="width: 20%;text-decoration: underline;" @click="changeAddVehicleType">{{ addVehicleType === 0 ? '选择已有车辆' : '手动添加车辆' }}</el-button>
      </el-form-item>
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
      <!--<el-form-item label="车牌类型" prop="classificationCode">
        <el-select v-model="form.classificationCode" placeholder="请选择车牌类型" class="width90" clearable filterable>
          <el-option
            v-for="dict in licensePlateTypeOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>-->
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
        <el-input-number v-model="form.vehicleTotalWeight" :controls="false" :min="0" :max="1000000" placeholder="请输入车辆总重量" class="width90 unit-item" clearable />
        <span class="unit-span g-color-gray">吨</span>
      </el-form-item>
      <el-form-item label="车辆可载重量" prop="vehicleLoadWeight">
        <el-input-number v-model="form.vehicleLoadWeight" :controls="false" :min="0" :max="1000000" placeholder="请输入车辆可载重量" class="width90 unit-item" clearable />
        <span class="unit-span g-color-gray">吨</span>
      </el-form-item>
      <el-form-item label="车辆可载平方" prop="vehicleLoadVolume">
        <el-input v-model="form.vehicleLoadVolume" placeholder="请输入车辆可载平方" class="width90 unit-item" clearable />
        <span class="unit-span g-color-gray">m²</span>
      </el-form-item>
      <el-form-item label="车辆可载立方" prop="vehicleRemainingLoadVolume">
        <el-input v-model="form.vehicleRemainingLoadVolume" placeholder="请输入车辆可载立方" class="width90 unit-item" clearable />
        <span class="unit-span g-color-gray">m³</span>
      </el-form-item>
      <el-form-item label="车身自重" prop="selfRespect">
        <el-input v-model="form.selfRespect" placeholder="请输入车身自重" class="width90 unit-item" clearable />
        <span class="unit-span g-color-gray">吨</span>
      </el-form-item>
      <el-form-item label="车辆识别码" prop="chassisNumber">
        <el-input v-model="form.chassisNumber" placeholder="请输入车辆识别码" class="width90" clearable />
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
    <div v-if="title === '新增' || title === '编辑' || title === '添加车辆'" slot="footer" class="dialog-footer">
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
import { listInfo } from '@/api/assets/vehicle';
import { addInfo, updateInfo, authRead, examine, addDriverCar, addTeamCar } from '@/api/assets/vehicle';
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
    disable: Boolean,
    teamCode: {
      type: String,
      default: null
    },
    driverCode: {
      type: String,
      default: null
    }
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
          { required: true, message: '车牌号不能为空', trigger: 'blur' },
          { validator: this.formValidate.plateNo, trigger: ['blur', 'change'] }
        ]
      },
      // 选择车辆
      vehicleLoading: false,
      vehicleOptions: [],
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        licenseNumber: null
      },
      // 添加车辆方式
      addVehicleType: 0 // 0input  1select
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
    /*  this.getDicts('licensePlateType').then(response => {
        this.licensePlateTypeOptions = response.data;
      });*/
      // 车牌颜色
      this.getDicts('licenseColor').then(response => {
        this.licenseColorOptions = response.data;
      });
      // 车身颜色
      this.getDicts('CarBodyColor').then(response => {
        this.carBodyColorOptions = response.data;
      });
      // 车辆类型
      this.getDicts('licenseNumberType').then(response => {
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
          if (this.driverCode) {
            addDriverCar(Object.assign({}, this.form, { driverCode: this.driverCode })).then(response => {
              this.buttonLoading = false;
              this.msgSuccess('添加成功');
              this.close();
              this.$emit('refresh');
            }).catch(() => {
              this.buttonLoading = false;
            });
          } else if (this.teamCode) {
            addTeamCar(Object.assign({}, this.form, { teamCode: this.teamCode })).then(response => {
              this.buttonLoading = false;
              this.msgSuccess('添加成功');
              this.close();
              this.$emit('refresh');
            }).catch(() => {
              this.buttonLoading = false;
            });
          } else if (this.form.id) {
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
      this.addVehicleType = 0;
      this.resetVehicle();
    },
    resetVehicle() {
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
    },
    // 查询车辆列表
    getVehicleList() {
      listInfo(this.queryParams).then((response) => {
        this.vehicleLoading = false;
        this.vehicleOptions = [...this.vehicleOptions, ...response.rows];
      });
    },
    // 车辆远程搜索
    vehicleRemoteMethod(query) {
      if (query !== '') {
        this.vehicleLoading = true;
        this.queryParams.licenseNumber = query;
        this.queryParams.pageNum = 1;
        this.vehicleOptions = [];
        this.getVehicleList();
      } else {
        this.vehicleOptions = [];
      }
    },
    // 选择车辆远程搜索列表触底事件
    loadmore() {
      this.queryParams.pageNum++;
      this.getVehicleList();
    },
    // 获取选中的车辆回填
    vehicleChange(code) {
      if (!code || code === '') {
        this.reset();
        return;
      }
      this.vehicleOptions.forEach(el => {
        if (el.code === code) {
          this.form = { ...el };
        }
      });
    },
    // 切换添加车辆方式
    changeAddVehicleType() {
      if (this.addVehicleType === 0) {
        this.addVehicleType = 1;
      } else {
        this.addVehicleType = 0;
      }
      this.resetVehicle();
    }
  }
};
</script>

<style scoped lang="scss">
	.mr3{
	  margin-right: 3%;
	}
	.width90{
	  width: 90%;
	}
  .width70{
    width: 70%;
  }
	.width28{
	  width: 28%;
	}
	.el-input-number ::v-deep.el-input__inner{
	  text-align: left;
	}

  .unit-item{
    ::v-deep .el-input__inner{
      padding-right: 50px;
    }
    ::v-deep .el-input__suffix{
      right: 30px !important;
    }
  }
  .unit-span{
    position: absolute;
    right: 75px;
    top: 0;
  }
</style>
