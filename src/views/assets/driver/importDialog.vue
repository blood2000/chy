<template>
  <el-dialog :title="title" :visible="visible" width="800px" append-to-body @close="cancel">
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-upload
          ref="upload"
          class="upload-demo"
          action="/dev-api/assets/driver/importData"
          :multiple="true"
          :on-change="change"
          :auto-upload="false"
          :show-file-list="false"
          accept=".xls, .xlsx"
          :on-success="success"
        >
          <template #trigger>
            <el-button size="mini" type="info" icon="el-icon-document">选择文件</el-button>
          </template>
        </el-upload>
      </el-col>
      <el-col :span="1.5">
        <el-button icon="el-icon-upload2" size="mini" type="primary" @click="submitUpload">立即上传</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-download"
          size="mini"
          @click="handleImportTemplateDriver"
        >下载模板</el-button>
      </el-col>
      <!-- <right-toolbar :show-search.sync="showSearch" @queryTable="getList" /> -->
    </el-row>

    <el-table v-loading="loading" :data="fileList">
      <!-- <el-table-column type="selection" width="55" align="center" fixed="left" /> -->
      <el-table-column label="文件名" align="center" prop="name" width="200" />
      <el-table-column label="大小" align="center" prop="size">
        <template slot-scope="scope">
          <span>{{ (scope.row.size/1024).toFixed(1) }}kb</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" prop="status" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.$index)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitForm">立即上传</el-button>
      <el-button @click="cancel">取 消</el-button>
    </div> -->
  </el-dialog>
</template>

<script>
// import { listInfo, delInfo } from '@/api/enterprise/project';

export default {
  components: {
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    open: Boolean
    // disable: Boolean
  },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 总条数
      total: 0,
      // 项目表格数据
      fileList: []
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
  created() {
    this.change();
  },
  methods: {
    /** 提交按钮 */
    submitForm() {
      console.log('上传');
    },
    /** 取消按钮 */
    cancel() {
	    this.close();
    },
    // 关闭弹窗
    close() {
	    this.$emit('update:open', false);
    },
    // 文件状态改变事件
    change(file, fileList) {
      this.loading = true;
      this.fileList = fileList;
      this.loading = false;
    },
    // 文件成功上传事件
    success(response, file, fileList) {
      console.log(response);
    },
    /** 删除按钮操作 */
    handleDelete(index) {
      this.fileList.splice(index, 1);
    },
    // 立即上传操作
    submitUpload() {
      this.$refs.upload.submit();
    },
    /** 下载模板 */
    handleImportTemplateDriver() {
      this.download('assets/driver/importTemplate', {}, `driver_${new Date().getTime()}.xlsx`);
    }
  }
};
</script>

<style scoped>
.mr3{
  margin-right: 3%;
}
.mb{
  margin-bottom: 22px;
}
.width90{
  width: 90%;
}
.width28{
  width: 28%;
}
/* 计数器样式 */
.el-input-number ::v-deep.el-input__inner{
  text-align: left;
}
/* 上传图片文字样式 */
.upload-image-label{
  margin: 0;
  line-height: 24px;
}
</style>
