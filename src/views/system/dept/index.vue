<template>
  <div class="app-container">
    <el-form v-show="showSearch" ref="queryForm" :model="queryParams" :inline="true">
      <el-form-item label="组织名称" prop="orgName">
        <el-input
          v-model="queryParams.orgName"
          placeholder="请输入组织名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="组织状态" clearable filterable size="small">
          <el-option
            v-for="dict in statusOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="cyan" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['system:dept:add']"
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
        >新增</el-button>
      </el-col>
      <right-toolbar :show-search.sync="showSearch" @queryTable="getList" />
    </el-row>

    <el-table
      v-loading="loading"
      :data="deptList"
      row-key="id"
      default-expand-all
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column prop="orgName" label="组织名称" width="400" />
      <el-table-column prop="orgType" label="类型" width="100">
        <template slot-scope="scope">
          <span>{{ selectDictLabel(orgTypeOptions, scope.row.orgType) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="orderNum" label="排序" width="200" />
      <el-table-column prop="status" label="状态" :formatter="statusFormat" width="100" />
      <el-table-column label="创建时间" align="center" prop="createTime" width="200">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            v-hasPermi="['system:dept:edit']"
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
          >修改</el-button>
          <el-button
            v-hasPermi="['system:dept:add']"
            size="mini"
            type="text"
            icon="el-icon-plus"
            @click="handleAdd(scope.row)"
          >新增</el-button>
          <el-button
            v-if="scope.row.parentId != 0"
            v-hasPermi="['system:dept:remove']"
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加或修改部门对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="80%" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-row>
          <el-col v-if="form.parentId !== 1" :span="24">
            <el-form-item label="上级组织" prop="parentId">
              <treeselect v-model="form.parentId" :options="deptOptions" :normalizer="normalizer" placeholder="选择上级组织" />
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="组织名称" prop="orgName">
              <el-input v-model="form.orgName" placeholder="请输入组织名称" />
            </el-form-item>
          </el-col>
          <!--  <el-col :span="12">
            <el-form-item label="负责人" prop="leader">
              <el-input v-model="form.leader" placeholder="请输入负责人" maxlength="20" />
            </el-form-item>
          </el-col>-->
          <el-col :span="7">
            <el-form-item label="组织类型">
              <el-radio-group v-model="form.orgType">
                <el-radio
                  v-for="dict in orgTypeOptions"
                  :key="dict.dictValue"
                  :label="dict.dictValue"
                >{{ dict.dictLabel }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="组织状态">
              <el-radio-group v-model="form.status">
                <el-radio
                  v-for="dict in statusOptions"
                  :key="dict.dictValue"
                  :label="dict.dictValue"
                >{{ dict.dictLabel }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="2">
            <el-form-item label="显示排序" prop="orderNum">
              <el-input-number v-model="form.orderNum" controls-position="right" :min="0" />
            </el-form-item>
          </el-col>
          <template v-if="form.orgType == '1'">
            <el-col :span="12">
              <el-form-item label="法人姓名" prop="artificialName">
                <el-input v-model="form.artificialName" placeholder="请输入法人姓名" class="width90" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="法人身份证" prop="artificialIdentificationNumber">
                <el-input v-model="form.artificialIdentificationNumber" placeholder="请输入法人身份证" class="width90" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="统一社会信用代码" prop="organizationCodeNo" :rules="[{ required: true, message: '统一社会信用代码不能为空', trigger: 'blur' }]">
                <el-input v-model="form.organizationCodeNo" placeholder="请输入统一社会信用代码" class="width90" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="营业执照号" prop="businessLicenseNo">
                <el-input v-model="form.businessLicenseNo" placeholder="请输入营业执照号" class="width90" clearable />
              </el-form-item>
            </el-col>
          </template>
        </el-row>
        <template v-if="form.orgType == '1'">
          <el-row>
            <el-col :span="6" class="mt">
              <p class="upload-image-label">法人身份证正面照</p>
              <upload-image v-model="form.artificialIdentificationImg" />
            </el-col>
            <el-col :span="6" class="mt">
              <p class="upload-image-label">法人身份证背面照</p>
              <upload-image v-model="form.artificialIdentificationBackImg" />
            </el-col>
            <el-col :span="6" class="mt">
              <p class="upload-image-label">法人手持身份证照</p>
              <upload-image v-model="form.artificialIdentificationInhandImg" />
            </el-col>
            <el-col :span="6" class="mt">
              <p class="upload-image-label">营业执照照</p>
              <upload-image v-model="form.businessLicenseImg" />
            </el-col>
          </el-row>
          <el-row style="margin-top: 10px">
            <el-col :span="12">
              <el-form-item label="是否冻结" prop="isFreezone">
                <el-select
                  v-model="form.isFreezone"
                  clearable
                  filterable
                  class="width90"
                >
                  <el-option
                    v-for="dict in isFreezoneOptions"
                    :key="dict.dictValue"
                    :label="dict.dictLabel"
                    :value="dict.dictValue"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <template v-if="form.ticketType == '2'">
              <el-form-item label="服务费税率(%)" prop="serviceRate" :rules="[{ required: true, message: '服务费税率不能为空', trigger: 'blur' }]">
                <el-input-number v-model="form.serviceRate" controls-position="right" :precision="2" placeholder="请输入服务费税率" :step="1" :min="0" :max="100" class="width90" clearable />
              </el-form-item>
            <!-- <el-form-item label="服务费比例(%)" prop="serviceRatio"  :rules="[{ required: true, message: '服务费比例不能为空', trigger: 'blur' }]" >
               <el-input-number v-model="form.serviceRatio" controls-position="right" :precision="2" placeholder="请输入服务费比例" :step="1" :min="0" :max="100" class="width90" clearable />
             </el-form-item>-->
            </template>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="税点(%)" prop="texPoint">
                  <el-input-number v-model="form.texPoint" controls-position="right" :precision="2" placeholder="请输入税点" :step="1" :min="0" :max="100" clearable @input="changeTextPoint" />
                </el-form-item>
              </el-col>
              <el-col :span="10">
                <el-form-item label="调度费点数(%)" prop="dispatchPoints">
                  <el-input v-model="form.dispatchPoints" disabled placeholder="请输入调度费点数" clearable />
                </el-form-item>
              </el-col>
            </el-row>
            <el-col :span="12">
              <el-form-item label="货源是否审核" prop="supplyIsAuth">
                <el-select
                  v-model="form.supplyIsAuth"
                  clearable
                  filterable
                  class="width90"
                >
                  <el-option
                    v-for="dict in isOptions"
                    :key="dict.dictValue"
                    :label="dict.dictLabel"
                    :value="dict.dictValue"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="是否独立核算" prop="isAccount">
                <el-select
                  v-model="form.isAccount"
                  clearable
                  filterable
                  class="width90"
                >
                  <el-option
                    v-for="dict in isOptions"
                    :key="dict.dictValue"
                    :label="dict.dictLabel"
                    :value="dict.dictValue"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <!-- <el-col :span="12">
            <el-form-item label="核算方式" prop="accountType">
              <el-select v-model="form.accountType" placeholder="请选择核算方式" filterable clearable class="width90">
                <el-option
                  v-for="dict in accountTypeOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                />
              </el-select>
            </el-form-item>
          </el-col>-->
            <el-col :span="12">
              <el-form-item label="调度费点数" prop="dispatchPoints">
                <el-input v-model="form.dispatchPoints" placeholder="请输入调度费点数" clearable class="width90" />
              </el-form-item>
            </el-col>
            <!-- <el-col :span="6">
            <el-form-item label="是否抹零" prop="isWipe">
              <el-select
                v-model="form.isWipe"
                clearable
                filterable
                class="width60 mr3"
              >
                <el-option
                  v-for="dict in isOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                />
              </el-select>
            </el-form-item>
          </el-col>-->
            <el-col :span="6">
              <el-form-item label="请选择抹零方式">
                <el-select v-model="form.wipeType" placeholder="请选择抹零方式" filterable clearable class="width90">
                  <el-option
                    v-for="dict in wipeTypeOptions"
                    :key="dict.dictValue"
                    :label="dict.dictLabel"
                    :value="dict.dictValue"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <!--<el-col :span="24">
            <el-form-item label="是否开启合理路耗">
              <el-select
                v-model="form.isConsumption"
                clearable
                filterable
                class="width28 mr3"
              >
                <el-option
                  v-for="dict in isOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                />
              </el-select>
              <el-select
                v-model="form.consumptionUnit"
                filterable
                clearable
                class="width28 mr3"
                placeholder="路耗单位"
              >
                <el-option
                  v-for="dict in consumptionUnitOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                />
              </el-select>
              <el-input v-model="form.consumptionMin" placeholder="最小值" class="width12" />
              至
              <el-input v-model="form.consumptionMax" placeholder="最大值" class="width12" />
            </el-form-item>
          </el-col>-->
            <el-col :span="24">
              <el-form-item label="是否月结" prop="creditAmount">
                <el-select
                  v-model="form.isMonthly"
                  clearable
                  filterable
                  class="width28 mr3"
                >
                  <el-option
                    v-for="dict in isOptions"
                    :key="dict.dictValue"
                    :label="dict.dictLabel"
                    :value="dict.dictValue"
                  />
                </el-select>
                <el-input v-model="form.creditAmount" placeholder="授信金额(保留两位小数)" class="width28" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="是否预付运费" prop="isPrepaid">
                <el-select
                  v-model="form.isPrepaid"
                  clearable
                  filterable
                  class="width90"
                >
                  <el-option
                    v-for="dict in isOptions"
                    :key="dict.dictValue"
                    :label="dict.dictLabel"
                    :value="dict.dictValue"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </template>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listDept, getDept, delDept, addDept, updateDept, listDeptExcludeChild } from '@/api/system/dept';
import Treeselect from '@riophae/vue-treeselect';
import '@riophae/vue-treeselect/dist/vue-treeselect.css';
import UploadImage from '@/components/UploadImage/index';

export default {
  name: 'Dept',
  components: { Treeselect, UploadImage },
  props: {
    companyCode: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 显示搜索条件
      showSearch: true,
      // 表格树数据
      deptList: [],
      // 部门树选项
      deptOptions: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 状态数据字典
      statusOptions: [],
      // 查询参数
      queryParams: {
        orgName: undefined,
        status: undefined
      },
      // 是否冻结字典
      isFreezoneOptions: [
        { dictLabel: '正常', dictValue: 0 },
        { dictLabel: '冻结', dictValue: 1 }
      ],
      // 票制类别字典
      ticketTypeOptions: [],
      // 是否字典
      isOptions: [
        { dictLabel: '否', dictValue: 0 },
        { dictLabel: '是', dictValue: 1 }
      ],
      orgTypeOptions: [
        { dictLabel: '普通组织', dictValue: 2 },
        { dictLabel: '发货企业', dictValue: 1 }
      ],
      // 核算方式字典
      accountTypeOptions: [],
      // 抹零方式字典
      wipeTypeOptions: [],
      // 路耗单位字典
      consumptionUnitOptions: [],
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        parentId: [
          { required: true, message: '上级组织不能为空', trigger: 'blur' }
        ],
        orgName: [
          { required: true, message: '组织名称不能为空', trigger: 'blur' }
        ],
        orderNum: [
          { required: true, message: '菜单顺序不能为空', trigger: 'blur' }
        ]
      }
    };
  },
  created() {
    this.getList();
    this.getDictsOptions();
  },
  methods: {
    changeTextPoint(value) {
      if (this.form.ticketType === '1') { // 一票制：调度费点数=原来的『税点(%) 』备注：运单结算使用的比例
        this.$set(this.form, 'dispatchPoints', value);
      } else if (this.form.ticketType === '2') { // 二票制：服务费税率(%)、调度费点数=原来的『服务费比例』备注：运单结算使用的比例
        this.$set(this.form, 'dispatchPoints', value);
        this.$set(this.form, 'serviceRatio', value);
      } else if (this.form.ticketType === '3') { // 非一票制：调度费点数=原来的『税点(%) 』备注：运单结算使用的比例是「合同税点/（1-合同税点）」
        this.$set(this.form, 'dispatchPoints', ((value / (100 - value)) * 100).toFixed(2));
      }
    },
    changeTicketType(value) {
      if (value === '1') { // 一票制：调度费点数=原来的『税点(%) 』备注：运单结算使用的比例
        this.$set(this.form, 'dispatchPoints', this.form.texPoint);
      } else if (value === '2') { // 二票制：服务费税率(%)、调度费点数=原来的『服务费比例』备注：运单结算使用的比例
        this.$set(this.form, 'dispatchPoints', this.form.texPoint);
        this.$set(this.form, 'serviceRatio', this.form.texPoint);
      } else if (value === '3') { // 非一票制：调度费点数=原来的『税点(%) 』备注：运单结算使用的比例是「合同税点/（1-合同税点）」
        this.$set(this.form, 'dispatchPoints', ((this.form.texPoint / (100 - this.form.texPoint)) * 100).toFixed(2));
      }
    },
    /** 查询字典 */
    getDictsOptions() {
      // 核算规则
      /* this.getDicts('balance_rule').then((response) => {
        this.accountTypeOptions = response.data;
      }); */
      // 票制类别
      this.getDicts('assets_ticket_type').then((response) => {
        this.ticketTypeOptions = response.data;
      });
      // 合理路耗计量单位
      /* this.getDicts('consumption_unit').then((response) => {
        this.consumptionUnitOptions = response.data;
      }); */
      // 抹零方式
      /* this.getDicts('wipe_type').then((response) => {
        this.wipeTypeOptions = response.data;
      });*/
      this.getDictsByType({ dictType: 'sys_normal_disable', dictPid: '0' }).then(response => {
        this.statusOptions = response.data;
      });
    },
    /** 查询部门列表 */
    getList() {
      this.loading = true;
      if (this.companyCode) {
        this.queryParams.orgCode = this.companyCode;
      }
      listDept(this.queryParams).then(response => {
        this.deptList = this.handleTree(response.data, 'id');
        this.loading = false;
      });
    },
    /** 转换部门数据结构 */
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.id,
        label: node.orgName,
        children: node.children
      };
    },
    // 字典状态字典翻译
    statusFormat(row, column) {
      return this.selectDictLabel(this.statusOptions, row.status);
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
        code: undefined,
        parentId: 0,
        orgName: undefined,
        orderNum: undefined,
        leader: undefined,
        status: '0'
      };
      this.resetForm('form');
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm('queryForm');
      this.handleQuery();
    },
    /** 新增按钮操作 */
    handleAdd(row) {
      this.reset();
      if (row !== undefined) {
        this.form.parentId = row.id;
      }
      this.open = true;
      this.title = '添加组织';
      if (this.companyCode) {
        this.queryParams.orgCode = this.companyCode;
      }
      listDept(this.queryParams).then(response => {
	      this.deptOptions = this.handleTree(response.data, 'id');
      });
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      getDept(row.id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = '修改组织';
      });
      listDeptExcludeChild(row.id).then(response => {
	        this.deptOptions = this.handleTree(response.data, 'id');
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.id !== undefined) {
            updateDept(this.form).then(response => {
              this.msgSuccess('修改成功');
              this.open = false;
              this.getList();
            });
          } else {
            addDept(this.form).then(response => {
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
      this.$confirm('是否确认删除名称为"' + row.orgName + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return delDept(row.id);
      }).then(() => {
        this.getList();
        this.msgSuccess('删除成功');
      });
    }
  }
};
</script>
<style scoped>
  .mr3{
    margin-right: 3%;
  }
  .mt{
    margin-top: 22px;
  }
  .width90{
    width: 90%;
  }
  .width70{
    width: 70%;
  }
  .width60{
    width: 60%;
  }
  .width28{
    width: 28%;
  }
  .width12{
    width: 12%;
  }
  /* 计数器样式 */
  .el-input-number ::v-deep.el-input__inner{
    text-align: left;
  }
  /* 上传图片文字样式 */
  .upload-image-label{
    margin: 0;
    line-height: 24px;
  }
</style>
