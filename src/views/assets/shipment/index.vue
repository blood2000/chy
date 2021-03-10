<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="货主姓名" prop="adminName">
        <el-input
          v-model="queryParams.adminName"
          placeholder="请输入货主姓名"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="审核状态" prop="authStatus">
        <el-select
          v-model="queryParams.authStatus"
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
      <el-form-item label="公司名称" prop="companyName">
        <el-input
          v-model="queryParams.companyName"
          placeholder="请输入公司名称"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="货主类别" prop="shipperType">
        <el-select
          v-model="queryParams.shipperType"
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
        <el-date-picker clearable size="small"
          v-model="queryParams.beginTime"
          type="date"
          value-format="yyyy-MM-dd"
          style="width: 240px"
          placeholder="请选择"
        ></el-date-picker> -
        <el-date-picker clearable size="small"
          v-model="queryParams.endTime"
          type="date"
          value-format="yyyy-MM-dd"
          style="width: 240px"
          placeholder="请选择"
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
      <el-table-column label="货主姓名" align="center" prop="adminName" />
      <el-table-column label="公司名称" align="center" prop="companyName" sortable />
      <el-table-column label="货主类别" align="center" prop="shipperType" :formatter="shipperTypeFormat" />
      <el-table-column label="货主身份证" align="center" prop="identificationNumber" />
      <el-table-column label="营业执照号" align="center" prop="businessLicenseNo" />
      <el-table-column label="统一社会信用代码代码" align="center" prop="organizationCodeNo" />
      <el-table-column label="法人身份证" align="center" prop="artificialIdentificationNumber" />
      <el-table-column label="审核状态" align="center" prop="authStatus" :formatter="authStatusFormat" sortable />
      <el-table-column label="是否冻结" align="center" prop="isFreezone" :formatter="isFreezoneFormat" />
      <el-table-column label="创建人" align="center" prop="createCode" />
      <el-table-column label="修改人" align="center" prop="updateCode" />
      <el-table-column label="创建时间" align="center" prop="createTime" sortable width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(new Date(scope.row.createTime)) }}</span>
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
            @click="handleDEtail(scope.row, 'edit')"
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
    <shipment-dialog ref="ShipmentDialog" :title="title" :open.sync="open" :disable="formDisable" @refresh="getList"></shipment-dialog>
  </div>
</template>

<script>
import { listShipment, getShipment, delShipment } from "@/api/assets/shipment";
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
      // 货主类型数据字典
      typeOptions: [
        {dictLabel: '发货人', dictValue: 0},
        {dictLabel: '发货企业', dictValue: 1}
      ],
      // 审核状态字典
      statusOptions: [
        {dictLabel: '未审核', dictValue: 0},
        {dictLabel: '审核中', dictValue: 1},
        {dictLabel: '审核未通过', dictValue: 2},
        {dictLabel: '审核通过', dictValue: 3}
      ],
      // 是否冻结字典
      isFreezoneOptions: [
        {dictLabel: '正常', dictValue: 0},
        {dictLabel: '冻结', dictValue: 1}
      ],  
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        adminName: undefined,
        authStatus: undefined,
        companyName: undefined,
        beginTime: undefined,
        endTime: undefined
      },
      // 表单详情
      form: {},
      // 表单是否禁用   
      formDisable: false
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询参数列表 */
    getList() {
      this.loading = true;
      listShipment(this.queryParams).then(response => {
          this.shipmentList = response.rows;
          this.total = response.total;
          this.loading = false;
        }
      );
    },
    // 参数系统内置字典翻译
    shipperTypeFormat(row) {
      return this.selectDictLabel(this.typeOptions, row.shipperType);
    },
    authStatusFormat(row) {
      return this.selectDictLabel(this.statusOptions, row.authStatus);
    },
    isFreezoneFormat(row) {
      return this.selectDictLabel(this.isFreezoneOptions, row.isFreezone);
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
    /** 新增按钮操作 */
    handleAdd() {
      this.$refs.ShipmentDialog.reset();
      this.open = true;
      this.title = "新增";
      this.formDisable = false;
    },
    /** 修改/详情按钮操作 */
    handleDEtail(row, flag) {
      this.$refs.ShipmentDialog.reset();
      const id = row.id;
      getShipment(id).then(response => {
        this.$refs.ShipmentDialog.setForm(response.data);
        this.open = true;
        this.title = flag === "edit" ? "编辑" : "详情";
        this.formDisable = flag == "edit" ? false : true;
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const id = row.id;
      this.$confirm('是否确认删除编号为"' + id + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delShipment(id);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
    }
  }
};
</script>