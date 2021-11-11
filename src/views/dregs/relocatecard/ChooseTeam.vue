<template>
  <!-- 打开弹框 -->
  <el-dialog :close-on-click-modal="false" title="选择调度" :visible.sync="visible" width="80%">
    <div v-if="visible">
      <GroupIndex
        ref="groupIndex"
        :shipment-code="shipmentInfo.code"
        :iscomponent="true"
        @handlerIndexCopy="handlerIndexCopy"
      />

      <div class="ly-t-right">
        <el-button type="primary" plain @click="visible = false">取 消</el-button>
        <el-button type="primary" :disabled="!indexCopyData" @click="handlerScheduling">确 定</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import GroupIndex from '@/views/enterprise/group/indexCopy.vue';
import { getUserInfo } from '@/utils/auth';
export default {
  components: { GroupIndex },
  props: {
    open: Boolean
  },

  data() {
    return {
      indexCopyData: null
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
    },

    shipmentInfo() {
      const { isShipment = false, shipment = {}} = getUserInfo() || {};

      //   let shipmentInfo = {};
      //   if (this.ztshipmentinfo) {
      //     shipmentInfo = this.ztshipmentinfo;
      //   } else {
      //     shipmentInfo = !isShipment ? (shipment.info || {}) : {};
      //   }

      //   console.log(shipmentInfo);

      return shipment.info;
    }
  },

  methods: {
    handlerScheduling() {
      this.visible = false;
      this.$emit('handlerScheduling', this.indexCopyData);
    },
    groupSelected() {},
    oneSelected() {},

    handlerIndexCopy(data) {
      this.indexCopyData = data;
    }
  }
};
</script>

<style>

</style>
