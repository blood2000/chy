<template>
  <div class="app-container">
    <el-form v-show="showSearch" ref="queryForm" :model="queryParams" :inline="true" label-width="100px">
      <el-form-item label="规则名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入规则名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="cyan" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['enterprise:rules:add']"
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
        >新增</el-button>
      </el-col>
      <right-toolbar :show-search.sync="showSearch" @queryTable="getList" />
    </el-row>

    <el-table v-loading="loading" :data="rulesList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" fixed="left" />
      <el-table-column label="规则名称" align="center" prop="name" />
      <el-table-column
        label="计算公式"
        align="center"
        prop="ruleDictType"
        :formatter="ruleTypeFormat"
      />
      <el-table-column label="扣费项目" align="center" />
      <el-table-column label="补贴项目" align="center" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" fixed="right">
        <template slot-scope="scope">
          <el-button
            v-hasPermi="['enterprise:rules:edit']"
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
          >修改</el-button>
          <el-button
            v-hasPermi="['enterprise:rules:remove']"
            size="mini"
            type="text"
            icon="el-icon-delete"
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

    <!-- 添加或修改 对话框 -->
    <rules-dialog ref="RulesDialog" :title="title" :open.sync="open" @refresh="getList" />
  </div>
</template>

<script>
import { listRules, getRules, delRules } from '@/api/enterprise/rules';
import RulesDialog from './rulesDialog.vue';

export default {
  name: 'Rules',
  components: {
    RulesDialog
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
      // 表格数据
      rulesList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 计算公式字典
      ruleTypeOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        shipperCode: '8b3f41f598c64fd9a7922a5611a7ed8f',
        name: null
      }
    };
  },
  created() {
    this.getAllDicList();
    this.getList();
  },
  methods: {
    // 获取字典
    getAllDicList() {
      // 计算公式
      this.getDicts('ruleFormula').then((response) => {
        this.ruleTypeOptions = response.data;
      });
    },
    /** 查询列表 */
    getList() {
      this.loading = true;
      listRules(this.queryParams).then(response => {
        this.rulesList = response.data.list;
        this.total = response.data.total;
        this.loading = false;
      });
    },
    // 计算公式字典翻译
    ruleTypeFormat(row, column) {
      return this.selectDictLabel(this.ruleTypeOptions, row.ruleDictType);
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
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.code);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.$refs.RulesDialog.reset();
      this.open = true;
      this.title = '添加';
      this.$refs.RulesDialog.getLossList();
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.$refs.RulesDialog.reset();
      const code = row.code || this.ids;
      getRules(code).then(response => {
        this.open = true;
        this.title = '修改';
        this.$refs.RulesDialog.getLossList();
        this.$refs.RulesDialog.setForm(response.data);
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const code = row.code || this.ids;
      this.$confirm('是否确认删除规则名称为"' + row.name + '"的数据项', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return delRules({ code: code });
      }).then(() => {
        this.getList();
        this.msgSuccess('删除成功');
      });
    }
  }
};
</script>
