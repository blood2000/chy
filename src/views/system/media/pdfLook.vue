<template>
    <el-dialog :visible="visible" width="60%" title="预览" :close-on-click-modal="false" append-to-body @close="cancel">
        <pdf :src=src></pdf>
    </el-dialog>
</template>

<script>
import pdf from 'vue-pdf';

export default {
  props: {
    src: String,
    open: Boolean
  },
  components: {
    pdf
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
