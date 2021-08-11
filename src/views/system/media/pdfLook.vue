<template>
  <el-dialog :visible="visible" width="60%" :title="title" :close-on-click-modal="false" append-to-body @close="cancel">
    <pdf
      v-for="i in numPages"
      ref="pdf"
      :key="i"
      :src="src"
      :page="i"
    />
  </el-dialog>
</template>

<script>
import pdf from 'vue-pdf';

export default {
  components: {
    pdf
  },
  props: {
    src: {
      type: String,
      default: ''
    },
    open: Boolean,
    title: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      numPages: null
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
        this.getNumPages();
      }
    }
  },
  methods: {
    getNumPages() {
      pdf.createLoadingTask(this.src).promise.then(pdf => {
        this.numPages = pdf.numPages;
      }).catch(err => {
        console.error('pdf 加载失败', err);
      });
    },
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
