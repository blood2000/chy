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
      class="upload-image"
    >
      <img v-if="value && !disabled" :src="attachUrl" class="avatar">
      <div v-else-if="value && disabled" v-viewer class="avatar-box">
        <!-- <img v-real-img="attachUrl" src="@/assets/images/uploadImage/load_error.png" class="avatar"> -->
        <img :src="attachUrl" class="avatar">
      </div>
      <template v-else>
        <img :src="require('@/assets/images/uploadImage/' + iconType + '.png')">
        <img :class="disabled ? 'filter' : ''" src="@/assets/images/uploadImage/upload_icon.png" class="avatar-uploader-icon">
      </template>
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
    // 图片类型
    imageType: {
      type: String,
      default: null
    },
    // 图片正反面
    side: {
      type: String,
      default: null
    },
    // 图标类型
    iconType: {
      type: String,
      default: 'default'
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
      if (code) {
        if (code.startsWith('https://')) {
          this.attachUrl = code;
        } else {
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
        }
      }
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
        if (response.data) {
          if (this.side) {
            this.$emit('fillForm', this.imageType, response.data, this.side);
          } else {
            this.$emit('fillForm', this.imageType, response.data);
          }
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
.avatar-box{
  width: 100%;
  height: 100%;
}
::v-deep .el-upload--picture-card, .avatar-box{
  display: flex;
  justify-content: center;
  align-items: center;
  background: #F9F9F9;
  width: 128px;
  height: 88px;
  overflow: hidden;
  .avatar {
    max-width: 100%;
    max-height: 100%;
  }
}
.upload-image{
  position: relative;
  .avatar-uploader-icon{
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    &.filter{
      filter: grayscale(100%);
      opacity: 0.6;
    }
  }
}
</style>
