<template>
  <el-dialog :title="title" :visible="visible" width="800px" append-to-body @close="cancel">
    <el-form ref="form" :model="form" :rules="rules" label-width="140px">
      <el-form-item label="开户姓名" prop="name">
        <el-input v-model="form.name" placeholder="请输入开户姓名" class="width90" clearable />
      </el-form-item>
      <el-form-item label="银行卡号" prop="name">
        <el-input v-model="form.name" placeholder="请输入银行卡号" class="width90" clearable />
      </el-form-item>
      <el-form-item label="开户银行" prop="name">
        <el-select
          v-model="form.name"
          class="width90"
        >
          <el-option
            v-for="dict in bankOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="绑定手机号" prop="name">
        <el-input v-model="form.name" placeholder="请输入绑定手机号" class="width90" clearable />
      </el-form-item>
      <el-form-item label="网点" prop="branchCode">
        <el-select
          v-model="form.branchCode"
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
        :prop-province-code="form.provinceCode"
        :prop-city-code="form.cityCode"
        :no-county="true"
        @refresh="(data) => {
          form.provinceCode = data.provinceCode;
          form.cityCode = data.cityCode;
        }"
      />
      <el-form-item label="账户类型" prop="name">
        <el-radio-group v-model="form.name">
          <el-radio
            v-for="dict in typeOptions"
            :key="dict.dictValue"
            :label="dict.dictValue"
          >{{ dict.dictLabel }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="银行支行号" prop="name">
        <el-input v-model="form.name" placeholder="请输入银行支行号" class="width90" clearable />
      </el-form-item>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitForm">确 定</el-button>
      <el-button @click="cancel">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { addShipment, updateShipment } from '@/api/assets/shipment';
import { getBranchList } from '@/api/system/branch';
import ProvinceCityCounty from '@/components/ProvinceCityCounty';

export default {
  components: {
    ProvinceCityCounty
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    open: Boolean
  },
  data() {
    return {
      // 开户银行数据字典
      bankOptions: [],
      // 账户类型字典
      typeOptions: [
        { dictLabel: '个人账户', dictValue: 1 },
        { dictLabel: '企业账户', dictValue: 2 }
      ],
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        telphone: [
          { required: true, message: '手机号码不能为空', trigger: 'blur' },
          { validator: this.formValidate.telphone, trigger: 'blur' }
        ],
        adminName: [
          { required: true, message: '姓名不能为空', trigger: 'blur' },
          { validator: this.formValidate.name, trigger: 'blur' }
        ],
        identificationNumber: [
          { required: true, message: '身份证号不能为空', trigger: 'blur' },
          { validator: this.formValidate.idCard, trigger: 'blur' }
        ],
        identificationEndTime: [
          { required: true, message: '身份证有效期不能为空', trigger: 'blur' },
          { validator: this.formValidate.isExpired }
        ],
        creditAmount: [
          { validator: this.formValidate.number, trigger: 'blur' }
        ]
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

    },
    /** 提交按钮 */
    submitForm() {
      const flag = this.$refs.ChooseArea.submit();
      this.$refs['form'].validate(valid => {
        if (valid && flag) {
          if (this.form.id !== undefined) {
            updateShipment(this.form).then(response => {
              this.msgSuccess('修改成功');
              this.close();
              this.$emit('refresh');
            });
          } else {
            addShipment(this.form).then(response => {
              console.log(response);
              this.msgSuccess('修改成功');
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
        name: null,
        isDefault: false
      };
      this.resetForm('form');
    },
    // 表单赋值
    setForm(data) {
      this.form = data;
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
    }
  }
};
</script>

<style scoped>
.width90{
  width: 90%;
}
</style>
