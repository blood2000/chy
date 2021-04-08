<template>
  <div class="component-upload-image">
    <el-upload
      ref="upload"
      :action="uploadImgUrl"
      accept="image/*"
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
import { getFile } from '@/api/system/image';
import { authorization, produceCode, appCode, appVersion, terminalType } from '@/headers';

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
      uploadImgUrl: process.env.VUE_APP_BASE_API + '/assets/upload/uploadToAli', // 上传的图片服务器地址
      headers: {
        'Authorization': authorization,
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
      console.log(val);
      if (val) {
        getFile(this.value).then(response => {
          console.log(response);
          this.imageList = response.data.map(function(res) {
            return { url: res.attachUrl, code: res.code };
          });
          this.imageOldList = this.imageList;
          console.log(this.imageList);
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
      this.images = this.imageOldList.map(function(response) {
        return [response.code];
      });
      this.images = this.images.join(',');
      this.$emit('input', this.images);
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
      // console.log(res);
      // if (this.images === '') {
      //   this.images = res.data.code;
      // } else {
      //   this.images = this.images + ',' + res.data.code;
      // }
      // console.log(this.images);
      this.imageOldList.push({ url: res.data.path, code: res.data.code });
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

<style scoped lang="scss">
.avatar {
  width: 100%;
  height: 100%;
}
</style>
