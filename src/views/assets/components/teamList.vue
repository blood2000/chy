<template>
  <!-- 归属调度列表 -->
  <div class="app-container">
    <el-table v-loading="loading" border stripe :data="infoList">
      <el-table-column label="调度者名称" align="center" prop="name" />
      <el-table-column label="审核状态" align="center" prop="authStatus">
        <template slot-scope="scope">
          <span v-show="scope.row.authStatus === 0" class="g-color-gray">未审核</span>
          <span v-show="scope.row.authStatus === 1" class="g-color-blue">审核中</span>
          <span v-show="scope.row.authStatus === 2" class="g-color-error">审核未通过</span>
          <span v-show="scope.row.authStatus === 3" class="g-color-success">审核通过</span>
        </template>
      </el-table-column>
      <el-table-column label="管理者" align="center" prop="teamLeaderName" />
      <el-table-column label="身份证号" align="center" prop="identificationNumber" />
      <el-table-column label="是否清分" align="center" prop="isDistribution">
        <template slot-scope="scope">
          <span>{{ selectDictLabel(isOptions, scope.row.isDistribution) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="清分百分比" align="center" prop="distributionPercent" />
      <el-table-column label="状态" align="center" prop="status">
        <template slot-scope="scope">
          <span>{{ selectDictLabel(statusOptions, scope.row.status) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { listDriverBelongTeam } from '@/api/assets/driver';
import { listVehicleBelongTeam } from '@/api/assets/vehicle';

export default {
  props: {
    driverCode: {
      type: String,
      default: null
    },
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
      // 状态字典
      statusOptions: [
        { dictLabel: '启用', dictValue: '0' },
        { dictLabel: '禁用', dictValue: '1' }
      ],
      isOptions: [
        { dictLabel: '否', dictValue: 0 },
        { dictLabel: '是', dictValue: 1 }
      ],
      // 处理状态字典
      applyStatusOptions: [
        { dictLabel: '未处理', dictValue: 0 },
        { dictLabel: '已加入', dictValue: 1 },
        { dictLabel: '已拒绝', dictValue: 2 }
      ]
    };
  },
  methods: {
    /** 查询调度者列表 */
    getList() {
      this.loading = true;
      if (this.driverCode) {
        listDriverBelongTeam(this.driverCode).then(response => {
          this.infoList = response.data;
          this.loading = false;
        });
      }
      if (this.vehicleCode) {
        listVehicleBelongTeam(this.vehicleCode).then(response => {
          this.infoList = response.data;
          this.loading = false;
        });
      }
    }
  }
};
</script>
