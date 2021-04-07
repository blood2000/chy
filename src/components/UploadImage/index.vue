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
import { getToken } from '@/utils/auth';
import { getFile } from '@/api/system/image.js';

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
      uploadImgUrl: process.env.VUE_APP_BASE_API + '/assets/upload/uploadToAli', // 上传的图片服务器地址
      headers: {
        'Authorization': 'Bearer ' + getToken(),
        'Produce-Code': '776ca8e240574192b6e0f69b417163df',
        'App-Code': '3f78fbfc13b14fa4b3d78665124ef4bb',
        'App-Version': '2.0',
        'Terminal-Type': 'web'
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
      this.$emit('input', res.data.code);
      this.loading.close();
      this.handleGetFile(res.data.code);
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
    handleBeforeUpload() {
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
