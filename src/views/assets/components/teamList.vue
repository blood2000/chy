<template>
  <!-- 归属调度列表 -->
  <div class="app-container">
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5" class="fr">
        <tablec-cascader v-model="tableColumnsConfig" :lcokey="api" />
      </el-col>
    </el-row>

    <RefactorTable :loading="loading" :data="infoList" :table-columns-config="tableColumnsConfig">
      <template #status="{row}">
        <span>{{ selectDictLabel(statusOptions, row.status) }}</span>
      </template>
      <template #isDistribution="{row}">
        <span>{{ selectDictLabel(isOptions, row.isDistribution) }}</span>
      </template>
    </RefactorTable>

  </div>
</template>

<script>
import { listTeamApi } from '@/api/assets/team';
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
      tableColumnsConfig: [],
      api: listTeamApi,
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
  created() {
    this.tableHeaderConfig(this.tableColumnsConfig, listTeamApi);
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
