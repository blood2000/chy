<template>
  <div>
    <el-alert
      title="未分配角色的用户，分配为司机或者调度者成功后，请转至运力>司机管理/调度者管理下审核！"
      type="warning"
    />
    <div v-show="showSearch" class="app-container app-container--search">
      <el-form ref="queryForm" :model="queryParams" :inline="true" label-width="100px">
        <el-form-item label="手机号" prop="phonenumber">
          <el-input
            v-model="queryParams.phonenumber"
            placeholder="请输入注册手机号"
            clearable
            style="width: 240px;"
            size="small"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="注册时间">
          <el-date-picker
            v-model="dateRange"
            size="small"
            style="width: 240px"
            value-format="yyyy-MM-dd"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
          <el-button type="primary" plain icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="app-container">
      <el-table v-loading="loading" highlight-current-row border :data="list">
        <el-table-column
          label="操作"
          align="center"
          fixed="left"
          width="300"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              @click="handleDriver(scope.row)"
            >注册为司机</el-button>
            <el-button
              size="mini"
              type="text"
              @click="handleTeam(scope.row)"
            >注册为调度者</el-button>
            <el-button
              size="mini"
              type="text"
              @click="handleDelete(scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
        <el-table-column label="手机号" align="center" prop="phonenumber" :show-overflow-tooltip="true" />
        <el-table-column label="用户姓名" align="center" prop="nickName" :show-overflow-tooltip="true" />
        <el-table-column label="创建时间" align="center" prop="createTime" width="160">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.createTime) }}</span>
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
    <RegisterDriver :data="rowData" :open.sync="driverOpen" @refresh="getList" />
    <RegisterTeam :data="rowData" :open.sync="teamOpen" @refresh="getList" />
  </div>
</template>

<script>
import { list, delRegisterUser } from '@/api/assets/registerUser';
import RegisterDriver from './driverDialog';
import RegisterTeam from './teamDialog';
export default {
  name: 'RegisterUser',
  components: { RegisterDriver, RegisterTeam },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 表格数据
      list: [],
      // 日期范围
      dateRange: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        phonenumber: undefined,
        beginTime: undefined,
        endTime: undefined
      },
      driverOpen: false,
      teamOpen: false,
      rowData: {}
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询登录日志列表 */
    getList() {
      this.loading = true;
      if (this.dateRange != null && this.dateRange !== '') {
        this.queryParams.beginTime = this.dateRange[0];
        this.queryParams.endTime = this.dateRange[1];
      }
      list(this.queryParams).then(response => {
        this.list = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = [];
      this.queryParams.beginTime = undefined;
      this.queryParams.endTime = undefined;
      this.resetForm('queryForm');
      this.handleQuery();
    },
    handleDelete(row) {
      this.$confirm('是否确认删除手机号为"' + row.phonenumber + '"的用户?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return delRegisterUser(row.userCode);
      }).then(() => {
        this.getList();
        this.msgSuccess('删除成功');
      });
    },
    handleDriver(row) {
      this.rowData = row;
      this.driverOpen = true;
    },
    handleTeam(row) {
      this.rowData = row;
      this.teamOpen = true;
    }
  }
};
</script>

