<template>
    <el-dialog :visible="visible" fullscreen title="预览" :close-on-click-modal="false" append-to-body @close="cancel">
        <!--<div v-html="src" />-->
        <iframe :src='htmlSrc' width='100%' height='800px' frameborder='0'>
        </iframe>
    </el-dialog>
</template>
<script>
export default {
  props: {
    src: String,
    open: Boolean
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
  data() {
    return {
      htmlSrc: ''
    };
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
      this.htmlSrc = 'https://view.officeapps.live.com/op/embed.aspx?src=' + this.src;
    }
  }
};
</script>
