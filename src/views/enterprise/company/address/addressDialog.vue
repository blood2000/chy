<template>
  <el-dialog :title="title" :visible="visible" width="800px" append-to-body @close="cancel">
    <el-form ref="form" :model="form" :rules="rules" label-width="140px">
      <el-form-item label="地址类型" prop="addressType">
        <el-select v-model="form.addressType" placeholder="请选择地址类型" class="width90">
          <el-option
            v-for="dict in addressTypeOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="parseInt(dict.dictValue)"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-radio-group v-model="form.status">
          <el-radio
            v-for="dict in statusOptions"
            :key="dict.dictValue"
            :label="parseInt(dict.dictValue)"
          >{{ dict.dictLabel }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="地址名称" prop="addressName">
        <el-input v-model="form.addressName" placeholder="请输入地址名称" class="width90" />
      </el-form-item>
      <el-form-item label="联系人" prop="userName">
        <el-input v-model="form.userName" placeholder="请输入联系人" class="width90" />
      </el-form-item>
      <el-form-item label="手机号码" prop="telphone">
        <el-input v-model="form.telphone" placeholder="请输入手机号码" class="width90" />
      </el-form-item>
      <el-form-item label="地址别名" prop="addressOtherName">
        <el-input v-model="form.addressOtherName" placeholder="请输入地址别名" class="width90" />
      </el-form-item>
      <el-form-item label="地址详情" prop="addressDetail">
        <el-input v-model="form.addressDetail" placeholder="请输入地址详情" class="width90" />
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="form.remark" type="textarea" placeholder="请输入备注" class="width90" />
      </el-form-item>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitForm">确 定</el-button>
      <el-button @click="cancel">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { addAddress, updateAddress } from '@/api/enterprise/company/address';

export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    open: Boolean
  },
  data() {
    return {
      // 地址类型字典
      addressTypeOptions: [
        { 'dictLabel': '装货地址', 'dictValue': 1 },
        { 'dictLabel': '卸货地址', 'dictValue': 2 }
      ],
      // 状态字典
      statusOptions: [
        { 'dictLabel': '启用', 'dictValue': 1 },
        { 'dictLabel': '禁用', 'dictValue': 2 }
      ],
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        addressType: [
          { required: true, message: '请选择地址类型', trigger: 'change' }
        ],
        status: [
          { required: true, message: '请选择状态', trigger: 'change' }
        ],
        addressName: [
          { required: true, message: '地址名称不能为空', trigger: 'blur' }
        ],
        userName: [
          { required: true, message: '联系人不能为空', trigger: 'blur' }
        ],
        telphone: [
          { required: true, message: '手机号码不能为空', trigger: 'blur' }
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
  create() {

  },
  methods: {
    // 地址类型字典翻译
    addressTypeFormat(row, column) {
      return this.selectDictLabel(this.addressTypeOptions, row.addressType);
    },
    // 状态字典翻译
    statusFormat(row, column) {
      return this.selectDictLabel(this.statusOptions, row.status);
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.code != null) {
            updateAddress(this.form).then(response => {
              this.msgSuccess('修改成功');
              this.close();
              this.$emit('refresh');
            });
          } else {
            addAddress(this.form).then(response => {
              this.msgSuccess('新增成功');
              this.close();
              this.$emit('refresh');
            });
          }
        }
      });
    },
    // 取消按钮
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
        code: null,
        shipmentCode: null,
        addressType: null,
        status: 1,
        createCode: null,
        createTime: null,
        updateCode: null,
        updateTime: null,
        addressName: null,
        addressOtherName: null,
        latitude: null,
        longitude: null,
        addressDetail: null,
        userName: null,
        telphone: null,
        remark: null
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
.width90{
  width: 90%;
}
</style>
