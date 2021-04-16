<template>
  <el-dialog
    :visible="visible"
    :fullscreen="isfullscreen"
    width="1300px"
    title="邀请司机"
    append-to-body
    @close="cancel"
  >
    <el-form ref="queryForm" :model="queryParams" :inline="true" label-width="86px">
      <el-form-item label="司机类别" prop="driverType">
        <el-select v-model="queryParams.driverType" placeholder="请选择司机类别" filterable clearable size="small" class="input-width">
          <el-option
            v-for="dict in driverTypeOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="用户名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入用户名称"
          clearable
          size="small"
          class="input-width"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="手机号" prop="telphone">
        <el-input
          v-model="queryParams.telphone"
          placeholder="请输入手机号"
          clearable
          size="small"
          class="input-width"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="车牌号" prop="licenseNumber">
        <el-input
          v-model="queryParams.licenseNumber"
          placeholder="请输入车牌号"
          clearable
          size="small"
          class="input-width"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="身份证号" prop="identificationNumber">
        <el-input
          v-model="queryParams.identificationNumber"
          placeholder="请输入身份证号"
          clearable
          size="small"
          class="input-width"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="驾驶证类型" prop="driverLicenseType">
        <el-select v-model="queryParams.driverLicenseType" filterable clearable size="small" class="input-width">
          <el-option
            v-for="dict in driverLicenseTypeOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="处理状态" prop="applyStatus">
        <el-select v-model="queryParams.applyStatus" placeholder="请选择状态" filterable clearable size="small">
          <el-option
            v-for="dict in applyStatusOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="cyan" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table v-loading="loading" :data="driverList" border stripe @selection-change="handleSelectionChange">
      <el-table-column type="selection" :selectable="checkboxSelectable" width="55" align="center" fixed="left" />
      <el-table-column label="序号" align="center" type="index" min-width="5%" />
      <el-table-column label="处理状态" align="center" prop="applyStatus">
        <template slot-scope="scope">
          <span v-if="scope.row.applyStatus !=null && scope.row.applyStatus>=0">{{ selectDictLabel(applyStatusOptions, scope.row.applyStatus) }}</span>
          <span v-else>待加入</span>
        </template>
      </el-table-column>
      <el-table-column label="司机类别" align="center" prop="driverType">
        <template slot-scope="scope">
          <span>{{ selectDictLabel(driverTypeOptions, scope.row.driverType) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="名字" align="center" prop="name" />
      <el-table-column label="审核状态" align="center" prop="authStatus">
        <template slot-scope="scope">
          <span v-show="scope.row.authStatus === 0" class="g-color-gray">未审核</span>
          <span v-show="scope.row.authStatus === 1" class="g-color-blue">审核中</span>
          <span v-show="scope.row.authStatus === 2" class="g-color-error">审核未通过</span>
          <span v-show="scope.row.authStatus === 3" class="g-color-success">审核通过</span>
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
      <el-table-column label="营业执照号" align="center" prop="businessLicenseImgNo" />
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

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <div slot="footer" class="dialog-footer">
      <el-button type="primary" :disabled="multiple" @click="submitForm">确 定</el-button>
      <el-button @click="cancel">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { listDriver } from '@/api/assets/driver';
import { applyDriver } from '@/api/assets/team';

export default {
  name: 'AddDriverDialog',
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
      // 非多个禁用
      multiple: true,
      // 总条数
      total: 0,
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
      // 是否字典
      isOption: [
        { dictLabel: '否', dictValue: 0 },
        { dictLabel: '是', dictValue: 1 }
      ],
      // 处理状态字典
      applyStatusOptions: [
        { dictLabel: '未处理', dictValue: 0 },
        { dictLabel: '已加入', dictValue: 1 },
        { dictLabel: '已拒绝', dictValue: 2 },
        { dictLabel: '待加入', dictValue: 3 }
      ],
      // 网点编码字典
      branchCodeOptions: [],
      // 驾驶证类型字典
      driverLicenseTypeOptions: [],
      // 参数表格数据
      driverList: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        driverType: undefined,
        name: undefined,
        telphone: undefined,
        identificationNumber: undefined,
        authStatus: 3,
        licenseNumber: undefined,
        driverLicenseType: undefined,
        applyStatus: undefined
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
  watch: {
    open(val) {
      if (val) {
        this.handleQuery();
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
    // 获取司机列表
    getList() {
      this.loading = true;
      listDriver(this.queryParams).then(response => {
        this.driverList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.code);
      this.multiple = !selection.length;
    },
    // 搜索按钮操作
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    // 重置按钮操作
    resetQuery() {
      this.reset();
      this.handleQuery();
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
    // 提交按钮
    submitForm() {
      applyDriver({
        teamCode: this.teamCode,
        driverCodes: this.ids
      }).then(response => {
        this.msgSuccess('操作成功');
        this.close();
      });
    },
    // 状态为已加入的checkbox不可选
    checkboxSelectable(row) {
      if (row.applyStatus === 1) {
        return false;
      } else {
        return true;
      }
    }
  }
};
</script>
