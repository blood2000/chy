<template>
  <!-- 添加或修改车辆对话框 -->
  <el-dialog :class="[{'i-add':title==='新增'||title==='添加车辆'},{'i-check':title==='审核'}]" :title="title" :visible="visible" width="800px" append-to-body :close-on-click-modal="disable" @close="cancel">
    <el-form ref="form" :model="form" :rules="rules" label-width="140px">
      <!-- 车辆信息 -->
      <el-form-item label="车牌号" prop="licenseNumber">
        <el-select
          v-if="(teamCode || driverCode) && title!=='详情' && addVehicleType === 1"
          v-model="form.licenseNumber"
          v-el-select-loadmore="loadmore"
          :disabled="disable"
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
      <el-form-item label="车牌颜色" prop="vehicleLicenseColorCode">
        <el-select v-model="form.vehicleLicenseColorCode" placeholder="请选择车牌颜色" class="width90" :disabled="disable" clearable filterable>
          <el-option
            v-for="dict in licenseColorOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="车辆归属类型" prop="vehicleAscriptionType">
        <el-select v-model="form.vehicleAscriptionType" placeholder="请选择车辆归属类型" class="width90" clearable filterable>
          <el-option
            v-for="dict in vehicleAscriptionTypeOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="parseInt(dict.dictValue)"
          />
        </el-select>
      </el-form-item> -->
      <el-form-item label="车辆类型" prop="vehicleTypeCode">
        <el-select v-model="form.vehicleTypeCode" placeholder="请选择车辆类型" class="width90" :disabled="disable" clearable filterable>
          <el-option
            v-for="dict in vehicleTypeOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="车辆识别码" prop="chassisNumber">
        <el-input v-model="form.chassisNumber" placeholder="请输入车辆识别码" class="width90" clearable :disabled="disable" />
      </el-form-item>
      <el-form-item label="车辆能源类型" prop="vehicleEnergyType">
        <el-select v-model="form.vehicleEnergyType" placeholder="请选择车辆能源类型" class="width90" clearable filterable :disabled="disable">
          <el-option
            v-for="dict in energyTypesOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="道路运输许可证号" prop="roadTransportCertificateNumber">
        <el-input v-model="form.roadTransportCertificateNumber" placeholder="请输入道路运输许可证号" class="width90" clearable :disabled="disable" />
      </el-form-item>
      <el-form-item label="车身颜色" prop="vehicleColorCode">
        <el-select v-model="form.vehicleColorCode" placeholder="请选择车身颜色" class="width90" clearable filterable :disabled="disable">
          <el-option
            v-for="dict in carBodyColorOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="车长" prop="vehicleLength">
        <el-select v-model="form.vehicleLength" placeholder="请选择车长" class="width90" clearable filterable :disabled="disable">
          <el-option
            v-for="dict in vehicleLengthOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="车宽" prop="vehicleWidth">
        <el-select v-model="form.vehicleWidth" placeholder="请选择车宽" class="width90" clearable filterable :disabled="disable">
          <el-option
            v-for="dict in vehicleWidthOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="车高" prop="vehicleHeight">
        <el-select v-model="form.vehicleHeight" placeholder="请选择车高" class="width90" clearable filterable :disabled="disable">
          <el-option
            v-for="dict in vehicleHeightOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="车辆总重量" prop="vehicleTotalWeight">
        <el-input-number v-model="form.vehicleTotalWeight" :controls="false" :precision="3" :min="0" :max="1000000" placeholder="请输入车辆总重量" class="width90 unit-item" clearable :disabled="disable" />
        <span class="unit-span g-color-gray">吨</span>
      </el-form-item>
      <el-form-item label="车辆可载重量" prop="vehicleLoadWeight">
        <el-input-number v-model="form.vehicleLoadWeight" :controls="false" :precision="3" :min="0" :max="1000000" placeholder="请输入车辆可载重量" class="width90 unit-item" clearable :disabled="disable" />
        <span class="unit-span g-color-gray">吨</span>
      </el-form-item>
      <!-- <el-form-item label="车辆可载平方" prop="vehicleLoadVolume">
        <el-input v-model="form.vehicleLoadVolume" placeholder="请输入车辆可载平方" class="width90 unit-item" clearable />
        <span class="unit-span g-color-gray">m²</span>
      </el-form-item> -->
      <el-form-item label="车辆可载立方" prop="vehicleRemainingLoadVolume">
        <el-input-number v-model="form.vehicleRemainingLoadVolume" :controls="false" :precision="3" :min="0" :max="10000000" placeholder="请输入车辆可载立方" class="width90 unit-item" clearable :disabled="disable" />
        <span class="unit-span g-color-gray">m³</span>
      </el-form-item>
      <!-- <el-form-item label="发动机号" prop="engineNumber">
        <el-input v-model="form.engineNumber" placeholder="请输入发动机号" class="width90" clearable />
      </el-form-item>
      <el-form-item label="底盘号" prop="vehicleChassisNumber">
        <el-input v-model="form.vehicleChassisNumber" placeholder="请输入底盘号" class="width90" clearable />
      </el-form-item>
      <el-form-item label="功率" prop="vehiclePower">
        <el-input v-model="form.vehiclePower" placeholder="请输入功率" class="width90" clearable />
      </el-form-item> -->
      <el-form-item label="轴数" prop="axesNumber">
        <el-select v-model="form.axesNumber" placeholder="请选择轴数" class="width90" clearable filterable :disabled="disable">
          <el-option
            v-for="dict in axisTypeOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="年审时间" prop="annualVerificationDate">
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
      </el-form-item> -->
      <el-form-item label="是否冻结" prop="isFreeze">
        <el-select v-model="form.isFreeze" placeholder="请选择是否冻结" class="width90" clearable filterable :disabled="disable">
          <el-option
            v-for="dict in isFreezeOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <!--<el-form-item label="车头正面照" prop="vehicleImage">
        <upload-image v-model="form.vehicleImage" :disabled="disable" icon-type="vehicle_head" />
      </el-form-item>-->
      <el-form-item>
        <!-- 只有图片上传禁用的时候才能使用v-viewer查看大图，复制两份判断 -->
        <el-row v-if="disable" v-viewer>
          <el-col :span="7" class="mb">
            <p class="upload-image-label">行驶证</p>
            <upload-image v-model="form.vehicleLicenseImg" :disabled="disable" image-type="vehicle-license" side="front" icon-type="vehicle" @fillForm="fillForm" />
          </el-col>
          <el-col :span="7" class="mb">
            <p class="upload-image-label">行驶证副页</p>
            <upload-image v-model="form.vehicleLicenseSecondImg" :disabled="disable" image-type="vehicle-license" side="back" icon-type="vehicle_back" @fillForm="fillForm" />
          </el-col>
          <el-col :span="7" class="mb">
            <p class="upload-image-label">道路运输许可证</p>
            <upload-image v-model="form.roadTransportCertificateImg" :disabled="disable" icon-type="transport" />
          </el-col>
          <el-col :span="7">
            <p class="upload-image-label">车头正面照</p>
            <upload-image v-model="form.vehicleImage" :disabled="disable" icon-type="vehicle_head" />
          </el-col>
        </el-row>
        <el-row v-else>
          <el-col :span="7" class="mb">
            <p class="upload-image-label">行驶证</p>
            <upload-image v-model="form.vehicleLicenseImg" :disabled="disable" image-type="vehicle-license" side="front" icon-type="vehicle" @fillForm="fillForm" />
          </el-col>
          <el-col :span="7" class="mb">
            <p class="upload-image-label">行驶证副页</p>
            <upload-image v-model="form.vehicleLicenseSecondImg" :disabled="disable" image-type="vehicle-license" side="back" icon-type="vehicle_back" @fillForm="fillForm" />
          </el-col>
          <el-col :span="7" class="mb">
            <p class="upload-image-label">道路运输许可证</p>
            <upload-image v-model="form.roadTransportCertificateImg" :disabled="disable" icon-type="transport" />
          </el-col>
          <el-col :span="7">
            <p class="upload-image-label">车头正面照</p>
            <upload-image v-model="form.vehicleImage" :disabled="disable" icon-type="vehicle_head" />
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="审核备注" prop="authRemark">
        <el-input
          v-model="form.authRemark"
          :disabled="!(title === '审核')"
          class="width90"
          type="textarea"
          :rows="2"
          maxlength="200"
          placeholder="请输入审核备注"
        />
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
        ],
        vehicleLicenseColorCode: [
          { required: true, message: '车牌颜色不能为空', trigger: ['blur', 'change'] }
        ],
        vehicleTypeCode: [
          { required: true, message: '车辆类型不能为空', trigger: ['blur', 'change'] }
        ],
        chassisNumber: [
          { required: true, message: '车辆识别码不能为空', trigger: 'blur' }
        ],
        vehicleEnergyType: [
          { required: true, message: '车辆能源类型不能为空', trigger: ['blur', 'change'] }
        ],
        vehicleTotalWeight: [
          { required: true, message: '车辆总重量不能为空', trigger: 'blur' },
          { validator: (rules, value, callback) => this.formValidate.greaterThanZero(rules, value, callback, '车辆总重量'), trigger: ['blur', 'change'] }
        ],
        vehicleLoadWeight: [
          { required: true, message: '车辆可载重量不能为空', trigger: 'blur' },
          { validator: (rules, value, callback) => this.formValidate.greaterThanZero(rules, value, callback, '车辆可载重量'), trigger: ['blur', 'change'] }
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
      // 车牌颜色
      this.getDicts('licenseColor').then(response => {
        this.licenseColorOptions = response.data;
      });
      // 车身颜色
      this.getDicts('CarBodyColor').then(response => {
        this.carBodyColorOptions = response.data;
      });
      // 车辆类型
      this.getDicts('vehicleClassification').then(response => {
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
            addInfo(Object.assign({}, this.form, { fromSource: 1 })).then(response => {
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
        vehicleAscriptionType: null,
        classificationCode: null,
        vehicleLicenseColorCode: '1', // 车牌颜色默认为黄色
        vehicleColorCode: null,
        vehicleTypeCode: null,
        vehicleEnergyType: null,
        vehicleLength: null,
        vehicleWidth: null,
        vehicleHeight: null,
        vehicleTotalWeight: null,
        vehicleLoadWeight: null,
        // vehicleLoadVolume: null,
        vehicleRemainingLoadVolume: null,
        chassisNumber: null,
        engineNumber: null,
        vehicleChassisNumber: null,
        vehiclePower: null,
        axesNumber: null,
        annualVerificationDate: null,
        transportMeson: null,
        authStatus: 0,
        isFreeze: 0,
        createCode: null,
        createTime: null,
        updateCode: null,
        updateTime: null,
        vehicleImage: null,
        vehicleLicenseImg: null,
        vehicleLicenseSecondImg: null,
        transportPermitImage: null,
        driverOtherLicenseBackImage: null,
        driverOtherLicenseImage: null,
        roadTransportCertificateImg: null,
        roadTransportCertificateNumber: null,
        authRemark: null
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
      this.$refs['form'].validate(valid => {
        if (key === 2 || valid) {
          examine({
            authStatus: key,
            code: this.form.code
          }).then(response => {
            this.msgSuccess('操作成功');
            this.close();
            this.$emit('refresh');
          });
        } else {
          this.msgWarning('填写的信息不完整或有误，不能通过审核');
        }
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
    },
    // 图片识别后回填
    fillForm(type, data, side) {
      switch (type) {
        // 行驶证
        case 'vehicle-license':
          // 正面
          if (side === 'front') {
            // 车牌号
            if (data.number) {
              this.$set(this.form, 'licenseNumber', data.number);
            } else {
              this.$set(this.form, 'licenseNumber', '');
            }
            // 车辆类型 vehicleTypeCode
            if (data.vehicle_type) {
              // form
              this.$set(this.form, 'vehicleTypeCode', this.getVehicleTypeKey(data.vehicle_type));
            } else {
              this.$set(this.form, 'vehicleTypeCode', '');
            }
            // 车辆识别码 chassisNumber
            if (data.vin) {
              this.$set(this.form, 'chassisNumber', data.vin);
            } else {
              this.$set(this.form, 'chassisNumber', '');
            }
            // 发动机号 engineNumber
            if (data.engine_no) {
              this.$set(this.form, 'engineNumber', data.engine_no);
            } else {
              this.$set(this.form, 'engineNumber', '');
            }
          }
          // 副业
          if (side === 'back') {
            // 车辆总重量 vehicleTotalWeight
            if (data.gross_mass) {
              var num = data.gross_mass.indexOf('kg');
              var value = data.gross_mass.substr(0, num);
              this.$set(this.form, 'vehicleTotalWeight', (value / 1000).toFixed(3));
            } else {
              this.$set(this.form, 'vehicleTotalWeight', '0');
            }
            // 车辆可载重量 vehicleLoadWeight
            if (data.unladen_mass) {
              num = data.unladen_mass.indexOf('kg');
              value = data.unladen_mass.substr(0, num);
              this.$set(this.form, 'vehicleLoadWeight', (value / 1000).toFixed(3));
            }
          }
          /* if (data.number) {
            this.$set(this.form, 'licenseNumber', data.number);
          } else {
            this.$set(this.form, 'licenseNumber', '');
          }
          if (data.engine_no) {
            this.$set(this.form, 'engineNumber', data.engine_no);
          } else {
            this.$set(this.form, 'engineNumber', '');
          }
          if (data.vin) {
            this.$set(this.form, 'chassisNumber', data.vin);
          } else {
            this.$set(this.form, 'chassisNumber', '');
          }
          if (data.vehicle_type) {
            // 车辆类型
            this.$set(this.form, 'vehicleTypeCode', this.getVehicleTypeKey(data.vehicle_type));
          } else {
            this.$set(this.form, 'vehicleTypeCode', '');
          }*/
          break;
        default:
          break;
      }
    },
    // 根据车牌类型的value值获取对应的key
    getVehicleTypeKey(value) {
      let key = null;
      this.vehicleTypeOptions.forEach(el => {
        if (value === el.dictLabel) {
          key = el.dictValue;
        }
      });
      return key || 'X99';
    }
  }
};
</script>

<style scoped lang="scss">
	.mr3{
	  margin-right: 3%;
	}
  .mb{
    margin-bottom: 22px;
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
