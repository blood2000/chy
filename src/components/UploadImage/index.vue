<template>
  <div class="component-upload-image">
    <el-upload
      :action="uploadImgUrl"
      :data="uploadData"
      list-type="picture-card"
      :on-success="handleUploadSuccess"
      :before-upload="handleBeforeUpload"
      :on-error="handleUploadError"
      name="file"
      :show-file-list="false"
      :headers="headers"
      :disabled="disabled"
      style="display: inline-block; vertical-align: top"
    >
      <img v-if="value && !disabled" :src="attachUrl" class="avatar">
      <div v-else-if="value && disabled" v-viewer class="avatar">
        <img :src="attachUrl" class="avatar">
      </div>
      <i v-else class="el-icon-plus avatar-uploader-icon" />
    </el-upload>
  </div>
</template>

<script>
import { uploadImgApi, getFile } from '@/api/system/image.js';
import { getToken } from '@/utils/auth';
import { authorPre, produceCode, appCode, appVersion, terminalType } from '@/headers';

export default {
  components: {},
  props: {
    value: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      uploadImgUrl: process.env.VUE_APP_BASE_API + uploadImgApi, // 上传的图片服务器地址
      headers: {
        'Authorization': authorPre + getToken(),
        'Produce-Code': produceCode,
        'App-Code': appCode,
        'App-Version': appVersion,
        'Terminal-Type': terminalType
      },
      uploadData: {},
      attachUrl: ''
    };
  },
  watch: {
    value(val) {
      if (val) {
        this.handleGetFile(val);
      }
    }
  },
  mounted() {
    if (this.value) {
      this.handleGetFile(this.value);
    }
  },
  methods: {
    handleUploadSuccess(res) {
      if (res.code === 200) {
        this.$emit('input', res.data.code);
        this.loading.close();
        this.handleGetFile(res.data.code);
      }
    },
    handleGetFile(code) {
      getFile(code).then(response => {
        if (response.data && response.data.length > 0) {
          this.attachUrl = response.data[0].attachUrl;
        } else {
          this.attachUrl = '';
        }
      });
    },
    handleBeforeUpload(file) {
      const isLt1M = file.size / 1024 / 1024 < 1;
      if (!isLt1M) {
        this.msgWarning('上传文件大小不能超过1MB');
        return;
      }
      this.loading = this.$loading({
        lock: true,
        text: '上传中',
        background: 'rgba(0, 0, 0, 0.7)'
      });
    },
    handleUploadError() {
      this.$message({
        type: 'error',
        message: '上传失败'
      });
      this.loading.close();
    }
  }
};
</script>

<style scoped lang="scss">
.avatar {
  width: 100%;
  height: 100%;
}
</style>
