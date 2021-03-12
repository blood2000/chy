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
      <img v-if="value" :src="value" class="avatar">
      <i v-else class="el-icon-plus avatar-uploader-icon" />
    </el-upload>
  </div>
</template>

<script>
import { getToken } from '@/utils/auth';

export default {
  components: {},
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      uploadImgUrl: process.env.VUE_APP_BASE_API + "/file/uploadToAli", // 上传的图片服务器地址
      headers: {
        'Authorization': 'Bearer ' + getToken() ,
        'Produce-Code': '776ca8e240574192b6e0f69b417163df',
        'App-Code': '3f78fbfc13b14fa4b3d78665124ef4bb',
        'App-Version': '2.0',
        'Terminal-Type': 2
      },
      uploadData:{
      }
    };
  },
  watch: {},
  methods: {
    handleUploadSuccess(res) {
      this.$emit('input', res.data.url);
      this.loading.close();
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
