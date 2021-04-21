<template>
  <!-- 平台账户余额 -->
  <div class="app-container">
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5" class="fr">
        <tablec-cascader v-model="tableColumnsConfig" :lcokey="api" />
      </el-col>
      <right-toolbar :show-search.sync="showSearch" @queryTable="getList" />
    </el-row>
    <el-table v-loading="loading" stripe border :data="dataList">
      <el-table-column label="姓名" align="center" prop="" />
      <el-table-column label="网商汇款账号" align="center" prop="" />
      <el-table-column label="角色" align="center" prop="" />
      <el-table-column label="平台账号余额" align="center" prop="" />
      <el-table-column label="余额变动时间" align="center" prop="" />
      <el-table-column label="公户银行账户" align="center" prop="" />
      <el-table-column label="开户银行" align="center" prop="" />
      <el-table-column label="银行预留手机号" align="center" prop="" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="240" fixed="right">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            @click="handleChangeDetail(scope.row)"
          >变动明细</el-button>
          <el-button
            size="mini"
            type="text"
            @click="handleRecharge(scope.row)"
          >划拨充值</el-button>
          <el-button
            size="mini"
            type="text"
            @click="handleReflect(scope.row)"
          >平台提现</el-button>
          <TableDropdown>
            <el-dropdown-item>
              <el-button
                size="mini"
                type="text"
                @click="handleMember(scope.row)"
              >开通网商会员</el-button>
            </el-dropdown-item>
            <el-dropdown-item>
              <el-button
                size="mini"
                type="text"
                @click="handleBindBank(scope.row)"
              >绑定银行卡</el-button>
            </el-dropdown-item>
            <el-dropdown-item>
              <el-button
                size="mini"
                type="text"
                @click="handleBalance(scope.row)"
              >查询网商余额</el-button>
            </el-dropdown-item>
          </TableDropdown>
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

    <!-- 绑定银行卡 对话框 -->
    <bank-dialog ref="bankDialogRef" :open.sync="bindBankOpen" :title="title" @refresh="getList" />
    <!-- 变动明细 对话框 -->
    <change-detail-dialog :open.sync="changeDetailOpen" :title="title" />
    <!-- 查询网商余额 对话框 -->
    <check-balance-dialog :open.sync="balanceOpen" :title="title" />
    <!-- 划拨充值 对话框 -->
    <recharge-dialog :open.sync="rechargeOpen" :title="title" />
    <!-- 平台提现 -->
    <reflect-dialog :open.sync="reflectOpen" :title="title" />
  </div>
</template>

<script>
import { balanceListApi, balanceList } from '@/api/capital/abalance';
import BankDialog from './bankDialog';
import ChangeDetailDialog from '../components/changeDetailDialog';
import CheckBalanceDialog from '../components/checkBalanceDialog';
import RechargeDialog from './rechargeDialog';
import ReflectDialog from './reflectDialog';

export default {
  name: 'Abalance',
  components: {
    BankDialog,
    ChangeDetailDialog,
    CheckBalanceDialog,
    RechargeDialog,
    ReflectDialog
  },
  data() {
    return {
      tableColumnsConfig: [],
      api: balanceListApi,
      // 遮罩层
      loading: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 表格数据
      dataList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      changeDetailOpen: false,
      rechargeOpen: false,
      reflectOpen: false,
      bindBankOpen: false,
      balanceOpen: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10
      }
    };
  },
  created() {
    this.tableHeaderConfig(this.tableColumnsConfig, balanceListApi, {
      prop: 'edit',
      isShow: true,
      label: '操作',
      width: 310,
      fixed: 'right'
    });
    this.getList();
  },
  methods: {
    /** 查询列表 */
    getList() {
      this.loading = true;
      balanceList(this.queryParams).then(response => {
        this.dataList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    /** 变动明细 */
    handleChangeDetail(row) {
      this.title = '变动明细';
      this.changeDetailOpen = true;
    },
    /** 划拨充值 */
    handleRecharge(row) {
      this.title = '划拨充值';
      this.rechargeOpen = true;
    },
    /** 平台提现 */
    handleReflect(row) {
      this.title = '平台提现';
      this.reflectOpen = true;
    },
    /** 开通网商会员 */
    handleMember(row) {
      this.$confirm('请确认是否开通网商会员?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {

      }).then(() => {
        this.getList();
        this.msgSuccess('开通成功');
      });
    },
    /** 绑定银行卡 */
    handleBindBank(row) {
      this.$refs.bankDialogRef.reset();
      // 这里需要调获取详情接口
      this.$refs.bankDialogRef.setForm({});
      this.title = '绑定银行卡';
      this.bindBankOpen = true;
    },
    /** 查询网商余额 */
    handleBalance(row) {
      this.title = '查询网商余额';
      this.balanceOpen = true;
    }
  }
};
</script>
