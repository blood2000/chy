<template>
  <div class="app-container">
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5" class="fr">
        <tablec-cascader v-model="tableColumnsConfig" />
      </el-col>
    </el-row>

    <RefactorTable :loading="loading" :data="infoList" :table-columns-config="tableColumnsConfig">
      <template #driverType="{row}">
        <span>{{ selectDictLabel(driverTypeOptions, row.driverType) }}</span>
      </template>
      <template #authStatus="{row}">
        <span v-show="row.authStatus === 0" class="g-color-gray">未审核</span>
        <span v-show="row.authStatus === 1" class="g-color-blue">审核中</span>
        <span v-show="row.authStatus === 2" class="g-color-error">审核未通过</span>
        <span v-show="row.authStatus === 3" class="g-color-success">审核通过</span>
      </template>
      <template #validPeriodFrom="{row}">
        <span>{{ parseTime(row.validPeriodFrom, '{y}-{m}-{d}') }}</span>
      </template>
      <template #validPeriodTo="{row}">
        <span>{{ parseTime(row.validPeriodTo, '{y}-{m}-{d}') }}</span>
      </template>
      <template #driverLicenseType="{row}">
        <span>{{ selectDictLabel(driverLicenseTypeOptions, row.driverLicenseType) }}</span>
      </template>
      <template #workLicenseDueDate="{row}">
        <span>{{ parseTime(row.workLicenseDueDate, '{y}-{m}-{d}') }}</span>
      </template>
      <template #isReportPerson="{row}">
        <span>{{ selectDictLabel(isOption, row.isReportPerson) }}</span>
      </template>
      <template #isReportEnterprise="{row}">
        <span>{{ selectDictLabel(isOption, row.isReportEnterprise) }}</span>
      </template>
      <template #isFreeze="{row}">
        <span>{{ selectDictLabel(isFreezoneOptions, row.isFreeze) }}</span>
      </template>
      <template #createTime="{row}">
        <span>{{ parseTime(row.createTime, '{y}-{m}-{d}') }}</span>
      </template>
      <template #updateTime="{row}">
        <span>{{ parseTime(row.updateTime, '{y}-{m}-{d}') }}</span>
      </template>
      <template #isReportPersonDate="{row}">
        <span>{{ parseTime(row.isReportPersonDate, '{y}-{m}-{d}') }}</span>
      </template>
    </RefactorTable>

  </div>
</template>

<script>
import { listDriverApi } from '@/api/assets/driver';
import { listVehicleBelongDriver } from '@/api/assets/vehicle';

export default {
  props: {
    vehicleCode: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      tableColumnsConfig: [],
      // 遮罩层
      loading: true,
      // 调度者表格数据
      infoList: [],
      // 司机类别字典
      driverTypeOptions: [
        { dictLabel: '独立司机', dictValue: 1 },
        { dictLabel: '聘用司机', dictValue: 2 }
      ],
      // 审核状态字典
      statusOptions: [
        { dictLabel: '未审核', dictValue: 0 },
        { dictLabel: '审核中', dictValue: 1 },
        { dictLabel: '审核未通过', dictValue: 2 },
        { dictLabel: '审核通过', dictValue: 3 }
      ],
      // 处理状态字典
      applyStatusOptions: [
        { dictLabel: '未处理', dictValue: 0 },
        { dictLabel: '已加入', dictValue: 1 },
        { dictLabel: '已拒绝', dictValue: 2 }
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
      // 网点编码字典
      branchCodeOptions: [],
      // 驾驶证类型字典
      driverLicenseTypeOptions: []
    };
  },
  created() {
    this.getDictsOptions();
    this.tableHeaderConfig(this.tableColumnsConfig, listDriverApi);
  },
  methods: {
    /** 查询字典 */
    getDictsOptions() {
      // 驾驶证类型
      this.getDicts('driver_license_type').then(response => {
        this.driverLicenseTypeOptions = response.data;
      });
    },
    /** 查询司机列表 */
    getList() {
      this.loading = true;
      if (this.vehicleCode) {
        listVehicleBelongDriver(this.vehicleCode).then(response => {
          this.infoList = response.data;
          this.loading = false;
        });
      }
    }
  }
};
</script>
