<template>
  <div>
    <div v-show="showSearch" class="app-container app-container--search">
      <el-form ref="queryForm" :model="queryParams" :inline="true" label-width="68px">
        <el-form-item label="产品名称" prop="cnName">
          <el-input
            v-model="queryParams.cnName"
            placeholder="请输入产品名称"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="状态" prop="delFlag">
          <el-select v-model="queryParams.delFlag" placeholder="状态" clearable filterable size="small">
            <el-option
              v-for="dict in statusOptions"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
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
            v-hasPermi="['system:produce:add']"
            type="primary"
            icon="el-icon-plus"
            size="mini"
            @click="handleAdd"
          >新增</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            v-hasPermi="['system:produce:edit']"
            type="success"
            icon="el-icon-edit"
            size="mini"
            :disabled="single"
            @click="handleUpdate"
          >修改</el-button>
        </el-col>
        <!-- <el-col :span="1.5">
        <el-button
          v-hasPermi="['system:produce:remove']"
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
        >删除</el-button>
      </el-col>-->
        <right-toolbar :show-search.sync="showSearch" @queryTable="getList" />
      </el-row>

      <el-table v-loading="loading" highlight-current-row border :data="produceList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="产品名称" align="center" prop="cnName" />
        <el-table-column label="英文名" align="center" prop="enName" />
        <el-table-column label="状态" align="center" prop="delFlag">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.delFlag"
              active-value="0"
              inactive-value="1"
              @change="handleStatusChange(scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column label="创建时间" align="center" prop="createTime">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button
              v-hasPermi="['system:produce:edit']"
              size="mini"
              type="text"
              @click="handleUpdate(scope.row)"
            >修改</el-button>
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
      <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body :close-on-click-modal="false">
        <el-form ref="form" :model="form" :rules="rules" label-width="80px">
          <el-form-item label="产品名称" prop="cnName">
            <el-input v-model="form.cnName" placeholder="请输入产品名名称" />
          </el-form-item>
          <el-form-item label="英文名称" prop="enName">
            <el-input v-model="form.enName" placeholder="请输入英文名称" />
          </el-form-item>
          <el-form-item label="状态" prop="delFlag">
            <el-radio-group v-model="form.delFlag">
              <el-radio
                v-for="dict in statusOptions"
                :key="dict.value"
                :label="dict.value"
              >{{ dict.label }}</el-radio>
            </el-radio-group>
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
import { list, addProduce, updateProduce, getProduce, changeStatus } from '@/api/system/produce';

export default {
  name: 'Produce',
  data() {
    return {
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
      // 表格数据
      produceList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 状态数据字典
      statusOptions: [
        { value: '1', label: '禁用' },
        { value: '0', label: '在用' }
      ],
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
      // 表单校验
      rules: {
        cnName: [
          { required: true, message: '产品名称不能为空', trigger: 'blur' }
        ],
        enName: [
          { required: true, message: '英文名称不能为空', trigger: 'blur' }
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询岗位列表 */
    getList() {
      this.loading = true;
      list(this.queryParams).then(response => {
        this.produceList = response.rows;
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
        produceId: undefined,
        produceCode: undefined,
        enName: undefined,
        cnName: undefined,
        delFlag: '0',
        remark: undefined
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
      this.ids = selection.map(item => item.produceId);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = '添加产品';
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const produceId = row.produceId || this.ids;
      getProduce(produceId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = '修改产品';
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.buttonLoading = true;
          if (this.form.produceId !== undefined) {
            updateProduce(this.form).then(response => {
              this.msgSuccess('修改成功');
              this.open = false;
              this.buttonLoading = false;
              this.getList();
            }).catch(() => {
              this.buttonLoading = false;
            });
          } else {
            addProduce(this.form).then(response => {
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
    // 状态修改
    handleStatusChange(row) {
      const text = row.delFlag === '0' ? '启用' : '停用';
      this.$confirm('确认要"' + text + '""' + row.cnName + '"产品吗?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return changeStatus(row.produceCode, row.delFlag);
      }).then(() => {
        this.msgSuccess(text + '成功');
      }).catch(function() {
        row.delFlag = row.delFlag === '0' ? '1' : '0';
      });
    }
  }
};
</script>
