<template>
  <div>
    <div v-show="showSearch" class="app-container app-container--search">
      <el-form ref="queryForm" :model="queryParams" :inline="true" label-width="100px">
        <el-form-item label="接收人手机号" prop="receiver">
          <el-input
            v-model="queryParams.receiver"
            placeholder="请输入接收人手机号"
            clearable
            style="width: 240px;"
            size="small"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select
            v-model="queryParams.status"
            placeholder="发送状态"
            clearable
            filterable
            size="small"
          >
            <el-option
              v-for="dict in statusOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="发送时间">
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
      <RefactorTable :loading="loading" :data="list" :table-columns-config="tableColumnsConfig">
        <template #status="{row}">
          <span>{{ selectDictLabel(statusOptions, row.status) }}</span>
        </template>
        <template #sendTime="{row}">
          <span>{{ parseTime(row.sendTime) }}</span>
        </template>
      </RefactorTable>
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getList"
      />
    </div>
  </div>
</template>

<script>
import { list } from '@/api/system/message';

export default {
  name: 'Logininfor',

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
      // 状态数据字典
      statusOptions: [
        { dictLabel: '未发送', dictValue: 0 },
        { dictLabel: '已发送', dictValue: 1 },
        { dictLabel: '发送失败', dictValue: 2 }
      ],
      // 日期范围
      dateRange: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        receiver: undefined
      },
      // 下拉框展示所有的值-其中每一项就是配置项的值
      tableColumnsConfig: [
        {
          prop: 'receiver',
          label: '发送人手机',
          isShow: true
        },
        {
          prop: 'content',
          isShow: true,
          label: '发送内容',
          width: 180
        },
        {
          prop: 'status',
          isShow: true,
          label: '状态'
        },
        {
          prop: 'sendTime',
          isShow: true,
          label: '发送时间'
        }
      ]
    };
  },
  created() {
    this.tableColumnsConfig = this.getLocalStorage(this.$route.name) || this.tableColumnsConfig;
    this.getList();
  },
  methods: {
    /** 查询登录日志列表 */
    getList() {
      this.loading = true;
      list(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
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
      this.resetForm('queryForm');
      this.handleQuery();
    }
  }
};
</script>

