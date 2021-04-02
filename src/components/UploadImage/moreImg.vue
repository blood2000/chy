<template>
  <div class="component-upload-image">
    <el-upload
      :action="uploadImgUrl"
      accept="image/*"
      list-type="picture-card"
      :file-list="imageList"
      :headers="headers"
      :limit="limit"
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
import { getToken } from '@/utils/auth';
import { getFile } from '@/api/system/image';

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
      uploadImgUrl: process.env.VUE_APP_BASE_API + '/assets/upload/uploadToAli', // 上传的图片服务器地址
      headers: {
        'Authorization': 'Bearer ' + getToken(),
        'Produce-Code': '776ca8e240574192b6e0f69b417163df',
        'App-Code': '3f78fbfc13b14fa4b3d78665124ef4bb',
        'App-Version': '2.0',
        'Terminal-Type': 'web'
      },
      uploadData: {
      },
      dialogImageUrl: '',
      dialogVisible: false,
      disabled: false,
      imageList: [],
      images: '',
      limit: 3
    };
  },
  watch: {},
  created() {
    console.log(this.value);
    getFile(this.value).then(response => {
      console.log(response);
    });
  },
  methods: {
    // 赋值
    inputInfo() {
      this.images = this.imageList.map(function(response) {
        return [response.code];
      });
      this.images = this.images.join(',');
      this.$emit('chooseImg', this.images);
      console.log(this.images);
    },
    /** 取消按钮 */
    cancel() {
      this.dialogVisible = false;
    },
    handleRemove(images, imageList) {
      this.imageList = imageList;
      this.inputInfo();
    },
    handlePictureCardPreview(images) {
      console.log(images);
      this.dialogImageUrl = images.url;
      this.dialogVisible = true;
    },
    handleUploadSuccess(res, images, imageList) {
      console.log(res);
      this.imageList.push({ url: res.data.path, code: res.data.code });
      this.inputInfo();
      // this.loading.close();
    },
    handleBeforeUpload() {
      // this.loading = this.$loading({
      //   lock: true,
      //   text: '上传中',
      //   background: 'rgba(0, 0, 0, 0.7)'
      // });
    },
    handleUploadError() {
      this.$message({
        type: 'error',
        message: '上传失败'
      });
      // this.loading.close();
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
