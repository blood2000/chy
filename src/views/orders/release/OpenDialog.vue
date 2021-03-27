<template>
  <div class="app-container">
    <el-form v-show="showSearch" ref="queryForm" :model="queryParams" :inline="true" label-width="68px">
      <el-form-item label="地址类型" prop="addressType">
        <el-select v-model="queryParams.addressType" placeholder="请选择地址类型" clearable filterable size="small">
          <el-option
            v-for="dict in addressTypeOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择状态" clearable filterable size="small">
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
      <right-toolbar :show-search.sync="showSearch" @queryTable="getList" />
    </el-row>

    <el-radio-group v-model="radio" style="width:100%" @change="handlerChange">



      <el-table v-loading="loading" :data="addressList">
        <!-- <el-table-column type="selection" width="55" align="center" fixed="left" /> -->

        <el-table-column label="" align="center" width="50">
          <template slot-scope="scope">
            <el-radio :label="scope.row.id">
              <div v-show="false" />
            </el-radio>
          </template>
        </el-table-column>

        <el-table-column label="地址名称" align="center" prop="addressName">
          <template slot-scope="scope">
            {{ scope.row.addressName }}
            <el-tag v-if="scope.row.isDefault === 1 && scope.row.addressType === 1">装货默认地址</el-tag>
            <el-tag v-if="scope.row.isDefault === 1 && scope.row.addressType === 2" type="warning">卸货默认地址</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="地址别名" align="center" prop="addressOtherName" />
        <el-table-column label="地址详情" align="center" prop="addressDetail" />
        <el-table-column label="手机号码" align="center" prop="contactTelphone" />
        <el-table-column label="联系人" align="center" prop="contactName" />
        <el-table-column label="状态" align="center" prop="status" :formatter="statusFormat" />

      </el-table>

    </el-radio-group>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

  </div>
</template>

<script>
import { listAddress } from '@/api/enterprise/company/address';

export default {
  data() {
    return {
      radio: 18,
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
      if (selection.length >= 2) {
        this.msgSuccess('只能选择一条');
        return;
      } else {
        console.log(selection);
      }
      // this.ids = selection.map(item => item.id);
      // this.single = selection.length !== 1;
      // this.multiple = !selection.length;
    },
    handlerChange(value) {
      const arr = this.addressList.filter(e => {
        return e.id - 0 === value - 0;
      });
      console.log(arr[0]);
    }
  }
};
</script>
