<template>
  <div class="app-container">
    <el-form v-show="showSearch" ref="queryForm" :model="queryParams" :inline="true" label-width="100px">
      <el-form-item label="编码" prop="code">
        <el-input
          v-model="queryParams.code"
          placeholder="请输入编码"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="货主编码" prop="shipmentCode">
        <el-input
          v-model="queryParams.shipmentCode"
          placeholder="请输入货主编码"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="货源码名称" prop="cargoCodeName">
        <el-input
          v-model="queryParams.cargoCodeName"
          placeholder="请输入货源码名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="货源码" prop="cargoCodeQr">
        <el-input
          v-model="queryParams.cargoCodeQr"
          placeholder="请输入货源码"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="创建人" prop="createCode">
        <el-input
          v-model="queryParams.createCode"
          placeholder="请输入创建人"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="更新人" prop="updateCode">
        <el-input
          v-model="queryParams.updateCode"
          placeholder="请输入更新人"
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
          v-hasPermi="['system:info:add']"
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['system:info:edit']"
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['system:info:remove']"
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['system:info:export']"
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
        >导出</el-button>
      </el-col>
      <right-toolbar :show-search.sync="showSearch" @queryTable="getList" />
    </el-row>

    <el-table v-loading="loading" :data="infoList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="编码" align="center" prop="code" :formatter="codeFormat" />
      <el-table-column label="货主编码" align="center" prop="shipmentCode" :formatter="shipmentCodeFormat" />
      <el-table-column label="货源码名称" align="center" prop="cargoCodeName" :formatter="cargoCodeNameFormat" />
      <el-table-column label="货源码" align="center" prop="cargoCodeQr" :formatter="cargoCodeQrFormat" />
      <el-table-column label="创建人" align="center" prop="createCode" :formatter="createCodeFormat" />
      <el-table-column label="更新人" align="center" prop="updateCode" :formatter="updateCodeFormat" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            v-hasPermi="['system:info:edit']"
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
          >修改</el-button>
          <el-button
            v-hasPermi="['system:info:remove']"
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

    <!-- 添加或修改【请填写功能名称】对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="主键" prop="id">
          <el-input v-model="form.id" placeholder="请输入主键" />
        </el-form-item>
        <el-form-item label="编码" prop="code">
          <el-input v-model="form.code" placeholder="请输入编码" />
        </el-form-item>
        <el-form-item label="货主编码" prop="shipmentCode">
          <el-input v-model="form.shipmentCode" placeholder="请输入货主编码" />
        </el-form-item>
        <el-form-item label="货源码名称" prop="cargoCodeName">
          <el-input v-model="form.cargoCodeName" placeholder="请输入货源码名称" />
        </el-form-item>
        <el-form-item label="货源码" prop="cargoCodeQr">
          <el-input v-model="form.cargoCodeQr" placeholder="请输入货源码" />
        </el-form-item>
        <el-form-item label="是否删除" prop="delFlag">
          <el-input v-model="form.delFlag" placeholder="请输入是否删除" />
        </el-form-item>
        <el-form-item label="创建人" prop="createCode">
          <el-input v-model="form.createCode" placeholder="请输入创建人" />
        </el-form-item>
        <el-form-item label="更新人" prop="updateCode">
          <el-input v-model="form.updateCode" placeholder="请输入更新人" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listInfo, getInfo, delInfo, addInfo, updateInfo } from '@/api/enterprise/stockcode';

export default {
  name: 'Info',
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
      title: '',
      // 是否显示弹出层
      open: false,
      // 主键字典
      idOptions: [],
      // 编码字典
      codeOptions: [],
      // 货主编码字典
      shipmentCodeOptions: [],
      // 货源码名称字典
      cargoCodeNameOptions: [],
      // 货源码字典
      cargoCodeQrOptions: [],
      // 是否删除字典
      delFlagOptions: [],
      // 创建人字典
      createCodeOptions: [],
      // 创建时间字典
      createTimeOptions: [],
      // 更新人字典
      updateCodeOptions: [],
      // 更新时间字典
      updateTimeOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        code: null,
        shipmentCode: null,
        cargoCodeName: null,
        cargoCodeQr: null,
        createCode: null,
        updateCode: null
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
    this.getDicts('${column.dictType}').then(response => {
      this.idOptions = response.data;
    });
    this.getDicts('${column.dictType}').then(response => {
      this.codeOptions = response.data;
    });
    this.getDicts('${column.dictType}').then(response => {
      this.shipmentCodeOptions = response.data;
    });
    this.getDicts('${column.dictType}').then(response => {
      this.cargoCodeNameOptions = response.data;
    });
    this.getDicts('${column.dictType}').then(response => {
      this.cargoCodeQrOptions = response.data;
    });
    this.getDicts('${column.dictType}').then(response => {
      this.delFlagOptions = response.data;
    });
    this.getDicts('${column.dictType}').then(response => {
      this.createCodeOptions = response.data;
    });
    this.getDicts('${column.dictType}').then(response => {
      this.createTimeOptions = response.data;
    });
    this.getDicts('${column.dictType}').then(response => {
      this.updateCodeOptions = response.data;
    });
    this.getDicts('${column.dictType}').then(response => {
      this.updateTimeOptions = response.data;
    });
  },
  methods: {
    /** 查询【请填写功能名称】列表 */
    getList() {
      this.loading = true;
      listInfo(this.queryParams).then(response => {
        this.infoList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 主键字典翻译
    idFormat(row, column) {
      return this.selectDictLabel(this.idOptions, row.id);
    },
    // 编码字典翻译
    codeFormat(row, column) {
      return this.selectDictLabel(this.codeOptions, row.code);
    },
    // 货主编码字典翻译
    shipmentCodeFormat(row, column) {
      return this.selectDictLabel(this.shipmentCodeOptions, row.shipmentCode);
    },
    // 货源码名称字典翻译
    cargoCodeNameFormat(row, column) {
      return this.selectDictLabel(this.cargoCodeNameOptions, row.cargoCodeName);
    },
    // 货源码字典翻译
    cargoCodeQrFormat(row, column) {
      return this.selectDictLabel(this.cargoCodeQrOptions, row.cargoCodeQr);
    },
    // 是否删除字典翻译
    delFlagFormat(row, column) {
      return this.selectDictLabel(this.delFlagOptions, row.delFlag);
    },
    // 创建人字典翻译
    createCodeFormat(row, column) {
      return this.selectDictLabel(this.createCodeOptions, row.createCode);
    },
    // 创建时间字典翻译
    createTimeFormat(row, column) {
      return this.selectDictLabel(this.createTimeOptions, row.createTime);
    },
    // 更新人字典翻译
    updateCodeFormat(row, column) {
      return this.selectDictLabel(this.updateCodeOptions, row.updateCode);
    },
    // 更新时间字典翻译
    updateTimeFormat(row, column) {
      return this.selectDictLabel(this.updateTimeOptions, row.updateTime);
    },
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
        shipmentCode: null,
        cargoCodeName: null,
        cargoCodeQr: null,
        delFlag: null,
        createCode: null,
        createTime: null,
        updateCode: null,
        updateTime: null
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
      this.title = '添加【请填写功能名称】';
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      getInfo(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = '修改【请填写功能名称】';
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateInfo(this.form).then(response => {
              this.msgSuccess('修改成功');
              this.open = false;
              this.getList();
            });
          } else {
            addInfo(this.form).then(response => {
              this.msgSuccess('新增成功');
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
      this.$confirm('是否确认删除【请填写功能名称】编号为"' + ids + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return delInfo(ids);
      }).then(() => {
        this.getList();
        this.msgSuccess('删除成功');
      });
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('system/info/export', {
        ...this.queryParams
      }, `system_info.xlsx`);
    }
  }
};
</script>
