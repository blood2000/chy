<template>
  <!--<el-dialog
    class="page-driver-manage-dialog"
    :visible="visible"
    :fullscreen="isfullscreen"
    width="1300px"
    title="管理"
    append-to-body
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
    class="page-driver-manage-dialog"
  >
    <el-tabs v-model="activeName">
      <el-tab-pane label="车辆管理" name="vehicle">
        <vehicle-page ref="VehiclePage" :team-code="teamCode" :driver-code="driverCode" />
      </el-tab-pane>
      <el-tab-pane label="归属调度" name="team">
        <team-list-page ref="TeamListPage" :driver-code="driverCode" />
      </el-tab-pane>
    </el-tabs>
  </el-drawer>
  <!-- </el-dialog>-->
</template>

<script>
import VehiclePage from '../vehicle/index.vue';
import TeamListPage from '../components/teamList';

export default {
  name: 'DriverManageDialog',
  components: {
    VehiclePage,
    TeamListPage
  },
  props: {
    open: Boolean,
    teamCode: {
      type: String,
      default: null
    },
    driverCode: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      isfullscreen: false,
      activeName: 'vehicle'
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
          this.activeName = 'vehicle';
          this.$refs.VehiclePage.handleQuery();
          this.$refs.TeamListPage.getList();
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
.page-driver-manage-dialog{
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
