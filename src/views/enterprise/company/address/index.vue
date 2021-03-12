<template>
  <div class="app-container">
    <el-form v-show="showSearch" ref="queryForm" :model="queryParams" :inline="true" label-width="68px">
      <el-form-item label="地址类型" prop="addressType">
        <el-select v-model="queryParams.addressType" placeholder="请选择地址类型" clearable size="small">
          <el-option
            v-for="dict in addressTypeOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
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
      <el-form-item label="地址名称" prop="addressName">
        <el-input
          v-model="queryParams.addressName"
          placeholder="请输入地址名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="地址别名" prop="addressOtherName">
        <el-input
          v-model="queryParams.addressOtherName"
          placeholder="请输入地址别名"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="地址详情" prop="addressDetail">
        <el-input
          v-model="queryParams.addressDetail"
          placeholder="请输入地址详情"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="联系人" prop="userName">
        <el-input
          v-model="queryParams.userName"
          placeholder="请输入联系人"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="手机号码" prop="telphone">
        <el-input
          v-model="queryParams.telphone"
          placeholder="请输入手机号码"
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
      <right-toolbar :show-search.sync="showSearch" @queryTable="getList" />
    </el-row>

    <el-table v-loading="loading" :data="addressList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="地址编码" align="center" prop="code" :formatter="codeFormat" />
      <el-table-column label="货主编码" align="center" prop="shipmentCode" />
      <el-table-column label="地址类型" align="center" prop="addressType" :formatter="addressTypeFormat" />
      <el-table-column label="状态" align="center" prop="status" :formatter="statusFormat" />
      <el-table-column label="创建人" align="center" prop="createCode" />
      <el-table-column label="更新人" align="center" prop="updateCode" />
      <el-table-column label="地址名称" align="center" prop="addressName" :formatter="addressNameFormat" />
      <el-table-column label="地址别名" align="center" prop="addressOtherName" :formatter="addressOtherNameFormat" />
      <el-table-column label="经度" align="center" prop="latitude" />
      <el-table-column label="维度" align="center" prop="longitude" />
      <el-table-column label="地址详情" align="center" prop="addressDetail" />
      <el-table-column label="联系人" align="center" prop="userName" />
      <el-table-column label="手机号码" align="center" prop="telphone" />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="180" fixed="right">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-map-location"
            @click="handleMapView(scope.row)"
          >查看地图</el-button>
          <el-button
            v-hasPermi="['enterprise:company:address:edit']"
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
          >修改</el-button>
          <el-button
            v-hasPermi="['enterprise:company:address:remove']"
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

    <!-- 添加或修改对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="地址编码" prop="code">
          <el-input v-model="form.code" placeholder="请输入地址编码" />
        </el-form-item>
        <el-form-item label="货主编码" prop="shipmentCode">
          <el-input v-model="form.shipmentCode" placeholder="请输入货主编码" />
        </el-form-item>
        <el-form-item label="地址类型" prop="addressType">
          <el-select v-model="form.addressType" placeholder="请选择地址类型">
            <el-option
              v-for="dict in addressTypeOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="parseInt(dict.dictValue)"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="状态(1启用 2禁用)">
          <el-radio-group v-model="form.status">
            <el-radio
              v-for="dict in statusOptions"
              :key="dict.dictValue"
              :label="parseInt(dict.dictValue)"
            >{{ dict.dictLabel }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="创建人" prop="createCode">
          <el-input v-model="form.createCode" placeholder="请输入创建人" />
        </el-form-item>
        <el-form-item label="更新人" prop="updateCode">
          <el-input v-model="form.updateCode" placeholder="请输入更新人" />
        </el-form-item>
        <el-form-item label="地址名称" prop="addressName">
          <el-input v-model="form.addressName" placeholder="请输入地址名称" />
        </el-form-item>
        <el-form-item label="地址别名" prop="addressOtherName">
          <el-input v-model="form.addressOtherName" placeholder="请输入地址别名" />
        </el-form-item>
        <el-form-item label="经度" prop="latitude">
          <el-input v-model="form.latitude" placeholder="请输入经度" />
        </el-form-item>
        <el-form-item label="维度" prop="longitude">
          <el-input v-model="form.longitude" placeholder="请输入维度" />
        </el-form-item>
        <el-form-item label="地址详情" prop="addressDetail">
          <el-input v-model="form.addressDetail" placeholder="请输入地址详情" />
        </el-form-item>
        <el-form-item label="联系人" prop="userName">
          <el-input v-model="form.userName" placeholder="请输入联系人" />
        </el-form-item>
        <el-form-item label="手机号码" prop="telphone">
          <el-input v-model="form.telphone" placeholder="请输入手机号码" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入备注" />
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
import { listAddress, getAddress, delAddress, addAddress, updateAddress } from '@/api/enterprise/company/address';

export default {
  name: 'Address',
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
      // 表格数据
      addressList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 地址编码字典
      codeOptions: [],
      // 地址类型字典
      addressTypeOptions: [],
      // 状态字典
      statusOptions: [
        { 'dictLabel': '启用', 'dictValue': 1 },
        { 'dictLabel': '禁用', 'dictValue': 2 }
      ],
      // 地址名称字典
      addressNameOptions: [],
      // 地址别名字典
      addressOtherNameOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        code: null,
        shipmentCode: null,
        addressType: null,
        status: null,
        createCode: null,
        updateCode: null,
        addressName: null,
        addressOtherName: null,
        latitude: null,
        longitude: null,
        addressDetail: null,
        userName: null,
        telphone: null
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
  },
  methods: {
    /** 查询常用地址列表 */
    getList() {
      this.loading = true;
      listAddress(this.queryParams).then(response => {
        this.addressList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 地址编码字典翻译
    codeFormat(row, column) {
      return this.selectDictLabel(this.codeOptions, row.code);
    },
    // 地址类型字典翻译
    addressTypeFormat(row, column) {
      return this.selectDictLabel(this.addressTypeOptions, row.addressType);
    },
    // 状态字典翻译
    statusFormat(row, column) {
      return this.selectDictLabel(this.statusOptions, row.status);
    },
    // 地址名称字典翻译
    addressNameFormat(row, column) {
      return this.selectDictLabel(this.addressNameOptions, row.addressName);
    },
    // 地址别名字典翻译
    addressOtherNameFormat(row, column) {
      return this.selectDictLabel(this.addressOtherNameOptions, row.addressOtherName);
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
        shipmentCode: null,
        addressType: null,
        status: 0,
        createCode: null,
        createTime: null,
        updateCode: null,
        updateTime: null,
        addressName: null,
        addressOtherName: null,
        latitude: null,
        longitude: null,
        addressDetail: null,
        userName: null,
        telphone: null,
        remark: null
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
      this.ids = selection.map(item => item.code);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = '添加地址';
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const code = row.code || this.ids;
      getAddress(code).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = '修改地址';
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.code != null) {
            updateAddress(this.form).then(response => {
              this.msgSuccess('修改成功');
              this.open = false;
              this.getList();
            });
          } else {
            addAddress(this.form).then(response => {
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
      const codes = row.code || this.ids;
      this.$confirm('是否确认删除地址编号为"' + codes + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return delAddress(codes);
      }).then(() => {
        this.getList();
        this.msgSuccess('删除成功');
      });
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('enterprise/address/export', {
        ...this.queryParams
      }, `address_${new Date().getTime()}.xlsx`);
    }
  }
};
</script>
