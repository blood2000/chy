<template>
  <div>
    <el-row>
      <el-col v-if="false" :span="4">
        <el-card class="card-left">
          <div slot="header">
            <div class="left_v" />
            <span>地区列表</span>
          </div>
          <!-- 树形结构 -->
          <el-tree
            :data="[]"
            show-checkbox
            node-key="id"
            :default-expanded-keys="[2, 3]"
            :default-checked-keys="[5]"
            :props="{children: 'children',label: 'label'}"
          />
        </el-card>
      </el-col>
      <el-col :span="24">
        <el-card class="card-rigth">
          <div v-if="false" slot="header">
            <div class="left_v" />
            <span>院区列表</span>
          </div>
          <!-- 右边 -->
          <div>
            <el-form v-show="showSearch" ref="queryForm" :model="queryParams" :inline="true" label-width="100px" class="clearfix">
              <el-form-item label="装货信息" prop="tin1">
                <el-input
                  v-model="queryParams.tin1"
                  placeholder="请输入公司名称/客户姓名/手机号"
                  clearable
                  size="small"
                  @keyup.enter.native="handleQuery"
                />
              </el-form-item>

              <el-form-item label="装货信息" prop="tin2">
                <el-input
                  v-model="queryParams.tin2"
                  placeholder="装货地/装货电话/装货人"
                  clearable
                  size="small"
                  @keyup.enter.native="handleQuery"
                />
              </el-form-item>

              <el-form-item label="货物类型" prop="tin3">
                <el-select v-model="queryParams.tin3" placeholder="----请选择----" style="width: 215px" clearable filterable>
                  <el-option label="区域一" value="shanghai" />
                  <el-option label="区域二" value="beijing" />
                </el-select>
              </el-form-item>

              <el-form-item label="货源单号" prop="tin4">
                <el-input
                  v-model="queryParams.tin4"
                  placeholder="目的地/收货电话/收货人"
                  clearable
                  size="small"
                  @keyup.enter.native="handleQuery"
                />
              </el-form-item>

              <el-form-item label="订单状态" prop="tin5">
                <el-select v-model="queryParams.tin5" placeholder="----请选择----" style="width: 215px" clearable filterable>
                  <el-option label="区域一" value="shanghai" />
                  <el-option label="区域二" value="beijing" />
                </el-select>
              </el-form-item>

              <!-- <el-form-item label="货源类型" prop="testName2">
                        <el-select v-model="queryParams.testName7" placeholder="----请选择----" style="width: 215px">
                        <el-option label="区域一" value="shanghai"></el-option>
                        <el-option label="区域二" value="beijing"></el-option>
                        </el-select>
                    </el-form-item> -->

              <!-- <el-form-item label="是否拼单" prop="testName2">
                        <el-select v-model="queryParams.testName8" placeholder="----请选择----" style="width: 215px">
                            <el-option label="区域一" value="shanghai"></el-option>
                            <el-option label="区域二" value="beijing"></el-option>
                        </el-select>
                    </el-form-item> -->

              <el-form-item label="创建时间" prop="tin6">
                <el-date-picker
                  v-model="queryParams.tin6"
                  size="small"
                  style="width: 215px"
                  value-format="yyyy-MM-dd"
                  type="daterange"
                  range-separator="-"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                />
              </el-form-item>

              <el-form-item label="可抢单量" prop="tin7">
                <div style="width: 215px" class="flex_b">
                  <el-input
                    v-model="queryParams.tin7"
                    placeholder=""
                    clearable
                    size="small"
                    style="width:100px;"
                    @keyup.enter.native="handleQuery"
                  />
                  <span>-</span>
                  <el-form-item prop="tin8">
                    <el-input
                      v-model="queryParams.tin8"
                      placeholder=""
                      clearable
                      size="small"
                      style="width:100px;"
                      @keyup.enter.native="handleQuery"
                    />
                  </el-form-item>
                </div>
              </el-form-item>

              <el-form-item :label="' '" prop="tin9">
                <el-checkbox v-model="queryParams.tin9">是否竞价</el-checkbox>
              </el-form-item>
              <el-form-item prop="tin10">
                <el-checkbox v-model="queryParams.tin10">是否隐藏</el-checkbox>
              </el-form-item>

              <el-form-item class="fr">
                <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                <el-button type="primary" plain icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
              </el-form-item>
            </el-form>

            <el-row :gutter="10" class="mb8">
              <el-col v-if="false" :span="1.5">
                <el-button
                  v-hasPermi="['system:test:export']"
                  type="warning"
                  icon="el-icon-download"
                  size="mini"
                  @click="handleExport"
                >导出</el-button>
              </el-col>
              <el-col :span="1.5" style="marginTop:-5px">
                <tablec-cascader v-model="tableColumnsConfig" />
              </el-col>
              <right-toolbar :show-search.sync="showSearch" @queryTable="getList" />
            </el-row>

            <RefactorTable :loading="loading" :data="list" :table-columns-config="tableColumnsConfig" @selection-change="handleSelectionChange">
              <template #tin1="{row}">
                <span>{{ row.tin1 }}</span>
              </template>
              <template #tin2="{row}">
                <span>{{ row.tin2 }}</span>
              </template>
              <template #edit="{row}">
                <el-button
                  v-hasPermi="['system:menu:verify']"
                  size="mini"
                  type="text"
                  icon="el-icon-edit"
                  @click="handleVerify(row)"
                >审核</el-button>
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
        </el-card>
      </el-col>
    </el-row>



    <!-- 添加或修改【请填写功能名称】对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="货源单号" prop="tin1">
          <el-input v-model="form.tin1" placeholder="请输入货源单号" disabled />
        </el-form-item>
        <el-form-item label="货主报价" prop="tin2">
          <el-input v-model="form.tin2" placeholder="请输入货主报价" disabled />
        </el-form-item>
        <el-form-item label="审核单价" prop="tin3">
          <el-input v-model="form.tin3" placeholder="请输入审核单价" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getExamineOrder } from '@/api/order/verify';

const tableColumnsConfig = [
  {
    prop: 'tin1',
    isShow: true,
    label: '货源单号',
    fixed: 'left'
  },
  {
    prop: 'tin2',
    isShow: true,
    label: '装货地址'
  }, {
    prop: 'tin3',
    isShow: true,
    label: '收货地址',
    width: 130,
    tooltip: true
  }, {
    prop: 'tin4',
    isShow: true,
    label: '货物类型'
  }, {
    prop: 'tin5',
    isShow: true,
    label: '单价'
  },
  {
    prop: 'edit',
    isShow: true,
    label: '操作',
    width: 180,
    fixed: 'right'
  }
];


export default {
  name: 'Testlog',
  data() {
    return {
      // 树形数据
      data: [],

      // 遮罩层
      loading: false,
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
      // 是否显示弹出层
      open: false,
      // 类型数据字典
      typeOptions: [],
      // 类型数据字典
      statusOptions: [],
      // 日期范围
      dateRange: [],
      // 表单参数
      form: {},
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        tin1: '',
        tin2: '',
        tin3: '',
        tin4: '',
        tin5: '',
        tin6: [],
        tin7: '',
        tin8: '',
        tin9: false,
        tin10: false
      },
      // 弹框title
      title: '',
      // 表头动态值
      tableColumnsConfig
    };
  },
  created() {
    // 先准备好表头(可以获取数据)
    this.tableColumnsConfig = this.getLocalStorage(this.$route.name) || this.tableColumnsConfig;
    this.getList();
  },
  methods: {
    /** 查询【请填写功能名称】列表 */
    getList() {
      this.loading = true;
      console.log(this.queryParams);

      getExamineOrder(this.queryParams).then(response => {
        console.log(response);

        this.list = response.data.list;
        this.total = response.data.total;
        this.loading = false;
      }).catch(() => {
        // s假数据
        this.list = [{
          tin1: '44444',
          tin2: '44444',
          tin3: '44444',
          tin4: '44444',
          tin5: '44444'
        }];
        this.total = 10;
        // e
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {};
      this.resetForm('form');
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
      this.ids = selection.map(item => item.testId);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },

    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          console.log(this.form, '提交审核');

          // this.msgSuccess('修改成功');
          // this.open = false;
          // this.getList();
        }
      });
    },

    /** 导出按钮操作 */
    handleExport() {
      this.download('system/test/export', {
        ...this.queryParams
      }, `system_test.xlsx`);
    },
    /** 审核按钮操作 */
    handleVerify(row) {
      this.form = row;
      console.log(row);

      // this.reset();
      this.open = true;
      this.title = '价格调整';
    }
  }
};
</script>


<style scoped lang='scss'>
.card-rigth{
  position: relative;
  margin: 0 15px 15px;
  overflow-y: auto;
  height: calc(100vh - 145px);
}
.card-left{
  position: relative;
  margin-left: 15px;
  margin-bottom: 15px;
  height: calc(100vh - 145px);
}
.left_v{
  position: absolute;
  width: 3px;
  height: 20px;
  left: 0;
  top: 14px;
  background-color: #1890ff;
}

.flex_b{
    display: flex;
    justify-content: space-between;
}

</style>
