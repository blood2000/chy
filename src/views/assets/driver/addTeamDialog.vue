<template>
  <el-dialog
    :visible="visible"
    :fullscreen="isfullscreen"
    width="1300px"
    title="申请加入调度"
    append-to-body
    @close="cancel"
  >
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
        branchCode: null,
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
      this.ids = selection.map(item => item.id);
      this.multiple = !selection.length;
    },
    // 表单重置
    reset() {

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
      console.log(this.ids);
    }
  }
};
</script>
