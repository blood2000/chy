<template>
  <div>
    <div v-show="showSearch" class="app-container app-container--search">
      <el-form ref="queryForm" :model="queryParams" :inline="true" label-width="68px">
        <el-form-item label="字段名" prop="fieldName">
          <el-input
            v-model="queryParams.fieldName"
            placeholder="请输入字段名"
            clearable
            size="small"
            style="width: 240px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="字段描述" prop="comment">
          <el-input
            v-model="queryParams.comment"
            placeholder="请输入字段描述"
            clearable
            size="small"
            style="width: 240px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <!-- <el-form-item label="接口地址" prop="route">
          <el-input
            v-model="queryParams.route"
            placeholder="请输入接口地址"
            clearable
            size="small"
            style="width: 240px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item> -->
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
        <el-col :span="1.5">
          <el-button
            type="success"
            icon="el-icon-edit"
            size="mini"
            :disabled="single"
            @click="handleUpdate"
          >修改</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            :disabled="multiple"
            @click="handleDelete"
          >删除</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="warning"
            icon="el-icon-success"
            size="mini"
            @click="handleSync"
          >同步</el-button>
        </el-col>
        <right-toolbar :show-search.sync="showSearch" @queryTable="getList" />
      </el-row>

      <el-table v-loading="loading" highlight-current-row border :data="configList" :close-on-click-modal="false" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="字段名" align="center" prop="fieldName" />
        <el-table-column label="字段描述" align="center" prop="comment" />
        <el-table-column label="排序" align="center" sortable prop="sortNum" />
        <el-table-column label="列宽" align="center" prop="width">
          <template slot-scope="scope">
            <span v-if="scope.row.width">{{ scope.row.width }}</span>
            <span v-else>自适应</span>
          </template>
        </el-table-column>
        <el-table-column label="是否显示" align="center" prop="isShow">
          <template slot-scope="scope">
            <span v-if="scope.row.isShow" class="g-color-success">是</span>
            <span v-else class="g-color-error">否</span>
          </template>
        </el-table-column>
        <el-table-column label="列表名称" align="center" prop="masterName" />
        <!-- <el-table-column label="接口地址" align="center" prop="route" /> -->
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

      <!-- 添加或修改参数配置对话框 -->
      <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body :close-on-click-modal="false">
        <el-form ref="form" :model="form" :rules="rules" label-width="80px">
          <el-form-item label="字段名" prop="fieldName">
            <el-input v-model="form.fieldName" placeholder="请输入字段名" clearable />
          </el-form-item>
          <!-- <el-form-item label="接口地址" prop="route">
            <el-input v-model="form.route" placeholder="请输入接口地址" clearable />
          </el-form-item> -->
          <el-form-item label="字段描述" prop="comment">
            <el-input v-model="form.comment" placeholder="请输入字段描述" clearable />
          </el-form-item>
          <el-form-item label="列宽" prop="width">
            <el-input v-model="form.width" placeholder="请输入列宽" clearable />
          </el-form-item>
          <el-form-item label="排序" prop="sortNum">
            <el-input-number v-model="form.sortNum" controls-position="right" :min="0" :max="99" />
          </el-form-item>
          <el-form-item label="是否显示" prop="isShow">
            <el-switch v-model="form.isShow" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </el-dialog>

      <!-- 同步对话框 -->
      <el-dialog :title="title" :visible.sync="openSync" width="600px" append-to-body :close-on-click-modal="false">
        <el-form ref="formSync" :model="formSync" :rules="rulesSync" label-width="130px">
          <el-form-item label="JAVA类绝对路径" prop="className">
            <el-input v-model="formSync.className" placeholder="请输入JAVA类绝对路径" clearable />
          </el-form-item>
          <!-- <el-form-item label="接口地址" prop="route">
            <el-input v-model="formSync.route" placeholder="请输入接口地址" clearable />
          </el-form-item> -->
          <el-form-item label="是否覆盖已有" prop="isCover">
            <el-switch v-model="formSync.isCover" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" :loading="loadingSync" @click="submitFormSync">同 步</el-button>
          <el-button @click="cancelSync">取 消</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { listConfig, getConfig, delConfig, delAllConfig, addConfig, updateConfig, syncConfig } from '@/api/system/table';

export default {
  name: 'TableData',
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
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 参数表格数据
      configList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      openSync: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        fieldName: null,
        route: null,
        comment: null
      },
      masterCode: null,
      masterRoute: null,
      // 表单参数
      form: {},
      formSync: {},
      // 表单校验
      rules: {
        fieldName: [
          { required: true, message: '字段名不能为空', trigger: 'blur' }
        ]
        // route: [
        //   { required: true, message: '接口地址不能为空', trigger: 'blur' }
        // ]
      },
      rulesSync: {
        className: [
          { required: true, message: 'JAVA类绝对路径不能为空', trigger: 'blur' }
        ]
        // route: [
        //   { required: true, message: '接口地址不能为空', trigger: 'blur' }
        // ]
      },
      // 同步时间较长, 按钮loading
      loadingSync: false
    };
  },
  created() {
    this.masterRoute = this.$route.query.route;
    this.masterCode = this.$route.params && this.$route.params.code;
    this.getList();
  },
  methods: {
    /** 查询参数列表 */
    getList() {
      this.loading = true;
      listConfig(Object.assign({}, this.queryParams, { masterCode: this.masterCode })).then(response => {
        this.configList = response.rows;
        this.total = response.total;
        this.loading = false;
      }
      );
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        code: null,
        fieldName: null,
        route: null,
        comment: null,
        width: null,
        isShow: true,
        sortNum: null
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
      this.title = '添加字段';
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.code);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const code = row.code || this.ids;
      getConfig(code).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = '修改字段';
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.code) {
            updateConfig(this.form).then(response => {
              this.msgSuccess('修改成功');
              this.open = false;
              this.getList();
              this.clearLocalStorage();
            });
          } else {
            addConfig(Object.assign({}, this.form, { masterCode: this.masterCode })).then(response => {
              this.msgSuccess('新增成功');
              this.open = false;
              this.getList();
              this.clearLocalStorage();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const _this = this;
      this.$confirm('是否确认删除选中的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        if (row.code) {
          return delConfig(row.code);
        } else {
          return delAllConfig(_this.ids);
        }
      }).then(() => {
        this.getList();
        this.msgSuccess('删除成功');
        this.clearLocalStorage();
      });
    },
    /** 同步按钮 */
    handleSync() {
      this.resetSync();
      this.openSync = true;
      this.title = '同步';
    },
    /** 同步提交按钮 */
    submitFormSync() {
      this.$refs['formSync'].validate(valid => {
        if (valid) {
          this.loadingSync = true;
          syncConfig(Object.assign({}, this.formSync, { masterCode: this.masterCode })).then(response => {
            this.loadingSync = false;
            this.msgSuccess('同步成功');
            this.openSync = false;
            this.getList();
            this.clearLocalStorage();
          }).catch(() => {
            this.loadingSync = false;
          });
        }
      });
    },
    /** 取消同步按钮 */
    cancelSync() {
      this.openSync = false;
      this.resetSync();
    },
    /** 同步重置按钮 */
    resetSync() {
      this.formSync = {
        className: null,
        route: null,
        isCover: true
      };
      this.resetForm('formSync');
    },
    /** 操作完清除缓存 */
    clearLocalStorage() {
      if (window.localStorage.getItem(this.masterRoute)) {
        window.localStorage.removeItem(this.masterRoute);
      }
    }
  }
};
</script>
