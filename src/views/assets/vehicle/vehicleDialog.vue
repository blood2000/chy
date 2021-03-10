<template>
	<!-- 添加或修改车辆对话框 -->
	<el-dialog :title="title" :visible.sync="open" width="800px" append-to-body @close="cancel">
	  <el-form ref="form" :model="form" :rules="rules" label-width="80px">
		  <el-form-item label="编码" prop="code">
		    <el-input v-model="form.code" placeholder="请输入编码" />
		  </el-form-item>
		  <el-form-item label="名称" prop="licenseNumber">
		    <el-input v-model="form.licenseNumber" placeholder="请输入名称" />
		  </el-form-item>
		  <el-form-item label="车主编码" prop="vehicleOwnerCode">
		    <el-input v-model="form.vehicleOwnerCode" placeholder="请输入车主编码" />
		  </el-form-item>
		  <el-form-item label="归属类型" prop="vehicleAscriptionType">
		    <el-select v-model="form.vehicleAscriptionType" placeholder="请选择车辆归属类型 0.自有 1.加盟">
		      <el-option
		        v-for="dict in vehicleAscriptionTypeOptions"
		        :key="dict.dictValue"
		        :label="dict.dictLabel"
		        :value="parseInt(dict.dictValue)"
		      ></el-option>
		    </el-select>
		  </el-form-item>
		  <el-form-item label="车牌类型" prop="classificationCode">
		    <el-input v-model="form.classificationCode" placeholder="请输入车牌类型代码" />
		  </el-form-item>
		  <el-form-item label="车牌颜色" prop="vehicleLicenseColorCode">
		    <el-input v-model="form.vehicleLicenseColorCode" placeholder="请输入车牌颜色代码" />
		  </el-form-item>
		  <el-form-item label="车身颜色" prop="vehicleColorCode">
		    <el-input v-model="form.vehicleColorCode" placeholder="请输入车身颜色代码" />
		  </el-form-item>
		  <el-form-item label="车身颜色" prop="vehicleTypeCode">
		    <el-input v-model="form.vehicleTypeCode" placeholder="请输入车身颜色代码" />
		  </el-form-item>
		  <el-form-item label="能源类型" prop="vehicleEnergyType">
		    <el-select v-model="form.vehicleEnergyType" placeholder="请选择车辆能源类型">
		      <el-option
		        v-for="dict in vehicleEnergyTypeOptions"
		        :key="dict.dictValue"
		        :label="dict.dictLabel"
		        :value="parseInt(dict.dictValue)"
		      ></el-option>
		    </el-select>
		  </el-form-item>
		  <el-form-item label="车长" prop="vehicleLength">
		    <el-input v-model="form.vehicleLength" placeholder="请输入车长代码" />
		  </el-form-item>
		  <el-form-item label="车宽" prop="vehicleWidth">
		    <el-input v-model="form.vehicleWidth" placeholder="请输入车宽代码" />
		  </el-form-item>
		  <el-form-item label="车高" prop="vehicleHeight">
		    <el-input v-model="form.vehicleHeight" placeholder="请输入车高代码" />
		  </el-form-item>
		  <el-form-item label="可载重量" prop="vehicleLoadWeight">
		    <el-input v-model="form.vehicleLoadWeight" placeholder="请输入车辆可载重量" />
		  </el-form-item>
		  <el-form-item label="可载平方" prop="vehicleLoadVolume">
		    <el-input v-model="form.vehicleLoadVolume" placeholder="请输入车辆可载平方" />
		  </el-form-item>
		  <el-form-item label="可载立方" prop="vehicleRemainingLoadVolume">
		    <el-input v-model="form.vehicleRemainingLoadVolume" placeholder="请输入车辆可载立方" />
		  </el-form-item>
		  <el-form-item label="车身自重" prop="selfRespect">
		    <el-input v-model="form.selfRespect" placeholder="请输入车身自重" />
		  </el-form-item>
		  <el-form-item label="车架号" prop="chassisNumber">
		    <el-input v-model="form.chassisNumber" placeholder="请输入车架号" />
		  </el-form-item>
		  <el-form-item label="发动机号" prop="engineNumber">
		    <el-input v-model="form.engineNumber" placeholder="请输入发动机号" />
		  </el-form-item>
		  <el-form-item label="底盘号" prop="vehicleChassisNumber">
		    <el-input v-model="form.vehicleChassisNumber" placeholder="请输入底盘号" />
		  </el-form-item>
		  <el-form-item label="功率" prop="vehiclePower">
		    <el-input v-model="form.vehiclePower" placeholder="请输入功率" />
		  </el-form-item>
		  <el-form-item label="轴数" prop="axesNumber">
		    <el-input v-model="form.axesNumber" placeholder="请输入轴数" />
		  </el-form-item>
		  <el-form-item label="年审时间" prop="annualVerificationDate">
		    <el-date-picker clearable size="small" style="width: 200px"
		      v-model="form.annualVerificationDate"
		      type="date"
		      value-format="yyyy-MM-dd"
		      placeholder="选择年审时间">
		    </el-date-picker>
		  </el-form-item>
		  <el-form-item label="运输介子" prop="transportMeson">
		    <el-input v-model="form.transportMeson" placeholder="请输入运输介子" />
		  </el-form-item>
		  <el-form-item label="审核状态">
		   <el-radio-group v-model="form.authStatus">
		     <el-radio
		       v-for="dict in authStatusOptions"
		       :key="dict.dictValue"
		       :label="parseInt(dict.dictValue)"
		     >{{dict.dictLabel}}</el-radio>
		   </el-radio-group>
		  </el-form-item>
		  <el-form-item label="是否冻结" prop="isFreeze">
		    <el-input v-model="form.isFreeze" placeholder="请输入是否冻结(0正常1冻结)" />
		  </el-form-item>
		  <el-form-item label="车头正面照">
		    <uploadImage v-model="form.vehicleImage"/>
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
	import { addInfo, updateInfo } from "@/api/assets/vehicle";
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
		  // 车辆归属类型 0.自有 1.加盟字典
		  vehicleAscriptionTypeOptions: [
			  {dictLabel: '自有', dictValue: '0'},
			  {dictLabel: '加盟字典', dictValue: '1'}
		  ],
		  // 车辆能源类型字典
		  vehicleEnergyTypeOptions: [],
		  // 审核状态(0.未审核.1审核中2审核未通过3审核通过)字典
		  authStatusOptions: [
			  {dictLabel: '未审核', dictValue: '0'},
			  {dictLabel: '审核中', dictValue: '1'},
			  {dictLabel: '审核未通过', dictValue:'2'},
			  {dictLabel: '审核通过', dictValue: '3'}
		  ],
		  // 是否冻结(0正常1冻结)字典
		  isFreezeOptions: [
			  {dictLabel: '正常', dictValue: '0'},
			  {dictLabel: '冻结', dictValue: '1'}
		  ],
	      // 表单参数
	      form: {},
	      // 表单校验
	      rules: {
			code: [
			  { required: true, message: "编码不能为空", trigger: "blur" }
			],
	        licenseNumber: [
	          { required: true, message: "名称不能为空", trigger: "blur" }
	        ],
	        vehicleOwnerCode: [
	          { required: true, message: "车主编码不能为空", trigger: "blur" }
	        ],
	        vehicleAscriptionType: [
	          { required: true, message: "车辆归属类型不能为空", trigger: "blur" }
	        ],
	        classificationCode: [
	          { required: true, message: "车牌类型不能为空", trigger: "blur" }
	        ],
	        vehicleLicenseColorCode: [
	          { required: true, message: "车牌颜色不能为空", trigger: "blur" }
	        ],
	        vehicleColorCode: [
	          { required: true, message: "车身颜色不能为空", trigger: "blur" }
	        ],
	        vehicleTypeCode: [
	          { required: true, message: "车身类型不能为空", trigger: "blur" }
	        ],
	        vehicleEnergyType: [
	          { required: true, message: "车辆能源类型不能为空", trigger: "blur" }
	        ],
	        vehicleLoadWeight: [
	          { required: true, message: "车辆可载重量不能为空", trigger: "blur" }
	        ],
	        vehicleLoadVolume: [
	          { required: true, message: "车辆可载平方不能为空", trigger: "blur" }
	        ],
	        vehicleRemainingLoadVolume: [
	          { required: true, message: "车辆可载立方不能为空", trigger: "blur" }
	        ],
			chassisNumber: [
			  { required: true, message: "车架号不能为空", trigger: "blur" }
			],
			annualVerificationDate: [
			  { required: true, message: "年审时间不能为空", trigger: "blur" }
			],
			transportMeson: [
			  { required: true, message: "运输介子不能为空", trigger: "blur" }
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
	    this.getDicts("energyTypes").then(response => {
	      this.vehicleEnergyTypeOptions = response.data;
	    });
	  },
	  methods: {
		  // 车辆能源类型字典翻译
		  vehicleEnergyTypeFormat(row, column) {
		    return this.selectDictLabel(this.vehicleEnergyTypeOptions, row.vehicleEnergyType);
		  },
		  /** 提交按钮 */
		  submitForm() {
		    this.$refs["form"].validate(valid => {
		      if (valid) {
		        if (this.form.id != null) {
		          updateInfo(this.form).then(response => {
		            this.msgSuccess("修改成功");
		            this.close();
		            this.$emit('refresh');
		          });
		        } else {
		          addInfo(this.form).then(response => {
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
		  this.resetForm("form");
		},
	  }
	}
</script>

<style>
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
