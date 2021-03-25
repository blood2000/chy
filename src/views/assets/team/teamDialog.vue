<template>
  <!-- 添加或修改调度者对话框 -->
  <el-dialog :title="title" :visible="visible" width="800px" append-to-body @close="cancel">
    <el-form ref="form" :model="form" :rules="rules" :disabled="disable" label-width="140px">
      <el-form-item label="车队名称" prop="name">
        <el-input v-model="form.name" placeholder="请输入车队名称" class="width90" clearable />
      </el-form-item>
      <el-form-item label="状态">
        <el-radio-group v-model="form.status">
          <el-radio
            v-for="dict in statusOptions"
            :key="dict.dictValue"
            :label="parseInt(dict.dictValue)"
          >{{ dict.dictLabel }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="管理者" prop="teamLeader">
        <el-input v-model="form.teamLeader" placeholder="请输入车队管理者" class="width90" clearable />
      </el-form-item>
      <el-form-item label="手机号" prop="telphone">
        <el-input v-model="form.telphone" placeholder="请输入手机号" class="width90" clearable />
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="form.password" type="password" placeholder="请输入密码" class="width60 mr3" clearable />
        <span class="g-color-blue">(初始密码为{{ initialPassword }})</span>
      </el-form-item>
      <el-form-item label="身份证号" prop="identificationNumber">
        <el-input v-model="form.identificationNumber" placeholder="支持自动识别" class="width90" clearable />
      </el-form-item>
      <el-form-item label="身份证有效期" prop="identificationEndTime">
        <el-date-picker
          v-model="form.identificationBeginTime"
          clearable
          class="width28"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择"
        />
        至
        <el-date-picker
          v-model="form.identificationEndTime"
          clearable
          class="width28 mr3"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择"
        />
        <el-checkbox v-model="form.identificationEffective">长期有效</el-checkbox>
      </el-form-item>
      <el-form-item label="是否清分" prop="isDistribution">
        <el-select
          v-model="form.isDistribution"
          clearable
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
      <el-form-item label="清分百分比" prop="distributionPercent">
        <el-input v-model="form.distributionPercent" placeholder="请输入清分百分比" class="width90" clearable />
      </el-form-item>
      <el-form-item>
        <el-row>
          <el-col :span="7">
            <p class="upload-image-label">身份证正面照</p>
            <uploadImage v-model="form.identificationImage" />
          </el-col>
          <el-col :span="7">
            <p class="upload-image-label">身份证反面照</p>
            <uploadImage v-model="form.identificationBackImage" />
          </el-col>
          <el-col :span="7">
            <p class="upload-image-label">营业执照</p>
            <uploadImage v-model="form.businessLicenseImg" />
          </el-col>
          <el-col :span="7">
            <p class="upload-image-label">道路运输经营许可证照</p>
            <uploadImage v-model="form.transportPermitImage" />
          </el-col>
        </el-row>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitForm">确 定</el-button>
      <el-button @click="cancel">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { addInfo, updateInfo } from '@/api/assets/team';
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
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        branchCode: [
          { required: true, message: '网点编码不能为空', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '车队名称不能为空', trigger: 'blur' }
        ],
        teamLeader: [
          { required: true, message: '车队管理者不能为空', trigger: 'blur' }
        ],
        identificationEndTime: [
          { validator: this.formValidate.isExpired }
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

  },
  methods: {
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.identificationEffective) {
            this.form.identificationEffective = 1;
          } else {
            this.form.identificationEffective = 0;
          }
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
        branchCode: null,
        name: null,
        teamLeader: null,
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
        isDistribution: null,
        distributionPercent: null
      };
      this.resetForm('form');
    },
    // 表单赋值
    setForm(data) {
      this.form = data;
      if (this.form.identificationEffective) {
        this.form.identificationEffective = true;
      } else {
        this.form.identificationEffective = false;
      }
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
