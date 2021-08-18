<template>
  <!-- 添加或修改调度者对话框 -->
  <el-dialog class="i-add" title="新增调度者" :visible="visible" width="800px" append-to-body :close-on-click-modal="false" @close="cancel">
    <el-form ref="form" :model="form" :rules="rules" label-width="140px">
      <el-form-item label="手机号" prop="telphone">
        <el-input v-model="form.telphone" placeholder="请输入手机号" disabled class="width90" clearable />
      </el-form-item>
      <!-- <el-form-item label="密码" prop="password">
        <el-input v-model="form.password" type="password" :placeholder="form.id?'密码未修改可不填写':'请输入密码'" class="width60 mr3" clearable />
        <span class="g-color-blue">(初始密码为{{ initialPassword }})</span>
      </el-form-item>-->
      <el-row :gutter="20">
        <el-col :span="10">
          <el-form-item label="状态">
            <el-radio-group v-model="form.status">
              <el-radio
                v-for="dict in statusOptions"
                :key="dict.dictValue"
                :label="parseInt(dict.dictValue)"
              >{{ dict.dictLabel }}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item prop="openProjectDesignView">
            <el-checkbox v-model="form.openProjectDesignView">开启&nbsp;项目版统计视图</el-checkbox>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="姓名" prop="teamLeaderName">
        <el-input v-model="form.teamLeaderName" placeholder="支持自动识别" class="width90" clearable />
      </el-form-item>
      <el-form-item label="调度组名称" prop="name">
        <el-input v-model="form.name" placeholder="请输入调度组名称" class="width90" clearable />
      </el-form-item>
      <el-form-item label="身份证号" prop="identificationNumber">
        <el-input v-model="form.identificationNumber" placeholder="支持自动识别" class="width90" clearable />
      </el-form-item>
      <el-form-item prop="identificationEndTime">
        <label slot="label"><span style="color: #ff4949">* </span>身份证有效期</label>
        <el-date-picker
          v-model="form.identificationBeginTime"
          clearable
          class="width28"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="支持自动识别"
        />
        至
        <el-date-picker
          v-model="form.identificationEndTime"
          clearable
          class="width28 mr3"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="支持自动识别"
          :disabled="!!form.identificationEffective"
        />
        <el-checkbox v-model="form.identificationEffective">长期有效</el-checkbox>
      </el-form-item>
      <el-form-item label="是否清分" prop="isDistribution">
        <el-select
          v-model="form.isDistribution"
          clearable
          filterable
          class="width90"
        >
          <el-option
            v-for="dict in isOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-row v-if="form.isDistribution">
        <el-col :span="11">
          <el-form-item label="清分规则" prop="distributionRule">
            <el-select
              v-model="form.distributionRule"
              filterable
              class="width90"
            >
              <el-option
                v-for="dict in distributionRuleOptions"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item v-if="form.distributionRule == 1" label="清分百分比(%)" prop="distributionPercent" :rules="[{ required: true, message: '清分百分比不能为空', trigger: ['blur', 'change'] }]">
            <el-input-number v-model="form.distributionPercent" controls-position="right" :precision="2" :step="1" :min="0.01" :max="100" class="width90" clearable />
          </el-form-item>
          <el-form-item v-else label="清分金额" prop="distributionPercent" :rules="[{ required: true, message: '清分金额不能为空', trigger: ['blur', 'change'] }]">
            <el-input-number v-model="form.distributionPercent" controls-position="right" :precision="2" :step="1" :min="0.01" :max="100000000" class="width90" clearable />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item>
        <el-row>
          <el-col :span="7" class="mb">
            <p class="upload-image-label">
              <span class="g-color-require">* </span>
              身份证(人像面)
            </p>
            <uploadImage v-model="form.identificationImage" image-type="id-card" side="front" icon-type="idcard" @fillForm="fillForm" />
          </el-col>
          <el-col :span="7" class="mb">
            <p class="upload-image-label">
              <span class="g-color-require">* </span>
              身份证(国徽面)
            </p>
            <uploadImage v-model="form.identificationBackImage" image-type="id-card" side="back" icon-type="idcard_back" @fillForm="fillForm" />
          </el-col>
          <el-col :span="7" class="mb">
            <p class="upload-image-label">营业执照</p>
            <uploadImage v-model="form.businessLicenseImg" image-type="business-license" icon-type="organization" @fillForm="fillForm" />
          </el-col>
          <el-col :span="7">
            <p class="upload-image-label">道路运输经营许可证照</p>
            <uploadImage v-model="form.transportPermitImage" icon-type="transport" />
          </el-col>
        </el-row>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" :loading="buttonLoading" @click="submitForm">确 定</el-button>
      <el-button @click="cancel">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { registerTeam } from '@/api/assets/registerUser';
import UploadImage from '@/components/UploadImage/index';
import { praseBooleanToNum, praseNumToBoolean } from '@/utils/ddc';

export default {
  components: {
    UploadImage
  },
  props: {
    data: Object,
    open: Boolean
  },
  data() {
    return {
      buttonLoading: false,
      authButtonLoading: false,
      // 初始密码
      initialPassword: 'abcd1234@',
      // 状态字典
      statusOptions: [
        { dictLabel: '启用', dictValue: 0 },
        { dictLabel: '禁用', dictValue: 1 }
      ],
      isOptions: [
        { dictLabel: '否', dictValue: 0 },
        { dictLabel: '是', dictValue: 1 }
      ],
      distributionRuleOptions: [
        { dictLabel: '定率', dictValue: 1 },
        { dictLabel: '定额', dictValue: 2 }
      ],
      // 表单参数
      form: {
        distributionRule: 1
      },
      // 表单校验
      rules: {
        telphone: [
          { required: true, message: '手机号不能为空', trigger: 'blur' },
          { validator: this.formValidate.telphone, trigger: 'blur' }
        ],
        // name: [
        //   { required: true, message: '调度组名称不能为空', trigger: 'blur' }
        // ],
        teamLeaderName: [
          { required: true, message: '姓名不能为空', trigger: ['blur', 'change'] }
        ],
        // teamLeader: [
        //   { required: true, message: '名称不能为空', trigger: 'blur' }
        // ],
        identificationNumber: [
          { required: true, message: '身份证号不能为空', trigger: ['blur', 'change'] },
          { validator: this.formValidate.idCard, trigger: ['blur', 'change'] }
        ],
        identificationEndTime: [
          { validator: (rules, value, callback) => this.formValidate.idCardValidate(rules, value, callback, this.form.identificationBeginTime, this.form.identificationEffective), trigger: ['change', 'blur'] },
          { validator: (rules, value, callback) => this.formValidate.isExpired(rules, value, callback, this.form.identificationEffective), trigger: ['change', 'blur'] }
        ],
        password: [
          { validator: this.formValidate.passWord, trigger: 'blur' }
        ]
      }
    };
  },
  computed: {
    visible: {
      get() {
        this.setForm();
        return this.open;
      },
      set(v) {
        this.$emit('update:open', v);
      }
    }
  },
  methods: {
    setForm() {
      this.form.telphone = this.data.phonenumber;
      this.form.teamLeader = this.data.userCode;
      this.form.status = 0;
      // this.form.name = this.data.nickName;
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (!this.form.identificationImage) {
            this.msgWarning('请上传身份证(人像面)');
            return;
          }
          if (!this.form.identificationBackImage) {
            this.msgWarning('请上传身份证(国徽面)');
            return;
          }
          this.buttonLoading = true;
          this.form.identificationEffective = praseBooleanToNum(this.form.identificationEffective);
          if (!this.form.isDistribution) {
            this.form.distributionPercent = null;
            this.form.distributionRule = null;
          }
          // 调度组名称默认为: 姓名+'车队'
          if (!this.form.name || this.form.name === '') {
            this.form.name = this.form.teamLeaderName + '车队';
          }
          var openProjectDesignView = 1;
          if (this.form.openProjectDesignView) {
            openProjectDesignView = 0;
          }
          var extendForm = { openProjectDesignView: openProjectDesignView };
          this.form = Object.assign(this.form, extendForm);
          registerTeam(this.form).then(response => {
            this.buttonLoading = false;
            this.$message('新增成功，请至 调度者管理 审核');
            this.close();
            this.$emit('refresh');
          }).catch(() => {
            this.buttonLoading = false;
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
      this.buttonLoading = false;
      this.form = {
        teamLeader: null,
        name: null,
        // teamLeader: null,
        isDel: null,
        status: 0,
        createCode: null,
        createTime: null,
        updateCode: null,
        updateTime: null,
        businessLicenseImg: null,
        transportPermitImage: null,
        identificationImage: null,
        identificationBackImage: null,
        telphone: null,
        password: null,
        identificationNumber: null,
        identificationBeginTime: null,
        identificationEndTime: null,
        identificationEffective: null,
        isDistribution: 1,
        distributionPercent: 100,
        openProjectDesignView: 1,
        distributionRule: 1
      };
      this.resetForm('form');
    },
    // 图片识别后回填
    fillForm(type, data, side) {
      switch (type) {
        case 'id-card':
          if (side === 'front') {
            if (data.name) {
              this.$set(this.form, 'teamLeaderName', data.name);
            } else {
              this.$set(this.form, 'teamLeaderName', '');
            }
            if (data.number) {
              this.$set(this.form, 'identificationNumber', data.number);
            } else {
              this.$set(this.form, 'identificationNumber', '');
            }
          }
          if (side === 'back') {
            if (data.valid_from) {
              this.$set(this.form, 'identificationBeginTime', this.isPeriodFormate(data.valid_from));
            } else {
              this.$set(this.form, 'identificationBeginTime', '');
            }
            if (data.valid_to) {
              if (this.isPeriodAlways(data.valid_to)) {
                this.$set(this.form, 'identificationEffective', true);
              } else {
                this.$set(this.form, 'identificationEndTime', this.isPeriodFormate(data.valid_to));
              }
            } else {
              this.$set(this.form, 'identificationEffective', false);
              this.$set(this.form, 'identificationEndTime', '');
            }
          }
          break;
        default:
          break;
      }
    }
  }
};
</script>

<style scoped>
	.mr3{
	  margin-right: 3%;
	}
  .mb{
    margin-bottom: 22px;
  }
	.width90{
	  width: 90%;
	}
	.width60{
		width: 60%;
	}
	.width28{
	  width: 28%;
	}
	.el-input-number ::v-deep.el-input__inner{
	  text-align: left;
	}
</style>
