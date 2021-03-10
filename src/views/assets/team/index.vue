<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="编码" prop="code">
        <el-input
          v-model="queryParams.code"
          placeholder="请输入编码"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="网点编码" prop="branchCode">
        <el-input
          v-model="queryParams.branchCode"
          placeholder="请输入网点编码"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="车队名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入车队名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="管理者" prop="teamLeader">
        <el-input
          v-model="queryParams.teamLeader"
          placeholder="请输入车队管理者"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="是否删除" prop="isDel">
        <el-input
          v-model="queryParams.isDel"
          placeholder="请输入是否删除"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择状态" clearable size="small">
          <el-option
            v-for="dict in statusOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="创建人" prop="createCode">
        <el-input
          v-model="queryParams.createCode"
          placeholder="请输入创建人"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="修改人" prop="updateCode">
        <el-input
          v-model="queryParams.updateCode"
          placeholder="请输入修改人"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item> -->
      <el-form-item>
        <el-button type="cyan" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['assets:team:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['assets:team:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['assets:team:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['assets:team:export']"
        >导出</el-button>
      </el-col>
	  <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="infoList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="编码" align="center" prop="code" />
      <el-table-column label="网点编码" align="center" prop="branchCode" />
      <el-table-column label="车队名称" align="center" prop="name" />
      <el-table-column label="车队管理者" align="center" prop="teamLeader" />
      <el-table-column label="是否删除" align="center" prop="isDel" />
      <el-table-column label="状态" align="center" prop="status" :formatter="statusFormat" />
      <el-table-column label="创建人" align="center" prop="createCode" />
      <el-table-column label="修改人" align="center" prop="updateCode" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['assets:team:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['assets:team:remove']"
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

    <!-- 添加或修改调度者对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <!-- <el-form-item label="主键" prop="id">
          <el-input v-model="form.id" placeholder="请输入主键" />
        </el-form-item> -->
        <el-form-item label="编码" prop="code">
          <el-input v-model="form.code" placeholder="请输入编码" />
        </el-form-item>
        <el-form-item label="网点编码" prop="branchCode">
          <el-input v-model="form.branchCode" placeholder="请输入网点编码" />
        </el-form-item>
        <el-form-item label="车队名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入车队名称" />
        </el-form-item>
        <el-form-item label="管理者" prop="teamLeader">
          <el-input v-model="form.teamLeader" placeholder="请输入车队管理者" />
        </el-form-item>
        <el-form-item label="是否删除" prop="isDel">
          <el-input v-model="form.isDel" placeholder="请输入是否删除" />
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio
              v-for="dict in statusOptions"
              :key="dict.dictValue"
              :label="parseInt(dict.dictValue)"
            >{{dict.dictLabel}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <!-- <el-form-item label="创建人" prop="createCode">
          <el-input v-model="form.createCode" placeholder="请输入创建人" />
        </el-form-item>
        <el-form-item label="修改人" prop="updateCode">
          <el-input v-model="form.updateCode" placeholder="请输入修改人" />
        </el-form-item> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listInfo, getInfo, delInfo, addInfo, updateInfo } from "@/api/assets/team";

export default {
  name: "Team",
  components: {
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
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 【请填写功能名称】表格数据
      infoList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 车队名称字典
      // nameOptions: [],
      // 车队管理者字典
      // teamLeaderOptions: [],
      // 状态字典
      statusOptions: [
		{dictLabel: '启用', dictValue: '0'},
        {dictLabel: '禁用', dictValue:'1'},
	  ],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        code: null,
        branchCode: null,
        name: null,
        teamLeader: null,
        isDel: null,
        status: null,
        createCode: null,
        updateCode: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      }
    };
  },
  created() {
    this.getList();
    // this.getDicts("${column.dictType}").then(response => {
    //   this.nameOptions = response.data;
    // });
    // this.getDicts("${column.dictType}").then(response => {
    //   this.teamLeaderOptions = response.data;
    // });
	// this.getDicts("${column.dictType}").then(response => {
	//   this.statusOptions = response.data;
	// });
  },
  methods: {
    /** 查询调度者列表 */
    getList() {
      this.loading = true;
      listInfo(this.queryParams).then(response => {
        this.infoList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 车队名称字典翻译
    // nameFormat(row, column) {
    //   return this.selectDictLabel(this.nameOptions, row.name);
    // },
    // 车队管理者字典翻译
    // teamLeaderFormat(row, column) {
    //   return this.selectDictLabel(this.teamLeaderOptions, row.teamLeader);
    // },
	// 状态字典翻译
	// statusFormat(row, column) {
	//   return this.selectDictLabel(this.statusOptions, row.teamLeader);
	// },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        code: null,
        branchCode: null,
        name: null,
        teamLeader: null,
        isDel: null,
        status: 0,
        createCode: null,
        createTime: null,
        updateCode: null,
        updateTime: null
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加调度者";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getInfo(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改调度者";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateInfo(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addInfo(this.form).then(response => {
              this.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$confirm('是否确认删除调度者编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delInfo(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('assets/team/export', {
        ...this.queryParams
      }, `assets_team.xlsx`)
    }
  }
};
</script>