<template>
  <div class="component-upload-image" :class="!isShowUpload ? null :'isShowUpload'">
    <el-upload
      ref="upload"
      :action="uploadImgUrl"
      accept=".jpg,.png,.jpeg"
      list-type="picture-card"
      :file-list="imageList"
      :headers="headers"
      :limit="limit"
      :on-exceed="handleExceed"
      :on-preview="handlePictureCardPreview"
      :on-remove="handleRemove"
      :on-success="handleUploadSuccess"
      :before-upload="handleBeforeUpload"
      :on-error="handleUploadError"
    >
      <i class="el-icon-plus" />
    </el-upload>

    <el-dialog :visible="dialogVisible" width="600px" append-to-body @close="cancel">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>

<script>
import { uploadImgApi, getFile } from '@/api/system/image';
import { getToken } from '@/utils/auth';
import { authorPre, produceCode, appCode, appVersion, terminalType } from '@/headers';

export default {
  components: {},
  props: {
    value: {
      type: String,
      default: ''
    },
    limit: {
      type: Number,
      default: NaN
    },
    fresh: Boolean
  },
  data() {
    return {
      isShowUpload: false,
      uploadImgUrl: process.env.VUE_APP_BASE_API + uploadImgApi, // 上传的图片服务器地址
      headers: {
        'Authorization': authorPre + getToken(),
        'Produce-Code': produceCode,
        'App-Code': appCode,
        'App-Version': appVersion,
        'Terminal-Type': terminalType
      },
      uploadData: {
      },
      dialogImageUrl: '',
      dialogVisible: false,
      disabled: false,
      imageList: [],
      imageOldList: [],
      images: ''
    };
  },
  watch: {
    fresh(val) {
      if (val) {
        getFile(this.value).then(response => {
          console.log(response);
          this.imageList = response.data.map(function(res) {
            return { url: res.attachUrl, code: res.code };
          });
          this.imageOldList = this.imageList;
          console.log(this.imageList);
          this.isShowUpload = this.imageOldList.length >= this.limit;
          // this.imageList.push({ url: response.data.attachUrl, code: response.data.code });
        });
        this.images = this.value;
      }
    }
  },
  created() {
  },
  methods: {
    // 赋值
    inputInfo() {
      console.log(this.imageOldList);
      const images = this.imageOldList.map(function(response) {
        return [response.code];
      });
      this.images = images.join(',');
      this.$emit('input', this.images);
      // console.log(this.images);
      this.$emit('uploadStatus', false, '上传成功');
    },
    /** 取消按钮 */
    cancel() {
      this.dialogVisible = false;
    },
    handleRemove(images, imageList) {
      console.log(imageList);
      const removeimg = imageList.map(({ code, url }) => ({ code, url }));
      this.imageOldList = removeimg;
      this.inputInfo();

      this.isShowUpload = this.imageOldList.length >= this.limit;
    },
    handlePictureCardPreview(images) {
      console.log(images);
      this.dialogImageUrl = images.url;
      this.dialogVisible = true;
    },
    handleUploadSuccess(res, images, imageList) {
      // console.log(res);
      // console.log(images);
      console.log(imageList);
      // if (this.images === '') {
      //   this.images = res.data.code;
      // } else {
      //   this.images = this.images + ',' + res.data.code;
      // }
      // console.log(this.images);
      this.imageOldList.push({ url: res.data.path, code: res.data.code });
      this.inputInfo();

      this.isShowUpload = this.imageOldList.length >= this.limit;
      // this.loading.close();
    },
    handleBeforeUpload(file) {
      this.isShowUpload = true;
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
      // this.loading = this.$loading({
      //   lock: true,
      //   text: '上传中',
      //   background: 'rgba(0, 0, 0, 0.7)'
      // });
      this.$emit('uploadStatus', true, '上传中...');
    },
    handleUploadError() {
      this.$message({
        type: 'error',
        message: '上传失败'
      });
      // this.loading.close();
      this.$emit('uploadStatus', false, '上传失败');
    },
    handleExceed() {
      this.$message({
        type: 'error',
        message: '超出上传图片数量，请删除后，再选择图片上传！'
      });
      // this.loading.close();
    }
  }
};
</script>

<style scoped>
.avatar {
  width: 100%;
  height: 100%;
}
.isShowUpload ::v-deep .el-upload--picture-card{
  display: none;
}
::v-deep .el-upload-list--picture-card .el-upload-list__item-thumbnail {
    object-fit: contain;
}
</style>
