<template>
  <!-- 归属司机列表 -->
  <div class="app-container">
    <el-table v-loading="loading" highlight-current-row border :data="infoList">
      <el-table-column label="司机姓名" align="center" prop="name" />
      <el-table-column label="司机类别" align="center" prop="driverType">
        <template slot-scope="scope">
          <span>{{ selectDictLabel(driverTypeOptions, scope.row.driverType) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="审核状态" align="center" prop="authStatus">
        <template slot-scope="scope">
          <i v-show="scope.row.authStatus === 0" class="g-icon-none mr5" />
          <i v-show="scope.row.authStatus === 1" class="g-icon-deal-blue mr5" />
          <i v-show="scope.row.authStatus === 2" class="el-icon-error g-color-error mr5" />
          <i v-show="scope.row.authStatus === 3" class="el-icon-success g-color-success mr5" />
          <span>{{ selectDictLabel(statusOptions, scope.row.authStatus) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="手机号" align="center" prop="telphone" />
      <el-table-column label="身份证号" align="center" prop="identificationNumber" />
      <el-table-column label="驾驶证类型" align="center" prop="driverLicenseType">
        <template slot-scope="scope">
          <span>{{ selectDictLabel(driverLicenseTypeOptions, scope.row.driverLicenseType) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="工作单位" align="center" prop="workCompany" />
    </el-table>
  </div>
</template>

<script>
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
