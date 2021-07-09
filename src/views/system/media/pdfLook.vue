<template>
  <el-dialog :visible="visible" width="60%" :title="title" :close-on-click-modal="false" append-to-body @close="cancel">
    <pdf :src="src" />
  </el-dialog>
</template>

<script>
import pdf from 'vue-pdf';

export default {
  components: {
    pdf
  },
  props: {
    src: String,
    open: Boolean,
    title: String
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
