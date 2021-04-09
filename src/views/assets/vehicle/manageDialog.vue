<template>
  <el-dialog
    class="page-vehicle-manage-dialog"
    :visible="visible"
    :fullscreen="isfullscreen"
    width="1300px"
    title="管理"
    append-to-body
    @close="cancel"
  >
    <el-tabs v-model="activeName">
      <el-tab-pane label="归属司机" name="driver">
        <driver-list-page ref="DriverListPage" :vehicle-code="vehicleCode" />
      </el-tab-pane>
      <el-tab-pane label="归属调度" name="team">
        <team-list-page ref="TeamListPage" :vehicle-code="vehicleCode" />
      </el-tab-pane>
    </el-tabs>
  </el-dialog>
</template>

<script>
import DriverListPage from '../components/driverList';
import TeamListPage from '../components/teamList';
export default {
  name: 'VehicleManageDialog',
  components: {
    DriverListPage,
    TeamListPage
  },
  props: {
    open: Boolean,
    vehicleCode: {
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
  .el-dialog{
    height: 90vh;
    .el-dialog__body{
      padding: 0 20px 20px;
      background: #fff;
      .app-container{
        box-shadow: none;
        margin: 0;
        padding: 0;
      }
    }
  }
}
</style>
