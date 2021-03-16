<template>
  <el-dialog
    class="page-team-manage-dialog"
    :visible="visible"
    :fullscreen="isfullscreen"
    width="1300px"
    title="管理"
    append-to-body
    @close="cancel"
  >
    <el-tabs v-model="activeName">
      <el-tab-pane label="司机管理" name="driver">
        <driver-page ref="DriverPage" :teamcode="teamcode" />
      </el-tab-pane>
      <el-tab-pane label="车辆管理" name="vehicle">
        <vehicle-page ref="VehiclePage" :teamcode="teamcode" />
      </el-tab-pane>
    </el-tabs>
  </el-dialog>
</template>

<script>
import DriverPage from '../driver/index.vue';
import VehiclePage from '../vehicle/index.vue';

export default {
  name: 'TeamManageDialog',
  components: {
    DriverPage,
    VehiclePage
  },
  props: {
    open: Boolean,
    teamcode: {
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
          this.$refs.DriverPage.handleQuery();
          this.$refs.VehiclePage.handleQuery();
        });
      }
    }
  },
  create() {

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
