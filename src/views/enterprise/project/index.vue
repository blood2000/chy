<template>
  <div>
    <div v-show="showSearch" class="app-container app-container--search">
      <el-form ref="queryForm" :model="queryParams" :inline="true" label-width="68px">
        <el-form-item label="项目名称" prop="projectName">
          <el-input
            v-model.trim="queryParams.projectName"
            placeholder="请输入项目名称"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <!-- <el-form-item label="货物大类" prop="commodityCategoryCode">
          <el-select
            v-model="queryParams.commodityCategoryCode"
            placeholder="请选择货物大类"
            clearable
            filterable
            size="small"
          >
            <el-option
              v-for="dict in commodityCategoryCodeOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            />
          </el-select>
        </el-form-item>-->
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
            v-hasPermi="['assets:shipment:project:add']"
            type="primary"
            icon="el-icon-plus"
            size="mini"
            @click="handleAdd"
          >新增</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            v-hasPermi="['assets:shipment:project:edit']"
            type="success"
            icon="el-icon-edit"
            size="mini"
            :disabled="single"
            @click="handleUpdate"
          >修改</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            v-hasPermi="['assets:shipment:project:remove']"
            type="danger"
            icon="el-icon-delete"
            size="mini"
            :disabled="multiple"
            @click="handleDelete"
          >删除</el-button>
        </el-col>
        <!-- <el-col :span="1.5">
        <el-button
          v-hasPermi="['enterprise:project:export']"
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
        >导出</el-button>
      </el-col>-->
        <el-col :span="1.5" style="float: right;">
          <tablec-cascader v-model="tableColumnsConfig" :lcokey="api" />
        </el-col>
        <right-toolbar :show-search.sync="showSearch" @queryTable="getList" />
      </el-row>

      <!-- 别的地方调用这个页面, 特殊处理表格 // 7/9 chj 调用这个组件添加了 -->
      <div v-if="iscomponent" style="width:100%;">
        <el-radio-group v-model="tinRadio" style="width:100%;" @change="handleRadioChange">
          <RefactorTable :loading="loading" :data="infoList" height="350px" :table-columns-config="tableColumnsConfig" is-show-index>
            <template #tRadio="{row}">
              <el-radio :label="row"><span>&nbsp;</span></el-radio>
            </template>

            <template #edit="{row}">
              <el-button
                v-hasPermi="['assets:shipment:project:edit']"
                size="mini"
                type="text"
                @click="handleUpdate(row)"
              >修改</el-button>
              <el-button
                v-hasPermi="['assets:shipment:project:remove']"
                size="mini"
                type="text"
                @click="handleDelete(row)"
              >删除</el-button>
            </template>
          </RefactorTable>
        </el-radio-group>
      </div>

      <RefactorTable v-else :loading="loading" :data="infoList" :table-columns-config="tableColumnsConfig" @selection-change="handleSelectionChange">
        <!-- <template #commodityCategoryCode="{row}">
          <span>{{ selectDictLabel(commodityCategoryCodeOptions, row.commodityCategoryCode) }}</span>
        </template> -->
        <!-- <template #createTime="{row}">
          <span>{{ parseTime(row.createTime, '{y}-{m}-{d}') }}</span>
        </template>
        <template #updateTime="{row}">
          <span>{{ parseTime(row.updateTime, '{y}-{m}-{d}') }}</span>
        </template> -->
        <template #edit="{row}">
          <el-button
            v-hasPermi="['assets:shipment:project:edit']"
            size="mini"
            type="text"
            @click="handleUpdate(row)"
          >修改</el-button>
          <el-button
            v-hasPermi="['assets:shipment:project:remove']"
            size="mini"
            type="text"
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

      <!-- 新增/修改/详情 对话框 -->
      <project-dialog
        ref="ProjectDialog"
        :title="title"
        :open.sync="open"
        :shipment="shipmentCode"
        :company="companyCode"
        :company-code="companyCode"
        :user-code="userCode"
        :show-shipment="true"
        :org-type="orgType"
        @refresh="getList"
      />
    </div>
  </div>
</template>

<script>
import { listInfo, getInfo, delInfo, listInfoApi } from '@/api/enterprise/project';
import ProjectDialog from './projectDialog';

export default {
  name: 'Project',
  components: {
    ProjectDialog
  },
  props: {
    iscomponent: [Boolean], // 7/9 chj 调用这个组件添加了
    shipmentCode: {
      type: String,
      default: null
    },
    companyCode: {
      type: String,
      default: null
    },
    userCode: {
      type: String,
      default: null
    },
    showShipment: {
      type: Boolean
    },
    orgType: {
      type: Number,
      default: 2
    }
  },
  data() {
    return {
      tinRadio: undefined, // 7/9 chj 调用这个组件添加了
      tableColumnsConfig: [],
      // api: listInfoApi,
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      names: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 项目表格数据
      infoList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 项目名称字典
      projectNameOptions: [],
      // 商品类别编码字典
      commodityCategoryCodeOptions: [],
      // 商品小类字典
      // commoditySubclassCodesOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        orderByColumn: 't0.id',
        isAsc: 'desc',
        projectName: undefined,
        commodityCategoryCode: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      },
      // 表单是否禁用
      // formDisable: false
      // 大类字典类型
      commodityCategory: {
        'dictPid': '0',
        'dictType': 'goodsType'
      },
      // 小类字典类型
      commoditySubclass: {
        'dictPid': '',
        'dictType': 'goodsType'
      }
    };
  },

  computed: { // 7/9 chj 调用这个组件添加了
    api() {
      return this.iscomponent ? listInfoApi + '--iscomponent' : listInfoApi;
    }
  },

  watch: {
    '$route.query.project': {
      handler(value) {
        if (value) {
          this.$nextTick(() => {
            this.handleAdd();
          });
        }
      },
      immediate: true
    }
  },
  created() {
    this.tableHeaderConfig(this.tableColumnsConfig, this.api, {
      prop: 'edit',
      isShow: true,
      label: '操作',
      width: 180,
      fixed: 'left'
    }, this.iscomponent ? [ // 7/9 chj 调用这个组件添加了
      {
        prop: 'tRadio',
        isShow: true,
        width: 50,
        sortNum: 0,
        tooltip: false,
        label: ''
      },
      {
        prop: 'edit',
        isShow: true,
        label: '操作',
        sortNum: 10,
        fixed: ''
      }
    ] : []);
    this.getList();
    this.listByDict(this.commodityCategory).then(response => {
      this.commodityCategoryCodeOptions = response.data;
    });
  },
  methods: {
    /** 查询项目列表 */
    getList() {
      this.loading = true;
      // 修改：只需要传货主编码，无货主编码时，后端自主判断
      if (this.shipmentCode) {
        this.queryParams.shipmentCode = this.shipmentCode;
      }
      /** if (this.companyCode) {
        this.queryParams.companyCode = this.companyCode;
      } else if (this.shipmentCode) {
        this.queryParams.shipmentCode = this.shipmentCode;
      }**/
      listInfo(this.queryParams).then(response => {
        this.infoList = response.rows;
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
      this.resetForm('queryForm');
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id);
      this.names = selection.map(item => item.projectName);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    // 单选框选中数据
    handleRadioChange(radioVal) {
      // console.log(radioVal);
      this.$emit('selected', radioVal);
      const selection = [radioVal];
      this.ids = selection.map(item => item.id);
      this.names = selection.map(item => item.projectName);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.$refs.ProjectDialog.reset();
      this.open = true;
      this.title = '添加项目';
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.$refs.ProjectDialog.reset();
      const id = row.id || this.ids;
      getInfo(id).then(response => {
        this.$refs.ProjectDialog.setForm(response.data);
        this.open = true;
        this.title = '修改项目';
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      const names = row.projectName || this.names;
      this.$confirm('是否确认删除项目名称为"' + names + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return delInfo(ids);
      }).then((data) => {
        this.getList();
        this.msgSuccess(data.msg);
      });
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('system/info/export', {
        ...this.queryParams
      }, `项目管理`);
    }
  }
};
</script>
