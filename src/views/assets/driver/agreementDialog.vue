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
      <span v-if="electronInfo.isDzqzContract === 3" class="g-color-error">生成电子签章失败原因：{{ electronInfo.contractFailMessage }}</span>
      <el-button v-if="electronInfo.isDzqzContract === 1" :loading="loading" type="primary" @click="handleDownload">下载电子签章</el-button>
      <el-button v-if="electronInfo.isDzqzContract !== 1" :loading="loading" type="primary" @click="handleElectron">{{ electronInfo.isDzqzContract === 3?'再次':'' }}生成电子签章</el-button>
      <el-button type="primary" @click="submitForm">打 印</el-button>
      <el-button @click="cancel">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { entrustElectron, getElectron } from '@/api/assets/driver';
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
      form: {
        driverCode: '',
        teamCode: ''
      },
      driverInfo: {},
      electronInfo: {},
      loading: false
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
    },
    setForm(row, teamCode) {
      this.driverInfo = row;
      getElectron(row.agreementNo).then(res => {
        this.electronInfo = res.data;
      });
      this.form = {
        driverCode: row.code,
        teamCode: teamCode,
        agreementNo: row.agreementNo,
        userCode: row.userCode
      };
    },
    handleElectron() {
      // console.log(this.form);
      this.loading = true;
      entrustElectron(this.form).then(res => {
        this.loading = false;
        this.electronInfo.isDzqzContract = 1;
        this.electronInfo.contractPath = res.data.path;
        this.$emit('refresh');
        this.msgSuccess('生成收款委托函电子签章成功！');
      }).catch(res => {
        this.loading = false;
        this.cancel();
        this.$emit('refresh');
      });
    },
    handleDownload() {
      window.open(this.electronInfo.contractPath);
    }
  }
};
</script>

<style lang="scss" scoped>

</style>
