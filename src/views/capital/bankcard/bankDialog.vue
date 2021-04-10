<template>
  <el-dialog :title="title" :visible="visible" width="800px" append-to-body @close="cancel">
    <el-form ref="form" :model="form" :rules="rules" :disabled="disable" label-width="140px">
      <el-form-item label="选择人员" prop="userCode">
        <el-select
          v-model="form.userCode"
          v-el-select-loadmore="loadmore"
          filterable
          remote
          reserve-keyword
          placeholder="通过手机号进行查询"
          class="width90"
          :remote-method="userRemoteMethod"
          :loading="personLoading"
          @change="userChange"
        >
          <el-option
            v-for="item in personOptions"
            :key="item.userCode"
            :label="`${item.nickName}(${item.phonenumber})`"
            :value="item.userCode"
          />
        </el-select>
      </el-form-item>
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
        <el-select
          v-model="form.bankBranch"
          filterable
          remote
          reserve-keyword
          placeholder="请输入网点"
          class="width90"
          :remote-method="getBranchOptions"
          :loading="loading"
        >
          <el-option
            v-for="item in branchOptions"
            :key="item.code"
            :label="item.name"
            :value="item.code"
          />
        </el-select>
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
        :rules="[
          { required: true, message: '银行支行号不能为空', trigger: 'blur' },
        ]"
      >
        <el-input v-model="form.bankLineNo" placeholder="请输入银行支行号" class="width90" clearable />
      </el-form-item>
      <el-form-item label="是否默认" prop="isDefault">
        <el-switch v-model="form.isDefault" />
      </el-form-item>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitForm">确 定</el-button>
      <el-button @click="cancel">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { addBank, updateBank } from '@/api/capital/bankcard';
import { listUser } from '@/api/system/user';
import { getBranchList } from '@/api/system/branch';
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
    disable: Boolean
  },
  data() {
    return {
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
        userCode: [
          { required: true, message: '请选择人员', trigger: 'change' }
        ],
        name: [
          { required: true, message: '开户姓名不能为空', trigger: 'blur' }
        ],
        account: [
          { required: true, message: '银行卡号不能为空', trigger: 'blur' }
        ],
        bankCode: [
          { required: true, message: '开户银行不能为空', trigger: ['blur', 'change'] }
        ],
        mobile: [
          { required: true, message: '绑定手机号不能为空', trigger: 'blur' },
          { validator: this.formValidate.telephone, trigger: 'blur' }
        ],
        bankType: [
          { required: true, message: '账户类型不能为空', trigger: 'change' }
        ]
      },
      // 选择人员
      personLoading: false,
      personOptions: [],
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        phonenumber: null
      },
      // 网点查询
      loading: false,
      branchOptions: []
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
          const params = {
            ...this.form,
            isDefault: praseBooleanToNum(this.form.isDefault)
          };
          if (this.form.id !== undefined) {
            updateBank(params).then(response => {
              this.msgSuccess('修改成功');
              this.close();
              this.$emit('refresh');
            });
          } else {
            addBank(params).then(response => {
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
      if (this.form.userCode && this.form.name) {
        this.personOptions = [{
          userCode: this.form.userCode,
          nickName: this.form.name,
          phonenumber: this.form.mobile
        }];
      }
    },
    // 人员远程搜索
    userRemoteMethod(query) {
      if (query !== '') {
        this.personLoading = true;
        this.queryParams.phonenumber = query;
        this.queryParams.pageNum = 1;
        this.personOptions = [];
        this.getUserList();
      } else {
        this.personOptions = [];
      }
    },
    // 查询人员列表
    getUserList() {
      listUser(this.queryParams).then(response => {
        this.personLoading = false;
        this.personOptions = [...this.personOptions, ...response.rows];
      });
    },
    // 选择人员远程搜索列表触底事件
    loadmore() {
      this.queryParams.pageNum++;
      this.getUserList();
    },
    // 获取选中的人员回填
    userChange(code) {
      console.log(code);
      this.personOptions.forEach(el => {
        if (el.userCode === code) {
          this.form.name = el.nickName;
          this.form.mobile = el.phonenumber;
        }
      });
    },
    // 查询网点列表
    getBranchOptions(query) {
      if (query !== '') {
        this.loading = true;
        getBranchList({
          name: query
        }).then(response => {
          this.loading = false;
          this.branchOptions = response.data;
        });
      } else {
        this.branchOptions = [];
      }
    },
    // 获取选中银行卡的名称
    changeBanK(code) {
      this.bankOptions.forEach(el => {
        if (el.dictValue === code) {
          this.form.bankName = el.dictLabel;
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
