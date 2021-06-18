<template>
    <div>
        <div v-show="showSearch" class="app-container app-container--search">
            <el-form ref="queryForm" :model="queryParams" :inline="true" label-width="68px">
                <el-form-item label="新闻类型" prop="newsType">
                    <el-select v-model="queryParams.newsType" placeholder="新闻类型" clearable size="small">
                        <el-option
                                v-for="dict in newsTypeOptions"
                                :key="dict.dictValue"
                                :label="dict.dictLabel"
                                :value="dict.dictValue"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item label="标题" prop="newsTitle">
                    <el-input
                            v-model="queryParams.newsTitle"
                            placeholder="请输入标题"
                            clearable
                            size="small"
                    />
                </el-form-item>
                <el-form-item label="内容" prop="newsContent">
                    <el-input
                            v-model="queryParams.newsContent"
                            placeholder="请输入内容"
                            clearable
                            size="small"
                    />
                </el-form-item>
                <el-form-item label="发布状态" prop="newsStatus">
                    <el-select v-model="queryParams.newsStatus" placeholder="状态" clearable size="small">
                        <el-option
                                v-for="dict in statusOptions"
                                :key="dict.dictValue"
                                :label="dict.dictLabel"
                                :value="dict.dictValue"
                        />
                    </el-select>
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
                <right-toolbar :show-search.sync="showSearch" @queryTable="getList" />
            </el-row>

            <el-table v-loading="loading" :data="dataList" highlight-current-row border>
                <el-table-column label="新闻类型" align="center" prop="newsType">
                    <template slot-scope="scope">
                        <span>{{ selectDictLabel(newsTypeOptions, scope.row.newsType) }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="发布状态" align="center" prop="newsStatus">
                    <template slot-scope="scope">
                        <span>{{ selectDictLabel(statusOptions, scope.row.newsStatus) }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="标题" align="left" prop="newsTitle" />
                <el-table-column label="发布时间" align="center" prop="newsPublishTime" width="180">
                    <template slot-scope="scope">
                        <span>{{ parseTime(scope.row.newsPublishTime) }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="创建时间" align="center" prop="createTime" width="180">
                    <template slot-scope="scope">
                        <span>{{ parseTime(scope.row.createTime) }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center" fixed="left" class-name="small-padding fixed-width">
                    <template slot-scope="scope">
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
                    @pagination="getList"
            />

            <!-- 添加或修改岗位对话框 -->
            <el-dialog :title="title" :visible.sync="open" width="900px" append-to-body :close-on-click-modal="false">
                <el-form ref="form" :model="form" :rules="rules" label-width="80px">
                    <el-row :gutter="20">
                        <el-col :span="8">
                            <el-form-item label="新闻类型" prop="newsType">
                                <el-select
                                        v-model="form.newsType"
                                        placeholder="新闻类型"
                                        clearable
                                        filterable
                                        size="small"
                                        style="width: 100%"
                                >
                                    <el-option
                                            v-for="item in newsTypeOptions"
                                            :key="item.dictValue"
                                            :label="item.dictLabel"
                                            :value="item.dictValue"
                                    />
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="发布状态" prop="newsStatus">
                                <el-select
                                        v-model="form.newsStatus"
                                        placeholder="发布状态"
                                        clearable
                                        filterable
                                        size="small"
                                        style="width: 100%"
                                >
                                    <el-option
                                            v-for="dict in statusOptions"
                                            :key="dict.dictValue"
                                            :label="dict.dictLabel"
                                            :value="dict.dictValue"
                                    />
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="发布时间" prop="newsPublishTime">
                                <el-date-picker
                                        v-model="form.newsPublishTime"
                                        type="datetime"
                                        size="small"
                                        value-format="yyyy-MM-dd HH:mm:ss"
                                        style="width: 100%"
                                        placeholder="选择发布时间">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="24">
                            <el-form-item label="新闻标题" prop="newsTitle">
                                <el-input v-model="form.newsTitle" placeholder="请输入新闻标题" />
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="6">
                            <el-form-item label="简介图片" prop="newsPrefaceImg">
                                <upload-image style="margin-top: 5px" v-model="form.newsPrefaceImg"/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="18">
                            <el-form-item label="简介" prop="newsPreface">
                                <el-input
                                        el-input
                                        type="textarea"
                                        :rows="4"
                                        style="resize:none"
                                        placeholder="请输入前言（简介）"
                                        v-model="form.newsPreface">
                                </el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="24">
                            <el-form-item label="内容">
                                <editor v-model="form.newsContent" :min-height="192" />
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" :loading="buttonLoading" @click="submitForm">确 定</el-button>
                    <el-button @click="cancel">取 消</el-button>
                </div>
            </el-dialog>
        </div>
    </div>
</template>

<script>
import { list, getWebsiteNews, delWebsiteNews, updateWebsiteNews, addWebsiteNews } from '@/api/system/websiteNews';
import Editor from '@/components/Editor';
import UploadImage from '@/components/UploadImage/index2';
export default {
  name: 'WebsiteNews',
  components: {
    Editor,
    UploadImage
  },
  data() {
    return {
      // 遮罩层
      loading: true,
      buttonLoading: false,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 岗位表格数据
      dataList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 状态数据字典
      statusOptions: [
        { dictValue: 1, dictLabel: '待发布' },
        { dictValue: 0, dictLabel: '已发布' }
      ],
      newsTypeOptions: [
        { dictLabel: '公司新闻', dictValue: 1 },
        { dictLabel: '行业动态', dictValue: 2 },
        { dictLabel: '公司荣誉', dictValue: 3 }
      ],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        newsTitle: undefined,
        newsStatus: undefined,
        newsType: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        newsType: [
          { required: true, message: '新闻类型不能为空', trigger: 'blur,change' }
        ],
        newsTitle: [
          { required: true, message: '新闻标题不能为空', trigger: 'blur' }
        ],
        newsPublishTime: [
          { required: true, message: '发布时间不能为空', trigger: 'blur' }
        ],
        newsStatus: [
          { required: true, message: '请选择发布状态', trigger: 'blur,change' }
        ]
      },
      dialogImageUrl: '',
      dialogVisible: false,
      disabled: false
    };
  },
  created() {
    this.getList();
  },
  methods: {
    handleRemove(file) {
      console.log(file);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handleDownload(file) {
      console.log(file);
    },
    /** 查询列表 */
    getList() {
      this.loading = true;
      list(this.queryParams).then(response => {
        this.dataList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        newsType: undefined,
        newsTitle: undefined,
        newsPreface: undefined,
        newsContent: undefined,
        newsPrefaceImg: undefined,
        newsPublishTime: undefined,
        newsStatus: undefined
      };
      this.resetForm('form');
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm('queryForm');
      this.handleQuery();
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = '添加新闻';
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      getWebsiteNews(row.code).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = '修改新闻';
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const code = row.code;
      const title = row.newsTitle;
      this.$confirm('是否确认删除标题为"' + title + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return delWebsiteNews(code);
      }).then(() => {
        this.getList();
        this.msgSuccess('删除成功');
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.buttonLoading = true;
          if (this.form.code !== undefined) {
            updateWebsiteNews(this.form).then(response => {
              this.msgSuccess('修改成功');
              this.open = false;
              this.buttonLoading = false;
              this.getList();
            }).catch(() => {
              this.buttonLoading = false;
            });
          } else {
            addWebsiteNews(this.form).then(response => {
              this.msgSuccess('新增成功');
              this.open = false;
              this.buttonLoading = false;
              this.getList();
            }).catch(() => {
              this.buttonLoading = false;
            });
          }
        }
      });
    }
  }
};
</script>
