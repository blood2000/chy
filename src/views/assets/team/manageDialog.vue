<template>
  <!--<el-dialog
    class="page-team-manage-dialog"
    :visible="visible"
    :fullscreen="isfullscreen"
    width="1300px"
    title="管理"
    append-to-body
    :modal-append-to-body="false"
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
    class="page-team-manage-dialog"
  >
    <el-tabs v-model="activeName">
      <el-tab-pane label="司机管理" name="driver">
        <driver-page ref="DriverPage" :team-code="teamCode" :team-name="teamName" />
      </el-tab-pane>
      <el-tab-pane label="车辆管理" name="vehicle">
        <vehicle-page ref="VehiclePage" :team-code="teamCode" />
      </el-tab-pane>
      <el-tab-pane label="FM历史" name="fmHistory">
        <fm-page ref="FmHistory" :team-code="teamCode" />
      </el-tab-pane>
    </el-tabs>
  </el-drawer>
<!--  </el-dialog>-->
</template>

<script>
import DriverPage from '../driver/index.vue';
import VehiclePage from '../vehicle/index.vue';
import FmPage from './fmHistory.vue';

export default {
  name: 'TeamManageDialog',
  components: {
    DriverPage,
    VehiclePage,
    FmPage
  },
  props: {
    open: Boolean,
    teamCode: {
      type: String,
      default: null
    },
    teamName: {
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
          this.$refs.DriverPage.handleQuery();
          this.$refs.VehiclePage.handleQuery();
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
.page-team-manage-dialog{
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
