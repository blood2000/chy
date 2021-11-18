<template>
  <el-dialog
    class="page-agreement-dialog"
    :visible="visible"
    width="1060px"
    title="协议"
    append-to-body
    :close-on-click-modal="false"
    @close="cancel"
  >
    <div ref="AgreementHtml" v-html="agreementHtml" />
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitForm">打 印</el-button>
      <el-button @click="cancel">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'AgreementDialog',
  props: {
    open: Boolean,
    agreementHtml: {
      type: String,
      default: ''
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
    // 打印按钮
    submitForm() {
      const content = this.$refs.AgreementHtml.innerHTML;
      var printDiv = document.createElement('div');
      printDiv.innerHTML = content;
      printDiv.style.position = 'fixed';
      printDiv.style.left = '0';
      printDiv.style.top = '0';
      printDiv.style.right = '0';
      printDiv.style.bottom = '0';
      printDiv.style.width = '100%';
      printDiv.style.height = '100%';
      printDiv.style.zIndex = '100000';
      printDiv.style.background = '#fff';
      printDiv.style.overflow = 'auto';
      document.body.appendChild(printDiv);
      window.print();
      document.body.removeChild(printDiv);
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

<style lang="scss" scoped>

</style>
