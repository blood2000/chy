<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="用户名称" prop="shipmentName">
        <el-input
          v-model="queryParams.shipmentName"
          placeholder="请输入用户名称"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="电话号码" prop="shipmentTelephone">
        <el-input
          v-model="queryParams.shipmentTelephone"
          placeholder="请输入电话号码"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="独立核算" prop="shipmentAccounting">
        <el-select
          v-model="queryParams.shipmentAccounting"
          clearable
          size="small"
          style="width: 240px"
        >
          <el-option
            v-for="dict in aaccountingOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="审核状态" prop="shipmentStatus">
        <el-select
          v-model="queryParams.shipmentStatus"
          clearable
          size="small"
          style="width: 240px"
        >
          <el-option
            v-for="dict in statusOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="公司名称" prop="shipmentCompany">
        <el-input
          v-model="queryParams.shipmentCompany"
          placeholder="请输入公司名称"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="推荐人" prop="shipmentReferrer">
        <el-input
          v-model="queryParams.shipmentReferrer"
          placeholder="请输入推荐人"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="货主类型" prop="shipmentType">
        <el-select
          v-model="queryParams.shipmentType"
          clearable
          size="small"
          style="width: 240px"
        >
          <el-option
            v-for="dict in typeOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="审核时间">
        <el-date-picker
          v-model="dateRange"
          size="small"
          style="width: 240px"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
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
          v-hasPermi="['assets:shipment:add']"
        >新增</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="shipmentList">
      <el-table-column label="审核状态" align="center" prop="" sortable	/>
      <el-table-column label="姓名" align="center" prop="" />
      <el-table-column label="公司名称" align="center" prop="" :show-overflow-tooltip="true" sortable />
      <el-table-column label="货主类型" align="center" prop="" :formatter="typeFormat" />
      <el-table-column label="电话号码" align="center" prop="" sortable />
      <el-table-column label="网商汇款账号" align="center" prop="" sortable	/>
      <el-table-column label="冻结保证金(元)" align="center" prop="" sortable />
      <el-table-column label="税点(%)" align="center" prop="" sortable />
      <el-table-column label="推荐人" align="center" prop="" />
      <el-table-column label="是否独立核算" align="center" prop="" />
      <el-table-column label="是否审核货源" align="center" prop="" />
      <el-table-column label="是否预付运费" align="center" prop="" />
      <el-table-column label="授信金额" align="center" prop="" />
      <el-table-column label="授信余额" align="center" prop="" />
      <el-table-column label="创建时间" align="center" prop="createTime" sortable width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="审核时间" align="center" prop="createTime" sortable width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="180">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-document"
            @click="handleDEtail(scope.row)"
          >详情</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['assets:shipment:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['assets:shipment:remove']"
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

    <!-- 新增/修改/详情 对话框 -->
    <shipment-dialog ref="ShipmentDialog" :title="title" :open.sync="open" @refresh="getList"></shipment-dialog>
  </div>
</template>

<script>
import { listConfig, getConfig, delConfig } from "@/api/assets/shipment";
import ShipmentDialog from './shipmentDialog';

export default {
  name: "Shipment",
  components: {
    ShipmentDialog
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
      // 参数表格数据
      shipmentList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 日期范围
      dateRange: [],
      // 独立核算字典   
      aaccountingOptions: [],
      // 审核状态字典
      statusOptions: [],
      // 货主类型数据字典
      typeOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        shipmentName: undefined,
        shipmentTelephone: undefined,
        shipmentAccounting: undefined,
        shipmentStatus: undefined,
        shipmentCompany: undefined,
        shipmentReferrer: undefined,
        shipmentType: undefined,
      },
    };
  },
  created() {
    this.getList();
    this.getDicts("sys_yes_no").then(response => {
      this.typeOptions = response.data;
    });
  },
  methods: {
    /** 查询参数列表 */
    getList() {
      this.loading = true;
      listConfig(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
          this.shipmentList = response.rows;
          this.total = response.total;
          this.loading = false;
        }
      );
    },
    // 参数系统内置字典翻译
    typeFormat(row, column) {
      return this.selectDictLabel(this.typeOptions, row.shipmentType);
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.$refs.ShipmentDialog.reset();
      this.open = true;
      this.title = "新增";
    },
    /** 详情按钮操作 */
    handleDEtail(row) {
      this.$refs.ShipmentDialog.reset();
      const configId = row.configId || this.ids
      getConfig(configId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "详情";
      });
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.$refs.ShipmentDialog.reset();
      const configId = row.configId || this.ids
      getConfig(configId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "编辑";
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const configIds = row.configId || this.ids;
      this.$confirm('是否确认删除编号为"' + configIds + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delConfig(configIds);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('system/config/export', {
        ...this.queryParams
      }, `config_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>