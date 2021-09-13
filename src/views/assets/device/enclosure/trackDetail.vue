<template>
  <el-drawer
    size="40%"
    title="轨迹详情"
    :wrapper-closable="true"
    :visible.sync="visible"
    direction="rtl"
    append-to-body
    :close="cancel"
    class="device-track-detail-dialog"
  >
    <div>
      <el-table :data="trackList">
        <el-table-column label="序号" fixed="left" type="index" width="80" />
        <el-table-column property="gpsTime" label="时间" />
        <el-table-column property="gpsSpeed" label="速度">
          <template slot-scope="scope">
            <span>{{ scope.row.gpsSpeed + ' (km/h)' }}</span>
          </template>
        </el-table-column>
        <el-table-column property="lng" label="经度" />
        <el-table-column property="lat" label="纬度" />
      </el-table>
    </div>
  </el-drawer>
</template>

<script>
export default {
  name: 'TrackDetailDrawer',
  props: {
    open: Boolean,
    trackList: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  data() {
    return {
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
.device-track-detail-dialog{
  .el-drawer__body{
    padding: 0 20px;
    overflow-y: auto;
  }
}
</style>
