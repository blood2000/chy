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
      accept=".jpg,.png,.jpeg"
      style="display: inline-block; vertical-align: top"
    >
      <img v-if="value && !disabled" :src="attachUrl" class="avatar">
      <div v-else-if="value && disabled" v-viewer class="avatar-box">
        <img :src="attachUrl" class="avatar">
      </div>
      <i v-else class="el-icon-plus avatar-uploader-icon" />
    </el-upload>
  </div>
</template>

<script>
import { uploadImgApi, getFile, uploadOcr } from '@/api/system/image.js';
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
    },
    imageType: {
      type: String,
      default: null
    },
    side: {
      type: String,
      default: null
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
      attachUrl: '',
      flag: false
    };
  },
  watch: {
    value(val) {
      if (val) {
        if (this.flag) return;
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
    handleBeforeUpload(file) {
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg';
      const isLt1M = file.size / 1024 / 1024 < 1;
      if (!isJPG) {
        this.msgWarning('请上传png/jpg/jpeg格式的图片');
        return false;
      }
      if (!isLt1M) {
        this.msgWarning('上传文件大小不能超过1MB');
        return false;
      }
      this.loading = this.$loading({
        lock: true,
        text: '上传中',
        background: 'rgba(0, 0, 0, 0.7)'
      });
    },
    handleUploadSuccess(res) {
      if (this.loading) this.loading.close();
      if (res.code === 200) {
        this.$emit('input', res.data.code);
        this.handleGetFile(res.data.code, true);
      }
    },
    // 根据code获取url
    handleGetFile(code, flag) {
      this.flag = true;
      getFile(code).then(response => {
        this.flag = false;
        if (response.data && response.data.length > 0) {
          this.attachUrl = response.data[0].attachUrl;
          if (!flag) return;
          this.handleOrc(this.attachUrl);
        } else {
          this.attachUrl = '';
        }
      });
    },
    // 图片识别
    handleOrc(url) {
      const formData = new FormData();
      if (this.imageType) {
        formData.append('type', this.imageType);
      } else {
        return;
      }
      if (url) {
        formData.append('url', url);
      } else {
        return;
      }
      if (this.side) {
        formData.append('side', this.side);
      }
      uploadOcr(formData).then(response => {
        if (response.data && !response.data.msg) {
          this.$emit('fillForm', this.imageType, response.data);
        }
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
::v-deep .el-upload--picture-card, .avatar-box{
  display: flex;
  justify-content: center;
  align-items: center;
  .avatar {
    max-width: 100%;
    max-height: 100%;
  }
}
</style>
