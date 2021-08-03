<template>
  <div>
    <el-row>
      <!--部门数据-->
      <el-col :lg="5" :md="6" :sm="7" :xs="24">
        <div class="app-container app-container--tree">
          <div class="el-tree-scroll-container page-param-tree">
            <el-tree
              ref="tree"
              :data="treeData"
              :props="defaultTreeProps"
              :expand-on-click-node="false"
              default-expand-all
              :render-content="renderContent"
              :indent="0"
              @node-click="handleNodeClick"
            />
          </div>
        </div>
      </el-col>
      <!--用户数据-->
      <el-col :lg="19" :md="18" :sm="17" :xs="24">
        <div class="app-container app-container--search">
          <el-form ref="queryForm" :model="queryParams" :inline="true" label-width="68px">
            <el-form-item label="标题" prop="mediaTitle">
              <el-input
                v-model="queryParams.mediaTitle"
                placeholder="请输入标题"
                clearable
                size="small"
                style="width: 240px"
                @keyup.enter.native="handleQuery"
              />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
              <el-button type="primary" plain icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="app-container">
          <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
              <el-button
                type="primary"
                icon="el-icon-plus"
                size="mini"
                @click="handleAdd"
              >新增</el-button>
            </el-col>
          </el-row>

          <el-table v-loading="loading" highlight-current-row border :data="dataList">
            <el-table-column label="标题" align="center" prop="mediaTitle" :show-overflow-tooltip="true" />
            <el-table-column label="类型" align="center" prop="mediaType" :show-overflow-tooltip="true" />
            <el-table-column label="创建时间" align="center" prop="createTime" width="160">
              <template slot-scope="scope">
                <span>{{ parseTime(scope.row.createTime) }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
              align="center"
              fixed="left"
              width="160"
              class-name="small-padding fixed-width"
            >
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="text"
                  @click="handleLook(scope.row)"
                >查看</el-button>
                <el-button
                  size="mini"
                  type="text"
                  @click="handleUpdate(scope.row)"
                >修改</el-button>
                <el-button
                  size="mini"
                  type="text"
                  @click="handleDelete(scope.row)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>

          <pagination
            v-show="total>0"
            :total="total"
            :page.sync="queryParams.pageNum"
            :limit.sync="queryParams.pageSize"
            @pagination="getMediaInfoList"
          />
        </div>
      </el-col>
    </el-row>
    <!-- 新增/编辑树 对话框 -->
    <setting-dialog ref="settingDialogRef" :open.sync="settingOpen" :title="title" @refresh="getTree" />
    <info-dialog ref="infoDialogRef" :open.sync="paramOpen" :title="title" @refresh="getMediaInfoList" />
    <PdfLook :src="pdfSrc" :open.sync="visibleOpen" :title="pdfTitle" />
    <VideoLook :src="videoSrc" :open.sync="videoVisibleOpen" />
    <WordLook :src="wordSrc" :open.sync="wordVisibleOpen" />
    <ImgLook :src="imageSrc" :open.sync="imageVisibleOpen" />
  </div>
</template>

<script>
import { getMediaTypeTree, delMediaTypeTree, getMediaInfoList, delMediaInfo } from '@/api/system/media';
import SettingDialog from './settingDialog';
import InfoDialog from './infoDialog.vue';
import PdfLook from './pdfLook';
import VideoLook from './videoLook';
import WordLook from './wordLook';
import ImgLook from './imgLook';
export default {
  name: 'Param',
  components: {
    SettingDialog,
    InfoDialog,
    PdfLook,
    VideoLook,
    WordLook,
    ImgLook
  },
  data() {
    return {
      loading: false,
      settingOpen: false,
      paramOpen: false,
      visibleOpen: false,
      videoVisibleOpen: false,
      wordVisibleOpen: false,
      imageVisibleOpen: false,
      title: '',
      // 树
      treeData: [],
      defaultTreeProps: {
        children: 'children',
        label: 'label'
      },
      // 表单
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        mediaTitle: undefined,
        dictCode: undefined
      },
      total: 0,
      dataList: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      codes: [],
      rowData: {},
      pdfTitle: '',
      pdfSrc: '',
      videoSrc: '',
      wordSrc: '',
      imageSrc: []
    };
  },
  created() {
    this.getTree();
    this.getMediaInfoList();
  },
  methods: {
    renderContent(h, { node, data, store }) {
      const className = 'tree-node-icon ' + data.icon;
      return (
        <span class='custom-tree-node el-tree-node__label'>
          <span class='custom-tree-text'><i class={className} style='margin-right: 4px' />{node.label}</span>
          <span class='custom-tree-button'>
            <el-button type='text' on-click={ (event) => this.appendTree(event, data) }><i class='el-icon-circle-plus-outline' /></el-button>
            <el-button type='text' on-click={ (event) => this.editTree(event, node, data) }><i class='el-icon-edit-outline' /></el-button>
            <el-button type='text' on-click={ (event) => this.removeTree(event, node, data) }><i class='el-icon-delete' /></el-button>
          </span>
        </span>);
    },
    getTree() {
      getMediaTypeTree().then(response => {
        this.treeData = response.data || [];
        /* if (this.treeData && this.treeData.length > 0 && this.treeData[0].children && this.treeData[0].children.length > 0) {
          this.handleNodeClick(this.treeData[0].children[0]);
        }*/
      });
    },
    appendTree(event, data) {
      this.$refs.settingDialogRef.reset();
      this.title = '新增';
      this.$refs.settingDialogRef.setAddForm(data);
      this.settingOpen = true;
      event.stopPropagation();
    },
    editTree(event, node, data) {
      this.$refs.settingDialogRef.reset();
      this.title = '编辑';
      this.$refs.settingDialogRef.setEditForm(data);
      this.settingOpen = true;
      event.stopPropagation();
    },
    removeTree(event, node, data) {
      this.$confirm('是否确认删除多媒体类型为"' + data.label + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return delMediaTypeTree(data.code);
      }).then(() => {
        this.getTree();
        this.msgSuccess('删除成功');
      });
      event.stopPropagation();
    },
    handleNodeClick(data) {
      // 父节点不可选中
      if (data.code === '0') {
        this.queryParams.dictCode = null;
      } else {
        this.rowData = data;
        this.queryParams.dictCode = data.code;
      }
      this.getMediaInfoList();
    },
    getMediaInfoList() {
      this.loading = true;
      if (this.queryParams.dictCode === '0') {
        this.queryParams.dictCode = null;
      }
      getMediaInfoList(this.queryParams).then(response => {
        this.dataList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    resetForm() {
      this.queryParams.mediaTitle = null;
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.page = 1;
      this.getMediaInfoList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.queryParams.dictCode = null;
      this.resetForm('queryForm');
      this.handleQuery();
    },
    handleAdd() {
      if (!this.rowData.code) {
        this.msgWarning('请选择多媒体类型树');
        return;
      }
      var data = { dictCode: this.rowData.code, dictName: this.rowData.label };
      this.$refs.infoDialogRef.reset();
      this.title = '新增';
      this.$refs.infoDialogRef.setAddForm(data);
      this.paramOpen = true;
    },
    handleUpdate(row) {
      this.$refs.infoDialogRef.reset();
      this.title = '编辑';
      this.$refs.infoDialogRef.setEditForm(row.mediaCode);
      this.paramOpen = true;
    },
    handleDelete(row) {
      this.$confirm('是否确认删除名称为"' + row.mediaTitle + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return delMediaInfo(row.mediaCode);
      }).then(() => {
        this.getMediaInfoList();
        this.msgSuccess('删除成功');
      });
    },
    handleLook(row) {
      if (row.mediaType === 'pdf') { // pdf查看
        if (!row.mediaUrl.toLocaleString().endsWith('.pdf')) {
          this.msgWarning('非pdf格式，无法预览');
          return;
        }
        this.pdfTitle = '预览';
        this.visibleOpen = true;
        if (row.mediaUrl.startsWith('https://css-backup')) {
          const str = (row.mediaUrl.split('.com'))[1];
          this.pdfSrc = `/pdf${str}`;
        } else {
          this.pdfSrc = row.mediaUrl;
        }
      } else if (row.mediaType === 'video') { // 视频：ogg，webm，mp4
        if (!(row.mediaUrl.toLocaleString().endsWith('.mp4') || row.mediaUrl.toLocaleString().endsWith('.ogg') || row.mediaUrl.toLocaleString().endsWith('.webm'))) {
          this.msgWarning('视频支持mp4,webm,ogg格式');
          return;
        }
        this.videoVisibleOpen = true;
        this.videoSrc = row.mediaUrl;
      } else if (row.mediaType === 'word') { // word: docx、doc
        if (!(row.mediaUrl.toLocaleString().endsWith('.doc') || row.mediaUrl.toLocaleString().endsWith('.docx'))) {
          this.msgWarning('word暂只支持doc，docx格式');
          return;
        }
        this.wordVisibleOpen = true;
        this.wordSrc = row.mediaUrl;
      } else if (row.mediaType === 'excel') { // excel: xls
        if (!row.mediaUrl.toLocaleString().endsWith('.xls')) {
          this.msgWarning('excel暂只支持xls格式');
          return;
        }
        this.wordVisibleOpen = true;
        this.wordSrc = row.mediaUrl;
      } else if (row.mediaType === 'image') {
        if (!(row.mediaUrl.toLocaleString().endsWith('.jpg') || row.mediaUrl.toLocaleString().endsWith('.png') || row.mediaUrl.toLocaleString().endsWith('.jpeg'))) {
          this.msgWarning('图片暂只支持jpg，png，jpeg格式');
          return;
        }
        this.imageVisibleOpen = true;
        this.imageSrc[0] = row.mediaUrl;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
// 表单样式
.input-width{
  width: 40%;
  min-width: 300px;
}
// 暂无数据样式
.none-card{
  height: 40px;
  line-height: 40px;
  text-align: center;
}
// 布局
.row-box{
  .col-box-left{
    width: 357px;
  }
  .col-box-right{
    width: calc(100% - 357px);
  }
}
</style>

<style lang="scss">
// 树样式
.page-param-tree{
  .el-tree-node__content .custom-tree-node{
    width: 100%;
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-right: 8px;
    .custom-tree-button{
      display: none;
      padding-left: 10px;
      >button{
        padding: 5px;
        +.el-button{
          margin-left: 0;
        }
      }
    }
    &:hover{
      .custom-tree-button{
        display: block;
      }
    }
  }
}
</style>
