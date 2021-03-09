<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="74px">
      <el-form-item label="司机/调度" prop="driverRole">
        <el-select
          v-model="queryParams.driverRole"
          clearable
          size="small"
          style="width: 240px"
        >
          <el-option
            v-for="dict in roleOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="用户名称" prop="driverName">
        <el-input
          v-model="queryParams.driverName"
          placeholder="请输入用户名称"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="电话号码" prop="driverTelephone">
        <el-input
          v-model="queryParams.driverTelephone"
          placeholder="请输入电话号码"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="车牌号" prop="driverPlate">
        <el-input
          v-model="queryParams.driverPlate"
          placeholder="请输入车牌号"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="加入调度" prop="driverJoinSchedule">
        <el-select
          v-model="queryParams.driverJoinSchedule"
          clearable
          size="small"
          style="width: 240px"
        >
          <el-option
            v-for="dict in joinScheduleOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="身份证号" prop="driverIDCard">
        <el-input
          v-model="queryParams.driverIDCard"
          placeholder="请输入身份证号"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="推荐人" prop="driverReferrer">
        <el-input
          v-model="queryParams.driverReferrer"
          placeholder="请输入推荐人"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="审核状态" prop="driverStatus">
        <el-select
          v-model="queryParams.driverStatus"
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
          v-hasPermi="['system:driver:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
        >批量删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="info"
          icon="el-icon-upload2"
          size="mini"
          @click="handleExport"
        >司机批量导入</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-upload2"
          size="mini"
          @click="handleExport"
        >司机车辆信息上报</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
        >下载模板</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="driverList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="审核状态" align="center" prop="" sortable	/>
      <el-table-column label="上报状态" align="center" prop="" sortable	/>
      <el-table-column label="姓名" align="center" prop="" sortable	/> 
      <el-table-column label="调度名称" align="center" prop="" sortable	/>
      <el-table-column label="电话号码" align="center" prop="" sortable	/>
      <el-table-column label="车牌号" align="center" prop="" sortable	/>
      <el-table-column label="网商汇款账号" align="center" prop="" sortable	/>
      <el-table-column label="定位来源" align="center" prop="" />
      <el-table-column label="设备编号" align="center" prop="" sortable	/>
      <el-table-column label="身份证号" align="center" prop="" sortable	/>
      <el-table-column label="预付款余额(元)" align="center" prop="" sortable	/>
      <el-table-column label="道路运输许可证号" align="center" prop="" sortable	/>
      <el-table-column label="司机/调度" align="center" prop="" />
      <el-table-column label="载重" align="center" prop="" />
      <el-table-column label="注册时间" align="center" prop="createTime" sortable width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="上报日期" align="center" prop="createTime" sortable width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="驾驶证到期" align="center" prop="createTime" sortable>
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="行驶证到期" align="center" prop="createTime" sortable>
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="推荐人" align="center" prop="" />
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
            v-hasPermi="['system:config:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:config:remove']"
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
    <driver-dialog ref="DriverDialog" :title="title" :open.sync="open" @refresh="getList"></driver-dialog>
  </div>
</template>

<script>
import { listConfig, getConfig, delConfig } from "@/api/assets/driver";
import DriverDialog from './driverDialog';

export default {
  name: "Driver",
  components: {
    DriverDialog
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
      driverList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 日期范围
      dateRange: [],
      // 司机/调度字典
      roleOptions: [
        {dictLabel: '司机', dictValue: '司机'},
        {dictLabel: '调度', dictValue: '调度'}
      ],
      // 加入调度字典   
      joinScheduleOptions: [],
      // 审核状态字典
      statusOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        driverRole: undefined,
        driverName: undefined,
        driverTelephone: undefined,
        driverPlate: undefined,
        driverJoinSchedule: undefined,
        driverIDCard: undefined,
        driverReferrer: undefined,
        driverStatus: undefined
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询参数列表 */
    getList() {
      this.loading = true;
      listConfig(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
          this.driver = response.rows;
          this.total = response.total;
          this.loading = false;
        }
      );
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
      this.$refs.DriverDialog.reset();
      this.open = true;
      this.title = "新增";
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.configId)
      this.single = selection.length!=1
      this.multiple = !selection.length
    },
    /** 详情按钮操作 */
    handleDEtail(row) {
      this.$refs.DriverDialog.reset();
      const configId = row.configId || this.ids
      getConfig(configId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "详情";
      });
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.$refs.DriverDialog.reset();
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