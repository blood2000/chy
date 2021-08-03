<template>
  <viewer :images="[...loadVoucherAttrs, ...unloadVoucherAttrs]">

    <div class="img_box">
      <div>装货凭证（{{ rowdata.waybillNo || '请点击列表查看凭证' }}）：</div>
      <div v-if="loadVoucherAttrs.length" class="img_box1">
        <div v-for="(src,index) in loadVoucherAttrs" :key="src + index">
          <img
            :src="src"
            class="img"
          >
        </div>
      </div>
      <div v-else class="img img_box"><DataNull :null-title="'暂无装货凭证'" /></div>
      <div>卸货凭证（{{ rowdata.waybillNo || '请点击列表查看凭证' }}）：</div>
      <div v-if="unloadVoucherAttrs.length" class="img_box1">
        <div v-for="(src,index) in unloadVoucherAttrs" :key="src + index">
          <img
            :src="src"
            class="img"
          >
        </div>
      </div>
      <div v-else class="img img_box"><DataNull :null-title="'暂无卸货凭证'" /></div>
    </div>

  </viewer>
</template>

<script>
import DataNull from '@/components/DataNull/index';
export default {
  components: { DataNull },
  props: {
    rowdata: {
      type: Object,
      default: () => { return {}; }
    }
  },
  data() {
    return {
      loadVoucherAttrs: [],
      unloadVoucherAttrs: []
    };
  },
  watch: {
    rowdata(val) {
      console.log(val);
      if (val) {
        this.loadVoucherAttrs = val.loadVoucherAttrs ? val.loadVoucherAttrs.split(',') : [];
        this.unloadVoucherAttrs = val.unloadVoucherAttrs ? val.unloadVoucherAttrs.split(',') : [];
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.img_box{
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
}
.img_box1{
  width: 510px;
  height: 360px;
  overflow-x: scroll;
  display: flex;
}
.img{
  width: 500px;
  height: 350px;
  object-fit: contain;
  border: 1px dashed #ddd;
  border-radius: 10px;
  margin-left: 10px;
}
</style>
