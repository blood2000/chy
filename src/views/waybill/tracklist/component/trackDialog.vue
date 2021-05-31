<template>
  <!-- 车辆跟踪对话框 -->
  <el-dialog :title="title" :visible="visible" width="1400px" append-to-body destroy-on-close :close-on-click-modal="false" @close="cancel">
    <Track v-if="open" :waybill="wayBillInfo" />
  </el-dialog>
</template>

<script>
import Track from '../../components/track';

export default {
  name: 'TrackDialog',
  components: {
    Track
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    open: Boolean
    // disable: Boolean
  },
  data() {
    return {
      // 运单信息
      wayBillInfo: {}
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
  created() {
  },
  methods: {
    /** 取消按钮 */
    cancel() {
      this.close();
    },
    // 关闭弹窗
    close() {
      this.$emit('update:open', false);
    },
    // 表单赋值
    setForm(data) {
      this.wayBillInfo = data;
    }
  }
};
</script>

<style scoped lang="scss">
.mr3 {
  margin-right: 3%;
}
.width90 {
  width: 90%;
}
.width28 {
  width: 28%;
}
.el-input-number ::v-deep.el-input__inner {
  text-align: left;
}
.el-rate{
  margin-top: 8px;
}
.track-onbtn{
  cursor: pointer;
  width: 124px;
  height: 32px;
  background: #409EFF;
  border-radius: 18px;
  line-height: 22px;
  color: #FFFFFF;
  .track-onicon{
    margin-right: 10px;
    height: 10px;
    width: 10px;
    border-radius: 50%;
    background: #FFFFFF;
    border: 3px solid #1570CE;
  }
}
.track-btn{
  cursor: pointer;
  width: 124px;
  height: 32px;
  background: #F6F6F6;
  border-radius: 18px;
  line-height: 22px;
  color: #000000;
  .track-icon{
    margin-right: 10px;
    height: 10px;
    width: 10px;
    border-radius: 50%;
    background: #B2B4B9;
  }
}



/* 轨迹-时间线 */
.time-line-content{
  margin: 20px 0 0;
  padding: 20px;
  border: 1px solid rgba(0, 0, 0, 0);
  box-shadow: 0px 3px 10px rgba(0, 0, 0, 0.09);
  max-height: 600px;
  overflow: scroll;
  >li{
    position: relative;
    padding: 0 0 20px 20px;
    border-left: 1px dashed #d2d4da;
    &::before{
      content: '';
      position: absolute;
      top: 5px;
      left: -6px;
      width: 11px;
      height: 11px;
      border-radius: 100%;
      background: #d2d4da;
    }
    &.light{
      &::before{
        content: '';
        background: #409EFF;
      }
    }
  }
}
</style>
