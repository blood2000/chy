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
import { uploadImgApi } from '@/api/system/image';
import { getToken } from '@/utils/auth';
import { authorPre, produceCode, appCode, appVersion, terminalType } from '@/headers';

export default {
  components: {},
  props: {
    value: {
      type: Array,
      default: function() {
        return [];
      }
    },
    limit: {
      type: Number,
      default: NaN
    },
    fresh: {
      type: Boolean,
      default: false
    }
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
      images: []
    };
  },
  watch: {
    fresh: {
      handler(val) {
        if (val) {
          this.imageList = this.value.map(function(res) {
            return { url: res, code: res };
          });
          // console.log(this.imageList);
          this.imageOldList = this.imageList;
          this.isShowUpload = this.imageOldList.length >= this.limit;
          this.images = this.value;
        }
      },
      immediate: true
    }
  },
  created() {
  },
  methods: {
    // 赋值
    inputInfo() {
      // console.log(this.imageOldList);
      this.images = this.imageOldList.map(function(response) {
        return response.url;
      });
      this.$emit('input', this.images);
      // console.log(this.images);
      this.$emit('uploadStatus', false, '上传成功');
    },
    /** 取消按钮 */
    cancel() {
      this.dialogVisible = false;
    },
    handleRemove(images, imageList) {
      // console.log(imageList);
      const removeimg = imageList.map(({ code, url }) => ({ code, url }));
      this.imageOldList = removeimg;
      this.inputInfo();

      this.isShowUpload = this.imageOldList.length >= this.limit;
    },
    handlePictureCardPreview(images) {
      // console.log(images);
      this.dialogImageUrl = images.url;
      this.dialogVisible = true;
    },
    handleUploadSuccess(res, images, imageList) {
      this.imageOldList.push({ url: res.data.path, code: res.data.code });
      this.inputInfo();

      this.isShowUpload = this.imageOldList.length >= this.limit;
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
