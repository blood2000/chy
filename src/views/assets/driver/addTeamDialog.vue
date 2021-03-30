<template>
  <el-dialog
    :visible="visible"
    :fullscreen="isfullscreen"
    width="1300px"
    title="申请加入调度"
    append-to-body
    @close="cancel"
  >
    <el-form ref="queryForm" :model="queryParams" :inline="true" label-width="80px">
      <el-form-item label="调度者" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入调度者名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="管理者" prop="teamLeader">
        <el-input
          v-model="queryParams.teamLeader"
          placeholder="请输入管理者名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择状态" filterable clearable size="small">
          <el-option
            v-for="dict in statusOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="司机姓名" prop="driverName">
        <el-input
          v-model="queryParams.driverName"
          placeholder="请输入司机姓名"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="车牌号码" prop="licenseNumber">
        <el-input
          v-model="queryParams.licenseNumber"
          placeholder="请输入车牌号码"
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
    <el-table v-loading="loading" :data="infoList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <!-- <el-table-column label="网点编码" align="center" prop="branchCode" /> -->
      <el-table-column label="车队名称" align="center" prop="name" />
      <el-table-column label="车队管理者" align="center" prop="teamLeader" />
      <el-table-column label="身份证号" align="center" prop="identificationNumber" />
      <el-table-column label="是否清分" align="center" prop="isDistribution">
        <template slot-scope="scope">
          <span>{{ selectDictLabel(isOptions, scope.row.isDistribution) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="清分百分比" align="center" prop="distributionPercent" />
      <el-table-column label="状态" align="center" prop="status">
        <template slot-scope="scope">
          <span>{{ selectDictLabel(statusOptions, scope.row.status) }}</span>
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
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" :disabled="multiple" @click="submitForm">确 定</el-button>
      <el-button @click="cancel">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { listInfo } from '@/api/assets/team';
import { applyJoinTeam } from '@/api/assets/driver';

export default {
  name: 'TeamManageDialog',
  props: {
    open: Boolean,
    driverCode: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      isfullscreen: false,
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非多个禁用
      multiple: true,
      // 总条数
      total: 0,
      // 状态字典
      statusOptions: [
        { dictLabel: '启用', dictValue: '0' },
        { dictLabel: '禁用', dictValue: '1' }
      ],
      isOptions: [
        { dictLabel: '否', dictValue: 0 },
        { dictLabel: '是', dictValue: 1 }
      ],
      // 参数表格数据
      infoList: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        name: null,
        teamLeader: null,
        status: null,
        driverName: null,
        licenseNumber: null
      }
    };
  },
  computed: {
    visible: {
      get() {
        return this.open;
      },
      set(v) {
        this.$emit('update:open', v);
      }
    }
  },
  created() {
    this.getList();
  },
  methods: {
    // 获取调度者列表
    getList() {
      this.loading = true;
      listInfo(this.queryParams).then(response => {
        this.infoList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.code);
      this.multiple = !selection.length;
    },
    // 搜索按钮操作
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    // 重置按钮操作
    resetQuery() {
      this.reset();
      this.handleQuery();
    },
    // 表单重置
    reset() {
      this.resetForm('queryForm');
    },
    // 取消按钮
    cancel() {
      this.close();
      this.reset();
    },
    // 关闭弹窗
    close() {
      this.$emit('update:open', false);
    },
    // 提交按钮
    submitForm() {
      applyJoinTeam({
        driverCode: this.driverCode,
        teamCodes: this.ids
      }).then(response => {
        this.msgSuccess('操作成功');
        this.close();
      });
    }
  }
};
</script>
