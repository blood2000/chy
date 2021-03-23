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
      <!-- <el-form-item label="联系人" prop="contactName">
        <el-input
          v-model="queryParams.contactName"
          placeholder="请输入联系人"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="手机号码" prop="contactTelphone">
        <el-input
          v-model="queryParams.contactTelphone"
          placeholder="请输入手机号码"
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
          v-hasPermi="['enterprise:company:address:add']"
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
        >添加新的常用地址</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['enterprise:company:address:edit']"
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['enterprise:company:address:remove']"
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
        >删除</el-button>
      </el-col>
      <right-toolbar :show-search.sync="showSearch" @queryTable="getList" />
    </el-row>

    <el-table v-loading="loading" :data="addressList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" fixed="left" />
      <!-- <el-table-column label="货主编码" align="center" prop="shipmentCode" /> -->
      <!-- <el-table-column label="地址类型" align="center" prop="addressType" :formatter="addressTypeFormat" /> -->
      <el-table-column label="地址名称" align="center" prop="addressName">
        <template slot-scope="scope">
          {{ scope.row.addressName }}
          <el-tag v-if="scope.row.isDefault === 1 && scope.row.addressType === 1">装货默认地址</el-tag>
          <el-tag v-if="scope.row.isDefault === 1 && scope.row.addressType === 2" type="warning">卸货默认地址</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="地址别名" align="center" prop="addressOtherName" />
      <el-table-column label="地址详情" align="center" prop="addressDetail" />
      <el-table-column label="状态" align="center" prop="status" :formatter="statusFormat" />
      <el-table-column label="联系人" align="center" prop="contactName" />
      <el-table-column label="手机号码" align="center" prop="contactTelphone" />
      <!-- <el-table-column label="经度" align="center" prop="latitude" />
      <el-table-column label="维度" align="center" prop="longitude" />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="创建人" align="center" prop="createCode" />
      <el-table-column label="更新人" align="center" prop="updateCode" /> -->
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="200" fixed="right">
        <template slot-scope="scope">
          <!-- <el-button
            size="mini"
            type="text"
            icon="el-icon-map-location"
            @click="handleMapView(scope.row)"
          >查看地图</el-button> -->
          <!-- <el-button
            size="mini"
            type="text"
            icon="el-icon-setting"
            @click="handleSetDefault(scope.row)"
          >设为默认地址</el-button> -->
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

    <!-- 新增/编辑对话框 -->
    <address-dialog ref="AddressDialog" :title="title" :open.sync="open" @refresh="getList" />
  </div>
</template>

<script>
import { listAddress, getAddress, delAddress, defaultAddress } from '@/api/enterprise/company/address';
import AddressDialog from './addressDialog.vue';

export default {
  name: 'Address',
  components: {
    AddressDialog
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
      // 地址类型字典
      addressTypeOptions: [
        { 'dictLabel': '装货地址', 'dictValue': 1 },
        { 'dictLabel': '卸货地址', 'dictValue': 2 }
      ],
      // 状态字典
      statusOptions: [
        { 'dictLabel': '启用', 'dictValue': 1 },
        { 'dictLabel': '禁用', 'dictValue': 2 }
      ],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        isAsc: 'asc',
        orderByColumn: 'id',
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
        contactName: null,
        contactTelphone: null
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
    // 地址类型字典翻译
    addressTypeFormat(row, column) {
      return this.selectDictLabel(this.addressTypeOptions, row.addressType);
    },
    // 状态字典翻译
    statusFormat(row, column) {
      return this.selectDictLabel(this.statusOptions, row.status);
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
      this.$refs.AddressDialog.reset();
      this.open = true;
      this.title = '添加地址';
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.$refs.AddressDialog.reset();
      const id = row.id || this.ids;
      getAddress(id).then(response => {
        this.$refs.AddressDialog.setForm(response.data);
        this.open = true;
        this.title = '修改地址';
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$confirm('是否确认删除地址编号为"' + ids + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return delAddress(ids);
      }).then(() => {
        this.getList();
        this.msgSuccess('删除成功');
      });
    },
    /** 查看地图按钮操作 */
    handleMapView(row) {

    },
    /** 设为默认地址 */
    handleSetDefault(row) {
      defaultAddress({
        code: row.code,
        shipmentCode: row.shipmentCode,
        addressType: row.addressType
      }).then(response => {
        this.msgSuccess('设置成功');
        this.getList();
      });
    }
  }
};
</script>
