<template>
  <el-dialog :visible="visible" width="60%" title="预览" :close-on-click-modal="false" append-to-body @close="cancel">
    <viewer align="center" :images="photo">
      <img
        v-for="(src,index) in photo"
        :key="index"
        v-real-img="src"
        src="@/assets/images/workbench/icon_noavator.png"
        class="avatar-wrapper__image"
      >
    </viewer>
  </el-dialog>
</template>
<script>
export default {
  props: {
    src: Array,
    open: Boolean
  },
  data() {
    return {
      photo: []
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
        this.loadUrl();
      }
    }
  },
  mounted() {
  },
  methods: {
    // 取消按钮
    cancel() {
      this.close();
    },
    // 关闭弹窗
    close() {
      this.$emit('update:open', false);
    },
    loadUrl() {
      this.photo = this.src;
    }
  }
};
</script>
