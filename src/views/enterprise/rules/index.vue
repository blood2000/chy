<template>
  <div class="app-container">
    <el-form v-show="showSearch" ref="queryForm" :model="queryParams" :inline="true" label-width="100px">
      <el-form-item label="规则名称" prop="ruleName">
        <el-input
          v-model="queryParams.ruleName"
          placeholder="请输入规则名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <!-- <el-form-item
        label="计算公式"
        prop="ruleType"
      >
        <el-select
          v-model="queryParams.ruleType"
          placeholder="请选择计算公式"
          clearable
          size="small"
        >
          <el-option
            v-for="dict in ruleTypeOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="亏吨方案" prop="lossType">
        <el-select v-model="queryParams.lossType" placeholder="请选择亏吨方案" clearable size="small">
          <el-option
            v-for="dict in lossTypeOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="亏吨计算方式" prop="lossCalculateType">
        <el-select v-model="queryParams.lossCalculateType" placeholder="请选择亏吨计算方式" clearable size="small">
          <el-option
            v-for="dict in lossCalculateTypeOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="抹零规则" prop="wipeOffType">
        <el-select v-model="queryParams.wipeOffType" placeholder="请选择抹零规则" clearable size="small">
          <el-option
            v-for="dict in wipeOffTypeOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item> -->
      <el-form-item>
        <el-button type="cyan" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['enterprise:rules:add']"
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['enterprise:rules:edit']"
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['enterprise:rules:remove']"
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
        >删除</el-button>
      </el-col>
      <right-toolbar :show-search.sync="showSearch" @queryTable="getList" />
    </el-row>

    <el-table v-loading="loading" :data="rulesList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" fixed="left" />
      <el-table-column label="规则名称" align="center" prop="ruleName" />
      <el-table-column
        label="计算公式"
        align="center"
        prop="ruleType"
        :formatter="ruleTypeFormat"
      />
      <el-table-column label="规则详情" align="center" prop="" />
      <el-table-column label="关联节点" align="center" prop="" />
      <!-- <el-table-column label="是否计算亏吨" align="center" prop="isLoss" :formatter="isLossFormat" />
      <el-table-column label="亏吨方案" align="center" prop="lossType" :formatter="lossTypeFormat" />
      <el-table-column label="亏吨开始范围" align="center" prop="lossStart" />
      <el-table-column label="亏吨结束范围" align="center" prop="lossEnd" />
      <el-table-column label="亏吨计算方式" align="center" prop="lossCalculateType" :formatter="lossCalculateTypeFormat" />
      <el-table-column label="抹零规则" align="center" prop="wipeOffType" :formatter="wipeOffTypeFormat" />
      <el-table-column label="创建人" align="center" prop="createCode" />
      <el-table-column label="修改人" align="center" prop="updateCode" /> -->
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" fixed="right">
        <template slot-scope="scope">
          <el-button
            v-hasPermi="['enterprise:rules:edit']"
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
          >修改</el-button>
          <el-button
            v-hasPermi="['enterprise:rules:remove']"
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
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

    <!-- 添加或修改 对话框 -->
    <rules-dialog ref="RulesDialog" :title="title" :open.sync="open" @refresh="getList" />
  </div>
</template>

<script>
import { listRules, getRules, delRules } from '@/api/enterprise/rules';
import RulesDialog from './rulesDialog.vue';

export default {
  name: 'Rules',
  components: {
    RulesDialog
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
      // 表格数据
      rulesList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 计算公式字典
      ruleTypeOptions: [
        { dictLabel: '运费 = 装货重量 * 运费单价+ 增项-减项', dictValue: 1 },
        { dictLabel: '运费 = 卸货重量 * 运费单价 + 增项 - 减项', dictValue: 2 },
        { dictLabel: '运费 = 装卸货最小重量 * 运费单价 +增项 - 减项', dictValue: 3 },
        { dictLabel: '运费 = 装卸货最大重量 * 运费单价 + 增项 - 减项', dictValue: 4 }
      ],
      // 是否计算亏吨字典
      isLossOptions: [
        { dictLabel: '否', dictValue: 0 },
        { dictLabel: '是 = 卸货重量 * 运费单价 + 增项 - 减项', dictValue: 1 }
      ],
      // 亏吨方案字典
      lossTypeOptions: [
        { dictLabel: '定额', dictValue: 1 },
        { dictLabel: '定律', dictValue: 2 }
      ],
      // 亏吨计算方式字典
      lossCalculateTypeOptions: [
        { dictLabel: '亏吨计算', dictValue: 1 },
        { dictLabel: '减吨计算', dictValue: 2 }
      ],
      // 抹零规则字典
      wipeOffTypeOptions: [
        { dictLabel: '角分抹零', dictValue: 1 },
        { dictLabel: '元抹零', dictValue: 2 }
      ],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        userCode: null,
        ruleName: null,
        ruleType: null,
        isLoss: null,
        lossType: null,
        lossStart: null,
        lossEnd: null,
        lossCalculateType: null,
        wipeOffType: null,
        createCode: null,
        updateCode: null,
        isDel: null
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询列表 */
    getList() {
      this.loading = true;
      listRules(this.queryParams).then(response => {
        this.rulesList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 计算公式字典翻译
    ruleTypeFormat(row, column) {
      return this.selectDictLabel(this.ruleTypeOptions, row.ruleType);
    },
    // 是否计算亏吨字典翻译
    isLossFormat(row, column) {
      return this.selectDictLabel(this.isLossOptions, row.isLoss);
    },
    // 亏吨方案字典翻译
    lossTypeFormat(row, column) {
      return this.selectDictLabel(this.lossTypeOptions, row.lossType);
    },
    // 亏吨计算方式字典翻译
    lossCalculateTypeFormat(row, column) {
      return this.selectDictLabel(this.lossCalculateTypeOptions, row.lossCalculateType);
    },
    // 抹零规则字典翻译
    wipeOffTypeFormat(row, column) {
      return this.selectDictLabel(this.wipeOffTypeOptions, row.wipeOffType);
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm('queryForm');
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.userCode);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.$refs.RulesDialog.reset();
      this.open = true;
      this.title = '添加';
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.$refs.RulesDialog.reset();
      const userCode = row.userCode || this.ids;
      getRules(userCode).then(response => {
        this.$refs.RulesDialog.setForm(response.data);
        this.open = true;
        this.title = '修改';
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const userCodes = row.userCode || this.ids;
      this.$confirm('是否确认删除编号为"' + userCodes + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return delRules(userCodes);
      }).then(() => {
        this.getList();
        this.msgSuccess('删除成功');
      });
    }
  }
};
</script>
