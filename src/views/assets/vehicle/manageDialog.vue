<template>
  <!-- <el-dialog
    class="page-vehicle-manage-dialog"
    :visible="visible"
    :fullscreen="isfullscreen"
    width="1300px"
    title="管理"
    append-to-body
    :modal-append-to-body="false"
    :close-on-click-modal="false"
    @close="cancel"
  >-->
  <el-drawer
    size="96%"
    title="管理"
    :wrapper-closable="false"
    :visible.sync="visible"
    direction="rtl"
    append-to-body
    :close="cancel"
    class="page-vehicle-manage-dialog"
  >
    <el-tabs v-model="activeName">
      <el-tab-pane label="归属司机" name="driver">
        <driver-list-page ref="DriverListPage" :vehicle-code="vehicleCode" />
      </el-tab-pane>
      <el-tab-pane label="归属调度" name="team">
        <team-list-page ref="TeamListPage" :vehicle-code="vehicleCode" />
      </el-tab-pane>
      <el-tab-pane label="车辆设备" name="device">
        <vehicle-device-list-page ref="DeviceListPage" :vehicle-code="vehicleCode" :license-number="licenseNumber" />
      </el-tab-pane>
    </el-tabs>
  </el-drawer>
  <!--</el-dialog>-->
</template>

<script>
import DriverListPage from '../components/driverList';
import TeamListPage from '../components/teamList';
import VehicleDeviceListPage from './vehicleDevice';
export default {
  name: 'VehicleManageDialog',
  components: {
    DriverListPage,
    TeamListPage,
    VehicleDeviceListPage
  },
  props: {
    open: Boolean,
    vehicleCode: {
      type: String,
      default: null
    },
    licenseNumber: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      isfullscreen: false,
      activeName: 'driver'
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
        this.$nextTick(() => {
          this.activeName = 'driver';
          this.$refs.TeamListPage.getList();
          this.$refs.DriverListPage.getList();
          this.$refs.DeviceListPage.getList();
        });
      }
    }
  },
  methods: {
    // 取消按钮
    cancel() {
      this.close();
    },
    // 关闭弹窗
    close() {
      this.$emit('update:open', false);
    }
  }
};
</script>

<style lang="scss">
.page-vehicle-manage-dialog{
  .el-drawer__body{
    padding: 0 20px;
    overflow-y: auto;
    .app-container{
      box-shadow: none;
      margin: 0;
      padding: 0;
    }
  }
}
</style>
