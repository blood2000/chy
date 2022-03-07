<template>
  <!-- 添加或修改调度者对话框 -->
  <el-dialog :class="[{'i-add':title==='新增'},{'i-check':title==='审核'}]" :title="title" :visible="visible" width="800px" append-to-body :close-on-click-modal="disable" @close="cancel">
    <el-form ref="form" :model="form" :rules="rules" label-width="140px">
      <el-form-item label="手机号" prop="telphone">
        <el-input ref="telphone" v-model="form.telphone" placeholder="请输入手机号" :disabled="form.id?true:false" class="width90" clearable @blur="getUserAlreadyExist" />
      </el-form-item>
      <!--<el-form-item label="密码" prop="password">
        <el-input v-model="form.password" type="password" :disabled="disable" :placeholder="form.id?'密码未修改可不填写':'请输入密码'" class="width60 mr3" clearable />
        <span class="g-color-blue">(初始密码为{{ initialPassword }})</span>
      </el-form-item>-->
      <el-row :gutter="20">
        <el-col :span="10">
          <el-form-item label="状态">
            <el-radio-group v-model="form.status" :disabled="disable">
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
            <el-checkbox v-model="form.openProjectDesignView" :disabled="disable">开启&nbsp;项目版统计视图</el-checkbox>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="姓名" prop="teamLeaderName">
        <el-input v-model="form.teamLeaderName" :disabled="disable" placeholder="支持自动识别" class="width90" clearable />
      </el-form-item>
      <el-form-item label="调度组名称" prop="name">
        <el-input v-model="form.name" :disabled="disable" placeholder="请输入调度组名称" class="width90" clearable />
      </el-form-item>
      <el-form-item label="身份证号" prop="identificationNumber">
        <el-input v-model="form.identificationNumber" :disabled="disable" placeholder="支持自动识别" class="width90" clearable />
      </el-form-item>
      <el-form-item prop="identificationEndTime">
        <label slot="label"><span style="color: #ff4949">* </span>身份证有效期</label>
        <el-date-picker
          v-model="form.identificationBeginTime"
          :disabled="disable"
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
        <el-checkbox v-model="form.identificationEffective" :disabled="disable">长期有效</el-checkbox>
      </el-form-item>
      <el-form-item label="是否清分" prop="isDistribution">
        <el-select
          v-model="form.isDistribution"
          :disabled="disable"
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
              :disabled="disable"
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
            <el-input-number v-model="form.distributionPercent" :disabled="disable" controls-position="right" :precision="2" :step="1" :min="0.01" :max="100" class="width90" clearable />
          </el-form-item>
          <el-form-item v-else label="清分金额" prop="distributionPercent" :rules="[{ required: true, message: '清分金额不能为空', trigger: ['blur', 'change'] }]">
            <el-input-number v-model="form.distributionPercent" :disabled="disable" controls-position="right" :precision="2" :step="1" :min="0.01" :max="100000000" class="width90" clearable />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item>
        <!-- 只有图片上传禁用的时候才能使用v-viewer查看大图，复制两份判断 -->
        <el-row v-if="disable" v-viewer>
          <el-col :span="7" class="mb">
            <p class="upload-image-label">
              <span class="g-color-require">* </span>
              身份证(人像面)
            </p>
            <uploadImage v-model="form.identificationImage" :disabled="disable" image-type="id-card" side="front" icon-type="idcard" @fillForm="fillForm" />
          </el-col>
          <el-col :span="7" class="mb">
            <p class="upload-image-label">
              <span class="g-color-require">* </span>
              身份证(国徽面)
            </p>
            <uploadImage v-model="form.identificationBackImage" :disabled="disable" image-type="id-card" side="back" icon-type="idcard_back" @fillForm="fillForm" />
          </el-col>
          <el-col :span="7" class="mb">
            <p class="upload-image-label">营业执照</p>
            <uploadImage v-model="form.businessLicenseImg" :disabled="disable" image-type="business-license" icon-type="organization" @fillForm="fillForm" />
          </el-col>
          <el-col :span="7">
            <p class="upload-image-label">道路运输经营许可证照</p>
            <uploadImage v-model="form.transportPermitImage" icon-type="transport" :disabled="disable" />
          </el-col>
        </el-row>
        <el-row v-else>
          <el-col :span="7" class="mb">
            <p class="upload-image-label">
              <span class="g-color-require">* </span>
              身份证(人像面)
            </p>
            <uploadImage v-model="form.identificationImage" :disabled="disable" image-type="id-card" side="front" icon-type="idcard" @fillForm="fillForm" />
          </el-col>
          <el-col :span="7" class="mb">
            <p class="upload-image-label">
              <span class="g-color-require">* </span>
              身份证(国徽面)
            </p>
            <uploadImage v-model="form.identificationBackImage" :disabled="disable" image-type="id-card" side="back" icon-type="idcard_back" @fillForm="fillForm" />
          </el-col>
          <el-col :span="7" class="mb">
            <p class="upload-image-label">营业执照</p>
            <uploadImage v-model="form.businessLicenseImg" :disabled="disable" image-type="business-license" icon-type="organization" @fillForm="fillForm" />
          </el-col>
          <el-col :span="7">
            <p class="upload-image-label">道路运输经营许可证照</p>
            <uploadImage v-model="form.transportPermitImage" icon-type="transport" :disabled="disable" />
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
    <div v-if="title === '新增' || title === '编辑'" slot="footer" class="dialog-footer">
      <el-button type="primary" :loading="buttonLoading" @click="submitForm">确 定</el-button>
      <el-button @click="cancel">取 消</el-button>
    </div>
    <div v-if="title === '审核'" slot="footer" class="dialog-footer">
      <el-button type="primary" :loading="authButtonLoading" @click="reviewForm(3)">审核通过</el-button>
      <el-button type="danger" :loading="authButtonLoading" @click="reviewForm(2)">审核不通过</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { addInfo, updateInfo, authRead, examine } from '@/api/assets/team';
import { getUserAlreadyExist } from '@/api/system/user';
import UploadImage from '@/components/UploadImage/index';
import { praseBooleanToNum, praseNumToBoolean } from '@/utils/ddc';

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
      authButtonLoading: false,
      // 初始密码
      initialPassword: 'abcd1234@',
      // 状态字典
      statusOptions: [
        { dictLabel: '启用', dictValue: 0 },
        { dictLabel: '冻结', dictValue: 1 }
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
      },
      phoneUniq: true
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
  methods: {
    /** 提交按钮 */
    submitForm() {
      // 手机号判断
      if (!this.phoneUniq) {
        return;
      }
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
        branchCode: null,
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
        distributionRule: 1,
        authRemark: null
      };
      this.resetForm('form');
    },
    // 表单赋值
    setForm(data) {
      this.form = data;
      this.form.identificationEffective = praseNumToBoolean(this.form.identificationEffective);
      if (this.form.openProjectDesignView === 0) {
        this.form.openProjectDesignView = true;
      } else {
        this.form.openProjectDesignView = false;
      }
    },
    // 已读
    authRead() {
      authRead({
        authStatus: 1,
        code: this.form.code,
        id: this.form.id
      }).then(response => {
        this.$emit('refresh');
      });
    },
    /** 审核通过/未通过按钮 */
    reviewForm(key) {
      this.$refs['form'].validate(valid => {
        if (key === 2 || valid) {
          this.authButtonLoading = true;
          examine({
            authStatus: key,
            code: this.form.code,
            id: this.form.id,
            authRemark: this.form.authRemark
          }).then(response => {
            this.msgSuccess('操作成功');
            this.close();
            this.$emit('refresh');
            this.authButtonLoading = false;
          }).catch(() => {
            this.authButtonLoading = false;
          });
        } else {
          this.msgWarning('填写的信息不完整或有误，不能通过审核');
        }
      });
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
    },
    getUserAlreadyExist() {
      if (this.form.telphone) {
        getUserAlreadyExist({ phoneNum: this.form.telphone }).then(response => {
          if (response.code === 500) {
            this.phoneUniq = false;
            this.msgWarning(response.msg);
            this.$nextTick(() => {
              this.$refs.telphone.focus();
            });
          } else {
            this.phoneUniq = true;
          }
        }).catch(() => {
          this.phoneUniq = false;
          this.$nextTick(() => {
            this.$refs.telphone.focus();
          });
        });
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
