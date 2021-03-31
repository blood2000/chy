<template>
  <el-dialog
    :visible="visible"
    :fullscreen="isfullscreen"
    width="1300px"
    title="变动明细"
    append-to-body
    @close="cancel"
  >
    <el-form ref="queryForm" :model="queryParams" :inline="true" label-width="80px">
      <el-form-item label="消费项目" prop="name">
        <el-select v-model="queryParams.name" placeholder="请选择消费项目" filterable clearable size="small" class="input-width">
          <el-option
            v-for="dict in consumeOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="交易类型" prop="name">
        <el-select v-model="queryParams.name" placeholder="请选择交易类型" filterable clearable size="small" class="input-width">
          <el-option
            v-for="dict in typeOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="变动日期" prop="name">
        <el-date-picker
          v-model="queryParams.name"
          clearable
          size="small"
          class="input-width"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择"
        />
        至
        <el-date-picker
          v-model="queryParams.name"
          clearable
          size="small"
          class="input-width"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="cyan" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table v-loading="loading" :data="infoList">
      <el-table-column label="序号" type="index" min-width="5%" />
      <el-table-column label="客户名称" align="center" prop="" />
      <el-table-column label="变动金额" align="center" prop="" />
      <el-table-column label="变动类型" align="center" prop="" />
      <el-table-column label="变动原因" align="center" prop="" />
      <el-table-column label="账户余额" align="center" prop="" />
      <el-table-column label="操作人" align="center" prop="" />
      <el-table-column label="变动时间" align="center" prop="">
        <template slot-scope="scope">
          {{ parseTime(scope.row.time) }}
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center" prop="" />
    </el-table>
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
  </el-dialog>
</template>

<script>
import { changeDetailList } from '@/api/capital/abalance';

export default {
  name: 'TeamManageDialog',
  props: {
    open: Boolean
  },
  data() {
    return {
      isfullscreen: false,
      // 遮罩层
      loading: true,
      // 总条数
      total: 0,
      // 消费项目字典
      consumeOptions: [],
      // 交易类型字典
      typeOptions: [],
      // 参数表格数据
      infoList: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10
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
  watch: {
    open(val) {
      if (val) {
        this.getList();
      }
    }
  },
  methods: {
    // 获取变动明细列表
    getList() {
      this.loading = true;
      changeDetailList(this.queryParams).then(response => {
        this.infoList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
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
    }
  }
};
</script>

<style scoped>
.input-width{
  width: 200px;
}
</style>
