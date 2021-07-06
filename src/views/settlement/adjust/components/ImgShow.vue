<template>
  <viewer :images="[...loadVoucherAttrs, ...unloadVoucherAttrs]">

    <div class="img_box">
      <div v-if="loadVoucherAttrs.length" class="img_box">
        <img
          v-for="(src,index) in loadVoucherAttrs"
          :key="index"
          v-real-img="src"
          fit="contain"
          src="@/assets/images/workbench/icon_noavator.png"
          style="width: 100px; height: 100px; margin:0 10px"
        >
      </div>
      <div v-else>
        无装货凭证图
      </div>

      <el-divider direction="vertical" />

      <div v-if="unloadVoucherAttrs.length" class="img_box">
        <img
          v-for="(src,index) in unloadVoucherAttrs"
          :key="src + index"
          v-real-img="src"
          fit="contain"
          src="@/assets/images/workbench/icon_noavator.png"
          style="width: 100px; height: 100px; margin:0 10px"
        >
      </div>
      <div v-else>
        无卸货凭证图
      </div>
    </div>

  </viewer>
</template>

<script>
export default {
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

  created() {
    console.log(this.rowdata, '想每次都要触发');
    this.loadVoucherAttrs = this.rowdata.loadVoucherAttrs ? this.rowdata.loadVoucherAttrs.split(',') : [];
    this.unloadVoucherAttrs = this.rowdata.unloadVoucherAttrs ? this.rowdata.unloadVoucherAttrs.split(',') : [];
  }

};
</script>

<style lang="scss" scoped>
.img_box{
    display: flex;
    align-items: center;
    justify-content: space-around;
}
</style>
