<template>
  <el-dialog
    :visible="visible"
    :fullscreen="isfullscreen"
    width="1300px"
    title="处理申请"
    append-to-body
    @close="cancel"
  >
    <el-table v-loading="loading" :data="infoList" border stripe @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" fixed="left" />
      <el-table-column label="序号" align="center" type="index" min-width="5%" />
      <el-table-column label="司机类别" align="center" prop="driverType">
        <template slot-scope="scope">
          <span>{{ selectDictLabel(driverTypeOptions, scope.row.driverType) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="名字" align="center" prop="name" />
      <el-table-column label="审核状态" align="center" prop="authStatus" width="120">
        <template slot-scope="scope">
          <i v-show="scope.row.authStatus === 0" class="el-icon-warning g-color-light-gray mr5" />
          <i v-show="scope.row.authStatus === 1" class="g-icon-deal mr5" />
          <i v-show="scope.row.authStatus === 2" class="el-icon-error g-color-error mr5" />
          <i v-show="scope.row.authStatus === 3" class="el-icon-success g-color-success mr5" />
          <span>{{ selectDictLabel(authStatusOptions, scope.row.authStatus) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="手机" align="center" prop="telphone" />
      <el-table-column label="工作单位" align="center" prop="workCompany" />
      <el-table-column label="地址" align="center" prop="homeAddress" />
      <el-table-column label="身份证号" align="center" prop="identificationNumber" />
      <el-table-column label="驾驶证" align="center" prop="driverLicense" />
      <!-- <el-table-column label="驾驶证有效期自" align="center" prop="validPeriodFrom" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.validPeriodFrom, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="驾驶证有效期至" align="center" prop="validPeriodTo" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.validPeriodTo, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="驾驶证类型" align="center" prop="driverLicenseType">
        <template slot-scope="scope">
          <span>{{ selectDictLabel(driverLicenseTypeOptions, scope.row.driverLicenseType) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="上岗证" align="center" prop="workLicense" />
      <el-table-column label="从业资格证到期日期" align="center" prop="workLicenseDueDate" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.workLicenseDueDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <!--<el-table-column label="营业执照号" align="center" prop="businessLicenseImgNo" />-->
      <!-- <el-table-column label="是否上传人员信用信息" align="center" prop="isReportPerson">
        <template slot-scope="scope">
          <span>{{ selectDictLabel(isOption, scope.row.isReportPerson) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="上传人员信用信息时间" align="center" prop="isReportPersonDate" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.isReportPersonDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="驾驶证发证机关" align="center" prop="issuingOrganizations" />
      <el-table-column label="是否上传企业" align="center" prop="isReportEnterprise">
        <template slot-scope="scope">
          <span>{{ selectDictLabel(isOption, scope.row.isReportEnterprise) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="上传企业" align="center" prop="isReportEnterpriseDate" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.isReportEnterpriseDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="从业资格证办理省份名称" align="center" prop="workLicenseProvinceName" />
      <el-table-column label="是否冻结" align="center" prop="isFreeze">
        <template slot-scope="scope">
          <span>{{ selectDictLabel(isFreezoneOptions, scope.row.isFreeze) }}</span>
        </template>
      </el-table-column> -->
    </el-table>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" :disabled="multiple" @click="handleAgree(1)">同 意</el-button>
      <el-button type="danger" :disabled="multiple" @click="handleAgree(2)">拒 绝</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { listApply, dealApply } from '@/api/assets/team';

export default {
  name: 'ApplyDriverDialog',
  props: {
    open: Boolean,
    teamCode: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      isfullscreen: false,
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      driverCodes: [],
      // 非多个禁用
      multiple: true,
      // 司机类别字典
      driverTypeOptions: [
        { dictLabel: '独立司机', dictValue: 1 },
        { dictLabel: '聘用司机', dictValue: 2 }
      ],
      // 是否冻结字典
      isFreezoneOptions: [
        { dictLabel: '正常', dictValue: 0 },
        { dictLabel: '冻结', dictValue: 1 }
      ],
      // 是否
      isOption: [
        { dictLabel: '否', dictValue: 0 },
        { dictLabel: '是', dictValue: 1 }
      ],
      // 审核状态字典
      authStatusOptions: [
        { dictLabel: '未审核', dictValue: 0 },
        { dictLabel: '审核中', dictValue: 1 },
        { dictLabel: '审核未通过', dictValue: 2 },
        { dictLabel: '审核通过', dictValue: 3 }
      ],
      // 参数表格数据
      infoList: [],
      // 驾驶证类型字典
      driverLicenseTypeOptions: []
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
  watch: {
    open(val) {
      if (val) {
        this.getList();
      }
    }
  },
  created() {
    this.getDictsOptions();
  },
  methods: {
    /** 查询字典 */
    getDictsOptions() {
      // 驾驶证类型
      this.getDicts('driver_license_type').then(response => {
        this.driverLicenseTypeOptions = response.data;
      });
    },
    // 获取调度者要处理的司机列表
    getList() {
      this.loading = true;
      console.log(this.teamCode);
      listApply(this.teamCode).then(response => {
        this.infoList = response.data;
        this.loading = false;
      });
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id);
      this.driverCodes = selection.map(item => item.code);
      this.multiple = !selection.length;
    },
    // 表单重置
    reset() {
      this.resetForm('queryForm');
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
    // 同意按钮
    handleAgree(status) {
      dealApply({
        teamCode: this.teamCode,
        ids: this.ids,
        driverCodes: this.driverCodes,
        status: status
      }).then(response => {
        this.msgSuccess('操作成功');
        this.close();
        this.$emit('refresh');
      });
    }
  }
};
</script>
