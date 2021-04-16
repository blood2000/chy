<template>
  <el-dialog :title="title" :visible="visible" width="800px" append-to-body @close="cancel">
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-upload
          ref="upload"
          class="upload-demo"
          action="upload"
          multiple
          :on-change="change"
          :auto-upload="false"
          :show-file-list="false"
          accept=".xls, .xlsx"
          :on-success="success"
          :headers="importHeader"
          :http-request="uploadFile"
          :file-list="fileList"
        >
          <template #trigger>
            <el-button size="mini" type="info" icon="el-icon-document">选择文件</el-button>
          </template>
        </el-upload>
      </el-col>
      <el-col :span="1.5">
        <el-button icon="el-icon-upload2" size="mini" type="primary" @click="submitUpload">立即上传</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="fileList">
      <!-- <el-table-column type="selection" width="55" align="center" fixed="left" /> -->
      <el-table-column label="文件名" align="center" prop="name" width="200" />
      <el-table-column label="大小" align="center" prop="size">
        <template slot-scope="scope">
          <span>{{ (scope.row.size/1024).toFixed(1) }}kb</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" prop="status" :formatter="statusFormatter" />
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
  </el-dialog>
</template>

<script>
import { importData } from '@/api/assets/driver';
import { getToken } from '@/utils/auth';
import { authorPre, produceCode, appCode, appVersion, terminalType } from '@/headers';

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
      // 状态字典
      statusOptions: [
        { dictLabel: '已选择', dictValue: 'ready' },
        { dictLabel: '上传成功', dictValue: 'success' }
      ],
      // 项目表格数据
      fileList: [],
      // 文件上传数据（多文件合一）
      fileData: '',
      // 请求头数据
      importHeader: {
        'Authorization': authorPre + getToken(),
        'Produce-Code': produceCode,
        'App-Code': appCode,
        'App-Version': appVersion,
        'Terminal-Type': terminalType
      }
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
    // 状态字典翻译
    statusFormatter(row, column) {
      return this.selectDictLabel(this.statusOptions, row.status);
    },
    /** 取消按钮 */
    cancel() {
	    this.close();
      this.reset();
    },
    // 关闭弹窗
    close() {
	    this.$emit('update:open', false);
      this.$emit('refresh');
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
    // 选择文件操作
    uploadFile(file) {
		  this.fileData.append('files', file.file); // append增加数据
    },
    // 立即上传操作
    submitUpload(file) {
      if (this.fileList.length === 0) {
	      this.$message({
	        message: '请先选择文件',
	        type: 'warning'
	      });
	    } else {
	      this.fileData = new FormData(); // new formData对象
	      this.$refs.upload.submit(); // 提交调用uploadFile函数
        // 接口
        importData(this.fileData).then((res) => {
          this.$message(res.msg);
          this.fileList = []; // 清除上传文件
        });
	    }
    },
    reset() {
      this.fileList = []; // 清除上传文件
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
