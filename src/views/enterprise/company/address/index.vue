<template>
  <div>
    <div v-show="showSearch" class="app-container app-container--search">
      <el-form ref="queryForm" :model="queryParams" :inline="true" label-width="68px">
        <el-form-item label="地址别名" prop="addressAlias">
          <el-input
            v-model.trim="queryParams.addressAlias"
            placeholder="请输入地址别名"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="详细地址" prop="detail">
          <el-input
            v-model.trim="queryParams.detail"
            placeholder="请输入详细地址"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
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
        <!-- <el-form-item label="联系人" prop="contact">
        <el-input
          v-model="queryParams.contact"
          placeholder="请输入联系人"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="手机号码" prop="contactPhone">
        <el-input
          v-model="queryParams.contactPhone"
          placeholder="请输入手机号码"
          clearable
          size="small"
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
            v-hasPermi="['assets:shipment:address:add']"
            type="primary"
            icon="el-icon-plus"
            size="mini"
            @click="handleAdd"
          >添加新的常用地址</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            v-hasPermi="['assets:shipment:address:edit']"
            type="success"
            icon="el-icon-edit"
            size="mini"
            :disabled="single"
            @click="handleUpdate"
          >修改</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            v-hasPermi="['assets:shipment:address:remove']"
            type="danger"
            icon="el-icon-delete"
            size="mini"
            :disabled="multiple"
            @click="handleDelete"
          >删除</el-button>
        </el-col>
        <right-toolbar :show-search.sync="showSearch" @queryTable="getList" />
      </el-row>

      <el-table v-loading="loading" :data="addressList" highlight-current-row border @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" fixed="left" />
        <el-table-column label="地址" align="center" prop="addressName">
          <template slot-scope="scope">
            {{ handlerAddressName(scope.row) }}
          </template>
        </el-table-column>
        <el-table-column label="详细地址" align="center" prop="detail" />
        <el-table-column label="地址别名" align="center" prop="addressAlias" />
        <el-table-column label="地址类型" align="center" prop="addressType">
          <template slot-scope="scope">
            <template v-if="scope.row.addressType == '1'"><el-tag style="margin-right:10px; padding: 0 8px;">装</el-tag>装货地址</template>
            <template v-if="scope.row.addressType == '2'"><el-tag style="margin-right:10px; padding: 0 8px;" type="success">卸</el-tag>卸货地址</template>
          </template>
        </el-table-column>
        <el-table-column label="联系人" align="center" prop="contact" />
        <el-table-column label="联系电话" align="center" prop="contactPhone" />
        <el-table-column label="状态" align="center" prop="status" :formatter="statusFormat" />
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="200" fixed="left">
          <template slot-scope="scope">
            <el-button
              v-hasPermi="['assets:shipment:address:edit']"
              size="mini"
              type="text"
              @click="handleUpdate(scope.row)"
            >修改</el-button>
            <el-button
              v-hasPermi="['assets:shipment:address:remove']"
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
    </div>
    <!-- 新增/编辑对话框 -->
    <address-dialog ref="AddressDialog" :title="title" :open.sync="open" :shipment-code="shipmentCode" :org-code="companyCode" @refresh="getList" />
  </div>
</template>

<script>
import { listAddress, getAddress, delAddress } from '@/api/enterprise/company/address';
import AddressDialog from './addressDialog.vue';

export default {
  name: 'CompanyAddress',
  components: {
    AddressDialog
  },
  props: {
    shipmentCode: {
      type: String,
      default: null
    },
    companyCode: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      addressNames: [],
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
      // 状态字典
      statusOptions: [
        { 'dictLabel': '启用', 'dictValue': 1 },
        { 'dictLabel': '禁用', 'dictValue': 2 }
      ],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        addressAlias: undefined,
        addressName: undefined,
        detail: undefined,
        status: undefined,
        addressType: undefined
      },
      // 地址类型字典
      addressTypeOptions: [
        { dictLabel: '装货地址', dictValue: '1' },
        { dictLabel: '卸货地址', dictValue: '2' }
      ]
    };
  },
  watch: {
    '$route.query.companyaddress': {
      handler(value) {
        if (value) {
          this.$nextTick(() => {
            this.handleAdd();
          });
        }
      },
      immediate: true
    }
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询常用地址列表 */
    getList() {
      this.loading = true;
      // 修改：只需要传货主编码，无货主编码时，后端自主判断
      if (this.shipmentCode) {
        this.queryParams.shipmentCode = this.shipmentCode;
      }
      /** if (this.companyCode) {
        this.queryParams.companyCode = this.companyCode;
      } else if (this.shipmentCode) {
        this.queryParams.shipmentCode = this.shipmentCode;
      } **/
      listAddress(this.queryParams).then(response => {
        this.addressList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
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
      this.addressNames = selection.map(item => item.addressName);
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
      const addressNames = row.addressName || this.addressNames;
      this.$confirm('是否确认删除地址"' + addressNames + '"?', '警告', {
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
    /** 与app端同步拼接省市区 */
    handlerAddressName(row) {
      const {
        provinceName,
        cityName,
        districtName
      } = row;

      if (provinceName || cityName || districtName) {
        return provinceName + cityName + districtName;
      } else {
        return row.province + row.city + row.district;
      }
    }
  }
};
</script>
