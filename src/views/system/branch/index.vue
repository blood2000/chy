<template>
  <div>
    <div v-show="showSearch" class="app-container app-container--search">
      <el-form ref="queryForm" :model="queryParams" :inline="true" label-width="68px">
        <el-form-item label="名称" prop="name">
          <el-input
            v-model="queryParams.name"
            placeholder="请输入名称"
            clearable
            size="small"
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
            v-hasPermi="['system:branch:add']"
            type="primary"
            icon="el-icon-plus"
            size="mini"
            @click="handleAdd"
          >新增</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            v-hasPermi="['system:branch:edit']"
            type="success"
            icon="el-icon-edit"
            size="mini"
            :disabled="single"
            @click="handleUpdate"
          >修改</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            v-hasPermi="['system:branch:remove']"
            type="danger"
            icon="el-icon-delete"
            size="mini"
            :disabled="multiple"
            @click="handleDelete"
          >删除</el-button>
        </el-col>
        <right-toolbar :show-search.sync="showSearch" @queryTable="getList" />
      </el-row>

      <el-table v-loading="loading" :data="branchList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="网点名称" align="center" prop="name" />
        <el-table-column label="组织" align="center" prop="orgName" />
        <el-table-column label="统一信用社会代码" align="center" prop="uniformSocialCreditCode" />
        <el-table-column label="法人" align="center" prop="branchArtificialName" />
        <el-table-column label="电话" align="center" prop="branchTel" />
        <el-table-column label="地址" align="center" prop="branchAddress" />
        <el-table-column label="创建时间" align="center" prop="createTime" width="180">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button
              v-hasPermi="['system:branch:edit']"
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="handleUpdate(scope.row)"
            >修改</el-button>
            <el-button
              v-hasPermi="['system:branch:remove']"
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

      <!-- 添加或修改岗位对话框 -->
      <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body :close-on-click-modal="modalClick">
        <el-form ref="form" :model="form" :rules="rules" label-width="130px">
          <el-form-item label="网点名称" prop="name">
            <el-input v-model="form.name" placeholder="请输入网点名称" clearable />
          </el-form-item>
          <el-form-item label="组织" prop="orgCode">
            <treeselect
              v-model="form.orgCode"
              :options="deptOptions"
              :normalizer="normalizer"
              :show-count="true"
              placeholder="请选择归属组织"
              clearable
            />
          </el-form-item>
          <el-form-item label="统一信用社会代码" prop="uniformSocialCreditCode">
            <el-input v-model="form.uniformSocialCreditCode" placeholder="请输入统一信用社会代码" clearable />
          </el-form-item>
          <el-form-item label="法人" prop="branchArtificialName">
            <el-input v-model="form.branchArtificialName" placeholder="请输入法人姓名" clearable />
          </el-form-item>
          <el-form-item label="电话" prop="branchTel">
            <el-input v-model="form.branchTel" placeholder="请输入电话号码" clearable />
          </el-form-item>
          <el-form-item label="地址" prop="branchAddress">
            <el-input v-model="form.branchAddress" placeholder="请输入地址" clearable />
          </el-form-item>
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
import { list, getBranch, addBranch, updateBranch, delBranch } from '@/api/system/branch';
import { treeselect } from '@/api/system/dept';
import Treeselect from '@riophae/vue-treeselect';
import '@riophae/vue-treeselect/dist/vue-treeselect.css';

export default {
  name: 'Post',
  components: { Treeselect },
  data() {
    return {
      modalClick: false,
      // 遮罩层
      loading: true,
      buttonLoading: false,
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
      // 岗位表格数据
      branchList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 状态数据字典
      statusOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        postCode: undefined,
        postName: undefined,
        status: undefined
      },
      // 表单参数
      form: {},
      // 部门树选项
      deptOptions: undefined,
      // 部门树键值转换
      normalizer(node) {
        return {
          id: node.code, // 键名转换，方法默认是label和children进行树状渲染
          label: node.label,
          children: node.children
        };
      },
      // 表单校验
      rules: {
        name: [
          { required: true, message: '名称不能为空', trigger: 'blur' }
        ],
        branchTel: [
          { validator: this.formValidate.telphone, trigger: 'blur' }
        ],
        orgCode: [
          { required: true, message: '组织不能为空', trigger: 'blur' }
        ]
      }
    };
  },
  created() {
    this.getList();
    this.getTreeselect();
  },
  methods: {
    /** 查询岗位列表 */
    getList() {
      this.loading = true;
      list(this.queryParams).then(response => {
        this.branchList = response.rows;
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
        name: undefined,
        branchAddress: undefined,
        branchArtificialName: undefined,
        branchTel: undefined,
        orgCode: undefined,
        uniformSocialCreditCode: undefined
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
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = '添加网点';
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      getBranch(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = '修改网点';
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.buttonLoading = true;
          if (this.form.id !== undefined) {
            updateBranch(this.form).then(response => {
              this.msgSuccess('修改成功');
              this.open = false;
              this.buttonLoading = false;
              this.getList();
            }).catch(() => {
              this.buttonLoading = false;
            });
          } else {
            addBranch(this.form).then(response => {
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
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$confirm('是否确认删除数据码?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return delBranch(ids);
      }).then(() => {
        this.getList();
        this.msgSuccess('删除成功');
      });
    },
    /** 查询部门下拉树结构 */
    getTreeselect() {
      treeselect({ orgCode: this.companyCode }).then(response => {
        this.deptOptions = response.data;
      });
    },
    // 筛选节点
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    }
  }
};
</script>
