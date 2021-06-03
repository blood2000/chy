<template>
  <el-dialog
    :visible="visible"
    :fullscreen="isfullscreen"
    width="1300px"
    title="处理邀请"
    append-to-body
    :close-on-click-modal="false"
    @close="cancel"
  >
    <el-table v-loading="loading" :data="infoList" highlight-current-row border stripe @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="序号" align="center" type="index" min-width="5%" />
      <el-table-column label="调度组名称" align="center" prop="name" />
      <el-table-column label="身份证号" align="center" prop="identificationNumber" />
      <el-table-column label="是否清分" align="center" prop="isDistribution">
        <template slot-scope="scope">
          <span>{{ selectDictLabel(isOptions, scope.row.isDistribution) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="清分百分比" align="center" prop="distributionPercent" />
      <el-table-column label="状态" align="center" prop="teamStatus">
        <template slot-scope="scope">
          <span>{{ selectDictLabel(statusOptions, scope.row.teamStatus) }}</span>
        </template>
      </el-table-column>
    </el-table>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" :loading="buttonLoading" :disabled="multiple" @click="handleAgree(1)">同 意</el-button>
      <el-button type="danger" :loading="buttonLoading" :disabled="multiple" @click="handleAgree(2)">拒 绝</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { listApply, dealApply } from '@/api/assets/driver';

export default {
  name: 'ApplyTeamDialog',
  props: {
    open: Boolean,
    driverCode: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      buttonLoading: false,
      isfullscreen: false,
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      teamCodes: [],
      // 非多个禁用
      multiple: true,
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
      infoList: []
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
    // 获取司机要处理的邀请列表
    getList() {
      this.loading = true;
      listApply(this.driverCode).then(response => {
        this.infoList = response.data;
        this.loading = false;
      });
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id);
      this.teamCodes = selection.map(item => item.code);
      this.multiple = !selection.length;
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
    // 同意按钮
    handleAgree(status) {
      this.buttonLoading = true;
      dealApply({
        driverCode: this.driverCode,
        ids: this.ids,
        teamCodes: this.teamCodes,
        status: status
      }).then(response => {
        this.msgSuccess('操作成功');
        this.close();
        this.$emit('refresh');
        this.buttonLoading = false;
      }).catch(() => {
        this.buttonLoading = false;
      });
    }
  }
};
</script>
