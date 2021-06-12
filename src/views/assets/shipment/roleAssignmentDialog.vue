<template>
  <el-dialog title="分配角色" :visible="visible" width="600px" append-to-body :close-on-click-modal="false" @close="cancel">
    <el-form ref="form" :model="form" :rules="rules" label-width="130px">
      <!--   <el-form-item label="货主" prop="form.adminName">
            <el-input v-model="form.adminName" disabled/>
        </el-form-item>-->
      <el-form-item label="角色" prop="roleCodes">
        <el-select v-model="form.roleCodes" multiple placeholder="请选择" clearable filterable style="width: 100%">
          <el-option
            v-for="item in roleOptions"
            :key="item.roleCode"
            :label="item.roleName"
            :value="item.roleCode"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="复制货主成员角色" prop="copyShipmentCompanyCode">
          <el-select v-model="form.copyShipmentCompanyCode" placeholder="请选择搜索关键字" clearable filterable remote :remote-method="shipmentRemoteMethod" style="width: 100%">
              <el-option
                      v-for="item in shipmentOptions"
                      :key="item.code"
                      :label="item.adminName+'('+item.telphone+')'"
                      :value="item.companyCode"
                      :disabled="item.code == shipmentCode"
              />
          </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" :loading="buttonLoading" @click="submitForm">确 定</el-button>
      <el-button @click="cancel">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getUser } from '@/api/system/user';
import { roleAssignment } from '@/api/system/role';
import { listShipmentAll } from '@/api/assets/shipment';
import { mapGetters } from 'vuex';

export default {
  components: {
  },
  props: {
    open: Boolean,
    shipmentCode: {
      type: String,
      default: null
    },
    companyCode: {
      type: String,
      default: null
    },
    userCode: {
      type: String,
      default: null
    },
    adminName: {
      type: String,
      default: null
    },
    userId: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      buttonLoading: false,
      authButtonLoading: false,
      roleOptions: [],
      shipmentOptions: [],
      // 表单参数
      form: {
      },
      // 表单校验
      rules: {
        roleCodes: [
          { required: true, message: '角色不能为空', trigger: ['change', 'blur'] }
        ]
      }
    };
  },
  computed: {
    ...mapGetters(['isAdmin']),
    visible: {
      get() {
        return this.open;
      },
      set(v) {
        this.$emit('update:open', v);
      }
    }
  },
  watch: {
    // 根据名称筛选部门树
    visible(val) {
      if (val) {
        this.form.shipmentCode = this.shipmentCode;
        if (this.adminName) {
          this.form.adminName = this.adminName;
        }
        this.form.userId = this.userId;
        this.form.userCode = this.userCode;
        this.form.companyCode = this.companyCode;
        this.copyShipmentCompanyCode = undefined;
        this.listRole();
      }
    }
  },
  created() {
  },
  methods: {
    getShipmentAll(data) {
      data.authStatus = 3;
      listShipmentAll(data).then(response => {
        this.shipmentOptions = response.rows;
      });
    },
    // 车辆远程搜索
    shipmentRemoteMethod(query) {
      if (query !== '') {
        var data = { keywords: query };
        this.getShipmentAll(data);
      } else {
        this.shipmentOptions = [];
      }
    },
    // 取消按钮
    cancel() {
      this.close();
    },
    // 关闭弹窗
    close() {
      this.form = {
        userId: undefined,
        userCode: undefined,
        shipmentCode: undefined,
        companyCode: undefined,
        roleCodes: undefined,
        copyShipmentCompanyCode: undefined
      };
      this.$emit('update:open', false);
    },
    listRole() {
      this.buttonLoading = true;
      getUser(this.form.userId, { orgCode: this.companyCode, orgType: '2', showRoleAll: true }).then(response => {
        this.roleOptions = response.roles;
        this.form.roleCodes = response.roleCodes;
        this.buttonLoading = false;
      });
    },
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.buttonLoading = true;
          roleAssignment(this.form).then(response => {
            this.msgSuccess('分配成功');
            this.buttonLoading = false;
            this.close();
          }).catch(() => {
            this.buttonLoading = false;
          });
        }
      });
    }
  }
};
</script>

<style scoped>
.mr3{
  margin-right: 3%;
}
.mt{
  margin-top: 22px;
}
.width90{
  width: 90%;
}
.width70{
  width: 70%;
}
.width60{
  width: 60%;
}
.width50{
  width: 50%;
}
.width45{
    width: 45%;
}
.width28{
  width: 28%;
}
.width12{
  width: 12%;
}
/* 计数器样式 */
.el-input-number ::v-deep.el-input__inner{
  text-align: left;
}
/* 上传图片文字样式 */
.upload-image-label{
  margin: 0;
  line-height: 24px;
}
</style>
