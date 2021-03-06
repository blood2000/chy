<template>
  <el-dialog :title="title" :class="[{'i-add':title==='新增银行卡'}]" :visible="visible" width="800px" :close-on-click-modal="false" append-to-body @close="cancel">
    <el-form ref="form" :model="form" :rules="rules" :disabled="disable" label-width="140px">
      <el-form-item label="开户姓名" prop="name">
        <el-input v-model="form.name" placeholder="请输入开户姓名" class="width90" clearable />
      </el-form-item>
      <el-form-item label="银行卡号" prop="account">
        <el-input v-model="form.account" placeholder="请输入银行卡号" class="width90" clearable />
      </el-form-item>
      <el-form-item label="开户银行" prop="bankCode">
        <el-select
          v-model="form.bankCode"
          class="width90"
          placeholder="请选择开户银行"
          filterable
          clearable
          @change="changeBanK"
        >
          <el-option
            v-for="dict in bankOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="绑定手机号" prop="mobile">
        <el-input v-model="form.mobile" placeholder="请输入绑定手机号" class="width90" clearable />
      </el-form-item>
      <el-form-item label="网点" prop="bankBranch">
        <el-input v-model="form.bankBranch" placeholder="请输入网点" class="width90" clearable />
      </el-form-item>
      <!-- 开户城市 -->
      <province-city-county
        ref="ChooseArea"
        :label-name="'开户城市'"
        :visible="visible"
        :disabled="disable"
        :prop-province-code="form.province"
        :prop-city-code="form.city"
        :no-county="true"
        @refresh="(data) => {
          form.province = data.provinceCode;
          form.city = data.cityCode;
        }"
      />
      <el-form-item label="账户类型" prop="bankType">
        <el-radio-group v-model="form.bankType">
          <el-radio
            v-for="dict in bankTypeOptions"
            :key="dict.dictValue"
            :label="dict.dictValue"
          >{{ dict.dictLabel }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <!-- 企业账户必填 -->
      <el-form-item
        v-if="form.bankType === 2"
        label="银行支行号"
        prop="bankLineNo"
      >
        <el-input v-model="form.bankLineNo" placeholder="请输入银行支行号" class="width90" clearable />
      </el-form-item>
      <el-form-item label="是否默认" prop="isDefault">
        <el-switch v-model="form.isDefault" />
      </el-form-item>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button type="primary" :loading="buttonLoading" @click="submitForm">确 定</el-button>
      <el-button @click="cancel">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { addBank, updateBank } from '@/api/capital/bankcard';
import { listUser } from '@/api/system/user';
import ProvinceCityCounty from '@/components/ProvinceCityCounty';
import { praseBooleanToNum, praseNumToBoolean } from '@/utils/ddc';

export default {
  components: {
    ProvinceCityCounty
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    open: Boolean,
    disable: Boolean,
    userCode: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      buttonLoading: false,
      // 开户银行字典
      bankOptions: [],
      // 账户类型字典
      bankTypeOptions: [
        { dictLabel: '个人账户', dictValue: 1 },
        { dictLabel: '企业账户', dictValue: 2 }
      ],
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        name: [
          { required: true, message: '开户姓名不能为空', trigger: ['blur', 'change'] }
        ],
        account: [
          { required: true, message: '银行卡号不能为空', trigger: 'blur' },
          { validator: this.formValidate.bankCard, trigger: ['blur', 'change'] }
        ],
        bankCode: [
          { required: true, message: '开户银行不能为空', trigger: ['blur', 'change'] }
        ],
        mobile: [
          { required: true, message: '绑定手机号不能为空', trigger: ['blur', 'change'] },
          { validator: this.formValidate.telphone, trigger: ['blur', 'change'] }
        ],
        bankType: [
          { required: true, message: '账户类型不能为空', trigger: 'change' }
        ],
        bankLineNo: [
          { required: true, message: '银行支行号不能为空', trigger: 'blur' },
          { validator: this.formValidate.subBankCard, trigger: ['blur', 'change'] }
        ]
      },
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        phonenumber: null
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
    this.getDictsOptions();
  },
  methods: {
    /** 查询字典 */
    getDictsOptions() {
      this.getDicts('bank').then(response => {
        this.bankOptions = response.data;
      });
    },
    /** 提交按钮 */
    submitForm() {
      const flag = this.$refs.ChooseArea.submit();
      this.$refs['form'].validate(valid => {
        if (valid && flag) {
          this.buttonLoading = true;
          if (this.form.bankType === 1) {
            this.form.bankLineNo = null;
          }
          const params = {
            ...this.form,
            isDefault: praseBooleanToNum(this.form.isDefault)
          };
          if (this.form.id) {
            updateBank(params).then(response => {
              this.buttonLoading = false;
              this.msgSuccess('修改成功');
              this.close();
              this.$emit('refresh');
            }).catch(() => {
              this.buttonLoading = false;
            });
          } else {
            addBank(params).then(response => {
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
        userCode: null,
        name: null,
        account: null,
        bankCode: null,
        bankName: null,
        mobile: null,
        bankBranch: null,
        province: null,
        city: null,
        bankType: 1,
        bankLineNo: null,
        isDefault: false
      };
      this.resetForm('form');
    },
    // 表单赋值
    setForm(data) {
      this.form = data;
      this.form.isDefault = praseNumToBoolean(this.form.isDefault);
    },
    // 获取选中银行卡的名称
    changeBanK(code) {
      this.bankOptions.forEach(el => {
        if (el.dictValue === code) {
          this.form.bankName = el.dictLabel;
        }
      });
    },
    // 通过userCode查询用户并回填
    getUserByCode() {
      this.form.userCode = this.userCode;
      listUser({
        userCode: this.userCode
      }).then(response => {
        if (response.rows && response.rows.length > 0) {
          const { userName, nickName, phonenumber } = response.rows[0];
          this.form.name = nickName || userName;
          this.form.mobile = phonenumber;
        }
      });
    }
  }
};
</script>

<style scoped>
.width90{
  width: 90%;
}
</style>
