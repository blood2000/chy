<template>
  <div>
    <div v-show="showSearch" class="app-container app-container--search">
      <el-form ref="queryForm" :model="queryParams" :inline="true" label-width="80px">
        <el-form-item label="设备类型" prop="typeCode">
          <el-select
            v-model="queryParams.typeCode"
            clearable
            filterable
            size="small"
            style="width: 240px"
          >
            <el-option
              v-for="dict in typeCodeOptions"
              :key="dict.code"
              :label="dict.typeName"
              :value="dict.code"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="中文名称" prop="fieldCnname">
          <el-input
            v-model="queryParams.fieldCnname"
            placeholder="请输入中文名称"
            clearable
            size="small"
            style="width: 240px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="英文名称" prop="fieldEnname">
          <el-input
            v-model="queryParams.fieldEnname"
            placeholder="请输入英文名称"
            clearable
            size="small"
            style="width: 240px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="映射字段" prop="fieldMappingName">
          <el-input
            v-model="queryParams.fieldMappingName"
            placeholder="请输入映射字段"
            clearable
            size="small"
            style="width: 240px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="是否必填" prop="isRequire">
          <el-select
            v-model="queryParams.isRequire"
            clearable
            filterable
            size="small"
            style="width: 240px"
          >
            <el-option
              v-for="dict in isRequireOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="是否展示" prop="isShow	">
          <el-select
            v-model="queryParams.isShow"
            clearable
            filterable
            size="small"
            style="width: 240px"
          >
            <el-option
              v-for="dict in isOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            />
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="字段类型" prop="fieldType">
          <el-select
            v-model="queryParams.fieldType"
            clearable
            filterable
            size="small"
            style="width: 240px"
          >
            <el-option
              v-for="dict in fieldTypeOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            />
          </el-select>
        </el-form-item> -->
        <!-- <el-form-item label="表单类型" prop="fieldFormType">
          <el-select
            v-model="queryParams.fieldFormType"
            clearable
            filterable
            size="small"
            style="width: 240px"
          >
            <el-option
              v-for="dict in fieldFormTypeOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            />
          </el-select>
        </el-form-item> -->
        <!-- <el-form-item label="数据类型" prop="fieldAttribute">
          <el-select
            v-model="queryParams.fieldAttribute"
            clearable
            filterable
            size="small"
            style="width: 240px"
          >
            <el-option
              v-for="dict in fieldAttributeOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            />
          </el-select>
        </el-form-item> -->
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
            type="primary"
            icon="el-icon-plus"
            size="mini"
            @click="handleAdd"
          >新增</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="success"
            icon="el-icon-edit"
            size="mini"
            :disabled="single"
            @click="handleUpdate"
          >修改</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            :disabled="multiple"
            @click="handleDelete"
          >删除</el-button>
        </el-col>
        <!-- <el-col :span="1.5">
          <el-button
            type="warning"
            icon="el-icon-download"
            size="mini"
            :loading="exportLoading"
            @click="handleExport"
          >导出</el-button>
        </el-col> -->
        <right-toolbar :show-search.sync="showSearch" @queryTable="getList" />
      </el-row>

      <el-table v-loading="loading" highlight-current-row border :data="deviceList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="中文名称" align="center" prop="fieldCnname" width="120" />
        <el-table-column label="英文名称" align="center" prop="fieldEnname" />
        <el-table-column label="映射字段" align="center" prop="fieldMappingName" />
        <el-table-column label="字段类型" align="center" prop="fieldType" :formatter="fieldTypeFormat" />
        <el-table-column label="表单类型" align="center" prop="fieldFormType" :formatter="fieldFormTypeFormat" />
        <el-table-column label="字段排序" align="center" prop="fieldSort" />
        <el-table-column label="数据类型" align="center" prop="fieldAttribute" :formatter="fieldAttributeFormat" />
        <el-table-column label="小数点位数" align="center" prop="fieldDit" />
        <el-table-column label="数据长度" align="center" prop="fieldLength" />
        <el-table-column label="默认值" align="center" prop="defaultValue" />
        <el-table-column label="是否在列表显示" align="center" prop="isList">
          <template slot-scope="scope">
            <i v-if="scope.row.isList === 0" class="el-icon-success g-color-blue" />
            <i v-else class="el-icon-error g-color-gray" />
          </template>
        </el-table-column>
        <el-table-column label="是否作为查询字段" align="center" prop="isQuery">
          <template slot-scope="scope">
            <i v-if="scope.row.isQuery === 0" class="el-icon-success g-color-blue" />
            <i v-else class="el-icon-error g-color-gray" />
          </template>
        </el-table-column>
        <el-table-column label="是否只读" align="center" prop="isRead">
          <template slot-scope="scope">
            <i v-if="scope.row.isRead === 0" class="el-icon-success g-color-blue" />
            <i v-else class="el-icon-error g-color-gray" />
          </template>
        </el-table-column>
        <el-table-column label="是否必填" align="center" prop="isRequire">
          <template slot-scope="scope">
            <i v-if="scope.row.isRequire === 0" class="el-icon-success g-color-blue" />
            <i v-else class="el-icon-error g-color-gray" />
          </template>
        </el-table-column>
        <el-table-column label="是否展示" align="center" prop="isShow">
          <template slot-scope="scope">
            <i v-if="scope.row.isShow === 0" class="el-icon-success g-color-blue" />
            <i v-else class="el-icon-error g-color-gray" />
          </template>
        </el-table-column>
        <el-table-column label="备注" align="center" prop="fieldRemark" />
        <el-table-column label="创建时间" align="center" prop="createTime" width="160">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" fixed="left" width="120">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              @click="handleUpdate(scope.row)"
            >修改</el-button>
            <el-button
              size="mini"
              type="text"
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
    </div>

    <!-- 添加或修改（列表）设备类型对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body :close-on-click-modal="false">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px" style="width: 98%">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="中文名称" prop="fieldCnname">
              <el-input v-model="form.fieldCnname" placeholder="请输入中文名称" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="英文名称" prop="fieldEnname">
              <el-input v-model="form.fieldEnname" placeholder="请输入英文名称" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="映射字段" prop="fieldMappingName">
              <el-input v-model="form.fieldMappingName" placeholder="请输入映射字段" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="字段类型" prop="fieldType">
              <el-select
                v-model="form.fieldType"
                clearable
                filterable
                style="width: 100%"
              >
                <el-option
                  v-for="dict in fieldTypeOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="表单类型" prop="fieldFormType">
              <el-select
                v-model="form.fieldFormType"
                clearable
                filterable
                style="width: 100%"
              >
                <el-option
                  v-for="dict in fieldFormTypeOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="字段排序" prop="fieldSort">
              <el-input-number v-model="form.fieldSort" controls-position="right" :precision="0" :step="1" :min="0" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="数据类型" prop="fieldAttribute">
              <el-select
                v-model="form.fieldAttribute"
                clearable
                filterable
                style="width: 100%"
                @change="changeAttribute"
              >
                <el-option
                  v-for="dict in fieldAttributeOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col v-if="form.fieldAttribute === 3" :span="12">
            <el-form-item label="小数点位数" prop="fieldDit">
              <el-input-number v-model="form.fieldDit" controls-position="right" :precision="0" :step="1" :min="0" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="数据长度" prop="fieldLength">
              <el-input-number v-model="form.fieldLength" controls-position="right" :precision="0" :step="1" :min="0" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="默认值" prop="defaultValue">
              <el-input-number
                v-if="form.fieldAttribute === 2 || form.fieldAttribute === 3"
                v-model="form.defaultValue"
                controls-position="right"
                :precision="form.fieldAttribute === 2 ? 0 : form.fieldDit"
                :step="1"
                :min="0"
                style="width: 100%"
              />
              <el-date-picker
                v-else-if="form.fieldAttribute === 4"
                v-model="form.defaultValue"
                clearable
                type="datetime"
                placeholder="请选择默认值"
                style="width: 100%"
              />
              <el-input v-else v-model="form.defaultValue" placeholder="请输入默认值" clearable />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="" prop="isList">
              <el-checkbox v-model="form.isList">是否在列表显示</el-checkbox>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="" prop="isQuery">
              <el-checkbox v-model="form.isQuery">是否作为查询字段</el-checkbox>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="" prop="isRead">
              <el-checkbox v-model="form.isRead">是否只读项</el-checkbox>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="" prop="isRequire">
              <el-checkbox v-model="form.isRequire">是否必填项</el-checkbox>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="" prop="isShow">
              <el-checkbox v-model="form.isShow">是否展示</el-checkbox>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注" prop="fieldRemark">
              <el-input v-model="form.fieldRemark" type="textarea" placeholder="请输入备注" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="buttonLoading" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getDeviceTypeList, getDeviceFieldList, addDeviceField, updateDeviceField, getDeviceFieldDetail, delDriverField } from '@/api/assets/device.js';

export default {
  name: 'DeviceConfig',
  data() {
    return {
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
      // 表格数据
      deviceList: [],
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        typeCode: undefined,
        fieldCnname: undefined,
        fieldEnname: undefined,
        fieldMappingName: undefined,
        fieldAttribute: undefined,
        fieldType: undefined,
        fieldFormType: undefined
      },
      exportLoading: false,
      // 设备类型字典
      typeCodeOptions: [],
      // 当前查看的设备类型
      typeCode: undefined,
      // 表单类型字典
      fieldFormTypeOptions: [
        { dictLabel: '文本型', dictValue: 1 },
        { dictLabel: '只读型', dictValue: 2 },
        { dictLabel: '日期型', dictValue: 3 },
        { dictLabel: '下拉框型', dictValue: 4 },
        { dictLabel: '单选框型', dictValue: 5 },
        { dictLabel: '复选框型', dictValue: 6 }
      ],
      // 字段类型
      fieldTypeOptions: [
        { dictLabel: '设备字段', dictValue: 1 },
        { dictLabel: '扩展字段', dictValue: 2 },
        { dictLabel: '扩展元属性', dictValue: 3 }
      ],
      // 数据类型字典
      fieldAttributeOptions: [
        { dictLabel: '字符串型', dictValue: 1 },
        { dictLabel: '整数型', dictValue: 2 },
        { dictLabel: '小数型', dictValue: 3 },
        { dictLabel: '日期型', dictValue: 4 }
      ],
      // 是否在列表显示字典
      isListOptions: [
        { dictLabel: '显示', dictValue: 0 },
        { dictLabel: '不显示', dictValue: 1 }
      ],
      // 是否必填项
      isRequireOptions: [
        { dictLabel: '必填', dictValue: 0 },
        { dictLabel: '非必填', dictValue: 1 }
      ],
      // 是否字典
      isOptions: [
        { dictLabel: '是', dictValue: 0 },
        { dictLabel: '否', dictValue: 1 }
      ],
      // 新增/编辑（列表）
      title: '',
      open: false,
      buttonLoading: false,
      form: {},
      rules: {
        fieldCnname: [
          { required: true, message: '中文名称不能为空', trigger: ['blur', 'change'] }
        ],
        fieldMappingName: [
          { required: true, message: '映射字段不能为空', trigger: ['blur', 'change'] },
          { validator: (rule, value, callback) => {
            if (value === undefined || value === null || value === '') {
              callback();
            }
            const ptr_match = /^h([1-9]|[1-9][0-9]|100)$/;
            if (!ptr_match.test(value)) {
              callback(new Error('映射字段只能是h1-h100'));
            } else {
              callback();
            }
          }, trigger: ['change', 'blur'] }
        ],
        fieldType: [
          { required: true, message: '字段类型不能为空', trigger: ['blur', 'change'] }
        ],
        fieldFormType: [
          { required: true, message: '表单类型不能为空', trigger: ['blur', 'change'] }
        ],
        fieldAttribute: [
          { required: true, message: '数据类型不能为空', trigger: ['blur', 'change'] }
        ]
      }
    };
  },
  created() {
    this.getDeviceTypeOptions();
  },
  mounted() {
    this.typeCode = this.$route.params.code;
    this.queryParams.typeCode = this.$route.params.code;
    this.getList();
  },
  methods: {
    // 获取设备类型字典
    getDeviceTypeOptions() {
      getDeviceTypeList({}).then((response) => {
        this.typeCodeOptions = response.rows;
      });
    },
    // 表单类型字典翻译
    fieldFormTypeFormat(row, column) {
      return this.selectDictLabel(this.fieldFormTypeOptions, row.fieldFormType);
    },
    // 字段类型字典翻译
    fieldTypeFormat(row, column) {
      return this.selectDictLabel(this.fieldTypeOptions, row.fieldType);
    },
    // 数据类型字典翻译
    fieldAttributeFormat(row, column) {
      return this.selectDictLabel(this.fieldAttributeOptions, row.fieldAttribute);
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm('queryForm');
      this.typeCode = this.$route.params.code;
      this.queryParams.typeCode = this.$route.params.code;
      this.handleQuery();
    },
    /** 获取列表数据 */
    getList() {
      this.loading = true;
      getDeviceFieldList(this.queryParams).then((response) => {
        this.deviceList = response.rows;
        this.total = response.total;
        this.loading = false;
        this.typeCode = this.queryParams.typeCode;
      });
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.code);
      this.names = selection.map(item => item.fieldCnname);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.changeValueType();
      this.open = true;
      this.title = '添加设备属性';
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const ids = row.code || this.ids;
      getDeviceFieldDetail(ids).then(response => {
        this.form = response.data;
        this.changeValueType();
        this.open = true;
        this.title = '修改设备属性';
      });
    },
    /** 表单字段值处理 */
    changeValueType() {
      this.form.isList = this.praseNumToBoolean(this.form.isList);
      this.form.isQuery = this.praseNumToBoolean(this.form.isQuery);
      this.form.isRead = this.praseNumToBoolean(this.form.isRead);
      this.form.isRequire = this.praseNumToBoolean(this.form.isRequire);
      this.form.isShow = this.praseNumToBoolean(this.form.isShow);
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.code || this.ids;
      const names = row.fieldCnname || this.names;
      this.$confirm('是否确认删除设备属性名称为"' + names + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return delDriverField(ids);
      }).then(() => {
        this.getList();
        this.msgSuccess('删除成功');
      });
    },
    /** 导出按钮操作 */
    handleExport() {
      this.exportLoading = true;
      const params = Object.assign({}, this.queryParams);
      params.pageSize = undefined;
      params.pageNum = undefined;
      this.download('', params, `设备属性`).then(() => {
        this.exportLoading = false;
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          // 数据处理
          const params = { ...this.form };
          params.isList = this.praseBooleanToNum(params.isList);
          params.isQuery = this.praseBooleanToNum(params.isQuery);
          params.isRead = this.praseBooleanToNum(params.isRead);
          params.isRequire = this.praseBooleanToNum(params.isRequire);
          params.isShow = this.praseBooleanToNum(params.isShow);
          params.typeCode = this.typeCode;
          if (params.fieldAttribute === 4 && params.defaultValue && params.defaultValue !== '') {
            params.defaultValue = this.parseTime(params.defaultValue);
          }
          this.buttonLoading = true;
          if (params.code !== undefined) {
            updateDeviceField(params).then(response => {
              this.buttonLoading = false;
              this.msgSuccess('修改成功');
              this.open = false;
              this.getList();
            }).catch(() => {
              this.buttonLoading = false;
            });
          } else {
            addDeviceField(params).then(response => {
              this.buttonLoading = false;
              this.msgSuccess('新增成功');
              this.open = false;
              this.getList();
            }).catch(() => {
              this.buttonLoading = false;
            });
          }
        }
      });
    },
    cancel() {
      this.open = false;
      this.reset();
    },
    reset() {
      this.form = {
        code: undefined,
        defaultValue: undefined,
        fieldAttribute: undefined,
        fieldCnname: undefined,
        fieldDit: undefined,
        fieldEnname: undefined,
        fieldFormType: undefined,
        fieldLength: undefined,
        fieldMappingName: undefined,
        fieldRemark: undefined,
        fieldSort: undefined,
        fieldType: undefined,
        isList: undefined,
        isQuery: undefined,
        isRead: undefined,
        isRequire: 0,
        isShow: 0,
        typeCode: undefined
      };
      this.resetForm('form');
    },
    // 选择数据类型
    changeAttribute() {
      this.$set(this.form, 'defaultValue', undefined);
    },
    // 0转为true, 1转为false
    praseNumToBoolean(num) {
      if (num === 0) return true;
      if (num === 1) return false;
      return num;
    },
    // false转为1, true转为0
    praseBooleanToNum(boolean) {
      if (!boolean) return 1;
      if (boolean) return 0;
      return boolean;
    }
  }
};
</script>
