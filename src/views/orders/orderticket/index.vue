<template>
  <div>
    <div class="app-container">
      <el-form v-show="showSearch" ref="queryForm" size="small" :model="queryParams" :inline="true" label-width="68px">
        <el-form-item label="货源单号" prop="orderNo">
          <el-input
            v-model="queryParams.orderNo"
            placeholder="请输入货源单号"
            clearable
            style="width: 228px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>

        <el-form-item
          label="票制"
          prop="ticket"
        >
          <el-select v-model="queryParams.ticket" placeholder="请选择票制" style="width: 228px" @change="handleQuery">
            <el-option
              v-for="item in assetsTicketType"
              :key="item.dictValue"
              :label="item.dictLabel"
              :value="item.dictValue"
            />
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
          <el-button type="primary" plain icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="app-container">
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button
            v-hasPermi="['transportation:orderTicketRel:add']"
            type="primary"
            icon="el-icon-plus"
            size="mini"
            @click="handleAdd"
          >新增</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            v-hasPermi="['transportation:orderTicketRel:update']"
            type="success"
            icon="el-icon-edit"
            size="mini"
            :disabled="single"
            @click="handleUpdate()"
          >修改</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            v-hasPermi="['transportation:orderTicketRel:del']"
            type="danger"
            icon="el-icon-delete"
            size="mini"
            :disabled="multiple"
            @click="handleDelete()"
          >删除</el-button>
        </el-col>
        <!-- <el-col :span="1.5">
          <el-button
            v-hasPermi="['system:test:export']"
            type="warning"
            icon="el-icon-download"
            size="mini"
            @click="handleExport"
          >导出</el-button>
        </el-col> -->
        <right-toolbar :show-search.sync="showSearch" @queryTable="getList" />
      </el-row>

      <RefactorTable
        is-show-index
        :loading="loading"
        :data="ticketList"
        row-key="id"
        :table-columns-config="tableColumnsConfig"
        @selection-change="handleSelectionChange"
      >
        <template #ticket="{row}">
          <span>{{ selectDictLabel(assetsTicketType, row.ticket) }}</span>
        </template>

        <template #edit="{row}">
          <el-button
            v-hasPermi="['transportation:orderTicketRel:update']"
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(row)"
          >修改</el-button>
          <el-button
            v-hasPermi="['transportation:orderTicketRel:del']"
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(row)"
          >删除</el-button>
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

    <!-- 添加或修改货源票制对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body :close-on-click-modal="false">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px" size="small">
        <el-form-item label="货源单号" prop="orderNo">
          <el-input
            v-model="form.orderNo"
            placeholder="请输入货源单号"
            clearable
            :disabled="form.id"
            style="width: 228px"
          />
        </el-form-item>

        <el-form-item
          label="票制"
          prop="ticket"
        >
          <el-select v-model="form.ticket" placeholder="请选择票制" style="width: 228px">
            <el-option
              v-for="item in assetsTicketType"
              :key="item.dictValue"
              :label="item.dictLabel"
              :value="item.dictValue"
            />
          </el-select>
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
import { listOrderTicketRel, addOrderTicketRel, updateOrderTicketRel, delOrderTicketRel } from '@/api/order/orderticket';
import { getLocalStorage } from '@/utils/auth';

export default {
  name: 'Orderticket',
  components: {
  },
  data() {
    return {
      // 遮罩层
      'loading': false,
      // 选中数组
      'ids': [],
      // 非单个禁用
      'single': true,
      // 非多个禁用
      'multiple': true,
      // 显示搜索条件
      'showSearch': true,
      // 总条数
      'total': 0,
      // 货源票制表格数据
      'ticketList': [],
      // 弹出层标题
      'title': '',
      // 是否显示弹出层
      'open': false,
      // 查询参数
      'queryParams': {
        'pageNum': 1,
        'pageSize': 10,
        orderNo: undefined,
        ticket: undefined
      },
      // 表单参数
      'form': {
        orderNo: undefined,
        ticket: undefined
      },
      // 表单校验
      'rules': {
        orderNo: [{ required: true, message: '请输入货源单号', trigger: 'blur' }],
        ticket: [{ required: true, message: '请选择票制', trigger: 'change' }]
      },

      // 新添加的
      tableColumnsConfig: [],
      tableColumns: [
        {
          isShow: true,
          label: '操作',
          prop: 'edit',
          sortNum: 0,
          tooltip: true
        },
        {
          isShow: false,
          label: 'id',
          prop: 'id',
          sortNum: 0,
          tooltip: true
        },
        {
          isShow: true,
          label: '货源单号',
          prop: 'orderNo',
          sortNum: 1,
          tooltip: true
        },
        {
          isShow: true,
          label: '票制',
          prop: 'ticket',
          sortNum: 2,
          tooltip: true
        }

      ],
      // 字段值
      assetsTicketType: [],
      // 选择
      selection: []
    };
  },

  computed: {
    api() {
      return '/transportation/orderTicketRel/list';
    }
  },
  created() {
    this.tabColInit();
    this.getList();
  },
  methods: {

    /** 初始化表头 */
    tabColInit() {
      const tabCol = getLocalStorage(this.api);
      this.tableColumnsConfig = tabCol || this.tableColumns;

      this.getDicts('assets_ticket_type').then(response => {
        this.assetsTicketType = response.data;
      });
    },

    /** 查询货源票制列表 */
    getList() {
      this.loading = true;
      listOrderTicketRel(this.queryParams).then(response => {
        this.ticketList = response.data.list;
        this.total = response.data.total;
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
      this.form = {
        id: undefined,
        orderNo: undefined,
        ticket: undefined
      };
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
      this.selection = selection;
      this.ids = selection.map(item => item.id);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = '添加货源票制';
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      //   const id = row.id || this.ids;
      //   getTest(id).then(response => {
      //     this.form = response.data;
      //     this.open = true;
      //     this.title = '修改货源票制';
      //   });


      const selection = row || this.selection[0];

      this.form = JSON.parse(JSON.stringify(selection));
      this.open = true;
      this.title = '修改货源票制';
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.id || this.form.id != null) {
            updateOrderTicketRel(this.form).then(response => {
              this.msgSuccess('修改成功');
              this.open = false;
              this.getList();
            });
          } else {
            addOrderTicketRel(this.form).then(response => {
              this.msgSuccess('新增成功');
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = (row && row.id) || this.ids;
      this.$confirm('是否确认删除此项数据?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return delOrderTicketRel(ids);
      }).then(() => {
        this.getList();
        this.msgSuccess('删除成功');
      });
    }
    /** 导出按钮操作 */
    // handleExport() {
    //   this.download('system/test/export', {
    //     ...this.queryParams
    //   }, `system_test`);
    // }
  }
};
</script>
